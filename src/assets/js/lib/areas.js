// Define 4 areas coordinates
function lgAreas(p, sp, w, h) {
  h = sp.height;
  w = sp.width;

  // |---|---|
  // | 1 | 2 |
  // |---|---|
  // | 4 | 3 |
  // |---|---|

  return [
    // area 1
    {
      x: p.floor(p.random(0, w / 2)),
      y: p.floor(p.random(0, h / 2)),
    },
    // area 2
    {
      x: p.floor(p.random(w / 2, w)),
      y: p.floor(p.random(0, h / 2)),
    },
    // area 3
    {
      x: p.floor(p.random(w / 2, w)),
      y: p.floor(p.random(h / 2, h)),
    },
    // area 4
    {
      x: p.floor(p.random(0, w / 2)),
      y: p.floor(p.random(h / 2, h)),
    },
  ];
}

// Define 4 areas coordinates
function aroundAreas(p, sp, w, h) {
  h = sp.height;
  w = sp.width;

  return [
    // area 1
    {
      x: p.floor(p.random(0, w)),
      y: p.floor(p.random(0, h / 8)),
    },
    // area 2
    {
      x: p.floor(p.random((w * 7) / 8, w)),
      y: p.floor(p.random(0, h)),
    },
    // area 3
    {
      x: p.floor(p.random(0, w)),
      y: p.floor(p.random((h * 7) / 8, h)),
    },
    // area 4
    {
      x: p.floor(p.random(0, w / 8)),
      y: p.floor(p.random(0, h)),
    },
  ];
}

// Define 16 areas coordinates
function smAreas(p, sp, w, h) {
  // Redefine width and height variable for better usage
  h = sp.height;
  w = sp.width;

  // |----|----|----|----|
  // |    |    |    |    |
  // | 01 | 02 | 03 | 04 |
  // |    |    |    |    |
  // |----|----|----|----|
  // |    |    |    |    |
  // | 12 | 13 | 14 | 05 |
  // |    |    |    |    |
  // |----|----|----|----|
  // |    |    |    |    |
  // | 11 | 16 | 15 | 06 |
  // |    |    |    |    |
  // |----|----|----|----|
  // |    |    |    |    |
  // | 10 | 09 | 08 | 07 |
  // |    |    |    |    |
  // |----|----|----|----|

  return [
    // area 1
    {
      x: p.floor(p.random(0, w / 4)),
      y: p.floor(p.random(0, h / 4)),
    },
    // area 2
    {
      x: p.floor(p.random(w / 4, w / 2)),
      y: p.floor(p.random(0, h / 4)),
    },
    // area 3
    {
      x: p.floor(p.random(w / 2, w * 0.75)),
      y: p.floor(p.random(0, h / 4)),
    },
    // area 4
    {
      x: p.floor(p.random(w * 0.75, w)),
      y: p.floor(p.random(0, h / 4)),
    },
    // area 5
    {
      x: p.floor(p.random(w * 0.75, w)),
      y: p.floor(p.random(h / 4, h / 2)),
    },
    // area 6
    {
      x: p.floor(p.random(w * 0.75, w)),
      y: p.floor(p.random(h / 2, h * 0.75)),
    },
    // area 7
    {
      x: p.floor(p.random(w * 0.75, w)),
      y: p.floor(p.random(h * 0.75, h)),
    },
    // area 8
    {
      x: p.floor(p.random(w / 2, w * 0.75)),
      y: p.floor(p.random(h * 0.75, h)),
    },
    // area 9
    {
      x: p.floor(p.random(w / 4, w / 2)),
      y: p.floor(p.random(h * 0.75, h)),
    },
    // area 10
    {
      x: p.floor(p.random(0, w / 4)),
      y: p.floor(p.random(h * 0.75, h)),
    },
    // area 11
    {
      x: p.floor(p.random(0, w / 4)),
      y: p.floor(p.random(h / 2, h * 0.75)),
    },
    // area 12
    {
      x: p.floor(p.random(0, w / 4)),
      y: p.floor(p.random(h / 4, h / 2)),
    },
    // area 13
    {
      x: p.floor(p.random(w / 4, w / 2)),
      y: p.floor(p.random(h / 4, h / 2)),
    },
    // area 14
    {
      x: p.floor(p.random(w / 2, w * 0.75)),
      y: p.floor(p.random(h / 4, h / 2)),
    },
    // area 15
    {
      x: p.floor(p.random(w / 2, w * 0.75)),
      y: p.floor(p.random(h / 2, h * 0.75)),
    },
    // area 16
    {
      x: p.floor(p.random(w / 4, w / 2)),
      y: p.floor(p.random(h / 2, h * 0.75)),
    },
  ];
}

export { lgAreas, smAreas, aroundAreas };
