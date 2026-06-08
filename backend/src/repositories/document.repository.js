const pool = require("../config/db");

async function createDocument(
    title,
    content,
    sourceType,
    metadata
) {

    const result = await pool.query(
        `
        INSERT INTO documents
        (
            title,
            content,
            source_type,
            metadata
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4
        )
        RETURNING *
        `,
        [
            title,
            content,
            sourceType,
            JSON.stringify(metadata)
        ]
    );

    return result.rows[0];
}

module.exports = {
    createDocument
};