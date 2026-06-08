const express =
require("express");

const router =
express.Router();

const explainService =
require("../services/explain.service");

console.log(
    "EXPLAIN SERVICE:",
    explainService
);

router.post(
"/explain",
async(req,res)=>{

    const result =
        await explainService.explain(
            req.body.question
        );

    res.json({
        explanation:result
    });
});

module.exports = router;