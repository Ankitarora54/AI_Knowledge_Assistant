function extractDependencies(code){

    const dependencies = [];

    const patterns = [

        /import\s+.*?\s+from\s+['"](.*?)['"]/g,

        /require\(['"](.*?)['"]\)/g,

        /@Autowired\s+private\s+(\w+)/g,

        /new\s+(\w+Service)/g,

        /fetch\(['"](.*?)['"]\)/g,

        /axios\.(?:get|post|put|delete)\(['"](.*?)['"]\)/g

    ];

    for(const pattern of patterns){

        let match;

        while(
            (match = pattern.exec(code))
            !== null
        ){

            dependencies.push(
                match[1]
            );
        }
    }

    return [...new Set(dependencies)];
}

module.exports = {
    extractDependencies
};