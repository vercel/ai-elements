'use client';

import { useChat } from 'ai/react';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  PromptInputHeader,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputActionAddAttachments,
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
import {
  Task,
  TaskTrigger,
  TaskContent,
  TaskItem,
} from '@repo/elements/task';
import {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationSource,
} from '@repo/elements/inline-citation';
import { CodeBlock } from '@repo/elements/code-block';
import { Image } from '@repo/elements/image';
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
import {
  GlobeIcon,
  SparklesIcon,
  DatabaseIcon,
  ActivityIcon,
  Upload,
  BarChart3Icon,
  DownloadIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSuggestions } from '@/lib/use-suggestions';
import { useGlobalSyncStatus } from '@/lib/use-realtime';
import { generateQueryPlan, type QueryStep } from '@/lib/query-plan';

// Available AI models
const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'o1-preview', name: 'o1 Preview' },
  { id: 'o1-mini', name: 'o1 Mini' },
  { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet' },
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
];

export default function CloudflareChatPage() {
  const [model, setModel] = useState<string>(models[0].id);
  const [useSemanticSearch, setUseSemanticSearch] = useState<boolean>(false);
  const [currentQueryPlan, setCurrentQueryPlan] = useState<QueryStep[]>([]);
  const [showVisualizations, setShowVisualizations] = useState<boolean>(true);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; url: string; type: string }>
  >([]);
  const [isUploading, setIsUploading] = useState(false);

  // Use smart suggestions hook
  const {
    suggestions,
    addQuery,
    clearHistory,
    getRecentQueries,
    getPopularQueries,
  } = useSuggestions();

  // Use real-time sync status
  const { active: syncActive, progress: syncProgress, connected: wsConnected } =
    useGlobalSyncStatus();

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } =
    useChat({
      api: '/api/chat',
      body: {
        model,
        useSemanticSearch,
        uploadedFiles,
      },
      maxSteps: 5,
      onError: (error) => {
        console.error('Chat error:', error);
        toast.error('Failed to send message', {
          description: error.message,
        });
      },
      onFinish: (message) => {
        // Track query for suggestions
        const toolsUsed = message.toolInvocations?.map((t) => t.toolName) || [];
        addQuery(input, toolsUsed, !!message.content);

        // Clear query plan
        setCurrentQueryPlan([]);
      },
    });

  // Generate query plan when user starts typing
  useEffect(() => {
    if (input.trim() && !isLoading) {
      const plan = generateQueryPlan(input);
      setCurrentQueryPlan(plan);
    }
  }, [input, isLoading]);

  // Update query plan steps as tools are executed
  useEffect(() => {
    if (isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.toolInvocations) {
        // Update plan based on tool execution
        setCurrentQueryPlan((prevPlan) =>
          prevPlan.map((step) => {
            const matchingTool = lastMessage.toolInvocations?.find((t) =>
              step.id.includes(t.toolName.toLowerCase())
            );

            if (matchingTool) {
              return {
                ...step,
                status: matchingTool.state === 'result' ? 'complete' : 'active',
              };
            }
            return step;
          })
        );
      }
    }
  }, [isLoading, messages]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>;

      handleInputChange({
        target: { value: suggestion },
      } as React.ChangeEvent<HTMLTextAreaElement>);

      setTimeout(() => {
        handleSubmit(syntheticEvent);
      }, 50);
    },
    [handleInputChange, handleSubmit]
  );

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        return response.json();
      });

      const results = await Promise.all(uploadPromises);

      setUploadedFiles((prev) => [
        ...prev,
        ...results.map((r) => ({
          name: r.filename,
          url: r.url,
          type: r.type,
        })),
      ]);

      toast.success(`Uploaded ${files.length} file(s) to R2`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Generate visualization for merchant data
  const generateVisualization = useCallback(
    async (type: string, data: any) => {
      try {
        const response = await fetch('/api/visualize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, data }),
        });

        if (!response.ok) throw new Error('Visualization failed');

        const result = await response.json();
        return result.imageData;
      } catch (error) {
        console.error('Visualization error:', error);
        toast.error('Failed to generate visualization');
        return null;
      }
    },
    []
  );

  // Refresh merchant data
  const handleRefreshData = useCallback(
    async (canvasId: string) => {
      toast.info('Refreshing merchant data...');

      await append({
        role: 'user',
        content: `Refresh data for Canvas ID: ${canvasId}`,
      });
    },
    [append]
  );

  // Export data to JSON
  const handleExportData = useCallback((data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported');
  }, []);

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
          <div className="flex items-center gap-4">
            {/* Real-time sync indicator */}
            <div className="flex items-center gap-2">
              <ActivityIcon
                className={`size-4 ${wsConnected ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`}
              />
              <span className="text-sm text-muted-foreground">
                {wsConnected ? 'Live' : 'Offline'}
              </span>
            </div>

            {syncActive && (
              <div className="flex items-center gap-2">
                <Loader />
                <span className="text-sm text-muted-foreground">
                  Syncing... {syncProgress}%
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <DatabaseIcon className="size-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Connected to Cloudflare
              </span>
            </div>
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
                  I can search semantically, analyze sentiment, generate
                  visualizations, and provide real-time insights.
                </p>
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={() => setShowVisualizations(!showVisualizations)}
                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                  >
                    <BarChart3Icon className="mr-1 inline size-4" />
                    {showVisualizations ? 'Hide' : 'Show'} Visualizations
                  </button>
                  <button
                    onClick={() => {
                      const recent = getRecentQueries(5);
                      if (recent.length > 0) {
                        toast.info(
                          `Recent queries: ${recent.map((q) => q.query).join(', ')}`
                        );
                      }
                    }}
                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                  >
                    View History
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Try one of the suggestions below to get started
                </div>
              </div>
            ) : (
              // Messages
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {/* Query Plan (Chain of Thought) */}
                    {message.role === 'assistant' &&
                      currentQueryPlan.length > 0 &&
                      isLoading && (
                        <ChainOfThought defaultOpen={true}>
                          <ChainOfThoughtHeader>
                            Query Execution Plan
                          </ChainOfThoughtHeader>
                          <ChainOfThoughtContent>
                            {currentQueryPlan.map((step) => (
                              <ChainOfThoughtStep
                                key={step.id}
                                status={step.status}
                              >
                                {step.description}
                              </ChainOfThoughtStep>
                            ))}
                          </ChainOfThoughtContent>
                        </ChainOfThought>
                      )}

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

                    {/* Tool Invocations with Task Tracking */}
                    {message.toolInvocations &&
                      message.toolInvocations.length > 0 && (
                        <Task defaultOpen={true}>
                          <TaskTrigger>
                            Executing {message.toolInvocations.length} operations
                          </TaskTrigger>
                          <TaskContent>
                            {message.toolInvocations.map((tool) => (
                              <div key={tool.toolCallId} className="mb-4">
                                <TaskItem
                                  status={
                                    tool.state === 'result'
                                      ? 'completed'
                                      : tool.state === 'error'
                                        ? 'error'
                                        : tool.state === 'pending'
                                          ? 'pending'
                                          : 'in-progress'
                                  }
                                >
                                  <Tool>
                                    <ToolHeader>
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                          {tool.toolName}
                                        </span>
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
                                              {JSON.stringify(
                                                tool.result,
                                                null,
                                                2
                                              )}
                                            </CodeBlock>

                                            {/* Data visualizations for merchant data */}
                                            {showVisualizations &&
                                              tool.toolName ===
                                                'getMerchantByCanvas' &&
                                              tool.result.stats && (
                                                <div className="mt-4">
                                                  <div className="mb-2 text-xs font-semibold text-muted-foreground">
                                                    Merchant Summary
                                                  </div>
                                                  <Image
                                                    alt="Merchant summary visualization"
                                                    src={`data:image/svg+xml;base64,${Buffer.from(
                                                      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200"><rect width="600" height="200" fill="#f9fafb"/><text x="20" y="40" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1f2937">Quick Stats</text><text x="20" y="80" font-family="sans-serif" font-size="12" fill="#6b7280">Total Interactions: ${tool.result.stats.totalInteractions}</text><text x="20" y="110" font-family="sans-serif" font-size="12" fill="#6b7280">Calls: ${tool.result.stats.totalCalls} | Messages: ${tool.result.stats.totalMessages} | Mail: ${tool.result.stats.totalMail}</text><text x="20" y="140" font-family="sans-serif" font-size="12" fill="#6b7280">Last Interaction: ${new Date(tool.result.stats.lastInteraction).toLocaleDateString()}</text></svg>`
                                                    ).toString('base64')}`}
                                                  />
                                                </div>
                                              )}
                                          </div>
                                        )}
                                      </div>
                                    </ToolContent>
                                  </Tool>
                                </TaskItem>
                              </div>
                            ))}
                          </TaskContent>
                        </Task>
                      )}

                    {/* Main Response with Inline Citations */}
                    {message.content && (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <Response>
                          {message.content
                            .split(/(\[\d+\])/)
                            .map((part, index) => {
                              // Check if this is a citation marker [1], [2], etc.
                              const citationMatch = part.match(/\[(\d+)\]/);
                              if (citationMatch) {
                                const citationIndex =
                                  parseInt(citationMatch[1]) - 1;
                                const sources =
                                  message.experimental_providerMetadata
                                    ?.sources || [];

                                if (sources[citationIndex]) {
                                  return (
                                    <InlineCitation key={index}>
                                      <InlineCitationCardTrigger>
                                        <InlineCitationText>
                                          {part}
                                        </InlineCitationText>
                                      </InlineCitationCardTrigger>
                                      <InlineCitationCard>
                                        <InlineCitationCardBody>
                                          <InlineCitationSource
                                            title={sources[citationIndex].title}
                                            href={sources[citationIndex].url}
                                          />
                                        </InlineCitationCardBody>
                                      </InlineCitationCard>
                                    </InlineCitation>
                                  );
                                }
                              }
                              return <span key={index}>{part}</span>;
                            })}
                        </Response>
                      </div>
                    )}

                    {/* Sources */}
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
                            handleSuggestionClick('Can you elaborate on that?');
                          }}
                          tooltip="Ask for more details"
                        >
                          Elaborate
                        </Action>
                        {message.toolInvocations?.some(
                          (t) => t.toolName === 'getMerchantByCanvas'
                        ) && (
                          <>
                            <Action
                              onClick={() => {
                                const canvasTool = message.toolInvocations?.find(
                                  (t) => t.toolName === 'getMerchantByCanvas'
                                );
                                if (canvasTool) {
                                  handleRefreshData(canvasTool.args.canvasId);
                                }
                              }}
                              tooltip="Refresh merchant data"
                            >
                              <RefreshCwIcon className="size-4" />
                            </Action>
                            <Action
                              onClick={() => {
                                const canvasTool = message.toolInvocations?.find(
                                  (t) => t.toolName === 'getMerchantByCanvas'
                                );
                                if (canvasTool && canvasTool.result) {
                                  handleExportData(
                                    canvasTool.result,
                                    `merchant-${canvasTool.args.canvasId}.json`
                                  );
                                }
                              }}
                              tooltip="Export data"
                            >
                              <DownloadIcon className="size-4" />
                            </Action>
                          </>
                        )}
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
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Suggested Queries
            </span>
            {getRecentQueries().length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear History
              </button>
            )}
          </div>
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
            {uploadedFiles.length > 0 && (
              <PromptInputHeader>
                <PromptInputAttachments>
                  {uploadedFiles.map((file, index) => (
                    <PromptInputAttachment
                      key={index}
                      data={{
                        name: file.name,
                        type: file.type,
                        url: file.url,
                      }}
                    />
                  ))}
                </PromptInputAttachments>
              </PromptInputHeader>
            )}

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
                    <PromptInputActionAddAttachments
                      onChange={(files) => {
                        if (files) handleFileUpload(files);
                      }}
                    />
                    <PromptInputButton
                      onClick={() => setUseSemanticSearch(!useSemanticSearch)}
                      variant={useSemanticSearch ? 'default' : 'ghost'}
                    >
                      <GlobeIcon size={16} />
                      <span>Semantic Search</span>
                    </PromptInputButton>
                    <PromptInputButton
                      onClick={() =>
                        setShowVisualizations(!showVisualizations)
                      }
                      variant={showVisualizations ? 'default' : 'ghost'}
                    >
                      <BarChart3Icon size={16} />
                      <span>Visualizations</span>
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
                disabled={!input.trim() || isLoading || isUploading}
                status={isLoading ? 'streaming' : 'ready'}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
