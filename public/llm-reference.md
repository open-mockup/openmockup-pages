# Open Mockup — LLM Reference

> Single-page reference for AI agents. Covers JSX syntax, all components, Flow navigation, and Obsidian code fences.

---

## Formats at a glance

| Extension | Description |
|---|---|
| `.openmockup` | Single-screen JSX mockup |
| `.omx` | Same as above, flow-aware (for multi-screen projects) |
| `.flow.omx` | Multi-screen navigation graph |
| `.dsl.ts` | TypeScript builder source |
| `.uidsl.json` | Canonical JSON IR (machine output) |

All formats share the same component vocabulary. JSX files (`.openmockup`, `.omx`) are the primary authoring format.

---

## JSX syntax

Files are JSX without `import` or `export`. The root element is always `<Page>`.

```jsx
<Page title="Screen name">
  {/* content */}
</Page>
```

`title` is required. Self-closing `<Page title="T" />` is valid for an empty screen.

### Prop encoding

```
string       →  label="text"
number       →  gap={8}
true         →  required              (shorthand, never ={true})
false        →  required={false}      (explicit when needed)
string[]     →  tabs={["A", "B", "C"]}
object[]     →  items={[{"key": "a", "label": "A"}]}
```

Object array props use inline object literals. This is the preferred JSX form for segmented buttons and navigation items.

---

## Layout components

### Stack

Primary container. Vertical or horizontal.

```jsx
<Stack direction="vertical" gap={8}>
  <Label text="Item A" />
  <Label text="Item B" />
</Stack>

<Stack direction="horizontal" gap={4}>
  <Button label="Save" variant="primary" />
  <LinkAction label="Cancel" />
</Stack>
```

| Prop | Type | Values | Default |
|---|---|---|---|
| `direction` | string | `"vertical"` `"horizontal"` | `"vertical"` |
| `gap` | number | px | `8` |

### Grid

Uniform grid with a fixed column count.

```jsx
<Grid columns={3}>
  <Card title="Card 1">…</Card>
  <Card title="Card 2">…</Card>
  <Card title="Card 3">…</Card>
</Grid>
```

| Prop | Type | Default |
|---|---|---|
| `columns` | number | `2` |

### Split

Two side-by-side panels with a width ratio. Requires exactly two children.

```jsx
<Split ratio={0.3}>
  <Section title="Sidebar">…</Section>
  <Section title="Content">…</Section>
</Split>
```

| Prop | Type | Description |
|---|---|---|
| `ratio` | number | Left fraction (0–1). `0.3` = 30 % / 70 % |

### Section

Named block with a title and border.

```jsx
<Section title="Order details">
  <Form>…</Form>
</Section>
```

### Card

Card with a title. For metrics, widgets, summary blocks.

```jsx
<Card title="Revenue">
  <Stat label="This month" value="$48 000" />
  <Stat label="Last month"  value="$41 200" />
</Card>
```

---

## Action components

### Button

```jsx
<Button label="Save"    variant="primary" />
<Button label="Cancel"  variant="secondary" />
<Button label="Delete"  variant="danger" />
<Button label="More"    variant="ghost" />
```

| Prop | Values |
|---|---|
| `label` | string |
| `variant` | `"primary"` `"secondary"` `"danger"` `"ghost"` |

### IconButton

Icon-only button. `label` is the aria-label (not visible).

```jsx
<IconButton icon="search" label="Search" variant="secondary" />
```

`icon` values: `"search"` `"map"` `"chart"` `"user"` `"photo"`

### LinkAction

Text link action.

```jsx
<LinkAction label="View details" />
```

### ActionBar

Horizontal button group, typically at the bottom of a form or section.

```jsx
<ActionBar>
  <Button label="Confirm"    variant="primary" />
  <Button label="Save draft" variant="secondary" />
  <LinkAction label="Cancel" />
</ActionBar>
```

Children: `Button`, `LinkAction`, `IconButton`.

### SegmentedButton

Radio-style toggle as buttons.

Use an `items` object array. Each item has a stable `key` and visible `label`; `activeKey` selects the current segment.

```jsx
<SegmentedButton
  items={[{"key": "list", "label": "List"}, {"key": "grid", "label": "Grid"}]}
  activeKey="list"
/>
```

| Prop | Type | Description |
|---|---|---|
| `items` | `{ key: string; label: string }[]` | Segment options |
| `activeKey` | string | Selected item key |

---

## Form components

### Form

Container for fields. Renders as a vertical stack.

### Field

Single form field. Type is set by `component`.

```jsx
<Field name="title"    label="Title"     component="textInput"   placeholder="…" required />
<Field name="notes"    label="Notes"     component="textArea" />
<Field name="status"   label="Status"    component="select"      options={["Active", "Inactive"]} />
<Field name="tags"     label="Tags"      component="multiSelect" options={["Bug", "Feature", "Docs"]} />
<Field name="agree"    label="I agree"   component="checkbox" />
<Field name="plan"     label="Plan"      component="radioGroup"  options={["Free", "Pro", "Enterprise"]} />
<Field name="notify"   label="Notify"    component="switch" />
<Field name="due"      label="Due date"  component="dateInput" />
<Field name="pass"     label="Password"  component="passwordInput" required />
<Field name="query"    label="Search"    component="searchInput" placeholder="Find…" />
<Field name="amount"   label="Amount"    component="numericInput" />
```

| Prop | Description |
|---|---|
| `name` | Unique key within the form |
| `label` | Field label |
| `component` | Field type (see above) |
| `required` | Boolean shorthand |
| `placeholder` | Hint text |
| `options` | String array for `select`, `multiSelect`, `radioGroup` |

---

## Data components

### Table

Simple (text only):

```jsx
<Table
  columns="ID / Customer / Status / Total"
  rows="1 / John Doe / Active / $1 200\n2 / J. Smith / Inactive / $50"
/>
```

With interactive columns (buttons or badges in cells):

```jsx
<Table rows="John Doe / Active\nJ. Smith / Inactive">
  <Column header="Name" />
  <Column header="Status" />
  <Column header="Actions">
    <Button label="Edit" variant="secondary" />
  </Column>
</Table>
```

Rows: cells separated by ` / `, rows separated by `\n`.

### Stat

```jsx
<Stat label="Monthly Revenue" value="$48 000" />
<Stat label="Open Tickets"    value={142} />
```

### List

```jsx
<List dataSource="orders" itemTemplate="#{id} — {customer}" />
```

### Tree

```jsx
<Tree dataSource="categories" />
```

### Progress

```jsx
<Progress value={75} />
```

### Pagination

```jsx
<Pagination page={1} pageSize={20} total={243} />
```

---

## Navigation components

### Tabs

```jsx
<Tabs tabs={["All", "Active", "Closed"]} active={0} />
```

Flow-aware tabs use keyed object items. `key` identifies the tab, `label` is visible text, `action` is the flow action emitted on click, and `activeKey` selects the active tab. VS Code preview is currently the first renderer that implements the click behavior.

```jsx
<Tabs
  activeKey="strategy"
  tabs={[
    { key: "overview", label: "Обзор", action: "open-overview" },
    { key: "strategy", label: "Стратегия", action: "open-strategy" }
  ]}
/>
```

| Prop | Type | Description |
|---|---|---|
| `tabs` | `string[] \| { key; label; action? }[]` | Tab labels or keyed tab items |
| `active` | number | Legacy active tab index for string[] tabs |
| `activeKey` | string | Active tab key for keyed tab items |

### TopNav

```jsx
<TopNav
  brand="MyApp"
  items={[{"key": "home", "label": "Home"}, {"key": "orders", "label": "Orders"}]}
  activeKey="orders"
/>
```

### SidebarNav

```jsx
<SidebarNav
  items={[{"key": "dashboard", "label": "Dashboard"}, {"key": "clients", "label": "Clients"}]}
  activeKey="dashboard"
/>
```

### Breadcrumb

```jsx
<Breadcrumb items={["Home", "Clients", "John Doe"]} />
```

### Menu / ContextMenu

```jsx
<Menu items={[{"key": "edit", "label": "Edit"}, {"key": "delete", "label": "Delete"}]} />

<ContextMenu
  triggerLabel="Actions"
  items={[{"key": "view", "label": "View"}, {"key": "archive", "label": "Archive"}]}
/>
```

---

## Feedback components

### Alert

```jsx
<Alert variant="info"    text="Your changes have been saved." />
<Alert variant="success" text="Order confirmed." />
<Alert variant="warning" text="This action cannot be undone." />
<Alert variant="error"   text="Connection failed. Please try again." />
```

### Badge / Tooltip

```jsx
<Badge text="New" />
<Tooltip text="Click to expand the section" />
```

### EmptyState / LoadingState

```jsx
<EmptyState title="No orders yet" description="Create your first order to get started." />
<LoadingState label="Loading orders…" />
```

---

## Media components

### Image

```jsx
<Image aspectRatio="16:9" label="Product photo" />
```

`aspectRatio`: `"16:9"` `"4:3"` `"1:1"`

### Avatar

```jsx
<Avatar name="Jane Doe" size="md" />
```

`size`: `"xs"` `"sm"` `"md"` `"lg"` `"xl"`

### Chart

```jsx
<Chart chartType="bar"  title="Revenue by month" />
<Chart chartType="line" />
<Chart chartType="pie"  title="Distribution" />
<Chart chartType="area" />
```

### Map / IconPlaceholder

```jsx
<Map label="Office location" />
<IconPlaceholder icon="photo" />
```

---

## Overlay components

Overlays without `open` render as labelled flat blocks in wireframes. Add `open` when the mockup is a snapshot of the open modal/drawer state; use `open={false}` to model the closed state.

### Modal

```jsx
<Modal title="Confirm deletion">
  <Paragraph text="This action cannot be undone." />
  <ActionBar>
    <Button label="Delete" variant="danger" />
    <Button label="Cancel" variant="secondary" />
  </ActionBar>
</Modal>

<Modal title="Create calculation" open>
  <Form>…</Form>
</Modal>
```

### Drawer

```jsx
<Drawer side="right">
  <Form>…</Form>
</Drawer>

<Drawer side="right" open>
  <Form>…</Form>
</Drawer>
```

`side`: `"left"` `"right"` `"top"` `"bottom"`
`open`: boolean, optional. `true` renders the overlay open, `false` hides it, omitted keeps the flat wireframe block.

### Popover

```jsx
<Popover>
  <Field name="status" label="" component="radioGroup" options={["All", "Active", "Closed"]} />
</Popover>
```

---

## Text components

```jsx
<Heading   text="Order Summary" level={2} />
<Paragraph text="A longer description that may span multiple lines." />
<Label     text="Created by John Doe" />
```

`level`: 1–6

---

## CustomComponent

For project-specific widgets with no matching core node. Never invent new core element names.

```jsx
<CustomComponent component="RichTextEditor" />
<CustomComponent component="SignaturePad" />
```

---

## Flow — multi-screen navigation

### File types

| File | Purpose |
|---|---|
| `screen.omx` | Single page, authored in JSX |
| `app.flow.omx` | Navigation graph referencing pages |

### Flow file

```jsx
<Flow initial="contact">

  <!-- external files -->
  <Page id="contact" src="./contact.omx">
    <Go on="submit" to="shipping" />
    <Go on="help"   to="help-modal" modal />
  </Page>

  <Page id="shipping" src="./shipping.omx">
    <Go on="submit" to="done" />
    <Go on="back"   back />
  </Page>

  <Page id="help-modal" src="./help-modal.omx">
    <Go on="close" closeModal />
  </Page>

  <!-- inline page (small auxiliary screens) -->
  <Page id="done">
    <Heading>Order placed!</Heading>
  </Page>

  <!-- global: fires from any page -->
  <Go on="help" to="help-modal" modal />

</Flow>
```

### `<Go>` element

```jsx
<Go on="submit" to="shipping" />         <!-- push (default) -->
<Go on="help"   to="help-modal" modal /> <!-- open as modal -->
<Go on="back"   back />                  <!-- pop stack -->
<Go on="close"  closeModal />            <!-- close modal -->
<Go on="retry"  to="form" replace />     <!-- replace current screen -->
```

| Prop | Description |
|---|---|
| `on` | Action name emitted by a button (`action="submit"`) |
| `to` | Target page `id` |
| `modal` | Open as a modal overlay |
| `back` | Pop navigation stack (`to` not needed) |
| `closeModal` | Close the topmost modal (`to` not needed) |
| `replace` | Replace current screen without adding to stack |

`<Go>` inside `<Page id="x">` is scoped to that page.  
`<Go>` at the `<Flow>` level is global — fires from any active page.

Declare each page id once in a flow. A `<Page id="x" />` is an external page reference resolved by `src`, same-document `name="x"`, or the host registry. A `<Page id="x">` with only `<Go>` children is still an external page reference plus scoped transitions. A page becomes inline only when it has non-`Go` children.

### Page resolution order

For external page references, including `<Page id="x" />` or `<Page id="x">` with only `<Go>` children:

```
1. src="./path.omx"              → explicit file
2. name="x" in same document     → local named block
3. name="x" anywhere in vault    → global search
4. not found                     → error: "page 'x' not found"
```

---

## Obsidian / Markdown code fences

Use ` ```omx ` as the language identifier. The `name=""` attribute makes a block addressable by any flow.

````markdown
```omx name="contact" actions="submit, help"
<Page title="Contact">
  <Form>
    <Field name="email" label="Email" component="textInput" required />
    <ActionBar>
      <Button action="submit" variant="primary" label="Continue" />
      <Button action="help"   variant="ghost"   label="Help" />
    </ActionBar>
  </Form>
</Page>
```
````

Reference it from a flow in any document:

```jsx
<Page id="contact" />   <!-- resolves to name="contact" -->
```

### `uses` — explicit dependencies

````markdown
```omx name="checkout-flow" uses="contact, shipping, help-modal"
<Flow initial="contact">
  <Page id="contact" />
  <Page id="shipping" />
  <Page id="help-modal" />
</Flow>
```
````

`uses` speeds up resolution and creates Obsidian backlinks from the flow to each page.

### `actions` — action contract

````markdown
```omx name="contact" actions="submit, help"
…
```
````

The flow parser warns if a declared action is not handled by any `<Go>`.  
Omit `actions` to skip validation for that page.

### Editor setup for `.omx` files

**VS Code** — `.vscode/settings.json`:
```json
{ "files.associations": { "*.omx": "javascriptreact" } }
```

**IntelliJ / WebStorm**: Settings → Editor → File Types → JSX → add `*.omx`.

---

## Diff-based versions

Markdown may describe two versions of one mockup in a single `openmockup` code block. This is useful for PR review, analyst handoff, and LLM tasks that need to explain what changed.

````markdown
```openmockup
<Page title="Close case">
  <Modal title="Close case">
<<<<< v1
    <Button label="Save" variant="secondary" />
=====
    <Button label="Confirm" variant="primary" />
>>>>> v2
  </Modal>
</Page>
```
````

Markers:

| Marker | Meaning |
|---|---|
| `<<<<< v1` | Start of the before version |
| `=====` | Separator between before and after |
| `>>>>> v2` | End of the after version |

Supporting tools expand every marked chunk into two complete sources: `beforeSource` uses each `v1` chunk, and `afterSource` uses each `v2` chunk. The two expanded sources are parsed as ordinary Open Mockup JSX, then structural diff is rendered as `Diff`, `Before`, `After`, `Source`, and `Changes` tabs.

Markers may wrap a whole `<Page>` or a local child/fragment inside a larger document. Prefer local chunks around the changed nodes when the surrounding structure is unchanged; use a full `<Page>` on both sides when the whole screen context changes. You may use multiple chunks in one block. Markers must be on their own lines, and the expanded `beforeSource` and `afterSource` must each be valid Open Mockup JSX. Prefer stable `id` props for repeated or movable nodes so structural diff can match them across versions.

When explaining diff blocks, report semantic user-facing changes first, then implementation details.

---

## Full example — single screen

```jsx
<Page title="Order Details">
  <Breadcrumb items={["Orders", "ORD-1042"]} />
  <Tabs tabs={["Details", "Items", "History"]} active={0} />

  <Split ratio={0.65}>
    <Section title="Order info">
      <Form>
        <Field name="customer" label="Customer" component="select"
               options={["Acme Corp", "Globex"]} required />
        <Field name="status"   label="Status"   component="select"
               options={["Draft", "Confirmed", "Shipped"]} />
        <Field name="note"     label="Note"     component="textArea" />
      </Form>
    </Section>

    <Stack direction="vertical" gap={16}>
      <Card title="Summary">
        <Stat label="Items" value={3} />
        <Stat label="Total" value="$1 480" />
      </Card>
      <Alert variant="warning" text="Payment not received yet." />
    </Stack>
  </Split>

  <Section title="Line items">
    <Table
      columns="SKU / Product / Qty / Unit price / Total"
      rows="A-001 / Widget Pro / 2 / $240 / $480\nB-012 / Bracket Kit / 10 / $18 / $180"
    />
  </Section>

  <ActionBar>
    <Button label="Confirm order" variant="primary" />
    <Button label="Save draft"    variant="secondary" />
    <LinkAction label="Cancel" />
  </ActionBar>
</Page>
```

---

## Full example — multi-screen flow

**`contact.omx`**
```jsx
<Page title="Contact info">
  <Form>
    <Field name="name"  label="Full name" component="textInput" required />
    <Field name="email" label="Email"     component="textInput" required />
    <Field name="phone" label="Phone"     component="textInput" />
    <ActionBar>
      <Button action="submit" variant="primary" label="Continue" />
      <Button action="help"   variant="ghost"   label="Help" />
    </ActionBar>
  </Form>
</Page>
```

**`shipping.omx`**
```jsx
<Page title="Shipping">
  <Form>
    <Field name="address" label="Address" component="textInput" required />
    <Field name="city"    label="City"    component="select"
           options={["Moscow", "Saint Petersburg", "Kazan"]} />
    <ActionBar>
      <Button action="submit" variant="primary"   label="Place order" />
      <Button action="back"   variant="secondary" label="Back" />
    </ActionBar>
  </Form>
</Page>
```

**`checkout.flow.omx`**
```jsx
<Flow initial="contact">
  <Page id="contact" src="./contact.omx">
    <Go on="submit" to="shipping" />
  </Page>

  <Page id="shipping" src="./shipping.omx">
    <Go on="submit" to="done" />
    <Go on="back"   back />
  </Page>

  <Page id="help-modal" src="./help-modal.omx">
    <Go on="close" closeModal />
  </Page>

  <Page id="done">
    <Heading>Order placed!</Heading>
  </Page>

  <Go on="help" to="help-modal" modal />
</Flow>
```

---

## CLI

```bash
openmockup page.openmockup          # validate — print title and node count
openmockup fmt page.openmockup      # normalise and pretty-print JSX
openmockup fmt page.openmockup -o out.openmockup
openmockup ir  page.openmockup      # dump IR as JSON
openmockup ir  page.openmockup | jq .title
```

---

## TypeScript DSL

For programmatic use or pipelines.

```bash
npm install @openmockup/dsl @openmockup/renderer-core @openmockup/renderer-mantine
```

```ts
import { page, section, form, field, actionBar, button, linkAction } from "@openmockup/dsl";
import { render } from "@openmockup/renderer-core";
import { mantineRenderer } from "@openmockup/renderer-mantine";

const doc = page("New Order", [
  section("Order details", [
    form([
      field("customer", "Customer", "select", { options: ["Acme Corp", "Globex"], required: true }),
      field("due",  "Due date", "dateInput"),
      field("note", "Note",     "textArea"),
    ]),
  ]),
  actionBar([
    button("Create order", "primary"),
    button("Save draft",   "secondary"),
    linkAction("Cancel"),
  ]),
]);

const element = render(doc, mantineRenderer); // React.ReactElement
```

---

## Generation rules

Follow these when producing `.openmockup` or `.omx` files:

1. Root is always `<Page title="…">`.
2. Use `CustomComponent` for unknown widgets — never invent new core element names.
3. `Split` requires exactly two children.
4. `boolean true` props use shorthand: `required`, not `required={true}`.
5. Use `<Modal open>` or `<Drawer open>` for static snapshots of an already-open overlay. Use `<Flow>` + `<Go modal>` when the document needs click-through behavior.
6. `action` refs on `<Button action="…">` use `verb-object` style: `save-order`, `open-filter`, `row-edit`.
7. Table cell separator: ` / ` (space-slash-space). Row separator: `\n`.
8. Run `openmockup path/to/file.openmockup` to validate output.
