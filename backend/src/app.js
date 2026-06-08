
require("dotenv").config();
const express=require('express');
const cors=require('cors');
const githubRoutes = require("./routes/github.routes");
const testRoutes = require("./routes/test.routes");
const searchRoutes = require("./routes/search.routes");
const explainRoutes = require("./routes/explain.routes");
const impactRoutes = require("./routes/impact.routes");
const app=express();

app.use(cors());
app.use(express.json());
app.use("/api", testRoutes);
app.use("/api", searchRoutes);
app.use("/api", githubRoutes);
app.use("/api", explainRoutes);
app.use("/api", impactRoutes);
app.get('/health',(req,res)=>res.json({status:'ok'}));

app.post('/api/analyze',(req,res)=>{
 res.json({
   message:'Phase 1 running',
   repository:req.body.repository || null
 });
});

app.listen(5000,()=>console.log('API running on 5000'));

