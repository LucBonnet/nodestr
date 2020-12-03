"use strict";
const mongoose = require("mongoose");
const product = require("../models/product");
const Customer = mongoose.model("Customer");

exports.get = async () => {
  return await Customer.find();
};

exports.create = async ({ name, email, password, roles }) => {
  const customer = new Customer();

  customer.name = name;
  customer.email = email;
  customer.password = password;
  customer.roles = roles;

  await customer.save();
};

exports.authenticate = async (data) => {
  const res = await Customer.findOne({
    email: data.email,
    password: data.password,
  });
  return res;
};

exports.getById = async (id) => {
  const res = await Customer.findById(id);
  return res;
};
