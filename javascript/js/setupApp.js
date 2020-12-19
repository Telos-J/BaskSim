let score = 0;
let attempt = 0;
let made = 0;
let shootProb = 0;

function generateTeam() {
    const target1 = {
        x: buffer.canvas.width - 55,
        y: buffer.canvas.height / 2,
    };
    // prettier-ignore
    const team1 = [
        new Player('PG', 185, 86, 11, 'Myron Boyce', 338, 272, target1,pguardAttribute),
        new Player('SG', 198, 94, 24, 'Adam Chester', 293, 135, target1,sguardAttribute),
        new Player('SF', 202, 101, 34, 'Daanyal Graves', 101, 423,sforwardAttribute),
        new Player('PF', 208, 111, 21, 'Tyreese Ward', 88, 181, target1,pforwardAttribute),
        new Player('C', 217, 121, 12, 'Donovan Robinson', 154, 341, target1,centerAttribute),
    ];

    const team1DOM = document.querySelectorAll('.green');
    team1.forEach((player, index) => {
        player.playerDOM = team1DOM[index];
        setDOM(player.playerDOM, player);
    });

    const target2 = { x: 55, y: buffer.canvas.height / 2 };
    // prettier-ignore
    const team2 = [
        new Player('PG', 184, 89, 7, 'Damion Lee', buffer.canvas.width - 338, 272, target2,pguardAttribute),
        new Player('SG', 200, 98, 13, 'Chris Paul', buffer.canvas.width - 293, 135, target2,sguardAttribute),
        new Player('SF', 206, 102, 23, 'Zaire Willams', buffer.canvas.width - 101, 423, target2,sforwardAttribute),
        new Player('PF', 210, 107, 34, 'Giannis Antetokumpo', buffer.canvas.width - 88, 181, target2,pforwardAttribute),
        new Player('C', 216, 128, 54, 'Dwight Howard', buffer.canvas.width - 154, 341, target2,centerAttribute),
    ];

    return [team1, team2];
}

function setDOM(playerDOM, player) {
    const displayDOM = document.querySelector('.display');

    playerDOM.getElementsByClassName('number')[0].innerHTML =
        player.back_number;
    const blob = playerDOM.getElementsByClassName('blob')[0];
    const blob_paths = Array.from(blob.children);
    idleAnimation(blob_paths);

    playerDOM.addEventListener('mouseover', (e) => {
        displayDOM.style.display = 'block';
        displayDOM.style.transform =
            'translate(' + (e.clientX + 20) + 'px, ' + (e.clientY + 20) + 'px)';
        displayDOM.innerHTML =
            player.name +
            '<br>' +
            player.role +
            '<br>' +
            player.height +
            'cm<br>' +
            player.weight +
            'kg';
    });

    playerDOM.addEventListener('click', () => {
        controlPlayer = player;
    });

    playerDOM.addEventListener(
        'mouseleave',
        () => (displayDOM.style.display = 'none')
    );
}

function drawTeam(team, color) {
    const playerDOM = document.querySelectorAll('.' + color);

    team.forEach((player, index) => {
        let position = convertToWindowCoord(
            player.playerDOM.querySelector('svg').classList.contains('flip')
                ? new Vector2(player.x - 20, player.y - 20)
                : new Vector2(player.x - 40, player.y - 20)
        );

        playerDOM[index].style.transform =
            'translate(' + position.x + 'px, ' + position.y + 'px)';
    });
}
