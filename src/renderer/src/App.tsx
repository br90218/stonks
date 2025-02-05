import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { MainMenu } from './pages/MainMenu';
import { Settings } from './pages/Settings';
import { RunSettings } from './pages/RunSettings';
import { GameView } from './pages/GameView';


function App(): JSX.Element {

  return(
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />}/>
        <Route path="/settings" element={<Settings />}/>
        <Route path="/runsettings" element={<RunSettings />}/>
        <Route path="/gameview" element={<GameView />}/>
      </Routes>
    </Router>
  )
}

export default App