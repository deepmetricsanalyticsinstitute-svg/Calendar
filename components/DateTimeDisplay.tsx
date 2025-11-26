
import React from 'react';
import { formatDate, formatTime } from '../utils/dateUtils';

interface DateTimeDisplayProps {
  currentDate: Date;
}

const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({ currentDate }) => {
  return (
    <div className="text-center bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-400 mb-2">
        {formatTime(currentDate)}
      </h2>
      <p className="text-xl sm:text-2xl text-gray-300">
        {formatDate(currentDate)}
      </p>
    </div>
  );
};

export default DateTimeDisplay;
