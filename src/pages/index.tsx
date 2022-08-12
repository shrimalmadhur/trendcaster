import { FC, useContext } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/Home.module.css';
import Trends from 'components/Trends';

const Home: FC = () => {
  return (
    <div className={styles.container}>
      <Trends></Trends>
    </div>
  );
};

// export default Home
export default dynamic(() => Promise.resolve(Home), { ssr: false });
