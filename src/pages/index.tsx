import { FC, useContext } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/Home.module.css";
import Trends from "components/Trends";
import axios from "axios";
import { MongoClient, ServerApiVersion } from "mongodb";

interface Props {
  response: any;
}
const Home: FC<Props> = ({ response }) => {
  return (
    <div className={styles.container}>
      <Trends data={response}></Trends>
    </div>
  );
};

export async function getServerSideProps() {
  // Fetch data from external API
  console.log("broooooo");
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
  // const db = client.db("farcaster");

  // // Order by desc and last 10 days
  // const profileCounts = await db
  //   .collection("profiles_count")
  //   .find({})
  //   .toArray()
  //   .catch(() => {
  //     console.error("Error getting number of profiles from MongoDB");
  //     return null;
  //   });

  // if (!profileCounts) {
  //   return { props: { response: "" } };
  // }
  const labels = ["A", "B", "C"];
  const countArray = [1, 2, 3];
  // for (let eachCount of profileCounts) {
  //   labels.push(new Date(eachCount.time).toLocaleDateString("eb-US"));
  //   countArray.push(eachCount.count);
  // }
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
  // console.log(data)
  // Pass data to the page via props
  return { props: { response: data } };
}

// export default Home
export default dynamic(() => Promise.resolve(Home), { ssr: false });
