const embeddingService =
require("./embedding.service");

const embeddingRepo =
require("../repositories/embedding.repository");

async function semanticSearch(
    query,
    limit = 10
){

    const embedding =
        await embeddingService.generateEmbedding(
            query
        );

    const results =
        await embeddingRepo.findSimilar(
            embedding,
            limit
        );

    return results.map(
        result => ({

            score:
                Number(
                    (
                        1 - result.distance
                    ).toFixed(4)
                ),

            docType:
                result.doc_type,

            metadata:
                result.metadata,

            content:
                result.content
                    ?.substring(
                        0,
                        1000
                    )
        })
    );
}


async function semanticSearchByType(
    query,
    docType,
    limit = 10
){

    const embedding =
        await embeddingService.generateEmbedding(
            query
        );

    const results =
        await embeddingRepo.findSimilarByType(
            embedding,
            docType,
            limit
        );

    return results;
}


async function semanticSearchGrouped(
    query
){

    const embedding =
        await embeddingService.generateEmbedding(
            query
        );

    const results =
        await embeddingRepo.findSimilar(
            embedding,
            20
        );

    return {

        code:
            results.filter(
                r =>
                    r.doc_type ===
                    "github_code"
            ),

        commits:
            results.filter(
                r =>
                    r.doc_type ===
                    "github_commit"
            ),

        prs:
            results.filter(
                r =>
                    r.doc_type ===
                    "github_pr"
            ),

        comments:
            results.filter(
                r =>
                    r.doc_type ===
                    "github_comment"
            )

    };
}


module.exports = {
    semanticSearch,semanticSearchByType,semanticSearchGrouped
};

// const embeddingService =
// require("./embedding.service");

// const embeddingRepo =
// require("../repositories/embedding.repository");

// async function semanticSearch(query){

//   const embedding =
//     await embeddingService.generateEmbedding(
//       query
//     );

//   return await embeddingRepo.findSimilar(
//     embedding,
//     10
//   );
// }

// module.exports = {
//   semanticSearch
// };