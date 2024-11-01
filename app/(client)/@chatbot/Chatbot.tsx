import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { useCallback, useMemo, useState } from 'react';

export type Props = {
  onSendMessage:
    | ((message: string) => void)
    | ((message: string) => Promise<void>);
};

export default function Chatbot({ onSendMessage }: Props) {
  const [message, setMessage] = useState('');
  const rows = useMemo(
    () => [...message.matchAll(/\n/g)].length + 1,
    [message],
  );
  const [enabled, setEnabled] = useState(true);

  const onClick = useCallback(async () => {
    if (!enabled) {
      return;
    }

    try {
      setEnabled(false);
      await onSendMessage(message);
      setMessage('');
    } finally {
      setEnabled(true);
    }
  }, [enabled, message, onSendMessage]);

  return (
    <div className="flex items-center gap-2">
      <textarea
        className="min-h-11 flex-auto resize-none rounded-3xl border-2 px-6 py-2 disabled:text-slate-400"
        rows={rows}
        value={message}
        disabled={!enabled}
        onChange={(e) => setMessage(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            onClick();
          }
        }}
      ></textarea>
      <button
        className="aspect-square rounded-full p-2"
        onClick={onClick}
        disabled={!enabled}
      >
        {' '}
        <ChatBubbleLeftIcon className="size-6" />
      </button>
    </div>
  );
}
