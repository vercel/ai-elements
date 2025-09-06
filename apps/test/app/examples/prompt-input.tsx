'use client';

import { PromptForm, type PromptFormPayload } from '@repo/elements/prompt-form';
import {
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@repo/elements/prompt-input';
import {
  PromptAttachmentsPreview,
  PromptAttachmentsProvider,
  PromptInputActionAddAttachments,
  useAttachments,
} from '@repo/elements/prompt-input-attachments';
import { GlobeIcon, MicIcon } from 'lucide-react';
import { useState } from 'react';

const models = [
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'claude-2', name: 'Claude 2' },
  { id: 'claude-instant', name: 'Claude Instant' },
  { id: 'palm-2', name: 'PaLM 2' },
  { id: 'llama-2-70b', name: 'Llama 2 70B' },
  { id: 'llama-2-13b', name: 'Llama 2 13B' },
  { id: 'cohere-command', name: 'Command' },
  { id: 'mistral-7b', name: 'Mistral 7B' },
];

const Example = () => {
  const [text, setText] = useState<string>('');
  const [model, setModel] = useState<string>(models[0].id);
  const [status, setStatus] = useState<
    'submitted' | 'streaming' | 'ready' | 'error'
  >('ready');

  const { attachments } = useAttachments();
  const disabled = !(text || attachments.length > 0);

  const handleSubmit = ({ prompt }: PromptFormPayload) => {
    // Allow submission only if there is text or attachments
    if (!(prompt || attachments.length > 0)) {
      return;
    }
    setStatus('submitted');

    setTimeout(() => {
      setStatus('streaming');
    }, 200);

    setTimeout(() => {
      setStatus('ready');
    }, 2000);
  };

  return (
    <PromptForm onSubmit={handleSubmit} resetOnSubmit>
      {({ formProps }) => (
        <PromptInput {...formProps}>
          <PromptAttachmentsProvider globalDrop multiple name="attachments">
            <div className="flex flex-col">
              <PromptAttachmentsPreview />
              <PromptInputTextarea
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
            </div>
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputButton>
                  <MicIcon size={16} />
                </PromptInputButton>
                <PromptInputButton>
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <PromptInputModelSelect onValueChange={setModel} value={model}>
                  <PromptInputModelSelectTrigger>
                    <PromptInputModelSelectValue />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {models.map((modelOption) => (
                      <PromptInputModelSelectItem
                        key={modelOption.id}
                        value={modelOption.id}
                      >
                        {modelOption.name}
                      </PromptInputModelSelectItem>
                    ))}
                  </PromptInputModelSelectContent>
                </PromptInputModelSelect>
              </PromptInputTools>
              <PromptInputSubmit disabled={disabled} status={status} />
            </PromptInputToolbar>
          </PromptAttachmentsProvider>
        </PromptInput>
      )}
    </PromptForm>
  );
};

export default Example;
