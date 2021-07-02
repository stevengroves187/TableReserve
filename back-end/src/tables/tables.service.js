const knex = require("../db/connection");

const tableName = "tables";

function list() {
  return knex(tableName);
}

function read(table_id) {
  return knex(tableName).select("*").where({ table_id }).first();
}

function readReservation(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first();
}

function create(newTable) {
  return knex(tableName)
    .insert(newTable)
    .returning("*")
    .then((createdTable) => createdTable[0]);
}

function updateTable(table_id, reservation_id, status) {
    return knex(tableName)
    .where({ table_id })
    .update({ reservation_id: reservation_id , status: status });
}

function updateReservation(reservation_id, status) {
    return knex("reservations")
        .where({ reservation_id })
        .update({ status: status });
}

module.exports = {
  list,
  read,
  readReservation,
  create,
  updateTable,
  updateReservation,
};
