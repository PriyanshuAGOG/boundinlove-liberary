import { notFound } from "next/navigation";
import templatesData from "@/data/production-templates.json";
import { InvitationRenderer } from "@/components/factory/InvitationRenderer";
import { demoInvitation, type ProductionTemplate } from "@/components/factory/types";

const templates = templatesData as ProductionTemplate[];

export function generateStaticParams() {
  return templates.map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = templates.find((item) => item.slug === slug);
  if (!template) return {};

  return {
    title: `${template.name} - Invitation Website`,
    description: template.description,
  };
}

export default async function TemplateWebsitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = templates.find((item) => item.slug === slug);
  if (!template) notFound();

  return <InvitationRenderer invitation={demoInvitation} template={template} />;
}
