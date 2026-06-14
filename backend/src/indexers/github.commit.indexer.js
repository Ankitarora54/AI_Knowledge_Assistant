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
                        Repository:
                        ${repo}

                        Commit Hash:
                        ${commit.sha}

                        Author:
                        ${commit.commit.author.name}

                        Commit Date:
                        ${commit.commit.author.date}

                        Message:
                        ${commit.commit.message}

                        `;

    const existing =
        await documentRepo
            .findByTitle(
                commit.sha
            );

    if(existing){

        console.log(
            "Commit already indexed:",
            commit.sha
        );

        continue;
    }

        const document =
            await documentRepo.createDocument(
                commit.sha,
                text,
                "github_commit",
                {
                    repository: repo,

                    commit_hash:
                        commit.sha,

                    commit_message:
                        commit.commit.message,

                    author:
                        commit.commit.author.name,

                    commit_date:
                        commit.commit.author.date
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

                commit_hash:
                    commit.sha,

                commit_message:
                    commit.commit.message,

                author:
                    commit.commit.author.name,

                commit_date:
                    commit.commit.author.date
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

