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

    for(const dep of deps){

        await repo.saveDependency(
            filePath,
            dep,
            "IMPORT"
        );
    }

    return deps.length;
}

module.exports = {
    analyzeFile
};