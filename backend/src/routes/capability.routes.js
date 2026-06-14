const express =
require("express");

const router =
express.Router();

const capabilityService =
require("../services/capability.service");

router.post(
"/capability",

async(req,res)=>{

    try{

        const result =
            await capabilityService
                .getCapability(
                    req.body.capability
                );

        res.json(result);

    }catch(error){

        res.status(500)
            .json({
                error:error.message
            });
    }
});

module.exports = router;