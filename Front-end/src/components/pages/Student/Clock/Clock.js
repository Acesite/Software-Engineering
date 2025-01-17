import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [dateTime, setDateTime] = useState({
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime({
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      });
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const [weekday, ...restOfDate] = dateTime.date.split(', '); // Split weekday from the rest of the date

  return (
    <div className="text-black p-2 rounded-lg flex flex-row space-x-4">
      <h1 className="text-lg">
        <span className="font-bold">{weekday}</span>, {restOfDate.join(', ')}
      </h1>
      <h1 className="text-lg">{dateTime.time}</h1>
    </div>
  );
};

export default Clock;
