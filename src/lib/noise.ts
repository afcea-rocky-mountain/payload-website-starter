export function noise2D(x: number, y: number, seed: number): number {
  const s = seed || 0;
  return (
    Math.sin(x * 1.2 + s * 1.7) * Math.cos(y * 0.9 + s * 2.3) +
    Math.sin(x * 0.7 + y * 1.1 + s) * 0.8 +
    Math.cos(x * 1.8 - y * 0.6 + s * 0.5) * 0.6 +
    Math.sin((x + y) * 0.5 + s * 3.1) * 0.5 +
    Math.cos(x * 2.1 + y * 1.7 + s * 1.2) * 0.3 +
    Math.sin(x * 0.3 - y * 2.2 + s * 0.8) * 0.4
  );
}

export function fbm(x: number, y: number, seed: number): number {
  let val = 0;
  let amp = 1;
  let freq = 1;
  for (let i = 0; i < 5; i++) {
    val += noise2D(x * freq, y * freq, seed + i * 13.7) * amp;
    amp *= 0.5;
    freq *= 2.0;
  }
  return val;
}
