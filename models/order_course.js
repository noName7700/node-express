const client = require("./db");

class Order_Course {
    constructor(orderId, courseId, count) {
        this.orderId = orderId;
        this.courseId = courseId;
        this.count = count;
    }

    async save() {
        try {
            await client.query(`INSERT INTO "order_course" (orderid, courseid, count) VALUES (${this.orderId}, ${this.courseId}, ${this.count});`);
        } catch (err) {
            throw err;
        }
    }

    static async findCoursesByOrderId(orderId) {
        try {
            return (await client.query(`SELECT * FROM order_course WHERE orderid = ${orderId}`)).rows;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Order_Course;