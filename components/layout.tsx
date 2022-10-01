import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import BackToTop from './BackToTop';

export const siteTitle = '赖同学';

interface LayoutProps {
    children: React.ReactNode;
    siteTitle?: string;
}

export default function Layout({ children, siteTitle }: LayoutProps) {
    const containerRel = useRef<HTMLDivElement>(null);

    const [percent, setPercent] = useState<number>(0);
    const [backTopOn, setBackTopOn] = useState<boolean>(false);

    const handleScroll = () => {
        const THRESHOLD = 50;
        if (containerRel.current) {
            const docHeight = containerRel.current.offsetHeight;
            const winHeight = global.window.innerHeight;
            const contentVisibilityHeight = docHeight > winHeight ? docHeight - winHeight : global.document.body.scrollHeight - winHeight;
            const scrollPercent = Math.min(100 * window.scrollY / contentVisibilityHeight, 100);
            const on = global.window.scrollY > THRESHOLD
            setBackTopOn(on)
            setPercent(scrollPercent && Math.round(scrollPercent) || 0)
        }
    }

    const handleBackToTop = () => {
        global.window.scroll({
            top: 0,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        global.window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => {
            global.window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <div className="container sidebar-position-left page-home" ref={containerRel}>
            <div className="headband" />
            <Header siteTitle={siteTitle} />
            <Main>{children}</Main>            
            <Footer />
            <BackToTop percent={percent} on={backTopOn} onClick={handleBackToTop} />
        </div>
    )
}