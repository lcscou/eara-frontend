type Size = 'sm' | 'md' | 'lg'

const sizes = {
  sm: { wrap: 44 },
  md: { wrap: 72 },
  lg: { wrap: 100 },
}

const logoPaths = [
  {
    d: 'M194.386 145.385C234.469 145.385 267.082 112.774 267.082 72.6925C267.082 32.6111 234.469 0 194.386 0C154.302 0 121.689 32.4674 121.689 72.6925C121.689 112.774 154.158 145.385 194.386 145.385Z',
    fill: '#8FBF29',
  },
  {
    d: 'M75.139 349.384C116.659 349.384 150.277 315.768 150.277 274.25C150.277 232.875 116.659 199.115 75.139 199.115C33.6189 199.115 0.000456821 232.875 0.000456821 274.25C-0.143211 315.624 33.6189 349.384 75.139 349.384Z',
    fill: '#312F86',
  },
  {
    d: 'M238.059 336.31C258.891 336.31 275.701 319.502 275.701 298.671C275.701 277.84 258.891 261.032 238.059 261.032C217.227 261.032 200.418 277.84 200.418 298.671C200.418 319.502 217.227 336.31 238.059 336.31Z',
    fill: '#8FBF29',
  },
  {
    d: 'M122.694 170.958C151.714 170.958 175.276 147.397 175.276 118.378C175.276 89.3581 151.714 65.7979 122.694 65.7979C93.6724 65.7979 70.1104 89.3581 70.1104 118.378C70.1104 147.397 93.6724 170.958 122.694 170.958Z',
    fill: '#312F86',
  },
  {
    d: 'M311.905 241.207C335.18 241.207 354 222.387 354 199.115C354 175.842 335.18 157.022 311.905 157.022C288.631 157.022 269.811 175.842 269.811 199.115C269.811 222.387 288.631 241.207 311.905 241.207Z',
    fill: '#312F86',
  },
]

const pseudoRandom = (seed: number) => {
  const raw = Math.sin(seed * 12.9898) * 43758.5453
  return raw - Math.floor(raw)
}

const pulseConfig = logoPaths.map((_, index) => {
  const duration = 1.2 + pseudoRandom(index + 1) * 1.3
  const delay = pseudoRandom(index + 20) * 0.9
  const minScale = 0.72 + pseudoRandom(index + 40) * 0.2
  return {
    className: `logo-loader-path-${index}`,
    duration,
    delay,
    minScale,
  }
})

export function LogoLoader({ size = 'lg' }: { size?: Size }) {
  const s = sizes[size]
  return (
    <>
      <style>{`
        .logo-loader-path {
          transform-box: fill-box;
          transform-origin: center;
        }
        ${pulseConfig
          .map(
            (cfg, index) => `
          .${cfg.className} {
            animation: pulse-${index} ${cfg.duration.toFixed(2)}s ease-in-out ${cfg.delay.toFixed(2)}s infinite;
          }
          @keyframes pulse-${index} {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(${cfg.minScale.toFixed(2)});
              opacity: 0.56;
            }
          }
        `
          )
          .join('')}
      `}</style>
      <div className="flex h-screen w-full items-center justify-center">
        <div style={{ position: 'relative', width: s.wrap, height: s.wrap }}>
          <svg
            width={s.wrap}
            height={s.wrap}
            viewBox="0 0 354 350"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {logoPaths.map((path, index) => (
              <path
                key={path.d}
                d={path.d}
                fill={path.fill}
                className={`logo-loader-path ${pulseConfig[index].className}`}
              />
            ))}
          </svg>
        </div>
      </div>
    </>
  )
}
