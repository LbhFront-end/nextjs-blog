import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";

export interface Pagination {
    total: number;
    size: number;
    page?: number;
}

export interface PaginationProps {
    pagination: Pagination
}

export default function Pagination({ pagination: { total, page } }: PaginationProps) {
    const [activeKey, setActiveKey] = useState<number>(page)
    console.log(page)
    const pageIntoArray = Array.from(Array(total).keys())
    return (
        <nav className="pagination">
            {
                page !== 0 && (
                    <Link href={`/page/${page - 1}`}>
                        <a className="extend prev" rel="prev" >
                            <i className="fa fa-angle-left" />
                        </a>
                    </Link>
                )
            }

            {
                pageIntoArray.map(item => (
                    <Link href={item === 0 ? '/' : `/page/${item}`} key={item}>
                        <span
                            onClick={() => setActiveKey(item)}
                            className={classNames("page-number", { "current": item === activeKey })}>
                            {item + 1}
                        </span>
                    </Link>

                ))
            }
            {/* <span className="space">…</span> */}
            {
                page !== pageIntoArray.length && (
                    <Link href={`/page/${page + 1}`}>
                        <a className="extend next" rel="next" >
                            <i className="fa fa-angle-right" />
                        </a>
                    </Link>
                )
            }
        </nav>
    )
}
