import { FC, useContext, useRef } from 'react';
import styles from '@/styles/Home.module.css';
import ProfileCountChart from './ProfileCountChart';
import CastCountChart from './CastCountChart';
import WordCount from './WordCount';
import CastCountMonthChart from './CastCountMonthChart'

interface Props {
    data: any
}

const Trends: FC<Props> = ({ data }) => {
    const chartRef = useRef(null);
    return (
        <div className='flex flex-col p-4 border-gray-50 border-2 rounded-md ml-4 mr-4'>
            <div className="flex flex-col mx-auto text-2xl">General Trends</div>
            <div className="flex flex-col mx-auto">Works best with Desktop browsers (mobile improvements coming soon)</div>
            <div className="grid grid-cols-2 gap-4">
                <ProfileCountChart response={data}></ProfileCountChart>
                <CastCountChart response={data}></CastCountChart>
                <WordCount></WordCount>
                <CastCountMonthChart response={data}></CastCountMonthChart>
            </div>
        </div>

    );
};

export default Trends
