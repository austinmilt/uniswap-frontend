import { shortenAddress } from "./address";

//TODO random data

describe('Address Utilities', () => {
    it('shortenAddress - address under threshold - doesnt shorten', async () => {
        expect(shortenAddress("abcdef", 2, 6)).toStrictEqual("abcdef")
    });

    it('shortenAddress - address over threshold - shortens', async () => {
        expect(shortenAddress("abcdefg", 2, 6)).toStrictEqual("ab...")
    });

    it('shortenAddress - shorten length is 0 - doesnt throw', async () => {
        shortenAddress("abcdef", 0, 5);
    });

    it('shortenAddress - threshold length is 0 - doesnt throw', async () => {
        shortenAddress("abcdef", 3, 0);
    });

    it('shortenAddress - invalid length args - throws', async () => {
        expect(() => shortenAddress("abcdefg", -1, 5)).toThrow();
        expect(() => shortenAddress("abcdefg", 5, -5)).toThrow();
    });
});
