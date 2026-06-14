const express =
require("express");

const router =
express.Router();

const releaseService =
require("../services/releaseIntelligence.service");

router.post(
"/release-intelligence",

async(req,res)=>{

    const result =
        await releaseService
            .generateReleaseSummary(
                req.body.repository
            );

    res.json(result);
});

module.exports = router;