const OpenAI =
require("openai");

const searchService =
require("./search.service");

const client =
new OpenAI({
    apiKey:
        process.env.OPENAI_API_KEY
});

async function generateReleaseSummary(
    repository
){

    const results =
        await searchService
            .semanticSearchGrouped(
                repository
            );

    const context = `

COMMITS

${JSON.stringify(
    results.commits
        .slice(0,10)
)}

JIRA

${JSON.stringify(
    results.jira
        .slice(0,10)
)}

`;

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
 "majorFeatures":[],
 "bugFixes":[],
 "technicalDebt":[],
 "releaseSummary":""
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
    generateReleaseSummary
};