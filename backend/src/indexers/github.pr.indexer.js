const githubService =
require("../services/github.service");

const documentRepo =
require("../repositories/document.repository");

const embeddingRepo =
require("../repositories/embedding.repository");

const embeddingService =
require("../services/embedding.service");

async function indexPullRequests(
    owner,
    repo
){

    const prs =
        await githubService.getPullRequests(
            owner,
            repo
        );

    let count = 0;

    for(const pr of prs){
        
        if(!pr.number){

        console.log(
            "Skipping invalid PR",
            pr
        );

        continue;
        }

        const text = `
        PR #${pr.number}

        Title:
        ${pr.title}

        Description:
        ${pr.body || ""}
        `;

        const document =
            await documentRepo.createDocument(

                pr.title,

                text,

                "github_pr",

                {
                    repository: repo,
                    pr_number: pr.number
                }
            );

        const embedding =
            await embeddingService.generateEmbedding(
                text
            );

        await embeddingRepo.saveEmbedding(

            text,

            embedding,

            "github_pr",

            {
                repository: repo,
                pr_number: pr.number
            },

            document.id
        );

        count++;
    }

    return count;
}

module.exports = {
    indexPullRequests
};