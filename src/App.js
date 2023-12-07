import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Result from './components/Result';
import Upload from'./components/Upload';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';

function App ()  {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/forgotpass" element={<ForgotPassword/>} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
};

export default App;
