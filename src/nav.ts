export interface NavItem {
  label: string;
  id: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    label: "Playground",
    items: [
      { label: "Live Editor", id: "playground" },
      { label: "Flow Editor", id: "flow-editor" },
      { label: "LLM Reference", id: "llm-reference" },
      { label: "Diff Versions", id: "diff-versions" },
    ],
  },
  {
    label: "Cookbook",
    items: [
      { label: "20 паттернов", id: "cookbook" },
    ],
  },
  {
    label: "Text",
    items: [
      { label: "Label",     id: "label" },
      { label: "Heading",   id: "heading" },
      { label: "Paragraph", id: "paragraph" },
    ],
  },
  {
    label: "Actions",
    items: [
      { label: "Button",    id: "button" },
      { label: "IconButton", id: "icon-button" },
      { label: "SegmentedButton", id: "segmented-button" },
      { label: "ActionBar", id: "action-bar" },
      { label: "LinkAction", id: "link-action" },
    ],
  },
  {
    label: "Layout",
    items: [
      { label: "Stack",   id: "stack" },
      { label: "Grid",    id: "grid" },
      { label: "Card",    id: "card" },
      { label: "Section", id: "section" },
      { label: "Split",   id: "split" },
    ],
  },
  {
    label: "Form",
    items: [
      { label: "Form",          id: "form" },
      { label: "Field",         id: "field" },
      { label: "multiSelect",   id: "multi-select" },
      { label: "passwordInput", id: "password-input" },
      { label: "searchInput",   id: "search-input" },
      { label: "numericInput",  id: "numeric-input" },
    ],
  },
  {
    label: "Data",
    items: [
      { label: "Table", id: "table" },
      { label: "List",  id: "list" },
      { label: "Stat",  id: "stat" },
      { label: "Tree",  id: "tree" },
      { label: "Image", id: "image" },
      { label: "IconPlaceholder", id: "icon-placeholder" },
      { label: "Avatar", id: "avatar" },
      { label: "Chart", id: "chart" },
      { label: "Map", id: "map" },
    ],
  },
  {
    label: "Feedback",
    items: [
      { label: "Alert",        id: "alert" },
      { label: "Tooltip",      id: "tooltip" },
      { label: "Badge",        id: "badge" },
      { label: "Progress",     id: "progress" },
      { label: "EmptyState",   id: "empty-state" },
      { label: "LoadingState", id: "loading-state" },
    ],
  },
  {
    label: "Navigation",
    items: [
      { label: "Tabs",       id: "tabs" },
      { label: "Breadcrumb", id: "breadcrumb" },
      { label: "Pagination", id: "pagination" },
      { label: "SidebarNav", id: "sidebar-nav" },
      { label: "TopNav",     id: "top-nav" },
      { label: "Menu",       id: "menu" },
      { label: "ContextMenu", id: "context-menu" },
    ],
  },
  {
    label: "Overlays",
    items: [
      { label: "Modal",   id: "modal" },
      { label: "Drawer",  id: "drawer" },
      { label: "Popover", id: "popover" },
    ],
  },
];

export const allItems: NavItem[] = navigation.flatMap((s) => s.items);
