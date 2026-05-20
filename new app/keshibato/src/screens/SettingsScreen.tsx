import { Button } from '../components/Button';
import { CpuLevelPicker } from '../components/CpuLevelPicker';
import { useGameStore } from '../hooks/useGameStore';
import { DEFAULT_SAVE } from '../utils/storage';

export function SettingsScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const save = useGameStore((s) => s.save);
  const setSave = useGameStore((s) => s.setSave);
  const setCpuLevel = useGameStore((s) => s.setCpuLevel);

  return (
    <div className="min-h-[100dvh] bg-boardEdge p-5 text-ink">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => setScreen('home')}>← 戻る</Button>
        <div className="font-bold">設定</div>
        <div className="w-16" />
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-board">
          <div className="font-bold mb-2">CPUレベル</div>
          <div className="text-[11px] text-ink/60 mb-2">1人CPU戦とRPGモードの両方に適用されます</div>
          <CpuLevelPicker value={save.cpuLevel ?? 'normal'} onChange={setCpuLevel} />
        </div>

        <div className="p-4 rounded-2xl bg-board">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">音量</div>
              <div className="text-xs text-ink/60">{Math.round(save.volume * 100)}%</div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(save.volume * 100)}
              onChange={(e) => setSave((s) => ({ ...s, volume: Number(e.target.value) / 100 }))}
              className="w-40 accent-accent"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-board flex justify-between items-center">
          <div>
            <div className="font-bold">バイブレーション</div>
            <div className="text-xs text-ink/60">衝突・KO時に振動</div>
          </div>
          <button
            onClick={() => setSave((s) => ({ ...s, vibration: !s.vibration }))}
            className={`px-4 py-2 rounded-xl font-bold ${save.vibration ? 'bg-accent text-boardEdge' : 'bg-ink/10 text-ink/60'}`}
          >
            {save.vibration ? 'ON' : 'OFF'}
          </button>
        </div>

        <Button variant="danger" full onClick={() => setSave(() => ({ ...DEFAULT_SAVE }))}>
          セーブをリセット
        </Button>
      </div>
    </div>
  );
}
