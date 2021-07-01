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
    setTable({ ...table, [event.target.name]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(table.table_name.length < 2) {
    setTableFormError({message: "Table name must be at least 2 characters."})
    } else if(table.capacity < 1) {
    setTableFormError({message: "Table capacity must be at least 1."})
    } else {
    postTable(table);
    history.push("/dashboard")
    }
  };

  function cancelHandler() {
    history.goBack();
  }

  return (
    <>
     <ErrorAlert error={tableFormError} />
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="form-row">
            <div className="form-group col-md-3">
              <label htmlFor="first_name">Table Name</label>
              <input
                type="text"
                id="table_name"
                name="table_name"
                className="form-control"
                required={true}
                placeholder="Table Name"
                value={table.table_name}
                onChange={inputHandler}
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="capacity">Capacity</label>
              <input
                type="text"
                id="capacity"
                name="capacity"
                className="form-control"
                required={true}
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
