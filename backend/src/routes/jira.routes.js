const express =
require("express");

const router =
express.Router();

const jiraIndexer =
require("../indexers/jira.indexer");

router.post(
"/jira/index",
async(req,res)=>{
    // console.log("JIRA INDEX CALLED");
    const result =
        await jiraIndexer
            .indexIssues();

    res.json(result);
});

router.get(
"/jira/test",
async(req,res)=>{

    const issues =
        await jiraService
            .getIssues();

    res.json({
        count:
            issues.length
    });
});

module.exports = router;