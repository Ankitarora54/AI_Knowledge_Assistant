const express =
require("express");

const router =
express.Router();

const testImpactService =
require("../services/testImpact.service");

router.post(
"/test-impact",

async(req,res)=>{

    try{

        const result =
            await testImpactService
                .analyze(
                    req.body.component
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