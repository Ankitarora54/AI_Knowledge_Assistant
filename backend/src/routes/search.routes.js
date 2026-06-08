const express = require("express");
const router = express.Router();

const searchService =
    require("../services/search.service");

router.post(
    "/search",
    async (req, res) => {

        try {

            const results =
                await searchService.semanticSearch(
                    req.body.query
                );

            res.json(results);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: error.message
            });
        }
    }
);

module.exports = router;