import Link from 'next/link';

export default function Category({ posts = [] }) {
  const categories = Object.keys(posts);
  return (
    <div className="category-all">
      <ul className="category-list">
        {categories.sort().map(category => (
          <li className="category-list-item" key={category}>
            <Link className="category-list-link" href={`/categories/${category}`}>
              {category}
            </Link>
            <span className="category-list-count">{posts[category]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
