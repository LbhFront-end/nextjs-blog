import Link from 'next/link';

interface BrandProps {
    siteTitle: string;
}
export default function Brand({ siteTitle }: BrandProps) {
    return (
        <div className="site-brand-wrapper">
            <div className="site-meta">
                <div className="custom-logo-site-title">
                    <Link href="/">
                        <a className="brand" rel="start">
                            <span className="logo-line-before"><i className=""></i></span>
                            <span className="site-title">{siteTitle}</span>
                            <span className="logo-line-after"><i className=""></i></span>
                        </a>
                    </Link>
                </div>
                <h1 className="site-subtitle" itemProp="description" ></h1>
            </div>
            <div className="site-nav-toggle">
                <button>
                    <span className="btn-bar"></span>
                    <span className="btn-bar"></span>
                    <span className="btn-bar"></span>
                </button>
            </div>
        </div>
    )
}