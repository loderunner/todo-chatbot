import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

import { TodoItem, TodoList as TodoListType } from '@/_store/todo';

type ItemProps = {
  item: TodoItem;
  onChange: (item: TodoItem) => void;
  onRemove: () => void;
};

function TodoListItem({ item, onChange, onRemove }: ItemProps) {
  return (
    <div className="flex gap-1">
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onChange({ ...item, done: !item.done })}
      />
      <input
        className="flex-auto"
        type="text"
        value={item.label}
        onChange={(e) => onChange({ ...item, label: e.target.value })}
      />
      <button className="rounded-full p-1" onClick={onRemove}>
        <XMarkIcon className="size-5" />
      </button>
    </div>
  );
}

export type Props = {
  list: TodoListType;
  onChangeItem: (i: number, item: TodoItem) => void;
  onAddItem: () => void;
  onRemoveItem: (i: number) => void;
};

export default function TodoList({
  list,
  onChangeItem,
  onAddItem,
  onRemoveItem,
}: Props) {
  return (
    <div className="flex flex-col gap-2 p-2">
      {list.map((item, i) => (
        <TodoListItem
          item={item}
          key={i}
          onChange={(newItem) => onChangeItem(i, newItem)}
          onRemove={() => onRemoveItem(i)}
        />
      ))}
      <button className="self-center rounded-full p-2" onClick={onAddItem}>
        <PlusIcon className="size-6" />
      </button>
    </div>
  );
}
