'use client';
import Image from 'next/image';

const COLS: string[][] = [
  ['/tech/react.png', '/tech/next.png', '/tech/ts.png', '/tech/js.png'],
  ['/tech/node.png', '/tech/python.png', '/tech/react.png', '/tech/js.png'],
  ['/tech/next.png', '/tech/ts.png', '/tech/node.png', '/tech/python.png'],
  ['/tech/js.png', '/tech/react.png', '/tech/next.png', '/tech/ts.png'],
  ['/tech/python.png', '/tech/node.png', '/tech/js.png', '/tech/react.png'],
];

export default function TechColumnsBackground() {
  const durations = ['18s', '22s', '16s', '20s', '24s'];

  return (
    <div className="tech-bg" aria-hidden>
      {COLS.map((logos, i) => (
        <div
          key={i}
          className={`col ${i % 2 === 0 ? 'up' : 'down'}`}
          style={{ animationDuration: durations[i % durations.length] }}
        >
          {[...logos, ...logos, ...logos].map((src, j) => (
            <Image
              key={j}
              src={src}
              alt=""
              width={64}
              height={64}
              loading="lazy"
              unoptimized // ✅ statik export için şart
            />
          ))}
        </div>
      ))}

      <style jsx>{`
        .tech-bg {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
          overflow: hidden;
        }
        .col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(24px, 3vw, 48px);
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .col.up {
          animation-name: floatUpDownA;
        }
        .col.down {
          animation-name: floatUpDownB;
        }

        .col :global(img) {
          width: clamp(36px, 5vw, 64px);
          height: auto;
          filter: grayscale(0%) brightness(1.12) saturate(1.15) contrast(1.05);
          opacity: 1;
          user-select: none;
        }

        @keyframes floatUpDownA {
          0% {
            transform: translateY(-12%);
          }
          50% {
            transform: translateY(12%);
          }
          100% {
            transform: translateY(-12%);
          }
        }
        @keyframes floatUpDownB {
          0% {
            transform: translateY(12%);
          }
          50% {
            transform: translateY(-12%);
          }
          100% {
            transform: translateY(12%);
          }
        }

        @media (max-width: 640px) {
          .tech-bg {
            opacity: 0.12;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .col {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
