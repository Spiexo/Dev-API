"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const user_controllers_1 = require("../controllers/user.controllers");
const router = (0, express_1.Router)();
router.get('/profil', auth_middlewares_1.authenticateToken, user_controllers_1.getMyProfil);
router.get('/profil/:id', auth_middlewares_1.authenticateToken, user_controllers_1.getUserProfil);
exports.default = router;
