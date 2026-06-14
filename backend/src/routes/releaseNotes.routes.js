const express =
require("express");

const router =
express.Router();

const releaseNotesService =
require(
    "../services/releaseNotes.service"
);

router.post(
"/release-notes",

async(req,res)=>{

    try{

        const result =
            await releaseNotesService
                .generateReleaseNotes(
                    req.body.release,
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
