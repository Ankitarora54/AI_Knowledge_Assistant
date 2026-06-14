const embeddingService =
require("./embedding.service");

const embeddingRepository =
require("../repositories/embedding.repository");

const fileRepository =
require("../repositories/file.repository");

function cleanBaseUrl(value){
    if (
        !value ||
        value.includes("your-company") ||
        value.includes("yourcompany")
    ) {
        return "";
    }

    return value.replace(/\/+$/, "");
}

function extractLine(
    content,
    label
){
    const match =
        content?.match(
            new RegExp(
                `${label}:\\s*([^\\n\\r]+)`,
                "i"
            )
        );

    return match?.[1]?.trim() || "";
}

function excerpt(
    content,
    length = 280
){
    const normalized =
        content
            ?.replace(/\s+/g, " ")
            .trim()
            || "";

    return normalized.length > length
        ? `${normalized.substring(0, length)}...`
        : normalized;
}

function relevanceScore(
    distance
){
    return Number(
        Math.max(
            0,
            1 - Number(distance)
        ).toFixed(3)
    );
}

async function buildSearchText(
    requestBody
){
    const input =
        Object.entries(requestBody || {})
            .filter(([key, value]) =>
                !["repository"].includes(key) &&
                typeof value === "string" &&
                value.trim()
            )
            .map(([key, value]) =>
                `${key}: ${value.trim()}`
            );

    if (requestBody?.repository) {
        input.push(
            `repository: ${requestBody.repository}`
        );
    }

    if (requestBody?.file) {
        const chunks =
            await fileRepository.getFileChunks(
                requestBody.file,
                requestBody.repository
            );

        const fileContext =
            chunks
                .slice(0, 8)
                .map(row => row.content)
                .join("\n")
                .substring(0, 8000);

        if (fileContext) {
            input.push(
                `selected file content:\n${fileContext}`
            );
        }
    }

    return input.join("\n\n");
}

function formatJiraStory(
    row
){
    const issueKey =
        row.metadata?.issue_key ||
        row.title ||
        "Unknown issue";

    const jiraUrl =
        cleanBaseUrl(
            process.env.JIRA_URL
        );

    return {
        issueKey,
        summary:
            extractLine(
                row.content,
                "Summary"
            ) ||
            row.title ||
            excerpt(row.content, 160),
        status:
            row.metadata?.status ||
            extractLine(
                row.content,
                "Status"
            ) ||
            null,
        issueType:
            row.metadata?.issue_type ||
            extractLine(
                row.content,
                "Issue Type"
            ) ||
            null,
        priority:
            row.metadata?.priority ||
            null,
        relevance:
            relevanceScore(
                row.distance
            ),
        url:
            jiraUrl
                ? `${jiraUrl}/browse/${issueKey}`
                : null
    };
}

function formatConfluencePage(
    row
){
    const pageId =
        row.metadata?.page_id ||
        row.document_id;

    const confluenceUrl =
        cleanBaseUrl(
            process.env.CONFLUENCE_URL
        );

    return {
        pageId,
        title:
            row.title ||
            row.metadata?.title ||
            `Confluence page ${pageId}`,
        excerpt:
            excerpt(
                row.content
            ),
        relevance:
            relevanceScore(
                row.distance
            ),
        url:
            confluenceUrl && pageId
                ? `${confluenceUrl}/wiki/pages/viewpage.action?pageId=${pageId}`
                : null
    };
}

function uniqueBy(
    rows,
    getKey
){
    const seen =
        new Set();

    return rows.filter(row => {
        const key =
            getKey(row);

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

async function findRelatedKnowledge(
    requestBody
){
    const searchText =
        await buildSearchText(
            requestBody
        );

    if (!searchText) {
        return {
            jiraStories: [],
            confluencePages: []
        };
    }

    const embedding =
        await embeddingService
            .generateEmbedding(
                searchText
            );

    const rows =
        await embeddingRepository
            .findRelatedKnowledge(
                embedding,
                15
            );

    const jiraRows =
        uniqueBy(
            rows.filter(row =>
                row.doc_type ===
                "jira_story"
            ),
            row =>
                row.metadata?.issue_key ||
                row.document_id
        ).slice(0, 5);

    const confluenceRows =
        uniqueBy(
            rows.filter(row =>
                row.doc_type ===
                "confluence"
            ),
            row =>
                row.metadata?.page_id ||
                row.document_id
        ).slice(0, 5);

    return {
        jiraStories:
            jiraRows
                .map(
                    formatJiraStory
                ),
        confluencePages:
            confluenceRows
                .map(
                    formatConfluencePage
                )
    };
}

module.exports = {
    findRelatedKnowledge
};
