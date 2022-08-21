// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { MongoClient, ServerApiVersion } from "mongodb";
import seedData from "../../../../testdata/word_count.json";
import { connectToDatabase } from "../../../../util/mongodb";

type Data = {
  name: string;
};

const DEPLOYMENT_ENV = process.env.NEXT_DEPLOYMENT_ENVIRONMENT || "production";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (DEPLOYMENT_ENV == "local") {
    try {
      res.status(200).json(seedData);
    } catch (error) {
      console.log("Error fetching seed profile data", error);
      res.status(500).end(error);
    }
    return;
  }

  try {
    const { db } = await connectToDatabase();

    // Order by desc and last 10 days
    const wordCount = await db
      .collection("word_count")
      .find()
      .sort({ weight: -1 })
      .limit(10)
      .toArray()
      .catch(() => {
        console.error("Error getting number of casts from MongoDB");
        // client.close();
        return null;
      });

    if (!wordCount) {
      return { props: { response: "" } };
    }

    const cleanWC = [];
    for (let eachWord of wordCount) {
      cleanWC.push({ word: eachWord.word });
    }

    // client.close();
    res.status(200).json(cleanWC);
  } catch (error) {
    // client.close();
    console.log(error);
    return res.status(500).end(error);
  }
}
