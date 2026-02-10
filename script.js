const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        }

    },
    scene: { preload, create, update },
};

const game = new Phaser.Game(config);
let player;
let cursors;
let platforms;
let coin;
let score = 0;
let scoreText;
let gameEnded = false;
let endText;

function preload() {
    this.load.spritesheet('Player', 'https://i.ibb.co/x8PdDPPS/Player.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('Platforms', 'https://i.ibb.co/YY1G68t/platforms.png', { frameWidth: 32, frameHeight: 16 });
    this.load.spritesheet('Coin', "https://i.ibb.co/9H8YyDS2/coin.png", { frameWidth: 16, frameHeight: 16 });
    this.load.audio('coin-sound', 'Assets/Audio/coin.mp3');
    this.load.audio('jump-sound', 'Assets/Audio/jump.mp3');
}

function create() {
    console.log(this.textures.exists('Player'));
    player = this.physics.add.sprite(10, 350, 'Player');
    player.setScale(2);
    player.body.setSize(15, 28)
    player.body.setOffset(8, -5);
    player.setDrag(100);
    this.cameras.main.centerOn(400, 300);



    platforms = this.physics.add.staticGroup();
    let plf = this.textures.get('Platforms').getFrameNames();
    for (let i = 0; i < 4; i++) {
        platforms.create(0 + (i * 32), 400, 'Platforms', plf[0]).setScale(2).refreshBody();
    }

    for (let j = 0; j < 3; j++) {
        platforms.create(200 + (j * 32), 350, 'Platforms', plf[4]).setScale(2).refreshBody();
    }

    for (let k = 0; k < 7; k++) {
        platforms.create(600 + (k * 32), 550, 'Platforms', plf[5]).setScale(2).refreshBody();
    }

    platforms.create(400, 300, 'Platforms', plf[4]).setScale(2).refreshBody();

    coin = this.physics.add.group();
    const coinPositions = [
        { x: 250, y: 300 },
        { x: 400, y: 250 },
        { x: 650, y: 500 },
        { x: 100, y: 350 }
    ];

    scoreText = this.add.text(
        16,
        16,
        'Score: 0',
        { fontSize: '20px', fill: '#fff' }

    )

    this.physics.add.overlap(player, coin, (player, coin) => {
        coin.disableBody(true, true);
        this.sound.play('coin-sound');
        score += 10;
        scoreText.setText('Score: ' + score);
        if (score >= 40 && !gameEnded) {
            winGame(this);
        }
    });

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('Player', {
            start: 0,
            end: 5
        }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'walk-left',
        frames: this.anims.generateFrameNumbers('Player', {
            start: 24,
            end: 29
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'coin-spin',
        frames: this.anims.generateFrameNumbers('Coin', {
            start: 0,
            end: 11
        }),
        frameRate: 12,
        repeat: -1
    });

    coinPositions.forEach(pos => {
        const newCoin = coin.create(pos.x, pos.y, 'Coin');
        newCoin.setScale(2);
        this.physics.add.collider(coin, platforms);
        newCoin.play('coin-spin');
    });

    this.input.keyboard.once('keydown-R', () => {
            this.sound.stopAll();
            gameEnded = false;
            score = 0;
            this.scene.restart();
    });


    player.play('idle');
}


function update() {

    if (gameEnded) return;
    if (player.y > this.physics.world.bounds.height) {
        gameOver(this);
    }
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.play('walk-left', true);
        player.flipX = true;
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(+160);
        player.play('walk-left', true);
        player.flipX = false;
    }
    else {
        player.setVelocityX(0);
        player.play('idle', true);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-200);
        this.sound.play('jump-sound');
    }
}

 function winGame(scene) {
        if (gameEnded) return;

        gameEnded = true;
        scene.physics.pause();

        endText = scene.add.text(
            400,
            300,
            'GAME 1\nYou Win!\nPress R to Restart',
            {
                fontSize: '32px',
                fill: '#00ff00',
                align: 'center'
            }
        ).setOrigin(0.5);
    }

    function gameOver(scene) {
        if (gameEnded) return;

        gameEnded = true;
        scene.physics.pause();

        endText = scene.add.text(
            400,
            300,
            'GAME OVER\nPress R to Restart',
            {
                fontSize: '32px',
                fill: '#ff0000',
                align: 'center'
            }
        ).setOrigin(0.5);
    }