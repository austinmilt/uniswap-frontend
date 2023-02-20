import { render, screen } from "@testing-library/react";
import { usePagination } from "./usePagination";
import { useEffect } from "react";

describe('usePagination', () => {
    it('usePagination - initial values match expected', async () => {
        render(<Test />);
        expect(await screen.findByText("index=0")).toBeInTheDocument();
        expect(await screen.findByText("page=1")).toBeInTheDocument();
        expect(await screen.findByText("maxIndex=0")).toBeInTheDocument();
        expect(await screen.findByText("maxPage=1")).toBeInTheDocument();
    });

    it('usePagination - increasing page changes max values', async () => {
        render(<Test pageSequence={[1000]} />);
        expect(await screen.findByText("index=999")).toBeInTheDocument();
        expect(await screen.findByText("page=1000")).toBeInTheDocument();
        expect(await screen.findByText("maxIndex=999")).toBeInTheDocument();
        expect(await screen.findByText("maxPage=1000")).toBeInTheDocument();
    });

    it('usePagination - decreasing page after increasing keeps maxes', async () => {
        render(<Test pageSequence={[1000, 1]} />);
        expect(await screen.findByText("index=0")).toBeInTheDocument();
        expect(await screen.findByText("page=1")).toBeInTheDocument();
        expect(await screen.findByText("maxIndex=999")).toBeInTheDocument();
        expect(await screen.findByText("maxPage=1000")).toBeInTheDocument();
    });
});


function Test(props: { pageSequence?: number[] }): JSX.Element {
    const pagination = usePagination();

    useEffect(() => {
        if (props.pageSequence !== undefined) {
            for (const page of props.pageSequence) {
                pagination.set(page);
            }
        }
    }, [props.pageSequence])

    return <div>
        <div>
            {`index=${pagination.index}`}
        </div>
        <div>
            {`page=${pagination.page}`}
        </div>
        <div>
            {`maxIndex=${pagination.maxIndex}`}
        </div>
        <div>
            {`maxPage=${pagination.maxPage}`}
        </div>
    </div>
}
