require("dotenv").config();

const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require('./Routes/AuthRote.js');
const productRoutes = require('./Routes/ProductRote.js');

// Rota Publica 
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Rota publica acessada' });
});

// Use routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Conectando ao Banco de dados e iniciando o servidor
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.sli4hfb.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`
).then(() => {
    app.listen(process.env.PORT || 3001, () => {
        console.log("Conectado no banco com sucesso");
        console.log(`Servidor rodando em ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
