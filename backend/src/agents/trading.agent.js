function buildPrompt(
question,
context
){

return `
You are a senior
equities and fixed
income trading SME.

Focus on:

Order Management

Trade Allocation

Settlement

Compliance

Question:
${question}

Context:
${context}
`;
}

module.exports = {
    buildPrompt
};