const githubService =
require("../services/github.service");

const documentRepo =
require("../repositories/document.repository");

const embeddingRepo =
require("../repositories/embedding.repository");

const embeddingService =
require("../services/embedding.service");

async function indexComments(
    owner,
    repo,
    prNumber
){

    const comments =
        await githubService.getPRComments(
            owner,
            repo,
            prNumber
        );

    if(!comments || comments.length === 0){

    console.log(
        "No comments found"
    );

    return 0;
    }
    for(const comment of comments){

        const text = comment.body;

        const document =
            await documentRepo.createDocument(

                `PR-${prNumber}`,

                text,

                "github_comment",

                {
                    repository: repo,
                    pr_number: prNumber
                }
            );

        const embedding =
            await embeddingService.generateEmbedding(
                text
            );

        await embeddingRepo.saveEmbedding(

            text,

            embedding,

            "github_comment",

            {
                repository: repo,
                pr_number: prNumber
            },

            document.id
        );
    }
}

module.exports = {
    indexComments
};