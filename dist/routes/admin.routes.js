"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const amdin_controllers_1 = require("../controllers/amdin.controllers");
const router = (0, express_1.Router)();
router.post("/ban/:id", amdin_controllers_1.banUser);
router.post("/unban/:id", amdin_controllers_1.unbanUser);
exports.default = router;
