const pool =
require("../config/db");

async function impactAnalysis(
    fileName
){

    const upstream =
        await pool.query(
`
SELECT *
FROM dependency_edges
WHERE target_file = $1
`,
[fileName]
);

    const downstream =
        await pool.query(
`
SELECT *
FROM dependency_edges
WHERE source_file = $1
`,
[fileName]
);

    return {

        upstream:
            upstream.rows,

        downstream:
            downstream.rows,

        risk:
            downstream.rows.length > 10
                ? "HIGH"
                : "LOW"
    };
}

module.exports = {
    impactAnalysis
};