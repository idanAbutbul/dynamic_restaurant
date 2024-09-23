// myComponents/Form.jsx
import React from 'react';
import './Reservation.css';

function Form({ userId, onFormSubmit, reservationDetails, setReservationDetails }) {
  const handleChange = (e) => {
    setReservationDetails({
      ...reservationDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationToggle = () => {
    setReservationDetails({
      ...reservationDetails,
      location: reservationDetails.location === 'inside' ? 'outside' : 'inside',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit();
  };

  return (
    <div className='reservation-form-container'>

    <form onSubmit={handleSubmit} className="reservation-form">
      <label>
        How many:
        <input className='reservation-group-input'
          type="number"
          name="quantity"
          value={reservationDetails.quantity}
          onChange={handleChange}
          min="2"
          required
        />
      </label>
      <label>
        Date and Time:
        <input  className='reservation-group-input'
          type="datetime-local"
          name="date"
          value={reservationDetails.date}
          onChange={handleChange}
          required
        />
      </label>
      <button className="location-toggle" type="button" onClick={handleLocationToggle} >
        Location: {reservationDetails.location === 'inside' ? 'Inside' : 'Outside'}
      </button>
      <button className='reservation-group-button' type="submit" disabled={!reservationDetails.tableId}>Reserve</button>
    </form>
    </div>
  );
}


export default Form;
