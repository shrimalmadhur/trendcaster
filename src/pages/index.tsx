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
      <hr className="my-6 border-white-200 sm:mx-auto dark:border-white-700 lg:my-8" />
      <footer className="m-4 p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 <a href="https://trendcaster.com/" className="hover:underline">Madhur Shrimal</a>. All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
                <a href="https://github.com/shrimalmadhur/trendcaster" className="hover:underline text-base">Github</a>
            </li>
        </ul>
    </footer>
    </div>
  );
};

// export default Home
export default dynamic(() => Promise.resolve(Home), { ssr: false });
