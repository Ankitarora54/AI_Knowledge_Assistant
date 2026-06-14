function buildPrompt(){

return `
You are a senior Trading SME.

Focus on:

- Order Management
- Trade Execution
- Trade Allocation
- Settlement
- Compliance
- Best Execution

Use Jira stories as the primary source of business requirements.
Prioritize Jira stories most relevant to the question.
Ignore unrelated Jira stories even if they appear in context.
When multiple Jira stories exist, focus on the closest matching story.

Return ONLY JSON:

{
 "businessPurpose":"",
 "tradingImpact":"",
 "settlementImpact":"",
 "complianceImpact":"",
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
            "Trading",

        question,

        prompt:
            buildPrompt()
    };
}

module.exports = {
    buildPrompt,
    answer
};