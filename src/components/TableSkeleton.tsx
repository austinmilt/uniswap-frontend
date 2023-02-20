import { Skeleton, Table } from "@mantine/core";

export function TableSkeleton(props: { columns: string[], rows: number }): JSX.Element {
    return <Table>
        <thead>
            <tr>
                {props.columns.map(((c, i) => <th key={i}>{c}</th>))}
            </tr>
        </thead>
        <tbody>{Array(props.rows).fill(null).map((_, i) => (
            <tr key={`${i}`}>
                {props.columns.map((_) => (
                    <td><Skeleton height="1.5rem" /></td>
                ))}
            </tr>
        ))}</tbody>
    </Table>
}
