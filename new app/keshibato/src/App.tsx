import { useEffect } from 'react';
import { useGameStore } from './hooks/useGameStore';
import { HomeScreen } from './screens/HomeScreen';
import { StageSelectScreen } from './screens/StageSelectScreen';
import { EquipSelectScreen } from './screens/EquipSelectScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { ChallengeScreen } from './screens/ChallengeScreen';
import { CollectionScreen } from './screens/CollectionScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { RpgHomeScreen } from './screens/RpgHomeScreen';
import { RpgBattleScreen } from './screens/RpgBattleScreen';
import { RpgResultScreen } from './screens/RpgResultScreen';

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const match = useGameStore((s) => s.match);
  const startMatch = useGameStore((s) => s.startMatch);

  // ステージへ進む前に match が未初期化なら補完
  useEffect(() => {
    if (!match && (screen === 'stageSelect' || screen === 'equipSelect' || screen === 'game' || screen === 'practice')) {
      startMatch({});
    }
  }, [screen, match, startMatch]);

  switch (screen) {
    case 'home':
      return <HomeScreen />;
    case 'stageSelect':
      return <StageSelectScreen />;
    case 'equipSelect':
      return <EquipSelectScreen />;
    case 'game':
      return <GameScreen />;
    case 'result':
      return <ResultScreen />;
    case 'practice':
      return <PracticeScreen />;
    case 'challenge':
      return <ChallengeScreen />;
    case 'collection':
      return <CollectionScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'rpgHome':
      return <RpgHomeScreen />;
    case 'rpgBattle':
      return <RpgBattleScreen />;
    case 'rpgResult':
      return <RpgResultScreen />;
    default:
      return <HomeScreen />;
  }
}
