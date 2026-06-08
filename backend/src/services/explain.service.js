const searchService =
require("./search.service");

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


async function explain(question){

    const searchResults =
        await searchService.semanticSearchGrouped(
            question
        );

    const context = `

CODE:
${JSON.stringify(searchResults.code)}

COMMITS:
${JSON.stringify(searchResults.commits)}

PRS:
${JSON.stringify(searchResults.prs)}

COMMENTS:
${JSON.stringify(searchResults.comments)}

`;

    const response =
        await client.chat.completions.create({

            model:"gpt-4.1",

            messages:[
                {
                    role:"system",
                    content:`
You are a software architect.

Provide:

1 Business Purpose

2 Technical Summary

3 Historical Evolution

4 Risks

5 Future Enhancements
`
                },
                {
                    role:"user",
                    content:`
Question:
${question}

Context:
${context}
`
                }
            ]
        });

    return response
        .choices[0]
        .message
        .content;
}

module.exports = {
    explain
};