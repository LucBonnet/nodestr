"use strict";
const mongoose = require("mongoose");
const Product = mongoose.model("Product");

exports.get = async () => {
  return await Product.find({ active: true }, "title price slug image");
};

exports.getBySlug = async (slug) => {
  return await Product.findOne(
    {
      slug: slug,
      active: true,
    },
    "title description price slug tags"
  );
};

exports.getById = async (id) => {
  return await Product.findById(id);
};

exports.getByTag = async (tag) => {
  return await Product.find(
    {
      tags: tag,
      active: true,
    },
    "title description price slug tags"
  );
};

exports.create = async ({
  title,
  slug,
  description,
  price,
  active,
  tags,
  image,
}) => {
  const product = new Product();

  product.title = title;
  product.slug = slug;
  product.description = description;
  product.price = price;
  product.active = active;
  product.tags = tags;
  product.image = image;

  await product.save();
};

exports.update = async ({ id, title, description, price, slug }) => {
  await Product.findByIdAndUpdate(id, {
    $set: {
      title: title,
      description: description,
      price: price,
      slug: slug,
    },
  });
};

exports.del = async (id) => {
  await Product.findOneAndRemove({ _id: id });
};
