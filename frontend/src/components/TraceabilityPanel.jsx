
import { useState } from "react";
import { Box, TextField, Button, CircularProgress, Alert } from "@mui/material";
import api from "../services/api";
import JsonViewer from "./JsonViewer";

export default function TraceabilityPanel() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const run = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.post("/traceability/explain", {
        requirement: value
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
      <TextField fullWidth label="Requirement" value={value} onChange={e=>setValue(e.target.value)} />
      <Button
        sx={{mt:2}}
        variant="contained"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        onClick={run}
      >
        {loading ? "Running..." : "Run"}
      </Button>
      {error && <Alert severity="error" sx={{mt:2}}>{error}</Alert>}
      {result && <JsonViewer data={result} />}
    </Box>
  );
}
