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
        text: 'Chart.js Line Chart',
      },
    },
  };


const labels = ['January', 'February', 'March'];

export const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [1, 2, 4, 6],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [5, 6, 7, 8],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
};

interface Props {
    response: any
}
  


const ProfileCountChart: FC<Props> = ({ response }) => {
    console.log(response)
    const chartRef = useRef(null);

    return (
        <div className={styles.container}>
            <Line width={500} height={200} options={options} data={data} />
        {/* <Line
            ref={chartRef}
            datasetIdKey='id'
            data={{
                labels: ['Jun', 'Jul', 'Aug'],
                datasets: [
                {
                    id: 1,
                    label: '',
                    data: [5, 6, 7],
                },
                {
                    id: 2,
                    label: '',
                    data: [3, 2, 1],
                },
                ],
            }}
            redraw={true}
        /> */}
        </div>
    );
};


// It doens't work in components
// move to pages
export async function getServerSideProps() {
    // Fetch data from external API
    console.log("broooooo")
    const res = await fetch(`https://www.google.com`)
    const data = await res.json()

    console.log(process.env.NEXT_MONGODB_URI)
    // Pass data to the page via props
    return { props: { response: data } }
  }

export default ProfileCountChart
