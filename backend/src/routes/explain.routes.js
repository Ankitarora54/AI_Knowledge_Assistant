const express =
require("express");

const router =
express.Router();

const explainService =
require("../services/explain.service");

const fileExplainService =
require("../services/fileExplain.service");

const repositoryExplainService =
require("../services/repositoryExplain.service");

const timelineService =
require("../services/timeline.service");

router.post(
"/explain",
async(req,res)=>{

    const result =
        await explainService.explain(
            req.body.question,
            {
                repository: req.body.repository,
                file: req.body.file
            }
        );

    res.json({
        explanation:result
    });
});

router.post(
"/explain/repository",
async(req,res)=>{

    const result =
      await repositoryExplainService
        .explainRepository(
            req.body.repository
        );

    res.json(result);
});

router.post(
"/explain/file",
async(req,res)=>{

    const result =
        await fileExplainService
        .explainFile(
            req.body.file,
            req.body.repository
        );

    res.json(result);
});


router.post(
"/timeline",
async(req,res)=>{

    const result =
      await timelineService
        .getTimeline(
            req.body.repository
        );
  
        console.log(
    "Repository received:",
    req.body.repository
);
    res.json(result);
});


module.exports = router;
