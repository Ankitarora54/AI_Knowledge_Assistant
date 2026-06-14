const express =
require("express");

const router =
express.Router();

const orchestratorService =
require(
    "../services/orchestrator.service"
);

router.post(
"/orchestrate",

async(req,res)=>{

    try{

        const result =
            await orchestratorService
                .orchestrate(
                    req.body.question,
                    {
                        repository:
                            req.body.repository,
                        file:
                            req.body.file
                    }
                );

        res.json(result);

    }catch(error){

        res.status(500)
            .json({
                error:error.message
            });
    }
});

module.exports = router;
