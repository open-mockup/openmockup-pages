import React, { useState } from "react";
import { Shell } from "./layout/Shell.js";
import { ButtonPage } from "./pages/ButtonPage.js";
import { DataPage } from "./pages/DataPage.js";
import { FeedbackPage } from "./pages/FeedbackPage.js";
import { FormPage } from "./pages/FormPage.js";
import { FlowPage } from "./pages/FlowPage.js";
import { InputsPage } from "./pages/InputsPage.js";
import { LayoutPage } from "./pages/LayoutPage.js";
import { NavigationPage } from "./pages/NavigationPage.js";
import { OverlayPage } from "./pages/OverlayPage.js";
import { PlaygroundPage } from "./pages/PlaygroundPage.js";
import { TextPage } from "./pages/TextPage.js";
import { CookbookPage } from "./pages/CookbookPage.js";
import { LlmReferencePage } from "./pages/LlmReferencePage.js";
import { DiffVersionsPage } from "./pages/DiffVersionsPage.js";

export function App() {
  const [page, setPage] = useState("playground");

  function renderPage() {
    switch (page) {
      case "playground":
        return <PlaygroundPage onNavigate={setPage} />;
      case "flow-editor":
        return <FlowPage />;
      case "cookbook":
        return <CookbookPage />;
      case "llm-reference":
        return <LlmReferencePage />;
      case "diff-versions":
        return <DiffVersionsPage />;

      case "label":
      case "heading":
      case "paragraph":
        return <TextPage />;

      case "button":
      case "icon-button":
      case "segmented-button":
      case "action-bar":
      case "link-action":
        return <ButtonPage />;

      case "stack":
      case "grid":
      case "card":
      case "section":
      case "split":
        return <LayoutPage />;

      case "form":
      case "field":
      case "multi-select":
        return <FormPage />;

      case "password-input":
      case "search-input":
      case "numeric-input":
        return <InputsPage />;

      case "table":
      case "list":
      case "stat":
      case "tree":
      case "image":
      case "icon-placeholder":
      case "avatar":
      case "chart":
      case "map":
        return <DataPage />;

      case "alert":
      case "tooltip":
      case "badge":
      case "progress":
      case "empty-state":
      case "loading-state":
        return <FeedbackPage />;

      case "tabs":
      case "breadcrumb":
      case "pagination":
      case "sidebar-nav":
      case "top-nav":
      case "menu":
      case "context-menu":
        return <NavigationPage />;

      case "modal":
      case "drawer":
      case "popover":
        return <OverlayPage />;

      default:
        return null;
    }
  }

  return (
    <Shell activePage={page} onNavigate={setPage}>
      {renderPage()}
    </Shell>
  );
}
