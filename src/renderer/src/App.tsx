import { Routes, Route, HashRouter } from 'react-router-dom';
import { MainMenu } from './pages/MainMenu';
import { Settings } from './pages/Settings';
import { RunSettings } from './pages/RunSettings';
import { GameViewOld } from './pages/GameViewOld';
import { Loading } from './pages/Loading';
import Intermission from './pages/Intermission';
import GameView from './pages/GameViewNew';

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
                    <Route path="/gameview" element={<GameViewOld />} />
                    <Route path="/intermission" element={<Intermission />} />
                    <Route path="/gameviewnew" element={<GameView />} />
                </Routes>
            </HashRouter>
        </div>
    );
}

export default App;
