# burnr

A minimal incline treadmill calculator. Enter your body stats and workout parameters, get calories, steps, duration, and distance back instantly.

![dark terminal aesthetic, lime green accent](https://img.shields.io/badge/stack-Next.js%2016%20%7C%20TypeScript%20%7C%20Tailwind-c8f135?style=flat-square&labelColor=0d0d0d)

## Features

- Calorie estimate using MET values adjusted for incline and speed
- Step count using stride length formula scaled by incline
- Two input modes: **by distance** or **by time**
- Unit toggles for weight (kg / lbs), height (cm / in), distance (km / mi), and speed (km/h / m/s)
- Staggered result animations
- Scanline overlay, Bebas Neue + DM Mono typography

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS
- Google Fonts — Bebas Neue, DM Mono

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How the math works

**MET (Metabolic Equivalent of Task)**

```
speed_mmin = speed_kmh × 1000 / 60
MET = max(2.5, (speed_mmin × 0.1 + (incline/100) × speed_mmin × 1.8 + 3.5) / 3.5)
```

**Calories**

```
kcal = MET × weight_kg × duration_hours
```

**Stride length (incline-adjusted)**

```
stride_m = 0.413 × height_m × (1 − incline% × 0.004)
```

**Steps**

```
steps = distance_m / stride_m
```

Estimates are just that — estimates. Actual results vary by fitness level, terrain, and gait.

## License

MIT
