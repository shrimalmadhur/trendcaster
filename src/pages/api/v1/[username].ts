// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { MongoClient, ServerApiVersion } from "mongodb";
import seedData from "../../../../testdata/profile_details.json";
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

  const username = req.query.username;
  // const mongodbURL = process.env.NEXT_MONGODB_URI;
  // if (!mongodbURL) {
  //   return { props: { response: "" } };
  // }
  // const client = new MongoClient(mongodbURL, {
  //   serverApi: ServerApiVersion.v1,
  // });

  // client.connect((err) => {
  //   if (err) {
  //     console.error(err);
  //     return { props: { response: "" } };
  //   }
  // });
  try {
    // const db = client.db("farcaster");

    const { db } = await connectToDatabase();

    // Order by desc and last 10 days
    const castsCount = await db
      .collection("profile_details")
      .find({ username: username })
      .toArray()
      .catch(() => {
        console.error("Error getting number of casts from MongoDB");
        return null;
      });

    if (!castsCount) {
      return { props: { response: "" } };
    }

    const response = {
      username: username,
      count: castsCount[0].castCount,
      farcasterAddress: castsCount[0].farcasterAddress,
      recastCount: castsCount[0].recastCount,
      firstCastCounnt: new Date(
        castsCount[0].firstCasteDate
      ).toLocaleTimeString(),
    };

    // client.close();
    res.status(200).json(response);
  } catch (error) {
    // client.close();
    console.log(error);
    return res.status(500).end(error);
  }
}
