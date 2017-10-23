import Path = require('path');

export = class ServerConfiguration
{
    private _defaultRoute : string;
    public get defaultRoute() : string
    {
        return this._defaultRoute;
    }
    
    public set defaultRoute(value : string)
    {
        this._defaultRoute = value;
    }
    
    private _port : number;
    public get port() : number
    {
        return this._port;
    }
    
    public set port(value : number)
    {
        this._port = value;
    }

    private _notFound: string;
    public get notFound(): string {
        return this._notFound
    }
    
    public set notFound(value: string)
    {
        this._notFound = value;
    }

    private _wwwRoot: string;
    public get wwwRoot(): string
    {
        return this._wwwRoot
    }
    
    public set wwwRoot(value: string)
    {
        this._wwwRoot = value;
    }

    public constructor(root: string, config: Partial<ServerConfiguration>)
    {
        this.defaultRoute = config.defaultRoute || '/';
        this.port         = config.port         || 1337;
        this.notFound     = config.notFound     || '/not-found';

        this.wwwRoot = config.wwwRoot && Path.resolve(root, config.wwwRoot) || '/wwwRoot';
    }
}