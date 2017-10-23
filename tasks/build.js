const Path     = require('path');
const Common   = require('./common');
const modules  = require('./modules');
const paths    = require('./paths');
const patterns = require('./patterns');

paths.modules = Path.resolve(__dirname, paths.modules);
paths.server  = Path.resolve(__dirname, paths.server);

let commands = [];

commands.push(Common.execute(`Compiling server`, `tsc -p ${paths.server}`));

for (let $module of modules)
{
    let source = Path.normalize(Path.join(paths.modules, $module.name));
    Common.cleanup(source, patterns.clean.include, patterns.clean.exclude);
    commands.push(Common.execute(`Compiling ${$module.name}`, `tsc -p ${source}`));
}

Promise.all(commands).then(() => console.log('\nDone!'));