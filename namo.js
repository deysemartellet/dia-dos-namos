const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  zoom: 4,
  backgroundColor: '#000',
  pixelArt: true,
  roundPixels: true,

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let player;
let heart;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('dudu1', 'assets/dudu1.png');
  this.load.image('heart', 'assets/heart.png');
}

let heartCollected = false;

function create() {
  player = this.physics.add.sprite(100, 100, 'dudu1').setScale(0.15);
  heart = this.physics.add.sprite(400, 100, 'heart').setScale(2);

  this.soundFX = new Howl({
    src: ['assets/sfx/pickup.mp3']
  });

  this.physics.add.overlap(player, heart, () => {
  if (!heartCollected) {
    heartCollected = true;
    this.soundFX.play();
    alert('You got my heart 💖');
    heart.destroy();
  }
});

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  player.setVelocity(0);

  if (cursors.left.isDown) player.setVelocityX(-200);
  if (cursors.right.isDown) player.setVelocityX(200);
  if (cursors.up.isDown) player.setVelocityY(-200);
  if (cursors.down.isDown) player.setVelocityY(200);
}
