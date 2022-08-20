import { MongoClient, ServerApiVersion } from 'mongodb'

let uri = process.env.NEXT_MONGODB_URI
let dbName = process.env.NEXT_MONGO_DB_DATABASE

let cachedClient = null
let cachedDb = null

if (!uri) {
  throw new Error(
    'Please define the NEXT_MONGODB_URI environment variable inside .env.local'
  )
}

if (!dbName) {
  throw new Error(
    'Please define the NEXT_MONGO_DB_DATABASE environment variable inside .env.local'
  )
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
  })

  const db = await client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}