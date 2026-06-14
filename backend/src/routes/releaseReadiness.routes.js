const express =
require("express");

const router =
express.Router();

const releaseReadinessService =
require(
    "../services/releaseReadiness.service"
);

router.post(
"/release-readiness",

async(req,res)=>{

    try{

        const result =
            await releaseReadinessService
                .assess(
                    req.body.release
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