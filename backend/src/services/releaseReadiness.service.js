const searchService =
require("./search.service");

async function assess(
    release
){

    const jira =
        await searchService
            .semanticSearchByType(
                release,
                "jira_story",
                50
            );

    const openStories =
        jira.filter(
            x =>
                x.metadata?.status !==
                "Done"
        );

    return {

        release,

        openStories:
            openStories.length,

        risk:
            openStories.length > 5
                ? "HIGH"
                : "LOW"
    };
}

module.exports = {
    assess
};