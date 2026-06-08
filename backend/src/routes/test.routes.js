const express = require("express");
const router = express.Router();

const embeddingService =
require("../services/embedding.service");

router.post("/test-embedding", async(req,res)=>{

  const embedding =
    await embeddingService.generateEmbedding(
      req.body.text
    );

  res.json({
    dimensions: embedding.length
  });

});

module.exports = router;