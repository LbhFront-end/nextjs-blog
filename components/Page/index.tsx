import { useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring";
import hljs from "highlight.js";
import Link from 'next/link';
import { useScript } from "hooks"
import PostHeader from "./header";
import { formatHtml } from "utils";


export default function Page(props) {
  const htmlRef = useRef<HTMLDivElement>(null);
  const {
    html,
    nextPost,
    previousPost,
    tags
  } = props;

  const blockStyle = useSpring({
    delay: 1000,
    from: {
      opacity: 0,
      transform: "translateY(-40px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0px)",
    },
  });

  const status = useScript('https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js', {
    removeOnUnmount: false,
  })

  useEffect(() => {
    if (status === 'ready' && global.mermaid && htmlRef.current) {
      global.mermaid.initialize({
        securityLevel: 'loose',
        theme: 'base',
        logLevel: 5,
        startOnLoad: true,
        arrowMarkerAbsolute: false,
        flowchart: {
          htmlLabels: true,
          useMaxWidth: true,
          curve: 'linear'
        },
        sequence: {
          diagramMarginX: 50,
          diagramMarginY: 10,
          actorMargin: 50,
          width: 150,
          height: 65,
          boxMargin: 10,
          boxTextMargin: 5,
          noteMargin: 10,
          messageMargin: 35,
          mirrorActors: true,
          bottomMarginAdj: 1,
          useMaxWidth: true
        },
        gantt: {
          titleTopMargin: 25,
          barHeight: 20,
          barGap: 4,
          topPadding: 50,
          leftPadding: 75,
          gridLineStartPadding: 35,
          fontSize: 11,
          fontFamily: '"Open-Sans", "sans-serif"',
          numberSectionStyles: 4,
          axisFormat: '%Y-%m-%d'
        },
        class: {},
        git: {}
      })
      const elements = htmlRef.current.querySelectorAll(".mermaid") as NodeListOf<HTMLElement>;
      elements.forEach(element => {
        const graphDefinition = element.innerText;
        graphDefinition && global.mermaid.mermaidAPI.render('graphDiv', graphDefinition, (svgCode) => {
          element.innerHTML = svgCode;
        });
      })
    }
  }, [status]);

  useEffect(() => {
    hljs.highlightAll();
  }, []);


  return (
    <animated.article className="post post-type-normal" style={blockStyle}>
      <div className="post-block">
        <PostHeader {...props} />
        <div ref={htmlRef} dangerouslySetInnerHTML={{ __html: formatHtml(html) }} />
        <footer className="post-footer">
          <div className="post-tags">
            <Link href={`/tags/${tags}`}>
              <a >
                <i className="fa fa-tag" /> {tags}
              </a>
            </Link>

          </div>
          <div className="post-nav">
            {
              (previousPost && previousPost.slug) && (
                <div className="post-nav-next post-nav-item">
                  <Link href={`/blog/${previousPost?.slug}`}>
                    <a rel="prev" title={previousPost?.title}>
                      <i className="fa fa-chevron-left" /> {previousPost?.title}
                    </a>
                  </Link>
                </div>
              )
            }

            <span className="post-nav-divider"></span>
            {
              (nextPost && nextPost.slug) && (
                <div className="post-nav-prev post-nav-item">
                  <Link href={`/blog/${nextPost?.slug}`}>
                    <a rel="next" title={nextPost?.title}>
                      {nextPost?.title} <i className="fa fa-chevron-right" />
                    </a>
                  </Link>
                </div>
              )
            }
          </div>
        </footer>
      </div>
    </animated.article>
  );
}
