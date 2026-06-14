const { Pool } = require("pg");

const connectionString =
    process.env.DATABASE_URL;

const localDatabase =
    /localhost|127\.0\.0\.1/i
        .test(connectionString || "");

const sslEnabled =
    process.env.DATABASE_SSL
        ? process.env.DATABASE_SSL === "true"
        : !localDatabase;

const pool = new Pool({

    connectionString,

    ssl: sslEnabled
        ? {
            rejectUnauthorized: false
        }
        : false

});

// console.log(process.env.DATABASE_URL);

pool.query("SELECT NOW()")
    .then(() => {
        console.log("Supabase Connected");
    })
    .catch(err => {
        console.error("DB Error:", err);
    });

module.exports = pool;
