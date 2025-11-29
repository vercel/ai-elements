"use client";

import { Suspense } from "react";
import { Banner } from "./banner";
import { ClientNavbar } from "./client-navbar";
import { ElementsButton } from "./elements-button";

export type NavPageItem = {
  href: string;
  tooltip: string;
  name: string;
  external?: boolean;
  shortened?: string;
  render?: () => React.ReactNode;
};

export const PAGES: NavPageItem[] = [
  {
    href: "/docs",
    tooltip: "Docs",
    name: "docs",
  },
  {
    href: "/cookbook",
    tooltip: "Cookbook",
    name: "cookbook",
  },
  {
    href: "/providers",
    tooltip: "Providers",
    name: "providers",
  },
  {
    href: '/tools-registry',
    tooltip: 'Tools Registry',
    name: 'tools-registry',
  },
  {
    href: "/playground",
    tooltip: "Playground",
    name: "playground",
  },
  {
    href: "/elements",
    tooltip: "Elements",
    name: "elements",
    render: () => <ElementsButton />,
  },
  {
    href: "https://vercel.com/ai-gateway",
    tooltip: "AI Gateway",
    name: "ai-gateway",
    shortened: "Gateway",
    external: true,
  },
];

const SuspendedNavbar = () => {
  const pages = PAGES;

  return <ClientNavbar pages={pages} />;
};

export const AiSdkNav = () => (
  <Suspense fallback={<ClientNavbar pages={PAGES} />}>
    <SuspendedNavbar />
    <Banner />
  </Suspense>
);
