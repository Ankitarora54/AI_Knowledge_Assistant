const githubService =
    require("../services/github.service");

const chunkingService =
    require("../services/chunking.service");

const embeddingService =
    require("../services/embedding.service");

const embeddingRepository =
    require("../repositories/embedding.repository");

const documentRepository =
    require("../repositories/document.repository");

const dependencyService =
require("../services/dependency.service");

function shouldIndex(filePath) {

    const allowed = [

        ".js",
        ".ts",
        ".java",
        ".py",
        ".sql",
        ".cs",
        ".yaml",
        ".yml"

    ];

    return allowed.some(
        ext =>
            filePath.endsWith(ext)
    );
}

async function indexRepository(
    owner,
    repo
) {

    const files =
    await githubService.getAllFiles(
        owner,
        repo
    );
    console.log(JSON.stringify(files, null, 2));
    let filesIndexed = 0;
    let chunksCreated = 0;

    for (const file of files) {
        
        if(!shouldIndex(file.path)
            ){
            continue;
            }

        if (file.type !== "file")
            continue;

        const content =
            await githubService.getFileContent(
                file.download_url
            );
        
        console.log( "ANALYZING:",file.path);
        const depCount =
            await dependencyService.analyzeFile(
                file.path,
                content
            );

        console.log(
            "DEPENDENCIES FOUND:",
            depCount
        );

        await dependencyService.analyzeFile(
                file.path,
                content
            );

        const document =
            await documentRepository.createDocument(
                file.name,
                content,
                "github",
                {
                    repository: repo,
                    file_path: file.path
                }
            );

        const chunks =
            chunkingService.chunkText(
                content
            );

        for (const chunk of chunks) {

            const embedding =
                await embeddingService.generateEmbedding(
                    chunk
                );

            await embeddingRepository.saveEmbedding(
                chunk,
                embedding,
                "github_code",
                {
                    repository: repo,
                    file_path: file.path
                },
                document.id
            );

            chunksCreated++;
        }

        filesIndexed++;
    }

    return {
        filesIndexed,
        chunksCreated
    };
}

module.exports = {
    indexRepository
};