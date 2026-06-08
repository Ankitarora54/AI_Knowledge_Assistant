const axios = require("axios");

const githubApi = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
});

async function getRepoContents(owner, repo, path = "") {

    const response = await githubApi.get(
        `/repos/${owner}/${repo}/contents/${path}`
    );

    return response.data;
}

async function getFileContent(downloadUrl) {

    const response = await axios.get(downloadUrl);

    return response.data;
}

async function getCommits(owner, repo,page = 1) {

    const response = await githubApi.get(
        `/repos/${owner}/${repo}/commits`
        ,
            {
                params: {
                    page,
                    per_page: 100
                }
            }
    );

    return response.data;
}

async function getPullRequests(owner, repo) {

    const response = await githubApi.get(
        `/repos/${owner}/${repo}/pulls?state=all`
    );

    return response.data;
}

async function getAllFiles(
    owner,
    repo,
    path = ""
) {

    const items =
        await getRepoContents(
            owner,
            repo,
            path
        );

    let files = [];

    for (const item of items) {

        if (item.type === "file") {

            files.push(item);

        } else if (
            item.type === "dir"
        ) {

            const nestedFiles =
                await getAllFiles(
                    owner,
                    repo,
                    item.path
                );

            files =
                files.concat(
                    nestedFiles
                );
        }
    }

    return files;
}


async function getCommits(
    owner,
    repo,
    page = 1
) {

    const response =
        await githubApi.get(
            `/repos/${owner}/${repo}/commits?page=${page}&per_page=100`
        );

    return response.data;
}


async function getPRComments(
    owner,
    repo,
    prNumber
){

    const response =
        await githubApi.get(
            `/repos/${owner}/${repo}/issues/${prNumber}/comments`
        );

    return response.data;
}


module.exports = {
    getRepoContents,
    getFileContent,
    getAllFiles,
    getCommits,
    getPullRequests
    ,getPRComments
};