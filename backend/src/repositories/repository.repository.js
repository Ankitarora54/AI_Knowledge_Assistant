const pool =
require("../config/db");

async function listRepositories(){

    const result =
        await pool.query(
`
SELECT
    metadata->>'repository' AS name,
    COUNT(DISTINCT metadata->>'file_path') FILTER (
        WHERE metadata->>'file_path' IS NOT NULL
    )::int AS file_count,
    COUNT(*)::int AS chunk_count
FROM embeddings
WHERE metadata->>'repository' IS NOT NULL
  AND metadata->>'repository' <> ''
GROUP BY metadata->>'repository'
ORDER BY metadata->>'repository'
`
);

    return result.rows.map(row => ({
        name: row.name,
        fileCount: row.file_count,
        chunkCount: row.chunk_count
    }));
}

async function getRepositoryFiles(
    repository
){

    const result =
        await pool.query(
`
SELECT
    metadata->>'file_path' AS path,
    COUNT(*)::int AS chunk_count
FROM embeddings
WHERE metadata->>'repository' = $1
  AND metadata->>'file_path' IS NOT NULL
  AND metadata->>'file_path' <> ''
GROUP BY metadata->>'file_path'
ORDER BY metadata->>'file_path'
`,
[repository]
);

    return result.rows.map(row => ({
        path: row.path,
        chunkCount: row.chunk_count
    }));
}

async function getRepositoryChunks(
    repository
){

    const result =
        await pool.query(
`
SELECT *
FROM embeddings
WHERE metadata->>'repository'=$1
LIMIT 200
`,
[repository]
);

    return result.rows;
}

module.exports = {
    listRepositories,
    getRepositoryFiles,
    getRepositoryChunks
};
