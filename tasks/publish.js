const FS       = require('fs');
const Path     = require('path');
const Common   = require('./common');
const modules  = require('./modules');
const paths    = require('./paths');
const patterns = require('./patterns');

paths.modules = Path.resolve(__dirname, paths.modules);

async function run()
{
    let token = FS.readFileSync(Path.normalize(`${process.env.USERPROFILE}/.npmrc`)).toString().replace('\n', '');

    let versionsFile = Path.resolve(__dirname, './versions.json')

    let versions = { };
    
    if (FS.existsSync(versionsFile))
        versions = require(versionsFile);
    
    let toPublish = [];
    
    modules.forEach(x => checkVersion(x));
    toPublish.forEach(x => checkDependencies(x));
    
    for (let $module of toPublish)
    {
        let source = Path.normalize(Path.join(paths.modules, $module.name));

        FS.writeFileSync(Path.resolve(source, 'package.json'), JSON.stringify($module, null, 4));

        Common.cleanup(source, patterns.clean.include, patterns.clean.exclude);
        await Common.execute(`Compiling ${source}`, `tsc -p ${source} --noEmit false --declaration true`);
        
        await Common.execute(`Publishing ${$module.name}:`, `npm set ${token} & cd ${source} && npm publish --access public`);
    }
    
    if (toPublish.length > 0)
        FS.writeFileSync(versionsFile, JSON.stringify(versions, null, 4));
    
    function checkVersion($module)
    {
        if(!versions[$module.name])
        {
            versions[$module.name] = $module.version;
            toPublish.push($module);
        }
        
        if(isUpdated($module))
        {
            toPublish.push($module);
            versions[$module.name] = $module.version;
        }
    }
    
    function checkDependencies($module)
    {
        for(let dependee of modules.filter(x => x.dependencies && !!x.dependencies[$module.name]))
        {
            if(toPublish.findIndex(x => x.name == dependee.name && x.dependencies[$module.name] == $module.version) == -1)
            {
                dependee.dependencies[$module.name] = $module.version;
                
                if (toPublish.findIndex(x => x.name == dependee.name) == -1)
                {
                    updateVersion(dependee);
                    
                    versions[dependee.name] = dependee.version;
                
                    toPublish.push(dependee);
                }

                checkDependencies(dependee);
            }
        }
    }

    function isUpdated($module)
    {
        let [targetMajor, targetMinor, targetRevision] = $module.version.split('.').map(x => Number.parseInt(x));
        let [storedMajor, storedMinor, storedRevision]  = versions[$module.name].split('.').map(x => Number.parseInt(x));

        return (targetMajor > storedMajor)
            || (targetMajor == storedMajor && targetMinor  > storedMinor)
            || (targetMajor == storedMajor && targetMinor == storedMinor && targetRevision > storedRevision);
    }

    function updateVersion($module)
    {
        let [major, minor, revision] = $module.version.split('.').map(x => Number.parseInt(x));
    
        revision++;
    
        $module.version = [major, minor, revision].join('.');
    }
}

run();