import Link from "next/link";

export default function Category({ posts=[] }) {
    const categories = Object.keys(posts)
    return (
        <div className="category-all">
            <ul className="category-list">
                {
                    categories.sort().map(category => (
                        <li className="category-list-item" key={category}>
                            <Link href={`/categories/${category}`}>
                                <a className="category-list-link">{category}</a>
                            </Link>
                            <span className="category-list-count">{posts[category].length}</span>
                        </li>)
                    )
                }

            </ul>
        </div>
    )
}