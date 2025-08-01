"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const quests = {};
router.post('/create', auth_1.verifyToken, (req, res) => {
    const { name, steps } = req.body;
    quests[name] = { name, steps, completedBy: [] };
    res.sendStatus(201);
});
router.post('/complete', auth_1.verifyToken, (req, res) => {
    const { name } = req.body;
    const quest = quests[name];
    if (quest) {
        quest.completedBy.push(req.user.username);
        res.sendStatus(200);
    }
    else {
        res.status(404).send('Quest not found');
    }
});
router.get('/:name', (req, res) => {
    const { name } = req.params;
    const quest = quests[name];
    if (quest) {
        res.json(quest);
    }
    else {
        res.status(404).send('Quest not found');
    }
});
exports.default = router;
//# sourceMappingURL=quest.js.map