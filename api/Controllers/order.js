const mongoose = require("mongoose");
const Order = require("../Models/order");
const Product = require("../Models/product");

exports.order_get_controller = (req, res) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      res.status(200).json({
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
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.order_post_controller = (req, res, next) => {
  Product.findById(req.body.productID)
    .then((product) => {
      if (product) {
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productID,
        });
        order
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "Order added",
              createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
              },
            });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        res.status(404).json({
          message: "No product found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.order_get_description_controller = (req, res, next) => {
  const id = req.params.orderID;
  Order.findById({ _id: id })
    .populate("product")
    .exec()
    .then((found) => {
      if (!found) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        order: found,
        req: {
          type: "GET",
          url: "http://localhost:4000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.order_delete_controller = (req, res, next) => {
  const id = req.params.orderID;
  Order.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Deleted Order",
        req: {
          type: "POST",
          body: {
            productID: "productID",
            quantity: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
