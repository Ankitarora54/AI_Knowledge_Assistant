const pool =
require("../config/db");

async function impactAnalysis(file){

    const upstream =
        await pool.query(
`
SELECT *
FROM dependency_edges
WHERE target_file=$1
`,
[file]
);

    const downstream =
        await pool.query(
`
SELECT *
FROM dependency_edges
WHERE source_file=$1
`,
[file]
);

    const riskScore =
        upstream.rows.length +
        downstream.rows.length;

    return {

        file,

        upstreamCount:
            upstream.rows.length,

        downstreamCount:
            downstream.rows.length,

        risk:
            riskScore > 20
                ? "HIGH"
                : riskScore > 10
                ? "MEDIUM"
                : "LOW",

        upstream:
            upstream.rows,

        downstream:
            downstream.rows
    };
}

module.exports = {
    impactAnalysis
};