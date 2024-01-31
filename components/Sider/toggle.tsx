import { useSpring, animated } from 'react-spring';

interface SidebarToggleProps {
  toggle?: boolean;
  onClick?: () => void;
}

export default function SidebarToggle({ toggle, onClick }: SidebarToggleProps) {
  const firstLineStyle = useSpring({
    top: toggle ? '5px' : '0px',
    transform: `rotateZ(${toggle ? -45 : 0}deg)`
  });

  const middleLineStyle = useSpring({
    opacity: toggle ? 0 : 1
  });

  const lastLineStyle = useSpring({
    top: toggle ? '-5px' : '0px',
    transform: `rotateZ(${toggle ? 45 : 0}deg)`
  });

  return (
    <div className="sidebar-toggle" onClick={onClick}>
      <div className="sidebar-toggle-line-wrap">
        <animated.span className="sidebar-toggle-line sidebar-toggle-line-first" style={firstLineStyle} />
        <animated.span className="sidebar-toggle-line sidebar-toggle-line-middle" style={middleLineStyle} />
        <animated.span className="sidebar-toggle-line sidebar-toggle-line-last" style={lastLineStyle} />
      </div>
    </div>
  );
}
