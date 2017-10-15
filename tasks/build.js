const Path     = require('path');
const Common   = require('./common');
const modules  = require('./modules');
const patterns = require('./patterns');

let root = Path.resolve(__dirname, '../Surface/source');

let commands = [];

commands.push(Common.execute(`Compiling server`, `tsc -p ${Path.resolve(__dirname, '../App.Server/start')}`));

for (let $module of modules)
{
    let source = Path.normalize(Path.join(root, $module.name));
    Common.cleanup(source, patterns.clean.include, patterns.clean.exclude);
    commands.push(Common.execute(`Compiling ${$module.name}`, `tsc -p ${source}`));
}

Promise.all(commands).then(() => console.log('\nDone!'));