import React, { useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../layout/ReservationList";
import {next, previous, today} from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({date}) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function changeDay(option) {
    if (option === "next") {
      history.push(`/dashboard?date=${next(date)}`);
    } else if (option === "previous"){
      history.push(`/dashboard?date=${previous(date)}`);
    } else {
      history.push(`/dashboard?date=${today()}`);
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        </div>
        <div className="row mx-auto">
        <button className="btn btn-warning d-block mt-2" title="Previous Day" onClick={() => changeDay("previous")}>
          <span className="oi oi-chevron-left mx-2" />
          <strong>Previous</strong>
        </button>
        <button className="btn btn-primary d-block mt-2" title="Today" onClick={() => changeDay("today")}>
          <span className="oi oi-calendar mx-2"/>
          <strong>Today</strong>
        </button>
        <button className="btn btn-warning d-block mt-2" title="Next Day" onClick={() => changeDay("next")}>
        <strong>Next</strong>
          <span className="oi oi-chevron-right mx-2"/>
         
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationList reservations={reservations}/>
    </main>
  );
}

export default Dashboard;
