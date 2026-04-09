import { AppProvider } from './store/AppContext';
import { AppRouter } from './app/Router';

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
