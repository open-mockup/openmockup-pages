/**
 * jsxRenderer outputs text as JSX children for these components:
 *   <Alert variant="info">Hello</Alert>  →  <Alert variant="info" text="Hello" />
 *   <Button variant="primary">Save</Button>  →  <Button variant="primary" label="Save" />
 *
 * parseJsx only reads JSX element children, so text nodes are lost.
 * This function normalises the source before parsing to restore round-trip fidelity.
 */

const TEXT_CHILD_TAGS: Record<string, string> = {
  Alert: "text",
  Badge: "text",
  Label: "text",
  Heading: "text",
  Paragraph: "text",
  Button: "label",
  LinkAction: "label",
};

export function normalizeJsx(source: string): string {
  let result = source;
  for (const [tag, prop] of Object.entries(TEXT_CHILD_TAGS)) {
    // Match <Tag ...attrs...>plain text</Tag> — no nested JSX inside
    const re = new RegExp(
      `<${tag}((?:[^>]|"[^"]*"|'[^']*')*?)>([^<]+?)<\\/${tag}>`,
      "g"
    );
    result = result.replace(re, (_, attrs, text) => {
      const value = text.trim().replace(/"/g, "&quot;");
      return `<${tag}${attrs} ${prop}="${value}" />`;
    });
  }
  return result;
}
