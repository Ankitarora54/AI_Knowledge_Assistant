function buildPrompt(){

return `
You are a Corporate Actions SME.

Focus on:

Dividends
Splits
Mergers
Rights
Tender Offers

Return ONLY JSON:

{
 "businessPurpose":"",
 "eventImpact":"",
 "cashImpact":"",
 "positionImpact":"",
 "risks":[],
 "futureEnhancements":[]
}
`;
}

async function answer(
    question
){

    return {

        domain:
            "Corporate Actions",

        question,

        prompt:
            buildPrompt()
    };
}


module.exports = {
 buildPrompt,
 answer
};