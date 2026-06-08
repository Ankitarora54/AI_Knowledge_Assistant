const { Pool } = require("pg");

const pool = new Pool({

    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }

});

console.log(process.env.DATABASE_URL);

pool.query("SELECT NOW()")
    .then(() => {
        console.log("Supabase Connected");
    })
    .catch(err => {
        console.error("DB Error:", err);
    });

module.exports = pool;