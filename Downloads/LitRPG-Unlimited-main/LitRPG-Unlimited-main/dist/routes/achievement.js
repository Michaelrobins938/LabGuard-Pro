"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const achievements = [];
router.get('/', (_req, res) => {
    res.json(achievements);
});
router.post('/unlock', auth_1.verifyToken, (req, res) => {
    const { achievement } = req.body;
    achievements.push({ user: req.user.username, achievement });
    res.sendStatus(201);
});
exports.default = router;
//# sourceMappingURL=achievement.js.map