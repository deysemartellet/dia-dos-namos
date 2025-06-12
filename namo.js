import Phaser from 'phaser';

let collectedHearts = 0;
const totalHearts = 5;
let collectedText;

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    this.load.image('background', 'assets/background.png');
  }

  create() {
    this.add.image(400, 300, 'background');

    this.add.text(260, 200, 'Heart Collector 💖', {
      fontSize: '36px',
      fill: '#fff'
    });

    const startButton = this.add.text(330, 300, 'Start Game', {
      fontSize: '28px',
      fill: '#0f0',
      backgroundColor: '#000',
      padding: { x: 20, y: 10 }
    }).setInteractive();

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    startButton.on('pointerover', () => {
      startButton.setStyle({ fill: '#ff0' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ fill: '#0f0' });
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('background', 'assets/background.png');
  }

  create() {
    collectedHearts = 0;

    this.add.image(400, 300, 'background');

    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setCollideWorldBounds(true);

    this.hearts = this.physics.add.group({
      key: 'heart',
      repeat: totalHearts - 1,
      setXY: { x: 150, y: 0, stepX: 120 }
    });

    this.hearts.children.iterate(heart => {
      heart.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(this.player, this.hearts, this.collectHeart, null, this);

    collectedText = this.add.text(16, 16, 'Hearts: 0/' + totalHearts, {
      fontSize: '24px',
      fill: '#fff'
    });
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    }
  }

  collectHeart(player, heart) {
    heart.disableBody(true, true);
    collectedHearts++;

    collectedText.setText(`Hearts: ${collectedHearts}/${totalHearts}`);

    if (collectedHearts >= totalHearts) {
      this.time.delayedCall(500, () => {
        alert('You collected all the hearts, princess. 💖');
      });
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MenuScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);
