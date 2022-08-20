import { FC, useContext, useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import styles from '@/styles/Home.module.css';
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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
            text: 'Daily Cast Count - 30 days (Updated every 24 hrs)',
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
            borderColor: "rgb(67, 230, 110)",
            backgroundColor: "rgba(67, 230, 110, 0.5)",
        },
    ],
};

const CastCountMonthChart: FC<Props> = ({ response }) => {
    const [data, setData] = useState(defaultData)
    useEffect(() => {
        axios.get("api/v1/castsmonth").then((response) => {
            setData(response.data)
        })
    }, [])

    return (
        <div>
            <Bar options={options} data={data} />;
        </div>
    );
};

export default CastCountMonthChart