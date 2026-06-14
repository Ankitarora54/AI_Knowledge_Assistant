// let systemPrompt;

// switch(domain){

//     case "fundAccounting":

//         systemPrompt =
//             fundAccountingAgent
//                 .buildPrompt();

//         break;

//     case "architecture":

//         systemPrompt =
//             architectureAgent
//                 .buildPrompt();

//         break;

//     default:

//         systemPrompt = `

//         You are a senior enterprise architect.

//         Analyze:

//         ${component}

//         Context:

//         ${context}

//         Impact Analysis:

//         ${JSON.stringify(impact)}

//         Return JSON:

//         {
//         "purpose":"",
//         "architectureRole":"",
//         "upstreamDependencies":[],
//         "downstreamDependencies":[],
//         "technicalRisks":[],
//         "businessRisks":[],
//         "recommendations":[]
//         }

//         `;
// }

function buildPrompt(
    component,
    context,
    impact
){

return `

You are a senior enterprise architect.

Analyze:

${component}

Context:

${context}

Impact Analysis:

${JSON.stringify(impact)}

Return JSON:

{
  "purpose":"",
  "architectureRole":"",
  "upstreamDependencies":[],
  "downstreamDependencies":[],
  "technicalRisks":[],
  "businessRisks":[],
  "recommendations":[]
}

`;
}

async function answer(
    question
){

    return {

        domain:
            "Architecture",

        question,

        prompt:
            buildPrompt()
    };
}


module.exports = {
    buildPrompt,
    answer
};