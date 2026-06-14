const embeddingService =
require("./embedding.service");

const embeddingRepo =
require("../repositories/embedding.repository");

async function semanticSearch(
    query,
    limit = 10,
    filters = {}
){

    const embedding =
        await embeddingService.generateEmbedding(
            query
        );

    const results =
        await embeddingRepo.findSimilar(
            embedding,
            limit,
            filters
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
    limit = 10,
    filters = {}
){

    const embedding =
        await embeddingService.generateEmbedding(
            query
        );

    const results =
        await embeddingRepo.findSimilarByType(
            embedding,
            docType,
            limit,
            filters
        );

    return results;
}


// async function semanticSearchGrouped(
//     query
// ){

//     const embedding =
//         await embeddingService
//             .generateEmbedding(
//                 query
//             );

//     return {

//         code:
//             await embeddingRepo
//                 .findSimilarByTypeEmbedding(
//                     embedding,
//                     "github_code",
//                     10
//                 ),

//         commits:
//             await embeddingRepo
//                 .findSimilarByTypeEmbedding(
//                     embedding,
//                     "github_commit",
//                     10
//                 ),

//         prs:
//             await embeddingRepo
//                 .findSimilarByTypeEmbedding(
//                     embedding,
//                     "github_pr",
//                     10
//                 ),

//         comments:
//             await embeddingRepo
//                 .findSimilarByTypeEmbedding(
//                     embedding,
//                     "github_comment",
//                     10
//                 ),

//         jira:
//             await embeddingRepo
//                 .findSimilarByTypeEmbedding(
//                     embedding,
//                     "jira_story",
//                     10
//                 )
                
//     };
//     console.log(
//             "JIRA RESULTS"
//         );

//         jira.forEach(
//             x =>
//                 console.log(
//                     x.metadata?.issue_key,
//                     x.content?.substring(
//                         0,
//                         100
//                     )
//                 )
//         );
// }

async function semanticSearchGrouped(
    query,
    filters = {}
){

    const embedding =
        await embeddingService
            .generateEmbedding(
                query
            );

    const code =
        await embeddingRepo
            .findSimilarByTypeEmbedding(
                embedding,
                "github_code",
                10,
                filters
            );

    const commits =
        await embeddingRepo
            .findSimilarByTypeEmbedding(
                embedding,
                "github_commit",
                10,
                {
                    repository:
                        filters.repository
                }
            );

    const prs =
        await embeddingRepo
            .findSimilarByTypeEmbedding(
                embedding,
                "github_pr",
                10,
                {
                    repository:
                        filters.repository
                }
            );

    const comments =
        await embeddingRepo
            .findSimilarByTypeEmbedding(
                embedding,
                "github_comment",
                10,
                {
                    repository:
                        filters.repository
                }
            );

    const jira =
        await embeddingRepo
            .findSimilarByTypeEmbedding(
                embedding,
                "jira_story",
                10
            );
    
    const confluence =
    await embeddingRepo
        .findSimilarByTypeEmbedding(
            embedding,
            "confluence",
            10
        );
    
    
    const filteredJira =
        jira.filter(
        x => x.distance < 0.5
        );
    
    const filteredConfluence =
    confluence.filter(
        x => x.distance < 0.6
    );    

    console.log(
            "Confluence Chunks:",
            filteredConfluence.length
        );

        filteredConfluence.forEach(
            x =>
                console.log(
                    x.metadata?.page_id,
                    x.distance
                )
        );

    return {

        code,

        commits,

        prs,

        comments,

        jira: filteredJira,

        confluence: filteredConfluence
    };
}


module.exports = {
    semanticSearch,semanticSearchByType,semanticSearchGrouped
};
