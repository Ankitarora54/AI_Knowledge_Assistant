import { Box, Chip, Typography } from "@mui/material";

function titleFromKey(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function sectionTheme(key, parentKey = "") {
  const normalized = `${parentKey} ${key}`.toLowerCase();

  if (normalized.includes("relatedknowledge")) {
    return { tone: "knowledge", marker: "KN" };
  }

  if (normalized.includes("jira")) {
    return { tone: "jira", marker: "JR" };
  }

  if (normalized.includes("confluence")) {
    return { tone: "confluence", marker: "CF" };
  }

  if (
    normalized.includes("risk") ||
    normalized.includes("issue") ||
    normalized.includes("debt") ||
    normalized.includes("concern")
  ) {
    return { tone: "risk", marker: "!" };
  }

  if (
    normalized.includes("business") ||
    normalized.includes("purpose") ||
    normalized.includes("executive")
  ) {
    return { tone: "business", marker: "BP" };
  }

  if (
    normalized.includes("technical") ||
    normalized.includes("architecture") ||
    normalized.includes("implementation")
  ) {
    return { tone: "technical", marker: "TS" };
  }

  if (
    normalized.includes("depend") ||
    normalized.includes("upstream") ||
    normalized.includes("downstream") ||
    normalized.includes("impact")
  ) {
    return { tone: "dependency", marker: "DP" };
  }

  if (
    normalized.includes("recommend") ||
    normalized.includes("enhancement") ||
    normalized.includes("suggestion") ||
    normalized.includes("action")
  ) {
    return { tone: "action", marker: "NX" };
  }

  if (
    normalized.includes("feature") ||
    normalized.includes("strength") ||
    normalized.includes("improvement") ||
    normalized.includes("fix")
  ) {
    return { tone: "success", marker: "+" };
  }

  if (
    normalized.includes("history") ||
    normalized.includes("change") ||
    normalized.includes("commit") ||
    normalized.includes("timeline")
  ) {
    return { tone: "history", marker: "HT" };
  }

  return { tone: "neutral", marker: "AI" };
}

function PrimitiveValue({ value }) {
  if (typeof value === "boolean") {
    return (
      <Chip
        size="small"
        label={value ? "Yes" : "No"}
        color={value ? "success" : "default"}
      />
    );
  }

  if (value === null || value === undefined || value === "") {
    return <Typography className="empty-value">Not available</Typography>;
  }

  if (typeof value === "number") {
    return <Typography className="metric-value">{value.toLocaleString()}</Typography>;
  }

  if (
    typeof value === "string" &&
    /^https?:\/\//i.test(value)
  ) {
    return (
      <a
        className="result-link"
        href={value}
        target="_blank"
        rel="noreferrer"
      >
        Open link
      </a>
    );
  }

  return <Typography className="text-value">{String(value)}</Typography>;
}

function TableValue({ value }) {
  if (value === null || value === undefined || value === "") {
    return <span className="table-empty">Not available</span>;
  }

  return String(value);
}

function RelevanceBadge({ value }) {
  if (value === null || value === undefined) {
    return <span className="table-empty">N/A</span>;
  }

  return (
    <span className="relevance-badge">
      {Math.round(Number(value) * 100)}%
    </span>
  );
}

function ResultTable({ type, rows }) {
  if (!rows.length) {
    return <Typography className="empty-value">No associated items</Typography>;
  }

  if (type === "jira") {
    return (
      <Box className="knowledge-table-wrap">
        <table className="knowledge-table jira-table">
          <thead>
            <tr>
              <th>Issue</th>
              <th>Summary</th>
              <th>Status</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Relevance</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.issueKey || index}>
                <td className="table-key">
                  <TableValue value={row.issueKey} />
                </td>
                <td className="table-description">
                  <TableValue value={row.summary} />
                </td>
                <td><TableValue value={row.status} /></td>
                <td><TableValue value={row.issueType} /></td>
                <td><TableValue value={row.priority} /></td>
                <td><RelevanceBadge value={row.relevance} /></td>
                <td>
                  {row.url
                    ? (
                      <a
                        className="table-link"
                        href={row.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    )
                    : <span className="table-empty">N/A</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    );
  }

  return (
    <Box className="knowledge-table-wrap">
      <table className="knowledge-table confluence-table">
        <thead>
          <tr>
            <th>Page ID</th>
            <th>Title</th>
            <th>Excerpt</th>
            <th>Relevance</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.pageId || index}>
              <td className="table-key">
                <TableValue value={row.pageId} />
              </td>
              <td className="table-title">
                <TableValue value={row.title} />
              </td>
              <td className="table-description">
                <TableValue value={row.excerpt} />
              </td>
              <td><RelevanceBadge value={row.relevance} /></td>
              <td>
                {row.url
                  ? (
                    <a
                      className="table-link"
                      href={row.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  )
                  : <span className="table-empty">N/A</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

export default function StructuredData({
  data,
  level = 0,
  parentKey = ""
}) {
  if (Array.isArray(data)) {
    if (parentKey === "jiraStories") {
      return <ResultTable type="jira" rows={data} />;
    }

    if (parentKey === "confluencePages") {
      return <ResultTable type="confluence" rows={data} />;
    }

    if (!data.length) {
      return <Typography className="empty-value">No items</Typography>;
    }

    const primitives = data.every(
      (item) => item === null || typeof item !== "object"
    );

    if (primitives) {
      return (
        <Box className="chip-list">
          {data.map((item, index) => (
            <Chip key={`${item}-${index}`} label={String(item)} />
          ))}
        </Box>
      );
    }

    return (
      <Box className="result-list">
        {data.map((item, index) => (
          <Box className="result-list-item" key={index}>
            <span className="item-index">{index + 1}</span>
            <StructuredData
              data={item}
              level={level + 1}
              parentKey={parentKey}
            />
          </Box>
        ))}
      </Box>
    );
  }

  if (data && typeof data === "object") {
    return (
      <Box className={`structured-grid ${level > 0 ? "is-nested" : ""}`}>
        {Object.entries(data).map(([key, value]) => {
          const theme = sectionTheme(key, parentKey);

          return (
            <Box
              className={[
                "data-section",
                `tone-${theme.tone}`,
                value && typeof value === "object" ? "is-complex" : "",
                level === 0 ? "is-primary-section" : "is-nested-section"
              ].filter(Boolean).join(" ")}
              key={key}
            >
              <Box className="data-section-heading">
                <span className="section-marker">{theme.marker}</span>
                <Typography className="data-label">
                  {titleFromKey(key)}
                </Typography>
              </Box>
              <Box className="data-section-content">
                {value && typeof value === "object"
                  ? (
                    <StructuredData
                      data={value}
                      level={level + 1}
                      parentKey={key}
                    />
                  )
                  : <PrimitiveValue value={value} />}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  return <PrimitiveValue value={data} />;
}
