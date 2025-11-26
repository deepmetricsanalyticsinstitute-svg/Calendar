import React from 'react';
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/dateUtils';

interface DailyDistances {
  [date: string]: number;
}

interface CalendarProps {
  currentDate: Date;
  onDayClick: (date: Date) => void;
  reminders: { id: string; date: string; text: string; isCompleted: boolean; }[];
  dailyDistances: DailyDistances; // New prop for daily distances
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar: React.FC<CalendarProps> = ({ currentDate, onDayClick, reminders, dailyDistances }) => {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth); // 0 for Sunday, 1 for Monday

  const calendarDays: (number | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });

  const hasReminder = (day: number) => {
    if (day === null) return false;
    const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return reminders.some(r => r.date === dateString);
  }

  const getDailyDistance = (day: number) => {
    if (day === null) return null;
    const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return dailyDistances[dateString];
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-gray-100 mb-1">
          {monthName} {currentYear}
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-2 text-sm sm:text-base">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="font-semibold text-center text-indigo-300">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          const distance = getDailyDistance(day);
          return (
            <div
              key={index}
              className={`
                relative w-10 h-10 sm:w-12 sm:h-12 flex flex-col items-center justify-center rounded-full
                ${day === today && 'bg-indigo-600 text-white font-bold shadow-md'}
                ${day !== null && day !== today && 'text-gray-200 hover:bg-gray-700 transition-colors cursor-pointer'}
                ${day === null && 'text-gray-600'}
                overflow-hidden
              `}
              onClick={() => day !== null && onDayClick(new Date(currentYear, currentMonth, day))}
            >
              <span className="text-base leading-none">{day}</span>
              {day !== null && hasReminder(day) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Reminder set"></span>
              )}
              {distance !== null && distance !== undefined && distance > 0 && (
                <span className="absolute bottom-0 text-xs text-yellow-300 bg-gray-900 bg-opacity-75 px-1 rounded-full leading-tight" title={`Distance: ${distance} km`}>
                  {distance}km
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;