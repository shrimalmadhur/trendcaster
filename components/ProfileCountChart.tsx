import { FC, useContext, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import styles from '@/styles/Home.module.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Farcaster Profile Counts (Updated every 24 hrs)',
      },
    },
  };

interface Props {
    response: any
}
  
const ProfileCountChart: FC<Props> = ({ response }) => {
    // console.log(response)

    return (
        <div className={styles.container}>
            <Line width={500} height={200} options={options} data={response} />
        </div>
    );
};

export default ProfileCountChart