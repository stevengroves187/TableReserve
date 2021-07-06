import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";
import { readReservation, seatTable, listTables } from "../../utils/api";

function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [table_id, setTableId] = useState(0);
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [errors, setErrors] = useState([]);
 
  useEffect(() => {
    const abortController = new AbortController();

    setErrors([]);

    listTables(abortController.signal)
    .then(setTables)
    .catch((newError) => setErrors((prevState) => [...prevState,newError]));


    return () => abortController.abort();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    setErrors([]);

    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch((newError) => setErrors((prevState) => [...prevState, newError]));

    listTables(abortController.signal)
    .then(setTables)
    .catch((newError) => setErrors((prevState) => [...prevState, newError]));


    return () => abortController.abort();
  }, [reservation_id]);
  
  function handleChange(event) {
    setTableId(event.target.value);
  }


  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();

    if (validateSeat()) {
      seatTable(reservation_id, table_id, abortController.signal)
        .then(() => history.push(`/dashboard`))
        .catch((newError) => setErrors((prevState) => [...prevState, newError]));
    }
    return () => abortController.abort();
  }


  function validateSeat() {
    const newErrors = [];

    const foundTable = tables.find(
      (table) => table.table_id === Number(table_id)
    );

      if (foundTable.status === "occupied") {
        newErrors.push({message: "This table is currently occupied."});
      }

      if (foundTable.capacity < reservation.people) {
        newErrors.push({message:`This table cannot seat ${reservation.people} people.`});
      }


    setErrors((prevState) => [...prevState, ...newErrors]);

    return errors.length === 0;
  }

  function tableOptions() {
    // UI Improvement that breaks tests
    // const availableTables = tables.filter((table) => table.status === "free" && table.capacity >= reservation.people);
    // return availableTables.length ? availableTables.map((table) => (
    //   <option key={table.table_id} value={table.table_id}>
    //    Table: {table.table_name} Capacity: {table.capacity}
    //   </option>
    // )) : <option value={null} disabled>No Available Tables</option>;
    return tables.map((table) => (
        <option key={table.table_id} value={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>))
  };

  function errorsDisplay() {
    return errors.length > 0 ? errors.map((error, id) => <ErrorAlert key={id} error={error} />) : null;
  };

  return (
    <form className="form-select">
     {errorsDisplay()}  
     <h2>Reservation ID: {reservation.reservation_id} Number of People: {reservation.people}</h2>
      <label className="form-label" htmlFor="table_id">
        Choose table:
      </label>
      <select
        className="form-control"
        name="table_id"
        id="table_id"
        value={table_id}
        onChange={handleChange}
      >
        <option value={0}>Available Tables</option>
        {tableOptions()}
      </select>

      <button
        className="btn btn-primary m-1"
        type="submit"
        onClick={handleSubmit}
      >
        Submit
      </button>
      <button
        className="btn btn-danger m-1"
        type="button"
        onClick={history.goBack}
      >
        Cancel
      </button>
    </form>
  );
}

export default SeatReservation;
