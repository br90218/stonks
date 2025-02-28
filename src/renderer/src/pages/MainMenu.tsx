import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageProp } from './BasicPage';
import { RetrieveRunFile } from '@renderer/services/BackendUtility';
import { RunSettings } from './RunSettings';
import { createPortal } from 'react-dom';
import { ContextualModal } from '@renderer/components/Modals/Modal';

export function MainMenu(props: PageProp): JSX.Element {
    const [runFile, setRunfile] = useState('');
    const [isStartingNewRun, setIsStartingNewRun] = useState(false);

    useEffect(() => {
        RetrieveRunFile().then((result) => {
            if (result != null) {
                setRunfile(result.name);
            }
        });
    }, []);

    return (
        <>
            <h1 className="font_mainTitle">Wall Street Betssss</h1>
            The house always wins...
            <button
                onClick={() => {
                    setIsStartingNewRun(true);
                }}
            >
                New Run
            </button>
            <div id="continue-run">A save file is detected: {runFile}</div>
            <Link to="/settings">
                <button>Settings</button>
            </Link>
            <div>
                <h1> Test menus </h1>
                <Link to="/intermission">
                    <button>Intermission Page</button>
                </Link>
                <Link to="/gameviewnew">
                    <button>new game view</button>
                </Link>
            </div>
            {isStartingNewRun &&
                createPortal(
                    <ContextualModal context={RunSettingsContext()} />,
                    document.getElementById('overlay')!
                )}
        </>
    );
}

function RunSettingsContext(): JSX.Element {
    return <RunSettings />;
}
