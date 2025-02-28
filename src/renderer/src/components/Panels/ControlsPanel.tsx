import styles from '@renderer/assets/css/components/panels/controlspanel.module.css';
import popups from '@renderer/assets/css/components/popups.module.css';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function ControlsPanel(): JSX.Element {
    const [popupContext, setPopupContext] = useState<string>('');
    return (
        <div className={styles.wrapper}>
            <button onClick={() => setPopupContext('options')}>Options</button>
            <button>Help</button>
            <button onClick={() => setPopupContext('quit')}>Quit</button>
            {popupContext !== '' &&
                createPortal(
                    <ModalContent context={popupContext} onClose={() => setPopupContext('')} />,
                    document.getElementById('overlay')!
                )}
        </div>
    );
}

function ModalContent(props: { context: string; onClose: () => void }): JSX.Element {
    let contextElement: JSX.Element;
    switch (props.context) {
        case 'quit':
            contextElement = <QuitCurrentGameContext />;
            break;
        case 'options':
            contextElement = <OptionsContext />;
            break;
    }

    return (
        <div className={`${popups.popup} modal`}>
            {contextElement!}
            <button onClick={props.onClose}>Click me to close</button>
        </div>
    );
}

function QuitCurrentGameContext(): JSX.Element {
    return (
        <div>
            This current quarter will be counted as complete once you quit. Do you wish to continue?
        </div>
    );
}

function OptionsContext(): JSX.Element {
    return <div>Options menu</div>;
}
