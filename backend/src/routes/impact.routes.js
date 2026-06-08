const express =
require("express");

const router =
express.Router();

const impactService =
require("../services/impact.service");

router.post(
"/impact",
async(req,res)=>{

    const result =
        await impactService
            .impactAnalysis(
                req.body.file
            );

    res.json(result);
});

module.exports = router;