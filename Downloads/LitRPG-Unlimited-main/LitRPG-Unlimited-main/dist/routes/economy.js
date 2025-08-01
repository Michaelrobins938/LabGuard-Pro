"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const users = {};
router.post('/earn', auth_1.verifyToken, (req, res) => {
    const { amount } = req.body;
    const user = users[req.user.username];
    if (!user) {
        users[req.user.username] = { currency: 0 };
    }
    users[req.user.username].currency = (users[req.user.username].currency || 0) + amount;
    res.sendStatus(200);
});
router.post('/spend', auth_1.verifyToken, (req, res) => {
    const { amount } = req.body;
    const user = users[req.user.username];
    if (!user) {
        res.status(400).send('User not found');
        return;
    }
    if (user.currency >= amount) {
        user.currency -= amount;
        res.sendStatus(200);
    }
    else {
        res.status(400).send('Insufficient funds');
    }
});
router.get('/balance', auth_1.verifyToken, (req, res) => {
    const user = users[req.user.username];
    if (!user) {
        res.json({ currency: 0 });
        return;
    }
    res.json({ currency: user.currency });
});
exports.default = router;
//# sourceMappingURL=economy.js.map