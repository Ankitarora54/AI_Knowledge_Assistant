const pool =
require("../config/db");

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function explainFile(
    filePath,
    repository
){

    const result =
        await pool.query(
`
SELECT content
FROM embeddings
WHERE metadata->>'file_path' = $1
  AND ($2::text IS NULL OR metadata->>'repository' = $2)
LIMIT 10
`,
[filePath, repository || null]
);

    if (!result.rows.length) {
        return {
            error: "No indexed content was found for this file.",
            file: filePath,
            repository: repository || null
        };
    }

    const context =
        result.rows
            .map(x=>x.content)
            .join("\n\n");

    const response =
        await client.chat.completions.create({

            model:"gpt-4.1",

            response_format:{
                type:"json_object"
            },

            messages:[

                {
                    role:"system",

                    content:`
Return JSON:

{
 businessPurpose:"",
 technicalSummary:"",
 risks:[]
}
`
                },

                {
                    role:"user",

                    content:context
                }
            ]
        });

    return JSON.parse(
        response
            .choices[0]
            .message
            .content
    );
}

module.exports = {
    explainFile
};
