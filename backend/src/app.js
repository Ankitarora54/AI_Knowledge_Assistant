
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const githubRoutes = require("./routes/github.routes");
const testRoutes = require("./routes/test.routes");
const searchRoutes = require("./routes/search.routes");
const explainRoutes = require("./routes/explain.routes");
const impactRoutes = require("./routes/impact.routes");
const architectureRoutes= require("./routes/architecture.routes");
const timelineRoutes= require("./routes/timeline.routes");
const changeImpactRoutes = require("./routes/changeImpact.routes");
const jiraRoutes = require("./routes/jira.routes");
const traceabilityRoutes = require("./routes/traceability.routes");
const releaseRoutes = require("./routes/release.routes");
const rootCauseRoutes = require("./routes/rootCause.routes");
const releaseNotesRoutes = require("./routes/releaseNotes.routes");
const coverageRoutes = require("./routes/coverage.routes");
const capabilityRoutes = require("./routes/capability.routes");
const releaseReadinessRoutes = require("./routes/releaseReadiness.routes");
const architectureReviewerRoutes = require("./routes/architectureReviewer.routes");
const testImpactRoutes = require("./routes/testImpact.routes");
const orchestratorRoutes = require("./routes/orchestrator.routes");
const repositoryRoutes = require("./routes/repository.routes");
const relatedKnowledgeMiddleware =
require("./middleware/relatedKnowledge.middleware");

const app = express();
const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || "0.0.0.0";

const localOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

const configuredOrigins =
    (process.env.CORS_ORIGINS || "")
        .split(",")
        .map(origin => origin.trim())
        .filter(Boolean);

const allowedOrigins =
    new Set([
        ...localOrigins,
        ...configuredOrigins
    ]);

app.disable("x-powered-by");
app.use(cors({
    origin(origin, callback) {
        if (
            !origin ||
            allowedOrigins.has(origin)
        ) {
            callback(null, true);
            return;
        }

        callback(
            new Error(
                `Origin ${origin} is not allowed by CORS`
            )
        );
    }
}));
app.use(express.json());
app.use(relatedKnowledgeMiddleware);
app.use("/api", testRoutes);
app.use("/api", searchRoutes);
app.use("/api", githubRoutes);
app.use("/api", explainRoutes);
app.use("/api", impactRoutes);
app.use("/api", architectureRoutes);
app.use("/api", timelineRoutes);
app.use("/api", changeImpactRoutes);
app.use("/api", jiraRoutes);
app.use("/api", traceabilityRoutes);
app.use("/api", releaseRoutes);
app.use("/api", rootCauseRoutes);
app.use("/api", releaseNotesRoutes);
app.use("/api", coverageRoutes);
app.use("/api", capabilityRoutes);
app.use("/api", releaseReadinessRoutes);
app.use("/api", architectureReviewerRoutes);
app.use("/api", testImpactRoutes);
app.use("/api", orchestratorRoutes);
app.use("/api", repositoryRoutes);
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        environment:
            process.env.NODE_ENV ||
            "development"
    });
});

app.post('/api/analyze',(req,res)=>{
 res.json({
   message:'Phase 1 running',
   repository:req.body.repository || null
 });
});

app.listen(port, host, () => {
    console.log(
        `API running at http://${host}:${port}`
    );
});
