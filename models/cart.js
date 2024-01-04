const path = require("path");
const fs = require("fs");

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
)
const client = require("./db");

class Cart {
    constructor(userId, courseId, count) {
        this.userId = userId;
        this.courseId = courseId;
        this.count = count;
    }

    static fromJSON(data) {
        return new Cart(data.userid, data.courseid, data.count);
    }

    static async getItems(userId) {
        try {
            return (await client.query(`SELECT * FROM cart WHERE userid = ${userId}`)).rows;
        } catch (err) {
            throw err;
        }
    }

    async getCourse() {
        try {
            return (await client.query(`SELECT * FROM course WHERE id = ${this.courseId}`)).rows;
        } catch (err) {
            throw err;
        }
    }

    static async remove(id) {
        const card = await Card.fetch();
        const idx = card.courses.findIndex(c => c.id === id);
        const course = card.courses[idx];
        if (course.count === 1) {
            card.courses = card.courses.filter(c => c.id !== id);
        } else {
            card.courses[idx].count--;
        }
        
        card.price -= course.price;
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(card);
                }
            })
        });
    }
}

module.exports = Cart;