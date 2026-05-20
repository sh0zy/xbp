import { ChevronRight, Sparkles, Swords } from "lucide-react";
import { useEffect, useState } from "react";
import BattleScreen from "./components/BattleScreen";
import BottomNav from "./components/BottomNav";
import EquipmentScreen from "./components/EquipmentScreen";
import HomeScreen from "./components/HomeScreen";
import LevelSelectScreen from "./components/LevelSelectScreen";
import SettingsScreen from "./components/SettingsScreen";
import StageMap from "./components/StageMap";
import StatsScreen from "./components/StatsScreen";
import TutorialScreen from "./components/TutorialScreen";
import type { EnglishLevel, PlayerData, ScreenId } from "./types";
import { loadPlayerData, resetPlayerData, savePlayerData } from "./utils/storage";

function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="safe-screen flex min-h-screen flex-col justify-between">
      <section className="pt-8">
        <div className="rpg-window mb-6 grid h-24 w-24 place-items-center p-3 text-[#fff6d0]">
          <Swords className="text-amber" size={45} />
        </div>
        <p className="rpg-nameplate">Speaking RPG</p>
        <h1 className="rpg-title mt-5 text-5xl font-black leading-[0.95]">English Quest RPG</h1>
        <div className="rpg-dialogue mt-6 p-4">
          <p className="rpg-log-line text-base leading-7 text-white">
            Answer in English. Your words become attacks. Choose A1 to C1 and clear 50 stages at your pace.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rpg-window p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded bg-amber text-ink">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="font-black text-white">A1-C1 / 50 Stages / Voice Input / AI Optional</h2>
              <p className="mt-1 text-sm leading-5 text-skyglass/80">API key is optional. Rule scoring works offline.</p>
            </div>
          </div>
        </div>
        <button type="button" onClick={onStart} className="rpg-command rpg-command-primary flex min-h-16 w-full items-center justify-center gap-2 px-4 text-lg font-black">
          <span className="rpg-menu-cursor">Begin Quest</span>
          <ChevronRight size={22} />
        </button>
      </section>
    </main>
  );
}

export default function App() {
  const [player, setPlayer] = useState<PlayerData>(() => loadPlayerData());
  const [screen, setScreen] = useState<ScreenId>(() => (player.settings.levelSelected ? "title" : "levelSelect"));
  const [battleStageId, setBattleStageId] = useState(player.currentStage);

  useEffect(() => {
    savePlayerData(player);
  }, [player]);

  const navigate = (next: ScreenId) => {
    setScreen(next);
  };

  const startStage = (stageId: number) => {
    setBattleStageId(stageId);
    setScreen("battle");
  };

  const completeTutorial = () => {
    setPlayer((current) => ({
      ...current,
      settings: {
        ...current.settings,
        tutorialCompleted: true,
      },
    }));
    setScreen("home");
  };

  const selectEnglishLevel = (englishLevel: EnglishLevel) => {
    const isChangingLevel = player.settings.levelSelected && englishLevel !== player.englishLevel;
    if (
      isChangingLevel &&
      !window.confirm("難易度を変更しますか？\n敵の強さ、必要語数、英語評価基準が変わります。\n進行状況は残ります。")
    ) {
      return;
    }

    const wasLevelSelected = player.settings.levelSelected;
    setPlayer((current) => ({
      ...current,
      englishLevel,
      settings: {
        ...current.settings,
        levelSelected: true,
      },
    }));
    if (wasLevelSelected) {
      setScreen("settings");
      return;
    }
    setScreen(player.settings.tutorialCompleted ? "home" : "tutorial");
  };

  const resetAdventure = () => {
    if (!window.confirm("Reset your adventure progress?")) {
      return;
    }
    const fresh = resetPlayerData();
    setPlayer(fresh);
    setBattleStageId(1);
    setScreen("title");
  };

  const renderScreen = () => {
    if (screen === "title") {
      return <TitleScreen onStart={() => setScreen(player.settings.tutorialCompleted ? "home" : "tutorial")} />;
    }
    if (screen === "levelSelect") {
      return (
        <LevelSelectScreen
          currentLevel={player.englishLevel}
          onSelect={selectEnglishLevel}
          onCancel={player.settings.levelSelected ? () => setScreen("settings") : undefined}
        />
      );
    }
    if (screen === "tutorial") {
      return <TutorialScreen onComplete={completeTutorial} />;
    }
    if (screen === "home") {
      return <HomeScreen player={player} onStart={startStage} onOpenTutorial={() => setScreen("tutorial")} />;
    }
    if (screen === "map") {
      return <StageMap player={player} onSelect={startStage} />;
    }
    if (screen === "equipment") {
      return <EquipmentScreen player={player} onChange={setPlayer} />;
    }
    if (screen === "stats") {
      return <StatsScreen player={player} />;
    }
    if (screen === "settings") {
      return <SettingsScreen player={player} onChange={setPlayer} onReset={resetAdventure} onOpenLevelSelect={() => setScreen("levelSelect")} />;
    }
    return <BattleScreen stageId={battleStageId} player={player} onPlayerChange={setPlayer} onExit={() => setScreen("map")} />;
  };

  const showBottomNav = !["title", "tutorial", "battle", "levelSelect"].includes(screen);

  return (
    <div className="app-shell">
      <div className="phone-frame">
        {renderScreen()}
        {showBottomNav ? <BottomNav current={screen} onNavigate={navigate} /> : null}
      </div>
    </div>
  );
}
