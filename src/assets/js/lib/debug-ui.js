function createBorder(p, w, h, BORDER) {
  // Redefine width and height variable for better usage
  h = p.height;
  w = p.width;

  p.noStroke();
  p.fill(0, 0, 255, 50);
  p.rect(0, 0, BORDER, h);
  p.rect(0, 0, w, BORDER);
  p.rect(0, h - BORDER, w, BORDER);
  p.rect(w - BORDER, 0, BORDER, h);
}

// Debug grid
function grid(p, w, h, BORDER) {
  // Redefine width and height variable for better usage
  h = p.height - BORDER * 2;
  w = p.width - BORDER * 2;

  p.stroke(0, 0, 255);

  p.push();
  p.translate(BORDER, BORDER);

  p.line(w / 2, 0, w / 2, h);
  p.line(w / 4, 0, w / 4, h);
  p.line(w - w / 4, 0, w - w / 4, h);
  p.line(0, h / 2, w, h / 2);
  p.line(0, h - h / 4, w, h - h / 4);
  p.line(0, h / 4, w, h / 4);

  p.pop();
}

export { createBorder, grid };
