import { useState } from "react";

interface CodePreviewProps {
  code: string;
  title?: string;
}

export default function CodePreview({ code, title }: CodePreviewProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  return (
    <div
      style={{
        border: "1px solid var(--sl-color-gray-5, #2a2a2a)",
        borderRadius: 8,
        overflow: "hidden",
        margin: "1.5rem 0",
        background: "var(--sl-color-bg-sidebar, #17181c)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0.5rem 0.75rem",
          borderBottom: "1px solid var(--sl-color-gray-5, #2a2a2a)",
          fontSize: 13,
        }}
      >
        {title && <strong style={{ marginRight: "auto" }}>{title}</strong>}
        <button
          onClick={() => setTab("preview")}
          aria-pressed={tab === "preview"}
          style={tabStyle(tab === "preview")}
        >
          Preview
        </button>
        <button
          onClick={() => setTab("code")}
          aria-pressed={tab === "code"}
          style={tabStyle(tab === "code")}
        >
          Code
        </button>
      </div>
      {tab === "preview" ? (
        <div style={{ padding: "1.25rem", minHeight: 120 }}>
          <p style={{ opacity: 0.7, fontSize: 13, margin: 0 }}>
            Live rendering wires up to <code>@openmockup/renderer-mantine</code> here.
            Placeholder for the scaffolding pass.
          </p>
        </div>
      ) : (
        <pre
          style={{
            margin: 0,
            padding: "1rem",
            fontSize: 13,
            overflow: "auto",
            background: "transparent",
          }}
        >
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: "0.25rem 0.6rem",
    fontSize: 12,
    borderRadius: 4,
    border: "1px solid transparent",
    cursor: "pointer",
    background: active ? "var(--sl-color-accent-low, #2d3a5e)" : "transparent",
    color: active ? "var(--sl-color-accent-high, #b4c4ff)" : "inherit",
  };
}
