const axios =
require("axios");

async function getIssues(){

    const response =
        await axios.get(
            `${process.env.JIRA_URL}/rest/api/3/search`
        );

    return response.data;
}

module.exports = {
    getIssues
};