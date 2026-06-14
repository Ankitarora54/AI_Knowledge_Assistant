const impactService =
require("./impact.service");

const OpenAI =
require("openai");

const client =
new OpenAI({
    apiKey:
        process.env.OPENAI_API_KEY
});

async function explainComponent(
    component
){

    const impact =
        await impactService
            .impactAnalysis(
                component
            );

    const response =
        await client.chat.completions.create({

            model:"gpt-4.1",

            response_format:{
                type:"json_object"
            },

            messages:[

                {
                    role:"system",

                    content:`
Return JSON:

{
 "purpose":"",
 "businessRole":"",
 "dependencies":[],
 "risks":[],
 "futureEnhancements":[]
}
`
                },

                {
                    role:"user",

                    content:
                    JSON.stringify(
                        impact
                    )
                }
            ]
        });

    return JSON.parse(
        response
            .choices[0]
            .message
            .content
    );
}

module.exports = {
    explainComponent
};

// const searchService =
// require("./search.service");

// const impactService =
// require("./impact.service");

// const architectureAgent =
// require("../agents/architecture.agent");

// const OpenAI = require("openai");

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// async function explainArchitecture(
//     component
// ){

//     const searchResults =
//         await searchService
//             .semanticSearch(component);

//     const impact =
//         await impactService
//             .impactAnalysis(component);

//     const context =
//         searchResults
//             .map(x=>x.content)
//             .join("\n");

//     const prompt =
//         architectureAgent
//             .buildPrompt(
//                 component,
//                 context,
//                 impact
//             );

//     const response =
//         await client.chat.completions.create({

//             model:"gpt-4.1",

//             response_format:{
//                 type:"json_object"
//             },

//             messages:[
//                 {
//                     role:"user",
//                     content:prompt
//                 }
//             ]
//         });

//     return JSON.parse(
//         response
//             .choices[0]
//             .message
//             .content
//     );
// }

// module.exports = {
//     explainArchitecture
// };