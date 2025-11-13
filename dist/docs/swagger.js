"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
// Configuration de Swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API",
            version: "1.0.0",
            description: "API pour la gestion des utilisateurs, l'authentification et les fonctionnalités administratives.",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                // ------------------------------
                //  Modèle principal
                // ------------------------------
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        username: { type: "string" },
                        email: { type: "string" },
                        first_name: { type: "string" },
                        last_name: { type: "string" },
                        bio: { type: "string" },
                        avatar_url: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                        is_premium: { type: "boolean" },
                        is_banned: { type: "boolean" },
                        role: { type: "string", enum: ["user", "admin"] },
                    },
                },
                // ------------------------------
                //  Auth Schemas
                // ------------------------------
                RegisterRequest: {
                    type: "object",
                    properties: {
                        username: { type: "string", example: "myusername" },
                        email: { type: "string", example: "test@example.com" },
                        password: { type: "string", example: "mypassword" },
                    },
                },
                LoginRequest: {
                    type: "object",
                    properties: {
                        email: { type: "string", example: "test@example.com" },
                        password: { type: "string", example: "mypassword" },
                    },
                },
                LogoutRequest: {
                    type: "object",
                    properties: {
                        email: { type: "string", example: "test@example.com" },
                        password: { type: "string", example: "mypassword" },
                    },
                },
                RefreshRequest: {
                    type: "object",
                    properties: {
                        refreshToken: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                    },
                },
                // ------------------------------
                //  User Schemas
                // ------------------------------
                EditProfileRequest: {
                    type: "object",
                    properties: {
                        username: { type: "string", example: "John Doe" },
                        first_name: { type: "string", example: "John" },
                        last_name: { type: "string", example: "Doe" },
                        bio: { type: "string", example: "Passionné de tech et de jeux." },
                    },
                },
                GetAllUsersRequest: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: "2" },
                        username: { type: "string", example: "Username" },
                        email: { type: "string", example: "username@exemple.com" },
                        is_banned: { type: "boolean", example: "0" },
                        role: { type: "string", enum: ["user", "admin"], example: "user" },
                    },
                },
                DeleteUserRequest: {
                    type: "object",
                    properties: {
                        username: { type: "string", example: "myusername" },
                        email: { type: "string", example: "test@example.com" },
                        password: { type: "string", example: "mypassword" },
                    },
                },
                // ------------------------------
                //  Sports Schemas
                // ------------------------------
                SportsLeague: {
                    type: "object",
                    properties: {
                        idLeague: { type: "string" },
                        strLeague: { type: "string" },
                        strSport: { type: "string" },
                        strLeagueAlternate: { type: "string" },
                    },
                },
                SportsTeam: {
                    type: "object",
                    properties: {
                        idTeam: { type: "string" },
                        strTeam: { type: "string" },
                        strLeague: { type: "string" },
                        strCountry: { type: "string" },
                        strStadium: { type: "string" },
                        strBadge: { type: "string" },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [path_1.default.resolve(__dirname, "../routes/*.js")],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
