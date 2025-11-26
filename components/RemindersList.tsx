
import React from 'react';
import { formatReminderDate } from '../utils/dateUtils';

interface Reminder {
  id: string;
  date: string;
  text: string;
  isCompleted: boolean;
}

interface RemindersListProps {
  reminders: Reminder[];
  onMarkComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const RemindersList: React.FC<RemindersListProps> = ({ reminders, onMarkComplete, onDelete }) => {
  if (reminders.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center min-h-[150px] flex items-center justify-center">
        <p className="text-gray-400 text-lg italic">No reminders set. Click a day on the calendar to add one!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-4">Your Reminders</h3>
      <ul className="space-y-4">
        {reminders.map((reminder) => (
          <li
            key={reminder.id}
            className={`flex items-center justify-between p-4 rounded-md border ${
              reminder.isCompleted ? 'bg-gray-700 border-gray-600 text-gray-400 line-through' : 'bg-gray-700 border-gray-600 text-gray-100'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-indigo-300">{formatReminderDate(reminder.date)}</p>
              <p className="text-lg">{reminder.text}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onMarkComplete(reminder.id)}
                className={`p-2 rounded-full transition-colors ${
                  reminder.isCompleted ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                } text-white focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                  reminder.isCompleted ? 'focus:ring-yellow-500' : 'focus:ring-green-500'
                }`}
                aria-label={reminder.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {reminder.isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => onDelete(reminder.id)}
                className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                aria-label="Delete reminder"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemindersList;