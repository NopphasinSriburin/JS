"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import styles from '../styles/CulturePage.module.css'; // Importing the CSS module
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../components/Navbar';

const CulturePage = () => {
  const router = useRouter(); // Initialize the router
  const [activeTab, setActiveTab] = useState<string>('Tokyo');

  const cultureData = [
    {
      city: 'Tokyo',
      title: 'Tanabata Festival',
      location: 'Sendai, in Miyagi',
      image: '101-1-sendaitanabata.jpg',
    },
    {
      city: 'Kyoto',
      title: 'Gion Festival',
      location: 'Kyoto, in Kyoto',
      image: '/images/gion.jpg',
    },
    // Add more data as needed
  ];

  const filteredEvents = cultureData.filter(event => event.city === activeTab);

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.searchContainer}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchBar}
              placeholder="Search Japanese Culture"
            />
          </div>
          <h2 className={styles.headerTitle}>
            What arts and culture are you interested in in Japan?
          </h2>
        </header>

        <section className={styles.tabsSection}>
          <h3>JAPANESE CULTURE</h3>
          <div className={styles.tabs}>
            {['Tokyo', 'Kyoto', 'Shibuya'].map(city => (
              <button
                key={city}
                className={activeTab === city ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.cardsSection}>
          {filteredEvents.map((event, index) => (
            <div key={index} className={styles.card}>
              <img src={event.image} alt={event.title} className={styles.cardImage} />
              <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{event.title}</h4>
                <p className={styles.cardLocation}>
                  <LocationOnIcon className={styles.locationIcon} />
                  {event.location}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default CulturePage;
