const Models = require("../models");
const mongoose = require("mongoose");
const Utils = require("../utils");

exports.product_get = (req, res, _next) => {
  Models.Product.find()
    .select("name price _id")
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
        return res.json(Utils.Response.success(response));
      } else {
        return res.json(Utils.Response.error("No products", 404));
      }
    })
    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};

exports.product_post = (req, res, next) => {
  const product = new Models.Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImg: req.file.path,
  });
  product
    .save()
    .then((result) => {
      const product = {
        name: result.name,
        price: result.price,
        id: result._id,
        productImg: result.productImg,
        req: {
          type: "GET",
          url: "http://localhost:4000/products/" + result._id,
        },
      };

      return res.json(Utils.Response.success(product, 201));
    })
    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};

exports.product_get_description = (req, res, next) => {
  const id = req.params.productID;
  Models.Product.findById(id)
    .exec()
    .then((found) => {
      if (found) {
        return res.json(Utils.Response.success(found));
      } else {
        return res.json(
          Utils.Response.error("No valid entry found with the ID")
        );
      }
    })
    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};

exports.product_update = (req, res, next) => {
  const id = req.params.productID;
  Models.Product.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      return res.json(
        Utils.Response.success({
          req: {
            type: "GET",
            url: "http://localhost:4000/products/" + id,
          },
        })
      );
    })
    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};

exports.product_delete = (req, res, next) => {
  const id = req.params.productID;
  Models.Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      return res.json(
        Utils.Response.success({
          req: {
            type: "POST",
            url: "http://localhost:4000/products",
            body: {
              name: "String",
              price: "Number",
            },
          },
        })
      );
    })
    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};
