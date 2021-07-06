import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";
import {
  readReservation,
  postReservation,
  editReservation,
} from "../../utils/api";
import { asDateString , formatAsTime} from "../../utils/date-time";

function ReservationForm({ edit }) {
  const initialReservationState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  const [fetchError, setFetchError] = useState(null);
  const [formErrors, setFormErrors] = useState(null);
  const [reservationError, setReservationError] = useState(null);
  const [reservation, setReservation] = useState(initialReservationState);
  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(() => {
    setFetchError(null);
    setFormErrors(null);
    setReservationError(null);
    if (edit) {
      loadEdit();
    } else {
      setReservation({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
      });
    }

    async function loadEdit() {
      const abortController = new AbortController();
      const foundReservation = await readReservation(
        reservation_id,
        abortController.signal
      );
      const {
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
        status,
      } = foundReservation;
      if (!foundReservation || status !== "booked") {
        setReservationError({
          message: "Only booked reservations can be edited.",
        });
        return;
      } else {
        const date = new Date(reservation_date);
        setReservation({
          reservation_id,
          first_name,
          last_name,
          mobile_number,
          reservation_date: asDateString(date),
          reservation_time: formatAsTime(reservation_time),
          people,
          status,
        });
      }
      return () => abortController.abort();
    }
  }, [edit, reservation_id]);

  const inputHandler = (event) => {
    setReservation({
      ...reservation,
      [event.target.name]:
        event.target.name === "people"
          ? Number(event.target.value)
          : event.target.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    let errors = [];
    const abortController = new AbortController();
    if (testDate(errors) === 0) {
      if (edit) {
        editReservation(reservation, abortController.signal)
          .then(() =>
            history.push(`/dashboard?date=${reservation.reservation_date}`)
          )
          .catch(setFetchError);
      } else {
        reservation.status = "booked";
        postReservation(reservation, abortController.signal)
          .then(() =>
            history.push(`/dashboard?date=${reservation.reservation_date}`)
          )
          .catch(setFetchError);
      }
    }
    setFormErrors(errors);
    return () => abortController.abort();
  };

  function testDate(errors) {
    const dateArray = reservation.reservation_date.split("-");
    const timeArray = reservation.reservation_time.split(":");
    const time = parseInt(reservation.reservation_time.split(":").join(""));
    dateArray[1] = dateArray[1] - 1;
    const testDate = new Date(...dateArray, ...timeArray);
    const today = new Date();
    const testDay = testDate.getDay();
    if (testDate < today)
      errors.push({
        message:
          "You cannot reserve a date in the past. Please select a future date.",
      });
    if (testDay === 2)
      errors.push({
        message:
          "The restaurant is closed on Tuesdays. Please select another date.",
      });
    if (time < 1030)
      errors.push({ message: "The restaurant is closed until 10:30 AM." });
    if (time > 2130)
      errors.push({ message: "Reservations are unavailable after 9:30 PM." });
    return errors.length;
  }

  function cancelHandler() {
    history.goBack();
  }

  function heading() {
    return edit ? <h2>Edit Reservation</h2> : <h2>New Reservation</h2>;
  }

  function errorsDisplay() {
    if (formErrors)
      return formErrors.map((error, id) => (
        <ErrorAlert key={id} error={error} />
      ));
  }
  return (
    <>
      {heading()}
      {errorsDisplay()}
      <ErrorAlert error={fetchError} />
      <ErrorAlert error={reservationError} />
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
                type="tel"
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
            <div className="form-group col-md-3">
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
            <div className="form-group col-md-3">
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
              min="1"
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
