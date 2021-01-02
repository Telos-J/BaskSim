function idleAnimation(paths) {
    paths.map(function (item, idx) {
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

function walkAnimation(paths) {
    paths.map(function (item, idx) {
        if (idx == 0) {
            shapeIndex = 10;
        } else if (idx == 4 || idx == 1 || idx == 7) {
            shapeIndex = 0;
        } else {
            shapeIndex = 'auto';
        }
        const timeline = gsap.timeline({ repeat: -1 });
        timeline
            .fromTo(
                item,
                {
                    morphSVG: walk_paths[idx],
                },
                {
                    duration: 0.2,
                    ease: 'none',
                    morphSVG: {
                        shape: walk2_paths[idx],
                        shapeIndex: shapeIndex,
                    },
                }
            )
            .to(item, {
                duration: 0.2,
                ease: 'none',
                morphSVG: {
                    shape: walk3_paths[idx],
                    shapeIndex: shapeIndex,
                },
            })
            .to(item, {
                duration: 0.2,
                ease: 'none',
                morphSVG: {
                    shape: walk4_paths[idx],
                    shapeIndex: shapeIndex,
                },
            })
            .to(item, {
                duration: 0.2,
                ease: 'none',
                morphSVG: {
                    shape: walk_paths[idx],
                    shapeIndex: shapeIndex,
                },
            });
    });
}

function dribbleAnimation(paths) {
    paths.map(function (item, idx) {
        if (idx == 0) {
            shapeIndex = 10;
        } else if (idx == 4 || idx == 1 || idx == 7) {
            shapeIndex = 0;
        } else {
            shapeIndex = 'auto';
        }
        const timeline = gsap.timeline({ repeat: -1 });
        timeline
            .fromTo(
                item,
                {
                    morphSVG: dribble_paths[idx],
                },
                {
                    duration: 0.2,
                    ease: 'none',
                    morphSVG: {
                        shape: dribble2_paths[idx],
                        shapeIndex: shapeIndex,
                    },
                }
            )
            .to(item, {
                duration: 0.2,
                ease: 'none',
                morphSVG: {
                    shape: dribble3_paths[idx],
                    shapeIndex: shapeIndex,
                },
            })
            .to(item, {
                duration: 0.2,
                ease: 'none',
                morphSVG: {
                    shape: dribble4_paths[idx],
                    shapeIndex: shapeIndex,
                },
            })
            .to(item, {
                duration: 0.2,
                ease: 'none',
                morphSVG: {
                    shape: dribble_paths[idx],
                    shapeIndex: shapeIndex,
                },
            });
    });
}
