import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";
import { listReservations, seatTable } from "../../utils/api";

function SeatReservation(){
 const history = useHistory();
 const { reservation_id } = useParams;

 const [table_id, setTableId] = useState(0);

 useEffect(() => {
 const abortController = new AbortController();

 }, [])

return (
    <div></div>
)
}

export default SeatReservation;