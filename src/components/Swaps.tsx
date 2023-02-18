import { Table } from '@mantine/core';
import { Duration } from '../lib/duration';

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

// TODO write gql query and use, including choosing the query type
// TODO paginated query
const data: Row[] = [
    { transactionId: "0", token0Symbol: "RUM", token1Symbol: "GUN", token0Amount: 5, token1Amount: 6, valueUSD: 35, sender: "0xlakjsldkj", recipient: "0xlakjsldkj", timestamp: new Date(new Date().getTime() - Duration.ofMilliseconds(30).asMilliseconds()) },
    { transactionId: "1", token0Symbol: "GEM", token1Symbol: "RUBY", token0Amount: 51, token1Amount: 61, valueUSD: 351, sender: "0xlakcjsldkj", recipient: "0xlaakjdlkdj", timestamp: new Date(new Date().getTime() - Duration.ofSeconds(30).asMilliseconds()) },
    { transactionId: "2", token0Symbol: "LAVA", token1Symbol: "GUAVA", token0Amount: 52, token1Amount: 62, valueUSD: 352, sender: "0xlakj3sldkj", recipient: "0xlakjd3lkdj", timestamp: new Date(new Date().getTime() - Duration.ofMinutes(30).asMilliseconds()) },
    { transactionId: "3", token0Symbol: "LEMON", token1Symbol: "DEMON", token0Amount: 54, token1Amount: 64, valueUSD: 354, sender: "0xlakjsl5dkj", recipient: "0xl5akjdlkdj", timestamp: new Date(new Date().getTime() - Duration.ofDays(30).asMilliseconds()) }
];

// TODO column-sorted table https://ui.mantine.dev/component/table-sort

export function Swaps() {
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
            <tbody>{data.map(row => (
                <tr key={row.transactionId}>
                    <td>{`${row.token0Symbol} ↔ ${row.token1Symbol}`}</td>
                    <td>{row.valueUSD.toFixed(2)}</td>
                    <td>{`${row.token0Amount} ${row.token0Symbol}`}</td>
                    <td>{`${row.token1Amount} ${row.token1Symbol}`}</td>
                    <td>{
                        (row.sender === row.recipient) ?
                            row.sender :
                            `${row.sender} > ${row.recipient}`
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
