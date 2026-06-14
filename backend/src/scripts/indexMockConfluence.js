require("dotenv").config();

const pool =
require("../config/db");

const embeddingService =
require("../services/embedding.service");

const embeddingRepo =
require("../repositories/embedding.repository");

async function run(){

    const pages =
        await pool.query(
`
SELECT *
FROM documents
WHERE source_type='confluence'
`
);

    for(
        const page
        of pages.rows
    ){

        console.log(
            "Indexing:",
            page.title
        );

        const embedding =
            await embeddingService
                .generateEmbedding(
                    page.content
                );

        await embeddingRepo
            .saveEmbedding(

                page.content,

                embedding,

                "confluence",

                page.metadata,

                page.id
            );
    }

    console.log(
        "Confluence pages indexed"
    );
}

run();