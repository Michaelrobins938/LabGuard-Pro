"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Release_1 = __importDefault(require("../models/Release"));
const router = express_1.default.Router();
router.get('/', async (_req, res) => {
    try {
        const releases = await Release_1.default.find();
        res.json(releases);
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=releases.js.map