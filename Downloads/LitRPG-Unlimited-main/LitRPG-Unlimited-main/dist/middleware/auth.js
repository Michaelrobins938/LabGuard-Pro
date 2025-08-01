"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthToken = exports.verifyToken = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send({ message: 'Access denied' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        req.userId = decoded.id;
        next();
    }
    catch (ex) {
        res.status(400).send({ message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send({ message: 'Access denied' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        req.userId = decoded.id;
        next();
    }
    catch (ex) {
        res.status(400).send({ message: 'Invalid token' });
    }
};
exports.verifyToken = verifyToken;
const generateAuthToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
};
exports.generateAuthToken = generateAuthToken;
//# sourceMappingURL=auth.js.map