import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageProp } from './BasicPage';
import { RetrieveRunFile } from '@renderer/services/BackendUtility';

export function MainMenu(props: PageProp): JSX.Element {
    const [rf, setrf] = useState('');

    useEffect(() => {
        RetrieveRunFile().then((result) => {
            if (result != null) {
                setrf(result.name);
            }
        });
    }, []);

    return (
        <>
            <h1>Wall Street Betssss</h1>
            The house always wins...
            <Link to="/runsettings">
                <button>New Run</button>
            </Link>
            <div id="continue-run">A save file is detected: {rf}</div>
            <Link to="/settings">
                <button>Settings</button>
            </Link>
            <div>
                <h1> Test menus </h1>
                <Link to="/intermission">
                    <button>Intermission Page</button>
                </Link>
            </div>
        </>
    );
}
