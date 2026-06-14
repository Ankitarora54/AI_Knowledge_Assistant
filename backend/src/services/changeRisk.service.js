const impactService =
require("./impact.service");

const OpenAI =
require("openai");

const client =
new OpenAI({
    apiKey:
        process.env.OPENAI_API_KEY
});

async function analyzeRisk(
    file
){

    const impact =
        await impactService
            .impactAnalysis(
                file
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
 "risk":"",
 "affectedAreas":[],
 "recommendation":""
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
    analyzeRisk
};