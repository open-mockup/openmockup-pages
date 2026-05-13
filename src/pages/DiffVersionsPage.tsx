import React from "react";
import {
  Badge,
  Box,
  Divider,
  List,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";

function H2({ children }: { children: React.ReactNode }) {
  return (
    <Title order={2} mt="xl" mb="sm">
      {children}
    </Title>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <Title order={3} mt="lg" mb={6}>
      {children}
    </Title>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <Text mb="xs" style={{ lineHeight: 1.7 }}>
      {children}
    </Text>
  );
}

function Code({ lang, code }: { lang: string; code: string }) {
  return (
    <Box mb="md">
      <CodeHighlight code={code.trim()} language={lang} />
    </Box>
  );
}

function PropTable({ rows }: { rows: string[][] }) {
  const header = rows[0]!;
  const body = rows.slice(1);
  return (
    <Box mb="md" style={{ overflowX: "auto" }}>
      <Table striped withTableBorder withColumnBorders fz="sm">
        <Table.Thead>
          <Table.Tr>
            {header.map((h) => (
              <Table.Th key={h}>{h}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {body.map((row, i) => (
            <Table.Tr key={i}>
              {row.map((cell, j) => (
                <Table.Td key={j}>
                  <Text size="sm" ff="monospace">
                    {cell}
                  </Text>
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}

export function DiffVersionsPage() {
  return (
    <Stack gap={0}>
      <Box>
        <Badge mb="xs" variant="light" color="violet" size="sm">
          Versioning
        </Badge>
        <Title order={1} mb="xs">
          Diff-Based Versions
        </Title>
        <Text c="dimmed" size="lg" mb="md">
          Describe two Open Mockup versions in one Markdown block so agents,
          reviewers, and previews can read what changed without opening binary
          design files.
        </Text>
      </Box>

      <Divider mb="xl" />

      <H2>Use case</H2>
      <P>
        Diff-based versions are for design reviews, PR notes, experiment
        fixtures, and analyst handoffs where the important artifact is the
        transition from one UI state to another.
      </P>
      <P>
        Use this format when a reviewer should understand the semantic change:
        added fields, removed actions, changed labels, new validation, or a new
        state. Keep regular <code>.omx</code> or <code>.openmockup</code> files
        for single current-state screens.
      </P>

      <H2>Markdown Block</H2>
      <P>
        Put the two versions into one <code>openmockup</code> fenced block. The
        markers intentionally look like a conflict block, but they are not a Git
        conflict; they are a compact before/after container.
      </P>
      <P>
        The preview expands every marked chunk into two complete sources:
        <code>beforeSource</code> uses each <code>v1</code> chunk, and{" "}
        <code>afterSource</code> uses each <code>v2</code> chunk. Those expanded
        sources are parsed and compared as ordinary Open Mockup JSX.
      </P>
      <Code
        lang="markdown"
        code={`\`\`\`openmockup
<Page title="Close case">
  <Modal title="Close case">
<<<<< v1
    <Button label="Save" variant="secondary" />
=====
    <Button label="Confirm" variant="primary" />
>>>>> v2
  </Modal>
</Page>
\`\`\``}
      />

      <PropTable
        rows={[
          ["Marker", "Meaning"],
          ["<<<<< v1", "Start of the before version"],
          ["=====", "Separator between before and after"],
          [">>>>> v2", "End of the after version"],
        ]}
      />

      <H3>Multiple chunks</H3>
      <P>
        Use several chunks when separate areas of one screen changed. The
        renderer still builds one before page and one after page.
      </P>
      <Code
        lang="markdown"
        code={`\`\`\`openmockup
<Page title="Order review">
<<<<< v1
  <Heading text="Draft order" level={2} />
=====
  <Heading text="Ready to submit" level={2} />
>>>>> v2
  <ActionBar>
<<<<< v1
    <Button label="Save draft" variant="secondary" />
=====
    <Button label="Submit order" variant="primary" />
>>>>> v2
  </ActionBar>
</Page>
\`\`\``}
      />

      <H2>Preview Behavior</H2>
      <P>
        Tools that support diff blocks can render the expanded before/after
        sources as tabs instead of showing raw source.
      </P>
      <List spacing="xs" mb="md">
        <List.Item>
          <code>Diff</code> highlights added, removed, and changed nodes.
        </List.Item>
        <List.Item>
          <code>Before</code> renders only the <code>v1</code> mockup.
        </List.Item>
        <List.Item>
          <code>After</code> renders only the <code>v2</code> mockup.
        </List.Item>
        <List.Item>
          <code>Source</code> shows a line-level source diff.
        </List.Item>
        <List.Item>
          <code>Changes</code> summarizes structural additions, removals, and
          changed props when the host implements it.
        </List.Item>
      </List>

      <H2>Authoring Rules</H2>
      <List spacing="xs" mb="md">
        <List.Item>
          Markers must be on their own lines: <code>&lt;&lt;&lt;&lt;&lt; v1</code>,{" "}
          <code>=====</code>, and <code>&gt;&gt;&gt;&gt;&gt; v2</code>.
        </List.Item>
        <List.Item>
          For a complete screen, repeat the full <code>&lt;Page&gt;</code> on
          both sides. For a local change, wrap matching children or fragments,
          such as two <code>&lt;Button&gt;</code> or <code>&lt;Modal&gt;</code>{" "}
          versions.
        </List.Item>
        <List.Item>
          The expanded <code>beforeSource</code> and{" "}
          <code>afterSource</code> must each be valid Open Mockup JSX.
        </List.Item>
        <List.Item>
          Multiple chunks are allowed in one block when separate parts of the
          same screen changed.
        </List.Item>
        <List.Item>
          Prefer stable <code>id</code> props for repeated or movable nodes so
          structural diff can match them across versions.
        </List.Item>
        <List.Item>
          Keep formatting normalized; noisy reformatting weakens Git review.
        </List.Item>
        <List.Item>
          Write semantic changes directly in the mockup: labels, required flags,
          actions, validation, roles, and states should be visible in the DSL.
        </List.Item>
        <List.Item>
          Do not use this block as long-term storage for the canonical screen.
          Store the current screen separately and use diff blocks to document
          version transitions.
        </List.Item>
      </List>

      <H2>Git Diff</H2>
      <P>
        A normal Git diff remains useful for reviewing mockup files because the
        format is text. For small changes, reviewers can often understand the UI
        delta directly from the PR diff.
      </P>
      <Code
        lang="diff"
        code={`<Form>
-  <Field name="email" label="Email" component="textInput" required />
+  <Field name="phone" label="Phone" component="textInput" required />
+  <Field name="smsOtp" label="SMS code" component="numericInput" required />
   <Button action="continue" label="Continue" variant="primary" />
</Form>`}
      />

      <H2>LLM Instructions</H2>
      <P>
        When asked to explain a diff block, report user-facing changes first,
        then implementation details. Avoid descriptions that only say a tag or
        prop changed if the semantic effect is visible.
      </P>
      <Code
        lang="text"
        code={`Good:
- Comment became required.
- A primary Confirm action was added.

Weak:
- Added required prop.
- Added Button component.`}
      />

      <H3>Recommended output shape</H3>
      <Code
        lang="markdown"
        code={`## Semantic changes
1. Comment is now required.
2. Confirmation is explicit through a new primary button.

## Risk / review notes
- Check whether making comment required matches the business rule.`}
      />
    </Stack>
  );
}
