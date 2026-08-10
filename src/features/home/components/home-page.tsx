"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type GraphNode = {
  x: number;
  y: number;
  label: string;
  big?: boolean;
};

const mainNodes: GraphNode[] = [
  { x: 120, y: 240, label: "AI Agent", big: true },
  { x: 300, y: 100, label: "Requirements" },
  { x: 480, y: 60, label: "Research" },
  { x: 300, y: 380, label: "Code" },
  { x: 480, y: 420, label: "Knowledge" },
  { x: 650, y: 150, label: "Tools" },
  { x: 650, y: 330, label: "Tests" },
  { x: 820, y: 100, label: "Repository" },
  { x: 820, y: 380, label: "Review" },
  { x: 980, y: 240, label: "Software", big: true },
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
  { x: 110, y: 90, label: "Context" },
  { x: 390, y: 90, label: "Repository" },
  { x: 110, y: 320, label: "Tools" },
  { x: 390, y: 320, label: "Tests" },
  { x: 250, y: 380, label: "Code", big: true },
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

/* -------------------------------------------------------------------------- */
/*                                PARALLAX                                     */
/* -------------------------------------------------------------------------- */

function Parallax({
  children,
  y = 80,
  x = 0,
  scale = 0,
  opacity = 0,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  y?: number;
  x?: number;
  scale?: number;
  opacity?: number;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 0.5, 1], [y, 0, -y]);
  const rawX = useTransform(scrollYProgress, [0, 0.5, 1], [x, 0, -x]);

  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1 - scale, 1, 1 + scale],
  );

  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [opacity ? 0.7 : 1, 1, 1, 1, opacity ? 0.7 : 1],
  );

  const springY = useSpring(rawY, {
    stiffness: 80,
    damping: 24,
    mass: 0.5,
  });

  const springX = useSpring(rawX, {
    stiffness: 80,
    damping: 24,
    mass: 0.5,
  });

  const springScale = useSpring(rawScale, {
    stiffness: 90,
    damping: 26,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x: springX,
        y: springY,
        scale: springScale,
        opacity: rawOpacity,
        willChange: "transform",
      }}
      transition={{
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              NODE GRAPH                                     */
/* -------------------------------------------------------------------------- */

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
            d={`M ${na.x + 56} ${na.y} C ${
              na.x + 56 + dx
            } ${na.y}, ${nb.x - 56 - dx} ${nb.y}, ${nb.x - 56} ${nb.y}`}
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
              {node.big ? "ENGINEERING AGENT" : "CAPABILITY"}
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

/* -------------------------------------------------------------------------- */
/*                                REVEAL                                       */
/* -------------------------------------------------------------------------- */

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
}

/* -------------------------------------------------------------------------- */
/*                              HERO CANVAS                                    */
/* -------------------------------------------------------------------------- */

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });

    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let visible = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const lowPower =
      (
        navigator as Navigator & {
          deviceMemory?: number;
          hardwareConcurrency?: number;
        }
      ).deviceMemory !== undefined &&
      ((
        navigator as Navigator & {
          deviceMemory?: number;
        }
      ).deviceMemory ?? 8) <= 4;

    const veryLowPower = (navigator.hardwareConcurrency ?? 8) <= 2;

    const staticMode = reduced || lowPower || veryLowPower;

    const labels = [
      ["Engineering Agent", "reason / decide"],
      ["Requirements", "understand intent"],
      ["Research", "explore context"],
      ["Architecture", "design systems"],
      ["Code", "implementation"],
      ["Tools", "take action"],
      ["Tests", "verify behavior"],
      ["Repository", "read / write"],
      ["Review", "improve output"],
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
      dpr = Math.min(window.devicePixelRatio || 1, staticMode ? 1 : 1.5);

      width = canvas.parentElement?.offsetWidth ?? window.innerWidth;

      height = canvas.parentElement?.offsetHeight ?? window.innerHeight;

      canvas.width = Math.floor(width * dpr);

      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = labels.map(([title, subtitle], i) => {
        const angle = (i / labels.length) * Math.PI * 2 - Math.PI / 2;

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

          width: title === "Engineering Agent" ? 138 : 118,

          height: title === "Engineering Agent" ? 58 : 48,

          x: 0,
          y: 0,
        };
      });

      nodes.push({
        title: "Vangrex",
        subtitle: "agentic engineering",
        baseX: width / 2,
        baseY: height / 2,
        phase: 0,
        speed: 0,
        width: 142,
        height: 62,
        center: true,
        x: width / 2,
        y: height / 2,
      });
    };

    const draw = () => {
      if (!visible) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (!staticMode) {
        time += 0.006;
      }

      nodes.forEach((node) => {
        if (node.center) {
          node.x = node.baseX;
          node.y = node.baseY;
          return;
        }

        const movement = staticMode ? 0 : 12;

        node.x =
          node.baseX + Math.sin(time * node.speed * 4 + node.phase) * movement;

        node.y =
          node.baseY + Math.cos(time * node.speed * 3 + node.phase) * movement;
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

        if (!staticMode) {
          ctx.shadowColor = node.center
            ? "rgba(154,108,240,.28)"
            : "rgba(0,0,0,.3)";

          ctx.shadowBlur = node.center ? 28 : 18;

          ctx.shadowOffsetY = 8;
        }

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

        ctx.fill();

        ctx.font = '600 10px "Space Grotesk", sans-serif';

        ctx.fillStyle = "#f2f2f5";

        ctx.fillText(node.title, x + 26, y + 19);

        ctx.font = '8px "JetBrains Mono", monospace';

        ctx.fillStyle = "rgba(139,139,156,.8)";

        ctx.fillText(node.subtitle, x + 26, y + 34);

        if (!node.center) {
          ctx.beginPath();

          ctx.arc(x - 1, y + node.height / 2, 3, 0, Math.PI * 2);

          ctx.strokeStyle = "rgba(106,108,245,.7)";

          ctx.stroke();

          ctx.beginPath();

          ctx.arc(x + node.width + 1, y + node.height / 2, 3, 0, Math.PI * 2);

          ctx.strokeStyle = "rgba(154,108,240,.7)";

          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      {
        threshold: 0,
        rootMargin: "200px",
      },
    );

    observer.observe(canvas);

    resize();
    draw();

    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);

      observer.disconnect();

      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}

/* -------------------------------------------------------------------------- */
/*                              FINAL CANVAS                                   */
/* -------------------------------------------------------------------------- */

function FinalCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });

    if (!ctx) return;

    let frame = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let t = 0;
    let visible = true;

    let nodes: Array<{
      x: number;
      y: number;
      phase: number;
    }> = [];

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
    };

    const lowPower =
      (nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 2;

    const staticMode = reduced || lowPower;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, staticMode ? 1 : 1.5);

      w = canvas.parentElement?.offsetWidth ?? window.innerWidth;

      h = canvas.parentElement?.offsetHeight ?? 500;

      canvas.width = Math.floor(w * dpr);

      canvas.height = Math.floor(h * dpr);

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = staticMode
        ? Math.max(8, Math.floor(w / 150))
        : Math.max(14, Math.floor(w / 90));

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      if (!visible) {
        frame = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      if (!staticMode) {
        t += 0.003;
      }

      nodes.forEach((node, i) => {
        const x = node.x + (staticMode ? 0 : Math.sin(t + node.phase) * 10);

        const y =
          node.y + (staticMode ? 0 : Math.cos(t * 0.8 + node.phase) * 10);

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];

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
        }

        ctx.beginPath();

        ctx.arc(x, y, 1.6, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(242,242,245,.5)";

        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      {
        rootMargin: "300px",
      },
    );

    observer.observe(canvas);

    resize();
    draw();

    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelAnimationFrame(frame);

      observer.disconnect();

      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="final-canvas" aria-hidden="true" />;
}

/* -------------------------------------------------------------------------- */
/*                                STORY NODE                                   */
/* -------------------------------------------------------------------------- */

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

      <rect className="node-header" width={w} height="21" rx="8" />

      <rect width="3" height={h} rx="2" fill={big ? "#9a6cf0" : "#6a6cf5"} />

      <circle className="node-port input" cx="0" cy={h / 2} r="3" />

      <circle className="node-port output" cx={w} cy={h / 2} r="3" />

      <text className="node-icon" x="11" y="15">
        {big ? "AI" : "N"}
      </text>

      <text className="node-title" x="29" y="15">
        {label}
      </text>

      <text className="node-subtitle" x="11" y="38">
        {big ? "ENGINEERING AGENT" : "CAPABILITY"}
      </text>

      <circle cx={w - 12} cy="12" r="2.2" fill={big ? "#9a6cf0" : "#5cc9e8"} />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*                               HOME PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  const session = authClient.useSession();

  useReveal();

  const [activeStory, setActiveStory] = useState(0);

  const heroRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();

  /*
   * Global scroll depth.
   *
   * These values are intentionally stronger than the previous implementation.
   * They create the feeling that the page is composed of multiple physical
   * layers rather than simply moving elements a few pixels.
   */

  const heroY = useTransform(scrollY, [0, 900], [0, -220]);

  const heroScale = useTransform(scrollY, [0, 700], [1, 0.92]);

  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.15]);

  const heroOrbLeftY = useTransform(scrollY, [0, 1200], [0, -320]);

  const heroOrbRightY = useTransform(scrollY, [0, 1200], [0, 260]);

  const heroOrbRightX = useTransform(scrollY, [0, 1200], [0, -100]);

  const storyTitleY = useTransform(scrollY, [400, 1500], [80, -100]);

  const storyVisualY = useTransform(scrollY, [600, 2200], [100, -140]);

  const canvasTitleY = useTransform(scrollY, [2200, 3600], [120, -100]);

  const philosophyY = useTransform(scrollY, [4500, 6000], [140, -160]);

  useEffect(() => {
    const steps = Array.from(document.querySelectorAll(".story-step"));

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

      {/* ------------------------------------------------------------------ */}
      {/* NAV                                                                 */}
      {/* ------------------------------------------------------------------ */}

      <nav className="nav">
        <div className="logo">
          <Logo width={36} height={36} />
          Vangrex
        </div>

        <ul className="nav-links">
          <li>
            <a href="#canvas-section">Platform</a>
          </li>

          <li>
            <a href="#create-section">Capabilities</a>
          </li>

          <li>
            <a href="#converge-section">Engineering</a>
          </li>

          <li>
            <a href="#results">Outcomes</a>
          </li>
        </ul>

        <div className="nav-right">
          <a href="/auth/sign-in" className="nav-signin">
            Sign In
          </a>

          <Button className="btn btn-primary" asChild>
            <Link href="/auth/sign-in">Start Building</Link>
          </Button>
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}

      <header ref={heroRef} className="hero">
        <motion.div
          className="hero-orb hero-orb-one"
          style={{
            y: heroOrbLeftY,
            willChange: "transform",
          }}
        />

        <motion.div
          className="hero-orb hero-orb-two"
          style={{
            y: heroOrbRightY,
            x: heroOrbRightX,
            willChange: "transform",
          }}
        />

        <motion.div
          className="hero-canvas-wrap"
          style={{
            y: heroY,
            scale: heroScale,
            opacity: heroOpacity,
            willChange: "transform, opacity",
          }}
        >
          <HeroCanvas />
        </motion.div>

        <motion.div
          className="hero-content"
          style={{
            y: useTransform(scrollY, [0, 700], [0, -100]),
            scale: useTransform(scrollY, [0, 700], [1, 0.96]),
            opacity: heroOpacity,
            willChange: "transform, opacity",
          }}
        >
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Agentic software engineering
          </div>

          <h1>
            Software that
            <br />
            <span className="accent">builds itself.</span>
          </h1>

          <p>
            Vangrex is a visual platform for building agentic software systems.
            Give AI agents requirements, context, tools, repositories, and tests
            — then let them reason, build, verify, and improve software.
          </p>

          <div className="hero-ctas">
            <Button size="lg" asChild>
              <Link href="/auth/sign-in" className="btn btn-primary">
                Start Building
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="#canvas-section">Explore Vangrex</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="scroll-cue"
          style={{
            y: useTransform(scrollY, [0, 600], [0, 100]),
            opacity: useTransform(scrollY, [0, 300], [1, 0]),
          }}
        >
          <span>SCROLL</span>
          <div className="scroll-line" />
        </motion.div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* STORY                                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="section story">
        <div className="container">
          <motion.div
            style={{
              y: storyTitleY,
            }}
          >
            <span className="kicker reveal">How it begins</span>

            <h2 className="reveal story-heading">
              Every software system starts with an idea.
            </h2>
          </motion.div>
        </div>

        <div className="container story-inner">
          <motion.div
            className="story-visual"
            style={{
              y: storyVisualY,
              rotateX: useTransform(scrollY, [500, 2000], [4, -4]),
              willChange: "transform",
            }}
          >
            <svg
              className="story-svg"
              viewBox="0 0 560 520"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {activeStory === 0 ? (
                <StoryNode x={280} y={260} label="Idea" big />
              ) : (
                <>
                  {["Requirements", "Research", "Code", "Tools", "Tests"]
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
                            d={`M 332 260 C ${(280 + x) / 2 + 20} 260, ${
                              (280 + x) / 2 - 20
                            } ${y}, ${x - 52} ${y}`}
                          />

                          <StoryNode
                            x={x}
                            y={y}
                            label={label}
                            big={label === "Code"}
                          />
                        </g>
                      );
                    })}

                  <StoryNode
                    x={280}
                    y={260}
                    label={activeStory === 4 ? "Software" : "Agent"}
                    big
                  />
                </>
              )}
            </svg>
          </motion.div>

          <div className="story-steps">
            {[
              [
                "01 / INTENT",
                "Start with a software idea.",
                "Describe what you want to build. The system starts from intent instead of forcing you into a predefined workflow.",
              ],
              [
                "02 / REASONING",
                "Let an agent understand it.",
                "An engineering agent decomposes requirements, asks what matters, researches the problem, and creates an executable plan.",
              ],
              [
                "03 / EXECUTION",
                "Give the agent real capabilities.",
                "Repositories, terminals, APIs, documentation, databases, code generators, testing tools, and other capabilities become part of the system.",
              ],
              [
                "04 / VERIFICATION",
                "Build, test, inspect, improve.",
                "Agents don't just generate code. They can run it, inspect results, execute tests, identify failures, and iterate toward a working system.",
              ],
              [
                "05 / SOFTWARE",
                "Turn intent into working software.",
                "From a blank canvas to a functioning application — Vangrex orchestrates the intelligence and capabilities required to get there.",
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

      {/* ------------------------------------------------------------------ */}
      {/* CAPABILITIES                                                        */}
      {/* ------------------------------------------------------------------ */}

      <section className="section" id="create-section">
        <div className="container">
          <span className="kicker reveal">Agentic engineering</span>

          <h2 className="reveal">What can an engineering agent actually do?</h2>

          <p className="lede reveal">
            Vangrex connects reasoning with the capabilities required to move
            software from an idea to a working system.
          </p>

          <div className="create-grid reveal">
            {[
              [
                "Requirements",
                "Understand the problem",
                "Transform product intent into structured requirements, constraints, acceptance criteria, and engineering tasks.",
                ["Intent", "Analyze", "Specify", "Plan"],
              ],
              [
                "Research",
                "Explore before building",
                "Agents can investigate documentation, existing implementations, APIs, libraries, and technical constraints before writing code.",
                ["Question", "Research", "Context", "Decision"],
              ],
              [
                "Architecture",
                "Design the system",
                "Turn requirements into architecture, components, data flows, interfaces, services, and implementation plans.",
                ["Requirements", "Design", "Decompose"],
              ],
              [
                "Coding",
                "Write real software",
                "Agents can work across repositories and produce implementation changes instead of stopping at generated snippets.",
                ["Context", "Code", "Integrate", "Commit"],
              ],
              [
                "Testing",
                "Verify what was built",
                "Run tests, inspect failures, reason about regressions, and iterate until the implementation satisfies the intended behavior.",
                ["Build", "Test", "Analyze", "Fix"],
              ],
              [
                "Review",
                "Continuously improve",
                "Use agents to inspect implementations, identify weaknesses, suggest changes, and improve the quality of the resulting software.",
                ["Inspect", "Review", "Improve"],
              ],
            ].map(([tag, title, text, flow], index) => (
              <motion.div
                className="create-card"
                key={tag as string}
                initial={{
                  opacity: 0,
                  y: 70,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CANVAS                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section className="section canvas-section" id="canvas-section">
        <div className="container">
          <span className="kicker reveal">The engineering canvas</span>

          <motion.h2
            className="reveal canvas-heading"
            style={{
              y: canvasTitleY,
            }}
          >
            Your agent. Your tools. Your codebase.
          </motion.h2>

          <p className="lede reveal">
            Vangrex gives engineering agents a visual environment where
            reasoning, context, tools, code, tests, and humans can coexist as
            one system.
          </p>

          <Parallax
            y={110}
            x={-25}
            scale={0.025}
            className="canvas-visual reveal"
          >
            <NodeGraph nodes={mainNodes} edges={mainEdges} />
          </Parallax>

          <Parallax y={-65} x={35} className="canvas-label-row reveal">
            {[
              "AI Agent",
              "Requirements",
              "Research",
              "Code",
              "Knowledge",
              "Tools",
              "Tests",
              "Repository",
              "Review",
              "Software",
            ].map((label) => (
              <span className="canvas-label" key={label}>
                {label}
              </span>
            ))}
          </Parallax>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* INTELLIGENCE                                                        */}
      {/* ------------------------------------------------------------------ */}

      <section className="section">
        <div className="container">
          <div className="intel-grid">
            <Parallax y={100} x={-40} className="reveal">
              <span className="kicker">Intelligence</span>

              <h2>Agents that operate inside the engineering system.</h2>

              <p className="lede">
                Software agents shouldn't exist in isolation. They need
                repository context, knowledge, tools, execution environments,
                tests, and feedback loops. Vangrex brings those capabilities
                together.
              </p>
            </Parallax>

            <Parallax
              y={-120}
              x={50}
              scale={0.025}
              className="intel-visual reveal"
            >
              <NodeGraph nodes={intelNodes} edges={intelEdges} />
            </Parallax>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CONVERGE                                                            */}
      {/* ------------------------------------------------------------------ */}

      <section className="section section-tight" id="converge-section">
        <div className="container">
          <span className="kicker reveal">One engineering system</span>

          <motion.h2
            className="reveal converge-heading"
            style={{
              y: useTransform(scrollY, [3400, 4700], [100, -80]),
            }}
          >
            From requirement to production — one canvas.
          </motion.h2>

          <p className="lede reveal">
            Different engineering tasks, different agents, the same underlying
            system.
          </p>

          <div className="converge-rows reveal">
            {[
              ["Product", ["Idea", "Agent", "Requirements"], "Specification"],
              [
                "Architect",
                ["Requirements", "Agent", "Architecture"],
                "System design",
              ],
              ["Developer", ["Context", "Agent", "Code"], "Software"],
              ["QA", ["Build", "Agent", "Tests"], "Verified system"],
              ["Reviewer", ["Repository", "Agent", "Review"], "Improvement"],
            ].map(([role, path, output], index) => (
              <motion.div
                className="converge-row"
                key={role as string}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -60 : 60,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.25,
                }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* PHILOSOPHY                                                         */}
      {/* ------------------------------------------------------------------ */}

      <section className="philosophy">
        <motion.div
          className="philosophy-orb"
          style={{
            y: useTransform(scrollY, [4300, 6200], [220, -220]),
            x: useTransform(scrollY, [4300, 6200], [-80, 80]),
          }}
        />

        <motion.h2
          className="reveal"
          style={{
            y: philosophyY,
            scale: useTransform(scrollY, [4500, 5700], [0.92, 1.04]),
          }}
        >
          The future of software engineering isn't just
          <br />
          <span className="dim">writing code faster.</span>
        </motion.h2>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* RESULTS                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="section section-tight" id="results">
        <div className="container">
          <span className="kicker reveal">Outcomes</span>

          <h2 className="reveal">Build software, not just code.</h2>

          <p className="lede reveal">
            Agentic engineering connects everything around the code so agents
            can participate in the complete software development lifecycle.
          </p>

          <Parallax y={90} x={-40} scale={0.02} className="results-grid reveal">
            {[
              "Requirements",
              "Technical specifications",
              "Architecture",
              "Code",
              "Refactoring",
              "Tests",
              "Bug fixes",
              "Code review",
              "Documentation",
              "Repositories",
              "APIs",
              "Production systems",
            ].map((item) => (
              <span className="result-chip" key={item}>
                {item}
              </span>
            ))}
          </Parallax>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FINAL                                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="final">
        <FinalCanvas />

        <motion.div
          className="final-glow"
          style={{
            y: useTransform(scrollY, [6000, 7200], [180, -180]),
            scale: useTransform(scrollY, [6000, 7200], [0.8, 1.3]),
          }}
        />

        <motion.div
          className="final-content"
          style={{
            y: useTransform(scrollY, [5900, 7200], [120, -80]),
            willChange: "transform",
          }}
        >
          <h2 className="reveal">What will you build?</h2>

          <p className="reveal">
            Give your software agents a canvas to reason, build, test, and
            improve.
          </p>

          <div className="hero-ctas reveal">
            <Button size="lg" asChild>
              <Link href="/auth/sign-in" className="btn btn-primary btn-lg">
                Start Building
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="#canvas-section">Explore the Canvas</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                              */}
      {/* ------------------------------------------------------------------ */}

      <footer>
        <div className="logo">
          <Logo width={64} height={64} />
          Vangrex
        </div>

        <div className="muted">
          © 2026 VANGREX — AGENTIC SOFTWARE ENGINEERING
        </div>
      </footer>

      {/* ------------------------------------------------------------------ */}
      {/* STYLES                                                              */}
      {/* ------------------------------------------------------------------ */}

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
          overflow: hidden;
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

        .btn-primary {
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(106, 108, 245, 0.35);
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
          perspective: 1000px;
        }

        .hero-canvas-wrap {
          position: absolute;
          inset: -12%;
          z-index: 0;
          opacity: 0.13;
          pointer-events: none;
          will-change: transform;
          transform-origin: center center;
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
          will-change: transform;
        }

        .hero-orb,
        .philosophy-orb,
        .final-glow {
          position: absolute;
          pointer-events: none;
          border-radius: 999px;
          filter: blur(80px);
          will-change: transform;
        }

        .hero-orb-one {
          width: 420px;
          height: 420px;
          left: -160px;
          top: 18%;
          background: rgba(106, 108, 245, 0.08);
        }

        .hero-orb-two {
          width: 360px;
          height: 360px;
          right: -140px;
          top: 35%;
          background: rgba(154, 108, 240, 0.07);
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
          max-width: 600px;
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
          will-change: transform;
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
          will-change: transform;
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
          transition:
            background 0.3s ease,
            transform 0.5s ease;
          will-change: transform;
        }

        .create-card:hover {
          background: var(--surface-2);
          transform: translateY(-5px);
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
          will-change: transform;
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
          will-change: transform;
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
          will-change: transform;
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

        .intel-grid > div {
          will-change: transform;
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
          overflow: hidden;
        }

        .philosophy h2 {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0;
          font-family: var(--display);
          font-size: clamp(30px, 5vw, 58px);
          font-weight: 500;
          line-height: 1.35;
          will-change: transform;
        }

        .philosophy-orb {
          width: 520px;
          height: 520px;
          background: rgba(106, 108, 245, 0.08);
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
        }

        .dim {
          color: var(--muted-2);
        }

        .results-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 50px;
          will-change: transform;
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

        .final-glow {
          width: 700px;
          height: 700px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: rgba(106, 108, 245, 0.06);
        }

        .final-content {
          position: relative;
          z-index: 2;
          will-change: transform;
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

          /*
           * Disable heavy continuous parallax
           * on smaller devices.
           */
          .canvas-visual,
          .intel-visual {
            transform: none !important;
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

          .hero-orb-one,
          .hero-orb-two,
          .philosophy-orb,
          .final-glow {
            opacity: 0.5;
          }

          .hero-canvas-wrap {
            inset: -5%;
            opacity: 0.08;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
          }

          .reveal {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}
