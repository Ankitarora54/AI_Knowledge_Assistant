
import { Box, CircularProgress, Typography } from "@mui/material";
import StructuredData from "./StructuredData";

export default function ResultsPanel({
  result,
  repository,
  selectedFile,
  loading
}) {
  return (
    <section className="results-panel">
      <Box className="panel-heading results-heading">
        <Box>
          <Typography className="eyebrow">Analysis</Typography>
          <Typography variant="h6">Results</Typography>
        </Box>
        {loading
          ? <span className="status-dot is-loading">Working</span>
          : result && <span className="status-dot">Ready</span>}
      </Box>

      <Box className="result-context">
        <span>{repository || "No repository"}</span>
        {selectedFile && <span title={selectedFile}>{selectedFile}</span>}
      </Box>

      <Box className="result-scroll">
        {loading
          ? (
            <Box className="result-loading">
              <CircularProgress size={34} />
              <Typography variant="h6">Analyzing your request</Typography>
              <Typography>
                Gathering repository context and preparing the result.
              </Typography>
            </Box>
          )
          : result
          ? <StructuredData data={result} />
          : (
            <Box className="result-empty">
              <span className="result-empty-mark">AI</span>
              <Typography variant="h6">Your analysis will appear here</Typography>
              <Typography>
                Select a file or run an action to see a structured result.
              </Typography>
            </Box>
          )}
      </Box>
    </section>
  );
}
