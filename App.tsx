import React, { useState, useEffect, useRef } from 'react';
import DateTimeDisplay from './components/DateTimeDisplay';
import Calendar from './components/Calendar';
import CountdownDisplay from './components/CountdownDisplay';
import MotivationalQuote from './components/MotivationalQuote';
import RemindersList from './components/RemindersList';
import DayDetailModal from './components/DayDetailModal'; // New modal component

interface Reminder {
  id: string;
  date: string; // YYYY-MM-DD format
  text: string;
  isCompleted: boolean;
}

interface DailyDistances {
  [date: string]: number; // YYYY-MM-DD: distance_in_km
}

const LOCAL_STORAGE_KEY_REMINDERS = 'calendarReminders';
const LOCAL_STORAGE_KEY_NOTIFIED_REMINDERS = 'notifiedReminderIds';
const LOCAL_STORAGE_KEY_DAILY_DISTANCES = 'dailyTravelDistances'; // New key for distances

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    // Initialize reminders from localStorage
    try {
      const storedReminders = localStorage.getItem(LOCAL_STORAGE_KEY_REMINDERS);
      return storedReminders ? JSON.parse(storedReminders) : [];
    } catch (error) {
      console.error("Failed to parse reminders from localStorage", error);
      return [];
    }
  });
  const [dailyDistances, setDailyDistances] = useState<DailyDistances>(() => {
    // Initialize dailyDistances from localStorage
    try {
      const storedDistances = localStorage.getItem(LOCAL_STORAGE_KEY_DAILY_DISTANCES);
      return storedDistances ? JSON.parse(storedDistances) : {};
    } catch (error) {
      console.error("Failed to parse daily distances from localStorage", error);
      return {};
    }
  });

  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false); // Renamed state
  const [selectedDateForInteraction, setSelectedDateForInteraction] = useState<Date | null>(null); // Renamed state
  const [activeNotification, setActiveNotification] = useState<Reminder | null>(null);
  const [notifiedReminderIds, setNotifiedReminderIds] = useState<Set<string>>(() => {
    // Initialize notifiedReminderIds from localStorage
    try {
      const storedIds = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFIED_REMINDERS);
      return storedIds ? new Set(JSON.parse(storedIds)) : new Set();
    } catch (error) {
      console.error("Failed to parse notified reminder IDs from localStorage", error);
      return new Set();
    }
  });

  const modalRef = useRef<HTMLDivElement>(null); // Ref for the modal overlay

  // Effect to continuously update current date
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // Effect to persist reminders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_REMINDERS, JSON.stringify(reminders));
    } catch (error) {
      console.error("Failed to save reminders to localStorage", error);
    }
  }, [reminders]);

  // Effect to persist dailyDistances to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_DAILY_DISTANCES, JSON.stringify(dailyDistances));
    } catch (error) {
      console.error("Failed to save daily distances to localStorage", error);
    }
  }, [dailyDistances]);

  // Effect to persist notifiedReminderIds to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFIED_REMINDERS, JSON.stringify(Array.from(notifiedReminderIds)));
    } catch (error) {
      console.error("Failed to save notified reminder IDs to localStorage", error);
    }
  }, [notifiedReminderIds]);

  // Effect to check and trigger notifications for upcoming reminders
  useEffect(() => {
    const todayDateString = currentDate.toISOString().split('T')[0];

    // Clear any existing notification if it's no longer relevant
    if (activeNotification) {
        const currentActiveReminder = reminders.find(r => r.id === activeNotification.id);
        if (!currentActiveReminder || currentActiveReminder.date !== todayDateString || currentActiveReminder.isCompleted) {
            setActiveNotification(null);
        }
    }

    // Find unnotified, uncompleted reminders for today
    const unnotifiedUpcomingReminders = reminders.filter(
      (r) =>
        r.date === todayDateString &&
        !r.isCompleted &&
        !notifiedReminderIds.has(r.id)
    );

    if (unnotifiedUpcomingReminders.length > 0 && !activeNotification) {
      // Prioritize the earliest one, if there are multiple
      const notificationCandidate = unnotifiedUpcomingReminders[0];

      setActiveNotification(notificationCandidate);
      // Mark this reminder as notified
      setNotifiedReminderIds((prev) => new Set(prev).add(notificationCandidate.id));

      // Simulate playing an audio cue
      console.log(`Playing reminder notification sound for: "${notificationCandidate.text}"`);
      // In a real app, you would play an actual sound here, e.g.:
      // const audio = new Audio('/path/to/notification.mp3');
      // audio.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [currentDate, reminders, notifiedReminderIds, activeNotification]);

  // Effect to handle Escape key press for modal closing
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDayDetailModalOpen(false);
      }
    };

    if (isDayDetailModalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      document.removeEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isDayDetailModalOpen]);

  const addReminder = (date: Date, text: string) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      text,
      isCompleted: false,
    };
    setReminders((prev) => [...prev, newReminder].sort((a, b) => a.date.localeCompare(b.date)));
    // setIsReminderFormOpen(false); // Close form after adding - this will be handled by the modal
  };

  const markReminderComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, isCompleted: !reminder.isCompleted } : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
    // Also remove from notified list if it was there
    setNotifiedReminderIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const addOrUpdateDailyDistance = (date: Date, distance: number) => {
    const dateString = date.toISOString().split('T')[0];
    setDailyDistances((prev) => ({
      ...prev,
      [dateString]: distance,
    }));
  };

  const deleteDailyDistance = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setDailyDistances((prev) => {
      const newDistances = { ...prev };
      delete newDistances[dateString];
      return newDistances;
    });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDateForInteraction(date);
    setIsDayDetailModalOpen(true);
  };

  const handleDismissNotification = () => {
    setActiveNotification(null);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && event.target === modalRef.current) {
      setIsDayDetailModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-10 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight">
          Modern <span className="text-indigo-500">Calendar-Plus</span>
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-gray-400">Your daily dose of organization and inspiration, offline.</p>
      </header>

      {activeNotification && (
        <div
          role="alert"
          aria-live="polite"
          className="w-full max-w-4xl bg-indigo-700 text-white p-4 rounded-lg flex items-center justify-between shadow-lg mb-8 animate-fade-in"
        >
          <p className="font-semibold text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Reminder Today: <span className="italic ml-2">"{activeNotification.text}"</span>
          </p>
          <button
            onClick={handleDismissNotification}
            className="ml-4 px-3 py-1 bg-indigo-800 hover:bg-indigo-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Dismiss reminder notification"
          >
            Dismiss
          </button>
        </div>
      )}

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="col-span-1 md:col-span-2">
          <DateTimeDisplay currentDate={currentDate} />
        </section>

        <section className="col-span-1">
          <Calendar 
            currentDate={currentDate} 
            onDayClick={handleDayClick} 
            reminders={reminders} 
            dailyDistances={dailyDistances} // Pass dailyDistances to Calendar
          />
        </section>

        <section className="col-span-1 flex flex-col space-y-8">
          <CountdownDisplay currentDate={currentDate} />
          <MotivationalQuote currentDate={currentDate} />
        </section>

        <section className="col-span-1 md:col-span-2">
          <RemindersList reminders={reminders} onMarkComplete={markReminderComplete} onDelete={deleteReminder} />
        </section>
      </main>

      {isDayDetailModalOpen && selectedDateForInteraction && (
        <div 
          ref={modalRef}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="day-detail-modal-title"
        >
          <DayDetailModal
            selectedDate={selectedDateForInteraction}
            onAddReminder={addReminder}
            dailyDistance={dailyDistances[selectedDateForInteraction.toISOString().split('T')[0]] || 0}
            onAddOrUpdateDailyDistance={addOrUpdateDailyDistance}
            onDeleteDailyDistance={deleteDailyDistance}
            onClose={() => setIsDayDetailModalOpen(false)}
          />
        </div>
      )}

      <footer className="w-full max-w-4xl mt-12 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Modern Calendar-Plus. All rights reserved.</p>
        <p>Designed for an offline, inspired life.</p>
      </footer>
    </div>
  );
};

export default App;