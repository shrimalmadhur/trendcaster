
// Indexer code inspired by - https://github.com/gskril/farcaster-indexer
require('dotenv').config()
const got = require('got')
const cron = require('node-cron')
const { providers, Contract, utils } = require('ethers')
const { MongoClient, ServerApiVersion } = require('mongodb')
const { removeStopwords } = require('stopword')
const { keys } = require('./registry-abi.js')

const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
})

client.connect((err) => {
    if (err) {
        console.error(err)
        return
    }
})

const provider = new providers.AlchemyProvider(
    'rinkeby',
    process.env.ALCHEMY_SECRET
)

const registryContract = new Contract(
    '0xe3Be01D99bAa8dB9905b33a3cA391238234B79D1',
    require('./registry-abi.js'),
    provider
)

async function getAllCasts(db) {
    const allCasts = []
    let profilesIndexed = 0
    const profiles = await db
        .collection('profiles')
        // .find({"merkleRoot": "0x17cc2df1a869ed2031cb0466debe6855088366792dc637c2a33622b95660138c"})
        .find({})
        // .limit(10)
        .toArray()
        .catch(() => {
            console.error('Error getting number of profiles from MongoDB')
            return null
        })

    if (!profiles) 
        return

    console.log(`Indexing casts from ${profiles.length} profiles...`)

    for (let i = 0; i < profiles.length; i++) {
        const profile = profiles[i]
        const name = profile.body.displayName

        const activity = await got(profile.body.addressActivityUrl)
            .json()
            .catch(() => {
                console.log(`Could not get activity for ${name}`)
                return null
            })

        if (!activity) continue
        allCasts.push(...activity)
        profilesIndexed++
    }
    return [allCasts, profilesIndexed];
}

async function indexAllCasts(db, allCasts) {
    const oldConnection = db.collection('casts')
    const newCollection = db.collection('casts_temp')

    // If the temp table already exists, drop it
    try {
        await newCollection.drop()
    } catch {}

    // Avoid indexing duplicate casts
    await newCollection.createIndex({ merkleRoot: 1 }, { unique: true })

    
    await newCollection.insertMany(allCasts).catch((err) => {
        console.log(`Error saving casts to MongoDB.`, err.message)
    })

    // Replace existing collection with new casts
    try {
        await oldConnection.drop()
    } catch (err) {
        console.log('Error dropping collection.', err.codeName)
    }
    await newCollection.rename('casts')
}

async function getWordCountData(allCasts) {
    const date = Date.now() - 24*60*60*1000

    //  /(\w+)caster\W*/gm

    // Index casts count
    // allCasts

    const bots = ["perl"]
    
    const re = /\s+/;
    const filteredCast = allCasts
        .filter(cast => cast.body.publishedAt > date)
        .filter(cast => !bots.includes(cast.body.username))
        .filter(cast => !cast.body.data.text.startsWith("recast:farcaster://"))
        .filter(cast => !cast.body.data.text.startsWith("delete:farcaster://"))
        .map(cast => removeStopwords(cast.body.data.text.split(re)))

    console.log(`last 24 hrs filtered casts count is ${filteredCast.length}`);

    // const re = /\s+/;
    const wordMap = {};
    const wordCount = []
    const wordsToIgnore = ["-"]
    for (const castArr of filteredCast) {
        // console.log(castArr)
        for (let word of castArr) {
            // console.log(word)
            word = word.toLowerCase()
            // TODO: remove only punctuations
            // TODO: remove punctuations from start and end
            if (word.startsWith("@") 
                || word.includes("https://") 
                || word.includes("http://") 
                || word.includes("farcaster://casts")
                || !isNaN(word) 
                || wordsToIgnore.includes(word)) {
                continue;
            }
            // console.log(wordMap[word])
            if (!wordMap[word]) {
                wordMap[word] = 0
                // console.log(wordMap[word])
            }
            wordMap[word] = wordMap[word] + 1;
        }
    }

    // console.log(wordMap)

    // remove small counts 
    const removeCount = Array.from({length: 50}, (_, i) => i + 1);
    for(let word in wordMap) {
        const count = wordMap[word]
        const weight = getWordWeight(word, count)
        if (removeCount.includes(weight)){
            continue;
        }
        wordCount.push({word: word, count: count, weight: weight});
    }

    return wordCount;
}

async function saveCastCount(db, size) {
    const countData = {
        count: size,
        time: Date.now()
    }
    const castsCountCollection = db.collection('casts_count');
    await castsCountCollection
        .insertOne(countData)
        .then(() => console.log("casts count data inserted"))
        .catch((err) => {
            console.log(`Error saving cast count data ${err.message}`)
        });
}

async function saveWordCountData(db, wordCount) {
    const oldWC = db.collection('word_count')
    const newWC= db.collection('word_count_temp')

    // If the temp table already exists, drop it
    try {
        await newWC.drop()
    } catch {}

    await newWC.createIndex({ count: 1 })

    await newWC.insertMany(wordCount).catch((err) => {
        console.log(`Error saving word count to MongoDB.`, err.message)
    })

    // Replace existing collection with new casts
    try {
        await oldWC.drop()
    } catch (err) {
        console.log('Error dropping collection.', err.codeName)
    }
    await newWC.rename('word_count')

    // console.log(wordCount)

}

async function indexCasts() {
    const startTime = Date.now();
    const db = client.db('farcaster');

    const returnArray = await getAllCasts(db);
    const allCasts = returnArray[0];
    const profilesIndexed = returnArray[1];
    if (!allCasts) {
        return;
    }
    
    await indexAllCasts(db, allCasts);

    await indexPersonalData(db, allCasts);

    await saveCastCount(db, allCasts.length);

    const wordCount = await getWordCountData(allCasts);
    await saveWordCountData(db, wordCount)
    
    const endTime = Date.now();
    const secondsTaken = (endTime - startTime) / 1000;

    console.log(
        `Saved ${allCasts.length} casts from ${profilesIndexed} profiles in ${secondsTaken} seconds`
    )
    console.log('done')
}

async function indexPersonalData(db, allCasts) {
    const oldConnection = db.collection('profile_details')
    const newCollection = db.collection('profile_details_temp')

    // If the temp table already exists, drop it
    try {
        await newCollection.drop();
    } catch {}

    // Avoid indexing duplicate casts
    await newCollection.createIndex({ farcasterAddress: 1 }, { unique: true })
    await newCollection.createIndex({ username: 1 })

    const personalDB =  allCasts.reduce((result, cast) => {
        const castText = cast.body.data.text;
        const currentCastDate = cast.body.publishedAt;
        if (result[cast.body.address]) {
            if (castText.startsWith("delete:farcaster://")){
                result[cast.body.address].deletedCastCount += 1
            } else if (castText.startsWith("recast:farcaster://")) {
                result[cast.body.address].recastCount += 1
            } else {
                result[cast.body.address].count += 1
            }

            // get first cast
            if (result[cast.body.address].firstCastDate > currentCastDate) {
                result[cast.body.address].firstCastDate = currentCastDate;
            }
        } else {
            // you cannot have deleted cast as your first cast to skipping the delete scenario
            if (castText.startsWith("recast:farcaster://")) {
                result[cast.body.address] = {
                    count: 0,
                    recastCount: 1,
                    deletedCastCount: 0,
                    username: cast.body.username,
                    firstCastDate: currentCastDate
                }
            } else {
                result[cast.body.address] = {
                    count: 1,
                    recastCount: 0,
                    deletedCastCount: 0,
                    username: cast.body.username,
                    firstCastDate: currentCastDate
                }
            }  
        }
        return result;
    }, {})
    const result = []

    for (let key in personalDB) {
        result.push({
            farcasterAddress: key,
            castCount: personalDB[key].count - personalDB[key].deletedCastCount, // deleted cast are also stored
            recastCount: personalDB[key].recastCount,
            deletedCastCount: personalDB[key].deletedCastCount,
            username: personalDB[key].username,
            firstCastDate: personalDB[key].firstCastDate
        })
    }

    // console.log(result);

    await newCollection.insertMany(result).catch((err) => {
        console.log(`Error saving casts to MongoDB.`, err.message)
    })

    // Replace existing collection with new casts
    try {
        await oldConnection.drop()
    } catch (err) {
        console.log('Error dropping collection.', err.codeName)
    }
    await newCollection.rename('profile_details')
}

function getWordWeight(word, count) {
    // word weight is very simple - larger the length, more the weight
    // eventually it can be more smart
    return count * word.length;
}

async function indexProfiles() {
    const startTime = Date.now()
    const db = client.db('farcaster')
    const oldConnection = db.collection('profiles')
    const newCollection = db.collection('profiles_temp')

    // If the temp table already exists, drop it
    try {
        await newCollection.drop()
    } catch {}

    // Avoid indexing duplicate profiles
    await newCollection.createIndex({ merkleRoot: 1 }, { unique: true })

    let profilesIndexed = 0
    const numberOfProfiles = await registryContract
        .usernamesLength()
        .catch(() => {
            console.error('Error getting number of profiles from contract')
            return 0
        })

    if (numberOfProfiles === 0) return
    console.log(`Indexing ${numberOfProfiles} profiles...`)

    for (let i = 0; i < numberOfProfiles; i++) {
        const byte32Name = await registryContract
            .usernameAtIndex(i)
            .catch(() => {
                console.log(`Could not get username at index ${i}`)
                return null
            })

        if (!byte32Name) continue

        const username = utils.parseBytes32String(byte32Name)

        // Skip test accounts
        if (username.startsWith('__tt_')) continue

        // Get directory URL from contract
        const directoryUrl = await registryContract
            .getDirectoryUrl(byte32Name)
            .catch(() => {
                console.log(`Could not get directory url for ${username}`)
                return null
            })

        if (!directoryUrl || directoryUrl.includes('localhost')) continue

        // Get directory JSON from URL
        const directory = await got(directoryUrl)
            .json()
            .then((res) => {
                res.index = i
                res.username = username
                return res
            })
            .catch(() => {
                console.log(`Error getting directory for @${username}`)
                return null
            })

        if (!directory) continue

        // Add connected address to directory object
        directory.connectedAddress = await got(directory.body.proofUrl)
            .json()
            .then((res) => res.signerAddress)
            .catch(() => null)

        // Save directories to MongoDB
        await newCollection
            .insertOne(directory)
            .then(() => profilesIndexed++)
            .catch((err) => {
                console.log(
                    `Error saving directory for @${username} ${
                        err.message.includes('dup key') &&
                        '(duplicate cast found)'
                    }`
                )
            })
    }

    // Replace existing collection with new one
    try {
        await oldConnection.drop()
    } catch (err) {
        console.log('Error dropping collection.', err.codeName)
    }
    await newCollection.rename('profiles')

    const countData = {
        count: profilesIndexed,
        time: Date.now()
    }
    const profileCountCollection = db.collection('profiles_count');
    await profileCountCollection
        .insertOne(countData)
        .then(() => console.log("profile count data inserted"))
        .catch((err) => {
            console.log(`Error saving count data ${err.message}`)
        })
    

    const endTime = Date.now()
    const secondsTaken = (endTime - startTime) / 1000
    console.log(
        `Indexed ${profilesIndexed} directories in ${secondsTaken} seconds`
    )
}


async function main() {
    await indexProfiles()

    await indexCasts()
}

main()
// indexProfiles()

// indexCasts()

// Run job every day at 8pm
// cron.schedule('0 20 * * *', () => {
//     main()
// });


// // Run job 30 mins
// cron.schedule('*/30 * * * *', () => {
//     indexCasts()
// })