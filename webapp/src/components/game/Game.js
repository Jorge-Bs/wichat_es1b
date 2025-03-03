import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import './Game.css';


const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Game = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [image, setImage] = useState('');
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState("");
  
  const getQuestion = async () => {
    try {      
      const response = await axios.get(`${apiEndpoint}/generateQuestion`, { });
      
      setQuestion(response.data.responseQuestion);
      setOptions(response.data.responseOptions);
      setCorrectOption(response.data.responseCorrectOption);
      setImage(response.data.responseImage);
      console.log(response.data.responseQuestion);
      console.log(response.data.responseOptions);
      console.log(response.data.responseCorrectOption);
      console.log(response.data.responseImage);
    } catch (error) {
      console.log("Error: " );
    }
  }


  useEffect(() => {
    getQuestion();
  }, [getQuestion]);

  const handleOptionClick = async (option) => {

    if(correctOption === option){
      console.log("Correcto");
    } else {
      console.log("Incorrecto");
    }

    setTimeout(() => {
      getQuestion();
    }, 3000);
    
    
  };


  return (

    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        Aquí está el juego
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          {question}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {image !== null && image !== "" && <img src={image} alt="Imagen de la pregunta" width="40%" height="auto"/>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
          {options.map((option, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </Button>
          ))}
          </div>
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