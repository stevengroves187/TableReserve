import React, {useEffect, useState} from "react";
import { Redirect, Route, Switch} from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationForm from "./Reservations/ReservationForm";
import SeatReservation from "./Reservations/SeatReservation";
import Search from "./Search";
import TableForm from "./TableForm";
import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import {today} from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const searchDate = useQuery().get('date');
  const [date, setDate] = useState(today());
 
  useEffect(() => {
   if(searchDate) setDate(searchDate);
  }, [searchDate])


  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationForm edit={false}/>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationForm edit={true} />
      </Route>
      <Route exact={true} path="/tables/new">
        <TableForm />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date}/>
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
