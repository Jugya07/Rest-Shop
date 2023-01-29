const mongoose = require("mongoose");
const Utils = require("../utils");
const Models = require("../models");

exports.order_get = (_req, res) => {
  Models.Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      const result = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            req: {
              type: "GET",
              url: "http://localhost:4000/orders/" + doc._id,
            },
          };
        }),
      };
      return res.json(Utils.Response.success(result));
    })
    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};

exports.order_post = (req, res) => {
  Models.Product.findById(req.body.productID)
    .then((product) => {
      if (product) {
        const order = new Models.Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productID,
        });
        order
          .save()
          .then((result) => {
            console.log(result);
            return res.json(
              Utils.Response.success(
                {
                  createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                  },
                },
                201
              )
            );
          })
          .catch((err) => {
            return res.json(Utils.Response.error(err));
          });
      } else {
        return res.json(Utils.Response.error("No Product found", 404));
      }
    })
    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};

exports.order_get_description = (req, res) => {
  const id = req.params.orderID;
  Models.Order.findById({ _id: id })
    .populate("product")
    .exec()
    .then((found) => {
      if (!found) {
        return res.json(Utils.Response.error("No Order found", 404));
      }
      return res.json({
        order: found,
        req: {
          type: "GET",
          url: "http://localhost:4000/orders",
        },
      });
    })
    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};

exports.order_delete = (req, res) => {
  const id = req.params.orderID;
  Models.Order.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      return res.json(Utils.Response.success("Order deleted"));
    })
    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};
