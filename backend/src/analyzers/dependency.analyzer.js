function extractDependencies(code){

    const dependencies = [];

    const patterns = [

        // CommonJS
        {
            type: "require",
            regex: /require\(['"](.+?)['"]\)/g
        },

        // ES6 imports
        {
            type: "import",
            regex: /from\s+['"](.+?)['"]/g
        },

        // axios
        {
            type: "axios",
            regex:
            /axios\.(?:get|post|put|delete)\(['"](.+?)['"]\)/g
        },

        // fetch
        {
            type: "fetch",
            regex:
            /fetch\(['"](.+?)['"]\)/g
        },

        // Express routers
        {
            type: "express_router",
            regex:
            /require\(['"]\.\/routes\/(.+?)['"]\)/g
        },

        // Java imports
        {
            type: "java_import",
            regex:
            /import\s+([\w\.]+);/g
        },

        // Spring Autowired
        {
            type: "spring_autowired",
            regex:
            /@Autowired[\s\S]*?private\s+(\w+)/g
        },

        // Service Instantiation
        {
            type: "service_call",
            regex:
            /new\s+(\w+Service)/g
        },

        // RestTemplate
        {
            type: "rest_template",
            regex:
            /RestTemplate/g
        },

        // Feign Client
        {
            type: "feign_client",
            regex:
            /@FeignClient\s*\(\s*name\s*=\s*"([^"]+)"/g
        }
    ];

    for(const pattern of patterns){

        let match;

        while(
            (match = pattern.regex.exec(code))
            !== null
        ){

            dependencies.push({

                type:
                    pattern.type,

                target:
                    match[1] || "unknown"
            });
        }
    }

    return dependencies;
}

module.exports = {
    extractDependencies
};