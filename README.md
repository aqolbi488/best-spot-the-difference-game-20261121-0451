# best-spot-the-difference-game-20261121-0451

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/aqolbi488/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/aqolbi488/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

**Twin Lanterns** — a spot-the-difference game. Two near-identical pictures
hang side by side; small things changed between them. Find them all before
the lantern burns down.

Three original hand-drawn scenes, rising in difficulty: **Harbour at Dawn**
(7 differences), **Night Market** (9), and **Mountain Observatory** (12).
Every picture is drawn in code on canvas — no copied art, no image files.
Click a difference (or move the crosshair with the arrow keys and press
Enter) to mark it with a green ring and a chime. Wrong clicks cost points
and seconds. H asks for a hint (3 per set, with a cooldown), a countdown
timer keeps the pressure on, and each set ends with a results screen
showing time, accuracy and score. Sounds are synthesised with WebAudio —
no audio files, no network.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. The game is plain
static files under `game/` and plays with no network request.

## Screenshots

Deterministic states via URL query params: `?shot=start`, `?shot=play`
(3 differences already found, 4 to go) and `?shot=end` (set complete),
each with `&seed=1`. The screenshots in `screenshots/` were taken from
those states in a real browser.

---

Built for [make.fun](https://make.fun/r/msc0ap6f) — enter the bounty yourself with my referral link: https://make.fun/r/msc0ap6f
