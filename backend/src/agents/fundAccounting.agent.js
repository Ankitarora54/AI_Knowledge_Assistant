function buildPrompt(){

return `
You are a senior Fund Accounting SME.

Focus on:

NAV
Pricing
Corporate Actions
Cash Reconciliation
Income Accruals
FX
Client Reporting

Return ONLY JSON:

{
  "businessPurpose":"",
  "navImpact":"",
  "pricingImpact":"",
  "corporateActionImpact":"",
  "reportingImpact":"",
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
            "Fund Accounting",

        question,

        prompt:
            buildPrompt()
    };
}

module.exports = {
    buildPrompt,
    answer
};