const express =
require("express");

const router =
express.Router();

const service =
require("../services/changeImpact.service");

router.post(
"/change-impact",
async(req,res)=>{

 const result =
    await service
      .predictImpact(
        req.body.file
      );

 res.json(result);
});

module.exports = router;