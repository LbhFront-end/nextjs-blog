import Script from 'next/script'
import { useEffect, useRef, useState } from 'react';

const timingTime = () => {
    let start = '2018-1-29 09:47:04';
    let startTime = new Date(start).getTime();
    let currentTime = new Date().getTime();
    let difference = currentTime - startTime;
    const m = Math.floor(difference / (1000));
    let mm = m % 60; // 秒
    let f = Math.floor(m / 60);
    let ff = f % 60; // 分钟
    let s = Math.floor(f / 60);
    let ss = s % 60; // 小时
    let day = Math.floor(s / 24); // 天数
    return {
        timeDate: `${day} 天`,
        times: `${ss} 小时 ${ff} 分 ${mm} 秒`,
    }
}

interface FooterProps {
    totalWords: string;
}

export default function Footer({ totalWords }: FooterProps) {
    const [date, setDate] = useState({
        timeDate: '载入天数...',
        times: '载入时分秒...',
    });
    const timer = useRef(null);

    useEffect(() => {
        timer.current = setInterval(() => {
            const date = timingTime()
            setDate(date)
        }, 1000)
        return () => {
            clearInterval(timer.current)
        }
    }, [])

    return (
        <footer className='footer'>
            <div className='footer-inner'>
                <div className='copyright'>© 2018 — <span itemProp="copyrightYear">{new Date().getFullYear()}</span>
                    <span className="with-love">
                        <i className="fa fa-heart throb heart" />
                    </span>
                    <span className="author" itemProp="copyrightHolder">赖彬鸿</span>
                </div>
                <div>
                    <span id="busuanzi_container_site_pv" title="访问量">
                        <i className="fa fa fa-eye" />
                        <span id="busuanzi_value_site_pv" />
                    </span>
                    <span id="busuanzi_container_site_uv" title="访问人数">
                        <i className="fa fa-user" />
                        <span id="busuanzi_value_site_uv" />
                    </span>
                    <span className="post-count" title="博客总字数">
                        <i className="fa fa-pagelines" aria-hidden="true" />
                        {totalWords}
                    </span>
                </div>
                <div>
                    <span>
                        <i className="fa fa-shield" aria-hidden="true" title="本站安全运行时间" />
                        <span id="timeDate">{date.timeDate}</span>
                        <span id="times">{date.times}</span>
                    </span>
                </div>
            </div>
            <Script src="/static/busuanzi.js" async />
        </footer>
    )
}