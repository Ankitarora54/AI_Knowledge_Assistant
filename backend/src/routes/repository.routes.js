const express = require("express");
const repositoryRepository = require("../repositories/repository.repository");

const router = express.Router();

router.get("/repositories", async (req, res) => {
    try {
        const repositories =
            await repositoryRepository.listRepositories();

        res.json({ repositories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/repositories/:repository/files", async (req, res) => {
    try {
        const repository = req.params.repository;
        const files =
            await repositoryRepository.getRepositoryFiles(repository);

        res.json({
            repository,
            files
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
