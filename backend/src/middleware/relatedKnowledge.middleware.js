const relatedKnowledgeService =
require("../services/relatedKnowledge.service");

const enrichedPaths =
new Set([
    "/orchestrate",
    "/explain",
    "/explain/file",
    "/impact",
    "/traceability/explain",
    "/architecture-review",
    "/release-notes",
    "/release-readiness",
    "/coverage",
    "/root-cause",
    "/test-impact",
    "/capability"
]);

function mergeResult(
    result,
    relatedKnowledge
){
    if (
        result &&
        typeof result === "object" &&
        !Array.isArray(result)
    ) {
        return {
            ...result,
            relatedKnowledge
        };
    }

    return {
        result,
        relatedKnowledge
    };
}

function relatedKnowledgeMiddleware(
    req,
    res,
    next
){
    const requestPath =
        req.path.replace(
            /^\/api/,
            ""
        );

    if (
        req.method !== "POST" ||
        !enrichedPaths.has(
            requestPath
        )
    ) {
        next();
        return;
    }

    const sendJson =
        res.json.bind(res);

    res.json = (body) => {
        if (res.statusCode >= 400) {
            return sendJson(body);
        }

        relatedKnowledgeService
            .findRelatedKnowledge(
                req.body
            )
            .then(relatedKnowledge =>
                sendJson(
                    mergeResult(
                        body,
                        relatedKnowledge
                    )
                )
            )
            .catch(error => {
                console.error(
                    "Related knowledge lookup failed:",
                    error.message
                );

                return sendJson(
                    mergeResult(
                        body,
                        {
                            jiraStories: [],
                            confluencePages: []
                        }
                    )
                );
            });

        return res;
    };

    next();
}

module.exports =
relatedKnowledgeMiddleware;
