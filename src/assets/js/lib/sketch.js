import { Pane } from "tweakpane";
import { PARAMS } from "./params";
import { isMobile } from "mobile-device-detect";
import { createBorder, grid } from "./debug-ui";
import { smAreas, lgAreas, aroundAreas } from "./areas";

// Destructure PARAMS variable for ease of use
let { backgroundColor, palette, scale, border, debug } = PARAMS;
let sp, h, w, segments;

export default function sketch(p) {
  // ----------------------------------------------------
  // Setup P5 canvas
  // ----------------------------------------------------

  p.setup = function () {
    // Init canvas
    w = 595 * scale;
    h = 842 * scale;
    p.createCanvas(w, h);

    // Init graphic buffer
    sp = p.createGraphics(w - border * 2, h - border * 2);

    // Init control panel only on mobile devices
    if (!isMobile) initTweak();

    // Prevent draw function from looping
    p.noLoop();
  };

  p.draw = function () {
    p.background(backgroundColor);
    p.noFill();

    // Display graphic buffer on canvas
    drawScribblePaper();
    p.image(sp, border, border);

    // Conditional debug mode
    if (debug) {
      grid(p, w, h, border);
      createBorder(p, w, h, border);
    }
  };

  // ----------------------------------------------------
  // Main scribble
  // ----------------------------------------------------

  function drawMainScribble(color) {
    segments = 20;

    sp.beginShape();

    for (let index = 0; index < segments; index++) {
      let areaIndex = index % lgAreas(p, sp, w, h).length;

      if (debug) {
        sp.strokeWeight(6 * scale);
        sp.point(
          lgAreas(p, sp, w, h)[areaIndex].x,
          lgAreas(p, sp, w, h)[areaIndex].y
        );
      } else {
        areaIndex = index % lgAreas(p, sp, w, h).length;
        sp.stroke(color);
        sp.noFill();
        sp.strokeWeight(2 * scale);
        sp.vertex(
          lgAreas(p, sp, w, h)[areaIndex].x,
          lgAreas(p, sp, w, h)[areaIndex].y
        );
      }
    }
    sp.endShape();
  }

  // ----------------------------------------------------
  // Secondary scribble
  // ----------------------------------------------------

  function drawSecondaryScribble(color) {
    segments = 10;

    // Create a local copy of smAreas
    let localSmAreas = smAreas(p, sp, w, h);

    sp.beginShape();
    for (let index = 0; index < segments; index++) {
      // Reinitialize if localSmAreas is empty
      if (localSmAreas.length === 0) {
        localSmAreas = smAreas(p, sp, w, h);
      }

      // Randomly select an area index
      let areaIndex = p.int(p.random(0, localSmAreas.length));
      // Get the area coordinates
      let area = localSmAreas[areaIndex];

      sp.stroke(color);
      sp.noFill();

      if (debug) {
        sp.strokeWeight(6 * scale);
        sp.point(area.x, area.y);
      } else {
        sp.strokeWeight(1 * scale);
        sp.vertex(area.x, area.y);
      }

      // Remove the used area from the local array
      localSmAreas.splice(areaIndex, 1);
    }
    sp.endShape();
  }

  // ----------------------------------------------------
  // Around scribble
  // ----------------------------------------------------

  function drawClosingScribble(color) {
    console.log(scale);

    segments = 30;

    sp.beginShape();
    for (let index = 0; index < segments; index++) {
      let areaIndex = index % aroundAreas(p, sp, w, h).length;
      sp.stroke(color);
      sp.noFill();

      if (debug) {
        sp.strokeWeight(6 * scale);
        sp.point(
          aroundAreas(p, sp, w, h)[areaIndex].x,
          aroundAreas(p, sp, w, h)[areaIndex].y
        );
      } else {
        sp.strokeWeight(1 * scale);
        sp.vertex(
          aroundAreas(p, sp, w, h)[areaIndex].x,
          aroundAreas(p, sp, w, h)[areaIndex].y
        );
      }
    }
    sp.endShape();
  }

  // ----------------------------------------------------
  // Draw the scribble canvas
  // ----------------------------------------------------

  function drawScribblePaper() {
    if (debug) {
      sp.background(0, 255, 0);
    } else {
      sp.background(backgroundColor);
    }

    for (let index = 0; index < palette.length; index++) {
      drawSecondaryScribble(palette[index]);
      drawClosingScribble(palette[index]);
    }

    drawMainScribble(palette[0]);
  }

  // ----------------------------------------------------
  // Init control panel
  // ----------------------------------------------------

  function initTweak() {
    const pane = new Pane();

    // Variables stack

    const scaleTweak = pane.addBinding(PARAMS, "scale", {
      label: "Scale",
      min: 0.5,
      max: 3,
      step: 0.1,
    });

    const borderTweak = pane.addBinding(PARAMS, "border", {
      label: "Borders",
      min: 0,
      max: 150,
      step: 1,
    });

    const debugBtn = pane.addButton({
      title: debug ? "On" : "Off",
      label: "Debug Mode",
    });

    const refreshBtn = pane.addButton({
      title: "Shuffle",
    });

    const saveBtn = pane.addButton({
      title: "Download",
    });

    // Enable Debug Mode
    debugBtn.on("click", () => {
      debug = !debug;
      p.redraw();
      initTweak();
    });

    // Create a new composition
    refreshBtn.on("click", () => {
      p.redraw();
    });

    borderTweak.on("change", (ev) => {
      // Reassign value to destructured variable
      border = ev.value * scale;
      updateComposition();
    });

    scaleTweak.on("change", (e) => {
      // Updates values
      scale = e.value;
      w = 595 * scale;
      h = 842 * scale;
      border = PARAMS.border * scale;

      p.resizeCanvas(w, h);
      updateComposition();
    });

    // Download .png canvas
    // Todo: export .svg
    saveBtn.on("click", () => {
      p.save("myCanvas.png");
    });
  }

  function updateComposition() {
    // Delete previous canvas from the DOM.
    sp.remove();
    // Create a new one with updated values.
    sp = p.createGraphics(w - border * 2, h - border * 2);
    // Redraw the scene once.
    p.redraw();
  }
}
