
import { useState } from "react";
import { Box, TextField, Button, CircularProgress, Alert } from "@mui/material";
import api from "../services/api";
import JsonViewer from "./JsonViewer";

export default function ReleaseReadinessPanel() {
 const [value,setValue] = useState("");
 const [loading,setLoading] = useState(false);
 const [error,setError] = useState("");
 const [result,setResult] = useState(null);

 const run = async () => {
   try {
     setLoading(true);
     setError("");
     const response = await api.post("/release-readiness", {
       release: value
     });
     setResult(response.data);
   } catch(error) {
     setError(error.message);
   } finally {
     setLoading(false);
   }
 };

 return (
   <Box sx={{mt:2}}>
     <TextField
       fullWidth
       label="Release Version"
       value={value}
       onChange={(e)=>setValue(e.target.value)}
     />
     <Button
       variant="contained"
       sx={{mt:2}}
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
