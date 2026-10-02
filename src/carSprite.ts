export const CAR_WIDTH = 100;
export const CAR_HEIGHT = 36;

export const WHEELS = [
  { cx: 22, cy: 27 },
  { cx: 76, cy: 27 },
] as const;

export const WHEEL_SIZE = 15;

const PALETTE = {
  R: "#ff4a3a",
  r: "#e10600",
  d: "#9d1018",
  D: "#5a0910",
  K: "#0b0b0b",
  W: "#161b22",
  w: "#d5dde6",
  S: "#f3f4f6",
  H: "#fff3cc",
  A: "#ffb000",
  G: "#c5c8ce",
  M: "#d7dbe2",
  N: "#8b9098",
} as const;

type Ink = keyof typeof PALETTE;

export type PixelRun = {
  x: number;
  y: number;
  w: number;
  fill: string;
};

function lerp(points: [number, number][], x: number): number {
  if (x <= points[0][0]) return points[0][1];
  const last = points[points.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    if (x >= x0 && x <= x1) {
      const t = (x - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }
  }
  return last[1];
}

function paint(grid: string[][], x: number, y: number, ink: Ink) {
  if (y < 0 || x < 0 || y >= CAR_HEIGHT || x >= CAR_WIDTH) return;
  grid[y][x] = ink;
}

function eraseDisc(grid: string[][], cx: number, cy: number, radius: number) {
  for (let y = cy - radius; y <= cy + radius; y += 1) {
    for (let x = cx - radius; x <= cx + radius; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= radius * radius) paint(grid, x, y, "." as Ink);
    }
  }
}

function buildGrid(): string[][] {
  const grid = Array.from({ length: CAR_HEIGHT }, () => Array<string>(CAR_WIDTH).fill("."));
  const top: [number, number][] = [
    [3, 19],
    [7, 15],
    [12, 17],
    [28, 16],
    [40, 15],
    [46, 10],
    [50, 9],
    [64, 9],
    [72, 15],
    [86, 17],
    [96, 19],
  ];
  const bottom: [number, number][] = [
    [3, 25],
    [96, 24],
  ];

  for (let x = 3; x <= 96; x += 1) {
    const y0 = Math.round(lerp(top, x));
    const y1 = Math.round(lerp(bottom, x));
    for (let y = y0; y <= y1; y += 1) paint(grid, x, y, "r");
    paint(grid, x, y0, "R");
    paint(grid, x, y1, "D");
    if (y1 - 1 > y0) paint(grid, x, y1 - 1, "d");
  }

  for (let x = 1; x <= 9; x += 1) {
    paint(grid, x, 14, "r");
    paint(grid, x, 15, "R");
  }
  paint(grid, 2, 15, "r");

  for (const wheel of WHEELS) eraseDisc(grid, wheel.cx, wheel.cy, 8);

  const outlined = grid.map((row) => row.slice());
  for (let y = 0; y < CAR_HEIGHT; y += 1) {
    for (let x = 0; x < CAR_WIDTH; x += 1) {
      if (grid[y][x] !== ".") continue;
      const touches = [
        grid[y - 1]?.[x],
        grid[y + 1]?.[x],
        grid[y][x - 1],
        grid[y][x + 1],
      ].some((cell) => cell && cell !== ".");
      if (touches) outlined[y][x] = "K";
    }
  }

  for (let y = 0; y < CAR_HEIGHT; y += 1) {
    for (let x = 0; x < CAR_WIDTH; x += 1) grid[y][x] = outlined[y][x];
  }

  const glass = (x: number, y: number) => {
    if (grid[y]?.[x] === "r" || grid[y]?.[x] === "R" || grid[y]?.[x] === "d") paint(grid, x, y, "W");
  };
  for (let x = 48; x <= 66; x += 1) {
    for (let y = 11; y <= 16; y += 1) glass(x, y);
  }
  for (let x = 64; x <= 70; x += 1) {
    for (let y = 13; y <= 16; y += 1) glass(x, y);
  }
  for (let x = 50; x <= 63; x += 1) paint(grid, x, 11, "w");

  for (let x = 30; x <= 44; x += 1) {
    for (const y of [19, 21, 23]) {
      if (grid[y][x] === "r" || grid[y][x] === "R" || grid[y][x] === "d") paint(grid, x, y, "K");
    }
  }

  for (let y = 14; y <= 24; y += 1) {
    if (grid[y][46] === "r" || grid[y][46] === "d") paint(grid, 46, y, "D");
  }

  for (let x = 58; x <= 61; x += 1) {
    paint(grid, x, 10, "K");
    paint(grid, x, 11, "S");
  }

  for (let x = 86; x <= 93; x += 1) {
    for (let y = 13; y <= 17; y += 1) paint(grid, x, y, "K");
  }
  for (let x = 87; x <= 92; x += 1) {
    for (let y = 14; y <= 16; y += 1) paint(grid, x, y, "H");
  }
  paint(grid, 88, 14, "S");
  paint(grid, 94, 18, "A");
  paint(grid, 95, 18, "A");

  for (let y = 20; y <= 23; y += 1) paint(grid, 97, y, "S");
  paint(grid, 98, 21, "S");
  paint(grid, 98, 22, "K");

  paint(grid, 1, 22, "G");
  paint(grid, 0, 22, "K");
  paint(grid, 1, 23, "K");
  paint(grid, 2, 23, "G");

  return grid;
}

export function bodyRuns(): PixelRun[] {
  const grid = buildGrid();
  const runs: PixelRun[] = [];
  for (let y = 0; y < CAR_HEIGHT; y += 1) {
    let x = 0;
    while (x < CAR_WIDTH) {
      const ink = grid[y][x];
      if (ink === ".") {
        x += 1;
        continue;
      }
      let w = 1;
      while (x + w < CAR_WIDTH && grid[y][x + w] === ink) w += 1;
      runs.push({ x, y, w, fill: PALETTE[ink as Ink] });
      x += w;
    }
  }
  return runs;
}

function wheelGrid(): string[][] {
  const size = WHEEL_SIZE;
  const center = (size - 1) / 2;
  const grid = Array.from({ length: size }, () => Array<string>(size).fill("."));
  const spokes = [0, 72, 144, 216, 288].map((deg) => (deg * Math.PI) / 180);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = x - center;
      const dy = y - center;
      const distance = Math.hypot(dx, dy);
      if (distance > 7.15) continue;
      if (distance >= 5.15) {
        grid[y][x] = "K";
        continue;
      }
      if (distance <= 1.55) {
        grid[y][x] = "N";
        continue;
      }
      const angle = Math.atan2(dy, dx);
      const onSpoke = spokes.some((spoke) => {
        const delta = Math.atan2(Math.sin(angle - spoke), Math.cos(angle - spoke));
        return Math.abs(delta) < 0.34;
      });
      grid[y][x] = onSpoke ? "M" : ".";
    }
  }
  return grid;
}

export function wheelRuns(): PixelRun[] {
  const grid = wheelGrid();
  const runs: PixelRun[] = [];
  for (let y = 0; y < grid.length; y += 1) {
    let x = 0;
    while (x < grid[y].length) {
      const ink = grid[y][x];
      if (ink === ".") {
        x += 1;
        continue;
      }
      let w = 1;
      while (x + w < grid[y].length && grid[y][x + w] === ink) w += 1;
      runs.push({ x, y, w, fill: PALETTE[ink as Ink] });
      x += w;
    }
  }
  return runs;
}
