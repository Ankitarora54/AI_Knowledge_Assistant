const OpenAI =
require("openai");

const searchService =
require("./search.service");

const client =
new OpenAI({
    apiKey:
        process.env.OPENAI_API_KEY
});

async function analyzeIncident(
    incident,
    selection = {}
){

    const results =
        await searchService
            .semanticSearchGrouped(
                incident,
                selection
            );

    const jiraContext =
        results.jira
            ?.slice(0,5)
            .map(
                x => x.content
            )
            .join("\n\n")
            || "";

    const commitContext =
        results.commits
            ?.slice(0,5)
            .map(
                x => x.content
            )
            .join("\n\n")
            || "";

    const codeContext =
        results.code
            ?.slice(0,5)
            .map(
                x => x.content
            )
            .join("\n\n")
            || "";

    const confluenceContext =
        results.confluence
            ?.slice(0,3)
            .map(
                x => x.content
            )
            .join("\n\n")
            || "";

    const context = `

INCIDENT

${incident}

JIRA

${jiraContext}

COMMITS

${commitContext}

CODE

${codeContext}

CONFLUENCE

${confluenceContext}

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

You are a production support expert.

Return ONLY JSON.

{
 "incident":"",
 "likelyCauses":[],
 "relatedStories":[],
 "relatedCommits":[],
 "affectedSystems":[],
 "recommendedActions":[]
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
    analyzeIncident
};
