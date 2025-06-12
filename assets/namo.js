// Cena de início
class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  preload() {
    // Carregamento de assets básicos
    this.load.image('dudu1', 'assets/dudu1.png');
    this.load.image('dudu2', 'assets/dudu2.png');
    this.load.image('heart', 'assets/heart.png');
    
    // Carregamento de sons
    this.load.audio('jump', 'assets/sfx/jump.mp3');
    this.load.audio('win', 'assets/sfx/win.mp3');
    this.load.audio('endgame', 'assets/sfx/endgame.mp3');
    this.load.audio('pegarcore', 'assets/sfx/pegarcore.mp3');
  }

  create() {
    // Fundo gradiente
    this.add.rectangle(160, 120, 320, 240, 0xf9c2d3);
    
    // Título principal
    const title = this.add.text(160, 80, 'Para você, grandão!', {
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

    // Coração decorativo
    const heart = this.add.text(160, 110, '💖', {
      fontSize: '24px'
    }).setOrigin(0.5);

    // Botão Start
    const startButton = this.add.text(160, 160, 'START', {
      fontSize: '16px',
      fill: '#fff',
      backgroundColor: '#ff69b4',
      padding: { x: 20, y: 10 },
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Tornar o botão interativo
    startButton.setInteractive({ useHandCursor: true });
    
    startButton.on('pointerdown', () => {
      // Som de clique (quando implementado)
      this.scene.start('Level1Scene');
    });

    startButton.on('pointerover', () => {
      startButton.setScale(1.1);
    });

    startButton.on('pointerout', () => {
      startButton.setScale(1);
    });

    // Instruções
    this.add.text(160, 200, 'Use as setas para se mover', {
      fontSize: '10px',
      fill: '#666',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }
}

// Nível 1: "Primeira Memória"
class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
  }

  create() {
    // Reset dos dados do nível
    gameData.heartsCollected = 0;
    
    // Fundo do primeiro encontro
    this.add.rectangle(160, 120, 320, 240, 0x87CEEB); // Azul céu
    
    // Título do nível
    this.add.text(160, 20, 'Primeira Memória', {
      fontSize: '14px',
      fill: '#fff',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Contador de corações
    this.heartCounter = this.add.text(20, 40, 'Corações: 0/5', {
      fontSize: '10px',
      fill: '#fff',
      fontFamily: 'Arial'
    });

    // Criar plataformas simples
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(160, 220, null).setSize(320, 40).setVisible(false); // Chão
    this.platforms.create(80, 180, null).setSize(60, 20).setVisible(false); // Plataforma esquerda
    this.platforms.create(240, 140, null).setSize(60, 20).setVisible(false); // Plataforma direita

    // Criar player
    this.player = this.physics.add.sprite(50, 180, 'dudu1').setScale(0.15);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Física do player com plataformas
    this.physics.add.collider(this.player, this.platforms);

    // Criar grupo de corações
    this.hearts = this.physics.add.group();
    
    // Posicionar 5 corações
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

    // Física dos corações com plataformas
    this.physics.add.collider(this.hearts, this.platforms);

    // Colisão player com corações
    this.physics.add.overlap(this.player, this.hearts, this.collectHeart, null, this);

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();

    // Animação do personagem (simples alternância)
    this.playerAnimTimer = 0;
    this.isMoving = false;
  }

  update() {
    // Movimento do player
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

    // Animação simples do personagem
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
    
    // Atualizar contador
    this.heartCounter.setText(`Corações: ${gameData.heartsCollected}/5`);

    // Som de coleta (quando implementado)
    // this.sound.play('pegarcore');

    // Verificar se coletou todos
    if (gameData.heartsCollected >= 5) {
      this.time.delayedCall(500, () => {
        alert('Lembra disso? Acho que melhor do que eu, né.');
        this.scene.start('Level2Scene');
      });
    }
  }
}

// Nível 2: "Momentos Bobinhos"
class Level2Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level2Scene' });
  }

  create() {
    // Fundo diferente para o segundo nível
    this.add.rectangle(160, 120, 320, 240, 0xFFB6C1); // Rosa claro
    
    // Título do nível
    this.add.text(160, 20, 'Momentos Bobinhos', {
      fontSize: '14px',
      fill: '#fff',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Mensagem temporária
    this.add.text(160, 120, 'Em desenvolvimento...', {
      fontSize: '16px',
      fill: '#fff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Botão para pular para a cena final (temporário)
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

// Cena Final: "Sua ♥"
class FinalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FinalScene' });
  }

  create() {
    // Fundo romântico
    this.add.rectangle(160, 120, 320, 240, 0xFF1493); // Rosa profundo
    
    // Título
    this.add.text(160, 40, 'Sua ♥', {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Mensagem de amor
    this.add.text(160, 100, 'Você chegou até mim!', {
      fontSize: '14px',
      fill: '#fff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Corações decorativos
    this.add.text(160, 140, '💖💕💖', {
      fontSize: '20px'
    }).setOrigin(0.5);

    // Botão para reiniciar
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

    // Aqui será onde a voz gravada será reproduzida
    // this.sound.play('voiceMessage');
  }
}

// Configuração principal do jogo
const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  zoom: 4,
  backgroundColor: '#87CEEB', // Azul céu suave
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }, // Gravidade para plataforma
      debug: false
    }
  },
  scene: [StartScene, Level1Scene, Level2Scene, FinalScene]
};

// Inicializar o jogo
const game = new Phaser.Game(config);


// Variáveis globais
let gameData = {
  heartsCollected: 0,
  currentLevel: 1,
  sounds: {}
};

