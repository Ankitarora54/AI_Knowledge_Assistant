// console.log("JIRA INDEXER LOADED");
const jiraService =
require("../services/jira.service");

const embeddingService =
require("../services/embedding.service");

const documentRepo =
require("../repositories/document.repository");

const embeddingRepo =
require("../repositories/embedding.repository");


function extractDescription(
    description
        ){

            if(!description)
                return "";

            try{

                return JSON.stringify(
                    description
                );

            }catch{

                return "";
            }
        }

async function indexIssues(){

    // console.log(
    //     "INDEX ISSUES STARTED"
    // );

    const issues =
        await jiraService.getIssues();
    
    //     console.log(
    //     "ISSUES FOUND:",
    //     issues.length
    // );

    let issuesIndexed = 0;

    for(const issue of issues){

        try{
            // console.log(
            //     "PROCESSING:",
            //     issue.key
            // );

        const content = `

            Issue Key:
            ${issue.key}

            Summary:
            ${issue.fields.summary}

            Description:
                ${extractDescription(
                    issue.fields.description
                )}

            Status:
            ${issue.fields.status?.name}

            Issue Type:
            ${issue.fields.issuetype?.name}

            `;

        const metadata = {

                issue_key:
                    issue.key,

                project:
                    issue.fields.project?.key,

                status:
                    issue.fields.status?.name,

                issue_type:
                    issue.fields.issuetype?.name,

                priority:
                    issue.fields.priority?.name,

                assignee:
                    issue.fields.assignee?.displayName,

                reporter:
                    issue.fields.reporter?.displayName
                };

        const existingEmbedding =
            await embeddingRepo
                .findByDocumentId(
                    document.id
                );

        if(existingEmbedding){

            console.log(
                "Embedding already exists"
            );

            continue;
        }

        const document =
            await documentRepo
                .createDocument(

                    issue.key,

                    content,

                    "jira_story",

                    metadata
                );
        // console.log(
        //         "AFTER CREATE DOCUMENT"
        //     );

        // console.log("Before generateEmbedding:", issue.key);
        
        const embedding =
            await embeddingService
                .generateEmbedding(
                    content
                );

        // console.log( "After generateEmbedding:", issue.key);

        await embeddingRepo
            .saveEmbedding(

                content,

                embedding,

                "jira_story",

                metadata,

                document.id
            );

        issuesIndexed++;
        }
        catch(error){
            console.error(`Error indexing issue ${issue.key}:`, error.message);
        }
    }

    return {

        issuesIndexed
    };
}

module.exports = {
    indexIssues
};