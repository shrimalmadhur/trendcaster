// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { MongoClient, ServerApiVersion } from "mongodb";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  

    const mongodbURL = process.env.NEXT_MONGODB_URI;
    if (!mongodbURL) {
        return { props: { response: "" } };
    }
    const client = new MongoClient(mongodbURL, {
        serverApi: ServerApiVersion.v1,
    });

    client.connect((err) => {
        if (err) {
            console.error(err);
            return { props: { response: "" } };
        }
    });
  try {

    const db = client.db("farcaster");

    // Order by desc and last 10 days
    const wordCount = await db
        .collection("word_count")
        .find()
        .sort({weight: -1})
        .limit(10)
        .toArray()
        .catch(() => {
            console.error("Error getting number of casts from MongoDB");
            client.close()
            return null;
        });

    if (!wordCount) {
        return { props: { response: "" } };
    }

    const cleanWC = []
    for (let eachWord of wordCount) {
        cleanWC.push({word: eachWord.word})
    }


    client.close()
    res.status(200).json(cleanWC);
  } catch (error) {
    client.close()
    console.log(error);
    return res.status(500).end(error);
  }
}