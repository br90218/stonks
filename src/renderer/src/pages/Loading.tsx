import { useNavigate } from 'react-router-dom';
import { PageProp } from './BasicPage';
import { useEffect, useState } from 'react';

export function Loading(props: PageProp): JSX.Element {
    const [backendConnectionStatus, setBackendConnectionStatus] = useState(
        window.api.getConnectionStatus()
    );
    window.api.onConnectionStatusChanged((value) => setBackendConnectionStatus(value));
    const navigate = useNavigate();
    useEffect(() => {
        if (backendConnectionStatus == 'connected') {
            if (props.nextPath) navigate(props.nextPath);
        }
    });
    return (
        <>
            <h1>Loading...</h1>
        </>
    );
}
