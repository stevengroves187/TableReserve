const knex = require("../db/connection");

const tableName = "tables";

function list() {
 return knex(tableName);
}

function read(table_id) {
    return knex(tableName)
        .select("*")
        .where({ table_id: table_id })
        .first();
}

function create(newTable) {
    return knex(tableName).insert(newTable).returning("*").then((createdTable) => createdTable[0]);
}

module.exports = {
    list,
    read,
    create,
};