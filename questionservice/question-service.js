const Question = require('./question-model');
const mongoose = require('mongoose');

const {questionQueries} = require('./question-queries'); //TODO: poner nombre archivo queries (Pablo)



var allQueries = getData(questionQueries)
var queries = [];
var correct = "";
var question = "";
var image = "";
var gameId = null;
var wikiURL = "";
var options = [];



const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/questions';
mongoose.connect(mongoURI);




async function generateQuestion() {
    try {
        n = crypto.randomInt(0, queries.length); //Escoger una query aleatoria entre las cargadas.

        var response = await axios.get(wikiURL,
            {
                params: {
                    query: queries[n][0],
                    format: 'jsom'
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

    options = [];
    var data = data.results.bindings;
    //todo
}

/**
 * Get both queries and images data
 * @param imgData
 */
function getData(imgData) {

}


function getQueriesByCategory(category) {
    //todo: definir categorías (lugares, personas, cosas?)
}

function setDataByCategory(category) {
    queries = allQueries[category];
}






