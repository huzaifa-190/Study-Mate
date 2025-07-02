import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useToDoContext } from '../../contexts/ToDoContext.js';

// 📌 Task type
interface Task {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  completed: boolean;
}

const ChartThree: React.FC = () => {
  const { tasks } = useToDoContext();

  // 📌 State for chart data
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  // 📌 Chart options
  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
      height: 350, // ← keep height consistent
    },
    colors: colors, // dynamically from tags
    labels: labels, // dynamically from tags
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: true,
    },
  };

  // 📌 Compute live chart data when tasks change
  useEffect(() => {
    // Get unique tags
    const tagSet = Array.from(new Set(tasks.map((task: Task) => task.tag)));

    // Count tasks per tag
    const taskCounts = tagSet.map(
      (tag) => tasks.filter((task: Task) => task.tag === tag).length
    );

    // Extract tag colors
    const tagColors = tagSet.map((tag) => {
  const t = [...tasks].reverse().find((task: Task) => task.tag === tag);
  console.log('Tag:', tag, 'Color:', t ? t.tagColor : '#999');
  return t ? t.tagColor : '#999';
});


    setLabels(tagSet);
    setSeries(taskCounts);
    setColors(tagColors);
  }, [tasks]);

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 flex justify-between gap-4">
        <h5 className="text-xl font-semibold text-black dark:text-white">
          Tasks Distribution
        </h5>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={350}
            
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center   gap-y-3">
        {labels.map((label, idx) => (
          <div key={idx} className="sm:w-1/2 w-full px-8">
            <div className="flex w-full  gap-5 ">
              <span
                className="mr-2 block h-3 w-full max-w-3 rounded-full"
                style={{ backgroundColor: colors[idx] }}
              ></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{label}</span>
                <span>
                  {series[idx]
                    ? `${Math.round((series[idx] / series.reduce((a, b) => a + b, 0)) * 100)}%`
                    : '0%'}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartThree;
