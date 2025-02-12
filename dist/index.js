"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database"));
const app = (0, express_1.default)();
const port = 8000;
(0, database_1.default)();
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
