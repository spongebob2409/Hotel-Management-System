"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
<<<<<<< HEAD
const config_1 = require("prisma/config");
exports.default = (0, config_1.defineConfig)({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: process.env["DATABASE_URL"],
    },
});
=======
exports.default = {
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env['DATABASE_URL'],
    },
};
>>>>>>> Rohan-backend
//# sourceMappingURL=prisma.config.js.map