import { FC, useContext, useRef } from 'react';
import styles from '@/styles/Home.module.css';
import ProfileCountChart from './ProfileCountChart';


const Trends: FC = () => {
    const chartRef = useRef(null);
    return (
        <div className={styles.container}>
            <ProfileCountChart></ProfileCountChart>
        </div>
    );
};

export default Trends
