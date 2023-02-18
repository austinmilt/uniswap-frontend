import { Table } from '@mantine/core';
import { Duration } from '../lib/duration';
import { formatToken, formatUSD } from '../lib/currency';
import { shortenAddress } from '../lib/address';
import { useLazyQuery } from '@apollo/client';
import { SwapsDocument, SwapsQuery } from '../graphql/queries/swaps.graphql.interface';
import { useEffect, useMemo, useState } from 'react';

//TODO env
const PAGE_SIZE: number = 20;

interface Row {
    transactionId: string;
    token0Symbol: string;
    token1Symbol: string;
    token0Amount: number;
    token1Amount: number;
    valueUSD: number;
    sender: string;
    recipient: string;
    timestamp: Date;
}

// TODO column-sorted table https://ui.mantine.dev/component/table-sort
//TODO hover address to see full
//TODO pagination
//TODO loading state
//TODO errors

export function Swaps() {
    const swapsContext = useRecentSwaps();

    return (
        <Table>
            <thead>
                <tr>
                    <th>Swap</th>
                    <th>Value (USD)</th>
                    <th>Token Amount</th>
                    <th>Token Amount</th>
                    <th>Account(s)</th>
                    <th>When</th>
                </tr>
            </thead>
            <tbody>{swapsContext.data?.map(row => (
                <tr key={row.transactionId}>
                    <td>{`${row.token0Symbol} ↔ ${row.token1Symbol}`}</td>
                    <td>{formatUSD(row.valueUSD)}</td>
                    <td>{`${formatToken(row.token0Amount)} ${row.token0Symbol}`}</td>
                    <td>{`${formatToken(row.token1Amount)} ${row.token1Symbol}`}</td>
                    <td>{
                        (row.sender === row.recipient) ?
                            shortenAddress(row.sender) :
                            `${shortenAddress(row.sender)} ➝ ${shortenAddress(row.recipient)}`
                    }</td>
                    <td>{timestampToElapsedString(row.timestamp)}</td>
                </tr>
            ))}</tbody>
        </Table>
    );
}


function timestampToElapsedString(timestamp: Date): string {
    const elapsed: Duration = Duration.ofMilliseconds(new Date().getTime() - timestamp.getTime());
    const { days, hours, minutes, seconds } = elapsed.parts();
    if (days > 0) {
        return `${days} days ago`;

    } else if (hours > 0) {
        return `${hours} hours ago`;

    } else if (minutes > 0) {
        return `${minutes} minutes ago`;

    } else if (seconds > 0) {
        return `${seconds} seconds ago`

    } else {
        return `just now`
    }
}


interface UseRecentSwapsContext {
    data: Row[] | undefined;
    loading: boolean;
    error: Error | undefined;
    refresh: () => void;
    setPage: (page: number) => void;
}


function useRecentSwaps(): UseRecentSwapsContext {
    const [page, setPage] = useState<number>(0);
    const [query, context] = useLazyQuery(SwapsDocument, {
        variables: {
            first: PAGE_SIZE,
        }
    });

    // initial load and page change
    useEffect(() => {
        query({ variables: { skip: PAGE_SIZE * page } });
    }, [page]);

    const data: UseRecentSwapsContext["data"] = useMemo(() => transformQueryResults(context.data), [context.data]);

    return {
        loading: context.loading,
        error: context.error,
        data: data,
        refresh: context.refetch,
        setPage: setPage
    }
}


function transformQueryResults(data: SwapsQuery): Row[] | undefined {
    if (data === undefined) return undefined;
    return data.swaps.map(swap => ({
        transactionId: swap.id,
        token0Symbol: swap.token0.symbol,
        token1Symbol: swap.token1.symbol,
        token0Amount: Number.parseFloat(swap.amount0),
        token1Amount: Number.parseFloat(swap.amount1),
        valueUSD: Number.parseFloat(swap.amountUSD),
        sender: swap.sender,
        recipient: swap.recipient,
        // timestamps are in seconds since epoch
        timestamp: new Date(Number.parseInt(swap.timestamp) * 1000)
    }));
}
