'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@repo/elements/conversation';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@repo/elements/message';
import { Response } from '@repo/elements/response';
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputButton,
} from '@repo/elements/prompt-input';
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from '@repo/elements/tool';
import {
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from '@repo/elements/sources';
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from '@repo/elements/reasoning';
import { CodeBlock } from '@repo/elements/code-block';
import { Loader } from '@repo/elements/loader';
import { Suggestions, Suggestion } from '@repo/elements/suggestion';
import { Actions, Action } from '@repo/elements/actions';
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
} from '@repo/elements/chain-of-thought';
import { Shimmer } from '@repo/elements/shimmer';
import { GlobeIcon, SparklesIcon, DatabaseIcon } from 'lucide-react';
import { toast } from 'sonner';

// Available AI models
const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'o1-preview', name: 'o1 Preview' },
  { id: 'o1-mini', name: 'o1 Mini' },
  { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet' },
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
];

// Contextual suggestions based on Cloudflare data
const suggestions = [
  'Show me recent calls with negative sentiment',
  'Find merchants who mentioned pricing in the last week',
  'Get statistics from the dashboard',
  'Search for calls about contract renewals',
  'Show me the timeline for a specific merchant',
  'Which merchants have the highest lead scores?',
  'Find all calls with recordings available',
  'What are the main concerns from recent conversations?',
];

export default function CloudflareChatPage() {
  const [model, setModel] = useState<string>(models[0].id);
  const [useSemanticSearch, setUseSemanticSearch] = useState<boolean>(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/chat',
      body: {
        model,
      },
      maxSteps: 5,
      onError: (error) => {
        console.error('Chat error:', error);
        toast.error('Failed to send message', {
          description: error.message,
        });
      },
    });

  const handleSuggestionClick = (suggestion: string) => {
    // Programmatically submit the suggestion
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;

    handleInputChange({
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLTextAreaElement>);

    // Submit after a brief delay to ensure state update
    setTimeout(() => {
      handleSubmit(syntheticEvent);
    }, 50);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cloudflare Data Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Query your OpenPhone and Notion data with AI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DatabaseIcon className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Connected to Cloudflare
            </span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex min-h-0 flex-1 flex-col">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <SparklesIcon className="mb-4 size-12 text-muted-foreground" />
                <h2 className="mb-2 text-xl font-semibold">
                  Welcome to Cloudflare Data Assistant
                </h2>
                <p className="mb-6 max-w-md text-muted-foreground">
                  Ask questions about your merchants, calls, messages, and more.
                  I can search semantically, analyze sentiment, and provide
                  insights from your data.
                </p>
                <div className="text-sm text-muted-foreground">
                  Try one of the suggestions below to get started
                </div>
              </div>
            ) : (
              // Messages
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {/* Reasoning Display */}
                    {message.experimental_providerMetadata?.reasoning && (
                      <Reasoning
                        duration={
                          message.experimental_providerMetadata
                            .reasoningDuration || 0
                        }
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>
                          {message.experimental_providerMetadata.reasoning}
                        </ReasoningContent>
                      </Reasoning>
                    )}

                    {/* Tool Invocations */}
                    {message.toolInvocations?.map((tool) => (
                      <Tool key={tool.toolCallId}>
                        <ToolHeader>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{tool.toolName}</span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                tool.state === 'result'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : tool.state === 'error'
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}
                            >
                              {tool.state}
                            </span>
                          </div>
                        </ToolHeader>
                        <ToolContent>
                          <div className="space-y-2">
                            <div>
                              <div className="mb-1 text-xs font-semibold text-muted-foreground">
                                Input
                              </div>
                              <CodeBlock language="json">
                                {JSON.stringify(tool.args, null, 2)}
                              </CodeBlock>
                            </div>
                            {tool.result && (
                              <div>
                                <div className="mb-1 text-xs font-semibold text-muted-foreground">
                                  Output
                                </div>
                                <CodeBlock language="json">
                                  {JSON.stringify(tool.result, null, 2)}
                                </CodeBlock>
                              </div>
                            )}
                          </div>
                        </ToolContent>
                      </Tool>
                    ))}

                    {/* Main Response */}
                    {message.content && (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <Response>{message.content}</Response>
                      </div>
                    )}

                    {/* Sources (if metadata includes sources) */}
                    {message.experimental_providerMetadata?.sources &&
                      message.experimental_providerMetadata.sources.length >
                        0 && (
                        <Sources>
                          <SourcesTrigger
                            count={
                              message.experimental_providerMetadata.sources
                                .length
                            }
                          />
                          <SourcesContent>
                            {message.experimental_providerMetadata.sources.map(
                              (source: any) => (
                                <Source
                                  key={source.url}
                                  title={source.title}
                                  href={source.url}
                                />
                              )
                            )}
                          </SourcesContent>
                        </Sources>
                      )}

                    {/* Message Actions */}
                    {message.role === 'assistant' && (
                      <Actions>
                        <Action
                          onClick={() => {
                            navigator.clipboard.writeText(message.content);
                            toast.success('Copied to clipboard');
                          }}
                          tooltip="Copy message"
                        >
                          Copy
                        </Action>
                        <Action
                          onClick={() => {
                            handleSuggestionClick(
                              'Can you elaborate on that?'
                            );
                          }}
                          tooltip="Ask for more details"
                        >
                          Elaborate
                        </Action>
                      </Actions>
                    )}
                  </MessageContent>

                  <MessageAvatar
                    name={message.role === 'user' ? 'You' : 'Assistant'}
                    src={
                      message.role === 'user'
                        ? 'https://github.com/shadcn.png'
                        : 'https://github.com/vercel.png'
                    }
                  />
                </Message>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 px-4 py-2">
                <Loader />
                <Shimmer>Thinking...</Shimmer>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Suggestions Bar */}
        <div className="shrink-0 border-t px-4 py-3">
          <Suggestions className="pb-2">
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
        </div>

        {/* Input Area */}
        <div className="shrink-0 border-t bg-card p-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about your Cloudflare data..."
                disabled={isLoading}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputButton
                      onClick={() =>
                        setUseSemanticSearch(!useSemanticSearch)
                      }
                      variant={useSemanticSearch ? 'default' : 'ghost'}
                    >
                      <GlobeIcon size={16} />
                      <span>Semantic Search</span>
                    </PromptInputButton>
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>

                <PromptInputModelSelect onValueChange={setModel} value={model}>
                  <PromptInputModelSelectTrigger>
                    <PromptInputModelSelectValue />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {models.map((m) => (
                      <PromptInputModelSelectItem key={m.id} value={m.id}>
                        {m.name}
                      </PromptInputModelSelectItem>
                    ))}
                  </PromptInputModelSelectContent>
                </PromptInputModelSelect>
              </PromptInputTools>

              <PromptInputSubmit
                disabled={!input.trim() || isLoading}
                status={isLoading ? 'streaming' : 'ready'}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
