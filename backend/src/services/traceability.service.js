const documentRepo =
require("../repositories/document.repository");

const searchService =
require("./search.service");

const OpenAI =
require("openai");

const client =
new OpenAI({
    apiKey:
        process.env.OPENAI_API_KEY
});

async function traceRequirement(
    requirement
){

    const results =
        await searchService
            .semanticSearchGrouped(
                requirement
            );

    const jiraContext =
        results.jira
            .slice(0,3)
            .map(
                x => x.content
            )
            .join("\n\n");

    const commitContext =
        results.commits
        .slice(0,5)
        .map(
            x => ({

                hash:
                    x.metadata?.commit_hash,

                message:
                    x.metadata?.commit_message,

                author:
                    x.metadata?.author,

                date:
                    x.metadata?.commit_date
            })
        )
            .join("\n\n");

    const codeContext =
        results.code
            .slice(0,5)
            .map(
                x => x.content
            )
            .join("\n\n");

    const jiraSummary =
        results.jira
            .slice(0,3)
            .map(
                x => ({
                    issue:
                        x.metadata?.issue_key,

                    summary:
                        x.content
                            ?.substring(
                                0,
                                300
                            )
                })
            );

    const commitSummary =
        results.commits
            .slice(0,5)
            .map(
                x => ({
                    hash:
                        x.metadata?.commit_hash,

                    message:
                        x.metadata?.commit_message,

                    author:
                        x.metadata?.author
                })
            );

    const fileSummary =
        results.code
            .slice(0,10)
            .map(
                x => ({
                    file:
                        x.metadata?.file_path,

                    repository:
                        x.metadata?.repository
                })
            );


    console.log(
          "Jira Stories:",
          results.jira.length
      );

      console.log(
          "Commits:",
          results.commits.length
      );

      console.log(
          "Files:",
          results.code.length
      );

    const context = `

REQUIREMENT

${requirement}

JIRA STORIES

${JSON.stringify(
    jiraSummary,
    null,
    2
)}

COMMITS

${JSON.stringify(
    commitSummary,
    null,
    2
)}

FILES

${JSON.stringify(
    fileSummary,
    null,
    2
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

                          You are a senior software architect.

                          Your task is requirement traceability.

                          Use:

                          - Jira stories as business requirements
                          - Commits as implementation history
                          - Files as implementation evidence

                          Return ONLY JSON:

                          {
                            "requirement":"",
                            "businessPurpose":"",
                            "jiraStories":[],
                            "implementedByCommits":[],
                            "keyFiles":[],
                            "implementationApproach":"",
                            "releaseHistory":"",
                            "risks":[],
                            "futureEnhancements":[]
                          }

                          `
                },

                {
                    role:"user",

                    content:context
                }
            ]
        });

    try{

    return {

        requirement,

        jiraStories:
            jiraSummary,

        commits:
            commitSummary,

        files:
            fileSummary
    };

}catch(error){

    return {

        requirement,

        jiraStories:
            jiraSummary,

        commits:
            commitSummary,

        files:
            fileSummary
    };
  }
}


async function explainRequirement(
    requirement
){

    const results =
        await searchService
            .semanticSearchGrouped(
                requirement
            );

    const jiraContext =
        results.jira
            .slice(0,3)
            .map(
                x => x.content
            )
            .join("\n\n");

    const commitContext =
        results.commits
            .slice(0,5)
            .map(
                x => x.content
            )
            .join("\n\n");

    const codeContext =
        results.code
            .slice(0,5)
            .map(
                x => x.content
            )
            .join("\n\n");

    const jiraSummary =
        results.jira
            .slice(0,3)
            .map(
                x => ({
                    issue:
                        x.metadata?.issue_key,

                    summary:
                        x.content
                            ?.substring(
                                0,
                                300
                            )
                })
            );

    const commitSummary =
        results.commits
            .slice(0,5)
            .map(
                x => ({
                    hash:
                        x.metadata?.commit_hash,

                    message:
                        x.metadata?.commit_message,

                    author:
                        x.metadata?.author
                })
            );

    const fileSummary =
        results.code
            .slice(0,10)
            .map(
                x => ({
                    file:
                        x.metadata?.file_path,

                    repository:
                        x.metadata?.repository
                })
            );

    
    console.log(
        "TRACEABILITY EXPLAIN:",
        requirement
      );

      console.log(
        "Jira Matches:",
        results.jira.length
      );

      console.log(
        "Commit Matches:",
        results.commits.length
      );

      console.log(
        "Code Matches:",
        results.code.length
      );

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

You are a senior software architect.

Perform requirement traceability analysis.

Use:
- Jira stories as business requirements
- Commit messages as implementation history
- Source files as implementation evidence

Identify:
1. Why the feature was built
2. Which Jira stories drove it
3. Which commits implemented it
4. Which files contain the implementation
5. Risks and future enhancements

Return ONLY JSON.

{
  "requirement":"",
  "businessPurpose":"",
  "jiraStories":[],
  "implementedByCommits":[],
  "keyFiles":[],
  "implementationApproach":"",
  "releaseHistory":"",
  "risks":[],
  "futureEnhancements":[]
}

`
                },

                {
                    role:"user",

                    content:`

REQUIREMENT

${requirement}

JIRA STORIES

${JSON.stringify(
    jiraSummary,
    null,
    2
)}

COMMITS

${JSON.stringify(
    commitSummary,
    null,
    2
)}

FILES

${JSON.stringify(
    fileSummary,
    null,
    2
)}

`
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

async function traceStory(
    jiraKey
){

    const story =
        await documentRepo
            .findByTitle(
                jiraKey
            );

    if(!story){

        return {
            error:
                "Story not found"
        };
    }

    const results =
        await searchService
            .semanticSearchGrouped(
                story.content
            );

    const jiraSummary =
        results.jira
            .slice(0,3)
            .map(
                x => ({
                    issue:
                        x.metadata?.issue_key,

                    distance:
                        x.distance
                })
            );

    const commitSummary =
        results.commits
            .slice(0,5)
            .map(
                x => ({
                    hash:
                        x.metadata?.commit_hash,

                    message:
                        x.metadata?.commit_message,

                    author:
                        x.metadata?.author
                })
            );

    const fileSummary =
        results.code
            .slice(0,10)
            .map(
                x => ({
                    file:
                        x.metadata?.file_path,

                    repository:
                        x.metadata?.repository
                })
            );

    return {

        story:
            jiraKey,

        jiraStories:
            jiraSummary,

        commits:
            commitSummary,

        files:
            fileSummary
    };
}

async function explainStory(
    jiraKey
){

    const story =
        await documentRepo
            .findByTitle(
                jiraKey
            );

    if(!story){

        return {
            error:
                "Story not found"
        };
    }

    const traceability =
        await traceStory(
            jiraKey
        );

    const response =
        await client
            .chat
            .completions
            .create({

                model:
                    "gpt-4.1",

                response_format:{
                    type:
                    "json_object"
                },

                messages:[

                    {
                        role:
                        "system",

                        content:`

You are a senior software architect.

Return JSON:

{
 "jiraKey":"",
 "businessPurpose":"",
 "implementedByCommits":[],
 "keyFiles":[],
 "implementationApproach":"",
 "risks":[],
 "futureEnhancements":[]
}

`
                    },

                    {
                        role:
                        "user",

                        content:
                        JSON.stringify(
                            traceability,
                            null,
                            2
                        )
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
    traceRequirement,
    explainRequirement,
    traceStory,
    explainStory
};