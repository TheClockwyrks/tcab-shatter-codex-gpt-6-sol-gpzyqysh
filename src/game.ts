import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  BINDINGS,
  BULLET_LIFE,
  BULLET_R,
  CORE_R,
  CUES,
  EXTRA_LIFE_STEP,
  FACE_UP,
  FIELD_H,
  FIELD_W,
  FIRE_INTERVAL_TICKS,
  GAMEOVER_ITEMS,
  HALO_R,
  HIT_FLASH_TIME,
  INVULN_TIME,
  MAX_BULLETS,
  MU,
  MUZZLE_SPEED,
  PAUSE_ITEMS,
  ROCK_CHILD,
  ROCK_HEALTH,
  ROCK_RADIUS,
  ROCK_SPEED_MAX,
  ROCK_SPEED_MIN,
  SAFE_X,
  SAFE_Y,
  SAUCER_AIM_ERROR,
  SAUCER_BULLET_LIFE,
  SAUCER_BULLET_R,
  SAUCER_BULLET_SPEED,
  SAUCER_FIRE_INTERVAL,
  SAUCER_FIRST_DELAY,
  SAUCER_GAP_MAX,
  SAUCER_GAP_MIN,
  SAUCER_LIFETIME,
  SAUCER_R,
  SAUCER_SPEED,
  SAUCER_WEAVE_INTERVAL,
  SAUCER_WEAVE_SPEED,
  SCORE_LARGE,
  SCORE_MEDIUM,
  SCORE_SAUCER,
  SCORE_SMALL,
  SHATTER_DEBUG_VERSION,
  SHIP_DRAG_HALFLIFE,
  SHIP_MAX,
  SHIP_R,
  SHIP_THRUST,
  SHIP_TURN,
  SOFTEN,
  SPLIT_KICK,
  STAR_X,
  STAR_Y,
  START_LIVES,
  TAGLINE_TEXT,
  TICK_DT,
  TITLE_ITEMS,
  TITLE_TEXT,
  TORPEDO_CONE,
  TORPEDO_LIFE,
  TORPEDO_R,
  TORPEDO_RECHARGE,
  TORPEDO_SCATTER,
  TORPEDO_SPEED,
  TORPEDO_TURN,
  TRAIL_TICKS,
  WAVE_BANNER_TIME,
  WAVE_BASE_ROCKS,
  WAVE_MIN_SHIP_DIST,
  WAVE_MIN_STAR_DIST,
  WAVE_SPEED_CAP,
  WAVE_SPEED_STEP,
  type RockSize,
} from "./constants";

export type Screen = "title" | "howto" | "playing" | "paused" | "gameover";
export type SaucerEdge = "left" | "right";
export type FieldEdge = "top" | "bottom" | "left" | "right";
export interface ShipState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly angle: number;
  readonly thrusting: boolean;
  readonly invuln: number;
  readonly collision: boolean;
  readonly fireCooldown: number;
}
export interface BulletState {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly life: number;
}
export interface RockState {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly size: RockSize;
  readonly spin: number;
  readonly health: number;
  readonly flash: number;
}
export interface SaucerState {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly mind: boolean;
  readonly gun: boolean;
  readonly travel: boolean;
  readonly weave: 1 | -1;
  readonly fireClock: number;
  readonly weaveClock: number;
  readonly age: number;
}
export interface TorpedoState {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly heading: number;
  readonly life: number;
  readonly homing: boolean;
}
export interface ShatterState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly score: number;
  readonly lives: number;
  readonly wave: number;
  readonly waveBanner: number;
  readonly ship: ShipState;
  readonly bullets: readonly BulletState[];
  readonly rocks: readonly RockState[];
  readonly saucer: SaucerState | null;
  readonly enemyBullets: readonly BulletState[];
  readonly torpedoes: readonly TorpedoState[];
  readonly torpedoCharge: number;
  readonly waveSpawning: boolean;
  readonly saucerSpawning: boolean;
  readonly saucerClock: number;
  readonly saucerDue: number;
  readonly nextSaucerEdge: SaucerEdge | null;
  readonly nextSaucerRow: number | null;
  readonly nextSaucerAim: number | null;
  readonly nextRockSpeed: number | null;
  readonly nextRecycleEdge: FieldEdge | null;
  readonly tickClock: number;
  readonly nextId: number;
  readonly simTime: number;
  readonly muted: boolean;
  readonly trails: Readonly<Record<number, readonly Point[]>>;
  readonly extraLifeNotice: number;
  readonly pointerStarts: Readonly<Record<number, number>>;
  readonly fireQueued: boolean;
  readonly torpedoQueued: boolean;
}
interface Point {
  readonly x: number;
  readonly y: number;
}
type Mutable<T> = T extends readonly (infer U)[]
  ? Mutable<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: Mutable<T[K]> }
    : T;
type Work = Mutable<ShatterState>;
type View = DeepReadonly<ShatterState>;
type Snapshot = ReturnType<typeof snapshot>;
type Pose = (s: View) => ShatterState;
export interface ShatterDebugApi {
  readonly version: number;
  reset: Pose;
  snapshot: (s: View) => Snapshot;
  reconcile: Pose;
  menuItemRect: (s: View, index: number) => Rect | null;
  setScreen: (s: View, v: Screen) => ShatterState;
  setMenuIndex: (s: View, v: number) => ShatterState;
  setScore: (s: View, v: number) => ShatterState;
  setLives: (s: View, v: number) => ShatterState;
  setWave: (s: View, v: number) => ShatterState;
  setWaveBanner: (s: View, v: number) => ShatterState;
  setWaveSpawning: (s: View, v: boolean) => ShatterState;
  setSaucerSpawning: (s: View, v: boolean) => ShatterState;
  setSaucerDue: (s: View, v: number) => ShatterState;
  setShipPosition: (s: View, x: number, y: number) => ShatterState;
  setShipVelocity: (s: View, vx: number, vy: number) => ShatterState;
  setShipAngle: (s: View, v: number) => ShatterState;
  setShipInvuln: (s: View, v: number) => ShatterState;
  setFireCooldown: (s: View, v: number) => ShatterState;
  setShipCollision: (s: View, v: boolean) => ShatterState;
  addBullet: (
    s: View,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ) => ShatterState;
  removeBullet: (s: View, id: number) => ShatterState;
  clearBullets: Pose;
  addEnemyBullet: (
    s: View,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ) => ShatterState;
  removeEnemyBullet: (s: View, id: number) => ShatterState;
  clearEnemyBullets: Pose;
  addRock: (s: View, size: RockSize, x: number, y: number) => ShatterState;
  setRockVelocity: (
    s: View,
    id: number,
    vx: number,
    vy: number,
  ) => ShatterState;
  setRockHealth: (s: View, id: number, hp: number) => ShatterState;
  removeRock: (s: View, id: number) => ShatterState;
  clearRocks: Pose;
  addSaucer: (s: View, x: number, y: number) => ShatterState;
  setSaucerVelocity: (s: View, vx: number, vy: number) => ShatterState;
  setSaucerWeave: (s: View, v: 1 | -1) => ShatterState;
  removeSaucer: Pose;
  setSaucerMind: (s: View, v: boolean) => ShatterState;
  setSaucerGun: (s: View, v: boolean) => ShatterState;
  setSaucerTravel: (s: View, v: boolean) => ShatterState;
  setNextSaucerEdge: (s: View, v: SaucerEdge) => ShatterState;
  setNextSaucerRow: (s: View, v: number) => ShatterState;
  setNextSaucerAim: (s: View, v: number) => ShatterState;
  setNextRockSpeed: (s: View, v: number) => ShatterState;
  setNextRecycleEdge: (s: View, v: FieldEdge) => ShatterState;
  setTorpedoCharge: (s: View, v: number) => ShatterState;
  addTorpedo: (s: View, x: number, y: number, heading: number) => ShatterState;
  setTorpedoHeading: (s: View, id: number, heading: number) => ShatterState;
  setTorpedoHoming: (s: View, id: number, v: boolean) => ShatterState;
  removeTorpedo: (s: View, id: number) => ShatterState;
  clearTorpedoes: Pose;
}
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export const BACKGROUND = "#080d1c";
const TAU = Math.PI * 2;
const wrap = (v: number, size: number) => ((v % size) + size) % size;
const sep = (a: number, b: number, size: number) =>
  wrap(b - a + size / 2, size) - size / 2;
const distance = (a: Point, b: Point) =>
  Math.hypot(sep(a.x, b.x, FIELD_W), sep(a.y, b.y, FIELD_H));
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const finite = (v: number) => {
  if (!Number.isFinite(v)) throw new Error(`Expected finite number: ${v}`);
  return v;
};
const choice = <T extends string>(v: T, choices: readonly string[]): T => {
  if (!choices.includes(v)) throw new Error(`Invalid value: ${v}`);
  return v;
};
const bool = (v: boolean) => {
  if (typeof v !== "boolean") throw new Error(`Expected boolean: ${String(v)}`);
  return v;
};
const random = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const speed = (x: number, y: number) => Math.hypot(x, y);
const bearing = (a: Point, b: Point) =>
  Math.atan2(sep(a.y, b.y, FIELD_H), sep(a.x, b.x, FIELD_W));
const angleDelta = (a: number, b: number) =>
  ((((b - a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
const pull = (x: number, y: number) => {
  const dx = STAR_X - x,
    dy = STAR_Y - y,
    d = Math.hypot(dx, dy);
  const a = MU / Math.max(d, SOFTEN) ** 2;
  return d ? { x: (a * dx) / d, y: (a * dy) / d } : { x: 0, y: 0 };
};
const move = (x: number, y: number, vx: number, vy: number) => ({
  x: wrap(x + vx * TICK_DT, FIELD_W),
  y: wrap(y + vy * TICK_DT, FIELD_H),
});
function initial(muted = false): ShatterState {
  return {
    screen: "title",
    menuIndex: 0,
    score: 0,
    lives: START_LIVES,
    wave: 0,
    waveBanner: 0,
    ship: {
      x: SAFE_X,
      y: SAFE_Y,
      vx: 0,
      vy: 0,
      angle: FACE_UP,
      thrusting: false,
      invuln: 0,
      collision: true,
      fireCooldown: 0,
    },
    bullets: [],
    rocks: [],
    saucer: null,
    enemyBullets: [],
    torpedoes: [],
    torpedoCharge: 1,
    waveSpawning: true,
    saucerSpawning: true,
    saucerClock: 0,
    saucerDue: SAUCER_FIRST_DELAY,
    nextSaucerEdge: null,
    nextSaucerRow: null,
    nextSaucerAim: null,
    nextRockSpeed: null,
    nextRecycleEdge: null,
    tickClock: 0,
    nextId: 1,
    simTime: 0,
    muted,
    trails: {},
    extraLifeNotice: 0,
    pointerStarts: {},
    fireQueued: false,
    torpedoQueued: false,
  };
}
const clone = (s: View): Work => structuredClone(s) as Work;
const rect = (screen: Screen, index: number): Rect | null => {
  const count =
    screen === "title"
      ? TITLE_ITEMS.length
      : screen === "paused"
        ? PAUSE_ITEMS.length
        : screen === "gameover"
          ? GAMEOVER_ITEMS.length
          : 0;
  if (index < 0 || index >= count) return null;
  const top = screen === "title" ? 445 : screen === "paused" ? 330 : 400;
  return { x: FIELD_W / 2 - 175, y: top + index * 64, w: 350, h: 52 };
};
function snapshot(s: View) {
  return {
    version: SHATTER_DEBUG_VERSION,
    screen: s.screen,
    menuIndex: s.menuIndex,
    score: s.score,
    lives: s.lives,
    wave: s.wave,
    waveBanner: s.waveBanner,
    muted: s.muted,
    waveSpawning: s.waveSpawning,
    saucerSpawning: s.saucerSpawning,
    saucerClock: s.saucerClock,
    saucerDue: s.saucerDue,
    nextSaucerEdge: s.nextSaucerEdge,
    nextSaucerRow: s.nextSaucerRow,
    nextSaucerAim: s.nextSaucerAim,
    nextRockSpeed: s.nextRockSpeed,
    nextRecycleEdge: s.nextRecycleEdge,
    ship: { ...s.ship, speed: speed(s.ship.vx, s.ship.vy) },
    bullets: s.bullets.map((b) => ({ ...b })),
    rocks: s.rocks.map((r) => ({
      id: r.id,
      x: r.x,
      y: r.y,
      vx: r.vx,
      vy: r.vy,
      size: r.size,
      radius: ROCK_RADIUS[r.size],
      health: r.health,
    })),
    saucer: s.saucer ? { ...s.saucer } : null,
    enemyBullets: s.enemyBullets.map((b) => ({ ...b })),
    torpedoes: s.torpedoes.map((t) => ({ ...t })),
    torpedoCharge: s.torpedoCharge,
    torpedoReady: s.torpedoCharge === 1,
    simTime: s.simTime,
  };
}
function byId<T extends { id: number }>(items: readonly T[], id: number) {
  finite(id);
  const item = items.find((v) => v.id === id);
  if (!item) throw new Error(`Unknown entity id: ${id}`);
  return item;
}
function patchEntity<T extends { id: number }>(
  items: readonly T[],
  id: number,
  patch: Partial<T>,
): T[] {
  byId(items, id);
  return items.map((v) => (v.id === id ? { ...v, ...patch } : v));
}
function removeEntity<T extends { id: number }>(
  items: readonly T[],
  id: number,
): T[] {
  byId(items, id);
  return items.filter((v) => v.id !== id);
}
function newBullet(
  s: Work,
  x: number,
  y: number,
  vx: number,
  vy: number,
  enemy = false,
) {
  const b = {
    id: s.nextId++,
    x,
    y,
    vx,
    vy,
    life: enemy ? SAUCER_BULLET_LIFE : BULLET_LIFE,
  };
  (enemy ? s.enemyBullets : s.bullets).push(b);
  if (!enemy) s.trails[b.id] = [{ x, y }];
}
function newTorpedo(s: Work, x: number, y: number, heading: number) {
  s.torpedoes.push({
    id: s.nextId++,
    x,
    y,
    vx: TORPEDO_SPEED * Math.cos(heading),
    vy: TORPEDO_SPEED * Math.sin(heading),
    heading,
    life: TORPEDO_LIFE,
    homing: true,
  });
}
function newRock(
  s: Work,
  size: RockSize,
  x: number,
  y: number,
  vx = 0,
  vy = 0,
) {
  s.rocks.push({
    id: s.nextId++,
    size,
    x,
    y,
    vx,
    vy,
    spin: 0,
    health: ROCK_HEALTH[size],
    flash: 0,
  });
}
function newSaucer(
  s: Work,
  x: number,
  y: number,
  vx = SAUCER_SPEED,
  weave: 1 | -1 = 1,
) {
  s.saucer = {
    id: s.nextId++,
    x,
    y,
    vx,
    vy: 0,
    mind: true,
    gun: true,
    travel: true,
    weave,
    fireClock: SAUCER_FIRE_INTERVAL,
    weaveClock: SAUCER_WEAVE_INTERVAL,
    age: 0,
  };
}
function debugApi(): ShatterDebugApi {
  const scalar =
    (field: keyof ShatterState, check: (v: number) => number = finite) =>
    (s: View, v: number): ShatterState =>
      ({ ...s, [field]: check(v) }) as ShatterState;
  const shipScalar =
    (field: keyof ShipState) =>
    (s: View, v: number): ShatterState => ({
      ...s,
      ship: { ...s.ship, [field]: finite(v) },
    });
  const flag =
    (field: keyof ShatterState) =>
    (s: View, v: boolean): ShatterState =>
      ({ ...s, [field]: bool(v) }) as ShatterState;
  const saucerFlag =
    (field: keyof SaucerState) =>
    (s: View, v: boolean): ShatterState => ({
      ...s,
      saucer: { ...needSaucer(s), [field]: bool(v) },
    });
  const needSaucer = (s: View) => {
    if (!s.saucer) throw new Error("No saucer");
    return s.saucer;
  };
  return {
    version: SHATTER_DEBUG_VERSION,
    reset: (s) => initial(s.muted),
    snapshot,
    reconcile: (s) => ({ ...s }),
    menuItemRect: (s, i) => rect(s.screen, i),
    setScreen: (s, v) => ({
      ...s,
      screen: choice(v, ["title", "howto", "playing", "paused", "gameover"]),
    }),
    setMenuIndex: scalar("menuIndex"),
    setScore: scalar("score"),
    setLives: scalar("lives"),
    setWave: scalar("wave"),
    setWaveBanner: scalar("waveBanner"),
    setWaveSpawning: flag("waveSpawning"),
    setSaucerSpawning: flag("saucerSpawning"),
    setSaucerDue: scalar("saucerDue"),
    setShipPosition: (s, x, y) => ({
      ...s,
      ship: { ...s.ship, x: finite(x), y: finite(y) },
    }),
    setShipVelocity: (s, vx, vy) => ({
      ...s,
      ship: { ...s.ship, vx: finite(vx), vy: finite(vy) },
    }),
    setShipAngle: shipScalar("angle"),
    setShipInvuln: shipScalar("invuln"),
    setFireCooldown: shipScalar("fireCooldown"),
    setShipCollision: (s, v) => ({
      ...s,
      ship: { ...s.ship, collision: bool(v) },
    }),
    addBullet: (s, x, y, vx, vy) => {
      const n = clone(s);
      newBullet(n, finite(x), finite(y), finite(vx), finite(vy));
      return n;
    },
    removeBullet: (s, id) => ({ ...s, bullets: removeEntity(s.bullets, id) }),
    clearBullets: (s) => ({ ...s, bullets: [] }),
    addEnemyBullet: (s, x, y, vx, vy) => {
      const n = clone(s);
      newBullet(n, finite(x), finite(y), finite(vx), finite(vy), true);
      return n;
    },
    removeEnemyBullet: (s, id) => ({
      ...s,
      enemyBullets: removeEntity(s.enemyBullets, id),
    }),
    clearEnemyBullets: (s) => ({ ...s, enemyBullets: [] }),
    addRock: (s, size, x, y) => {
      const n = clone(s);
      newRock(
        n,
        choice(size, ["large", "medium", "small"]),
        finite(x),
        finite(y),
      );
      return n;
    },
    setRockVelocity: (s, id, vx, vy) => ({
      ...s,
      rocks: patchEntity(s.rocks, id, { vx: finite(vx), vy: finite(vy) }),
    }),
    setRockHealth: (s, id, hp) => {
      const r = byId(s.rocks, id);
      finite(hp);
      if (!Number.isInteger(hp) || hp < 1 || hp > ROCK_HEALTH[r.size])
        throw new Error("Invalid rock health");
      return { ...s, rocks: patchEntity(s.rocks, id, { health: hp }) };
    },
    removeRock: (s, id) => ({ ...s, rocks: removeEntity(s.rocks, id) }),
    clearRocks: (s) => ({ ...s, rocks: [] }),
    addSaucer: (s, x, y) => {
      const n = clone(s);
      newSaucer(n, finite(x), finite(y));
      return n;
    },
    setSaucerVelocity: (s, vx, vy) => ({
      ...s,
      saucer: { ...needSaucer(s), vx: finite(vx), vy: finite(vy) },
    }),
    setSaucerWeave: (s, v) => ({
      ...s,
      saucer: {
        ...needSaucer(s),
        weave:
          v === 1 || v === -1
            ? v
            : (() => {
                throw new Error("Invalid weave direction");
              })(),
      },
    }),
    removeSaucer: (s) => ({ ...s, saucer: null }),
    setSaucerMind: saucerFlag("mind"),
    setSaucerGun: saucerFlag("gun"),
    setSaucerTravel: saucerFlag("travel"),
    setNextSaucerEdge: (s, v) => ({
      ...s,
      nextSaucerEdge: choice(v, ["left", "right"]),
    }),
    setNextSaucerRow: scalar("nextSaucerRow"),
    setNextSaucerAim: scalar("nextSaucerAim"),
    setNextRockSpeed: scalar("nextRockSpeed"),
    setNextRecycleEdge: (s, v) => ({
      ...s,
      nextRecycleEdge: choice(v, ["top", "bottom", "left", "right"]),
    }),
    setTorpedoCharge: scalar("torpedoCharge"),
    addTorpedo: (s, x, y, h) => {
      const n = clone(s);
      newTorpedo(n, finite(x), finite(y), finite(h));
      return n;
    },
    setTorpedoHeading: (s, id, h) => {
      finite(h);
      return {
        ...s,
        torpedoes: patchEntity(s.torpedoes, id, {
          heading: h,
          vx: TORPEDO_SPEED * Math.cos(h),
          vy: TORPEDO_SPEED * Math.sin(h),
        }),
      };
    },
    setTorpedoHoming: (s, id, v) => ({
      ...s,
      torpedoes: patchEntity(s.torpedoes, id, { homing: bool(v) }),
    }),
    removeTorpedo: (s, id) => ({
      ...s,
      torpedoes: removeEntity(s.torpedoes, id),
    }),
    clearTorpedoes: (s) => ({ ...s, torpedoes: [] }),
  };
}
interface Controls {
  left: boolean;
  right: boolean;
  up: boolean;
  fire: boolean;
  torpedo: boolean;
}
interface Sound {
  play: (name: string) => void;
}
function award(s: Work, points: number, sound: Sound) {
  const old = s.score;
  s.score += points;
  const count =
    Math.floor(s.score / EXTRA_LIFE_STEP) - Math.floor(old / EXTRA_LIFE_STEP);
  if (count > 0) {
    s.lives += count;
    s.extraLifeNotice = 0.8;
    sound.play(CUES.extraLife);
  }
}
function placeWave(s: Work) {
  const multiplier =
    1 + Math.min(WAVE_SPEED_CAP, WAVE_SPEED_STEP * (s.wave - 1));
  const posed = s.nextRockSpeed;
  s.nextRockSpeed = null;
  for (let i = 0; i < WAVE_BASE_ROCKS + s.wave; i++) {
    let point: Point;
    do {
      point = { x: random(0, FIELD_W), y: random(0, FIELD_H) };
    } while (
      distance(point, s.ship) < WAVE_MIN_SHIP_DIST ||
      distance(point, { x: STAR_X, y: STAR_Y }) < WAVE_MIN_STAR_DIST
    );
    const a = random(0, TAU),
      v =
        (posed ?? random(ROCK_SPEED_MIN.large, ROCK_SPEED_MAX.large)) *
        multiplier;
    newRock(s, "large", point.x, point.y, Math.cos(a) * v, Math.sin(a) * v);
  }
}
function recycle(s: Work, r: Mutable<RockState>) {
  const edge =
    s.nextRecycleEdge ??
    (["top", "bottom", "left", "right"] as FieldEdge[])[
      Math.floor(random(0, 4))
    ];
  s.nextRecycleEdge = null;
  const base =
    s.nextRockSpeed ?? random(ROCK_SPEED_MIN[r.size], ROCK_SPEED_MAX[r.size]);
  s.nextRockSpeed = null;
  const p = random(0, edge === "top" || edge === "bottom" ? FIELD_W : FIELD_H);
  if (edge === "top") {
    r.x = p;
    r.y = 0;
    r.vx = 0;
    r.vy = base;
  } else if (edge === "bottom") {
    r.x = p;
    r.y = FIELD_H;
    r.vx = 0;
    r.vy = -base;
  } else if (edge === "left") {
    r.x = 0;
    r.y = p;
    r.vx = base;
    r.vy = 0;
  } else {
    r.x = FIELD_W;
    r.y = p;
    r.vx = -base;
    r.vy = 0;
  }
}
function destroyRock(
  s: Work,
  r: Mutable<RockState>,
  vx: number,
  vy: number,
  torpedo: boolean,
  sound: Sound,
) {
  s.rocks = s.rocks.filter((v) => v.id !== r.id);
  award(
    s,
    r.size === "large"
      ? SCORE_LARGE
      : r.size === "medium"
        ? SCORE_MEDIUM
        : SCORE_SMALL,
    sound,
  );
  sound.play(CUES.shatter);
  const child = ROCK_CHILD[r.size];
  if (child) {
    const d = Math.hypot(vx, vy) || 1,
      ux = vx / d,
      uy = vy / d,
      k = torpedo ? TORPEDO_SCATTER : SPLIT_KICK;
    for (const sign of [-1, 1])
      newRock(
        s,
        child,
        r.x,
        r.y,
        r.vx + sign * k * (torpedo ? ux : -uy),
        r.vy + sign * k * (torpedo ? uy : ux),
      );
  }
}
function leaveSaucer(s: Work) {
  s.saucer = null;
  s.saucerClock = 0;
  s.saucerDue = random(SAUCER_GAP_MIN, SAUCER_GAP_MAX);
}
function startSaucer(s: Work, sound: Sound) {
  const edge = s.nextSaucerEdge ?? (Math.random() < 0.5 ? "left" : "right");
  const row = s.nextSaucerRow ?? random(SAUCER_R, FIELD_H - SAUCER_R);
  s.nextSaucerEdge = null;
  s.nextSaucerRow = null;
  newSaucer(
    s,
    edge === "left" ? 0 : FIELD_W,
    row,
    edge === "left" ? SAUCER_SPEED : -SAUCER_SPEED,
    Math.random() < 0.5 ? 1 : -1,
  );
  s.saucerClock = 0;
  sound.play(CUES.saucer);
}
/** Segment against the nearest images of a toroidal target. Positions are unwrapped over one tick. */
function swept(a0: Point, a1: Point, b0: Point, b1: Point, r: number) {
  for (const ox of [-FIELD_W, 0, FIELD_W])
    for (const oy of [-FIELD_H, 0, FIELD_H]) {
      const dx = a0.x - b0.x - ox,
        dy = a0.y - b0.y - oy,
        rvx = a1.x - a0.x - (b1.x - b0.x),
        rvy = a1.y - a0.y - (b1.y - b0.y),
        den = rvx * rvx + rvy * rvy,
        t = den ? clamp(-(dx * rvx + dy * rvy) / den, 0, 1) : 0;
      if ((dx + t * rvx) ** 2 + (dy + t * rvy) ** 2 <= r * r) return true;
    }
  return false;
}
function coreContact(
  start: Point,
  vx: number,
  vy: number,
  radius: number,
): number | null {
  const dx = start.x - STAR_X,
    dy = start.y - STAR_Y;
  const r = CORE_R + radius;
  const c = dx * dx + dy * dy - r * r;
  if (c <= 0) return 0;
  const mx = vx * TICK_DT,
    my = vy * TICK_DT;
  const a = mx * mx + my * my;
  if (a === 0) return null;
  const b = 2 * (dx * mx + dy * my);
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const t = (-b - Math.sqrt(discriminant)) / (2 * a);
  return t >= 0 && t <= 1 ? t : null;
}
function tick(input: View, c: Controls, sound: Sound): ShatterState {
  const bus = sound;
  const played = new Set<string>();
  sound = {
    play(name) {
      if (!played.has(name)) {
        played.add(name);
        bus.play(name);
      }
    },
  };
  const s = clone(input);
  s.simTime += TICK_DT;
  if (s.screen !== "playing") return s;
  s.extraLifeNotice = Math.max(0, s.extraLifeNotice - TICK_DT);
  if (s.waveBanner > 0) {
    s.waveBanner = Math.max(0, s.waveBanner - TICK_DT);
    if (s.waveBanner === 0 && s.waveSpawning) placeWave(s);
  }
  s.torpedoCharge = Math.min(1, s.torpedoCharge + TICK_DT / TORPEDO_RECHARGE);
  const ship = s.ship;
  ship.invuln = Math.max(0, ship.invuln - TICK_DT);
  ship.fireCooldown = Math.max(0, ship.fireCooldown - 1);
  ship.angle += (Number(c.right) - Number(c.left)) * SHIP_TURN * TICK_DT;
  ship.thrusting = c.up;
  if (c.up) {
    ship.vx += Math.cos(ship.angle) * SHIP_THRUST * TICK_DT;
    ship.vy += Math.sin(ship.angle) * SHIP_THRUST * TICK_DT;
  }
  const drag = 0.5 ** (TICK_DT / SHIP_DRAG_HALFLIFE);
  ship.vx *= drag;
  ship.vy *= drag;
  const v = speed(ship.vx, ship.vy);
  if (v > SHIP_MAX) {
    ship.vx *= SHIP_MAX / v;
    ship.vy *= SHIP_MAX / v;
  }
  const shipStart = { x: ship.x, y: ship.y };
  Object.assign(ship, move(ship.x, ship.y, ship.vx, ship.vy));
  if (c.fire && ship.fireCooldown === 0 && s.bullets.length < MAX_BULLETS) {
    const ux = Math.cos(ship.angle),
      uy = Math.sin(ship.angle);
    newBullet(
      s,
      wrap(ship.x + ux * SHIP_R, FIELD_W),
      wrap(ship.y + uy * SHIP_R, FIELD_H),
      ship.vx + ux * MUZZLE_SPEED,
      ship.vy + uy * MUZZLE_SPEED,
    );
    ship.fireCooldown = FIRE_INTERVAL_TICKS;
    sound.play(CUES.fire);
  }
  if (c.torpedo && s.torpedoCharge === 1 && s.torpedoes.length === 0) {
    newTorpedo(
      s,
      wrap(ship.x + Math.cos(ship.angle) * SHIP_R, FIELD_W),
      wrap(ship.y + Math.sin(ship.angle) * SHIP_R, FIELD_H),
      ship.angle,
    );
    s.torpedoCharge = 0;
  }
  const rockStarts = new Map<number, Point>();
  for (const r of s.rocks) {
    rockStarts.set(r.id, { x: r.x, y: r.y });
    const a = pull(r.x, r.y);
    r.vx += a.x * TICK_DT;
    r.vy += a.y * TICK_DT;
    Object.assign(r, move(r.x, r.y, r.vx, r.vy));
    r.spin += TICK_DT * (r.id % 2 ? 0.55 : -0.48);
    r.flash = Math.max(0, r.flash - TICK_DT);
  }
  const bulletStarts = new Map<number, Point>();
  for (const group of [s.bullets, s.enemyBullets])
    for (const b of group) {
      bulletStarts.set(b.id, { x: b.x, y: b.y });
      const a = pull(b.x, b.y);
      b.vx += a.x * TICK_DT;
      b.vy += a.y * TICK_DT;
      Object.assign(b, move(b.x, b.y, b.vx, b.vy));
      b.life -= TICK_DT;
      if (group === s.bullets) {
        const trail = s.trails[b.id] ?? [];
        trail.push({ x: b.x, y: b.y });
        if (trail.length > TRAIL_TICKS + 1) trail.shift();
        s.trails[b.id] = trail;
      }
    }
  const saucerStart = s.saucer ? { x: s.saucer.x, y: s.saucer.y } : null;
  if (s.saucer) {
    const q = s.saucer;
    q.age += TICK_DT;
    q.weaveClock -= TICK_DT;
    q.fireClock -= TICK_DT;
    if (q.mind && q.weaveClock <= 0) {
      q.vy = (q.vy === 0 ? q.weave : -Math.sign(q.vy)) * SAUCER_WEAVE_SPEED;
      q.weaveClock += SAUCER_WEAVE_INTERVAL;
    }
    if (q.mind) {
      const nextX = q.x + q.vx * TICK_DT,
        nextY = q.y + q.vy * TICK_DT,
        dx = nextX - STAR_X,
        dy = nextY - STAR_Y;
      if (Math.hypot(dx, dy) < CORE_R + SAUCER_R + 20) {
        q.vy = (dy >= 0 ? 1 : -1) * SAUCER_WEAVE_SPEED;
        q.weave = dy >= 0 ? 1 : -1;
      }
    }
    if (q.travel) Object.assign(q, move(q.x, q.y, q.vx, q.vy));
    if (q.mind && q.travel) {
      const dx = q.x - STAR_X,
        dy = q.y - STAR_Y;
      const d = Math.hypot(dx, dy);
      if (d < CORE_R + SAUCER_R) {
        const nx = d === 0 ? 1 : dx / d,
          ny = d === 0 ? 0 : dy / d;
        q.x = STAR_X + nx * (CORE_R + SAUCER_R);
        q.y = STAR_Y + ny * (CORE_R + SAUCER_R);
      }
    }
    if (q.gun && q.fireClock <= 0) {
      const a =
        bearing(q, ship) +
        (s.nextSaucerAim ?? random(-SAUCER_AIM_ERROR, SAUCER_AIM_ERROR));
      s.nextSaucerAim = null;
      newBullet(
        s,
        q.x,
        q.y,
        q.vx + SAUCER_BULLET_SPEED * Math.cos(a),
        q.vy + SAUCER_BULLET_SPEED * Math.sin(a),
        true,
      );
      const shot = s.enemyBullets[s.enemyBullets.length - 1];
      bulletStarts.set(shot.id, { x: shot.x, y: shot.y });
      const gravity = pull(shot.x, shot.y);
      shot.vx += gravity.x * TICK_DT;
      shot.vy += gravity.y * TICK_DT;
      Object.assign(shot, move(shot.x, shot.y, shot.vx, shot.vy));
      shot.life -= TICK_DT;
      q.fireClock += SAUCER_FIRE_INTERVAL;
    }
    if (q.age >= SAUCER_LIFETIME) leaveSaucer(s);
  } else {
    s.saucerClock += TICK_DT;
    if (s.saucerSpawning && s.saucerClock >= s.saucerDue) startSaucer(s, sound);
  }
  const torpedoStarts = new Map<number, Point>();
  for (const t of s.torpedoes) {
    torpedoStarts.set(t.id, { x: t.x, y: t.y });
    if (t.homing) {
      let target: Point | null = null,
        best = Infinity;
      const bodies: Point[] = s.saucer ? [...s.rocks, s.saucer] : s.rocks;
      for (const body of bodies) {
        const d = distance(t, body),
          a = bearing(t, body);
        if (d < best && Math.abs(angleDelta(t.heading, a)) <= TORPEDO_CONE) {
          target = body;
          best = d;
        }
      }
      if (target)
        t.heading += clamp(
          angleDelta(t.heading, bearing(t, target)),
          -TORPEDO_TURN * TICK_DT,
          TORPEDO_TURN * TICK_DT,
        );
    }
    t.vx = TORPEDO_SPEED * Math.cos(t.heading);
    t.vy = TORPEDO_SPEED * Math.sin(t.heading);
    Object.assign(t, move(t.x, t.y, t.vx, t.vy));
    t.life -= TICK_DT;
  }
  // Core contact uses the direct star, while body-to-body impacts use toroidal images.
  const star = { x: STAR_X, y: STAR_Y };
  const coreHit = coreContact(shipStart, ship.vx, ship.vy, SHIP_R);
  if (coreHit !== null) {
    const hx = shipStart.x + ship.vx * TICK_DT * coreHit;
    const hy = shipStart.y + ship.vy * TICK_DT * coreHit;
    const d = Math.hypot(hx - STAR_X, hy - STAR_Y);
    const nx = d === 0 ? 1 : (hx - STAR_X) / d;
    const ny = d === 0 ? 0 : (hy - STAR_Y) / d;
    const inward = ship.vx * nx + ship.vy * ny;
    if (inward < 0) {
      ship.vx -= inward * nx;
      ship.vy -= inward * ny;
    }
    const remaining = (1 - coreHit) * TICK_DT;
    const tx = hx + nx * 0.001 + ship.vx * remaining;
    const ty = hy + ny * 0.001 + ship.vy * remaining;
    const td = Math.hypot(tx - STAR_X, ty - STAR_Y);
    ship.x = wrap(
      td < CORE_R + SHIP_R
        ? STAR_X + ((tx - STAR_X) / td) * (CORE_R + SHIP_R)
        : tx,
      FIELD_W,
    );
    ship.y = wrap(
      td < CORE_R + SHIP_R
        ? STAR_Y + ((ty - STAR_Y) / td) * (CORE_R + SHIP_R)
        : ty,
      FIELD_H,
    );
  }
  for (const r of s.rocks) {
    const p = rockStarts.get(r.id) ?? r;
    if (
      swept(
        p,
        { x: p.x + r.vx * TICK_DT, y: p.y + r.vy * TICK_DT },
        star,
        star,
        CORE_R + ROCK_RADIUS[r.size],
      )
    )
      recycle(s, r);
  }
  const projectileGroups: [
    Mutable<BulletState>[] | Mutable<TorpedoState>[],
    "bullet" | "enemy" | "torpedo",
  ][] = [
    [s.bullets, "bullet"],
    [s.enemyBullets, "enemy"],
    [s.torpedoes, "torpedo"],
  ];
  for (const [group, kind] of projectileGroups) {
    for (const p of [...group]) {
      const start =
        (kind === "torpedo" ? torpedoStarts : bulletStarts).get(p.id) ?? p;
      const end = { x: start.x + p.vx * TICK_DT, y: start.y + p.vy * TICK_DT };
      let hit =
        p.life <= 0 ||
        swept(
          start,
          end,
          star,
          star,
          CORE_R +
            (kind === "torpedo"
              ? TORPEDO_R
              : kind === "enemy"
                ? SAUCER_BULLET_R
                : BULLET_R),
        );
      if (!hit && kind !== "enemy") {
        for (const r of [...s.rocks]) {
          const rp = rockStarts.get(r.id) ?? r;
          if (
            swept(
              start,
              end,
              rp,
              { x: rp.x + r.vx * TICK_DT, y: rp.y + r.vy * TICK_DT },
              ROCK_RADIUS[r.size] + (kind === "torpedo" ? TORPEDO_R : BULLET_R),
            )
          ) {
            hit = true;
            if (kind === "torpedo" || r.health === 1)
              destroyRock(s, r, p.vx, p.vy, kind === "torpedo", sound);
            else {
              r.health--;
              r.flash = HIT_FLASH_TIME;
            }
            break;
          }
        }
        if (
          !hit &&
          s.saucer &&
          saucerStart &&
          swept(
            start,
            end,
            saucerStart,
            {
              x: saucerStart.x + s.saucer.vx * TICK_DT,
              y: saucerStart.y + s.saucer.vy * TICK_DT,
            },
            SAUCER_R + (kind === "torpedo" ? TORPEDO_R : BULLET_R),
          )
        ) {
          hit = true;
          leaveSaucer(s);
          award(s, SCORE_SAUCER, sound);
        }
      }
      if (
        !hit &&
        kind === "enemy" &&
        ship.collision &&
        ship.invuln === 0 &&
        swept(
          start,
          end,
          shipStart,
          {
            x: shipStart.x + ship.vx * TICK_DT,
            y: shipStart.y + ship.vy * TICK_DT,
          },
          SHIP_R + SAUCER_BULLET_R,
        )
      ) {
        hit = true;
        killShip(s, sound);
      }
      if (hit) {
        const idx = group.findIndex((v) => v.id === p.id);
        if (idx >= 0) group.splice(idx, 1);
        delete s.trails[p.id];
      }
    }
  }
  if (s.screen === "playing" && ship.collision && ship.invuln === 0) {
    for (const r of s.rocks) {
      const rp = rockStarts.get(r.id) ?? r;
      if (
        swept(
          shipStart,
          {
            x: shipStart.x + ship.vx * TICK_DT,
            y: shipStart.y + ship.vy * TICK_DT,
          },
          rp,
          { x: rp.x + r.vx * TICK_DT, y: rp.y + r.vy * TICK_DT },
          SHIP_R + ROCK_RADIUS[r.size],
        )
      ) {
        killShip(s, sound);
        break;
      }
    }
    if (
      s.screen === "playing" &&
      s.saucer &&
      saucerStart &&
      swept(
        shipStart,
        {
          x: shipStart.x + ship.vx * TICK_DT,
          y: shipStart.y + ship.vy * TICK_DT,
        },
        saucerStart,
        {
          x: saucerStart.x + s.saucer.vx * TICK_DT,
          y: saucerStart.y + s.saucer.vy * TICK_DT,
        },
        SHIP_R + SAUCER_R,
      )
    )
      killShip(s, sound);
  }
  if (
    s.screen === "playing" &&
    s.waveSpawning &&
    input.rocks.length > 0 &&
    s.rocks.length === 0 &&
    s.waveBanner === 0
  ) {
    s.wave++;
    s.waveBanner = WAVE_BANNER_TIME;
  }
  return s;
}
function killShip(s: Work, sound: Sound) {
  if (s.screen !== "playing" || !s.ship.collision || s.ship.invuln > 0) return;
  s.lives--;
  sound.play(CUES.death);
  if (s.lives <= 0) {
    s.screen = "gameover";
    s.menuIndex = 0;
  } else {
    s.ship = {
      x: SAFE_X,
      y: SAFE_Y,
      vx: 0,
      vy: 0,
      angle: FACE_UP,
      thrusting: false,
      invuln: INVULN_TIME,
      collision: true,
      fireCooldown: 0,
    };
    s.torpedoCharge = 1;
  }
}
function newGame(muted: boolean): ShatterState {
  const s = clone(initial(muted));
  s.screen = "playing";
  s.wave = 1;
  placeWave(s);
  return s;
}
function menuAction(s: ShatterState): ShatterState {
  if (s.screen === "title")
    return s.menuIndex === 0 ? newGame(s.muted) : { ...s, screen: "howto" };
  if (s.screen === "paused")
    return s.menuIndex === 0
      ? { ...s, screen: "playing", menuIndex: 0 }
      : s.menuIndex === 1
        ? newGame(s.muted)
        : { ...initial(s.muted), screen: "title" };
  if (s.screen === "gameover")
    return s.menuIndex === 0
      ? newGame(s.muted)
      : { ...initial(s.muted), screen: "title" };
  return s;
}
function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color = "#e8f5ff",
  align: CanvasTextAlign = "center",
  weight = "600",
) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}
function drawStar(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createRadialGradient(
    STAR_X,
    STAR_Y,
    CORE_R * 0.4,
    STAR_X,
    STAR_Y,
    HALO_R * 1.5,
  );
  gradient.addColorStop(0, "#fff7ce");
  gradient.addColorStop(0.17, "#ffd376");
  gradient.addColorStop(0.35, "#bf6785aa");
  gradient.addColorStop(0.7, "#65449a3d");
  gradient.addColorStop(1, "#65449a00");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(STAR_X, STAR_Y, HALO_R * 1.5, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#fbc58a";
  ctx.lineWidth = 2;
  for (const radius of [CORE_R + 4, CORE_R + 13, CORE_R + 32]) {
    ctx.globalAlpha = radius === CORE_R + 4 ? 0.65 : 0.18;
    ctx.beginPath();
    ctx.arc(STAR_X, STAR_Y, radius, 0, TAU);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff5d4";
  ctx.beginPath();
  ctx.arc(STAR_X, STAR_Y, CORE_R, 0, TAU);
  ctx.fill();
}
function copies(
  x: number,
  y: number,
  r: number,
  draw: (x: number, y: number) => void,
) {
  for (const dx of x < r ? [FIELD_W, 0] : x > FIELD_W - r ? [-FIELD_W, 0] : [0])
    for (const dy of y < r
      ? [FIELD_H, 0]
      : y > FIELD_H - r
        ? [-FIELD_H, 0]
        : [0])
      draw(x + dx, y + dy);
}
function drawShip(
  ctx: CanvasRenderingContext2D,
  ship: ShipState,
  time: number,
) {
  if (ship.invuln > 0 && Math.floor(time * 9) % 2 === 0) ctx.globalAlpha = 0.42;
  copies(ship.x, ship.y, 24, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ship.angle);
    if (ship.thrusting) {
      ctx.fillStyle = "#ff9d5d";
      ctx.beginPath();
      ctx.moveTo(-13, -7);
      ctx.lineTo(-31 - Math.sin(time * 37) * 5, 0);
      ctx.lineTo(-13, 7);
      ctx.fill();
    }
    ctx.fillStyle = "#10243e";
    ctx.strokeStyle = "#b9f5fa";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-14, -13);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-14, 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#86e9e8";
    ctx.beginPath();
    ctx.arc(3, 0, 3, 0, TAU);
    ctx.fill();
    ctx.restore();
  });
  ctx.globalAlpha = 1;
}
function drawRock(ctx: CanvasRenderingContext2D, r: RockState) {
  const radius = ROCK_RADIUS[r.size],
    damage = 1 - r.health / ROCK_HEALTH[r.size];
  copies(r.x, r.y, radius + 4, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r.spin);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (TAU * i) / 10,
        rr = radius * (i % 3 === 0 ? 0.84 : i % 4 === 0 ? 1.04 : 0.95);
      if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
      else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fillStyle =
      r.flash > 0
        ? "#fff1d2"
        : damage > 0.5
          ? "#6e4050"
          : damage > 0
            ? "#504a62"
            : "#303f55";
    ctx.strokeStyle =
      r.flash > 0 ? "#fff6db" : damage > 0 ? "#fa9a79" : "#8ea9be";
    ctx.lineWidth = 2.5;
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = damage > 0 ? "#ff9d76" : "#61758b";
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.42, -radius * 0.1);
    ctx.lineTo(-radius * 0.04, radius * 0.15);
    ctx.lineTo(radius * 0.24, -radius * 0.22);
    if (damage > 0) {
      ctx.moveTo(-radius * 0.04, radius * 0.15);
      ctx.lineTo(radius * 0.15, radius * 0.55);
    }
    ctx.stroke();
    ctx.restore();
  });
}
function drawSaucer(ctx: CanvasRenderingContext2D, s: SaucerState) {
  copies(s.x, s.y, 30, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#153f4b";
    ctx.strokeStyle = "#77e6d9";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 3, 25, 8, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, -3, 12, 10, 0, Math.PI, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffcf7b";
    for (const px of [-15, 0, 15]) {
      ctx.beginPath();
      ctx.arc(px, 5, 2, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  });
}
function drawTrail(ctx: CanvasRenderingContext2D, points: readonly Point[]) {
  if (points.length < 2) return;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1],
      b = points[i],
      dx = sep(a.x, b.x, FIELD_W),
      dy = sep(a.y, b.y, FIELD_H);
    ctx.strokeStyle = `rgba(140,225,255,${(0.68 * i) / points.length})`;
    ctx.lineWidth = 0.4 + (3 * i) / points.length;
    ctx.lineCap = "round";
    for (const ox of [-FIELD_W, 0, FIELD_W])
      for (const oy of [-FIELD_H, 0, FIELD_H]) {
        ctx.beginPath();
        ctx.moveTo(a.x + ox, a.y + oy);
        ctx.lineTo(a.x + dx + ox, a.y + dy + oy);
        ctx.stroke();
      }
  }
}
function drawField(s: View, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  for (let i = 0; i < 95; i++) {
    const x = (i * 797 + 43) % FIELD_W,
      y = (i * 431 + 97) % FIELD_H;
    ctx.fillStyle = i % 7 === 0 ? "#4b6587" : "#263b5b";
    ctx.fillRect(x, y, i % 9 === 0 ? 2 : 1, i % 9 === 0 ? 2 : 1);
  }
  ctx.strokeStyle = "#15253b";
  ctx.lineWidth = 1;
  for (let x = 40; x < FIELD_W; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, FIELD_H);
    ctx.stroke();
  }
  for (let y = 40; y < FIELD_H; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(FIELD_W, y);
    ctx.stroke();
  }
  drawStar(ctx);
  for (const r of s.rocks) drawRock(ctx, r);
  if (s.saucer) drawSaucer(ctx, s.saucer);
  for (const b of s.bullets) {
    drawTrail(ctx, s.trails[b.id] ?? []);
    copies(b.x, b.y, 5, (x, y) => {
      ctx.fillStyle = "#e8faff";
      ctx.beginPath();
      ctx.arc(x, y, BULLET_R, 0, TAU);
      ctx.fill();
    });
  }
  for (const b of s.enemyBullets)
    copies(b.x, b.y, 5, (x, y) => {
      ctx.fillStyle = "#ff877d";
      ctx.beginPath();
      ctx.arc(x, y, SAUCER_BULLET_R, 0, TAU);
      ctx.fill();
    });
  for (const t of s.torpedoes)
    copies(t.x, t.y, 12, (x, y) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(t.heading);
      ctx.fillStyle = "#ffc267";
      ctx.beginPath();
      ctx.moveTo(11, 0);
      ctx.lineTo(-5, -6);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-5, 6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#fff0bd";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    });
  drawShip(ctx, s.ship, s.simTime);
}
function drawHud(s: View, ctx: CanvasRenderingContext2D) {
  drawText(
    ctx,
    String(s.score).padStart(6, "0"),
    48,
    58,
    34,
    "#ecf6fd",
    "left",
    "700",
  );
  for (let i = 0; i < Math.max(0, s.lives - 1); i++) {
    ctx.save();
    ctx.translate(56 + i * 30, 92);
    ctx.rotate(FACE_UP);
    ctx.strokeStyle = "#a2eae8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
  drawText(
    ctx,
    "TORPEDO",
    48,
    149,
    15,
    s.torpedoCharge === 1 ? "#ffc989" : "#728291",
    "left",
    "700",
  );
  ctx.strokeStyle = "#6c8295";
  ctx.strokeRect(48, 160, 135, 7);
  ctx.fillStyle = s.torpedoCharge === 1 ? "#ffc989" : "#a0acae";
  ctx.fillRect(49, 161, 133 * s.torpedoCharge, 5);
  drawText(ctx, `WAVE ${s.wave}`, FIELD_W - 48, 56, 21, "#9bb2cb", "right");
  if (s.waveBanner > 0)
    drawText(
      ctx,
      `WAVE ${s.wave}`,
      FIELD_W / 2,
      FIELD_H / 2 + 112,
      55,
      "#f9e0b5",
    );
  if (s.extraLifeNotice > 0)
    drawText(ctx, "EXTRA SHIP", FIELD_W / 2, 175, 28, "#a8ffdd");
}
function drawMenu(
  ctx: CanvasRenderingContext2D,
  s: View,
  items: readonly string[],
) {
  items.forEach((item, i) => {
    const r = rect(s.screen, i);
    if (!r) return;
    ctx.fillStyle = i === s.menuIndex ? "#263c57" : "#111e31";
    ctx.strokeStyle = i === s.menuIndex ? "#a6e6e9" : "#3b526a";
    ctx.lineWidth = 2;
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.strokeRect(r.x, r.y, r.w, r.h);
    drawText(
      ctx,
      item,
      FIELD_W / 2,
      r.y + 35,
      24,
      i === s.menuIndex ? "#fff1d6" : "#a4bbcf",
    );
  });
}
function drawScreen(s: View, ctx: CanvasRenderingContext2D) {
  if (s.screen === "playing") {
    drawField(s, ctx);
    drawHud(s, ctx);
    return;
  }
  if (s.screen === "paused") {
    drawField(s, ctx);
    drawHud(s, ctx);
    ctx.fillStyle = "#07101dba";
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);
    drawText(ctx, "PAUSED", FIELD_W / 2, 234, 68, "#f2e6d0", "center", "800");
    drawMenu(ctx, s, PAUSE_ITEMS);
    return;
  }
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  drawStar(ctx);
  if (s.screen === "title") {
    drawText(
      ctx,
      TITLE_TEXT,
      FIELD_W / 2,
      260,
      112,
      "#f6eee0",
      "center",
      "900",
    );
    drawText(
      ctx,
      TAGLINE_TEXT,
      FIELD_W / 2,
      315,
      22,
      "#9ed5db",
      "center",
      "700",
    );
    drawMenu(ctx, s, TITLE_ITEMS);
  } else if (s.screen === "gameover") {
    drawText(
      ctx,
      "GAME OVER",
      FIELD_W / 2,
      238,
      75,
      "#f4ded4",
      "center",
      "800",
    );
    drawText(
      ctx,
      `SCORE ${s.score}    ·    WAVE ${s.wave}`,
      FIELD_W / 2,
      310,
      24,
      "#b3ced6",
    );
    drawMenu(ctx, s, GAMEOVER_ITEMS);
  } else {
    drawText(
      ctx,
      "HOW TO PLAY",
      FIELD_W / 2,
      96,
      52,
      "#f6eee0",
      "center",
      "800",
    );
    const lines = [
      "Shatter every rock and its fragments to clear the wave.",
      "Large rocks wear armor. Damage shows before they break.",
      "The star bends bullets and rocks, but never your ship.",
      "Rocks swallowed by the core return from the field's edge.",
      "The saucer hunts you. Shoot it down before it fires again.",
      "F launches one guided torpedo: aim its narrow forward cone.",
      "It flies true through the well, breaks any rock, and recharges in 10 seconds.",
      "ARROWS or WASD turn and thrust  ·  SPACE fires  ·  F torpedo",
      "ENTER selects  ·  ESC goes back  ·  P pauses  ·  M mutes",
    ];
    lines.forEach((line, i) =>
      drawText(
        ctx,
        line,
        FIELD_W / 2,
        175 + i * 48,
        i > 6 ? 22 : 24,
        i > 6 ? "#a2e2e2" : "#dae5e8",
      ),
    );
    drawText(
      ctx,
      "PRESS ENTER OR ESC TO RETURN",
      FIELD_W / 2,
      674,
      17,
      "#c8a97d",
    );
  }
}
export const game: Game<ShatterState, ShatterDebugApi> = {
  initialize(api: InitApi<ShatterState>) {
    for (const action of ACTIONS) api.input.register(action, BINDINGS[action]);
    api.audio.define(CUES.fire, {
      wave: "triangle",
      freq: 880,
      freqTo: 430,
      durationMs: 80,
      gain: 0.08,
    });
    api.audio.define(CUES.shatter, {
      wave: "sawtooth",
      freq: 200,
      freqTo: 60,
      durationMs: 220,
      gain: 0.12,
    });
    api.audio.define(CUES.thrust, {
      wave: "sawtooth",
      freq: 84,
      durationMs: 100,
      gain: 0.035,
    });
    api.audio.define(CUES.saucer, {
      wave: "sine",
      freq: 380,
      freqTo: 640,
      durationMs: 240,
      gain: 0.09,
    });
    api.audio.define(CUES.death, {
      wave: "sawtooth",
      freq: 300,
      freqTo: 40,
      durationMs: 420,
      gain: 0.15,
    });
    api.audio.define(CUES.extraLife, {
      wave: "triangle",
      freq: 520,
      freqTo: 1040,
      durationMs: 400,
      gain: 0.1,
    });
    const d = api.diagnostics;
    d.register("screen", (s) => s.screen);
    d.register("score", (s) => s.score);
    d.register("lives", (s) => s.lives);
    d.register("wave", (s) => s.wave);
    d.register(
      "ship pos",
      (s) => `${s.ship.x.toFixed(1)}, ${s.ship.y.toFixed(1)}`,
    );
    d.register(
      "ship velocity",
      (s) => `${s.ship.vx.toFixed(1)}, ${s.ship.vy.toFixed(1)}`,
    );
    d.register("ship speed", (s) => speed(s.ship.vx, s.ship.vy));
    d.register("ship facing", (s) => s.ship.angle);
    d.register("ship grace", (s) => s.ship.invuln);
    d.register("bullets", (s) => s.bullets.length);
    d.register("rocks", (s) => s.rocks.length);
    d.register("saucer", (s) =>
      s.saucer ? `${s.saucer.x.toFixed(1)}, ${s.saucer.y.toFixed(1)}` : "none",
    );
    d.register("torpedo charge", (s) => s.torpedoCharge);
    d.register("torpedoes", (s) => s.torpedoes.length);
    d.register("sim time", (s) => s.simTime);
    return [initial(), debugApi()];
  },
  update(input: View, api: UpdateApi, dt: number) {
    let s: ShatterState = { ...input, muted: api.audio.muted() };
    if (api.input.pressed("mute")) {
      api.audio.setMuted(!api.audio.muted());
      s = { ...s, muted: api.audio.muted() };
    }
    const back = api.input.pressed("back"),
      pause = api.input.pressed("pause"),
      up = api.input.pressed("up"),
      down = api.input.pressed("down"),
      confirm = api.input.pressed("confirm");
    const torpedo = api.input.pressed("b");
    const firePress = api.input.pressed("a");
    if (s.screen === "playing" && pause)
      s = { ...s, screen: "paused", menuIndex: 0 };
    else if (s.screen === "paused" && (pause || back))
      s = { ...s, screen: "playing", menuIndex: 0 };
    else if (s.screen === "howto" && (back || confirm))
      s = { ...s, screen: "title" };
    else if (s.screen === "gameover" && back)
      s = { ...initial(s.muted), screen: "title" };
    else if (
      s.screen === "title" ||
      s.screen === "paused" ||
      s.screen === "gameover"
    ) {
      const items =
        s.screen === "title"
          ? TITLE_ITEMS
          : s.screen === "paused"
            ? PAUSE_ITEMS
            : GAMEOVER_ITEMS;
      let index =
        (s.menuIndex + Number(down) - Number(up) + items.length) % items.length;
      s = { ...s, menuIndex: index };
      const keyConfirm = confirm;
      if (keyConfirm) s = menuAction(s);
      else {
        const starts = { ...s.pointerStarts };
        let pointerConfirm = false;
        const samples = api.input.pointerSamples();
        for (const sample of samples) {
          const hit = items.findIndex((_, i) => {
            const r = rect(s.screen, i);
            return (
              !!r &&
              sample.x >= r.x &&
              sample.x <= r.x + r.w &&
              sample.y >= r.y &&
              sample.y <= r.y + r.h
            );
          });
          if (hit >= 0 && sample.type !== "up") index = hit;
          if (sample.type === "down") starts[sample.id] = hit;
          if (sample.type === "up") {
            if (hit >= 0 && starts[sample.id] === hit) {
              index = hit;
              pointerConfirm = true;
            }
            delete starts[sample.id];
          }
        }
        const pointer = api.input.pointer();
        if (pointer.device !== "touch") {
          const hit = items.findIndex((_, i) => {
            const r = rect(s.screen, i);
            return (
              !!r &&
              pointer.x >= r.x &&
              pointer.x <= r.x + r.w &&
              pointer.y >= r.y &&
              pointer.y <= r.y + r.h
            );
          });
          if (hit >= 0) index = hit;
        }
        s = { ...s, menuIndex: index, pointerStarts: starts };
        if (pointerConfirm) s = menuAction(s);
      }
    }
    const controls = {
      left: api.input.value("left") > 0,
      right: api.input.value("right") > 0,
      up: api.input.value("up") > 0,
      fire: api.input.value("a") > 0 || s.fireQueued || firePress,
      torpedo: torpedo || s.torpedoQueued,
    };
    if (s.screen === "playing" && controls.up) {
      if (!api.audio.looping(CUES.thrust)) api.audio.loop(CUES.thrust);
    } else if (api.audio.looping(CUES.thrust)) api.audio.stop(CUES.thrust);
    let clock = s.tickClock + Math.max(0, dt);
    const sound: Sound = { play: (name) => api.audio.play(name) };
    let ranTick = false;
    while (clock + 1e-10 >= TICK_DT) {
      s = tick(s, controls, sound);
      clock -= TICK_DT;
      controls.torpedo = false;
      ranTick = true;
    }
    return {
      ...s,
      tickClock: Math.max(0, clock),
      muted: api.audio.muted(),
      fireQueued: ranTick ? false : controls.fire,
      torpedoQueued: ranTick ? false : controls.torpedo,
    };
  },
  render(s: View, api: RenderApi) {
    drawScreen(s, api.ctx);
  },
};
