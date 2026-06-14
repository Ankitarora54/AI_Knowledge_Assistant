const searchService =
require("./search.service");

const impactService =
require("./impact.service");

const classifier =
require("./questionClassifier.service");

const fundAccountingAgent =
require("../agents/fundAccounting.agent");

const tradingAgent =
require("../agents/trading.agent");

const corporateActionsAgent =
require("../agents/corporateActions.agent");

const clientReportingAgent =
require("../agents/clientReporting.agent");

const regulatoryAgent =
require("../agents/regulatory.agent");

const portfolioAgent =
require("../agents/portfolioManager.agent");

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


async function explain(
    question,
    selection = {}
){

    const searchResults =
        await searchService
            .semanticSearchGrouped(
                question,
                selection
            );
    let impact = {
    upstream:[],
    downstream:[]
    };

    try{

        impact =
            await impactService
                .impactAnalysis(
                    question
                );

    }catch(error){

        console.log(
            "Impact analysis skipped"
        );
    }

    const codeContext =
        searchResults.code
            .slice(0,5)
            .map(x=>x.content)
            .join("\n\n");

    const commitContext =
        searchResults.commits
            .slice(0,5)
            .map(x=>x.content)
            .join("\n\n");

    const prContext =
        searchResults.prs
            .slice(0,5)
            .map(x=>x.content)
            .join("\n\n");

    const commentContext =
        searchResults.comments
            .slice(0,5)
            .map(x=>x.content)
            .join("\n\n");

    const domain =
            classifier.classify(
                question
            );
   
    // console.log("JIRA Context Start");
   
    const jiraContext =
    searchResults.jira?.slice(0,2)
        .map(
                x =>
            `
            TITLE:
            ${
                x.metadata?.issue_key ||
                x.metadata?.module ||
                "Unknown"
            }

            ${x.content}
            `
            )
        .join("\n\n")
        || "";

    const confluenceContext =
        searchResults.confluence
            ?.slice(0,3)
            .map(
                x => x.content
            )
            .join("\n\n")
            || "";

        
    const context = `

            QUESTION

            ${question}

            ACTIVE REPOSITORY

            ${selection.repository || "Not selected"}

            ACTIVE FILE

            ${selection.file || "Not selected"}

            CODE

            ${codeContext}

            COMMITS

            ${commitContext}

            PULL REQUESTS

            ${prContext}

            COMMENTS

            ${commentContext}

            UPSTREAM

            ${JSON.stringify(
                impact.upstream
            )}

            DOWNSTREAM

            ${JSON.stringify(
                impact.downstream
            )}

            JIRA STORIES

            ${jiraContext}

            CONFLUENCE DOCUMENTATION

            ${confluenceContext}

            `;
    
    
    console.log("DOMAIN:",domain);
    console.log("Code Chunks:", searchResults.code.length);
    console.log("Commit Chunks:", searchResults.commits.length);
    console.log("PR Chunks:", searchResults.prs.length);
    console.log("Comment Chunks:", searchResults.comments.length);
    console.log("Jira Chunks:", searchResults.jira.length);
    console.log("Confluence Chunks:", searchResults.confluence.length);

    let systemPrompt;

    switch(domain){
    case "fundAccounting":
        systemPrompt =
            fundAccountingAgent
                .buildPrompt();
        break;
    case "trading":
        systemPrompt =
            tradingAgent
                .buildPrompt();
        break;
    case "corporateActions":
        systemPrompt =
            corporateActionsAgent
                .buildPrompt();
        break;
    case "clientReporting":
        systemPrompt =
            clientReportingAgent
                .buildPrompt();
        break;

    case "regulatory":
        systemPrompt =
            regulatoryAgent
                .buildPrompt();
        break;

    case "portfolioManager":
        systemPrompt =
            portfolioAgent
                .buildPrompt();
        break;

    default:

        systemPrompt = `
            You are a senior software architect.

            Return ONLY JSON.

            Required format:

            {
            "businessPurpose":"",
            "technicalSummary":"",
            "historicalEvolution":"",
            "upstreamDependencies":[],
            "downstreamDependencies":[],
            "relatedChanges":[],
            "risks":[],
            "futureEnhancements":[]
            }
            `;
    }

    const userPrompt = `DOMAIN ${domain}  ${context}`;

    const response =
        await client.chat.completions.create({

            model:"gpt-4.1",

            response_format:{
                type:"json_object"
            },

            messages:[

                {
                    role:"system",

                    content:systemPrompt
                                },

                                {
                                    role:"user",

                                    content:userPrompt
                                }
                            ]
                        });

                    // return JSON.parse(
                    //     response
                    //         .choices[0]
                    //         .message
                    //         .content
                    // );
                    try{

                        return JSON.parse(
                            response
                                .choices[0]
                                .message
                                .content
                        );

                    }catch(error){

                        console.error(
                            "JSON Parse Error",
                            error
                        );

                        return {

                            rawResponse:
                                response
                                    .choices[0]
                                    .message
                                    .content
                        };
                    }

                }

module.exports = {
    explain
};
