import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) {
      return '';
    }

    const date = new Date(value); // Parse the input date
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone:'UTC'
    };

    // Format date using Intl API and append (IST)
    return `${new Intl.DateTimeFormat('en-US', options).format(date)} `;
  }
}
