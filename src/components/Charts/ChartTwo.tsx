import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

import { useToDoContext } from '../../contexts/ToDoContext.js';

// 📌 Type for each task
interface Task {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  completed: boolean;
}

// 📌 Series type
interface ChartSeries {
  name: string;
  data: number[];
}

const ChartTwo: React.FC = () => {
  const { tasks } = useToDoContext();

  // 📌 Series state
  const [series, setSeries] = useState<ChartSeries[]>([]);

  // 📌 Chart options
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '35%',
        endingShape: 'rounded',
      },
    },
    dataLabels: { enabled: true },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    noData: {
      text: 'No tasks to display',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: '#999',
        fontSize: '16px',
      },
    },
    xaxis: {
      categories: [], // will update dynamically
      labels: {
        formatter: (val) => val.toUpperCase(),
      },
    },
    yaxis: {
      title: { text: 'Tasks Count' },
      labels: {
        formatter: (val) => Math.round(val).toString(),
      },
      forceNiceScale: true,
      tickAmount: 5,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      markers: { radius: 99 },
    },
    fill: { opacity: 1 },
  });

  // 📌 Update chart when tasks change
  useEffect(() => {
    const activeTags =
      tasks.length > 0
        ? Array.from(new Set(tasks.map((task: Task) => task.tag)))
        : ['No Tasks'];

    const pendingCounts = activeTags.map((tag) =>
      tasks.filter((task: Task) => task.tag === tag && !task.completed).length
    );

    const completedCounts = activeTags.map((tag) =>
      tasks.filter((task: Task) => task.tag === tag && task.completed).length
    );

    setSeries([
      { name: 'Pending', data: pendingCounts },
      { name: 'Completed', data: completedCounts },
    ]);

    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: { ...prevOptions.xaxis, categories: activeTags },
      colors: ['#F97316', '#22C55E'],
    }));
  }, [tasks]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Tasks by Subject
        </h4>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
