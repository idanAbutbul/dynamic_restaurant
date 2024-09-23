import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './myComponents/NavBar';
import Login from './myComponents/Login';
import Register from './myComponents/Register';
import MainPage from './myComponents/MainPage';
import Reservation from './myComponents/Reservation';
import ParentComponent from './myComponents/ParentComponent';
import UserReservations from './myComponents/UserReservations';
import ReservationFilterPage from './myComponents/ReservationFilterPage'; // Import the new component


function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token and set user (assuming the token contains user info)
      setUser({ id: 1, email: 'user@example.com' }); // Replace with actual decoding logic
    }
  }, []);

  return (
    <>
     <BrowserRouter>
      <NavBar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/reservation" /> : <MainPage user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reservation" element={user ? <Reservation user={user} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user && user.id === 1 ? <ParentComponent /> : <Navigate to="/" />} />
        <Route path="/my-reservations" element={user ? <UserReservations userId={user.id} /> : <Navigate to="/login" />} />
        <Route path="/reservations-filter" element={user && user.id === 1 ? <ReservationFilterPage /> : <Navigate to="/" />} /> {/* Only Reservations Filter */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>      
    </BrowserRouter>
   
    </>
   
    
  );
}

export default App;
