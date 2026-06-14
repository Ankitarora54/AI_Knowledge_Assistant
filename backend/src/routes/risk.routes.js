router.post(
"/change-risk",

async(req,res)=>{

    const result =
        await changeRiskService
            .analyzeRisk(
                req.body.file
            );

    res.json(result);
});