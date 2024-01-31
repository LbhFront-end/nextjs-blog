import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';

export interface Pagination {
  total: number;
  size: number;
  page?: number;
}

export interface PaginationProps {
  pagination: Pagination;
  prefix?: string;
}

export default function Pagination({ pagination, prefix }: PaginationProps) {
  const { total, page } = pagination || { total: 0, page: 0 };
  const prefixLink = prefix ? `/${prefix}` : ``;
  const [activeKey, setActiveKey] = useState<number>(page);
  const pageIntoArray = Array.from(Array(total).keys());
  const Space = () => <span className="space">…</span>;
  return (
    total > 1 && (
      <nav className="pagination">
        {page !== 1 && (
          <Link className="extend prev" rel="prev" href={`${prefixLink}/page/${page - 1}`}>
            <i className="fa fa-angle-left" />
          </Link>
        )}
        <Link
          className={classNames('page-number', {
            current: 1 === activeKey
          })}
          href={`${prefixLink}/`}
          key="start"
        >
          <span onClick={() => setActiveKey(1)}>1</span>
        </Link>
        {page > 3 && <Space />}
        {[...new Set([page - 1, page, page + 1])]
          .filter(item => item > 1 && item < total)
          .map(item => (
            <Link
              className={classNames('page-number', {
                current: item === activeKey
              })}
              href={`${prefixLink}/page/${item}`}
              key={item}
            >
              <span onClick={() => setActiveKey(item)}>{item}</span>
            </Link>
          ))}
        {page + 3 > total ? null : <Space />}
        <Link
          className={classNames('page-number', {
            current: total === activeKey
          })}
          href={`${prefixLink}/page/${total}`}
          key="end"
        >
          <span onClick={() => setActiveKey(total)}>{total}</span>
        </Link>
        {page !== pageIntoArray.length && (
          <Link className="extend next" rel="next" href={`${prefixLink}/page/${page + 1}`}>
            <i className="fa fa-angle-right" />
          </Link>
        )}
      </nav>
    )
  );
}
