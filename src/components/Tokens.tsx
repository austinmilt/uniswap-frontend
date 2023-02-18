import { Table } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { formatUSD } from '../lib/currency';
import { useLazyQuery } from '@apollo/client';
import { TokensDocument, TokensQuery } from '../graphql/queries/tokens.graphql.interface';

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
// TODO loading
// TODO error state
// TODO pagination

export function Tokens() {
    const topTokensContext = useTopTokens();

    return (
        <Table>
            <thead>
                <tr>
                    <th>Token</th>
                    <th>TVL</th>
                    <th>Price (USD)</th>
                    <th>Change (USD, 24hr)</th>
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
    setPage: (page: number) => void;
}


function useTopTokens(): UseRecentTokensContext {
    const [page, setPage] = useState<number>(0);
    const [query, context] = useLazyQuery(TokensDocument, {
        variables: {
            first: PAGE_SIZE,
        }
    });

    // initial load and page change
    useEffect(() => {
        query({ variables: { skip: PAGE_SIZE * page } });
    }, [page]);

    const data: UseRecentTokensContext["data"] = useMemo(() => transformQueryResults(context.data), [context.data]);

    return {
        loading: context.loading,
        error: context.error,
        data: data,
        refresh: context.refetch,
        setPage: setPage
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
