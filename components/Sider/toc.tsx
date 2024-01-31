import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { getTreeIds, TreeData } from 'utils';

interface TOCProps {
  items: TreeData[];
}

export default function TOC({ items }: TOCProps) {
  const [activeKey, setActiveKey] = useState<number>(1);
  const [keys, setKeys] = useState<number[]>([]);
  const handleActiveKey = (e, id) => {
    const keys = getTreeIds(items, id, undefined);
    setKeys(keys);
    e.stopPropagation();
    setActiveKey(id);
  };

  const renderSiderItem = (dataSource: TreeData[]) => {
    return dataSource.map((data, index) => (
      <li
        key={data.id}
        className={classNames(
          `nav-item nav-level-${data.level}`,
          { active: keys.includes(data.id) },
          { 'active-current': data.id === activeKey }
        )}
        onClick={e => handleActiveKey(e, data.id)}
      >
        <a className="nav-link" href={`#${data.content}`}>
          <span className="nav-number">{index + 1}.</span>
          <span className="nav-text">{data.content}</span>
        </a>
        {data.children && <ol className="nav-child">{renderSiderItem(data.children)}</ol>}
      </li>
    ));
  };

  useEffect(() => {
    const listener = () => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id');
          const elem = document.querySelector(`.nav li a[href="#${id}"]`);
          const activeId = Number(entry.target.children[0].id);
          if (entry.intersectionRatio > 0) {
            const keys = getTreeIds(items, activeId, undefined);
            if (elem && elem.parentElement && activeId) {
              setKeys(keys);
              setActiveKey(activeId);
            }
          }
        });
      });
      document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(elem => {
        observer.observe(elem);
      });
    };
    listener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);

  return (
    <section className="post-toc-wrap motion-element sidebar-panel sidebar-panel-active">
      <div className="post-toc">
        <div className="post-toc-content">
          <ol className="nav">{renderSiderItem(items)}</ol>
        </div>
      </div>
    </section>
  );
}
