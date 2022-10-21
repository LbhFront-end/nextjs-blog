import { useEffect } from "react";
import { useScript } from "hooks";
interface MainProps {
  children: React.ReactNode;
}

export default function Main({ children }: MainProps) {
  const status = useScript('https://js.stripe.com/v3/', {
    removeOnUnmount: false,
  })

  useEffect(() => {
    if (status === 'ready' && global.L2Dwidget) {
      global.L2Dwidget.init({
        model: {
          jsonPath:
            "https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json",
          scale: 1,
        },
        display: {
          position: "right",
          width: 200,
          height: 400,
          hOffset: 0,
          vOffset: -20,
        },
        mobile: {
          show: true,
          scale: 0.5,
        },
        react: {
          opacityDefault: 0.7,
          opacityOnHover: 0.2,
        },
      })
    }
  }, [status])


  return (
    <main id="main" className="main">
      <div className="main-inner">
        <div className="content-wrap">
          <div id="content" className="content">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
