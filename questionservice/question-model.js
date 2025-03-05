const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema( {
    question: {
        type: String,
        required: true,
    },

    correctAnswer: {
        type: String,
        required: true,
    },

    inc_answer_1: {
        type: String,
        required: true,
    },

    inc_answer_2: {
        type: String,
        required: true,
    },

    inc_answer_3: {
        type: String,
        required: true,
    },

    time: {
        type: Number,
        required: true,
        default: 60,  //TODO: cambiar por el valor que se acuerde.
    },

    category: {
        type: String,
        required: true,
    },

});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question