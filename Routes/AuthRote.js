
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../Models/User.js'); 

// Registrando usuario
router.post('/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;

    // validar erros
    if (!name) {
        return res.status(422).json({ msg: 'É obrigatório inserir o nome de usuario' });
    }

    // validar o email
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    if (!email) {
        return res.status(422).json({ msg: 'É obrigatório inserir o email' });
    } else if (!validateEmail(email)) {
        return res.status(422).json({ msg: 'O email inserido não é válido' });
    }

    if (!password) {
        return res.status(422).json({ msg: 'É obrigatório inserir uma senha' });
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas são diferentes' });
    }

    // Ver se usuario ja existe
    const userExistent = await User.findOne({ email: email });

    if (userExistent) {
        return res.status(422).json({ msg: 'Email já registrado, porfavor utilize outro email' });
    }

    // Criar crypto senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Criar Usuario
    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try {
        await user.save();
        res.status(201).json({ msg: 'Usuario criado no banco de dados' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
});

// Logar Usuario
router.post('/user', async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(422).json({ msg: 'É obrigatório inserir o email' });
    }

    if (!password) {
        return res.status(422).json({ msg: 'É obrigatório inserir uma senha' });
    }

    // Ver se usuario existe
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(422).json({ msg: 'Este Usuario não existe' });
    }

    // Conferir Senha
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha Inválida' });
    }

    try {
        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret
        );

        res.status(200).json({ msg: "Autenticação feita com sucesso", token });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
});

module.exports = router;
