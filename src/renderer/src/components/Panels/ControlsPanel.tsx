import styles from '@renderer/assets/css/components/panels/controlspanel.module.css';
import popups from '@renderer/assets/css/components/popups.module.css';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function ControlsPanel(): JSX.Element {
    const [paused, setPaused] = useState<boolean>(false);
    return (
        <div className={styles.wrapper}>
            <button onClick={() => setPaused(true)}>Pause</button>
            <button>Help</button>
            <button>Quit</button>
            {paused &&
                createPortal(
                    <ModalContent onClose={() => setPaused(false)} />,
                    document.getElementById('overlay')!
                )}
        </div>
    );
}

function ModalContent(props: { onClose: () => void }): JSX.Element {
    return (
        <div className={`${popups.popup} modal`}>
            <div>The house always controls you...</div>
            <button onClick={props.onClose}>Click me to close</button>
        </div>
    );
}
