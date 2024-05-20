import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Control from './Components/Control';
import style from './App.css'
import Login from './Components/login';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path='/Control' element={<Control/>} />
          <Route path='/' element={<Login/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
