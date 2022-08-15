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
    const castsCount = await db
        .collection("casts_count")
        .find()
        .sort({time: -1})
        .limit(10)
        .toArray()
        .catch(() => {
            console.error("Error getting number of casts from MongoDB");
            return null;
        });

    if (!castsCount) {
        return { props: { response: "" } };
    }

    const labels = [];
    const countArray = [];
    for (let eachCount of castsCount.reverse()) {
        labels.push(new Date(eachCount.time).toLocaleDateString("eb-US"));
        countArray.push(eachCount.count);
    }
    const data = {
        labels,
        datasets: [
            {
                label: "Casts",
                data: countArray,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };
    client.close()
    res.status(200).json(data);
  } catch (error) {
    client.close()
    console.log(error);
    return res.status(500).end(error);
  }
}