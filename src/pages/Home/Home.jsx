import React from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import About from '../../components/About/About'
import CarsDisplay from '../../components/CarsDisplay/CarsDisplay'
import Ride from '../../components/Ride/Ride'
import Reviews from '../../components/Reviews/Reviews'
import Contact from '../../components/Contact/Contact'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  return (
    <div>
      <Header />
      <About />
      {/* <CarsDisplay  /> */}
      <Ride />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  )
}

export default Home
