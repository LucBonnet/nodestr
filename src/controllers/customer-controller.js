"use strict";

const ValidationContract = require("../validators/fluent-validator");
const repository = require("../repositories/customer-repository");
const md5 = require("md5");

const emailService = require("../services/email-service");
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
  const { name, email, password, roles } = req.body;

  const contract = new ValidationContract();

  contract.hasMinLen(name, 3, "O nome deve conter pelo menos 3 caracteres");
  contract.isEmail(email, "E-mail inválido");
  contract.hasMinLen(
    password,
    6,
    "A senha deve conter pelo menos 6 caracteres"
  );

  if (!contract.isValid()) {
    return res.status(400).send(contract.errors()).end();
  }

  try {
    await repository.create({
      name,
      email,
      password: md5(password + global.SALT_KEY),
      roles: roles,
    });

    emailService.send(
      email,
      "Bem-vindo à Node Store",
      global.EMAIL_TMPL.replace("{0}", name)
    );

    return res.status(201).send({ message: "Cliente cadastrado com sucesso" });
  } catch (e) {
    return res.status(400).send({
      message: "falha ao cadastrar o cliente",
      data: e,
    });
  }
};

exports.authenticate = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const customer = await repository.authenticate({
      email,
      password: md5(password + global.SALT_KEY),
    });

    if (!customer) {
      return res.status(404).send({
        message: "Usuário ou senha inválidos",
      });
    }

    const token = await authService.generateToken({
      id: customer._id,
      email: customer.email,
      name: customer.name,
      roles: customer.roles,
    });

    return res.status(201).send({
      token: token,
      data: {
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (e) {
    return res.status(400).send({
      message: "falha ao cadastrar o cliente",
      data: e,
    });
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    const data = await authService.decodeToken(token);

    const customer = await repository.getById(data.id);

    if (!customer) {
      return res.status(401).send({
        message: "Cliente não encontrado",
      });
    }

    const tokenData = await authService.generateToken({
      id: customer._id,
      email: customer.email,
      name: customer.name,
      roles: customer.roles,
    });

    return res.status(201).send({
      token: tokenData,
      data: {
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (e) {
    return res.status(400).send({
      message: "falha ao cadastrar o cliente",
      data: e,
    });
  }
};
