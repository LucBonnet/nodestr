"use strict";

const guid = require("guid");
const repository = require("../repositories/order-repository");

const authService = require("../services/auth-service");

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

exports.post = async (req, res, next) => {
  const { items } = req.body;

  const number = guid.raw().substring(0, 6);

  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    const data = await authService.decodeToken(token);

    await repository.create({
      customer: data.id,
      number: number,
      items: items,
    });
    return res.status(201).send({ message: "Pedido cadastrado com sucesso" });
  } catch (e) {
    return res.status(500).send({
      message: "falha ao cadastrar o pedido",
      data: e,
    });
  }
};
