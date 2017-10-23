import { CustomElement } from '@surface/custom-element';
import { component }     from '@surface/custom-element/decorators';

import template from 'index.html';

@component('home-view', template)
export class Home extends CustomElement
{ }