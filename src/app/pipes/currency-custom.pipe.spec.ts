import { CurrencyCustomPipe } from './currency-custom.pipe';

describe('CurrencyCustomPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencyCustomPipe();
    expect(pipe).toBeTruthy();
  });
});
