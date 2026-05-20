import { Check, Lock, Shield, Sparkles, Sword } from "lucide-react";
import clsx from "clsx";
import { equipmentItems, getEquipmentBonus } from "../data/equipment";
import type { EquipmentItem, EquipmentType, PlayerData } from "../types";

const labels: Record<EquipmentType, string> = {
  weapon: "Weapons",
  armor: "Armor",
  accessory: "Accessories",
};

const iconForType = (type: EquipmentType) => {
  if (type === "weapon") return Sword;
  if (type === "armor") return Shield;
  return Sparkles;
};

export default function EquipmentScreen({
  player,
  onChange,
}: {
  player: PlayerData;
  onChange: (player: PlayerData) => void;
}) {
  const owned = new Set(player.equipment.owned);
  const bonus = getEquipmentBonus(player.equipment.owned, [
    player.equipment.weapon,
    player.equipment.armor,
    player.equipment.accessory,
  ]);

  const equip = (item: EquipmentItem) => {
    if (!owned.has(item.id)) {
      return;
    }
    onChange({
      ...player,
      equipment: {
        ...player.equipment,
        [item.type]: item.id,
      },
    });
  };

  return (
    <main className="safe-screen space-y-5">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Equipment</p>
        <h1 className="mt-1 text-2xl font-black text-white">Words Need Gear</h1>
        <p className="mt-2 text-sm leading-6 text-skyglass/75">勝利報酬で装備が解放され、攻撃・HP・採点ボーナスが上がります。</p>
      </header>

      <section className="glass-panel grid grid-cols-5 gap-2 rounded-[20px] p-3 text-center">
        {[
          ["ATK", bonus.attack],
          ["HP", bonus.maxHp],
          ["Score", bonus.scoreBonus],
          ["Word", bonus.wordBonus],
          ["Combo", bonus.comboBonus],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white/7 p-2">
            <p className="text-[10px] text-skyglass/65">{label}</p>
            <p className="font-black text-white">+{value}</p>
          </div>
        ))}
      </section>

      {(Object.keys(labels) as EquipmentType[]).map((type) => {
        const Icon = iconForType(type);
        const equippedId = player.equipment[type];
        return (
          <section key={type} className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-black text-white">
              <Icon className="text-mint" size={20} />
              {labels[type]}
            </h2>
            {equipmentItems
              .filter((item) => item.type === type)
              .map((item) => {
                const itemOwned = owned.has(item.id);
                const equipped = equippedId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={!itemOwned}
                    onClick={() => equip(item)}
                    className={clsx(
                      "w-full rounded-2xl border p-4 text-left transition",
                      itemOwned ? "border-white/12 bg-white/8" : "border-white/7 bg-white/[0.035] opacity-55",
                      equipped ? "ring-1 ring-mint" : "",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={clsx("flex h-11 w-11 items-center justify-center rounded-2xl", equipped ? "bg-mint text-ink" : "bg-white/8 text-white")}>
                        {itemOwned ? equipped ? <Check size={20} /> : <Icon size={20} /> : <Lock size={19} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate font-black text-white">{item.name}</h3>
                          <span className="shrink-0 text-xs font-bold text-amber">Stage {item.unlockStage}</span>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-skyglass/75">{item.description}</p>
                        <p className="mt-2 text-xs font-bold text-mint">
                          ATK +{item.attack} / HP +{item.maxHp} / Score +{item.scoreBonus} / Word +{item.wordBonus} / Combo +{item.comboBonus}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
          </section>
        );
      })}
    </main>
  );
}
