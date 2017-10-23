const FS    = require('fs');
const Path  = require('path');
const paths = require('./paths');

let surface = Path.resolve(__dirname, Path.join(paths.modules, '@surface'));

let modules = FS.readdirSync(surface).map(x => require(Path.join(surface, x, 'package.json')));

module.exports = modules;