const { esbuildDecorators } = require('esbuild-decorators');

module.exports = {
  plugins: [
    esbuildDecorators({
      tsconfig: './apps/nestjs-gateway/tsconfig.app.json',
      cwd: process.cwd(),
    }),
  ],
};
