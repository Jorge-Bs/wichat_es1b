const mongoose = require('mongoose');


const gameSchema = new mongoose.Schema( {
    questions: [
        {
            // Relacionar Game con Question en la database.
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        }
    ],

    playerId: {
        type: String,
        required: true,
    },
});