"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesInit = void 0;
const index_routes_1 = __importDefault(require("./index.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const posts_routes_1 = __importDefault(require("./posts.routes"));
const comments_routes_1 = __importDefault(require("./comments.routes"));
const routesInit = (app) => {
    app.use('/posts', posts_routes_1.default);
    app.use('/posts/comments', comments_routes_1.default);
    app.use('/', index_routes_1.default);
    app.use('/users', users_routes_1.default);
    app.use((_, res) => {
        console.log('Not Found 404');
        res.status(404).json({ msg_err: 'Not Found 404' });
    });
};
exports.routesInit = routesInit;
