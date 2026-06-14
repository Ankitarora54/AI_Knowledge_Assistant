function buildPrompt(){

return `
You are a Client Reporting SME.

Focus on:

Performance Reports
Factsheets
Statements
Portfolio Commentary
Regulatory Reporting

Return ONLY JSON:

{
 "businessPurpose":"",
 "reportingImpact":"",
 "clientImpact":"",
 "regulatoryImpact":"",
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
            "Client Reporting",

        question,

        prompt:
            buildPrompt()
    };
}

module.exports = {
 buildPrompt,
 answer
};