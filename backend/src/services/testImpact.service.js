const pool =
require("../config/db");

async function analyze(
    component
){

    const result =
        await pool.query(
`
SELECT *
FROM test_mapping
WHERE component_name=$1
`,
[component]
);

    return result.rows;
}

module.exports = {
    analyze
};