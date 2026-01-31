import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { CodeBlockContent } from "@repo/elements/src/code-block";

interface TemplatePreviewProps {
  title: string;
  description: string;
  link: string;
  file: string;
}

interface TemplatesProps {
  title: string;
  description: string;
  data: TemplatePreviewProps[];
}

const TemplatePreview = async ({
  title,
  description,
  link,
  file,
}: TemplatePreviewProps) => {
  const code = await readFile(
    join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "examples",
      "src",
      `${file}.tsx`
    ),
    "utf-8"
  );

  return (
    <a
      className="group flex-col overflow-hidden rounded-lg border bg-background p-4"
      href={link}
    >
      <h3 className="font-medium tracking-tight">{title}</h3>
      <p className="line-clamp-2 text-muted-foreground text-sm">
        {description}
      </p>
      <div className="mt-8 -mb-12 ml-7 aspect-video w-full -rotate-3 overflow-hidden rounded-md border object-cover object-top transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-105">
        <div className="w-[200%] origin-top-left scale-50">
          <CodeBlockContent code={code} language="tsx" showLineNumbers={true} />
        </div>
      </div>
    </a>
  );
};

export const Templates = async ({
  title,
  description,
  data,
}: TemplatesProps) => (
  <div className="grid gap-12 p-8 px-4 py-8 sm:p-12 sm:px-12 sm:py-12">
    <div className="grid max-w-3xl gap-2 text-balance">
      <h2 className="font-semibold text-xl tracking-tight sm:text-2xl md:text-3xl lg:text-[40px]">
        {title}
      </h2>
      <p className="text-balance text-lg text-muted-foreground">
        {description}
      </p>
    </div>
    <div className="grid gap-8 md:grid-cols-3">
      {data.map((item) => (
        <TemplatePreview key={item.title} {...item} />
      ))}
    </div>
  </div>
);
