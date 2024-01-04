const client = require("./db");

class Order {
    constructor(userId, date) {
        this.userId = userId;
        this.date = date;
    }

    async save() {
        try {
            await client.query(`INSERT INTO "order" (userid, date) VALUES (${this.userId}, to_timestamp(${this.date} / 1000.0));`);
        } catch (err) {
            throw err;
        }
    }

    static async getOrderId(userId) {
        try {
            return (await client.query(`SELECT id FROM "order" WHERE userid = ${userId} ORDER BY id DESC LIMIT 1`)).rows[0].id;
        } catch (err) {
            throw err;
        }
    }

    static async findByUserId(userId) {
        try {
            return (await client.query(`SELECT * FROM "order" WHERE userid = ${userId};`)).rows;
        } catch (err) {
            throw err;
        }
    }

    static fromJSON(data) {
        return new Order(data.userid, data.date);
    }
}

module.exports = Order;