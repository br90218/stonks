import { Link } from 'react-router-dom';

export function Settings(): JSX.Element {
    return (
        <>
            <h1>Settings</h1>
            <Link to="/mainmenu">
                <button>Back</button>
            </Link>
        </>
    );
}
