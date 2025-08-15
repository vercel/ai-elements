import Actions from '@/app/examples/actions';
import Branch from '@/app/examples/branch';
import CodeBlock from '@/app/examples/code-block';
import Conversation from '@/app/examples/conversation';
import Image from '@/app/examples/image';
import InlineCitation from '@/app/examples/inline-citation';
import Loader from '@/app/examples/loader';
import Message from '@/app/examples/message';
import PromptInput from '@/app/examples/prompt-input';
import Reasoning from '@/app/examples/reasoning';
import Response from '@/app/examples/response';
import Sources from '@/app/examples/sources';
import Suggestion from '@/app/examples/suggestion';
import Task from '@/app/examples/task';
import Tool from '@/app/examples/tool';
import V0Clone from '@/app/examples/v0-clone';
import WebPreview from '@/app/examples/web-preview';

const Home = () => (
  <div className="container mx-auto space-y-8">
    <Actions />
    <Branch />
    <CodeBlock />
    <Conversation />
    <Image />
    <InlineCitation />
    <Loader />
    <Message />
    <PromptInput />
    <Reasoning />
    <Response />
    <Sources />
    <Suggestion />
    <Task />
    <Tool />
    <V0Clone />
    <WebPreview />
  </div>
);

export default Home;
