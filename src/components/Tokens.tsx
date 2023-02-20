import { Pagination, Stack, Table, createStyles, Text, Group, Button } from '@mantine/core';
import { useEffect, useMemo } from 'react';
import { formatUSD } from '../lib/currency';
import { useLazyQuery } from '@apollo/client';
import { TokensDocument, TokensQuery } from '../graphql/queries/tokens.graphql.interface';
import { PaginationContext, usePagination } from '../lib/usePagination';
import { notifyError } from '../lib/notifications';
import { TableSkeleton } from './TableSkeleton';

//TODO env
const PAGE_SIZE: number = 12;

const COLUMNS: string[] = [
    "Token",
    "TVL",
    "Price (USD)",
    "Δ Price (USD, 24hr)"
];

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
        <Stack>
            {topTokensContext.loading && <TableSkeleton columns={COLUMNS} rows={PAGE_SIZE} data-testid="loading" />}
            {!topTokensContext.loading && (<Stack align='center'>
                <Table>
                    <thead>
                        <tr>
                            {COLUMNS.map(c => <th key={c}>{c}</th>)}
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
                <Group>
                    <Pagination
                        page={pagination.page}
                        onChange={pagination.set}
                        total={pagination.maxPage + 1}
                    />
                    <Button onClick={() => topTokensContext.refresh()}>⟳</Button>
                </Group>
            </Stack>)}
        </Stack>
    );
}


function PriceDelta(props: { changeUSD: number }): JSX.Element {
    const { classes } = useStyles();

    const changeSymbol: string = useMemo(() => {
        if (props.changeUSD < 0) return "🡮";
        else if (props.changeUSD === 0) return " ";
        else return "🡭";
    }, [props.changeUSD]);

    const styleClass: string | undefined = useMemo(() => {
        if (props.changeUSD < 0) return classes.priceDeltaDown;
        else if (props.changeUSD === 0) return undefined;
        else return classes.priceDeltaUp;
    }, [props.changeUSD, classes]);

    return <Text className={styleClass}>
        {changeSymbol} {(formatUSD(Math.abs(props.changeUSD)))}
    </Text>
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
        totalValueLockedUSD: Number.parseFloat(token.totalValueLockedUSD)
    })).sort((a, b) => b.totalValueLockedUSD - a.totalValueLockedUSD);
}


const useStyles = createStyles((theme) => ({
    priceDeltaUp: {
        color: theme.colors.green[5]
    },

    priceDeltaDown: {
        color: theme.colors.red[5]
    }
}))
