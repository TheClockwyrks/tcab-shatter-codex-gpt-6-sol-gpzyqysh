import { createCanvas } from "@napi-rs/canvas";
import { ConstantClock, createEngine } from "@clockwyrks/simple-2d";
import { describe, expect, it } from "vitest";
import { FIELD_H, FIELD_W, MU, SOFTEN, TICK_DT } from "./constants";
import { BACKGROUND, game } from "./game";

async function setup() {
  const canvas = createCanvas(FIELD_W, FIELD_H) as unknown as HTMLCanvasElement;
  const engine = createEngine({
    canvas,
    width: FIELD_W,
    height: FIELD_H,
    game,
    background: BACKGROUND,
    clock: new ConstantClock(TICK_DT * 1000),
    surface: {
      cssWidth: () => FIELD_W,
      cssHeight: () => FIELD_H,
      dpr: () => 1,
      events: () => new EventTarget(),
    },
  });
  await engine.initialize();
  engine.apply((s) => engine.debug.setScreen(s, "playing"));
  engine.apply((s) => engine.debug.setWaveSpawning(s, false));
  engine.apply((s) => engine.debug.setSaucerSpawning(s, false));
  engine.apply((s) => engine.debug.setShipCollision(s, false));
  return engine;
}

describe("Shatter simulation", () => {
  it("pulls a bullet by the softened inverse square law", async () => {
    const e = await setup();
    e.apply((s) => e.debug.addBullet(s, 840, 360, 0, 0));
    await e.advance(1);
    expect(e.state.bullets[0].vx).toBeCloseTo((-MU / (200 * 200)) * TICK_DT, 5);
    expect(e.state.bullets[0].x).toBeLessThan(840);
    e.destroy();
  });

  it("leaves the ship unpulled and lets a torpedo fly straight", async () => {
    const e = await setup();
    e.apply((s) => e.debug.setShipPosition(s, 840, 360));
    e.apply((s) => e.debug.addTorpedo(s, 850, 360, 0));
    await e.advance(1);
    expect(e.state.ship.x).toBe(840);
    expect(e.state.torpedoes[0].vx).toBe(420);
    expect(e.state.torpedoes[0].y).toBe(360);
    e.destroy();
  });

  it("chips armor before a kill, scores once, and creates two full health fragments", async () => {
    const e = await setup();
    e.apply((s) => e.debug.addRock(s, "large", 900, 500));
    for (let hit = 0; hit < 3; hit++) {
      e.apply((s) => e.debug.addBullet(s, 900, 500, 0, 0));
      await e.advance(1);
      if (hit < 2) {
        expect(e.state.rocks[0].health).toBe(2 - hit);
        expect(e.state.score).toBe(0);
      }
    }
    expect(e.state.score).toBe(20);
    expect(e.state.rocks.map((r) => r.size)).toEqual(["medium", "medium"]);
    expect(e.state.rocks.map((r) => r.health)).toEqual([2, 2]);
    e.destroy();
  });

  it("destroys an armored rock outright with the torpedo", async () => {
    const e = await setup();
    e.apply((s) => e.debug.addRock(s, "large", 900, 500));
    e.apply((s) => e.debug.addTorpedo(s, 900, 500, 0));
    await e.advance(1);
    expect(e.state.score).toBe(20);
    expect(e.state.rocks).toHaveLength(2);
    expect(e.state.torpedoes).toHaveLength(0);
    e.destroy();
  });

  it("keeps a paused field frozen while simulation time advances", async () => {
    const e = await setup();
    e.apply((s) => e.debug.addRock(s, "small", 250, 250));
    const id = e.state.rocks[0].id;
    e.apply((s) => e.debug.setRockVelocity(s, id, 100, 0));
    e.apply((s) => e.debug.setScreen(s, "paused"));
    await e.advance(120);
    expect(e.state.rocks[0].x).toBe(250);
    expect(e.state.simTime).toBeCloseTo(1, 5);
    e.destroy();
  });

  it("homes toward a forward target and ignores one behind", async () => {
    const e = await setup();
    e.apply((s) => e.debug.addRock(s, "small", 350, 300));
    e.apply((s) => e.debug.addRock(s, "small", 650, 320));
    e.apply((s) => e.debug.addTorpedo(s, 400, 300, 0));
    await e.advance(1);
    expect(e.state.torpedoes[0].heading).toBeGreaterThan(0);
    expect(e.state.torpedoes[0].heading).toBeLessThan(0.1);
    e.destroy();
  });

  it("reconciles a posed state without advancing or moving it", async () => {
    const e = await setup();
    e.apply((s) => e.debug.setShipVelocity(s, 3, 4));
    const before = e.debug.snapshot(e.state);
    e.apply((s) => e.debug.reconcile(s));
    expect(e.debug.snapshot(e.state)).toEqual(before);
    expect(e.debug.snapshot(e.state).ship.speed).toBe(5);
    e.destroy();
  });

  it("recycles a damaged rock without healing or scoring", async () => {
    const e = await setup();
    e.apply((s) => e.debug.addRock(s, "large", 640 + SOFTEN / 4, 360));
    const id = e.state.rocks[0].id;
    e.apply((s) => e.debug.setRockHealth(s, id, 1));
    e.apply((s) => e.debug.setNextRecycleEdge(s, "left"));
    e.apply((s) => e.debug.setNextRockSpeed(s, 75));
    await e.advance(1);
    expect(e.state.rocks[0]).toMatchObject({ id, x: 0, vx: 75, health: 1 });
    expect(e.state.score).toBe(0);
    e.destroy();
  });
});
