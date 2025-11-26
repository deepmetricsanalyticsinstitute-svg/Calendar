import React, { useState } from 'react';
import { formatDate } from '../utils/dateUtils';

interface DayDetailModalProps {
  selectedDate: Date;
  onAddReminder: (date: Date, text: string) => void;
  dailyDistance: number; // Current distance for the selected day
  onAddOrUpdateDailyDistance: (date: Date, distance: number) => void;
  onDeleteDailyDistance: (date: Date) => void;
  onClose: () => void;
}

const EXCHANGE_RATES: { [key: string]: { [key: string]: number } } = {
  USD: { EUR: 0.93, GBP: 0.79, JPY: 156.90, CAD: 1.37, USD: 1 },
  EUR: { USD: 1.07, GBP: 0.85, JPY: 168.45, CAD: 1.47, EUR: 1 },
  GBP: { USD: 1.27, EUR: 1.18, JPY: 198.05, CAD: 1.73, GBP: 1 },
  JPY: { USD: 0.0064, EUR: 0.0059, GBP: 0.0050, CAD: 0.0087, JPY: 1 },
  CAD: { USD: 0.73, EUR: 0.68, GBP: 0.58, JPY: 114.70, CAD: 1 },
};
const CURRENCIES = Object.keys(EXCHANGE_RATES);

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  selectedDate,
  onAddReminder,
  dailyDistance,
  onAddOrUpdateDailyDistance,
  onDeleteDailyDistance,
  onClose,
}) => {
  const [reminderText, setReminderText] = useState('');
  const [distanceInput, setDistanceInput] = useState<number>(dailyDistance);
  const [showDistanceSuccessFeedback, setShowDistanceSuccessFeedback] = useState<string | null>(null); // State for distance feedback

  // Currency Converter States
  const [currencyAmount, setCurrencyAmount] = useState<number | string>('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedResult, setConvertedResult] = useState<string | null>(null);
  const [currencyError, setCurrencyError] = useState<string | null>(null);

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (reminderText.trim()) {
      onAddReminder(selectedDate, reminderText);
      setReminderText('');
    }
  };

  const showFeedback = (message: string, isSuccess: boolean) => {
    setShowDistanceSuccessFeedback(message);
    setTimeout(() => {
      setShowDistanceSuccessFeedback(null);
    }, 2500); // Hide feedback after 2.5 seconds
  };

  const handleDistanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (distanceInput >= 0) {
      onAddOrUpdateDailyDistance(selectedDate, distanceInput);
      showFeedback('Distance Saved!', true);
    }
  };

  const handleClearDistance = () => {
    onDeleteDailyDistance(selectedDate);
    setDistanceInput(0); // Reset input after clearing
    showFeedback('Distance Cleared!', true);
  };

  const handleConvertCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    setConvertedResult(null);
    setCurrencyError(null);

    const amountNum = parseFloat(currencyAmount as string);

    if (isNaN(amountNum) || amountNum <= 0) {
      setCurrencyError('Please enter a valid positive amount.');
      return;
    }

    if (fromCurrency === toCurrency) {
      setConvertedResult(`${amountNum.toFixed(2)} ${toCurrency}`);
      return;
    }

    const rateFromBase = EXCHANGE_RATES[fromCurrency]?.[toCurrency];

    if (rateFromBase) {
      const result = amountNum * rateFromBase;
      setConvertedResult(`${result.toFixed(2)} ${toCurrency}`);
    } else {
      setCurrencyError('Conversion rate not available for selected currencies.');
    }
  };

  return (
    <div 
      className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700 relative" /* Added relative for absolute positioning of close button */
      // Prevent clicks inside the modal from bubbling up to the overlay
      onClick={(e) => e.stopPropagation()} 
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-2"
        aria-label="Close modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h3 id="day-detail-modal-title" className="text-2xl font-bold text-white mb-6">
        Interactions for <span className="text-indigo-400">{formatDate(selectedDate)}</span>
      </h3>

      {/* Reminder Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold text-gray-100 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Add New Reminder
        </h4>
        <form onSubmit={handleAddReminder} className="flex flex-col space-y-3">
          <textarea
            className="w-full p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20"
            placeholder="What's the reminder about?"
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
          >
            Add Reminder
          </button>
        </form>
      </div>

      {/* Daily Distance Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold text-gray-100 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm3-11v8m4-4v4m4-8v4" />
          </svg>
          Log Daily Distance (km)
        </h4>
        <form onSubmit={handleDistanceSubmit} className="flex flex-col space-y-3">
          <input
            type="number"
            className="w-full p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., 5.3"
            step="0.1"
            min="0"
            value={distanceInput === 0 && dailyDistance === 0 ? '' : distanceInput} // Clear input if both are 0
            onChange={(e) => setDistanceInput(parseFloat(e.target.value))}
          />
          <p className="text-sm text-gray-400 mt-2">
            Current logged distance: <span className="font-bold text-white">{dailyDistance > 0 ? `${dailyDistance} km` : 'None'}</span>
          </p>
          <div className="flex items-center justify-end space-x-3 mt-2">
            {showDistanceSuccessFeedback && (
              <span className="text-green-400 text-sm flex items-center animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {showDistanceSuccessFeedback}
              </span>
            )}
            {dailyDistance > 0 && (
              <button
                type="button"
                onClick={handleClearDistance}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
              >
                Clear Distance
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
            >
              {dailyDistance > 0 ? 'Update Distance' : 'Log Distance'}
            </button>
          </div>
        </form>
      </div>

      {/* Currency Converter Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold text-gray-100 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1L15 4H9.001v1M12 8V3m0 18v-5M2.1 11H18a2 2 0 012 2v2a2 2 0 01-2 2H2.1a2 2 0 01-2-2v-2a2 2 0 012-2z" />
          </svg>
          Currency Converter
        </h4>
        <form onSubmit={handleConvertCurrency} className="flex flex-col space-y-3">
          <input
            type="number"
            className="w-full p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Amount"
            min="0"
            step="0.01"
            value={currencyAmount}
            onChange={(e) => setCurrencyAmount(e.target.value)}
          />
          <div className="flex space-x-3">
            <select
              className="w-1/2 p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {CURRENCIES.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <span className="flex items-center text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <select
              className="w-1/2 p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {CURRENCIES.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75"
          >
            Convert
          </button>
        </form>
        {convertedResult && (
          <p className="mt-4 text-center text-lg font-bold text-white">
            Result: <span className="text-cyan-300">{convertedResult}</span>
          </p>
        )}
        {currencyError && (
          <p className="mt-4 text-center text-red-400">
            {currencyError}
          </p>
        )}
        <p className="mt-4 text-center text-xs text-gray-500 italic">
          * Exchange rates are static and not real-time due to offline functionality.
        </p>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DayDetailModal;