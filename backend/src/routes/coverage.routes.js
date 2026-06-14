const express =
require("express");

const router =
express.Router();

const coverageService =
require("../services/coverage.service");

router.post(
"/coverage",

async(req,res)=>{

    try{

        const result =
            await coverageService
                .analyzeCoverage(
                    req.body.release
                );

        res.json(result);

    }catch(error){

        console.error(error);

        res.status(500)
            .json({
                error:error.message
            });
    }
});

module.exports = router;