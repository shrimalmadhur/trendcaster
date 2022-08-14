import { FC, useContext, useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import styles from '@/styles/Home.module.css';
import axios from "axios";
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
        text: 'Farcaster Casts Counts (Updated every 24 hrs)',
      },
    },
  };

interface Props {
    response: any
}

const defaultData = {
    labels: [],
    datasets: [
        {
            label: "Casts",
            data: [],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
    ],
};
  
const CastCountChart: FC<Props> = ({ response }) => {
    const [data, setData] = useState(defaultData)
    useEffect(() => {
        axios.get("api/v1/castcount").then((response) => {
            setData(response.data)
        })
    }, [])

    return (
        <div>
            <Line options={options} data={data} />
        </div>
    );
};

export default CastCountChart