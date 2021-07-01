import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
const { postReservation } = require("../utils/api");

function ReservationForm() {
  const [reservationFormError, setReservationFormError] = useState(null);
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
  const history = useHistory();

  const inputHandler = (event) => {
    setReservation({ ...reservation, [event.target.name]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(testDate() === 0) {
    setReservationFormError({message: "You cannot reserve a date in the past. Please select a future date."})
    } else if (testDate() === 1) {
    setReservationFormError({message: "The restaurant is closed on Tuesdays. Please select another date."})
    } else if (testDate() === 2) {
    setReservationFormError({message: "The restaurant is closed on Tuesdays and reservations must be made for a future date and time."})
    } else if (testDate() === 3) {
      setReservationFormError({message: "The restaurant is closed until 10:30 AM."})
    } else if (testDate() === 4) {
      setReservationFormError({message: "Reservations are unavailable after 9:30 PM."})
    } else {
    postReservation(reservation);
    history.push(`/dashboard?date=${reservation.reservation_date}`)
    }
  };

  function testDate() {
  const dateArray = reservation.reservation_date.split("-");
  const timeArray = reservation.reservation_time.split(":");
  const time = parseInt(reservation.reservation_time.split(":").join(""));
  dateArray[1] = dateArray[1] - 1;
  const testDate = new Date(...dateArray,...timeArray);
  const today = new Date();
  const testDay = testDate.getDay();
  if (testDate < today && testDay === 2) return 2;
  if (testDate < today) return 0;
  if (testDay === 2) return 1;
  if (time < 1030) return 3;
  if (time > 2130) return 4;
  }

  function cancelHandler() {
    history.goBack();
  }

  return (
    <>
     <ErrorAlert error={reservationFormError} />
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="form-row">
            <div className="form-group col-md-3">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="form-control"
                required={true}
                placeholder="First Name"
                value={reservation.first_name}
                onChange={inputHandler}
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="form-control"
                required={true}
                placeholder="Last Name"
                value={reservation.last_name}
                onChange={inputHandler}
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="mobile_number">Mobile Number</label>
              <input
                type="text"
                id="mobile_number"
                name="mobile_number"
                className="form-control"
                required={true}
                placeholder="Mobile Number"
                value={reservation.mobile_number}
                onChange={inputHandler}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="reservation_date">Reservation Date</label>
              <input
                type="date"
                id="reservation_date"
                name="reservation_date"
                className="form-control"
                required={true}
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                value={reservation.reservation_date}
                onChange={inputHandler}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="reservation_time">Reservation Time</label>
              <input
                type="time"
                id="reservation_time"
                name="reservation_time"
                className="form-control"
                required={true}
                placeholder="HH:MM"
                pattern="[0-9]{2}:[0-9]{2}"
                value={reservation.reservation_time}
                onChange={inputHandler}
              />
            </div>
          </div>
          <div className="form-group col-md-1 ml-n3">
            <label htmlFor="people">People</label>
            <input
              type="number"
              id="people"
              name="people"
              className="form-control"
              required={true}
              value={reservation.people}
              onChange={inputHandler}
            />
          </div>

          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </fieldset>
      </form>
    </>
  );
}

export default ReservationForm;
