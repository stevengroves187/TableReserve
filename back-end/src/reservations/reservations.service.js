const knex = require("../db/connection");

const tableName = "reservations";

function list(date, mobile_number) {
	if(date) {
		return knex(tableName)
			.select("*")
			.where({ reservation_date: date })
			.orderBy("reservation_time", "asc");
	}

	if(mobile_number) {
		return knex(tableName)
			.select("*")
			.where('mobile_number', 'like', `${mobile_number}%`);
	}

	return knex(tableName)
		.select("*");
}

function create(newReservation) {
    return knex(tableName).insert(newReservation).returning("*").then((createdReservation) => createdReservation[0]);
}

function read(reservation_id) {
    return knex(tableName)
        .select("*")
        .where({ reservation_id })
        .first();
}

function updateStatus(reservation_id, status) {
    return knex(tableName)
        .where({ reservation_id})
        .update({ status });
}

function update(reservation_id, reservation) {
	return knex(tableName)
		.where({ reservation_id })
		.update({ ...reservation })
		.returning("*");
}


module.exports = {
    list,
    read,
    create,
    update,
    updateStatus,
};