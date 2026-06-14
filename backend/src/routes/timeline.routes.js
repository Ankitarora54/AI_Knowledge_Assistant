const express = require("express");
const router = express.Router();

const timelineService =
require("../services/timeline.service");

router.post(
"/timeline",
async(req,res)=>{

    const result =
        await timelineService
            .summarizeTimeline(
                req.body.repository
            );

    res.json(result);
});

module.exports = router;