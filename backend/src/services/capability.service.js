const pool =
require("../config/db");

async function getCapability(
    capability
){

    const result =
        await pool.query(
`
SELECT *
FROM business_capabilities
WHERE capability_name=$1
`,
[capability]
);

    return result.rows;
}

module.exports = {
    getCapability
};