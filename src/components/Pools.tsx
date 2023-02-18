import { Table } from '@mantine/core';

interface Row {
    token0Symbol: string;
    token1Symbol: string;
    totalValueLockedUSD: number;
    volume24HrUSD: number;
}

// TODO write gql query and use, including choosing the query type (TVL vs 24hr volume)
// TODO consider paginated table
const data: Row[] = [
    { token0Symbol: "GUN", token1Symbol: "RUM", totalValueLockedUSD: 100, volume24HrUSD: 25 },
    { token0Symbol: "GEM", token1Symbol: "RUBY", totalValueLockedUSD: 25, volume24HrUSD: 105 },
    { token0Symbol: "LEMON", token1Symbol: "DEMON", totalValueLockedUSD: 1000, volume24HrUSD: 33 }
];

// TODO column-sorted table https://ui.mantine.dev/component/table-sort
// TODO column tooltips?
export function Pools() {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Pool</th>
                    <th>TVL (USD)</th>
                    <th>Volume (24hr)</th>
                </tr>
            </thead>
            <tbody>{data.map(row => (
                <tr key={`${row.token0Symbol}-${row.token1Symbol}`}>
                    <td>{row.token0Symbol}-{row.token1Symbol}</td>
                    <td>${row.totalValueLockedUSD.toFixed(2)}</td>
                    <td>${row.volume24HrUSD.toFixed(2)}</td>
                </tr>
            ))}</tbody>
        </Table>
    );
}
