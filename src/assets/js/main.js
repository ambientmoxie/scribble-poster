import "../scss/style.scss";
import p5 from "p5";
import { isMobile } from "mobile-device-detect";
import { Pane } from "tweakpane";
import { createBorder, grid } from "./lib/debug-ui";
import { smAreas, lgAreas, aroundAreas } from "./lib/areas";

// todo: refactore

const PARAMS = {
  backgroundColor: "#050304",
  palette: ["#9BAACF", "#CC694F", "#F7E569", "#538A82", "#4A7CB8", "#C096B9"],
  scale: 0.8,
  border: 10,
  debug: false,
};

// Destructuring for ease of use.
let { backgroundColor, palette, scale, border, debug } = PARAMS;
let sp, h, w, segments;

function sketch(p) {
  // Setup P5 canvas
  // ----------------------------------------------------

  p.setup = function () {
    // const ratio = 595 / 842; // a4 ratio
    // const maxHeight = window.innerHeight - 100;
    // w = (maxHeight * ratio) * scale;
    // h = maxHeight * scale;

    w = 595 * scale;
    h = 842 * scale;

    p.createCanvas(w, h);
    updateGraphicsBuffer();
    drawScene(p);
    if (!isMobile) {
      initTweek();
    }
  };

  function updateGraphicsBuffer() {
    sp = p.createGraphics(w - border * 2, h - border * 2);
  }

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

  // Around scribble
  // ----------------------------------------------------

  function drawClosingScribble(color) {
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

  // Draw the whole scene
  // ----------------------------------------------------
  // Including debug grid and borders

  function drawScene(p) {
    p.background(backgroundColor);
    p.noFill();

    drawScribblePaper();
    p.image(sp, border, border);

    if (debug) {
      grid(p, w, h, border);
      createBorder(p, w, h, border);
    }
  }

  // Init tweekPane panel
  // ----------------------------------------------------

  function initTweek() {
    const pane = new Pane();

    // Border around graphic buffer
    pane.addBinding(PARAMS, "border", {
      label: "Borders",
      min: 0,
      max: 100,
      step: 1,
    });

    const debugBtn = pane.addButton({
      title: debug ? "on" : "off",
      label: "Debug Mode",
    });

    const refreshBtn = pane.addButton({
      title: "Refresh",
    });

    const saveBtn = pane.addButton({
      title: "Download",
    });

    debugBtn.on("click", () => {
      debug = !debug;
      drawScene(p);
      initTweek();
    });

    refreshBtn.on("click", () => {
      drawScene(p);
    });

    saveBtn.on("click", () => {
      p.save("myCanvas.png");
    });

    pane.on("change", (ev) => {
      border = ev.value; // Reassign the new border value to the destructured variable.
      updateGraphicsBuffer();
      drawScene(p);
    });
  }
}

// Prevent sketch to be seen on mobile devices

if (!isMobile) {
  new p5(sketch);
} else {
  addMobileFence();
}

function addMobileFence() {
  const fence = document.createElement("div");
  fence.id = "fence";
  const fenceContent = document.createTextNode(
    '"Scribble tool" is not optimized for mobile devices.'
  );
  fence.appendChild(fenceContent);
  document.body.appendChild(fence);
}
