const express =
require("express");

const router =
express.Router();

const traceabilityService =
require("../services/traceability.service");

router.post(
"/traceability",
async(req,res)=>{

    const result =
        await traceabilityService
            .traceRequirement(
                req.body.requirement
            );

    res.json(result);
});

router.post(
"/traceability/explain",
async(req,res)=>{

    const result =
        await traceabilityService
            .explainRequirement(
                req.body.requirement
            );

    res.json(result);
});

router.post(
"/traceability/story",

async(req,res)=>{

    const result =
        await traceabilityService
            .traceStory(
                req.body.jiraKey
            );

    res.json(result);
});

router.post(
"/traceability/story/explain",

async(req,res)=>{

    const result =
        await traceabilityService
            .explainStory(
                req.body.jiraKey
            );

    res.json(result);
});

module.exports = router;