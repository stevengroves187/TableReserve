import React from "react";
import { Link } from 'react-router-dom';
const cancelReservation = require('../utils/api');

function ReservationList({reservations}) {
  const reservationsDisplay = reservations.map((reservation) => (
    <tr key={reservation.id}>
      <td className="pt-5">{reservation.first_name}</td>
      <td className="pt-5">{reservation.last_name}</td>
      <td className="pt-5">{reservation.mobile_number}</td>
      <td className="pt-5">{reservation.reservation_date}</td>
      <td className="pt-5">{reservation.reservation_time}</td>
      <td className="pt-5">{reservation.people}</td>
      <td>
       <div className="col-md-6 mb-2">
      <Link to={`/reservations/${reservation.id}/seat`}
          className="btn btn-primary md-2"
          title="Seat Reservation"
        >
          <span className="oi oi-grid-two-up mr-2" />
          Seat
        </Link>
        </div>
        <div className="col-md-6">
        <Link to={`/reservations/${reservation.id}/edit`}
          className="btn btn-secondary md-2"
          title="Edit Reservation"
        >
          <span className="oi oi-pencil mr-2" />
          Edit
        </Link>
        <button className="btn btn-danger d-block mt-2" title="Cancel Reservation">
          <span className="oi oi-x mr-2" onClick={() => cancelReservation(reservation.id)} />
          Cancel
        </button>
        </div>
      </td>
    </tr>
  ));
  return (
    <div className="mt-4">
        <h2>Reservations</h2>
        <table className="table table-hover table-bordered">
            <thead>
                <tr key="reservations">
                    <th className="bg-dark text-light" scope="col">First Name</th>
                    <th className="bg-dark text-light" scope="col">Last Name</th>
                    <th className="bg-dark text-light" scope="col">Mobile Number</th>
                    <th className="bg-dark text-light" scope="col">Reservation Date</th>
                    <th className="bg-dark text-light" scope="col">Reservation Time</th>
                    <th className="bg-dark text-light" scope="col">Party Size</th>
                    <th className="bg-dark text-light" scope="col" style={{width: "20%"}}>Options</th>
                </tr>
            </thead>
            <tbody>
            {reservationsDisplay}
            </tbody>
            
        </table>
    </div>
);
  
}

export default ReservationList;