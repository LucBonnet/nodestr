"use strict";

const jwt = require("jsonwebtoken");
const decode = require("jsonwebtoken/decode");

exports.generateToken = async (data) => {
  return jwt.sign(data, global.SALT_KEY, { expiresIn: "1d" });
};

exports.decodeToken = async (token) => {
  return await jwt.verify(token, global.SALT_KEY);
};

exports.authorize = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    res.status(401).json({
      message: "Acesso Restrito",
    });
  } else {
    jwt.verify(token, global.SALT_KEY, (error, decoded) => {
      if (error) {
        res.status(401).json({
          message: "Token Inválido",
        });
      } else {
        next();
      }
    });
  }
};

exports.isAdmin = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    res.status(401).json({
      message: "Token Inválido",
    });
  } else {
    jwt.verify(token, global.SALT_KEY, (error, decoded) => {
      if (error) {
        res.status(401).json({
          message: "Token Inválido",
        });
      } else {
        if (decoded.roles.includes("admin")) {
          next();
        } else {
          res.status(403).json({
            message: "Esta funcionalidade é restrita para administradores",
          });
        }
      }
    });
  }
};
