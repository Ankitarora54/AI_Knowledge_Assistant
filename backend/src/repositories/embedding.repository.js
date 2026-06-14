const pool = require("../config/db");

async function saveEmbedding(
    content,
    embedding,
    docType,
    metadata,
    documentId
) {

    const vectorString =
        `[${embedding.join(",")}]`;

    const result =
        await pool.query(
            `
            INSERT INTO embeddings
            (
                document_id,
                content,
                embedding,
                doc_type,
                metadata
            )
            VALUES
            (
                $1,
                $2,
                $3::vector,
                $4,
                $5
            )
            RETURNING *
            `,
            [
                documentId,
                content,
                vectorString,
                docType,
                JSON.stringify(metadata)
            ]
        );

    return result.rows[0];
}

async function findSimilar(
    embedding,
    limit = 10,
    filters = {}
) {
    const vectorString = `[${embedding.join(",")}]`;
    const result = await pool.query(
        `
        SELECT
            id,
            content,
            doc_type,
            metadata,
            embedding <=> $1 AS distance
        FROM embeddings
        WHERE ($3::text IS NULL OR metadata->>'repository' = $3)
          AND ($4::text IS NULL OR metadata->>'file_path' = $4)
        ORDER BY embedding <=> $1
        LIMIT $2
        `,
        [
            vectorString,
            limit,
            filters.repository || null,
            filters.file || null
        ]
    );

    return result.rows;
}


async function findSimilarByType(
    embedding,
    docType,
    limit = 10,
    filters = {}
){

    const vectorString =
        `[${embedding.join(",")}]`;

    const result =
        await pool.query(
            `
            SELECT
                *
            FROM embeddings
            WHERE doc_type = $2
              AND ($4::text IS NULL OR metadata->>'repository' = $4)
              AND ($5::text IS NULL OR metadata->>'file_path' = $5)
            ORDER BY embedding <=> $1::vector
            LIMIT $3
            `,
            [
                vectorString,
                docType,
                limit,
                filters.repository || null,
                filters.file || null
            ]
        );

    return result.rows;
}


async function findByDocumentId(
    documentId
){

    const result =
        await pool.query(
`
SELECT *
FROM embeddings
WHERE document_id = $1
LIMIT 1
`,
[documentId]
);

    return result.rows[0];
}


async function findSimilarByTypeEmbedding(
    embedding,
    docType,
    limit = 10,
    filters = {}
){

    const vectorString =
        `[${embedding.join(",")}]`;

    const result =
        await pool.query(
`
SELECT
id,
document_id,
content,
doc_type,
metadata,
embedding <=> $1::vector AS distance
FROM embeddings
WHERE doc_type = $2
  AND ($4::text IS NULL OR metadata->>'repository' = $4)
  AND ($5::text IS NULL OR metadata->>'file_path' = $5)
ORDER BY embedding <=> $1::vector
LIMIT $3
`,
[
 vectorString,
 docType,
 limit,
 filters.repository || null,
 filters.file || null
]
);

    return result.rows;
}

async function findRelatedKnowledge(
    embedding,
    limitPerType = 5
){

    const vectorString =
        `[${embedding.join(",")}]`;

    const result =
        await pool.query(
`
SELECT *
FROM (
    SELECT
        e.document_id,
        e.content,
        e.doc_type,
        e.metadata,
        d.title,
        e.embedding <=> $1::vector AS distance,
        ROW_NUMBER() OVER (
            PARTITION BY e.doc_type
            ORDER BY e.embedding <=> $1::vector
        ) AS type_rank
    FROM embeddings e
    LEFT JOIN documents d
        ON d.id = e.document_id
    WHERE e.doc_type IN ('jira_story', 'confluence')
) ranked
WHERE type_rank <= $2
ORDER BY doc_type, distance
`,
[
 vectorString,
 limitPerType
]
);

    return result.rows;
}


module.exports = {
    saveEmbedding,
    findSimilar,
    findSimilarByType,
    findByDocumentId,
    findSimilarByTypeEmbedding,
    findRelatedKnowledge
};
