import { useCallback, useState } from 'react';

export type Props = {
  onSendMessage:
    | ((message: string) => void)
    | ((message: string) => Promise<void>);
};

export default function Chatbot({ onSendMessage }: Props) {
  const [message, setMessage] = useState('');

  const onClick = useCallback(async () => {
    await onSendMessage(message);
    setMessage('');
  }, [message, onSendMessage]);

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></input>
      <button onClick={onClick}>Send</button>
    </div>
  );
}
