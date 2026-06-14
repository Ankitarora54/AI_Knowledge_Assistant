const pool =
require("../config/db");

async function getTimeline(
    repository
){
    console.log(
        "Repository:",
        repository
    );

    const result =
        await pool.query(
`
SELECT
title,
metadata
FROM documents
WHERE source_type='github_commit'
AND metadata->>'repository' = $1
ORDER BY created_at DESC
LIMIT 100
`,
[String(repository)]
);

    return result.rows;
}


async function summarizeTimeline(
    repository
){

    const commits =
        await getTimeline(
            repository
        );

    const context =
        commits
            .map(
                x=>x.title
            )
            .join("\n");

    const response =
        await openai.chat.completions.create({

            model:"gpt-4.1",

            response_format:{
                type:"json_object"
            },

            messages:[{
                role:"user",
                content:`
Generate release timeline.

${context}
`
            }]
        });

    return JSON.parse(
        response
            .choices[0]
            .message
            .content
    );
}


module.exports = {
    getTimeline,summarizeTimeline
};