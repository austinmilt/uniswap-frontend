import { Table } from '@mantine/core';

interface Row {
    token0: string;
    token1: string;
    totalValueLockedUSD: number;
    volume24HrUSD: number;
}

// TODO write gql query and use, including choosing the query type
// TODO consider paginated table
const data: Row[] = [
    { token0: "GUN", token1: "RUM", totalValueLockedUSD: 100, volume24HrUSD: 25 },
    { token0: "GEM", token1: "RUBY", totalValueLockedUSD: 25, volume24HrUSD: 105 },
    { token0: "LEMON", token1: "DEMON", totalValueLockedUSD: 1000, volume24HrUSD: 33 }
];

// TODO column-sorted table https://ui.mantine.dev/component/table-sort

export function Swaps() {
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
                <tr key={`${row.token0}-${row.token1}`}>
                    <td>{row.token0}-{row.token1}</td>
                    <td>${row.totalValueLockedUSD.toFixed(2)}</td>
                    <td>${row.volume24HrUSD.toFixed(2)}</td>
                </tr>
            ))}</tbody>
        </Table>
    );
}
