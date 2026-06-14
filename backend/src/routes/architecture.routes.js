const express =
require("express");

const router =
express.Router();

const architectureExplainService =
require("../services/architectureExplain.service");

router.post(
"/explain/architecture",
async(req,res)=>{

    const result =
      await architectureExplainService
        .explainArchitecture(
            req.body.component
        );

    res.json(result);
});

router.post(
"/architecture",

async(req,res)=>{

    const result =
        await architectureService
            .explainComponent(
                req.body.component
            );

    res.json(result);
});

module.exports = router;