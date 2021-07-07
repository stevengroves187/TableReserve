import React from "react";
import { finishTable } from "../../utils/api";


function TableList({ tables, loadDashboard }) {

  function finishHandler(table_id) {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      const abortController = new AbortController();

      finishTable(table_id, abortController.signal).then(loadDashboard);

      return () => abortController.abort();
    }
  }

// UI Improvement deactivated for tests
//   function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   }

  function displayTable(table) {
    return (
      <tr key={table.table_id}>
        <th scope="row" className="pt-4">{table.table_id}</th>
        <td className="pt-4">{table.table_name}</td>
        <td className="pt-4">{table.capacity}</td>
        <td className="pt-4" data-table-id-status={table.table_id}>{table.status}</td>
        <td className="pt-4">{table.reservation_id ? table.reservation_id : "Open"}</td>
        {table.status === "occupied" && (
          <td>
            <button
              className="btn btn-primary d-block mt-2"
              title="Finish table"
              data-table-id-finish={table.table_id}
              onClick={() => finishHandler(table.table_id)}
            >
              <span className="oi oi-check mr-2" />
              Finish
            </button>
          </td>
        )}
      </tr>
    );
  }

  const tablesDisplay = tables.map(displayTable);

  return (
    <div className="mt-4">
      <h3>Tables</h3>
      <table className="table table-hover table-bordered">
        <thead>
          <tr key="tables">
            <th className="bg-dark text-light" scope="row">
              ID
            </th>
            <th className="bg-dark text-light" scope="col">
              Table Name
            </th>
            <th className="bg-dark text-light" scope="col">
              Capacity
            </th>
            <th className="bg-dark text-light" scope="col">
              Status
            </th>
            <th className="bg-dark text-light" scope="col">
              Reservation ID
            </th>
            <th
              className="bg-dark text-light"
              scope="col"
              style={{ width: "20%" }}
            >
              Options
            </th>
          </tr>
        </thead>
        <tbody>{tablesDisplay}</tbody>
      </table>
    </div>
  );
}

export default TableList;
