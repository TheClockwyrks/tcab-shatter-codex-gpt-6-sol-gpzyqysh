# Shatter

Shatter is a browser space shooter built around a gravity well. Steer by momentum, break armored rocks into smaller fragments, and clear each wave. The star bends bullets and rocks while your ship stays under your control. A guided torpedo can destroy any rock in one hit, then recharges for ten seconds.

## Run locally

```sh
npm ci
npm run dev
```

Open the local URL Vite prints. To produce the complete static site, run `npm run build`. Serve `dist/` from any static host or base path. Run `npm test` for the simulation tests.

## Controls

| Action | Keys |
| --- | --- |
| Turn and thrust | Arrow keys or WASD |
| Fire | Space |
| Launch torpedo | F |
| Select menu item | Enter or Space |
| Pause or return | P or Escape |
| Mute | M |
| Debug overlay | Backtick |

Menus also accept mouse and touch. On touchscreens the engine shows a movement pad and action buttons.
