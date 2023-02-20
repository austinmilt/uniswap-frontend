import { Loader, LoadingOverlay, Pagination, Table } from '@mantine/core';
import { useEffect, useMemo } from 'react';
import { formatUSD } from '../lib/currency';
import { useLazyQuery } from '@apollo/client';
import { TokensDocument, TokensQuery } from '../graphql/queries/tokens.graphql.interface';
import { PaginationContext, usePagination } from '../lib/usePagination';
import { showNotification } from '@mantine/notifications';
import { notifyError } from '../lib/notifications';

//TODO env
const PAGE_SIZE: number = 20;

interface Row {
    symbol: string;
    name: string;
    priceUSD: number;
    priceUSDChange24Hr: number;
    totalValueLockedUSD: number;
}

// TODO column-sorted table https://ui.mantine.dev/component/table-sort

export function Tokens() {
    const pagination = usePagination();
    const topTokensContext = useTopTokens(pagination);

    useEffect(() => {
        if (topTokensContext.error !== undefined) {
            notifyError(
                "Tokens Issue",
                "We're having trouble loading top tokens. Please refresh in a minute.",
                topTokensContext.error
            );
        }
    }, [topTokensContext.error]);

    return (
        <>
            {topTokensContext.loading && <Loader data-testid="loading" />}
            {!topTokensContext.loading && (<>
                <Table>
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>TVL</th>
                            <th>Price (USD)</th>
                            <th>Δ Price (USD, 24hr)</th>
                        </tr>
                    </thead>
                    <tbody>{topTokensContext.data?.map((row, i) => (
                        <tr key={`${row.symbol}-${row.name}-${i}`}>
                            <td>{`${row.name} (${row.symbol})`}</td>
                            <td>{formatUSD(row.totalValueLockedUSD)}</td>
                            <td>{formatUSD(row.priceUSD)}</td>
                            <td><PriceDelta changeUSD={row.priceUSDChange24Hr} /></td>
                        </tr>
                    ))}</tbody>
                </Table>
                <Pagination
                    page={pagination.page}
                    onChange={pagination.set}
                    total={pagination.maxPage + 1}
                />
            </>)}
        </>
    );
}


function PriceDelta(props: { changeUSD: number }): JSX.Element {
    const changeSymbol: string = useMemo(() => {
        if (props.changeUSD < 0) return "🡮";
        else if (props.changeUSD === 0) return " ";
        else return "🡭";
    }, [props.changeUSD])

    //TODO change the color based on the direction
    return <>
        {changeSymbol} {(formatUSD(Math.abs(props.changeUSD)))}
    </>
}



interface UseRecentTokensContext {
    data: Row[] | undefined;
    loading: boolean;
    error: Error | undefined;
    refresh: () => void;
}


function useTopTokens(pagination: PaginationContext): UseRecentTokensContext {
    const [query, context] = useLazyQuery(TokensDocument, {
        variables: {
            first: PAGE_SIZE,
        }
    });

    // initial load and page change
    useEffect(() => {
        query({ variables: { skip: PAGE_SIZE * pagination.index } });
    }, [pagination.index]);

    const data: UseRecentTokensContext["data"] = useMemo(() => transformQueryResults(context.data), [context.data]);

    return {
        loading: context.loading,
        error: context.error,
        data: data,
        refresh: context.refetch,
    }
}


function transformQueryResults(data: TokensQuery): Row[] | undefined {
    if (data === undefined) return undefined;
    return data.tokens.map(token => ({
        symbol: token.symbol,
        name: token.name,
        priceUSD: Number.parseFloat(token.tokenDayData[0].priceUSD),
        priceUSDChange24Hr: Number.parseFloat(token.tokenDayData[0].priceUSD) - Number.parseFloat(token.tokenDayData[1].priceUSD),
        totalValueLockedUSD: token.totalValueLockedUSD
    }));
}
