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
    <div className="flex gap-2">
      <textarea
        className="px-6 py-2 border-2 rounded-full flex-auto resize-none disabled:text-slate-400"
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
      <button onClick={onClick} disabled={!enabled}>
        Send
      </button>
    </div>
  );
}
