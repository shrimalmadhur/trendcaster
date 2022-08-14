import { FC, useContext, useRef } from 'react';
import styles from '@/styles/Home.module.css';
import ProfileCountChart from './ProfileCountChart';
import CastCountChart from './CastCountChart';
import WordCount from './WordCount';

interface Props {
    data: any
}

const Trends: FC<Props> = ( {data}) => {
    const chartRef = useRef(null);
    return (
        <div className="grid grid-cols-2 gap-4">
            <ProfileCountChart response={data}></ProfileCountChart>
            <CastCountChart response={data}></CastCountChart>
            <WordCount></WordCount>
        </div>
    );
};

export default Trends
