import { formatToken, formatUSD } from "./currency";

//TODO random data

describe('Currency Utilities', () => {
    it('formatUSD - negative - returns with leading minus', async () => {
        expect(formatUSD(-1.23456).charAt(0)).toStrictEqual("-");
    });

    it('formatUSD - zero - returns with trailing zeros', async () => {
        expect(formatUSD(0)).toStrictEqual("$0.00");
    });

    it('formatUSD - positive and small - returns with full value', async () => {
        expect(formatUSD(1.23456)).toStrictEqual("$1.23");
    });

    it('formatUSD - positive and large - returns with compact value', async () => {
        expect(formatUSD(1234567890)).toStrictEqual("$1.23B");
    });


    it('formatToken - negative - returns with leading minus', async () => {
        expect(formatToken(-1.23456).charAt(0)).toStrictEqual("-");
    });

    it('formatToken - zero - returns without trailing zeros', async () => {
        expect(formatToken(0)).toStrictEqual("0");
    });

    it('formatToken - positive and small - returns with full value', async () => {
        expect(formatToken(1.23456)).toStrictEqual("1.23");
    });

    it('formatToken - positive and large - returns with compact value', async () => {
        expect(formatToken(1234567890)).toStrictEqual("1.23B");
    });
});
