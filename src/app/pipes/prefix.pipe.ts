import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prefix'
})
export class PrefixPipe implements PipeTransform {
  transform(number: any, args?: any): any {
    function numDifferentiation(value:any) {
      const val = Math.abs(value)
      if (val >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`
      if (val >= 100000) return `${(value / 100000).toFixed(2)} L`
      if (val >= 1000) return `${(value / 1000).toFixed(2)} K`

      return value;
    }
    return numDifferentiation(number)}
  }