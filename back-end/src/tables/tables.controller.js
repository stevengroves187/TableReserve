const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function validateTable(req, res, next) {
  const requiredProperties = [
    "table_name",
    "capacity",
  ];
  const { data } = req.body;
  if (!data) return next({ status: 400, message: "Data is required" });

  requiredProperties.forEach((property) => {
    const value = data[property];
    if (!value) {
      return next({status: 400, message: `A '${property}' property is required.`});
    }
  });
  if (data.table_name.length < 2) return next({ status: 400, message: "table_name must be at least 2 characters." });
  if (typeof data.capacity !== 'number') return next ({status: 400, message: "'capacity' must be a number."});
  if (data.capacity < 1) return next({ status: 400, message: "capacity must be at least 1 person." });

  res.locals.table = data;
  next();
}

async function list(req, res) {
  const data = await service.list();
  res.json({data: data});
}

async function create(req, res) {
  const { table } = res.locals;
  const data = await service.create(table);
  res.status(201).json({data: data});
}

async function update(req,res){

}

module.exports = {
  list,
  create: [asyncErrorBoundary(validateTable), asyncErrorBoundary(create)],
};
