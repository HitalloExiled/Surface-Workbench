import HTTP            = require('http');
import Path            = require('path');
import FS              = require('fs');
import ServerVariables = require('./server-variables');

export type RoutePath = { route: string, routePaths: RoutePath[] };

export function loadFile(response: HTTP.ServerResponse, path: string): void
{
    try
    {
        let extension = Path.extname(path);
        let data      = FS.readFileSync(path);

        response.writeHead(200, { "Content-Type": ServerVariables.mymeType[extension] });
        response.write(data);
        response.end();
    }
    catch (error)
    {
        throw error;
    }
}

export function resolveUrl(root: string, url: string, defaultRoute: string): string|null|undefined
{
    url          = url.replace(/^\//, "")          || '';
    defaultRoute = defaultRoute.replace(/^\//, "") || '';
    
    let targets =
    [
        Path.resolve(root, url),
        Path.resolve(root, url, 'index.html'),
        Path.resolve(root, url, 'index.htm'),
        Path.resolve(root, url, 'default.html'),
        Path.resolve(root, url, 'default.htm'),
        Path.resolve(root, url + '.html'),
        Path.resolve(root, url + '.htm'),
        Path.resolve(root, defaultRoute),
        Path.resolve(root, defaultRoute, 'index.html'),
        Path.resolve(root, defaultRoute, 'index.htm'),
        Path.resolve(root, defaultRoute, 'default.html'),
        Path.resolve(root, defaultRoute, 'default.htm'),
        Path.resolve(root, defaultRoute + '.html'),
        Path.resolve(root, defaultRoute + '.htm'),
    ];

    return targets.filter(x => FS.existsSync(x) && FS.lstatSync(x).isFile())[0];
}

export function resolveRoutePaths(routePath: RoutePath): RoutePath
{
    let tmp: { [key: string]: string[] } = { };

    for (let i = 0; i < routePath.routePaths.length; i++)
    {
        let segments = routePath.routePaths[i].route.split('/');

        for (let ii = 0; ii < segments.length; ii++)
        {
            let segment = segments[ii];

            tmp[segment] = tmp[segment] || [];

            if (ii + 1 < segments.length)
                tmp[segment].push(segments.splice(ii + 1, segments.length).join('/'))
        }
    }

    routePath.routePaths = Object.keys(tmp)
        .map
        (
            x => resolveRoutePaths
            (
                {
                    route: x,
                    routePaths: tmp[x].map(y => ({ route: y, routePaths: [] }) as RoutePath)
                } as RoutePath
            )
        );

    return routePath;
}

export function normalize(routePath: RoutePath): void
{
    if (routePath.routePaths.length == 1)
    {
        routePath.route      = routePath.route + '/' + routePath.routePaths[0].route;
        routePath.routePaths = routePath.routePaths[0].routePaths;
    }
    else
    {
        for (let subpath of routePath.routePaths)
        {
            normalize(subpath);
        }
    }
}