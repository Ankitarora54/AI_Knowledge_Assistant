const searchService =
require("./search.service");

async function analyzeCoverage(
    release
){

    const jira =
        await searchService
            .semanticSearchByType(
                release,
                "jira_story",
                100
            );

    const commits =
        await searchService
            .semanticSearchByType(
                release,
                "github_commit",
                100
            );

    const implemented = [];
    const missing = [];

    jira.forEach(story => {

        const found =
            commits.some(
                commit =>
                    commit.content
                        ?.toLowerCase()
                        .includes(
                            story.metadata
                                ?.issue_key
                                ?.toLowerCase()
                        )
            );

        if(found){

            implemented.push(
                story.metadata
                    ?.issue_key
            );

        }else{

            missing.push(
                story.metadata
                    ?.issue_key
            );
        }
    });

    return {
        implemented,
        missing
    };
}

module.exports = {
    analyzeCoverage
};