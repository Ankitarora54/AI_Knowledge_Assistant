import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import api from "../services/api";

function buildTree(files) {
  const root = {};

  files.forEach((file) => {
    const parts = file.path.split("/");
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;

      if (!current[part]) {
        current[part] = isFile
          ? { type: "file", path: file.path, chunkCount: file.chunkCount }
          : { type: "folder", children: {} };
      }

      if (!isFile) {
        current = current[part].children;
      }
    });
  });

  return root;
}

function TreeNode({ name, node, depth, selectedFile, onSelect }) {
  const [expanded, setExpanded] = useState(depth < 1);

  if (node.type === "file") {
    const selected = selectedFile === node.path;

    return (
      <button
        className={`tree-row tree-file ${selected ? "is-selected" : ""}`}
        style={{ paddingLeft: 14 + depth * 16 }}
        title={node.path}
        onClick={() => onSelect(node.path)}
      >
        <span className="file-mark" />
        <span className="tree-label">{name}</span>
      </button>
    );
  }

  const children = Object.entries(node.children).sort(([, a], [, b]) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return 0;
  });

  return (
    <Box>
      <button
        className="tree-row tree-folder"
        style={{ paddingLeft: 10 + depth * 16 }}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className={`tree-chevron ${expanded ? "is-open" : ""}`}>&gt;</span>
        <span className="folder-mark" />
        <span className="tree-label">{name}</span>
      </button>

      {expanded && children.map(([childName, child]) => (
        <TreeNode
          key={child.type === "file" ? child.path : `${name}/${childName}`}
          name={childName}
          node={child}
          depth={depth + 1}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
      ))}
    </Box>
  );
}

export default function RepositoryExplorer({
  repository,
  selectedFile,
  onRepositoryChange,
  onFileSelect
}) {
  const [repositories, setRepositories] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(Boolean(repository));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api.get("/repositories")
      .then(({ data }) => {
        if (!active) return;
        const items = data.repositories || [];
        setRepositories(items);

        if (!repository && items.length) {
          onRepositoryChange(items[0].name);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.error || requestError.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [onRepositoryChange, repository]);

  useEffect(() => {
    if (!repository) {
      return;
    }

    let active = true;

    api.get(`/repositories/${encodeURIComponent(repository)}/files`)
      .then(({ data }) => {
        if (active) {
          setFiles(data.files || []);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.error || requestError.message);
        }
      })
      .finally(() => {
        if (active) setFilesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [repository]);

  const tree = useMemo(() => buildTree(files), [files]);
  const activeRepository = repositories.find((item) => item.name === repository);

  return (
    <aside className="repository-panel">
      <Box className="panel-heading">
        <Typography className="eyebrow">Workspace</Typography>
        <Typography variant="h6">Repository</Typography>
      </Box>

      <FormControl fullWidth size="small">
        <Select
          value={repository}
          displayEmpty
          disabled={loading}
          onChange={(event) => onRepositoryChange(event.target.value)}
          className="repository-select"
        >
          {!repositories.length && (
            <MenuItem value="">No repositories found</MenuItem>
          )}
          {repositories.map((item) => (
            <MenuItem key={item.name} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {activeRepository && (
        <Box className="repo-summary">
          <span>{activeRepository.fileCount} files</span>
          <span>{activeRepository.chunkCount} chunks</span>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mt: 1.5 }}>{error}</Alert>}

      <Box className="files-heading">
        <Typography className="eyebrow">Files</Typography>
        <span>{files.length}</span>
      </Box>

      <Box className="file-tree">
        {filesLoading && (
          <Box className="tree-loading">
            <CircularProgress size={20} />
            <span>Loading files</span>
          </Box>
        )}

        {!filesLoading && Object.entries(tree).map(([name, node]) => (
          <TreeNode
            key={node.type === "file" ? node.path : name}
            name={name}
            node={node}
            depth={0}
            selectedFile={selectedFile}
            onSelect={onFileSelect}
          />
        ))}

        {!filesLoading && repository && !files.length && (
          <Typography className="empty-copy">
            No indexed files are available for this repository.
          </Typography>
        )}
      </Box>

      {selectedFile && (
        <Box className="selected-file-card">
          <Typography className="eyebrow">Selected file</Typography>
          <Typography className="selected-file-name" title={selectedFile}>
            {selectedFile}
          </Typography>
        </Box>
      )}
    </aside>
  );
}
