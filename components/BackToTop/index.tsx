import classNames from "classnames";

interface BackToTopProps {
    percent: number;
    onClick: () => void;
    on?: boolean;
}
export default function BackToTop({ percent, on, onClick }: BackToTopProps) {
    return (
        <div className={classNames('back-to-top', { 'back-to-top-on': on })} onClick={onClick}>
            <i className="fa fa-arrow-up"></i>
            <span id="scrollpercent"><span>{percent}</span>%</span>
        </div>
    )
}