import { Routes, Route, HashRouter } from 'react-router-dom';
import { MainMenu } from './pages/MainMenu';
import { Settings } from './pages/Settings';
import { RunSettings } from './pages/RunSettings';
import { GameView } from './pages/GameView';
import { Loading } from './pages/Loading';
import Intermission from './pages/Intermission';

function App(): JSX.Element {
    return (
        <div className="mainWrapper">
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Loading nextPath="/mainmenu" />} />
                    <Route path="/loading" element={<Loading />} />
                    <Route path="/mainmenu" element={<MainMenu />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/runsettings" element={<RunSettings />} />
                    <Route path="/gameview" element={<GameView />} />
                    <Route path="/intermission" element={<Intermission />} />
                </Routes>
            </HashRouter>
        </div>
    );
}

export default App;
