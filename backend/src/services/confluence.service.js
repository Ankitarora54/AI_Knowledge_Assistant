const axios = require("axios");

const confluenceApi = axios.create({

    baseURL: process.env.CONFLUENCE_URL,

    headers: {
        Authorization: `Basic ${process.env.CONFLUENCE_TOKEN}`,
        Accept: "application/json"
    }

});

async function getPages(limit = 100) {

    const response =
        await confluenceApi.get(
            "/wiki/api/v2/pages",
            {
                params: {
                    limit
                }
            }
        );

    return response.data.results;
}

async function getPageContent(pageId) {

    const response =
        await confluenceApi.get(
            `/wiki/api/v2/pages/${pageId}`
        );

    return response.data;
}

module.exports = {
    getPages,
    getPageContent
};