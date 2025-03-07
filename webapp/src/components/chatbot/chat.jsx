/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import ChatBot from "react-chatbotify";
import settings from "./chatSettings"

export default function Chat() {

    const themes = [
        {id: "robotic", version: "0.1.0"}
    ]

    const [message, setMessage] = useState("Bienvenido soy Aether te ofrecere pistas para llegar a descurbir que es la imagen 🥳!");

    const flow = {
        start: {
            message: message,  // El mensaje inicial
            path: "end_loop"
        },
        end_loop: {
            message: async () => {},
            path: "end_loop"
        }
    };
    return (
        <ChatBot  settings={settings} flow={flow}/>
    );
}
