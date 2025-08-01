"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const houses = {
    celestialOrder: { name: 'Celestial Order', points: 0 },
    kitsuneClan: { name: 'Kitsune Clan', points: 0 },
    luminaeSanctum: { name: 'Luminae Sanctum', points: 0 },
    umbralCovenant: { name: 'Umbral Covenant', points: 0 },
};
router.get('/', (_req, res) => {
    res.json(houses);
});
router.post('/addPoints', auth_1.verifyToken, (req, res) => {
    const { house, points } = req.body;
    if (houses[house]) {
        houses[house].points += points;
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});
router.get('/leaderboard', (_req, res) => {
    const leaderboard = Object.values(houses).sort((a, b) => b.points - a.points);
    res.json(leaderboard);
});
exports.default = router;
//# sourceMappingURL=house.js.map