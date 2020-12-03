"use strict";

const multer = require("multer");

const express = require("express");
const router = express.Router();
const controller = require("../controllers/product-controller");

const uploadConfig = require("../config/product-images");
const upload = multer(uploadConfig);
const authService = require("../services/auth-service");

router.get("/", controller.get);
router.get("/:slug", controller.getBySlug);
router.get("/admin/:id", controller.getById);
router.get("/tags/:tag", controller.getByTag);
router.post(
  "/",
  [authService.isAdmin, upload.single("image")],
  controller.post
);
router.put("/:id", authService.isAdmin, controller.put);
router.delete("/", authService.isAdmin, controller.del);

module.exports = router;
