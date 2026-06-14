
import { useState } from "react";
import {
 Box,
 TextField,
 Button,
 CircularProgress,
 Alert
} from "@mui/material";
import api from "../services/api";

export default function SearchBar({ selectedFile }){
 const [question,setQuestion] = useState("");
 const [activeAction, setActiveAction] = useState("");
 const [error, setError] = useState("");

 const ask = async()=>{
  await runAction("ask", "/orchestrate", { question });
 };

 const runAction = async (action, path, body = {}) => {
  try {
   setActiveAction(action);
   setError("");
   await api.post(path, body);
  } catch (requestError) {
   setError(requestError.response?.data?.error || requestError.message);
  } finally {
   setActiveAction("");
  }
 };

 const loadingIcon = (action) => (
  activeAction === action
   ? <CircularProgress size={17} color="inherit" />
   : null
 );

 return (
  <Box className="primary-actions">
   <TextField
    fullWidth
    label="Ask Anything"
    value={question}
    onChange={(e)=>setQuestion(e.target.value)}
    onKeyDown={(event) => {
     if (event.key === "Enter" && question.trim() && !activeAction) {
      ask();
     }
    }}
   />
   <Box className="action-buttons">
    <Button
     className="ask-ai-button"
     variant="contained"
     disabled={!question.trim() || Boolean(activeAction)}
     startIcon={loadingIcon("ask")}
     onClick={ask}
    >
     {activeAction === "ask" ? "Asking..." : "Ask AI"}
    </Button>
    <Button
     className="explain-file-button"
     variant="outlined"
     disabled={!selectedFile || Boolean(activeAction)}
     startIcon={loadingIcon("explain")}
     onClick={() => runAction("explain", "/explain/file")}
    >
     {activeAction === "explain" ? "Explaining..." : "Explain file"}
    </Button>
    <Button
     className="analyze-impact-button"
     variant="outlined"
     disabled={!selectedFile || Boolean(activeAction)}
     startIcon={loadingIcon("impact")}
     onClick={() => runAction("impact", "/impact")}
    >
     {activeAction === "impact" ? "Analyzing..." : "Analyze impact"}
    </Button>
   </Box>
   {error && <Alert severity="error">{error}</Alert>}
  </Box>
 );
}
