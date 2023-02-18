import { useLazyQuery } from '@apollo/client';
import { Table } from '@mantine/core';
import { PoolsDocument, PoolsQuery } from '../graphql/queries/pools.graphql.interface';
import { useEffect, useMemo } from 'react';
import { formatUSD } from '../lib/currency';

//TODO env
const TOP_POOLS_SIZE: number = 20;

interface Row {
    token0Symbol: string;
    token1Symbol: string;
    totalValueLockedUSD: number;
    volume24HrUSD: number;
}

// TODO consider paginated table
// TODO column-sorted table https://ui.mantine.dev/component/table-sort
// TODO column tooltips?
// TODO loading state
export function Pools() {
    const topPools = useTopPools();

    return (
        <Table>
            <thead>
                <tr>
                    <th>Pool</th>
                    <th>TVL (USD)</th>
                    <th>Volume (24hr)</th>
                </tr>
            </thead>
            <tbody>{topPools.data?.map(row => (
                <tr key={`${row.token0Symbol}-${row.token1Symbol}`}>
                    <td>{row.token0Symbol} ↔ {row.token1Symbol}</td>
                    <td>{formatUSD(row.totalValueLockedUSD)}</td>
                    <td>{formatUSD(row.volume24HrUSD)}</td>
                </tr>
            ))}</tbody>
        </Table>
    );
}

interface UseTopPoolsContext {
    data: Row[] | undefined;
    loading: boolean;
    error: Error | undefined;
    refresh: () => void;
}

function useTopPools(): UseTopPoolsContext {
    const [query, context] = useLazyQuery(PoolsDocument, {
        variables: {
            first: TOP_POOLS_SIZE
        }
    });

    // initial load
    useEffect(() => {
        query();
    }, []);

    const data: UseTopPoolsContext["data"] = useMemo(() => transformQueryResults(context.data), [context.data]);

    return {
        loading: context.loading,
        error: context.error,
        data: data,
        refresh: context.refetch
    }
}


function transformQueryResults(data: PoolsQuery): Row[] | undefined {
    if (data === undefined) return undefined;
    return data.pools.map(pool => ({
        token0Symbol: pool.token0.symbol,
        token1Symbol: pool.token1.symbol,
        totalValueLockedUSD: Number.parseFloat(pool.totalValueLockedUSD),
        volume24HrUSD: computeVolumeChange(pool.poolDayData)
    }));
}


//TODO better graphql typings
function computeVolumeChange(data: { volumeUSD: string }[]): number {
    if (data.length < 2) return 0;
    return Number.parseFloat(data[1].volumeUSD) - Number.parseFloat(data[0].volumeUSD);
}
