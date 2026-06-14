const impactService =
require("./impact.service");

async function predictImpact(
 file
){

 const impact =
     await impactService
        .impactAnalysis(
            file
        );

 const score =
     impact.upstreamCount +
     impact.downstreamCount;

 return {

   file,

   risk:
     score > 20
      ? "HIGH"
      : score > 10
      ? "MEDIUM"
      : "LOW",

   affectedServices:
     impact.downstream
        .map(
            x => x.target_file
        )
 };
}

module.exports = {
 predictImpact
};