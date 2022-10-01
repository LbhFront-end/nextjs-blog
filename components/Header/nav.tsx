import Link from 'next/link';

type NavType = {
    key: string;
    title: string;
    icon: string;
    link?: string;
}

interface NavProps {
    items: NavType[]
}
export default function Nav ({ items }: NavProps){
    return (
        <nav className="site-nav">
            <ul id="menu" className="menu">
                {
                    items.map(nav => (
                        <li key={nav.key} className='menu-item' >
                            {
                                nav.link ? (
                                    <Link href={nav.link} rel="section">
                                        <a>
                                            <i className={`menu-item-icon fa fa-fw ${nav.icon}`}></i> <br />
                                            {nav.title}
                                        </a>
                                    </Link>
                                ) : (
                                    <a onClick={() => { }} className='menu-item-search'>
                                        <i className={`menu-item-icon fa fa-fw ${nav.icon}`}></i> <br />
                                        {nav.title}
                                    </a>
                                )
                            }
                        </li>
                    ))
                }
            </ul>
        </nav>
    )
}