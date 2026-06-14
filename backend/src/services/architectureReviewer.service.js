const OpenAI =
require("openai");

const searchService =
require("./search.service");

const client =
new OpenAI({
 apiKey:
 process.env.OPENAI_API_KEY
});

async function review(
    component,
    selection = {}
){

    const context =
        await searchService
            .semanticSearch(
                component,
                20,
                selection
            );

    const response =
        await client
            .chat
            .completions
            .create({

                model:
                "gpt-4.1",

                response_format:{
                    type:
                    "json_object"
                },

                messages:[

                    {
                        role:"system",

                        content:`
Return:

{
 "strengths":[],
 "technicalDebt":[],
 "refactoringSuggestions":[],
 "securityConcerns":[]
}
`
                    },

                    {
                        role:"user",

                        content:
                        JSON.stringify(
                            context
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
    review
};
