import React, { createContext, useContext, useState } from 'react';
import { Container, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Home.css';





const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

const HomePage = () => {
    const navigate = useNavigate();

    // Configuración de la partida
    const [numQuestions, setNumQuestions] = useState(5);
    const [timePerQuestion, setTimePerQuestion] = useState(10);

    

    const handleShowGame = () => {
        let path = '/Game';

        // Configuración del juego
        const gameConfig = {
            numQuestions: numQuestions,
            timePerQuestion: timePerQuestion
        };

        navigate(path, { state: { gameConfig } });
    };

    // Valor del contexto para la configuración del juego
    const configValue = {
        numQuestions,
        timePerQuestion,
        updateNumQuestions: setNumQuestions,
        updateTimePerQuestion: setTimePerQuestion,
    };



    return (
        <ConfigContext.Provider value={configValue}>

            <div title='main-title'>
                <Typography component="h1" className='main-title' variant="h5" sx={{ textAlign: 'center' }}>
                    ¡Bienvenido a
                </Typography>
                <Typography component="h2" variant="h5" sx={{ textAlign: 'center' }}>
                    WiChat!
                </Typography>
            </div>

            <Container component="main" maxWidth="md" sx={{ marginTop: 4, marginBottom: 10 }}>

                <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Grid item xs={12} md={6}>
                        <div title='main'>
                            <Button variant="contained" color="primary" fullWidth onClick={handleShowGame}  >
                                Nueva partida
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Container>

            

        </ConfigContext.Provider>
    )
    }

export default HomePage;
