import { Table } from '@mantine/core';
import { useMemo } from 'react';


interface Row {
    symbol: string;
    name: string;
    priceUSD: number;
    priceUSDChange24Hr: number;
    totalValueLockedUSD: number;
}

// TODO write gql query and use, including choosing the query type (TVL vs 24hr volume)
// TODO consider paginated table
const data: Row[] = [
    { symbol: "GUN", name: "Gunnel Money", totalValueLockedUSD: 100, priceUSD: 25, priceUSDChange24Hr: -1 },
    { symbol: "RUM", name: "Rummagers Coin", totalValueLockedUSD: 2500, priceUSD: 25, priceUSDChange24Hr: 10 },
    { symbol: "GEM", name: "Gemmmmmmm", totalValueLockedUSD: 93000, priceUSD: 1400, priceUSDChange24Hr: 0 },
];

// TODO column-sorted table https://ui.mantine.dev/component/table-sort

export function Tokens() {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Token</th>
                    <th>Price (USD)</th>
                    <th>Change (USD, 24hr)</th>
                    <th>TVL</th>
                </tr>
            </thead>
            <tbody>{data.map((row, i) => (
                <tr key={`${row.symbol}-${row.name}-${i}`}>
                    <td>{`${row.name} (${row.symbol})`}</td>
                    <td>${row.priceUSD.toFixed(2)}</td>
                    <td><PriceDelta changeUSD={row.priceUSDChange24Hr} /></td>
                    <td>${row.totalValueLockedUSD.toFixed(2)}</td>
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
        {changeSymbol} ${(Math.abs(props.changeUSD)).toFixed(2)}
    </>
}
