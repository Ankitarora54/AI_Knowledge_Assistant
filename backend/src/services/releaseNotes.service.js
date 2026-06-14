const OpenAI =
require("openai");

const searchService =
require("./search.service");

const client =
new OpenAI({
    apiKey:
        process.env.OPENAI_API_KEY
});

async function generateReleaseNotes(
    release,
    selection = {}
){

    const results =
        await searchService
            .semanticSearchGrouped(
                release,
                selection
            );

    const jiraContext =
        results.jira
            ?.slice(0,10)
            .map(
                x => x.content
            )
            .join("\n\n")
            || "";

    const commitContext =
        results.commits
            ?.slice(0,10)
            .map(
                x => x.content
            )
            .join("\n\n")
            || "";

    const confluenceContext =
        results.confluence
            ?.slice(0,5)
            .map(
                x => x.content
            )
            .join("\n\n")
            || "";

    const context = `

RELEASE

${release}

JIRA

${jiraContext}

COMMITS

${commitContext}

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

You are a release manager.

Return ONLY JSON.

{
 "release":"",
 "executiveSummary":"",
 "newFeatures":[],
 "bugFixes":[],
 "technicalImprovements":[],
 "knownIssues":[],
 "deploymentNotes":[]
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
    generateReleaseNotes
};
