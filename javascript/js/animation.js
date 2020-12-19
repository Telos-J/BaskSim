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
        } else if (idx == 4 || idx == 1) {
            shapeIndex = 0;
        } else {
            shapeIndex = 'auto';
        }
        gsap.fromTo(
            item,
            {
                morphSVG: walk_paths[idx],
            },
            {
                duration: 0.2,
                repeat: -1,
                yoyo: true,
                ease: 'none',
                morphSVG: {
                    shape: walk2_paths[idx],
                    shapeIndex: shapeIndex,
                },
            },
            0
        );
    });
}
