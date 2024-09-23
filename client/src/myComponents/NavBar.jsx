import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar({ user, onLogout }) {
  return (
    <nav className='navbar'>
      
      <div>
      {!user && <Link to="/"> <button className='nav-button'>Home</button> </Link>}
       {user && <Link to="/reservation"> <button className='nav-button'>Reservations</button></Link>}
        {user && user.id === 1 && (
          <>
            <Link to="/admin" ><button className='nav-button'>Admin Panel</button></Link>
            <Link to="/reservations-filter" ><button className='nav-button'>Dashboard</button></Link> {/* Updated: Only Reservations Filter */}
          </>
        )}
      </div>
      <div>
        {user ? (
          <button  className='nav-button' onClick={onLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button  className='nav-button'>Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
