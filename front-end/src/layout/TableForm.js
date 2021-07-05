import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
const { postTable } = require("../utils/api");

function TableForm() {
  const [tableFormError, setTableFormError] = useState(null);
  const [table, setTable] = useState({
    table_name: "",
    capacity: 0,
  });
  const history = useHistory();

  const inputHandler = (event) => {
    setTable({
      ...table,
      [event.target.name]:
        event.target.name === "capacity"
          ? Number(event.target.value)
          : event.target.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const abortController = new AbortController();
    const noErrors = validateFields();

    if (noErrors) {
      postTable(table, abortController.signal)
        .then(() => history.push("/dashboard"))
        .catch(setTableFormError);
    }

    return () => abortController.abort();
  };

  function cancelHandler() {
    history.goBack();
  }

  function validateFields() {
    let error = null;
    if (table.table_name.length < 2) {
      error = { message: "Table name must be at least 2 characters." };
    } else if (table.capacity < 1) {
      error = { message: "Table capacity must be at least 1." };
    }

    setTableFormError(error);

    return error === null;
  }

  return (
    <>
      <ErrorAlert error={tableFormError} />
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="form-row">
            <div className="form-group col-md-3">
              <label htmlFor="first_name">Table Name:</label>
              <input
                type="text"
                id="table_name"
                name="table_name"
                className="form-control"
                required={true}
                minLength={2}
                placeholder="Table Name"
                value={table.table_name}
                onChange={inputHandler}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-3">
              <label htmlFor="capacity">Capacity:</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                className="form-control"
                required={true}
                min={1}
                value={table.capacity}
                onChange={inputHandler}
              />
            </div>
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

export default TableForm;
