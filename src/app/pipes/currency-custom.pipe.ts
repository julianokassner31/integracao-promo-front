import { getLocaleCurrencySymbol } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyCustom',
})
export class CurrencyCustomPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) public locale: string) {}

  transform(value: number): any {
    return (
      getLocaleCurrencySymbol(this.locale) +
      new Intl.NumberFormat(this.locale, {
        style: 'decimal',
        minimumFractionDigits: 2,
      }).format(value)
    );
  }
}
