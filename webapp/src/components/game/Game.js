import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Button, AppBar, Toolbar, Paper} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import './Game.css';

import './../chatbot/chat.jsx';
import Chat from "../chatbot/chat";


const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Game = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [image, setImage] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionCounter, setQuestionCounter] = useState(0);
  const [isFinished, setFinished] = useState(false);

  // Estados para manejar la respuesta seleccionada y su corrección
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  // Estado para manejar contador de preguntas respondidas correctamente
  const [score, setScore] = useState(0);

  //Configuración de las partidas
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [questionsToAnswer, setQuestionsToAnswer] = useState(5);

  
  const getQuestion = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/generateQuestion`, { // una vez funcione 
        // params: {
        //   category: "Geografia",
        // }
      });
      
      setQuestion(response.data.responseQuestion);
      setOptions(response.data.responseAnswerOptions);
      setCorrectAnswer(response.data.responseCorrectAnswer);
      setImage(response.data.responseQuestionImage);
      console.log(response.data.responseQuestion);
      console.log(response.data.responseAnswerOptions);
      console.log(response.data.responseCorrectAnswer);
      console.log(response.data.responseQuestionImage);

      // Restablecer la respuesta seleccionada y los colores de los botones
      setSelectedAnswer(null);
      setIsCorrect(null);
      setQuestionCounter(qc => qc + 1);
    } catch (error) {
      console.log("Error en la generación de la pregunta");
    }
  }


  useEffect(() => {
    getQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleOptionClick = (option) => {
    setSelectedAnswer(option); // Guarda la opción seleccionada
    const correct = option === correctAnswer; // Verifica si es correcta
    setIsCorrect(correct);

    if (correct) {
      setScore(prevScore => prevScore + 1); // Incrementa el puntaje si es correcto
    }

    setQuestionsToAnswer(q => q - 1); // Disminuye el número de preguntas restantes

    // Espera 2 segundos antes de cargar una nueva pregunta y comprueba si acabo la partida
    if (!isGameFinished()) {
      setTimeout(() => {
        getQuestion();
      }, 2000);
    }
  };



  // Finalizar partida
  const handleEndGame = () => {
    //console.log("Partida finalizada");
    // Falta añadir lógica
  };

  const isGameFinished = () => {
    return questionCounter >= numberOfQuestions;
  }

  // Comprueba cada pregunta si acabo la partida o no
  useEffect(() => {
    if (isGameFinished() && !isFinished) { 
      setTimeout(() => {
        setFinished(true);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsToAnswer]);

  const handleHome = () => {
    let path= '/Home';
    navigate(path);
  };



  // Iniciar nueva partida
  const handleNewGame = () => {
    console.log("Nueva partida iniciada");
    setScore(0);  // Reiniciar puntuación
    getQuestion(); // Cargar nueva pregunta
  };
  
  // Redirigir al perfil del usuario
  const handleGoToProfile = () => {
    //navigate('/profile'); 
  };


  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      {!isFinished && (
      <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
        <AppBar position="static" color="primary">
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Button color="inherit" onClick={handleEndGame}>Finalizar partida</Button>
              <Button color="inherit" onClick={handleNewGame}>Empezar nueva partida</Button>
            </div>
            <Button color="inherit" onClick={handleGoToProfile}>Ir al perfil</Button>
          </Toolbar>
        </AppBar>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <Typography variant="h6" sx={{ marginLeft: '20px' }}>
            {question}
          </Typography>
          <Typography variant="h6" sx={{ marginRight: '20px', color: 'blue' }}>
            Preguntas restantes: {questionsToAnswer}
          </Typography>
          <Typography variant="h6" sx={{ marginRight: '20px', color: 'blue' }}>
            Puntuación: {score}
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {image && <img src={image} alt="Imagen de la pregunta" width="40%" height="auto" />}
        </div>
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '10px', 
            alignItems: 'center', 
            marginTop: '20px',
            marginBottom: '20px'
          }}>
          {options.map((option, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => handleOptionClick(option)}
              style={{
                backgroundColor: selectedAnswer === option 
                  ? (isCorrect ? 'green' : 'red') 
                  : (selectedAnswer !== null && option === correctAnswer ? 'green' : ''), // Si se falla, también se muestra cual era la correcta
                color: selectedAnswer === option || (selectedAnswer !== null && option === correctAnswer) ? 'white' : 'black'
              }}
              disabled={selectedAnswer !== null} // Deshabilita los botones tras hacer clic
            >
              {option}
            </Button>
          ))}
        </div>
        <Chat>{correctAnswer}</Chat>
      </Paper>
      )}

      {isFinished && (
        <div>
        <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Partida finalizada. ¡Gracias por jugar!
          </Typography>
          <div>
            <Typography variant="h6" sx={{ marginRight: '20px', color: 'blue' }}>
              Puntuación: {score}
            </Typography>
          </div>
        </Paper>

        <div>
          <Button onClick={handleHome} variant="contained" sx={{ marginTop: '20px', color: 'white' }}>
          Volver al menú principal</Button>
        </div>
        </div>
      )}

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