'use client';

import { PromptForm, type PromptFormPayload } from '@repo/elements/prompt-form';
import {
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
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
  usePromptAttachmentsInfo,
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

  const { hasAttachments } = usePromptAttachmentsInfo();
  const disabled = !(text || hasAttachments);

  const handleSubmit = async (_payload: PromptFormPayload) => {
    setStatus('submitted');
    setText('');
    await new Promise((r) => setTimeout(r, 200));
    setStatus('streaming');
    await new Promise((r) => setTimeout(r, 1800));
    setStatus('ready');
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
                    {models.map((model) => (
                      <PromptInputModelSelectItem
                        key={model.id}
                        value={model.id}
                      >
                        {model.name}
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
