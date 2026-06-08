const express = require("express");

const router = express.Router();

const githubIndexer =
    require("../indexers/github.indexer");

const githubKnowledgeService =
    require("../services/githubKnowledge.service");

router.get(
    "/github/test",
    (req,res)=>{
        res.json({
            message:"github route working"
        });
    }
);


router.post(
    "/github/index-all",
    async(req,res)=>{

        const {
            owner,
            repo
        } = req.body;

        const result =
            await githubKnowledgeService
                .indexRepositoryKnowledge(
                    owner,
                    repo
                );

        res.json(result);
    }
);


router.post(
    "/github/index",
    async (req, res) => {

        try {

            const {
                owner,
                repo
            } = req.body;

            const result =
                await githubIndexer.indexRepository(
                    owner,
                    repo
                );

            res.json(result);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: error.message
            });
        }
    }
);


module.exports = router;