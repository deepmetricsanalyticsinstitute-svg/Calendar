
import React, { useState } from 'react';
import { formatDate } from '../utils/dateUtils';

interface ReminderFormProps {
  selectedDate: Date;
  onAddReminder: (date: Date, text: string) => void;
  onClose: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ selectedDate, onAddReminder, onClose }) => {
  const [reminderText, setReminderText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reminderText.trim()) {
      onAddReminder(selectedDate, reminderText);
      setReminderText('');
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-4">Set Reminder for {formatDate(selectedDate)}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <textarea
          className="w-full p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
          placeholder="What's the reminder about?"
          value={reminderText}
          onChange={(e) => setReminderText(e.target.value)}
          required
        />
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
          >
            Add Reminder
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReminderForm;