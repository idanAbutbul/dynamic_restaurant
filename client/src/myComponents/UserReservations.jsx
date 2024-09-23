import React, { useEffect, useState } from "react";
import "../myComponents/UserReservation.css";
const UserReservations = ({ userId }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const url = `/tables/user-reservations/${userId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [userId]);

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`/tables/reservation/${reservationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReservations(
          reservations.filter(
            (reservation) => reservation.reservationId !== reservationId
          )
        );
      } else {
        alert("Failed to cancel reservation.");
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  return (
    <>
      <div className="user-reservation-container">
        <h2 className="user-reservation-h1"> My Reservations</h2>
        <div className="user-reservation">
          {reservations.length > 0 ? (
            <div className="user-reservation-item-contain">
              {reservations.map((reservation) => (
                <div
                  key={reservation.reservationId}
                  className="user-reservation-item"
                >
                  <p>
                    <span className="user-reservation-detail">
                      Date and Time: {" "}
                    </span>
                    <span className="user-reservation-detail">
                      {new Date(reservation.date).toLocaleString()}
                    </span>

                    <span className="user-reservation-detail">
                      {" "}
                      Table {reservation.size}{" "}
                    </span>
                    <span className="user-reservation-detail">
                      How Many: {reservation.how_many}
                    </span>
                  </p>
                  <button
                    className="user-reservation-cancel-button"
                    onClick={() =>
                      handleCancelReservation(reservation.reservationId)
                    }
                  >
                    Cancel Reservation
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="user-reservation-difault-txt">
              You have no reservations.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserReservations;
