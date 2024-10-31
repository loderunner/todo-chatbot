import { TodoItem, TodoList as TodoListType } from '@/app/_lib/todo-list';

type ItemProps = {
  item: TodoItem;
  onChange: (item: TodoItem) => void;
  onRemove: () => void;
};

function TodoListItem({ item, onChange, onRemove }: ItemProps) {
  return (
    <div>
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onChange({ ...item, done: !item.done })}
      />
      <input
        type="text"
        value={item.label}
        onChange={(e) => onChange({ ...item, label: e.target.value })}
      />
      <button onClick={onRemove}>Delete</button>
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
    <div>
      {list.map((item, i) => (
        <TodoListItem
          item={item}
          key={i}
          onChange={(newItem) => onChangeItem(i, newItem)}
          onRemove={() => onRemoveItem(i)}
        />
      ))}
      <button onClick={onAddItem}>Add Todo</button>
    </div>
  );
}
