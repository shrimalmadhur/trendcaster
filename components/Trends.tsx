import { FC, useContext, useRef } from 'react';
import styles from '@/styles/Home.module.css';
import ProfileCountChart from './ProfileCountChart';

interface Props {
    data: any
}

const Trends: FC<Props> = ( {data}) => {
    const chartRef = useRef(null);
    return (
        <div className={styles.container}>
            <ProfileCountChart response={data}></ProfileCountChart>
        </div>
    );
};

export default Trends
