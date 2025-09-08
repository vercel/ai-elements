import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/shadcn-ui/components/ui/card";
import Actions from "@/app/examples/actions";
import Branch from "@/app/examples/branch";
import CodeBlock from "@/app/examples/code-block";
import Context from "@/app/examples/context";
import Conversation from "@/app/examples/conversation";
import Image from "@/app/examples/image";
import InlineCitation from "@/app/examples/inline-citation";
import Loader from "@/app/examples/loader";
import Message from "@/app/examples/message";
import OpenInChat from "@/app/examples/open-in-chat";
import PromptInput from "@/app/examples/prompt-input";
import Reasoning from "@/app/examples/reasoning";
import Response from "@/app/examples/response";
import Sources from "@/app/examples/sources";
import Suggestion from "@/app/examples/suggestion";
import Task from "@/app/examples/task";
import Tool from "@/app/examples/tool";
import WebPreview from "@/app/examples/web-preview";

const components = [
  { name: "Actions", Component: Actions },
  { name: "Branch", Component: Branch },
  { name: "CodeBlock", Component: CodeBlock },
  { name: "Context", Component: Context },
  { name: "Conversation", Component: Conversation },
  { name: "Image", Component: Image },
  { name: "InlineCitation", Component: InlineCitation },
  { name: "Loader", Component: Loader },
  { name: "Message", Component: Message },
  { name: "OpenInChat", Component: OpenInChat },
  { name: "PromptInput", Component: PromptInput },
  { name: "Reasoning", Component: Reasoning },
  { name: "Response", Component: Response },
  { name: "Sources", Component: Sources },
  { name: "Suggestion", Component: Suggestion },
  { name: "Task", Component: Task },
  { name: "Tool", Component: Tool },
  { name: "WebPreview", Component: WebPreview },
] as const;

const Home = () => (
  <div className="container mx-auto space-y-8 py-16">
    {components.map(({ name, Component }) => (
      <Card key={name}>
        <CardHeader>
          <CardTitle>
            <h2 className="font-semibold text-lg">{name}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Component />
        </CardContent>
      </Card>
    ))}
  </div>
);

export default Home;
