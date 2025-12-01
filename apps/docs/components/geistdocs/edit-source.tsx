import { SiGithub } from "@icons-pack/react-simple-icons";

type EditSourceProps = {
  url: string | undefined;
};

export const EditSource = ({ url }: EditSourceProps) =>
  url ? (
    <a
      className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <SiGithub className="size-3.5" />
      <span>Edit this page on GitHub</span>
    </a>
  ) : null;
