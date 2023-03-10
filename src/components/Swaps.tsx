import { Anchor, Button, Group, Pagination, Stack, Table } from '@mantine/core';
import { Duration } from '../lib/duration';
import { formatToken, formatUSD } from '../lib/currency';
import { shortenAddress } from '../lib/address';
import { useLazyQuery } from '@apollo/client';
import { SwapsDocument, SwapsQuery } from '../graphql/queries/swaps.graphql.interface';
import { useEffect, useMemo } from 'react';
import { PaginationContext, usePagination } from '../lib/usePagination';
import { notifyError } from '../lib/notifications';
import { TableSkeleton } from './TableSkeleton';

//TODO env
const PAGE_SIZE: number = 12;

const COLUMNS: string[] = [
    "Swap",
    "Value (USD)",
    "Token Amount",
    "Token Amount",
    "Account(s)",
    "When"
]

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
// TODO hover address to see full

export function Swaps() {
    const pagination = usePagination();
    const swapsContext = useRecentSwaps(pagination);

    useEffect(() => {
        if (swapsContext.error !== undefined) {
            notifyError(
                "Swaps Issue",
                "We're having trouble loading recent swaps. Please refresh in a minute.",
                swapsContext.error
            );
        }
    }, [swapsContext.error]);

    return (
        <Stack>
            {swapsContext.loading && <TableSkeleton columns={COLUMNS} rows={PAGE_SIZE} data-testid="loading" />}
            {!swapsContext.loading && (<Stack align='center'>
                <Table striped>
                    <thead>
                        <tr>
                            {COLUMNS.map(c => <th key={c}>{c}</th>)}
                        </tr>
                    </thead>
                    <tbody>{swapsContext.data?.map(row => (
                        <tr key={row.transactionId}>
                            <td>{`${row.token0Symbol} ??? ${row.token1Symbol}`}</td>
                            <td>{formatUSD(row.valueUSD)}</td>
                            <td>{`${formatToken(row.token0Amount)} ${row.token0Symbol}`}</td>
                            <td>{`${formatToken(row.token1Amount)} ${row.token1Symbol}`}</td>
                            <td>
                                <Anchor href={`https://etherscan.io/tx/${row.transactionId}`}>
                                    {(row.sender === row.recipient) ?
                                        shortenAddress(row.sender) :
                                        `${shortenAddress(row.sender)} ??? ${shortenAddress(row.recipient)}`}
                                </Anchor>
                            </td>
                            <td>{timestampToElapsedString(row.timestamp)}</td>
                        </tr>
                    ))}</tbody>
                </Table>
                <Group>
                    <Pagination
                        page={pagination.page}
                        onChange={pagination.set}
                        total={pagination.maxPage + 1}
                    />
                    <Button onClick={() => swapsContext.refresh()}>???</Button>
                </Group>
            </Stack>)}
        </Stack>
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
}


function useRecentSwaps(pagination: PaginationContext): UseRecentSwapsContext {
    const [query, context] = useLazyQuery(SwapsDocument, {
        variables: {
            first: PAGE_SIZE,
        }
    });

    // initial load and page change
    useEffect(() => {
        query({ variables: { skip: PAGE_SIZE * pagination.index } });
    }, [pagination.index]);

    const data: UseRecentSwapsContext["data"] = useMemo(() => transformQueryResults(context.data), [context.data]);

    return {
        loading: context.loading,
        error: context.error,
        data: data,
        refresh: context.refetch,
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
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
