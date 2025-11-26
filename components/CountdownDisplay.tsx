
import React from 'react';
import { getDaysRemainingInMonth, getDaysRemainingInYear } from '../utils/dateUtils';

interface CountdownDisplayProps {
  currentDate: Date;
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ currentDate }) => {
  const daysInMonth = getDaysRemainingInMonth(currentDate);
  const daysInYear = getDaysRemainingInYear(currentDate);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col sm:flex-row justify-around items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="text-center">
        <p className="text-5xl sm:text-6xl font-extrabold text-green-400 mb-1 leading-none">{daysInMonth}</p>
        <p className="text-lg text-gray-300">Days Left This Month</p>
      </div>
      <div className="text-center">
        <p className="text-5xl sm:text-6xl font-extrabold text-purple-400 mb-1 leading-none">{daysInYear}</p>
        <p className="text-lg text-gray-300">Days Left This Year</p>
      </div>
    </div>
  );
};

export default CountdownDisplay;
