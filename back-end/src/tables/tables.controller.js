const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function validateBody(req,res,next) {
  const { data} = req.body;
  if(!data) {
		return next({ status: 400, message: "Body must include a data object" });
	}

	next();
}


async function validateTable(req, res, next) {
  const requiredProperties = ["table_name", "capacity"];
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
  if (data.table_name.length < 2)
    return next({
      status: 400,
      message: "table_name must be at least 2 characters.",
    });
  
  if (typeof data.capacity !== "number")
    return next({ status: 400, message: "'capacity' must be a number." });
    
  if (data.capacity < 1)
    return next({
      status: 400,
      message: "capacity must be at least 1 person.",
    });

  res.locals.table = data;
  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (!table) {
    return next({
      status: 404,
      message: `table id: ${table_id} does not exist.`,
    });
  }

  res.locals.table = table;

  next();
}

async function validateReservationId(req, res, next) {
  const { reservation_id } = req.body.data;

  if (!reservation_id) {
    return next({
      status: 400,
      message: `Body must include { data: { reservation_id }}`,
    });
  }

  const reservation = await service.readReservation(Number(reservation_id));

  if (!reservation) {
    return next({
      status: 404,
      message: `reservation_id: ${reservation_id} does not exist`,
    });
  }

  res.locals.reservation = reservation;

  next();
}

async function validateSeating(req, res, next) {
  const { table } = res.locals;
  const { reservation } = res.locals;
  
  if(table.status === "occupied") {
      return next({ status: 400, message: "This table is occupied." });
  }

if(reservation.status === "seated") {
  return next({ status: 400, message: "This reservation is already seated." });
}

if(table.capacity < reservation.people) {
      return next({ status: 400, message: `This table does not have enough capacity to seat ${reservation.people} people` });
  }

  next();
}

async function validateSeated(req,res,next){
  const {status} = res.locals.table;
  if(status !== "occupied") {
        return next({ status: 400, message: "This table is not occupied." });
    }

    next();
}


async function list(req, res) {
  const data = await service.list();
  res.json({ data: data });
}

async function create(req, res) {
  const { table } = res.locals;

	if(table.reservation_id) {
		table.status = "occupied";
		await service.updateReservation(req.body.data.reservation_id, "seated");
	}
	else {
    	table.status = "free";
	}

  const data = await service.create(table);
  res.status(201).json({ data: data });
}

async function update(req, res) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.reservation;
  await service.updateTable(table_id, reservation_id, "occupied");
  await service.updateReservation(reservation_id, "seated");
  res.status(200).json({ data: "Seated"});
}

async function destroy(req, res) {
  const {reservation_id} = res.locals.table;
  const {table_id} = res.locals.table;
	await service.updateReservation(reservation_id, "finished");
  await service.updateTable(table_id, null, "free")
	
  res.status(200).json({ data: "Finished"});
}

module.exports = {
  list,
  create: [asyncErrorBoundary(validateTable), asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(validateBody),asyncErrorBoundary(tableExists), asyncErrorBoundary(validateReservationId), asyncErrorBoundary(validateSeating), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(validateSeated), asyncErrorBoundary(destroy)],
};
