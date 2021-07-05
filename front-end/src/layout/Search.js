import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import ReservationList from "./Reservations/ReservationList";

function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(event) {
    setMobileNumber(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const abortController = new AbortController();

    setError(null);

    listReservations({ mobile_number: mobileNumber }, abortController.signal)
      .then(setReservations)
      .then(setSearched(true))
      .catch(setError);

    return () => abortController.abort();
  }

  function formatPhoneNumber(numberString){
   const phoneArray = [];	
	phoneArray.push(numberString.substr(0,3));
	phoneArray.push(numberString.substr(3,3));
	phoneArray.push(numberString.substr(6,4));
  return phoneArray.join("-");
  }
  const searchResults = () => {
    if (!searched) return null;
    else {
      return reservations.length > 0 ? (
        <>
          <h2>{`Reservations for ${formatPhoneNumber(mobileNumber)}`}</h2>
          <ReservationList reservations={reservations} />
        </>
      ) : (
        <h3>No Reservations Found</h3>
      );
    }
  };

  return (
    <div>
      <form>
        <ErrorAlert error={error} />
        <div className="form-row">
          <div className="form-group col-md-2">
            <label className="form-label" htmlFor="mobile_number">
              Search by phone number:
            </label>
            <input
              className="form-control"
              name="mobile_number"
              id="mobile_number"
              type="tel"
              onChange={handleChange}
              value={mobileNumber}
              required={true}
            />

            <button
              className="btn btn-primary mt-2 ml-1 mb-4"
              type="submit"
              onClick={handleSubmit}
            >
              Search
            </button>
          </div>
        </div>
      </form>
      {searchResults()}
    </div>
  );
}

export default Search;
