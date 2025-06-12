// Global game data
const gameData = {
  heartsCollected: 0
};

// Cena de início
class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  preload() {
    this.load.image('dudu1', 'assets/dudu1.png');
    this.load.image('dudu2', 'assets/dudu2.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.audio('jump', 'assets/sfx/jump.mp3');
    this.load.audio('win', 'assets/sfx/win.mp3');
    this.load.audio('endgame', 'assets/sfx/endgame.mp3');
    this.load.audio('pegarcore', 'assets/sfx/pegarcore.mp3');
  }

  create() {
    this.add.rectangle(160, 120, 320, 240, 0xf9c2d3);

    this.add.text(160, 80, 'Para você, grandão!', {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'Arial',
      stroke: '#ff69b4',
      strokeThickness: 2,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);

    this.add.text(160, 110, '💖', {
      fontSize: '24px'
    }).setOrigin(0.5);

    const startButton = this.add.text(160, 160, 'START', {
      fontSize: '16px',
      fill: '#fff',
      backgroundColor: '#ff69b4',
      padding: { x: 20, y: 10 },
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    startButton.setInteractive({ useHandCursor: true });

    startButton.on('pointerdown', () => {
      this.scene.start('Level1Scene');
    });

    startButton.on('pointerover', () => {
      startButton.setScale(1.1);
    });

    startButton.on('pointerout', () => {
      startButton.setScale(1);
    });

    this.add.text(160, 200, 'Use as setas para se mover', {
      fontSize: '10px',
      fill: '#666',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }
}

// Level 1
class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
  }

  create() {
    gameData.heartsCollected = 0;

    this.add.rectangle(160, 120, 320, 240, 0x87CEEB);

    this.add.text(160, 20, 'Primeira Memória', {
      fontSize: '14px',
      fill: '#fff',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 1
    }).setOrigin(0.5);

    this.heartCounter = this.add.text(20, 40, 'Corações: 0/5', {
      fontSize: '10px',
      fill: '#fff',
      fontFamily: 'Arial'
    });

    this.platforms = this.physics.add.staticGroup();

    const ground = this.platforms.create(160, 220, null).setSize(320, 40);
    const left = this.platforms.create(80, 180, null).setSize(60, 20);
    const right = this.platforms.create(240, 140, null).setSize(60, 20);

    [ground, left, right].forEach(p => {
      p.setVisible(false);
      p.refreshBody();
    });

    this.player = this.physics.add.sprite(50, 180, 'dudu1').setScale(0.15);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.platforms);

    this.hearts = this.physics.add.group();

    const heartPositions = [
      { x: 100, y: 100 },
      { x: 200, y: 60 },
      { x: 280, y: 100 },
      { x: 150, y: 140 },
      { x: 60, y: 140 }
    ];

    heartPositions.forEach(pos => {
      const heart = this.hearts.create(pos.x, pos.y, 'heart').setScale(1.5);
      heart.setBounce(0.3);
    });

    this.physics.add.collider(this.hearts, this.platforms);
    this.physics.add.overlap(this.player, this.hearts, this.collectHeart, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.playerAnimTimer = 0;
    this.isMoving = false;
  }

  update() {
    this.player.setVelocityX(0);
    this.isMoving = false;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.isMoving = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.isMoving = true;
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    this.playerAnimTimer += this.game.loop.delta;
    if (this.isMoving && this.playerAnimTimer > 200) {
      this.player.setTexture(this.player.texture.key === 'dudu1' ? 'dudu2' : 'dudu1');
      this.playerAnimTimer = 0;
    } else if (!this.isMoving) {
      this.player.setTexture('dudu1');
    }
  }

  collectHeart(player, heart) {
    heart.destroy();
    gameData.heartsCollected++;

    this.heartCounter.setText(`Corações: ${gameData.heartsCollected}/5`);
    // this.sound.play('pegarcore');

    if (gameData.heartsCollected >= 5) {
      this.time.delayedCall(500, () => {
        alert('Lembra disso? Acho que melhor do que eu, né.');
        this.scene.start('Level2Scene');
      });
    }
  }
}

// Level 2
class Level2Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level2Scene' });
  }

  create() {
    this.add.rectangle(160, 120, 320, 240, 0xFFB6C1);

    this.add.text(160, 20, 'Momentos Bobinhos', {
      fontSize: '14px',
      fill: '#fff',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 1
    }).setOrigin(0.5);

    this.add.text(160, 120, 'Em desenvolvimento...', {
      fontSize: '16px',
      fill: '#fff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const nextButton = this.add.text(160, 160, 'Ir para Final', {
      fontSize: '12px',
      fill: '#fff',
      backgroundColor: '#ff69b4',
      padding: { x: 15, y: 8 },
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    nextButton.setInteractive({ useHandCursor: true });
    nextButton.on('pointerdown', () => {
      this.scene.start('FinalScene');
    });
  }
}

// Final Scene
class FinalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FinalScene' });
  }

  create() {
    this.add.rectangle(160, 120, 320, 240, 0xFF1493);

    this.add.text(160, 40, 'Sua ♥', {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(160, 100, 'Você chegou até mim!', {
      fontSize: '14px',
      fill: '#fff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(160, 140, '💖💕💖', {
      fontSize: '20px'
    }).setOrigin(0.5);

    const restartButton = this.add.text(160, 180, 'Jogar Novamente', {
      fontSize: '12px',
      fill: '#fff',
      backgroundColor: '#ff69b4',
      padding: { x: 15, y: 8 },
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    restartButton.setInteractive({ useHandCursor: true });
    restartButton.on('pointerdown', () => {
      this.scene.start('StartScene');
    });
  }
}

// Phaser game config
const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [StartScene, Level1Scene, Level2Scene, FinalScene]
};

const game = new Phaser.Game(config);
