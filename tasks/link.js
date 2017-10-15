const FS      = require('fs');
const Path    = require('path');
const Common  = require('./common');
const modules = require('./modules');

let action = process.argv[2];

let root   = Path.resolve(__dirname, '../Surface/source');
let client = Path.resolve(__dirname, '../App.Client');

if (action == 'l' || action == 'link')
{
    link();
}
else if (action == 'u' || action == 'unlink')
{
    unlink();
}
else if (action == 'r' || action == 'relink')
{
    relink();
}

async function link()
{
    for (let $module of modules)
    {
        for (let dependence of Common.objectToDictionary($module.dependencies).filter(x => x.key.startsWith('@surface/')))
        {
            let source = Path.normalize(Path.join(root, dependence.key));
            let target = Path.normalize(Path.join(root, $module.name, 'node_modules'));

            Common.makeDir(Path.join(target, '@surface'));

            target = Path.normalize(Path.join(target, dependence.key));

            if (!FS.existsSync(target))
                await Common.execute(`Linking ${$module.name} dependence[${dependence.key}]:`, `mklink /J ${target} ${source}`);
        }
    }
        
    if (!FS.existsSync(Path.join(client, 'node_modules', '@surface')))
        await Common.execute(`Linking @surface on client:`, `mklink /J ${Path.join(client, 'node_modules', '@surface')} ${Path.join(root, '@surface')}`);

    console.log('Linking done!');
}

async function unlink()
{
    for (let $module of modules)
    {
        let targetFolder = Path.normalize(Path.join(root, $module.name, 'node_modules', '@surface'));

        if (FS.existsSync(targetFolder))
            await Common.execute(`Removing @surface on ${$module.name}:`, `rmdir /s /q ${targetFolder}`);
    }

    if (FS.existsSync(Path.join(client, 'node_modules', '@surface')))
        await Common.execute(`Unlinking @surface link on client:`, `rmdir /s /q ${Path.join(client, 'node_modules', '@surface')}`);

    console.log('Unlinking done!');
}

async function relink()
{
    await unlink();
    await link();
}