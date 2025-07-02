import React from 'react';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChartThree from '../../components/Charts/ChartThree';

const ECommerce: React.FC = () => {
  return (
    
      <div className="grid w-screen xl:w-[80%] grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2  ">
        <ChartTwo />
        <ChartThree />
      </div>

    
  );
};

export default ECommerce;
