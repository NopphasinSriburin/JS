import React from 'react'
import Navbar from './components/Navbar'
import './globals.css'
import Link from 'next/link'


export default function Home() {
  return (
    <div>
      
      {/* Landing Page Section */}
      <section className="hero">
        <div className="overlay"></div>
        <div className="content">
          <h1>Japanese food</h1>
          <p>Are you hungry? We have some food recommendations for you. Let's go get something to eat!!!</p>
          <button className="cta-button"><a href='/login'> Get's Started </a></button>
        </div>
      </section>
    </div>
  )
}
