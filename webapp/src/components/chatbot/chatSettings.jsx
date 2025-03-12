import Icon from "./chat.png?react";

const settings = {
    general: {
        embedded: false,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', " +
            "'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    },
    botBubble: { simStream: true },
    tooltip: {
        mode: "CLOSE",
        text: "Estoy aquí para ayudarte! 😊",
    },
    chatButton: {
        icon: Icon,
    },
    header: {
        title: (<div style={{ cursor: "pointer", margin: 0, fontSize: 20, fontWeight: "bold" }}>Aether</div>),
        showAvatar: true,
        avatar: Icon,
    },
    audio: {
        disabled: false,
        defaultToggledOn: false,
        language: "es-ES",
        voiceNames: ["Google español (es-ES)", "Microsoft Helena - Spanish (Spain)"],
        rate: 10,
        volume: 1
    },
    chatHistory: {
        disabled: false,
        maxEntries: 30,
        storageKey: "rcb-history",
        storageType: "LOCAL_STORAGE",
        viewChatHistoryButtonText: "Load Chat History ⟳",
        chatHistoryLineBreakText: "----- Previous Chat History -----",
        autoLoad: false,
    }
};

export default settings;
