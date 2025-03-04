// Imports
const Question = require('./question-model');
const Game = require('./game-model');
const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const crypto = require('crypto');
global.fetch = require('node-fetch');


// Constantes
const {queries:imagesQueries} = require('./question-queries');
const app = express();
const generatorEndpoint = process.env.REACT_APP_API_ORIGIN_ENDPOINT  || "http://localhost:3000";
const port = 8004;
const wikiURL = "https://query.wikidata.org/sparql";
const nOptions = 4;

// Variables
var correct = "";
var question = "";
var image = "";
var gameId = null;
var options = [];
var maxQuestions = 5; //TODO: definir cantidad de preguntas por partida
var questionToSave = null;
var gameQuestions = [];
var randomQuery;
var randomIndexes = [];
var queries = [
    `SELECT DISTINCT ?option ?optionLabel ?imageLabel
      WHERE {
        ?option wdt:P31 wd:Q6256;               
              rdfs:label ?optionLabel;          
        
        OPTIONAL { ?option wdt:P18 ?imageLabel. }    
        FILTER(lang(?optionLabel) = "es")       
        FILTER EXISTS { ?option wdt:P18 ?imageLabel }
      } LIMIT 50`,  
    `SELECT ?option ?optionLabel ?imageLabel
      WHERE {
        ?option wdt:P31 wd:Q4989906; 
                  wdt:P17 wd:Q29;                
                  wdt:P18 ?imageLabel.                  
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
      }
      LIMIT 50`,  
    `SELECT ?optionLabel ?imageLabel
      WHERE {
        ?option wdt:P106 wd:Q937857;     
                wdt:P569 ?birthdate.     
        FILTER(YEAR(?birthdate) >= 1970)  
        ?option wdt:P18 ?imageLabel.     
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
      }
      LIMIT 50`
];
var currentNumberOfQuestions = 2;
var language = "es";
var queriesAndQuestions = getQueriesAndQuestions(imagesQueries); // almacena las queries y las preguntas

// configurar el puerto para las preguntas (descomentar cuando funcione el servicio)
// const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/userdb';
// mongoose.connect(mongoURI);

//Posibles categorías para las preguntas, sujeto a cambios
//const questions = ["¿Cuál es el lugar de la imagen?", "¿Qué monumento es este?", "¿Cuál es el nombre de este futbolista?"]

var possiblesQuestions = ["¿Cuál es el lugar de la imagen?", "¿Qué monumento es este?", "¿Cuál es el nombre de este futbolista?"];
var categorys = ["Geografia", "Cultura", "Personajes"];
var questionObject = "";
var correctAnswer = "";
var answerOptions = [];
var questionImage = "";
var numberOfOptions = 4;

function getQuestionData(data) {
    answerOptions = [];
    var fourRows = [];
    const nElems = data.length;

      // Select 4 random rows of the data
    for (let i = 0; i<numberOfOptions; i++){
        //let indexRow = Math.floor(Math.random() * numEles);
        let indexRow = crypto.randomInt(0, nElems);
        if(data[indexRow].optionLabel.value.startsWith('Q')){    // añadir mas comprobaciones 
            i = i - 1;
        }else{
        fourRows.push(data[indexRow]);
        // Store the 4 posible answers
        answerOptions.push(data[indexRow].optionLabel.value);
        }
    }

    var indexQuestion = crypto.randomInt(0,numberOfOptions);
    // Store the country choosen and its capital
    questionObject= possiblesQuestions[randomQuery];
    questionImage = fourRows[indexQuestion].imageLabel.value;
    correctAnswer = fourRows[indexQuestion].optionLabel.value;

}


app.get('/generateQuestion', async (req, res) => { 
    randomQuery = crypto.randomInt(0, queries.length);
    console.log("Selected Query: " + randomQuery);
    const apiUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(queries[randomQuery])}&format=json`;

    try {
        // Makes the petition to the url
        const response = await axios(apiUrl, {
        headers: {
            'Accept': 'application/json'
        }
        });

        console.log("📢 Respuesta completa de Wikidata:", JSON.stringify(response.data, null, 2));

        if (!response.data || !response.data.results || response.data.results.bindings.length === 0) {
            console.error("La consulta a Wikidata no devolvió resultados.");
            return res.status(400).json({ error: 'La consulta no devolvió resultados' });
        }

        // Parse the response 
        //const data = await response.json();

        // Send the parsed response to be selected
        getQuestionData(response.data.results.bindings);

        // Declare what will be return 
        solution = {
            responseQuestion : questionObject,
            responseCorrectAnswer : correctAnswer,
            responseAnswerOptions : answerOptions,
            responseQuestionImage : questionImage
        };

        //saveQuestion();
        
        // Return the resoult with a 200 status
        res.status(200).json(solution);
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




//Parser para poder recibir JSON en el body de las peticiones
app.use(bodyParser.json());

//Estructura para poder hacer peticiones desde el Game
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', generatorEndpoint);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})




// app.get('/generateQuestion', async (req, res) => {
//     try {
//         console.log("Servicio  preguntas");
//         //gameQuestions = [];
//         queries = [];
//         questions = [];
//         if(currentNumberOfQuestions == 0){
//             gameId = null;
//         }

//         //const user = req.query.user;
//         await getQueriesByCategory("Geografia");
//         console.log("Generando pregunta...");
//         await generateQuestion();
//         console.log("Pregunta generada");

//         currentNumberOfQuestions++;
//         if(currentNumberOfQuestions >= maxQuestions) {
//             currentNumberOfQuestions = 0;
//         }
//         var id = await saveData();
//         //await saveGame(user, id);

//         // Construir la response
//         var response = {
//             responseQuestion: question,
//             responseOptions: options,
//             responseCorrectOption: correct,
//             responseImage: image,
//             question_Id: id
//         }
//         console.log("Pregunta generada: "+ question);

//         res.status(200).json(response); //OK
//     }
//     catch(error) {
//         res.status(400).json({error: error.message}); //Error: bad request client error
//     }
// })


/**
 * Configuración de las preguntas: asegurarse de que el número de preguntas es correcto y está dentro de los límites establecidos.
 */
app.post('/configureGame', async (req, res) => {
    try {
        maxQuestions = req.body.valueQuestion;
        if(maxQuestions === undefined) {
            throw new Error("Incorrect number of questions");
        }
        res.status(200).json(maxQuestions);
    }
    catch(error) {
        console.log("Error while configuring the game: " + error);
        res.status(400).json({error: error.message});
    }
})




// Carga de las queries según la categoría
async function getQueriesByCategory(category) {
    if(category == "Geografia") {
        changeQueriesAndQuestions("Geografia");
    } else if(category == "Cultura") {
        changeQueriesAndQuestions("Cultura");
    } else if(category == "Personajes") {
        changeQueriesAndQuestions("Personajes");
    } else {
        queries = getAllValues();
    }
}

function changeQueriesAndQuestions(category) {
    queries = queriesAndQuestions["es"][category];
}

function getAllValues() {
    var data = [];
    for (var category in queriesAndQuestions) {
        var categoryQueries = queriesAndQuestions[category];
        if (categoryQueries[language]) {
            data = data.concat(categoryQueries[language]);
        }
    }
    return data;
}


// Carga las queries y las preguntas de question-queries.js
function getQueriesAndQuestions(images) {
    var data = {};
    // for (var language in images) {
    //     var categoryQuery = images[language];
    //     for (var category in categoryQuery) {
    //         if (!data[category]) {
    //             data[category] = {};
    //         }
    //         if (!data[category][language]) {
    //             data[category][language] = [];
    //         }
    //         data[category][language] = data[category][language].concat(categoryQuery[category]);
    //     }
    // }
    for (var language in images) {
        if (!data[language]) {
            data[language] = {};
        }
        var categoryQuery = images[language];
        for (var category in categoryQuery) {
            if (!data[language][category]) {
                data[language][category] = [];
            }
            data[language][category] = categoryQuery[category];
        }
    }
    return data;
}


async function generateQuestion() {
    randomQuery = crypto.randomInt(0, 2); //Número para usar en el processData

    try {
       randomQuery = crypto.randomInt(0, queries.length); //Escoger una query aleatoria entre las cargadas.

        var response = await axios.get(wikiURL,
            {
                params: {
                    query: queries[randomQuery][0],
                    format: 'json'
                },

                headers: {
                    'Accept': 'application/sparql-results+json' // Aceptar resultados de la consulta a wikidata
                }
            });

        processData(response.data);
    }
    catch(error) {
        console.error("Error in generateQuestion: " + error);
        throw new Error("Error al generar la pregunta: " + error);
    }
}

function processData(data) {

    options = []; //Reset options
    data = data.results.bindings;
    randomIndexes = [];
    var optionsSelected = [];

    //Obtener cuatro índices aleatorios sin repeticiones
    while (randomIndexes.length < nOptions) {
        var i = crypto.randomInt(0, data.length);
        var opt = data[i].optionLabel.value;
        var quest = "";

        // Se comprueba que la opción no esté repetida, y que no sea una entidad de Wikidata ni un enlace
        if (!randomIndexes.includes(i) && (quest === "" || (!(opt.startsWith("Q") || opt.startsWith("http"))
            && !(quest.startsWith("Q") || quest.startsWith("http")))) && !optionsSelected.includes(opt)) {
            randomIndexes.push(i);
            optionsSelected.push(opt);
        }
    }

    // Seleccionar un índice aleatorio para la opción correcta
    var correctIndex = crypto.randomInt(0, nOptions);
    correct = data[randomIndexes[correctIndex]].optionLabel.value;

    question = queries[0][1];
    image = data[randomIndexes[correctIndex]].imageLabel.value;

    // Mezclar optiones
    for(var i = 0; i < nOptions; i++) {
        var optionIndex = randomIndexes[i];
        var option = data[optionIndex].optionLabel.value;
        options.push(option);
    }
}



async function saveData() {
    try {
        var falseOptions = options.filter(o => o !== correct);

        const newQuestion = new Question({
            question: question,
            correctAnswer: correct,
            inc_answer_1: falseOptions[0],
            inc_answer_2: falseOptions[1],
            inc_answer_3: falseOptions[2],
        });

        await newQuestion.save();

        questionToSave = newQuestion;

        return newQuestion._id;
    }
    catch(error) {
        console.error("Error while saving a new question: " + error);
    }
}



async function saveGame(username, id) {
    if (gameId === null) {
        try {
            const newGame = new Game({playerId: username, questions: []});
            newGame.questions.push(questionToSave._id);
            await newGame.save();

            gameId = newGame._id;

            return null;
        }
        catch(error) {
            console.error("Error guardando los datos de la partida: " + error)
        }
    }
    else {
        const existingGame = await Game.findById(gameId);

        if(!existingGame) { // No existingGame
            try {
                const newGame = new Game({playerId: username, questions: []});
                newGame.questions.push(questionToSave._id);
                await newGame.save();

                gameId = newGame._id;

                return null;
            }
            catch(error) {
                console.error("Error guardando los datos de la partida: " + error)
            }
        }
        else { //Ya hay existingGame
            try {
                existingGame.questions.push(questionToSave._id);
                await existingGame.save();

                gameId = existingGame._id;

                return null;
            }
            catch(error) {
                console.error("Error guardando los datos de la partida: " + error)
            }
        }
    }
}


const server = app.listen(port, () => {
    console.log(`Question generator service listening at http://localhost:${port}`);
});

module.exports = server;




