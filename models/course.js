const client = require("./db");

class Course {
    constructor(title, price, img, userid) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.userid = userid;
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price, 
            img: this.img,
            id: this.id
        };
    }

    static async findByIdAndUpdate(id, course) {
        try {
            await client.query(`UPDATE course SET title='${course.title}', price='${course.price}', img='${course.img}' WHERE course.id = ${id};`);
        } catch (err) {
            throw err;
        }
    }

    async save() {
        try {
            await client.query(`INSERT INTO course (title, price, img, userId) values ('${this.title}', ${this.price}, '${this.img}', ${this.userid});`);
        } catch (err) {
            throw err;
        }
    }

    static async findAll() {
        try {
            return (await client.query('SELECT * FROM course')).rows;
        } catch (err) {
            throw err;
        }
    }

    static async findById(id) {
        try {
            return (await client.query(`SELECT * FROM course WHERE course.id = ${(id)}`)).rows[0];
        } catch (err) {
            throw err;
        }
    }

    static async deleteOne(id) {
        try {
            return (await client.query(`DELETE FROM course WHERE course.id = ${id};`));
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Course;