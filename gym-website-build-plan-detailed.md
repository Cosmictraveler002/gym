# Cinematic Gym Website — Detailed Agent Build Plan

## 0. Project Definition

### Core concept

Build a single-page, cinematic gym website where **video is the primary visual medium** and scroll acts like a lightweight directing mechanism.

The site should **not** feel like a conventional website with video backgrounds.

It should feel closer to an interactive sports film:

- footage carries the emotional weight;
- typography provides structure;
- scroll changes the composition;
- selected sections become physically responsive to scrolling;
- only a small number of moments use heavy GSAP/ScrollTrigger choreography;
- the natural camera language of each video is preserved.

The illusion of depth should come from:

- video layering;
- clipping and masking;
- controlled scaling;
- pinned sections;
- parallax;
- typography motion;
- negative space;
- carefully timed transitions.

No 3D/WebGL engine is required.

---

# 1. Visual Direction

## 1.1 Overall mood

- Dark
- Moody
- Athletic
- High contrast
- Cinematic
- Premium
- Editorial
- Restrained
- Physically grounded rather than flashy

### Color direction

Base:

- near-black
- charcoal
- desaturated neutrals

Accent:

- use one primary accent only
- candidate directions: muted red, electric blue, or acid green
- do not introduce multiple competing accent colors

### Typography

Use:

- one strong display face for large headlines;
- one neutral grotesque/sans for supporting text;
- uppercase typography where appropriate;
- generous tracking for large headlines;
- restrained body copy.

Typography should behave like a cinematic title system rather than UI decoration.

---

# 2. Video Asset Plan

The seven videos are intentionally different. Their website animation should respect the internal movement of each shot.

| # | Asset | Role | Camera / subject behavior | Website behavior |
|---|---|---|---|---|
| 01 | `01_hero-deadlift.mp4` | Hero | Low-angle, subtle push-in, deadlift, chalk burst | Natural playback + restrained scroll exit |
| 02 | `02_chalk-grip.mp4` | Detail / philosophy | Locked-off extreme close-up, chalk explosion | **Signature scroll reveal** |
| 03 | `03_sprinter.mp4` | Conditioning | Lateral tracking camera following feet | **Signature pinned scale/parallax sequence** |
| 04 | `04_coach-portrait.mp4` | Coaches | Portrait, tiny drift, breathing, blink | Natural playback + restrained card reveal |
| 05 | `05_strength-thumbnail.mp4` | Strength program | Locked-off low-angle plates/racking | Card playback + subtle reveal |
| 06 | `06_mobility-thumbnail.mp4` | Mobility program | Slow orbital movement + steam | Card playback + gentle reveal |
| 07 | `07_closing-empty-gym.mp4` | Closing / CTA | Very slow zoom out, empty gym | Natural playback + typography-led exit |

---

# 3. Exact Video Direction

## 3.1 Hero — Main Lifter Shot

### Source direction

Cinematic slow-motion shot of a muscular athlete performing a heavy barbell deadlift in a dark, moody gym.

Visual properties:

- single hard rim light from behind;
- shoulders/back outlined against near-black;
- visible dust particles in the light;
- subtle low-angle camera push-in;
- 35mm-film feel;
- shallow depth of field;
- high contrast;
- chalk dust bursts when hands grip the bar;
- muted grade;
- teal/orange undertones;
- 8 second seamless loop;
- slow-motion 120fps feeling.

### Website interpretation

This footage already contains strong motion:

1. human movement;
2. camera push-in;
3. chalk burst;
4. floating dust;
5. changing focus.

Therefore the website should **not overpower the shot**.

Use:

- normal video playback;
- subtle headline entrance;
- restrained scroll exit;
- extremely subtle media scaling.

Suggested media scale:

`1.000 -> 1.025`

Do not exceed this without testing the composition.

### Intended feeling

The first screen says:

> This is a film.

Only after the user scrolls should they discover:

> The film is also responding to me.

---

# 4. Page Architecture

Recommended section order:

1. Hero
2. Manifesto
3. Chalk / Philosophy
4. Programs
5. Conditioning / Sprinter
6. Coaches
7. Results / Transformation
8. Closing / CTA

Each section should be its own semantic `<section>` with:

- unique `id`;
- `data-section`;
- predictable animation hooks;
- a static layout that still works with JavaScript disabled.

---

# 5. Motion System

## 5.1 Motion hierarchy

Use three levels of motion.

### Level A — Passive cinematic

Approx. 50–60% of the page.

Purpose:

- let footage breathe;
- preserve cinematography;
- avoid turning every section into an interaction.

Typical behavior:

- video plays;
- text appears once;
- scroll changes only opacity/position slightly.

### Level B — Scroll-triggered composition

Approx. 30–40%.

Purpose:

- make entrances feel physical;
- create depth;
- make the page respond to scrolling without becoming mechanical.

Typical properties:

- clip-path;
- translateY;
- translateX;
- scale;
- opacity;
- parallax;
- masked typography.

### Level C — Signature scrub/pin sequences

Approx. 10–20%.

Hard limit:

**Maximum 2 signature sequences across the entire website.**

These are:

1. Chalk vertical reveal
2. Sprinter pinned scale/parallax

---

# 6. Fundamental Motion Rules

1. Do not scrub video `currentTime` by default.
2. Scroll should primarily control the composition around the footage.
3. The natural camera movement inside each clip must remain readable.
4. Use one dominant motion idea per major section.
5. Do not simultaneously animate every property.
6. Use typography as a secondary layer rather than visual competition.
7. Save the most obvious scroll interaction for the two signature sequences.
8. Every major animation requires a reduced-motion fallback.
9. Mobile should use simplified versions of the desktop choreography.
10. Scroll-triggered effects must not cause layout jumps.

---

# 7. Motion Primitive Library

Build reusable GSAP/ScrollTrigger functions.

## `revealY()`

Purpose:

Reveal a media element by expanding its visible Y range.

Implementation concept:

- wrapper uses `overflow: hidden`;
- animate `clip-path` or an equivalent masking technique;
- video itself remains stable while the visible region expands.

Example:

```css
clip-path: inset(18% 0 18% 0);
```

to:

```css
clip-path: inset(0% 0 0% 0);
```

Use primarily for the chalk sequence.

---

## `scaleMedia()`

Purpose:

Control visual scale without altering layout.

Typical ranges:

- `0.94 -> 1.00`
- `1.12 -> 1.00`
- `1.00 -> 1.025`

Use small ranges unless the composition specifically requires more.

---

## `parallaxLayer()`

Purpose:

Move layers at different rates.

Example:

- background: `yPercent: 8`
- media: `yPercent: -3`
- foreground typography: `yPercent: -10`

Do not use identical movement values for all layers.

---

## `fadeRise()`

Purpose:

Small upward movement plus opacity.

Use for:

- manifesto;
- section labels;
- supporting copy;
- CTA.

Keep travel restrained.

---

## `maskedTextReveal()`

Purpose:

Reveal typography from a clipped region.

Use primarily for:

- manifesto;
- philosophy;
- major section titles.

---

## `pinSequence()`

Purpose:

Temporarily hold a cinematic scene while scroll controls transformation.

Use only for the two signature sequences.

---

## `sectionExit()`

Purpose:

Coordinate:

- video exit;
- typography exit;
- opacity;
- scale;
- next section entrance.

Avoid hard cutting unless the creative direction intentionally calls for it.

---

# 8. Signature Sequence #1 — Chalk Vertical Reveal

## Asset

`02_chalk-grip.mp4`

## Why this video gets the first signature sequence

The camera is static.

This gives the webpage freedom to manipulate the **frame** without fighting camera movement.

The core animation should feel as though the website is physically uncovering the footage.

## Initial composition

The media sits in an overflow-hidden wrapper.

Initial visible state:

```text
┌───────────────────────────────┐
│                               │
│          BLACK SPACE          │
│                               │
├───────────────────────────────┤
│                               │
│        CHALK VIDEO            │
│                               │
├───────────────────────────────┤
│                               │
│          BLACK SPACE          │
│                               │
└───────────────────────────────┘
```

Suggested initial clip:

```css
clip-path: inset(18% 0 18% 0);
```

Final:

```css
clip-path: inset(0% 0 0% 0);
```

## Scroll sequence

### 0%

- wrapper enters;
- video mostly concealed vertically;
- background is nearly black;
- supporting typography hidden.

### 20–40%

- section pins;
- reveal begins;
- video opens vertically;
- media scale gently approaches natural size.

### 40–65%

- chalk cloud becomes fully visible;
- background layer moves at a slightly different rate;
- visual focus is entirely on dust/chalk.

### 65–80%

- title or philosophy copy appears;
- typography should occupy negative space rather than cover the chalk cloud.

### 80–100%

- full video composition established;
- text reaches final position;
- pin releases.

## Important composition rule

The chalk explosion is the **visual payoff**.

Do not cover the chalk burst with large text.

The viewer should experience:

```text
blackness
    ↓
slit
    ↓
chalk appears
    ↓
frame opens
    ↓
chalk explodes
    ↓
message appears
```

This is the primary "website is physically revealing the film" moment.

---

# 9. Signature Sequence #2 — Sprinter

## Asset

`03_sprinter.mp4`

## Source behavior

- low camera;
- tracking laterally with athlete;
- feet remain sharp;
- background has motion blur;
- cool blue rim lighting;
- sweat particles;
- 7 second cinematic sports-commercial feel.

## Key decision

Do **not** make this video the second video-time scrub.

The source camera movement is already strong enough.

Instead, manipulate the **scale and surrounding layers**.

## Sequence

### Entry

- section approaches;
- video is slightly oversized;
- suggested initial scale: `1.12`.

### Pin

Pin section for a controlled scroll distance.

### Scroll

Animate:

```text
scale: 1.12 -> 1.00
```

At the same time:

- background layer moves slightly;
- text enters after visual momentum is established;
- foreground remains sharper than background movement.

### Exit

- scale reaches natural size;
- text settles;
- pin releases;
- next section begins.

## Visual intent

The footage already creates lateral speed.

The webpage adds a slow compositional transformation around that speed.

This should feel like:

> the website is moving through the sprint with the athlete.

Not:

> the video is being scrubbed like a timeline.

---

# 10. Hero Animation Plan

## Natural playback

`01_hero-deadlift.mp4` should play continuously when in the active viewport.

## Scroll response

Use restrained:

- headline drift upward;
- opacity reduction;
- media scale `1.000 -> 1.025`.

Avoid:

- aggressive zoom;
- video-time scrubbing;
- complex parallax;
- multiple simultaneous masks.

## Pinning

Pin only long enough to establish the opening composition.

Do not create a long locked hero that prevents normal scrolling.

---

# 11. Manifesto

The manifesto is a visual pacing reset.

No video.

Use:

- black background;
- one strong sentence;
- masked reveal;
- slight vertical movement;
- generous negative space.

No additional decorative effects.

The purpose is to reset the eye before the chalk interaction.

---

# 12. Programs

## Strength Card

### Asset

`05_strength-thumbnail.mp4`

Source:

- locked camera;
- low angle;
- heavy plates;
- hard overhead light;
- industrial mood;
- muted grade;
- red accent light.

Interaction:

- card reveal;
- natural video playback;
- hover scale on desktop;
- slight brightness shift;
- no pinning.

Creative language:

**Weight / structure / force.**

---

## Mobility Card

### Asset

`06_mobility-thumbnail.mp4`

Source:

- athlete stretching;
- subtle steam;
- hard window light;
- slow orbital camera;
- cool color temperature.

Interaction:

- gentle card reveal;
- natural playback;
- tiny hover scale;
- optional low-intensity parallax.

Creative language:

**Fluidity / control / recovery.**

The two cards should deliberately feel different even though they share the same component structure.

---

# 13. Coaches

## Asset

`04_coach-portrait.mp4`

Source movement:

- slow blink;
- breathing;
- tiny weight shift;
- subtle camera drift;
- one-sided soft key;
- deep face shadow;
- cold-air breath.

Do not add large animation.

Use:

- card entrance;
- portrait crop;
- natural loop;
- subtle hover interaction.

The effect should feel like:

**editorial portrait photography that happens to be alive.**

---

# 14. Results / Transformation

No major video.

Use this area as visual recovery.

Possible motion:

- numbers appearing sequentially;
- text reveal;
- image reveal;
- restrained line drawing;
- opacity transitions.

Avoid introducing a third cinematic sequence here.

---

# 15. Closing Sequence

## Asset

`07_closing-empty-gym.mp4`

Source behavior:

- empty gym;
- night;
- single swinging light;
- dust;
- slow zoom out;
- deep shadows;
- one distant accent light;
- near-monochrome grade.

## Website behavior

Do not add another major camera transformation.

Allow the source's zoom-out to remain the dominant movement.

Use the website primarily for typography.

Suggested sequence:

```text
EMPTY GYM
    ↓
CTA appears
    ↓
scroll
    ↓
CTA rises slightly / fades
    ↓
empty space expands
    ↓
final action remains
```

Creative interpretation:

**The people are gone. The place remains.**

The ending should feel quiet rather than explosive.

---

# 16. Motion Rhythm of the Full Page

The page should alternate between motion intensity and rest.

```text
01 HERO
Natural cinematic playback
        ↓
02 MANIFESTO
Visual pause
        ↓
03 CHALK
SIGNATURE SCROLL REVEAL
        ↓
04 PROGRAMS
Editorial cards / natural playback
        ↓
05 SPRINTER
SIGNATURE PINNED SCALE
        ↓
06 COACHES
Quiet portrait motion
        ↓
07 RESULTS
Information-led motion
        ↓
08 EMPTY GYM
Slow cinematic closure
```

This rhythm is more important than adding more effects.

The experience should feel authored like a film.

---

# 17. Transition Rules

## Full-bleed transitions

Prefer:

- opacity overlap;
- slight scale continuity;
- dark transitional frames;
- typography bridges.

Avoid:

- obvious page-to-page animation;
- abrupt white flashes;
- excessive wipes;
- decorative transition gimmicks.

## Section-to-section rhythm

Not every section needs a crossfade.

Sometimes a clean black section is stronger.

Use transition type according to the footage rather than forcing a universal transition.

---

# 18. HTML Structure Recommendation

For complex media sections, separate visual layers.

Example:

```html
<section class="scene scene--chalk" data-section="chalk">
  <div class="scene__pin">
    <div class="scene__background"></div>

    <div class="scene__media-wrap">
      <video class="scene__media" ...></video>
    </div>

    <div class="scene__content">
      <span class="scene__eyebrow">PHILOSOPHY</span>
      <h2 class="scene__title">...</h2>
      <p class="scene__body">...</p>
    </div>
  </div>
</section>
```

This makes it possible to animate:

- background;
- clip wrapper;
- video;
- typography

independently.

Do not put everything inside a single element and attempt to animate the same transform for all layers.

---

# 19. Suggested JavaScript Architecture

Recommended files:

```text
/js/
  main.js
  motion/
    index.js
    primitives.js
    hero.js
    manifesto.js
    chalk.js
    programs.js
    sprinter.js
    coaches.js
    results.js
    closing.js
  video/
    player.js
    preload.js
    visibility.js
```

## Responsibilities

### `primitives.js`

Reusable GSAP functions.

### Section files

Each section owns its animation timeline.

### `player.js`

Handles:

- play;
- pause;
- reset;
- mute;
- visibility state.

### `preload.js`

Handles:

- loading current video;
- preloading next video;
- avoiding unnecessary bandwidth.

### `visibility.js`

Handles:

- IntersectionObserver;
- active section;
- cleanup.

---

# 20. ScrollTrigger Implementation Guidelines

Use:

- `scrub` for signature sequences;
- `toggleActions` for simple entrance animations;
- `pin` only where the composition benefits from it;
- `invalidateOnRefresh: true` where layout dimensions can change;
- responsive `matchMedia()` logic for desktop/mobile differences.

Avoid making hundreds of individual ScrollTriggers.

Group related animations into section-level timelines.

---

# 21. Responsive Motion Strategy

## Desktop

Full motion system enabled.

Use:

- clipping;
- pinning;
- subtle parallax;
- signature sequences.

## Tablet

Reduce:

- travel distance;
- scale difference;
- parallax intensity.

Keep:

- chalk reveal;
- sprinter scale sequence if performance is acceptable.

## Mobile

Default to simplified choreography.

Prefer:

- natural video playback;
- simple reveal;
- opacity;
- limited scale.

Avoid:

- long pinned sections;
- heavy parallax;
- large clip animations;
- expensive multi-layer timelines.

Use poster images when video playback is not desirable or performance is poor.

---

# 22. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Disable:

- pinned cinematic sequences;
- large scale transformations;
- parallax;
- long scrub animations.

Keep:

- video playback where appropriate;
- simple opacity transitions;
- accessible typography.

The page must remain visually coherent without animation.

---

# 23. Video Loading Strategy

Use native `<video>`.

Recommended attributes for decorative video:

```html
<video
  muted
  playsinline
  loop
  preload="none"
  poster="/assets/posters/example.jpg"
  aria-hidden="true">
</video>
```

## IntersectionObserver

Load and play when the section is near the viewport.

Suggested threshold behavior:

- begin preparing around 1–1.5 viewport lengths before entering;
- preload the next major video while current section is active;
- pause distant videos;
- avoid keeping every clip decoding simultaneously.

Do not unload aggressively if that causes visible reloads during reverse scrolling.

---

# 24. Video Encoding Targets

Full-bleed videos:

- H.264 MP4;
- visually clean at desktop;
- approximately 3–5 MB target where practical.

Card videos:

- under approximately 1 MB where practical.

Also create:

- one poster JPG per video;
- representative high-quality still.

Verify:

- no visible loop seam;
- no black frame at loop boundary;
- correct aspect ratio;
- mobile-safe framing.

---

# 25. Performance Constraints

The cinematic effect must not come at the cost of usability.

Target:

- minimal initial payload;
- lazy video loading;
- no unnecessary DOM transforms;
- no continuously running animation when offscreen;
- no expensive blur filters across giant areas;
- no WebGL unless a future requirement explicitly calls for it.

Test:

- desktop Chrome;
- Safari;
- Firefox;
- real iOS/Android devices;
- throttled mobile network.

---

# 26. Accessibility

Provide:

- semantic heading hierarchy;
- keyboard-accessible CTAs;
- readable contrast;
- visible focus states;
- meaningful content outside decorative video.

Decorative video may use:

```html
aria-hidden="true"
```

Do not rely on video to communicate information that is not available elsewhere.

---

# 27. Interaction Details

## Custom cursor

Desktop only.

Behavior:

- small dot/crosshair;
- expands on interactive elements;
- optional label on major cinematic CTA;
- never obstructs content.

## Hover

Use only where a hover interaction makes sense.

Programs:

- tiny media scale;
- brightness shift.

Coaches:

- tiny portrait scale.

No hover behavior should be required to understand the content.

---

# 28. Animation Tuning Values

These are starting points, not rigid values.

## Hero

```text
media scale: 1.000 → 1.025
headline travel: small
opacity: 1 → ~0.85
pin duration: short
```

## Chalk

```text
clip: inset(18% 0 18% 0) → inset(0 0 0 0)
media scale: ~0.94 → 1.00
pin: medium
text reveal: late
```

## Sprinter

```text
media scale: ~1.12 → 1.00
pin: medium
background parallax: low
text reveal: mid/late
```

## Cards

```text
Y entrance: small
scale: ~0.98 → 1.00
hover scale: very small
```

## Closing

```text
video: natural playback
CTA: fade + small vertical movement
no major scale effect
```

---

# 29. What Not To Do

Do not:

- scrub all seven videos based on scroll;
- pin every section;
- give every video the same reveal;
- add parallax to everything;
- use giant typography over the visual focal point;
- stack five simultaneous GSAP effects;
- create long pinned sections that fight normal scrolling;
- make mobile behave exactly like desktop;
- use transitions simply because GSAP makes them easy;
- turn the page into an animation showcase.

The goal is cinematic direction, not animation density.

---

# 30. Visual QA Checklist

## Hero

- [ ] Athlete remains the focal point.
- [ ] Chalk burst is visible.
- [ ] Scroll exit is subtle.
- [ ] No excessive zoom.

## Manifesto

- [ ] Feels like a pause.
- [ ] Typography is dominant.
- [ ] No unnecessary animation.

## Chalk

- [ ] Clip opens smoothly.
- [ ] Pin feels deliberate.
- [ ] Chalk cloud remains unobstructed.
- [ ] Text enters after the primary visual event.
- [ ] Background and media move at different rates.

## Programs

- [ ] Strength feels heavy/structured.
- [ ] Mobility feels fluid/calm.
- [ ] Cards do not look generic.

## Sprinter

- [ ] Athlete remains sharp.
- [ ] Existing camera movement is preserved.
- [ ] Scale transformation is noticeable but not aggressive.
- [ ] Parallax supports the scene rather than competing with it.

## Coaches

- [ ] Portraits remain subtle.
- [ ] Natural breathing/blinking remains visible.
- [ ] No oversized animation.

## Results

- [ ] Allows visual recovery.
- [ ] Information is legible.
- [ ] No unnecessary cinematic effect.

## Closing

- [ ] Empty gym has breathing room.
- [ ] Zoom-out remains visible.
- [ ] CTA feels earned.
- [ ] Ending is quiet and memorable.

---

# 31. Acceptance Criteria

The implementation is complete when:

### Cinematic behavior

- [ ] Video remains the primary visual medium.
- [ ] Natural camera motion of each shot is preserved.
- [ ] Scroll interaction is noticeable but not constant.
- [ ] Exactly two signature scroll sequences exist.

### Signature sequence #1

- [ ] Chalk footage opens along Y axis.
- [ ] Wrapper clipping drives reveal.
- [ ] Video settles into natural scale.
- [ ] Typography appears after the chalk event.

### Signature sequence #2

- [ ] Sprinter section pins.
- [ ] Scale transforms from oversized to natural.
- [ ] Parallax exists but remains subtle.
- [ ] Video currentTime is not required for the effect.

### Rhythm

- [ ] There are visual rest periods.
- [ ] Every section does not use the same animation.
- [ ] Hero and closing feel different from the signature sections.
- [ ] Cards feel editorial rather than overly animated.

### Technical

- [ ] No console errors.
- [ ] No blank video frames while scrolling normally.
- [ ] No obvious loop seams.
- [ ] No scroll locking bugs.
- [ ] Fast scrolling does not leave sections stuck.
- [ ] Mobile has a simplified motion mode.
- [ ] Reduced motion works correctly.

---

# 32. Final Creative Principle

The website should not ask:

> "What animation can we add to this video?"

Instead ask:

> "What does this particular piece of footage already do, and what can scrolling add without fighting it?"

The videos already contain the cinematography.

GSAP should provide the **editorial layer**.

The strongest moments happen when the two systems cooperate:

**camera movement + scroll movement**

**chalk explosion + frame reveal**

**lateral sprint + controlled scale**

**slow empty-gym zoom + typography recession**

The result should feel like a film whose composition responds to the viewer's movement through the page.
