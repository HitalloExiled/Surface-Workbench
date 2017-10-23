const Path    = require('path');
const Common  = require('./common');
const modules = require('./modules');
const paths   = require('./paths');

paths.modules = Path.resolve(__dirname, Path.join(paths.modules));
paths.client  = Path.resolve(__dirname, Path.join(paths.client));
paths.server  = Path.resolve(__dirname, Path.join(paths.server));

let commands = [];

for (let $module of modules)
{
    let source = Path.normalize(Path.join(paths.modules, $module.name));
    commands.push(Common.execute(`Installing ${$module.name}`, `cd ${source} && npm install`));
}

Promise.all(commands).then
(
    () => Promise.all
    (
        [
            Common.execute(`Installing Client`, `cd ${paths.client} && npm install`),
            Common.execute(`Installing Server`, `cd ${paths.server} && npm install`)
        ]
    )
    .then(() =>console.log('\nDone!'))
);