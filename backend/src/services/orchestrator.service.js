const tradingAgent =
require("../agents/trading.agent");

const fundAccountingAgent =
require("../agents/fundAccounting.agent");

const corporateActionsAgent =
require("../agents/corporateActions.agent");

const clientReportingAgent =
require("../agents/clientReporting.agent");

const explainService =
require("./explain.service");

const classifier =
require("./questionClassifier.service");

const architectureAgent =
require("../agents/architecture.agent");

const fundAgent =
require("../agents/fundAccounting.agent");

async function route(
    question,
    context
){

    const type =
        classifier.classify(
            question
        );

    switch(type){

        case "fundAccounting":

            return fundAgent
                .buildPrompt(
                    question,
                    context
                );

        case "architecture":

            return architectureAgent
                .buildPrompt(
                    question,
                    context
                );

        default:

            return context;
    }
}

async function orchestrate(
    question,
    selection = {}
){

    const scopedQuestion = [
        question,
        selection.repository
            ? `Selected repository: ${selection.repository}`
            : "",
        selection.file
            ? `Selected file: ${selection.file}`
            : ""
    ].filter(Boolean).join("\n");

    const domain =
        classifier.classify(
            question
        );

    switch(domain){

        case "trading":

            return await
                tradingAgent.answer(
                    scopedQuestion
                );

        case "fundAccounting":

            return await
                fundAccountingAgent.answer(
                    scopedQuestion
                );

        case "corporateActions":

            return await
                corporateActionsAgent.answer(
                    scopedQuestion
                );

        case "clientReporting":

            return await
                clientReportingAgent.answer(
                    scopedQuestion
                );

        case "architecture":

            return await
                architectureAgent.answer(
                    scopedQuestion
                );

        default:

            return await
                explainService.explain(
                    question,
                    selection
                );
    }
}

module.exports = {
    route,
    orchestrate
};
