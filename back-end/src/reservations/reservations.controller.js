const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */

function testDateAndTime(data) {
  const dateArray = data.reservation_date.split("-");
  const timeArray = data.reservation_time.split(":");
  const time = parseInt(data.reservation_time.split(":").join(""));
  dateArray[1] = dateArray[1] - 1;
  const testDate = new Date(...dateArray, ...timeArray);
  const today = new Date();
  const testDay = testDate.getDay();
  if (testDate < today && testDay === 2) return 2;
  if (testDate < today) return 0;
  if (testDay === 2) return 1;
  if (time < 1030) return 3;
  if (time > 2130) return 4;
}

async function validReservation(req, res, next) {
  const requiredProperties = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  const dateFormat = /\d\d\d\d-\d\d-\d\d/;
  const timeFormat = /\d\d:\d\d/;
  const { data } = req.body;
  if (!data) return next({ status: 400, message: "Data is required" });

  requiredProperties.forEach((property) => {
    const value = data[property];
    if (!value) {
      return next({
        status: 400,
        message: `A '${property}' property is required.`,
      });
    }
  });
  if (data.status === "seated")
    return next({
      status: 400,
      message: "A status of 'seated' is invalid for a new reservation.",
    });
  if (data.status === "finished")
    return next({
      status: 400,
      message: "A status of 'finished' is invalid for a new reservation.",
    });
  if (!dateFormat.test(data.reservation_date))
    return next({
      status: 400,
      message: "reservation_date is not a valid date.",
    });
  if (!timeFormat.test(data.reservation_time))
    return next({
      status: 400,
      message: "reservation_time is not a valid time.",
    });
  if (data.people === 0 || typeof data.people !== "number")
    return next({
      status: 400,
      message: "Amount of people is not a valid number.",
    });
  switch (testDateAndTime(data)) {
    case 0: {
      return next({
        status: 400,
        message: "Reservations must be a future date and time.",
      });
    }
    case 1: {
      return next({
        status: 400,
        message: "The restaurant is closed on Tuesdays.",
      });
    }
    case 2: {
      return next({
        status: 400,
        message:
          "Reservations must be made on a future date and time and the restaurant is closed on Tuesdays.",
      });
    }
    case 3: {
      return next({
        status: 400,
        message: "Reservations must be after 10:30 AM.",
      });
    }
    case 4: {
      return next({
        status: 400,
        message: "Reservations must be before 9:30 PM",
      });
    }
    default: {
      break;
    }
  }
  data.status = "booked";
  res.locals.reservation = data;
  next();
}

async function validateReservationId(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(Number(reservation_id));

  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation Id: ${reservation_id} does not exist`,
    });
  }

  res.locals.reservation = reservation;

  next();
}

async function validateStatusUpdate(req, res, next) {
  const { status } = req.body.data;
  const previousStatus = res.locals.reservation.status;

  if (!status) {
    return next({ status: 400, message: "body must include a status" });
  }

  if (
    status !== "booked" &&
    status !== "seated" &&
    status !== "finished" &&
    status !== "cancelled"
  ) {
    return next({
      status: 400,
      message: `${status} is an invalid status. Status must be booked, seated, finished, or cancelled.`,
    });
  }

  if (previousStatus === "finished") {
    return next({
      status: 400,
      message: `A finished reservation cannot be updated`,
    });
  }

  next();
}

async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;

  const reservations = await service.list(date, mobile_number);

  const response = reservations.filter(
    (reservation) => reservation.status !== "finished"
  );

  res.json({ data: response });
}

async function create(req, res) {
  const { reservation } = res.locals;
  const data = await service.create(reservation);
  res.status(201).json({ data: data });
}

async function updateStatus(req, res) {
  const { status } = req.body.data;
  const { reservation } = res.locals;
  await service.updateStatus(reservation.reservation_id, status);
  res.status(200).json({ data: { status } });
}

async function update(req, res) {
  const { reservation } = res.locals;
  const response = await service.update(
    reservation.reservation_id,
    req.body.data
  );

  res.status(200).json({ data: response[0] });
}

async function read(req, res) {
  const { reservation } = res.locals;
  res.status(200).json({ data: reservation });
}

async function destroy(req,res){
  const {reservation_id} = res.locals.reservation;
  const response = await service.destroy(reservation_id);
  if(response === 1) res.sendStatus(204);
}

module.exports = {
  list,
  read: [asyncErrorBoundary(validateReservationId), asyncErrorBoundary(read)],
  create: [asyncErrorBoundary(validReservation), asyncErrorBoundary(create)],
  updateStatus: [
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateStatusUpdate),
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validReservation),
    asyncErrorBoundary(update),
  ],
  destroy: [ asyncErrorBoundary(validateReservationId),asyncErrorBoundary(destroy),]
};
