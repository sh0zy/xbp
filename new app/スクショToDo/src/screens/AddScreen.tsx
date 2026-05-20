import type { LaterItem } from "../types";
import { Header } from "../components/Header";
import { ItemEditor } from "../components/ItemEditor";

type Props = {
  initial?: Partial<LaterItem>;
  onCancel: () => void;
  onSave: (data: Omit<LaterItem, "id" | "createdAt" | "updatedAt">) => void;
  onDelete?: () => void;
  editing?: boolean;
};

export function AddScreen({ initial, onCancel, onSave, onDelete, editing }: Props) {
  return (
    <div className="px-5 pb-32">
      <Header
        subtitle={editing ? "Edit" : "Capture"}
        title={editing ? "情報を編集" : "情報を追加"}
      />
      <ItemEditor initial={initial} onCancel={onCancel} onSave={onSave} onDelete={onDelete} />
    </div>
  );
}
