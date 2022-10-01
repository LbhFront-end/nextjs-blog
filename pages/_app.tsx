import { AppProps } from 'next/app';
import NextNProgress from "nextjs-progressbar";
import 'lib/font-awesome/css/font-awesome.min.css';
import "styles/prism.css"
import 'styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <NextNProgress color='#29d' height={2} options={{ showSpinner: false }}/>
            <Component {...pageProps} />
        </>
    )
}