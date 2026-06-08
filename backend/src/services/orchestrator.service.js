const classifier =
require("./questionClassifier.service");

const fundAgent =
require("../agents/fundAccounting.agent");

const tradingAgent =
require("../agents/trading.agent");

async function getAgent(
question,
context
){

    const domain =
        await classifier.classify(
            question
        );

    if(
        domain ===
        "fundAccounting"
    ){
        return fundAgent
            .buildPrompt(
                question,
                context
            );
    }

    if(
        domain ===
        "trading"
    ){
        return tradingAgent
            .buildPrompt(
                question,
                context
            );
    }

    return context;
}

module.exports = {
    getAgent
};