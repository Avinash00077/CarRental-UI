import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Auth from './components/auth/auth'
import CarsDisplay from './components/CarsDisplay/CarsDisplay'
import $ from 'jquery';
// import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'

const App = () => {
  return (
    <div className=''>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/cart' element={<Cart />} /> */}
        <Route path='/order' element={<PlaceOrder />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/viewCars' element={<CarsDisplay />} />
      </Routes>
    </div>
  )
}

export default App
