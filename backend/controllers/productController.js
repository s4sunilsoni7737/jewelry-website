// const Product = require('../models/Product');
const Product = require('../models/Product');

exports.uploadProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const imageUrl = req.file.path;

  const newProduct = new Product({ name, description, price, category, imageUrl });
  await newProduct.save();

  res.status(201).json({ message: 'Product uploaded', product: newProduct });
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
