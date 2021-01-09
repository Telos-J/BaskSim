const idle = document.querySelector(".blob");
const idle_paths = Array.from(idle.querySelectorAll("path"));
const idle2 = document.querySelector("#idle2");
const idle2_paths = Array.from(idle2.querySelectorAll("path"));

const walk = document.querySelector("#walk");
const walk_paths = Array.from(walk.querySelectorAll("path"));
const walk2 = document.querySelector("#walk2");
const walk2_paths = Array.from(walk2.querySelectorAll("path"));
const walk3 = document.querySelector("#walk3");
const walk3_paths = Array.from(walk3.querySelectorAll("path"));
const walk4 = document.querySelector("#walk4");
const walk4_paths = Array.from(walk4.querySelectorAll("path"));

const dribble = document.querySelector("#dribble");
const dribble_paths = Array.from(dribble.querySelectorAll("path"));
const dribble2 = document.querySelector("#dribble2");
const dribble2_paths = Array.from(dribble2.querySelectorAll("path"));
const dribble3 = document.querySelector("#dribble3");
const dribble3_paths = Array.from(dribble3.querySelectorAll("path"));
const dribble4 = document.querySelector("#dribble4");
const dribble4_paths = Array.from(dribble4.querySelectorAll("path"));

const idleDribble = document.querySelector("#idleDribble");
const idleDribble_paths = Array.from(idleDribble.querySelectorAll("path"));
const idleDribble2 = document.querySelector("#idleDribble2");
const idleDribble2_paths = Array.from(idleDribble2.querySelectorAll("path"));

function idleAnimation(paths) {
  paths.map(function (item, idx) {
    gsap.killTweensOf(item);
    gsap.fromTo(
      item,
      {
        morphSVG: idle_paths[idx],
      },
      {
        duration: 1,
        repeat: -1,
        yoyo: true,
        morphSVG: idle2_paths[idx],
      }
    );
  });
}

function idleDribbleAnimation(paths) {
  paths.map(function (item, idx) {
    gsap.killTweensOf(item);
    gsap.fromTo(
      item,
      {
        morphSVG: idleDribble_paths[idx],
      },
      {
        duration: 0.25,
        ease: "none",
        repeat: -1,
        yoyo: true,
        morphSVG: idleDribble2_paths[idx],
      }
    );
  });
}

function walkAnimation(paths) {
  paths.map(function (item, idx) {
    let shapeIndex = "auto";
    const timeline = gsap.timeline({ repeat: -1 });

    if (idx == 0) {
      shapeIndex = 10;
    } else if (idx == 1 || idx == 4 || idx == 5) {
      shapeIndex = 0;
    }

    gsap.killTweensOf(item);
    timeline
      .fromTo(
        item,
        {
          morphSVG: walk_paths[idx],
        },
        {
          duration: 0.2,
          ease: "none",
          morphSVG: {
            shape: walk2_paths[idx],
            shapeIndex: shapeIndex,
          },
        }
      )
      .to(item, {
        duration: 0.2,
        ease: "none",
        morphSVG: {
          shape: walk3_paths[idx],
          shapeIndex: shapeIndex,
        },
      })
      .to(item, {
        duration: 0.2,
        ease: "none",
        morphSVG: {
          shape: walk4_paths[idx],
          shapeIndex: shapeIndex,
        },
      })
      .to(item, {
        duration: 0.2,
        ease: "none",
        morphSVG: {
          shape: walk_paths[idx],
          shapeIndex: shapeIndex,
        },
      });
  });
}

function dribbleAnimation(paths) {
  paths.map(function (item, idx) {
    let shapeIndex = "auto";
    const timeline = gsap.timeline({ repeat: -1 });

    if (idx == 0) {
      shapeIndex = 10;
    } else if (idx == 1 || idx == 4 || idx == 5) {
      shapeIndex = 0;
    }

    gsap.killTweensOf(item);
    timeline
      .fromTo(
        item,
        {
          morphSVG: dribble_paths[idx],
        },
        {
          duration: 0.2,
          ease: "none",
          morphSVG: {
            shape: dribble2_paths[idx],
            shapeIndex: shapeIndex,
          },
        }
      )
      .to(item, {
        duration: 0.2,
        ease: "none",
        morphSVG: {
          shape: dribble3_paths[idx],
          shapeIndex: shapeIndex,
        },
      })
      .to(item, {
        duration: 0.2,
        ease: "none",
        morphSVG: {
          shape: dribble4_paths[idx],
          shapeIndex: shapeIndex,
        },
      })
      .to(item, {
        duration: 0.2,
        ease: "none",
        morphSVG: {
          shape: dribble_paths[idx],
          shapeIndex: shapeIndex,
        },
      });
  });
}

export { idleAnimation, idleDribbleAnimation, walkAnimation, dribbleAnimation };
