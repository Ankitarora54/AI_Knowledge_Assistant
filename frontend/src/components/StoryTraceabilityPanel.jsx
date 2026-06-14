
import { useState } from "react";
import { Box, TextField, Button, CircularProgress, Alert } from "@mui/material";
import api from "../services/api";
import JsonViewer from "./JsonViewer";

export default function StoryTraceabilityPanel() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const run = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.post("/traceability/story/explain", {
        jiraKey: value
      });
      setResult(response.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <TextField fullWidth label="Jira Key" value={value} onChange={e=>setValue(e.target.value)} />
      <Button sx={{mt:2}} variant="contained" onClick={run}>Run</Button>
      {loading && <CircularProgress sx={{ml:2}} />}
      {error && <Alert severity="error" sx={{mt:2}}>{error}</Alert>}
      {result && <JsonViewer data={result} />}
    </Box>
  );
}
