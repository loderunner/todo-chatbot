import { useCallback, useState } from 'react';

export type Props = {
  onSendMessage:
    | ((message: string) => void)
    | ((message: string) => Promise<void>);
};

export default function Chatbot({ onSendMessage }: Props) {
  const [message, setMessage] = useState('');
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
      <input
        className="px-6 py-2 border-2 rounded-full flex-auto"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setMessage(e.currentTarget.value);
          }
        }}
      ></input>
      <button onClick={onClick} disabled={!enabled}>
        Send
      </button>
    </div>
  );
}
