import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";

export interface Pagination {
  total: number;
  size: number;
  page?: number;
}

export interface PaginationProps {
  pagination: Pagination;
}

export default function Pagination({
  pagination: { total, page },
}: PaginationProps) {
  const [activeKey, setActiveKey] = useState<number>(page);
  const pageIntoArray = Array.from(Array(total).keys());
  const Space = () => <span className="space">…</span>;
  return (
    <nav className="pagination">
      {page !== 0 && (
        <Link href={`/page/${page - 1}`}>
          <a className="extend prev" rel="prev">
            <i className="fa fa-angle-left" />
          </a>
        </Link>
      )}
      <Link href="/" key="start">
        <span
          onClick={() => setActiveKey(1)}
          className={classNames("page-number", {
            current: 1 === activeKey,
          })}
        >
          1
        </span>
      </Link>
      {page > 3 && <Space />}
      {[...new Set([page - 1, page, page + 1])]
        .filter((item) => item > 1 && item < total)
        .map((item) => (
          <Link href={`/page/${item}`} key={item}>
            <span
              onClick={() => setActiveKey(item)}
              className={classNames("page-number", {
                current: item === activeKey,
              })}
            >
              {item}
            </span>
          </Link>
        ))}
      {page + 3 > total ? null : <Space />}
      <Link href={`/page/${total}`} key="end">
        <span
          onClick={() => setActiveKey(total)}
          className={classNames("page-number", {
            current: total === activeKey,
          })}
        >
          {total}
        </span>
      </Link>
      {/* <span className="space">…</span> */}
      {page !== pageIntoArray.length && (
        <Link href={`/page/${page + 1}`}>
          <a className="extend next" rel="next">
            <i className="fa fa-angle-right" />
          </a>
        </Link>
      )}
    </nav>
  );
}
