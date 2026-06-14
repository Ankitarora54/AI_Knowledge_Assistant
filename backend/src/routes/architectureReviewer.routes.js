const express =
require("express");

const router =
express.Router();

const architectureReviewerService =
require(
    "../services/architectureReviewer.service"
);

router.post(
"/architecture-review",

async(req,res)=>{

    try{

        const result =
            await architectureReviewerService
                .review(
                    req.body.component,
                    {
                        repository:
                            req.body.repository,
                        file:
                            req.body.file
                    }
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
