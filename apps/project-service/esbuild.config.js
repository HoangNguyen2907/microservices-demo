const { esbuildDecorators } = require("esbuild-decorators");

module.exports = {
    plugins: [
        esbuildDecorators({
            tsconfig: "./apps/project-service/tsconfig.app.json",
            cwd: process.cwd(),
        }),
    ],
};
