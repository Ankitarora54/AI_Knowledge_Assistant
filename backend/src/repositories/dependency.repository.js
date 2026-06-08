const pool =
require("../config/db");

async function saveDependency(
    source,
    target,
    type
){

    await pool.query(
`
INSERT INTO dependency_edges
(
 source_file,
 target_file,
 dependency_type
)
VALUES
(
 $1,
 $2,
 $3
)
`,
[
 source,
 target,
 type
]
);
}

module.exports = {
    saveDependency
};