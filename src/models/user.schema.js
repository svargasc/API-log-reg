const mongoose = require("mongoose");

// creamos el esquema de datos que vamos a registrar
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

// exportamos el modelo de datos de un usuario
module.exports = mongoose.model('User', userSchema);