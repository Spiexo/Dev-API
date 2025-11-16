import { jest } from "@jest/globals";

export const fakeDb = {
  get: jest.fn<any>(),
  all: jest.fn<any>(),
  run: jest.fn<any>(),
};

jest.mock("./config/config", () => ({
  __esModule: true,
  default: Promise.resolve(fakeDb),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});
