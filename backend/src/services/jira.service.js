const pool =
require("../config/db");

async function getIssues(){

    const result =
        await pool.query(
`
SELECT *
FROM jira_issues
`
);

    return result.rows.map(
        issue => ({

            key:
                issue.issue_key,

            fields:{

                summary:
                    issue.summary,

                description:
                    issue.description,

                status:{
                    name:
                        issue.status
                },

                issuetype:{
                    name:
                        issue.issue_type
                },

                project:{
                    key:
                        issue.metadata?.module
                            || "FUND"
                }
            }
        })
    );
}

module.exports = {
    getIssues
};