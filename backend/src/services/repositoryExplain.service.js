const pool =
require("../config/db");

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function explainRepository(
    repository
){

    const result =
        await pool.query(
`
SELECT content
FROM embeddings
WHERE metadata->>'repository' = $1
LIMIT 50
`,
[repository]
);

    const context =
        result.rows
            .map(x=>x.content)
            .join("\n");

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
Return:

{
 purpose:"",
 architecture:"",
 modules:[],
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
    explainRepository
};