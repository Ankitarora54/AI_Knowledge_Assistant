const analyzer =
require("../analyzers/dependency.analyzer");

const repo =
require("../repositories/dependency.repository");

async function analyzeFile(
    filePath,
    content
){

    const deps =
    analyzer.extractDependencies(
        content
    );
    console.log("DEPENDENCIES:", deps);
    for(const dep of deps){

        await repo.saveDependency(

            filePath,

            dep.target,

            dep.type
        );
    }

    return deps.length;
}

module.exports = {
    analyzeFile
};