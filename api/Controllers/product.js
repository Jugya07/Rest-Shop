const mongoose = require("mongoose");
const Models = require("../models");
const Utils = require("../utils");
const Middlewares = require("../middlewares");

exports.product_get = Middlewares.CatchAsync(async (_req, res, next) => {
  const products = await Models.Product.find().select("name price _id");
  if (products.length === 0) {
    return next(Utils.Response.error("No Products", 404));
  }

  const response = {
    count: products.length,
    products: products.map((doc) => {
      return {
        name: doc.name,
        price: doc.price,
        id: doc._id,
        productImg: doc.productImg,
        request: {
          type: "GET",
          url: `${process.env.BASE_URL}/products/` + doc._id,
        },
      };
    }),
  };

  return res.json(Utils.Response.success(response));
});

exports.product_post = Middlewares.CatchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { productImg } = req.file;
  if (
    !name ||
    typeof name !== String ||
    !price ||
    typeof price !== Number ||
    !productImg
  ) {
    return next(Utils.Response.error("Invalid field", 400));
  }
  const product = await Models.Product.create({
    _id: new mongoose.Types.ObjectId(),
    name,
    price,
    productImg,
  });

  const newProduct = {
    product,
    req: {
      type: "GET",
      url: `${process.env.BASE_URL}/products/` + product._id,
    },
  };

  return res.json(Utils.Response.success(newProduct, 201));
});

exports.product_get_description = Middlewares.CatchAsync(async (req, res) => {
  const { productID } = req.params;

  const product = await Models.Product.findById(productID);

  if (!product) {
    return next(Utils.Response.error("No valid entry found with the ID", 400));
  }
  return res.json(Utils.Response.success(product));
});

exports.product_update = Middlewares.CatchAsync(async (req, res) => {
  const { productID } = req.params;
  const product = await Models.Product.findById(productID);
  if (!product) {
    return next(Utils.Response.error("No product found with the id!", 400));
  }
  await Models.Product.updateOne({ _id: productID }, { $set: req.body });
  return res.json(
    Utils.Response.success({
      req: {
        type: "GET",
        url: `${process.env.BASE_URL}/products/` + id,
      },
    })
  );
});

exports.product_delete = Middlewares.CatchAsync(async (req, res) => {
  const { productID } = req.params;
  await Models.Product.deleteOne({ _id: productID });
  return res.json(
    Utils.Response.success({
      req: {
        type: "POST",
        url: `${process.env.BASE_URL}/products/`,
        body: {
          name: "String",
          price: "Number",
        },
      },
    })
  );
});
