import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import './Game.css';


const Game = () => {
  const navigate = useNavigate();
  


  return (

    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        Aquí está el juego
    </Container>
  );


};

export default Game;


/**
 * Cada segundo (1000 ms) se disminuye en una unidad el tiempo restante. Al llegar a 0, se deshabilitan los botones y se
 * reinicia el tiempo.
 */
//useEffect(() => {
//    const id = setInterval(() => {
//        setTime(prev => {
//            if (prev > 0) {
//                return prev - 1;
//            } else {
//                setTimedOut(true);
//                const buttons = document.querySelectorAll('button[title="btnsPreg"]');
//                buttons.forEach(button => {
//                    button.disabled = true;
//                    button.onmouse = null;
//                });
//                clearInterval(id); // Clear the interval when the time runs out
//            }
//        });
//    }, 1000);
//
//    return () => clearInterval(id); // Clear the interval on component unmount
//}, [isTimerActive, isTimedOut]);