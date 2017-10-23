import { CustomElement } from '@surface/custom-element';
import { component }     from '@surface/custom-element/decorators';
import { Router }        from '@surface/router';

import lazyLoader from '@surface/lazy-loader';

import template from "index.html";
import style    from "index.scss";

@component<App>('app-root', template, style)
export class App extends CustomElement
{
    private router: Router;
    public constructor()
    {
        super();        
        this.router = new Router().when('/*', this.setView);

        this.router.routeTo(window.location);
    }
    
    public async setView(path: Router.Path)
    {
        console.log(path);
        await lazyLoader(path.root);
    }
}