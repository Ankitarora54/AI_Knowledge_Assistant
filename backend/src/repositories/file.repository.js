const pool =
require("../config/db");

async function getFileChunks(
    filePath,
    repository
){

    const result =
        await pool.query(
`
SELECT *
FROM embeddings
WHERE metadata->>'file_path' = $1
  AND ($2::text IS NULL OR metadata->>'repository' = $2)
`,
[filePath, repository || null]
);

    return result.rows;
}

module.exports = {
    getFileChunks
};
