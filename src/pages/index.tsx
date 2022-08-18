import { FC, useContext } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/Home.module.css";
import Trends from "components/Trends";
import axios from "axios";
import { MongoClient, ServerApiVersion } from "mongodb";
import ProfileDetails from "components/ProfileDetails";

interface Props {
  response: any;
}
const Home: FC<Props> = ({ response }) => {
  return (
    <div className="grid grid-cols-1">
      <ProfileDetails></ProfileDetails>
      <Trends data={response}></Trends>
    </div>
  );
};

// export default Home
export default dynamic(() => Promise.resolve(Home), { ssr: false });
