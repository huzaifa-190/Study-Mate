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

  // 📌 Extract unique tags
  const tags = Array.from(new Set(tasks.map((task: Task) => task.tag)));

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
    xaxis: {
      categories: tags, // this will update dynamically
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
      tickAmount: 5, // or auto — adjust if needed
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
    const pendingCounts = tags.map((tag) =>
      tasks.filter((task: Task) => task.tag === tag && !task.completed).length
    );

    const completedCounts = tags.map((tag) =>
      tasks.filter((task: Task) => task.tag === tag && task.completed).length
    );

    const tagColors = tags.map((tag) => {
      const t = (tasks as Task[]).find((task: Task) => task.tag === tag);
      return t ? t.tagColor : '#999';
    });

    setSeries([
      { name: 'Pending', data: pendingCounts },
      { name: 'Completed', data: completedCounts },
    ]);

    // Update categories and colors dynamically
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: { categories: tags },
      colors: ['#F97316', '#22C55E'] // Pending first, Completed second
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
