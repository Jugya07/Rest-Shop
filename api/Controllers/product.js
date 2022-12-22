const Product = require("../Models/product");
const mongoose = require("mongoose");

exports.product_get_controller = (req, res, next) => {
  Product.find()
    .select("name price _id productImg")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            id: doc._id,
            productImg: doc.productImg,
            request: {
              type: "GET",
              url: "http://localhost:4000/products/" + doc._id,
            },
          };
        }),
      };
      if (docs.length > 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No products",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.product_post_controller = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImg: req.file.path,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Successfully added product",
        product: {
          name: result.name,
          price: result.price,
          id: result._id,
          productImg: result.productImg,
          req: {
            type: "GET",
            url: "http://localhost:4000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.product_get_description_controller = (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .exec()
    .then((found) => {
      if (found) {
        res.status(200).json({
          product: found,
          req: {
            type: "GET",
            url: "http://localhost:4000/products",
          },
        });
      } else {
        res.status(404).json({ message: "No valid entry found with the ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.product_update_controller = (req, res, next) => {
  const id = req.params.productID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Successfully updated",
        req: {
          type: "GET",
          url: "http://localhost:4000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.product_delete_controller = (req, res, next) => {
  const id = req.params.productID;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
        req: {
          type: "POST",
          url: "http://localhost:4000/products",
          body: {
            name: "String",
            price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
