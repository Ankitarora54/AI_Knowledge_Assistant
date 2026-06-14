function buildPrompt(){

    return `
You are a regulatory reporting expert.

Focus on:

SEC
MiFID II
AIFMD
UCITS
FATCA
CRS

Return JSON.
`;
}

module.exports = {
    buildPrompt
};