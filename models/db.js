const pg = require("pg");

const client = new pg.Client({
    host: 'localhost',
    port: 5432,
    database: 'courses-app',
    user: 'postgres',
    password: '0712',
});
client.connect();

module.exports = client;