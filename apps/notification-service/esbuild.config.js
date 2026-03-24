const { esbuildDecorators } = require('esbuild-decorators');

module.exports = {
  plugins: [
    esbuildDecorators({
      tsconfig: './apps/notification-service/tsconfig.app.json',
      cwd: process.cwd(),
    }),
  ],
};
