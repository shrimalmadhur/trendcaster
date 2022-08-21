// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { MongoClient, ServerApiVersion } from "mongodb";
import seedData from "../../../../testdata/profile_count.json";
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
    const profileCounts = await db
      .collection("profiles_count")
      .find()
      .sort({ time: -1 })
      .limit(10)
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
    for (let eachCount of profileCounts.reverse()) {
      labels.push(new Date(eachCount.time).toLocaleString());
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
    // client.close();
    res.status(200).json(data);
  } catch (error) {
    // client.close();
    console.log(error);
    return res.status(500).end(error);
  }
}
