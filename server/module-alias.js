const moduleAlias = require("module-alias");
const path = require("path");

moduleAlias.addAliases({
  utils: path.resolve(__dirname, "dist/utils"),
  // Add other aliases as needed
});
