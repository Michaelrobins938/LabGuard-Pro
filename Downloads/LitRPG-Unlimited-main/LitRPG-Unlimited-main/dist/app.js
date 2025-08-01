"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const contact_1 = __importDefault(require("./routes/contact"));
const releases_1 = __importDefault(require("./routes/releases"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
mongoose_1.default.connect(process.env.MONGO_URI || '')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
app.use('/api/auth', auth_1.default);
app.use('/api/contact', contact_1.default);
app.use('/api/releases', releases_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=app.js.map