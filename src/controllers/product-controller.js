"use strict";

const azure = require("azure-storage");

const express = require("express");
const ValidationContract = require("../validators/fluent-validator");
const repository = require("../repositories/product-repository");

exports.get = async (req, res, next) => {
  try {
    const data = await repository.get();
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({
      message: "Falha ao processar sua requisição",
      err: e,
    });
  }
};

exports.getBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const data = await repository.getBySlug(slug);
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({
      message: "Falha ao processar sua requisição",
      err: e,
    });
  }
};

exports.getById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const data = await repository.getById(id);
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({
      message: "Falha ao processar sua requisição",
      err: e,
    });
  }
};

exports.getByTag = async (req, res, next) => {
  const { tag } = req.params;

  try {
    const data = await repository.getByTag(tag);
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({
      message: "Falha ao processar sua requisição",
      err: e,
    });
  }
};

exports.post = async (req, res, next) => {
  const { title, slug, description, price, active, tags } = req.body;
  const reqImage = req.file;

  const image = reqImage.filename;

  const contract = new ValidationContract();

  contract.hasMinLen(title, 3, "O título deve conter pelo menos 3 caracteres");
  contract.hasMinLen(slug, 3, "O slug deve conter pelo menos 3 caracteres");
  contract.hasMinLen(
    description,
    3,
    "A descrição deve conter pelo menos 3 caracteres"
  );

  if (!contract.isValid()) {
    return res.status(400).send(contract.errors()).end();
  }

  try {
    await repository.create({
      title,
      slug,
      description,
      price,
      active,
      tags,
      image,
    });
    return res.status(201).send({ message: "Produto cadastrado com sucesso" });
  } catch (e) {
    return res.status(400).send({
      message: "falha ao cadastrar o produto",
      data: e,
    });
  }
};

exports.put = async (req, res, next) => {
  const { id } = req.params;

  const { title, description, price, slug } = req.body;

  try {
    await repository.update({ id, title, description, price, slug });
    return res.status(200).send({ message: "Produto atualizado com sucesso" });
  } catch (e) {
    return res.status(400).send({
      message: "Falha ao atualizar produto",
      data: e,
    });
  }
};

exports.del = async (req, res, next) => {
  const { id } = req.body;

  try {
    await repository.del(id);
    return res.status(200).send({ message: "Produto removido com sucesso" });
  } catch (e) {
    return res.status(400).send({
      message: "Falha ao remover o produto",
      data: e,
    });
  }
};
