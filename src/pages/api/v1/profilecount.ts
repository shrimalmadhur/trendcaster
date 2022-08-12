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
  

  try {
    const address = req.query.address;
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
    const db = client.db("farcaster");

    // Order by desc and last 10 days
    const profileCounts = await db
        .collection("profiles_count")
        .find({})
        .toArray()
        .catch(() => {
        console.error("Error getting number of profiles from MongoDB");
        return null;
        });

    if (!profileCounts) {
        return { props: { response: "" } };
    }

    const labels = [];
    const countArray = [];
    for (let eachCount of profileCounts) {
        labels.push(new Date(eachCount.time).toLocaleDateString("eb-US"));
        countArray.push(eachCount.count);
    }
    const data = {
        labels,
        datasets: [
            {
                label: "Profiles",
                data: countArray,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };
    // console.log(result)
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).end(error);
  }
}