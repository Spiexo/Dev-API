"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const sports_routes_1 = __importDefault(require("./routes/sports.routes"));
const swagger_1 = require("./docs/swagger");
// Charger les variables d'environnement
dotenv_1.default.config();
// Initialiser l'application Express
const app = (0, express_1.default)();
// Middleware CORS
app.use((0, cors_1.default)());
// Middleware pour parser le JSON
app.use(express_1.default.json());
// Routes
app.use("/auth", auth_routes_1.default);
app.use("/user", user_routes_1.default);
app.use("/admin", admin_routes_1.default);
app.use("/sports", sports_routes_1.default);
// Documentation Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
