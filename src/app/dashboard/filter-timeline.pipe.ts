import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTimeline'
})
export class FilterTimelinePipe implements PipeTransform {

  transform(value: string[], from:string): string[] {
    let arr = value;
    if(from)
      return arr.filter((e)=>e>from);
    return arr;
  }

}
