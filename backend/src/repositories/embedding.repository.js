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
    limit = 10
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
        ORDER BY embedding <=> $1
        LIMIT $2
        `,
        [
            vectorString,
            limit
        ]
    );

    return result.rows;
}


async function findSimilarByType(
    embedding,
    docType,
    limit = 10
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
            ORDER BY embedding <=> $1::vector
            LIMIT $3
            `,
            [
                vectorString,
                docType,
                limit
            ]
        );

    return result.rows;
}


module.exports = {
    saveEmbedding,
    findSimilar,
    findSimilarByType
};