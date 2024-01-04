const client = require("./db");

class User {
    constructor(email, name, password, id, avatar) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.id = id;
        this.avatar = avatar;
    }

    static fromJSON(data) {
        return new User(data.id, data.email, data.name, data.id, data.avatar);
    }

    static async findById(id) {
        try {
            return (await client.query(`SELECT * FROM "user" WHERE "user".id = ${id}`)).rows[0];
        } catch (err) {
            throw err;
        }
    }

    static async findOne(email) {
        try {
            return (await client.query(`SELECT * FROM "user" WHERE "user".email = '${email}'`)).rows[0];
        } catch (err) {
            throw err;
        }
    }

    async save() {
        try {
            await client.query(`INSERT INTO "user" (email, name, id, password) values ('${this.email}', '${this.name}', DEFAULT, '${this.password}');`);
        } catch (err) {
            throw err;
        }
    }

    async update(userId, name, avatar) {
        try {
            await client.query(`UPDATE "user" SET name='${name}', avatar='${avatar}' WHERE id = ${userId};`);
        } catch (err) {
            throw err;
        }
    }

    async addToCart(course) {
        try {
            const items = (await client.query(`SELECT * FROM cart WHERE userid = ${this.id}`)).rows;
            const courseId = items.find(c => {
                return c.courseid === course.id;
            });
            if (courseId) {
                await client.query(`UPDATE cart SET count=count+1 WHERE courseid = ${course.id} AND userid = ${this.id};`);
            } else {
                await client.query(`INSERT INTO cart (userid, courseid, count) values ('${this.id}', ${course.id}, 1);`);
            }
        } catch (err) {
            throw err;
        }
    }

    async removeFromCart(courseId) {
        try {
            const items = (await client.query(`SELECT * FROM cart WHERE userid = ${this.id}`)).rows;
            const cart = items.find(c => {
                if (c.courseid == courseId) {
                    return c.count;
                }
            });
            if (cart.count === 1) {
                await client.query(`DELETE FROM cart WHERE courseid = ${courseId} AND userid = ${this.id};`);
            } else {
                await client.query(`UPDATE cart SET count=count-1 WHERE courseid = ${courseId} AND userid = ${this.id};`);
            }
        } catch (err) {
            throw err;
        }
    }

    async clearCart() {
        try {
            await client.query(`DELETE FROM cart WHERE userid = ${this.id};`)
        } catch (err) {
            throw err;
        }
    }
}

module.exports = User;