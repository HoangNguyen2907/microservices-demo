const { esbuildDecorators } = require("esbuild-decorators");

module.exports = {
    plugins: [
        esbuildDecorators({
            tsconfig: "./apps/identity-service/tsconfig.app.json",
            cwd: process.cwd(),
        }),
    ],
};
