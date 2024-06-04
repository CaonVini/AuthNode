const express = require('express');
const router = express.Router();
const Product = require("../Models/Product.js");

// Criando Produtos
router.post('/create', async (req, res) => {
    const { product_name, product_stock, product_category, product_price } = req.body;

    if (!product_name) {
        return res.status(422).json({ msg: 'É obrigatório inserir o nome do produto' });
    }

    if (!product_stock) {
        return res.status(422).json({ msg: 'É obrigatório inserir o numero de estoque do produto' });
    }

    if (!product_category) {
        return res.status(422).json({ msg: 'É obrigatório inserir a categoria do produto' });
    }

    if (!product_price) {
        return res.status(422).json({ msg: 'É obrigatório inserir o preço do produto' });
    }

    const is_available = product_stock > 0;

    const product = new Product({
        product_name,
        product_stock,
        product_category,
        product_price,
        is_available,
    });

    try {
        await product.save();
        res.status(201).json({ msg: 'Produto criado no banco de dados', product });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao criar produto", error });
    }
});

// Editando Produtos

router.put('/update/:productId', async (req, res) => {
    const productId = req.params.productId;
    const { fieldToUpdate, value } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        // Verifica se o campo a ser atualizado é válido
        const validFields = ['product_name', 'product_stock', 'product_category', 'product_price'];
        if (!validFields.includes(fieldToUpdate)) {
            return res.status(400).json({ msg: 'Campo inválido para atualização' });
        }

        // Atualiza o campo específico
        product[fieldToUpdate] = value;

        // Se o campo a ser atualizado for product_stock, atualize também o campo is_available
        if (fieldToUpdate === 'product_stock') {
            product.is_available = value > 0;
        }

        await product.save();
        res.status(200).json({ msg: 'Produto atualizado no banco de dados', product });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao atualizar produto", error });
    }
});


// Deletando Produtos

router.delete('/delete', async (req, res) =>{
    const { ProductID } = req.body;

    try {
        const productDelete = await Product.findOneAndDelete({ _id: ProductID });
        if (!productDelete) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }
        res.status(200).json({ msg: 'Produto deletado com sucesso', productDelete });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao deletar produto", error });
    }
})


// Pegando todos os produtos

router.get('/list', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ msg: "Erro ao buscar produtos", error });
    }
});


module.exports = router;
