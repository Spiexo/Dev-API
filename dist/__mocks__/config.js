"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.all = exports.get = void 0;
// __mocks__/config.ts
exports.get = jest.fn();
exports.all = jest.fn();
exports.run = jest.fn();
exports.default = {
    get: exports.get,
    all: exports.all,
    run: exports.run,
};
