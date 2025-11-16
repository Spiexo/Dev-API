"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeDb = void 0;
const globals_1 = require("@jest/globals");
exports.fakeDb = {
    get: globals_1.jest.fn(),
    all: globals_1.jest.fn(),
    run: globals_1.jest.fn(),
};
globals_1.jest.mock("./config/config", () => ({
    __esModule: true,
    default: Promise.resolve(exports.fakeDb),
}));
beforeAll(() => {
    globals_1.jest.spyOn(console, "error").mockImplementation(() => { });
    globals_1.jest.spyOn(console, "log").mockImplementation(() => { });
});
