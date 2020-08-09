import { Directive } from '@angular/core';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';

@Directive({
  selector: '[appMap]'
})
export class MapDirective {

  constructor(leafletDirective: LeafletDirective) { }

}
