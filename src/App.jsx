// import { useState } from 'react'
import "./App.css";
import HomePage from "./components/pages/home/Hompage";
import Navbar from "./components/nav/Navbar";
import Carousel from "./components/pages/home/Cerausel";

function App() {
  return (
    <>
      <Navbar />
      <Carousel />
      <HomePage />
    </>
  );
}

export default App;
