"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useRef, useState } from "react";

type GraphNode = {
  x: number;
  y: number;
  label: string;
  big?: boolean;
};

const mainNodes: GraphNode[] = [
  { x: 120, y: 240, label: "AI Agent", big: true },
  { x: 300, y: 100, label: "Image" },
  { x: 480, y: 60, label: "Video" },
  { x: 300, y: 380, label: "Code" },
  { x: 480, y: 420, label: "Knowledge" },
  { x: 650, y: 150, label: "Tool" },
  { x: 650, y: 330, label: "Logic" },
  { x: 820, y: 100, label: "Data" },
  { x: 820, y: 380, label: "Human" },
  { x: 980, y: 240, label: "Output", big: true },
];

const mainEdges = [
  [0, 1],
  [0, 3],
  [1, 2],
  [3, 4],
  [1, 5],
  [3, 6],
  [5, 7],
  [6, 8],
  [7, 9],
  [8, 9],
  [0, 5],
  [0, 6],
];

const intelNodes: GraphNode[] = [
  { x: 250, y: 200, label: "Agent", big: true },
  { x: 110, y: 90, label: "Knowledge" },
  { x: 390, y: 90, label: "Image" },
  { x: 110, y: 320, label: "API" },
  { x: 390, y: 320, label: "Tool" },
  { x: 250, y: 380, label: "Output", big: true },
];

const intelEdges = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
];

function NodeGraph({
  nodes,
  edges,
  className = "",
}: {
  nodes: GraphNode[];
  edges: number[][];
  className?: string;
}) {
  return (
    <svg
      className={`node-graph ${className}`}
      viewBox="0 0 1100 480"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => {
        const na = nodes[a];
        const nb = nodes[b];
        const dx = Math.max(34, Math.abs(nb.x - na.x) * 0.45);
        return (
          <path
            key={i}
            className="canvas-edge"
            d={`M ${na.x + 56} ${na.y} C ${na.x + 56 + dx} ${na.y}, ${nb.x - 56 - dx} ${nb.y}, ${nb.x - 56} ${nb.y}`}
          />
        );
      })}

      {nodes.map((node) => {
        const w = node.big ? 126 : 112;
        const h = node.big ? 62 : 58;
        const x = node.x - w / 2;
        const y = node.y - h / 2;

        return (
          <g
            key={node.label}
            className="canvas-node"
            transform={`translate(${x},${y})`}
          >
            <rect className="node-body" width={w} height={h} rx="8" />
            <rect className="node-header" width={w} height="21" rx="8" />
            <rect
              className="node-accent"
              width="3"
              height={h}
              rx="2"
              fill={node.big ? "#9a6cf0" : "#6a6cf5"}
            />

            <circle className="node-port input" cx="0" cy={h / 2} r="3.4" />
            <circle className="node-port output" cx={w} cy={h / 2} r="3.4" />

            <text className="node-icon" x="11" y="15">
              {node.big ? "AI" : "N"}
            </text>
            <text className="node-title" x="29" y="15">
              {node.label}
            </text>
            <text className="node-subtitle" x="11" y="38">
              {node.big ? "INTELLIGENCE" : "CAPABILITY"}
            </text>

            <circle
              cx={w - 12}
              cy="12"
              r="2.2"
              fill={node.big ? "#9a6cf0" : "#5cc9e8"}
            />
          </g>
        );
      })}
    </svg>
  );
}

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;

    const labels = [
      ["AI Agent", "reason / decide"],
      ["Image", "generation"],
      ["Video", "composition"],
      ["Knowledge", "context"],
      ["Code", "execution"],
      ["Tool", "capability"],
      ["Logic", "routing"],
      ["Data", "input"],
      ["Output", "result"],
    ];

    let nodes: Array<{
      title: string;
      subtitle: string;
      baseX: number;
      baseY: number;
      phase: number;
      speed: number;
      width: number;
      height: number;
      center?: boolean;
      x: number;
      y: number;
    }> = [];

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const roundedRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.offsetWidth ?? window.innerWidth;
      height = canvas.parentElement?.offsetHeight ?? window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = labels.map(([title, subtitle], i) => {
        const angle = (i / labels.length) * Math.PI * 2;
        const rx = width * 0.34;
        const ry = height * 0.31;

        return {
          title,
          subtitle,
          baseX:
            width / 2 + Math.cos(angle) * rx * (0.62 + Math.random() * 0.28),
          baseY:
            height / 2 + Math.sin(angle) * ry * (0.62 + Math.random() * 0.28),
          phase: Math.random() * Math.PI * 2,
          speed: 0.25 + Math.random() * 0.25,
          width: 112,
          height: 48,
          x: 0,
          y: 0,
        };
      });

      nodes.push({
        title: "Vangrex",
        subtitle: "visual system",
        baseX: width / 2,
        baseY: height / 2,
        phase: 0,
        speed: 0,
        width: 128,
        height: 56,
        center: true,
        x: width / 2,
        y: height / 2,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += reduced ? 0 : 0.006;

      nodes.forEach((node) => {
        node.x = node.baseX + Math.sin(time * node.speed * 4 + node.phase) * 12;
        node.y = node.baseY + Math.cos(time * node.speed * 3 + node.phase) * 12;
      });

      const center = nodes[nodes.length - 1];

      nodes.forEach((node, i) => {
        if (node.center) return;

        const mx = (center.x + node.x) / 2 + Math.sin(time + i) * 18;
        const my = (center.y + node.y) / 2 + Math.cos(time + i) * 18;

        const gradient = ctx.createLinearGradient(
          center.x,
          center.y,
          node.x,
          node.y,
        );

        gradient.addColorStop(0, "rgba(106,108,245,.16)");
        gradient.addColorStop(1, "rgba(154,108,240,.02)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.quadraticCurveTo(mx, my, node.x, node.y);
        ctx.stroke();
      });

      nodes.forEach((node) => {
        const x = node.x - node.width / 2;
        const y = node.y - node.height / 2;

        ctx.save();
        ctx.shadowColor = node.center
          ? "rgba(154,108,240,.28)"
          : "rgba(0,0,0,.3)";
        ctx.shadowBlur = node.center ? 28 : 18;
        ctx.shadowOffsetY = 8;

        roundedRect(x, y, node.width, node.height, 8);
        ctx.fillStyle = node.center
          ? "rgba(24,21,38,.94)"
          : "rgba(13,13,20,.86)";
        ctx.fill();

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;

        roundedRect(x, y, node.width, node.height, 8);
        ctx.strokeStyle = node.center
          ? "rgba(154,108,240,.42)"
          : "rgba(255,255,255,.10)";
        ctx.stroke();

        ctx.fillStyle = node.center ? "#9a6cf0" : "#6a6cf5";
        ctx.fillRect(x, y, 3, node.height);

        ctx.beginPath();
        ctx.arc(x + 15, y + 16, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = node.center ? "#9a6cf0" : "#f2f2f5";
        ctx.shadowColor = node.center ? "#9a6cf0" : "rgba(106,108,245,.6)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = '600 10px "Space Grotesk", sans-serif';
        ctx.fillStyle = "#f2f2f5";
        ctx.fillText(node.title, x + 26, y + 19);

        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = "rgba(139,139,156,.8)";
        ctx.fillText(node.subtitle, x + 26, y + 34);

        if (!node.center) {
          ctx.beginPath();
          ctx.arc(x - 1, y + node.height / 2, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#0d0d14";
          ctx.strokeStyle = "rgba(106,108,245,.7)";
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x + node.width + 1, y + node.height / 2, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#0d0d14";
          ctx.strokeStyle = "rgba(154,108,240,.7)";
          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" />;
}

function FinalCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let t = 0;

    let nodes: Array<{
      x: number;
      y: number;
      phase: number;
    }> = [];

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.parentElement?.offsetWidth ?? window.innerWidth;
      h = canvas.parentElement?.offsetHeight ?? 500;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(14, Math.floor(w / 90));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += reduced ? 0 : 0.003;

      nodes.forEach((node, i) => {
        const x = node.x + Math.sin(t + node.phase) * 10;
        const y = node.y + Math.cos(t * 0.8 + node.phase) * 10;

        nodes.slice(i + 1).forEach((other) => {
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 220) {
            ctx.strokeStyle = `rgba(106,108,245,${0.12 * (1 - dist / 220)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(242,242,245,.5)";
        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="final-canvas" />;
}

export default function HomePage() {
  const session = authClient.useSession();

  useReveal();

  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    const steps = Array.from(
      document.querySelectorAll<HTMLElement>(".story-step"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStory(
              Number((entry.target as HTMLElement).dataset.step ?? 0),
            );
          }
        });
      },
      {
        threshold: 0.6,
        rootMargin: "-10% 0px -10% 0px",
      },
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="vangrex-page">
      <div className="bg-grid" />
      <div className="noise" />

      <nav className="nav" id="nav">
        <div className="logo">
          <span className="logo-mark" />
          Vangrex
        </div>

        <ul className="nav-links">
          <li>
            <a href="#canvas-section">Product</a>
          </li>
          <li>
            <a href="#create-section">Explore</a>
          </li>
          <li>
            <a href="#converge-section">Use Cases</a>
          </li>
          <li>
            <a href="#results">Resources</a>
          </li>
        </ul>

        <div className="nav-right">
          <a href="/auth/sign-in" className="nav-signin">
            Sign In
          </a>
          <a href="/auth/sign-in" className="btn btn-primary">
            Start Creating
          </a>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-canvas-wrap">
          <HeroCanvas />
        </div>

        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Now composing systems, not just workflows
          </div>

          <h1>
            One canvas.
            <br />
            <span className="accent">Infinite possibilities.</span>
          </h1>

          <p>
            Vangrex is a visual platform for creating intelligent systems — from
            software to art, video to research — with the power of modern AI.
          </p>

          <div className="hero-ctas">
            <a href="#" className="btn btn-primary btn-lg">
              Start Creating
            </a>
            <a href="#canvas-section" className="btn btn-ghost btn-lg">
              Explore Vangrex
            </a>
          </div>
        </div>

        <div className="scroll-cue">
          <span>SCROLL</span>
          <div className="scroll-line" />
        </div>
      </header>

      <section className="section story">
        <div className="container">
          <span className="kicker reveal">How it begins</span>
          <h2 className="reveal story-heading">
            Every system starts the same way.
          </h2>
        </div>

        <div className="container story-inner">
          <div className="story-visual">
            <svg
              className="story-svg"
              viewBox="0 0 560 520"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {activeStory === 0 ? (
                <StoryNode x={280} y={260} label="Canvas" big />
              ) : (
                <>
                  {["Agent", "Image", "Data", "Tool", "Knowledge"]
                    .slice(0, activeStory === 1 ? 1 : activeStory === 2 ? 3 : 5)
                    .map((label, i, arr) => {
                      const angle =
                        (i / arr.length) * Math.PI * 2 - Math.PI / 2;
                      const x = 280 + Math.cos(angle) * 150;
                      const y = 260 + Math.sin(angle) * 150;

                      return (
                        <g key={label}>
                          <path
                            className="canvas-edge"
                            d={`M 332 260 C ${
                              (280 + x) / 2 + 20
                            } 260, ${(280 + x) / 2 - 20} ${y}, ${x - 52} ${y}`}
                          />
                          <StoryNode
                            x={x}
                            y={y}
                            label={label}
                            big={label === "Agent"}
                          />
                        </g>
                      );
                    })}
                  <StoryNode
                    x={280}
                    y={260}
                    label={activeStory === 4 ? "Result" : "Canvas"}
                    big
                  />
                </>
              )}
            </svg>
          </div>

          <div className="story-steps">
            {[
              [
                "01 / BLANK CANVAS",
                "Ideas start with a blank canvas.",
                "No templates. No rigid workflows. Just an empty space and something you want to build.",
              ],
              [
                "02 / INTELLIGENCE",
                "Add intelligence.",
                "Drop in an agent. Give your system the ability to reason, decide, and act on its own.",
              ],
              [
                "03 / CAPABILITIES",
                "Give it capabilities.",
                "Images, video, tools, data, knowledge, APIs — bring in exactly what the system needs to do.",
              ],
              [
                "04 / CONNECTION",
                "Connect everything.",
                "Wire it together. What was scattered pieces becomes one working, intelligent system.",
              ],
              [
                "05 / RESULT",
                "Create something real.",
                "Software. Art. A film. A report. Whatever you imagined — the canvas builds it.",
              ],
            ].map(([num, title, text], index) => (
              <div
                className={`story-step ${
                  activeStory === index ? "active" : ""
                }`}
                data-step={index}
                key={num}
              >
                <div className="num">{num}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="create-section">
        <div className="container">
          <span className="kicker reveal">Possibilities</span>
          <h2 className="reveal">What will you create?</h2>
          <p className="lede reveal">
            If you can imagine the system, you can build it. Here are a few
            places to start.
          </p>

          <div className="create-grid reveal">
            {[
              [
                "Software",
                "Engineering systems",
                "Build systems that research, architect, write, test, and review code.",
                ["Requirement", "Research", "Code", "Review"],
              ],
              [
                "Images",
                "Generation & editing",
                "Compose systems that generate, restyle, and refine images at any scale.",
                ["Prompt", "Generate", "Style", "Final"],
              ],
              [
                "Video",
                "Reels & pipelines",
                "Script, generate, voice, score, and edit — a full production line.",
                ["Idea", "Script", "Voice", "Edit"],
              ],
              [
                "Art",
                "Artistic systems",
                "Build generative pipelines that explore style, variation, and composition.",
                ["Concept", "Style", "Variation"],
              ],
              [
                "Research",
                "Reasoning systems",
                "Systems that gather sources, analyze, and reason toward an answer.",
                ["Question", "Sources", "Analysis"],
              ],
              [
                "And beyond",
                "Whatever you imagine",
                "These aren't categories with edges. They're starting points — the canvas doesn't stop here.",
                ["Your idea", "?"],
              ],
            ].map(([tag, title, text, flow]) => (
              <div className="create-card" key={tag}>
                <div>
                  <span className="tag">{tag}</span>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
                <div className="flow">
                  {(flow as string[]).map((item, index) => (
                    <span key={`${item}-${index}`} className="flow-item">
                      <span className="flow-node">{item}</span>
                      {index < (flow as string[]).length - 1 && (
                        <span className="arrow">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section canvas-section" id="canvas-section">
        <div className="container">
          <span className="kicker reveal">The canvas</span>
          <h2 className="reveal canvas-heading">
            Your ideas. Your system. Your canvas.
          </h2>
          <p className="lede reveal">
            No rigid templates. Different kinds of capability — intelligence,
            media, logic, data, people — coexist inside one visual system,
            however you choose to combine them.
          </p>

          <div className="canvas-visual reveal">
            <NodeGraph nodes={mainNodes} edges={mainEdges} />
          </div>

          <div className="canvas-label-row reveal">
            {[
              "AI Agent",
              "Image",
              "Video",
              "Code",
              "Knowledge",
              "Tool",
              "Logic",
              "Data",
              "Human",
              "Output",
            ].map((label) => (
              <span className="canvas-label" key={label}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="intel-grid">
            <div className="reveal">
              <span className="kicker">Intelligence</span>
              <h2>Intelligence, wherever you need it.</h2>
              <p className="lede">
                Agents aren't chatbots on Vangrex. They reason, choose tools,
                pull knowledge, and generate — deciding what a system needs at
                each step.
              </p>
            </div>

            <div className="intel-visual reveal">
              <NodeGraph nodes={intelNodes} edges={intelEdges} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight" id="converge-section">
        <div className="container">
          <span className="kicker reveal">One language</span>
          <h2 className="reveal converge-heading">
            Creators, developers, researchers, builders — one canvas.
          </h2>
          <p className="lede reveal">
            Different people, different outcomes, the same underlying system.
          </p>

          <div className="converge-rows reveal">
            {[
              ["Artist", ["Idea", "AI", "Image"], "Artwork"],
              ["Developer", ["Requirement", "AI", "Code"], "Software"],
              ["Creator", ["Concept", "AI", "Video"], "A reel"],
              ["Researcher", ["Question", "AI", "Knowledge"], "A report"],
            ].map(([role, path, output]) => (
              <div className="converge-row" key={role}>
                <div className="converge-role">{role}</div>
                <div className="converge-path">
                  {(path as string[]).map((item, i) => (
                    <span key={item}>
                      {i > 0 && <span className="path-arrow">→</span>}
                      <span className="pill">{item}</span>
                    </span>
                  ))}
                </div>
                <div className="converge-out">→ {output}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="philosophy">
        <h2 className="reveal">
          The future of creation isn't one tool.
          <br />
          <span className="dim">It's the ability to combine them.</span>
        </h2>
      </section>

      <section className="section section-tight" id="results">
        <div className="container">
          <span className="kicker reveal">Outcomes</span>
          <h2 className="reveal">Real things come out the other end.</h2>
          <p className="lede reveal">Different outputs, the same canvas.</p>

          <div className="results-grid reveal">
            {[
              "Images",
              "Videos",
              "Websites",
              "Software",
              "Reports",
              "Research",
              "Content",
              "Data pipelines",
              "Creative assets",
              "Automated processes",
            ].map((item) => (
              <span className="result-chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="final">
        <FinalCanvas />
        <div className="final-content">
          <h2 className="reveal">What will you create?</h2>
          <p className="reveal">
            Build ideas into intelligent systems with Vangrex.
          </p>
          <div className="hero-ctas reveal">
            <a href="#" className="btn btn-primary btn-lg">
              Start Creating
            </a>
            <a href="#canvas-section" className="btn btn-ghost btn-lg">
              Explore the Canvas
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="logo">
          <span className="logo-mark" />
          Vangrex
        </div>
        <div className="muted">© 2026 VANGREX — BUILT ON THE CANVAS</div>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap");

        :root {
          --void: #07070b;
          --surface: #0d0d14;
          --surface-2: #12121c;
          --line: rgba(255, 255, 255, 0.08);
          --line-strong: rgba(255, 255, 255, 0.14);
          --text: #f2f2f5;
          --muted: #8b8b9c;
          --muted-2: #5c5c6b;
          --indigo: #6a6cf5;
          --violet: #9a6cf0;
          --cyan: #5cc9e8;
          --display: "Space Grotesk", sans-serif;
          --body: "Inter", sans-serif;
          --mono: "JetBrains Mono", monospace;
        }

        * {
          box-sizing: border-box;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          margin: 0;
          background: var(--void);
          color: var(--text);
          font-family: var(--body);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        a {
          color: inherit;
        }
        ::selection {
          background: var(--indigo);
          color: white;
        }

        .vangrex-page {
          min-height: 100vh;
          background: var(--void);
        }
        .bg-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            );
          background-size: 64px 64px;
          mask-image: radial-gradient(
            ellipse 80% 60% at 50% 20%,
            black 40%,
            transparent 90%
          );
        }
        .noise {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.035;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .nav,
        section,
        header,
        footer {
          position: relative;
          z-index: 2;
        }

        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 5vw;
          border-bottom: 1px solid transparent;
          background: rgba(7, 7, 11, 0.72);
          backdrop-filter: blur(14px);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--display);
          font-weight: 600;
          font-size: 19px;
        }
        .logo-mark {
          width: 9px;
          height: 9px;
          border-radius: 2px;
          background: var(--indigo);
          box-shadow: 0 0 40px rgba(106, 108, 245, 0.25);
        }
        .nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-links a,
        .nav-signin {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.25s ease;
        }
        .nav-links a:hover,
        .nav-signin:hover {
          color: var(--text);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .btn {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-family: var(--body);
          font-size: 14px;
          font-weight: 600;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            background 0.3s ease;
        }
        .btn-primary {
          color: white;
          background: linear-gradient(135deg, var(--indigo), var(--violet));
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(106, 108, 245, 0.35);
        }
        .btn-ghost {
          border: 1px solid var(--line-strong);
          color: var(--text);
          background: transparent;
        }
        .btn-ghost:hover {
          border-color: var(--indigo);
          background: rgba(106, 108, 245, 0.06);
        }
        .btn-lg {
          padding: 14px 28px;
          font-size: 15px;
          border-radius: 10px;
        }

        .hero {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 140px 24px 80px;
          overflow: hidden;
        }
        .hero-canvas-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.12;
          pointer-events: none;
        }
        .hero-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
          padding: 7px 14px;
          border: 1px solid var(--line-strong);
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.02);
          color: var(--muted);
          font-family: var(--mono);
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 8px var(--cyan);
        }
        .hero h1 {
          margin: 0 0 26px;
          font-family: var(--display);
          font-weight: 600;
          letter-spacing: -0.02em;
          font-size: clamp(42px, 6.4vw, 92px);
          line-height: 1.04;
        }
        .accent {
          background: linear-gradient(
            120deg,
            var(--indigo),
            var(--violet) 60%,
            var(--cyan)
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .hero p {
          max-width: 560px;
          margin: 0 auto 40px;
          color: var(--muted);
          font-size: clamp(16px, 1.9vw, 19px);
          line-height: 1.6;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .scroll-cue {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: var(--muted-2);
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.1em;
        }
        .scroll-line {
          width: 1px;
          height: 34px;
          background: linear-gradient(var(--muted-2), transparent);
          animation: scrollpulse 2s ease-in-out infinite;
        }
        @keyframes scrollpulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        .container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .section {
          padding: 150px 0;
        }
        .section-tight {
          padding: 100px 0;
        }
        .kicker {
          display: block;
          margin-bottom: 18px;
          color: var(--indigo);
          font-family: var(--mono);
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .section h2 {
          margin: 0 0 20px;
          font-family: var(--display);
          font-weight: 600;
          letter-spacing: -0.015em;
          font-size: clamp(30px, 4.2vw, 54px);
          line-height: 1.1;
        }
        .lede {
          max-width: 600px;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.7;
        }
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 0.8s cubic-bezier(0.2, 0.7, 0.2, 1),
            transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .reveal.in {
          opacity: 1;
          transform: translateY(0);
        }

        .story-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        .story-visual {
          position: sticky;
          top: 120px;
          height: 520px;
          border: 1px solid var(--line);
          border-radius: 16px;
          background:
            radial-gradient(
              ellipse at 30% 20%,
              rgba(106, 108, 245, 0.08),
              transparent 60%
            ),
            var(--surface);
          overflow: hidden;
        }
        .story-svg {
          width: 100%;
          height: 100%;
        }
        .story-heading {
          max-width: 640px;
        }
        .story-steps {
          display: flex;
          flex-direction: column;
          gap: 220px;
          padding: 40px 0 120px;
        }
        .story-step {
          opacity: 0.25;
          transition: opacity 0.5s ease;
        }
        .story-step.active {
          opacity: 1;
        }
        .story-step .num {
          margin-bottom: 14px;
          color: var(--muted-2);
          font-family: var(--mono);
          font-size: 12px;
        }
        .story-step h3 {
          margin: 0 0 14px;
          font-family: var(--display);
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 600;
        }
        .story-step p {
          max-width: 400px;
          color: var(--muted);
          font-size: 15.5px;
          line-height: 1.65;
        }

        .canvas-node {
          filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.28));
        }
        .node-body {
          fill: rgba(13, 13, 20, 0.96);
          stroke: rgba(255, 255, 255, 0.11);
          stroke-width: 1;
        }
        .node-header {
          fill: rgba(255, 255, 255, 0.035);
          stroke: rgba(255, 255, 255, 0.06);
          stroke-width: 1;
        }
        .node-title {
          fill: var(--text);
          font-family: var(--display);
          font-size: 11px;
          font-weight: 600;
        }
        .node-subtitle {
          fill: var(--muted-2);
          font-family: var(--mono);
          font-size: 8.5px;
        }
        .node-icon {
          fill: #f2f2f5;
          font-family: var(--mono);
          font-size: 9px;
          font-weight: 600;
        }
        .node-port {
          fill: #0d0d14;
          stroke-width: 1.2;
        }
        .node-port.input {
          stroke: #6a6cf5;
        }
        .node-port.output {
          stroke: #9a6cf0;
        }
        .canvas-edge {
          fill: none;
          stroke: rgba(154, 108, 240, 0.34);
          stroke-width: 1.2;
        }
        .node-graph {
          width: 100%;
          height: 100%;
          display: block;
        }

        .create-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          margin-top: 56px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: var(--line);
        }
        .create-card {
          min-height: 270px;
          padding: 34px 28px 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: var(--surface);
          transition: background 0.3s ease;
        }
        .create-card:hover {
          background: var(--surface-2);
        }
        .tag {
          color: var(--muted-2);
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .create-card h4 {
          margin: 10px 0;
          font-family: var(--display);
          font-size: 22px;
          font-weight: 600;
        }
        .create-card p {
          margin: 0 0 18px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
        }
        .flow {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          color: var(--muted);
          font-family: var(--mono);
          font-size: 11px;
        }
        .flow-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .flow-node {
          padding: 4px 9px;
          border: 1px solid var(--line-strong);
          border-radius: 6px;
          color: var(--text);
          background: rgba(255, 255, 255, 0.02);
        }
        .arrow {
          color: var(--muted-2);
        }

        .canvas-section {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: radial-gradient(
            ellipse 60% 50% at 50% 0%,
            rgba(106, 108, 245, 0.07),
            transparent 70%
          );
        }
        .canvas-heading,
        .converge-heading {
          max-width: 680px;
        }
        .canvas-visual {
          height: 480px;
          margin-top: 60px;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 18px;
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(106, 108, 245, 0.04),
              transparent 45%
            ),
            var(--surface);
        }
        .canvas-visual::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.022) 1px,
              transparent 1px
            );
          background-size: 32px 32px;
          mask-image: radial-gradient(
            ellipse at center,
            black 20%,
            transparent 80%
          );
          pointer-events: none;
        }
        .canvas-label-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 34px;
        }
        .canvas-label {
          padding: 7px 14px;
          border: 1px solid var(--line-strong);
          border-radius: 100px;
          color: var(--muted);
          font-family: var(--mono);
          font-size: 12px;
        }

        .intel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .intel-visual {
          height: 420px;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: var(--surface);
        }

        .converge-rows {
          margin-top: 56px;
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--line);
        }
        .converge-row {
          display: grid;
          grid-template-columns: 180px 1fr 140px;
          align-items: center;
          gap: 24px;
          padding: 22px 0;
          border-bottom: 1px solid var(--line);
          font-family: var(--mono);
          font-size: 13px;
        }
        .converge-role {
          color: var(--text);
          font-weight: 500;
        }
        .converge-path {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .pill {
          display: inline-block;
          padding: 4px 10px;
          border: 1px solid var(--line-strong);
          border-radius: 6px;
          color: var(--text);
        }
        .path-arrow {
          margin: 0 8px;
          color: var(--muted-2);
        }
        .converge-out {
          color: var(--cyan);
          text-align: right;
        }

        .philosophy {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 180px 24px;
          text-align: center;
        }
        .philosophy h2 {
          max-width: 800px;
          margin: 0;
          font-family: var(--display);
          font-size: clamp(30px, 5vw, 58px);
          font-weight: 500;
          line-height: 1.35;
        }
        .dim {
          color: var(--muted-2);
        }

        .results-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 50px;
        }
        .result-chip {
          padding: 12px 20px;
          border: 1px solid var(--line-strong);
          border-radius: 10px;
          background: var(--surface);
          color: var(--muted);
          font-family: var(--mono);
          font-size: 13px;
          transition: all 0.35s ease;
        }
        .result-chip:hover {
          border-color: var(--indigo);
          color: var(--text);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(106, 108, 245, 0.15);
        }

        .final {
          position: relative;
          overflow: hidden;
          padding: 200px 24px 160px;
          border-top: 1px solid var(--line);
          text-align: center;
        }
        .final-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.5;
        }
        .final-content {
          position: relative;
          z-index: 2;
        }
        .final h2 {
          margin: 0 0 22px;
          font-family: var(--display);
          font-size: clamp(34px, 5.5vw, 68px);
          font-weight: 600;
        }
        .final p {
          margin: 0 0 44px;
          color: var(--muted);
          font-size: 17px;
        }

        footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          padding: 50px 5vw;
          border-top: 1px solid var(--line);
        }
        footer .muted {
          color: var(--muted-2);
          font-size: 13px;
          font-family: var(--mono);
        }

        @media (max-width: 900px) {
          .nav-links,
          .nav-signin {
            display: none;
          }
          .story-inner,
          .intel-grid {
            grid-template-columns: 1fr;
          }
          .story-visual {
            position: relative;
            top: 0;
            height: 340px;
          }
          .story-steps {
            gap: 60px;
            padding: 40px 0;
          }
          .story-step {
            opacity: 1;
          }
        }

        @media (max-width: 860px) {
          .create-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .section {
            padding: 100px 0;
          }
          .story-visual {
            height: 280px;
          }
          .converge-row {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 20px 0;
          }
          .converge-out {
            text-align: left;
          }
          .nav {
            padding: 18px 24px;
          }
          .nav-right .btn {
            padding: 9px 13px;
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}

function StoryNode({
  x,
  y,
  label,
  big = false,
}: {
  x: number;
  y: number;
  label: string;
  big?: boolean;
}) {
  const w = big ? 122 : 104;
  const h = 54;

  return (
    <g
      className="canvas-node"
      transform={`translate(${x - w / 2},${y - h / 2})`}
    >
      <rect className="node-body" width={w} height={h} rx="8" />
      <rect className="node-header" width={w} height="20" rx="8" />
      <rect
        className="node-accent"
        width="3"
        height={h}
        rx="2"
        fill={big ? "#9a6cf0" : "#6a6cf5"}
      />
      <circle className="node-port input" cx="0" cy={h / 2} r="3" />
      <circle className="node-port output" cx={w} cy={h / 2} r="3" />
      <text className="node-icon" x="12" y="14">
        {big ? "AI" : "N"}
      </text>
      <text className="node-title" x="30" y="14">
        {label}
      </text>
      <text className="node-subtitle" x="12" y="38">
        {big ? "INTELLIGENCE" : "CAPABILITY"}
      </text>
    </g>
  );
}
