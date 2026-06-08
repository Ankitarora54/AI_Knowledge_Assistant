const githubService =
    require("../services/github.service");

const documentRepo =
    require("../repositories/document.repository");

const embeddingRepo =
    require("../repositories/embedding.repository");

const embeddingService =
    require("../services/embedding.service");

async function indexCommits(
    owner,
    repo
) {

    const commits =
        await githubService.getCommits(
            owner,
            repo
        );

    let indexed = 0;

    for(const commit of commits){

        const text = `
Commit Hash:
${commit.sha}

Author:
${commit.commit.author.name}

Message:
${commit.commit.message}
`;

        const document =
            await documentRepo.createDocument(
                commit.sha,
                text,
                "github_commit",
                {
                    repository: repo,
                    commit_hash: commit.sha,
                    author:
                        commit.commit.author.name
                }
            );

        const embedding =
            await embeddingService.generateEmbedding(
                text
            );

        await embeddingRepo.saveEmbedding(
            text,
            embedding,
            "github_commit",
            {
                repository: repo,
                commit_hash: commit.sha
            },
            document.id
        );

        indexed++;
    }

    return indexed;
}

module.exports = {
    indexCommits
};

// const githubService =
//     require("../services/github.service");

// const documentRepo =
//     require("../repositories/document.repository");

// const embeddingRepo =
//     require("../repositories/embedding.repository");

// const embeddingService =
//     require("../services/embedding.service");

// async function indexCommits(
//     owner,
//     repo
// ) {

//     const commits =
//         await githubService.getCommits(
//             owner,
//             repo
//         );

//     let count = 0;

//     for(const commit of commits){

//         const text = `
//             Commit: ${commit.sha}

//             Author:
//             ${commit.commit.author.name}

//             Message:
//             ${commit.commit.message}
//         `;

//         const document =
//             await documentRepo.createDocument(

//                 commit.sha,

//                 text,

//                 "github_commit",

//                 {
//                     repository: repo,
//                     commit_hash: commit.sha
//                 }
//             );

//         const embedding =
//             await embeddingService.generateEmbedding(
//                 text
//             );

//         await embeddingRepo.saveEmbedding(

//             text,

//             embedding,

//             "github_commit",

//             {
//                 repository: repo,
//                 commit_hash: commit.sha
//             },

//             document.id
//         );

//         count++;
//     }

//     return count;
// }

// module.exports = {
//     indexCommits
// };