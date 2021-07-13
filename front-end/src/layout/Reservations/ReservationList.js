import React from "react";
import { Link } from 'react-router-dom';
import {updateReservationStatus, deleteReservation} from '../../utils/api';

function ReservationList({reservations, loadDashboard}) {

 function cancelHandler(reservation_id){
  if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
    const abortController = new AbortController();

    updateReservationStatus(reservation_id, "cancelled", abortController.signal)
    .then(loadDashboard);

    return () => abortController.abort();
  }
}

function deleteHandler(reservation_id){
  if(window.confirm("Do you want to delete this reservation? This cannot be undone.")) {
    const abortController = new AbortController();

    deleteReservation(reservation_id, abortController.signal)
    .then(loadDashboard);

    return () => abortController.abort();
  }
}

 function timeDisplay(time){
   const timeArray = time.substr(0,5).split(":");
   let newTime = "";
   if (timeArray[0] > 12) {
     timeArray[0] = timeArray[0] - 12;
     newTime = timeArray.join(":").concat(" PM");
   } else {
     newTime = time.concat(" AM");
   }
   return newTime;
 }

 function capitalizeFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
 }


 function displayReservation(reservation){
    return (<tr key={reservation.reservation_id}>
      <td className="pt-5">{reservation.reservation_id}</td>
      <td className="pt-5">{reservation.first_name}</td>
      <td className="pt-5">{reservation.last_name}</td>
      <td className="pt-5">{reservation.mobile_number}</td>
      <td className="pt-5">{reservation.reservation_date}</td>
      <td className="pt-5">{timeDisplay(reservation.reservation_time)}</td>
      <td className="pt-5">{reservation.people}</td>
      <td className="pt-5" data-reservation-id-status={reservation.reservation_id}>{capitalizeFirstLetter(reservation.status)}</td>
      {reservation.status === "booked" && <td>
       <div className="col-md-6 mb-2">
      <Link to={`/reservations/${reservation.reservation_id}/seat`}
          className="btn btn-primary md-2"
          title="Seat Reservation"
        >
          <span className="oi oi-grid-two-up mr-2" />
          Seat
        </Link>
        </div>
        <div className="col-md-6">
        <Link to={`/reservations/${reservation.reservation_id}/edit`}
          className="btn btn-secondary md-2"
          title="Edit Reservation"
        >
          <span className="oi oi-pencil mr-2" />
          Edit
        </Link>
        <button className="btn btn-danger d-block mt-2" title="Cancel Reservation"  onClick={() => cancelHandler(reservation.reservation_id)}>
          <span className="oi oi-x mr-2" />
          Cancel
        </button>
        </div>
      </td>
     }
        {reservation.status === "cancelled" && <td>
       <div className="col-md-6 mb-2">
        <button className="btn btn-danger d-block mt-3" title="Delete Reservation"  onClick={() => deleteHandler(reservation.reservation_id)}>
          <span className="oi oi-x mr-2" />
          Delete
        </button>
        </div>
      </td>
     }
    </tr>
  )
 }

 const reservationsDisplay = reservations.map(displayReservation);
  
  return (
    <div className="mt-4">
        <table className="table table-hover table-bordered">
            <thead>
                <tr key="reservations">
                    <th className="bg-dark text-light" scope="col">ID</th>
                    <th className="bg-dark text-light" scope="col">First Name</th>
                    <th className="bg-dark text-light" scope="col">Last Name</th>
                    <th className="bg-dark text-light" scope="col">Mobile Number</th>
                    <th className="bg-dark text-light" scope="col">Reservation Date</th>
                    <th className="bg-dark text-light" scope="col">Reservation Time</th>
                    <th className="bg-dark text-light" scope="col">Party Size</th>
                    <th className="bg-dark text-light" scope="col">Status</th>
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