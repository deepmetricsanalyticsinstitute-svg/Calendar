import React, { useMemo, useState } from 'react';
import { MOTIVATIONAL_QUOTES } from '../constants';
import { getDayOfYear } from '../utils/dateUtils';

interface MotivationalQuoteProps {
  currentDate: Date;
}

const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({ currentDate }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger manual refresh

  const dailyQuote = useMemo(() => {
    // Select a quote based on the day of the year to ensure it changes daily
    const dayIndex = getDayOfYear(currentDate);
    // Incorporate refreshTrigger to get a new quote on manual refresh
    const quoteIndex = (dayIndex + refreshTrigger) % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[quoteIndex];
  }, [currentDate, refreshTrigger]); // Add refreshTrigger to dependencies

  const handleRefreshClick = () => {
    setRefreshTrigger(prev => prev + 1); // Increment trigger to get a new quote
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center flex flex-col justify-center min-h-[180px]"> {/* Increased min-height for button */}
      <p className="text-xl sm:text-2xl italic text-gray-200 leading-relaxed mb-4">
        "{dailyQuote}"
      </p>
      <p className="text-md text-gray-400">
        &mdash; Daily Motivation &mdash;
      </p>
      <button
        onClick={handleRefreshClick}
        className="mt-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 self-center"
        aria-label="Get a new motivational quote"
      >
        New Quote
      </button>
    </div>
  );
};

export default MotivationalQuote;