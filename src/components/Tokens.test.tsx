import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Duration } from '../lib/duration';
import { Tokens } from './Tokens';
import { TokensDocument } from '../graphql/queries/tokens.graphql.interface';

//TODO randomly generated data
const MOCKS = [
    {
        request: {
            query: TokensDocument,
            variables: { first: 20, skip: 0, orderBy: "totalValueLockedUSD", orderDirection: "desc" }
        },
        result: {
            data: {
                tokens: [
                    {
                        id: '1',
                        name: "Rugrats",
                        symbol: "RRAT",
                        totalValueLocked: "1234.09389",
                        totalValueLockedUSD: "92230.293029",
                        tokenDayData: [
                            {
                                priceUSD: "23.223",
                                date: Math.floor(new Date().getTime() / 1000)
                            },
                            {
                                priceUSD: "22.223",
                                date: Math.floor((new Date().getTime() - Duration.ofDays(1).asMilliseconds()) / 1000)
                            },
                        ]
                    },
                ],
            },
        },
    },
];

describe('Top TOkens', () => {
    it('render - includes tokens with correct names', async () => {
        render(
            <MockedProvider mocks={MOCKS} addTypename={false}>
                <Tokens />
            </MockedProvider>,
        );

        expect(await screen.findByTestId("loading")).toBeInTheDocument();
        expect(await screen.findByText('Rugrats (RRAT)')).toBeInTheDocument();
    });

    it.skip('render - rows are sorted by most recent timestamp', async () => {
        fail("TODO");
    });

    it.skip('render - multiple pages - able to navigate to next page', async () => {
        fail("TODO");
    });

    it.skip('render - multiple pages - able to navigate to previous page', async () => {
        fail("TODO");
    });

    it.skip('render - refresh - refreshes with new data', async () => {
        fail("TODO");
    });

    it.skip('render - calculates price change correctly', async () => {
        fail("TODO");
    });
});
