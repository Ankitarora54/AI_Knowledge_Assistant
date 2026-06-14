
import { useCallback, useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import SearchBar from "../components/SearchBar";
import ResultsPanel from "../components/ResultsPanel";
import TabContent from "../components/TabContent";
import RepositoryExplorer from "../components/RepositoryExplorer";
import {
  setApiSelection,
  subscribeToApiLoading,
  subscribeToApiResults
} from "../services/api";

export default function Dashboard(){
 const [tab,setTab] = useState(1);
 const [result,setResult] = useState(null);
 const [loading, setLoading] = useState(false);
 const [repository, setRepository] = useState("");
 const [selectedFile, setSelectedFile] = useState("");

 useEffect(() => subscribeToApiResults(setResult), []);
 useEffect(() => subscribeToApiLoading(setLoading), []);

 useEffect(() => {
  setApiSelection({
   repository,
   file: selectedFile
  });
 }, [repository, selectedFile]);

 const handleRepositoryChange = useCallback((value) => {
  setRepository(value);
  setSelectedFile("");
  setResult(null);
 }, []);

 return (
  <Box className="app-shell">
   <header className="app-header">
    <Box>
     <Typography className="brand-kicker">Engineering intelligence</Typography>
     <Typography variant="h4">AI Knowledge Assistant</Typography>
    </Box>
    <Box className="active-repository">
     <span className="active-dot" />
     {repository || "Select a repository"}
    </Box>
   </header>

   <Box className="workspace-grid">
    <RepositoryExplorer
     key={repository || "no-repository"}
     repository={repository}
     selectedFile={selectedFile}
     onRepositoryChange={handleRepositoryChange}
     onFileSelect={(file) => {
      setSelectedFile(file);
      setResult(null);
     }}
    />

    <main className="action-panel">
     <Box className="action-intro">
      <Typography className="eyebrow">Ask and analyze</Typography>
      <Typography variant="h5">
       {selectedFile ? "Work with the selected file" : "Explore repository knowledge"}
      </Typography>
      <Typography>
       {selectedFile || repository || "Choose a repository to begin."}
      </Typography>
     </Box>

     <SearchBar selectedFile={selectedFile}/>

     <ResultsPanel
      result={result}
      repository={repository}
      selectedFile={selectedFile}
      loading={loading}
     />
    </main>

    <aside className="tools-panel">
     <Box className="panel-heading tools-heading">
      <Typography className="eyebrow">Knowledge tools</Typography>
      <Typography variant="h6">Actions</Typography>
      <Typography>
       Run focused analysis against the active repository.
      </Typography>
     </Box>

     <Tabs
      orientation="vertical"
      value={tab}
      onChange={(event, value) => setTab(value)}
      className="tools-tabs"
     >
      <Tab value={1} label="Explain"/>
      <Tab value={2} label="Traceability"/>
      <Tab value={3} label="Architecture"/>
      <Tab value={4} label="Release Notes"/>
      <Tab value={5} label="Release Readiness"/>
      <Tab value={6} label="Coverage"/>
      <Tab value={7} label="Root Cause"/>
      <Tab value={8} label="Test Impact"/>
      <Tab value={9} label="Capability"/>
     </Tabs>

     <Box className="tool-content">
      <TabContent tab={tab} setResult={setResult}/>
     </Box>
    </aside>
   </Box>
  </Box>
 );
}
