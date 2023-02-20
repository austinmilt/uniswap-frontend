import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { PoolsDocument } from '../graphql/queries/pools.graphql.interface';
import { Pools } from './Pools';

//TODO randomly generated data
const MOCKS = [
    {
        request: {
            query: PoolsDocument,
            variables: { first: 20, skip: 0, orderBy: "totalValueLockedUSD", orderDirection: "desc" }
        },
        result: {
            data: {
                pools: [
                    {
                        id: '1',
                        token0: {
                            symbol: "HEY",
                            name: "Hey Arnold"
                        },
                        token1: {
                            symbol: "ROCCO",
                            name: "ROCCO's Modern Life"
                        },
                        totalValueLockedUSD: "383983.20930982",
                        poolDayData: [
                            {
                                volumeUSD: "9820.222",
                            },
                            {
                                volumeUSD: "9821.222",
                            },
                        ]
                    },
                ],
            },
        },
    },
];

describe('TopPools', () => {
    it('render - includes pools with correct names', async () => {
        render(
            <MockedProvider mocks={MOCKS} addTypename={false}>
                <Pools />
            </MockedProvider>,
        );

        expect(await screen.findByTestId("loading")).toBeInTheDocument();
        expect(await screen.findByText('HEY ↔ ROCCO')).toBeInTheDocument();
    });

    it.skip('render - rows are sorted by TVL descending', async () => {
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
