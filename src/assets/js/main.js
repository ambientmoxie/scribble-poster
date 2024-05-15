import "../scss/style.scss";
import p5 from "p5";
import "p5.js-svg"; // Import p5.js-svg
import { Pane } from "tweakpane";
import { createBorder, grid } from "./lib/debug-ui";
import { smAreas, lgAreas, aroundAreas } from "./lib/areas";

const BACKGROUND = "#050304";
// const BACKGROUND = "#C1D2E3";
// const PALETTE = ["#FFE521", "#B2E8FC", "#000", "#692742", "#868675", "#E575A2"];
// const PALETTE = ["#38568C", "#B2E8FC", "#315139", "#434240", "#714E35", "#DC6C64"];
// const PALETTE = ["#9BAACF", "#CC694F", "#F7E569", "#538A82", "#4A7CB8", "#C096B9"];
const PALETTE = ["#9BAACF", "#CC694F", "#F7E569", "#538A82", "#4A7CB8", "#C096B9"];
// const CHANCE = 0;
const SCALE = 1;
const BORDER = 5 * SCALE;

let sp, h, w, segments;
let debug = false;

// todo: refactore

function sketch(p) {
  // --------------------------
  // Setup P5 canvas
  // --------------------------

  p.setup = function () {
    p.createCanvas(595 * SCALE, 842 * SCALE);
    sp = p.createGraphics(p.width - BORDER * 2, p.height - BORDER * 2);
    drawScene(p);
    initTweek();

    // console.log(smAreas(p, sp, w, h));
  };

  // --------------------------
  // Primary scribble
  // --------------------------

  function drawMainScribble(color) {
    segments = 20;

    sp.beginShape();

    for (let index = 0; index < segments; index++) {
      let areaIndex = index % lgAreas(p, sp, w, h).length;

      if (debug) {
        sp.strokeWeight(6 * SCALE);
        sp.point(
          lgAreas(p, sp, w, h)[areaIndex].x,
          lgAreas(p, sp, w, h)[areaIndex].y
        );
      } else {
        areaIndex = index % lgAreas(p, sp, w, h).length;
        sp.stroke(color);
        sp.noFill();
        sp.strokeWeight(2 * SCALE);
        sp.vertex(
          lgAreas(p, sp, w, h)[areaIndex].x,
          lgAreas(p, sp, w, h)[areaIndex].y
        );
      }
    }
    sp.endShape();
  }

  // --------------------------
  // Secondary scribble
  // --------------------------

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
        sp.strokeWeight(6 * SCALE);
        sp.point(area.x, area.y);
      } else {
        sp.strokeWeight(1 * SCALE);
        sp.vertex(area.x, area.y);
      }

      // Remove the used area from the local array
      localSmAreas.splice(areaIndex, 1);
    }
    sp.endShape();
  }

  // --------------------------
  // Around scribble
  // --------------------------

  function drawAroundScribble(color) {
    segments = 30;

    sp.beginShape();
    for (let index = 0; index < segments; index++) {
      let areaIndex = index % aroundAreas(p, sp, w, h).length;
      sp.stroke(color);
      sp.noFill();

      if (debug) {
        sp.strokeWeight(6 * SCALE);
        sp.point(
          aroundAreas(p, sp, w, h)[areaIndex].x,
          aroundAreas(p, sp, w, h)[areaIndex].y
        );
      } else {
        sp.strokeWeight(1 * SCALE);
        sp.vertex(
          aroundAreas(p, sp, w, h)[areaIndex].x,
          aroundAreas(p, sp, w, h)[areaIndex].y
        );
      }
    }
    sp.endShape();
  }

  // --------------------------
  // Draw the scribble canvas
  // --------------------------

  function drawScribblePaper() {
    if (debug) {
      sp.background(0, 255, 0);
    } else {
      sp.background(BACKGROUND);
    }

    for (let index = 0; index < PALETTE.length; index++) {
      drawSecondaryScribble(PALETTE[index]);
      drawAroundScribble(PALETTE[index]);
    }

    drawMainScribble(PALETTE[0]);
  }

  // --------------------------
  // Draw the whole scene
  // --------------------------
  // Including debug grid and borders

  function drawScene(p) {
    p.background(BACKGROUND);
    p.noFill();

    drawScribblePaper();
    p.image(sp, BORDER, BORDER);

    if (debug) {
      grid(p, w, h, BORDER);
      createBorder(p, w, h, BORDER);
    }
  }

  // --------------------------
  // Init tweekPane panel
  // --------------------------

  function initTweek() {
    const pane = new Pane();

    // Init save and debug buttons
    const debugBtn = pane.addButton({
      title: debug ? "off" : "on",
      label: "Debug Mode",
    });
    const saveBtn = pane.addButton({
      title: "download",
    });

    // Redraw the scene in !debug mode
    debugBtn.on("click", () => {
      debug = !debug;
      drawScene(p);
      initTweek();
    });

    // Save the canvas in png
    saveBtn.on("click", () => {
      p.save("myCanvas.png");
    });
  }
}

new p5(sketch);
