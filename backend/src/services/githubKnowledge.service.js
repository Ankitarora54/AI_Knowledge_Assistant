const codeIndexer =
    require("../indexers/github.indexer");

const commitIndexer =
    require("../indexers/github.commit.indexer");

const prIndexer =
    require("../indexers/github.pr.indexer");

const commentIndexer =
    require("../indexers/github.comments.indexer");

async function indexRepositoryKnowledge(
    owner,
    repo
){

    const code =
        await codeIndexer.indexRepository(
            owner,
            repo
        );

    const commits =
        await commitIndexer.indexCommits(
            owner,
            repo
        );
    
    let prs = 0;
    let comments = 0;
    try {
        const prs =
            await prIndexer.indexPullRequests(
                owner,
                repo
            );

        const comments =
            await commentIndexer.indexComments(
                owner,
                repo
            );
        } catch (err) {

        console.error(
            "Error indexing PRs or comments",
            err
        );
    }
    return {
        code,
        commits,
        prs,
        comments
    };
}

module.exports = {
    indexRepositoryKnowledge
};