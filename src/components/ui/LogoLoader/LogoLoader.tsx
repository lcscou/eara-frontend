type Size = 'sm' | 'md' | 'lg'

const sizes = {
  sm: { wrap: 44, c1: 26, c2: 16, c3: 10, c1top: 8, c2right: 0, c3right: 4 },
  md: { wrap: 72, c1: 42, c2: 26, c3: 16, c1top: 14, c2right: 0, c3right: 6 },
  lg: { wrap: 100, c1: 58, c2: 36, c3: 22, c1top: 20, c2right: 0, c3right: 8 },
}

export function LogoLoader({ size = 'md' }: { size?: Size }) {
  const s = sizes[size]
  return (
    <>
      <style>{`
        @keyframes pulse1 {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.82); opacity: 0.6; }
        }
        @keyframes pulse2 {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.82); opacity: 0.6; }
        }
        @keyframes pulse3 {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.7); opacity: 0.5; }
        }
      `}</style>
      <div style={{ position: 'relative', width: s.wrap, height: s.wrap }}>
        <div
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: '#312f86',
            width: s.c1,
            height: s.c1,
            left: 0,
            top: s.c1top,
            animation: 'pulse1 1.6s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: '#312f86',
            width: s.c2,
            height: s.c2,
            right: s.c2right,
            top: 0,
            animation: 'pulse2 1.6s ease-in-out infinite 0.3s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: '#8fbf29',
            width: s.c3,
            height: s.c3,
            right: s.c3right,
            bottom: 0,
            animation: 'pulse3 1.6s ease-in-out infinite 0.6s',
          }}
        />
      </div>
    </>
  )
}
