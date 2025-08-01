"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, async (_req, res) => {
    try {
        const users = await User_1.default.find();
        res.json(users);
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
});
router.get('/:id', auth_1.authenticate, getUser, (_req, res) => {
    res.json(res.user);
});
router.post('/', async (req, res) => {
    const user = new User_1.default({
        username: req.body.username,
        password: await bcryptjs_1.default.hash(req.body.password, 10)
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    }
    catch (err) {
        const error = err;
        res.status(400).json({ message: error.message });
    }
});
async function getUser(req, res, next) {
    let user;
    try {
        user = await User_1.default.findById(req.params.id);
        if (user == null) {
            res.status(404).json({ message: 'Cannot find user' });
            return;
        }
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
        return;
    }
    res.user = user;
    next();
}
exports.default = router;
//# sourceMappingURL=users.js.map