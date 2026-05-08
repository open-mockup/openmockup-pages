import React from "react";
import {
  Alert,
  AppShell,
  Badge,
  Box,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
  ActionIcon,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMoon, IconSun, IconBrandGithub, IconChevronsLeft, IconChevronsRight, IconRobot } from "@tabler/icons-react";

const LLM_REF_URL = `${import.meta.env.BASE_URL}llm-reference.md`;
import { navigation } from "../nav.js";

interface ShellProps {
  activePage: string;
  onNavigate: (id: string) => void;
  children: React.ReactNode;
}

export function Shell({ activePage, onNavigate, children }: ShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("light");

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 240, breakpoint: "sm", collapsed: { mobile: !opened, desktop: !desktopOpened } }}
      padding={0}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="xs">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text
              fw={800}
              size="lg"
              style={{ letterSpacing: "-0.5px", cursor: "default" }}
            >
              Open Mockup
            </Text>
            <Badge size="xs" variant="light" color="indigo">
              DSL v0.1.6
            </Badge>
          </Group>

          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() =>
                setColorScheme(computed === "dark" ? "light" : "dark")
              }
            >
              {computed === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" component="a" href="https://github.com/open-mockup/open-mockup" target="_blank">
              <IconBrandGithub size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <AppShell.Navbar>
        <ScrollArea px="xs" py="md">
          {navigation.map((section, si) => (
            <Box key={section.label} mb="sm">
              {si > 0 && <Divider mb="sm" />}
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                c="dimmed"
                px="sm"
                mb={4}
              >
                {section.label}
              </Text>
              {section.items.map((item) => (
                <NavLink
                  key={item.id}
                  label={item.label}
                  active={item.id === activePage}
                  onClick={() => onNavigate(item.id)}
                  style={{ borderRadius: 6 }}
                />
              ))}
            </Box>
          ))}
        </ScrollArea>
      </AppShell.Navbar>

      {/* ── Main ───────────────────────────────────────────────── */}
      <AppShell.Main>
        <ActionIcon
          visibleFrom="sm"
          variant="filled"
          color="gray"
          radius="xl"
          onClick={toggleDesktop}
          aria-label={desktopOpened ? "Hide navigation" : "Show navigation"}
          style={{
            position: "fixed",
            top: 72,
            left: desktopOpened ? 228 : 8,
            zIndex: 300,
            transition: "left 120ms ease",
            boxShadow: "var(--mantine-shadow-sm)",
          }}
        >
          {desktopOpened ? <IconChevronsLeft size={16} /> : <IconChevronsRight size={16} />}
        </ActionIcon>
        <Alert
          variant="filled"
          color="blue"
          icon={<IconRobot size={16} />}
          radius={0}
          py={6}
          style={{ borderBottom: "1px solid var(--mantine-color-blue-7)" }}
        >
          <Text size="sm">
            LLM Reference (Markdown):{" "}
            <Text
              span
              ff="monospace"
              size="sm"
              component="a"
              href={LLM_REF_URL}
              target="_blank"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              {LLM_REF_URL}
            </Text>
            {" "}— вставьте в system prompt для on-demand справки по компонентам.
          </Text>
        </Alert>
        <Box maw={1500} mx="auto" px={{ base: "sm", md: "md" }} py="lg">
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
