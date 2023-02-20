import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { SwapsDocument } from '../graphql/queries/swaps.graphql.interface';
import { Swaps } from './Swaps';

//TODO randomly generated data
const MOCKS = [
    {
        request: {
            query: SwapsDocument,
            variables: { first: 20, skip: 0, orderBy: "timestamp", orderDirection: "desc" }
        },
        result: {
            data: {
                swaps: [
                    {
                        id: '1',
                        timestamp: Math.floor(new Date().getTime() / 1000),
                        amount0: "1234.5678",
                        amount1: "5678.91",
                        amountUSD: "1112.1314",
                        sender: "abcdef",
                        recipient: "ghijk",
                        token0: {
                            symbol: "ANGRY",
                            name: "Angry Beavers"
                        },
                        token1: {
                            symbol: "CDOG",
                            name: "Cat Dog"
                        },
                    },
                ],
            },
        },
    },
];

describe('Recent Swaps', () => {
    it('render - includes swaps with correct names', async () => {
        render(
            <MockedProvider mocks={MOCKS} addTypename={false}>
                <Swaps />
            </MockedProvider>,
        );

        expect(await screen.findByTestId("loading")).toBeInTheDocument();
        expect(await screen.findByText('ANGRY ↔ CDOG')).toBeInTheDocument();
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
});
