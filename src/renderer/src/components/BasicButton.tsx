interface BasicButtonMessage {
    text: string;
}

function BasicButton(props: BasicButtonMessage) {
    return <button> {props.text} </button>;
}

export default BasicButton;
