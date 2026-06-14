const express =
require("express");

const router =
express.Router();

const rootCauseService =
require("../services/rootCause.service");

router.post(
"/root-cause",

async(req,res)=>{

    try{

        const result =
            await rootCauseService
                .analyzeIncident(
                    req.body.incident,
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
