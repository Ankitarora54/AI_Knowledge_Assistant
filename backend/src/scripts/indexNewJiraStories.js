require("dotenv").config();
const pool =
require("../config/db");

const embeddingService =
require("../services/embedding.service");

const embeddingRepo =
require("../repositories/embedding.repository");

async function run(){

    const result =
        await pool.query(
`
SELECT *
FROM documents
WHERE source_type='jira_story'
AND title IN
(
 'TRD-301',
 'CA-401',
 'REP-501'
)
`
);

    for(const row of result.rows){

        const embedding =
            await embeddingService
                .generateEmbedding(
                    row.content
                );

        await embeddingRepo
            .saveEmbedding(

                row.content,

                embedding,

                "jira_story",

                row.metadata,

                row.id
            );

        console.log(
            "Indexed:",
            row.title
        );
    }
}

run();