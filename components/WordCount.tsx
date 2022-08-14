import { FC, useContext, useEffect, useRef, useState } from 'react';
import axios from "axios";

const WordCount: FC = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        axios.get("api/v1/wordcount").then((response) => {
            setData(response.data)
        })
    }, [])
    return (
        <div>
            <h3>[Coming soon]Top trending words last 24 hrs (Updated every 24 hrs)</h3>
            <table className='w-full border-collapse border border-slate-500'>
                <thead>
                    <tr>
                        <th className='w-1/2 text-center border border-slate-600 bg-slate-50 dark:bg-slate-700'>Word</th>
                        <th className='w-1/2 text-center border border-slate-600 bg-slate-50 dark:bg-slate-700'>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(function(entry:any, index){
                        return <tr key={index}>
                            <td className='w-1/2 text-center border border-slate-700'>{entry.word}</td>
                            <td className='w-1/2 text-center border border-slate-700'>{entry.count}</td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default WordCount;