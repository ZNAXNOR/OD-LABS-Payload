
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  if (id.endsWith('.css') || id.endsWith('.scss') || id.endsWith('.sass')) {
    return {};
  }
  return originalRequire.apply(this, arguments);
};
