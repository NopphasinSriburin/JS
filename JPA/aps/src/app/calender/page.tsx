"use client";
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../styles/CalendarPage.module.css';
import Navbar from '../components/Navbar';

// กำหนด interface สำหรับเทศกาล
interface Festival {
  date: Date;
  title: string;
  location: string;
}

const festivalData: Festival[] = [
  {
    date: new Date(2024, 6, 7), // July 7, 2024
    title: 'Tanabata Festival',
    location: 'Sendai, Miyagi',
  },
  {
    date: new Date(2024, 7, 16), // August 16, 2024
    title: 'Obon Festival',
    location: 'Nationwide',
  },
  {
    date: new Date(2024, 10, 17), // November 17, 2024
    title: 'Shichi-Go-San',
    location: 'Nationwide',
  },
  // เพิ่มเทศกาลอื่น ๆ ได้ที่นี่
];

const CalendarPage: React.FC = () => {
  const [value, setValue] = useState<Date | null>(new Date());
  const [selectedFestivals, setSelectedFestivals] = useState<Festival[]>([]);

  const handleDateChange = (date: Date | null) => {
    setValue(date);
    if (date) {
      const festivalsOnDate = festivalData.filter(festival =>
        festival.date.toDateString() === date.toDateString()
      );
      setSelectedFestivals(festivalsOnDate);
    } else {
      setSelectedFestivals([]); // เคลียร์เทศกาลเมื่อไม่มีการเลือกวันที่
    }
  };

  return (
    <div>
              <Navbar />
        <div className={styles.container}>
        <h1 className={styles.title}>Japanese Festivals Calendar</h1>
        <div className={styles.calendarContainer}>
            <Calendar
            //onChange={handleDateChange}
            value={value}
            className={styles.calendar}
            />
        </div>
        <div className={styles.festivalsList}>
            {selectedFestivals.length > 0 ? (
            selectedFestivals.map((festival, index) => (
                <div key={index} className={styles.festivalCard}>
                <h3>{festival.title}</h3>
                <p>{festival.location}</p>
                </div>
            ))
            ) : (
            <p>No festivals on this date.</p>
            )}
        </div>
        </div>
    </div>
  );
};

export default CalendarPage;
