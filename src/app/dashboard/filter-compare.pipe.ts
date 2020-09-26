import { Pipe, PipeTransform } from '@angular/core';
import { SubCategoryModel } from 'src/models/subCategoryModel';

@Pipe({
  name: 'filterCompare'
})
export class FilterComparePipe implements PipeTransform {

  transform(value: SubCategoryModel[], remove: string): SubCategoryModel[] {
    let arr= value
    if(remove)
      return arr.filter((e)=>e.id!=remove);
    return arr;
  }
}
