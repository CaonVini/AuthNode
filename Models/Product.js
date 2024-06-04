const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

function generateFiveDigitId() {
    return Math.floor(10000 + Math.random() * 90000);
}

const productSchema = new Schema({
    _id: { type: Number, required: true, default: generateFiveDigitId },
    product_name: { type: String, required: true },
    product_stock: { type: Number, default: 0, required: true },
    product_category: { type: String, required: true },
    product_price: { type: Number, default: 0, required: true},
    is_available: { type: Boolean, default: true },
    created_at: { type: String, default: () => moment().format('YYYY-MM-DD-HH:mm:ss')},

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
