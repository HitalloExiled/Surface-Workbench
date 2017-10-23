const Path     = require('path');
const Common   = require('./common');
const modules  = require('./modules');
const paths    = require('./paths');
const patterns = require('./patterns');

paths.modules = Path.resolve(__dirname, Path.join(paths.modules));

for (let $module of modules)
{
    let source = Path.normalize(Path.join(paths.modules, $module.name));
    console.log(`Cleaning ${$module.name}`);
    Common.cleanup(source, patterns.clean.include, patterns.clean.exclude);
}