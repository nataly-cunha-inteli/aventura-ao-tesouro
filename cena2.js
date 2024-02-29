class cena2 extends Phaser.Scene {
    constructor() {
        super({ key: 'cena2' });
    }

    
 preload () {
    // carregamento prévio das imagens e as spritesheets do jogo
    this.load.image('fundo2', 'assets/cenario/cena2.png');
    this.load.spritesheet('player', 'assets/player/Walk.png', { frameWidth: 128, frameHeight: 128});
    this.load.spritesheet('bau', 'assets/bau.png', { frameWidth: 204, frameHeight: 134});
    this.load.image('chao', 'assets/plataformas/chao.png');
    this.load.image('plataforma_p', 'assets/plataformas/plataforma_p.png');
    this.load.image('plataforma_m', 'assets/plataformas/plataforma_m.png');
    this.load.spritesheet('coin', 'assets/coin.png', { frameWidth: 100, frameHeight: 100});
    
}

 create () {
  
    this.cameras.main.fadeIn(1000, 0, 0, 0); // fade in para o início da cena *trocar para um retângulo diminuindo, como no contrário da cena inicial

    // adiciono a pontuacao do jogo
    this.pontuacao = 0;

    //background
    this.fundo = this.add.image(0, 0, 'fundo2').setOrigin(0, 0).setScale(0.5);

    // chão, estático pois a personagem vai colidir com ele
    this.chao = this.physics.add.staticImage(0, 710, 'chao').setOrigin(0, 0).refreshBody();

    // adição da plataforma mais curta, estática pois a personagem vai colidir com ela
    this.plataformaP = this.physics.add.staticImage(150, 250, 'plataforma_p').setScale(0.5).refreshBody();

    // cria de um grupo para as plataformas, também estático para que a personagem possa colidir com elas
    this.plataformas = this.physics.add.staticGroup(); 
    
    //adiciono cada plataforma ao grupo 'plataformas'. o método refreshBody() serve para atualizar suas dimensões, para que correspondam perfeitamente à imagem
    this.plataformas.create(400, 480, 'plataforma_m').setScale(0.5).refreshBody(); 
    this.plataformas.create(1100, 300, 'plataforma_m').setScale(0.5).refreshBody();


    // adiciono a personagem como um sprite, pois ela é uma spritesheet na verdade
    this.player = this.physics.add.sprite(100, 600, 'player').setScale(1.4);
    
    // defino que a personagem, ao surgir, não ultrapassará os limites da tela
    this.player.setCollideWorldBounds(true);

    //efeito de pulo quando ela colide com o chão
    this.player.setBounce(0.2);

    //defino a colisão entre a personagem e o chão
    this.physics.add.collider(this.player, this.chao);

    //defino a colisão entre a personagem e as plataformas
    this.physics.add.collider(this.player, this.plataformaP);
    this.physics.add.collider(this.player, this.plataformas);

    // defino que as teclas do teclado serão usadas para controlar a personagem
    this.teclado = this.input.keyboard.createCursorKeys();

    // adiciono o texto do placar
    this.placar = this.add.text(50, 50, 'Moedas: ' + this.pontuacao, {fontFamily: 'Roboto', fontSize: 40, fill:'#000000'});

    // defino a camada do placar como a mais alta, para que fique sempre visível
    this.placar.setDepth(5);

    //moeda
    this.coin = this.physics.add.sprite(600, 0, 'coin').setScale(0.8); // cria a moeda e define a posição inicial dela, é importante que seja diferente da do alien, do contrário o placar sempre vai começar somado +1

    this.coin.setCollideWorldBounds(true); // garante a colisão, para que a moeda não atravesse os limites do jogo
    this.physics.add.collider(this.coin, this.chao); // define uma colisão entre o chão e a moeda
    this.physics.add.collider(this.coin, this.plataformas); // define uma colisão entre a moeda e as plataformas largas
    this.physics.add.collider(this.coin, this.plataformaP); // define uma colisão entre a moeda e a plataforma estreita

    this.coin.setBounce(0.4); // moeda vai ter um efeito de bounce ao tocar nos objetos

    this.bau = this.physics.add.sprite(1100, 100, 'bau').setScale(0.9).setDepth(9);
    this.bau.setFrame(0)
    this.physics.add.collider(this.bau, this.plataformas); // define uma colisão entre o baú e as plataformas largas
    this.bau.setCollideWorldBounds(true); // garante a colisão, para que o baú não atravesse os limites do jogo


    // ANIMAÇÕES DA PERSONAGEM

    this.anims.create({
        key: 'Walk',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'Jump',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
        frameRate: 20,
        repeat: -1
    });

     // Abaixo ficam os eventos para quando a personagem encostar (validação disso ocorre com a adição de overlap) na moeda
     this.physics.add.overlap(this.player, this.coin, () => { 

        this.coin.setVisible(false);

        this.posicaoMoeda_X = Phaser.Math.RND.between(50, config.width); // número é sorteado

        this.coin.setPosition(this.posicaoMoeda_X, 100); // configura nova posição da moeda para a posição do número sorteado acima

        this.pontuacao += 1; // soma pontuação

        this.placar.setText('Moedas: ' + this.pontuacao); // atualiza a pontuação

        this.coin.setVisible(true); // faz aparecer a moeda na posição do número sorteado
    });

    this.physics.add.overlap(this.player, this.bau, () => { 
        this.bau.setFrame(1);
    
        // Usando o método delayedCall para atrasar a execução da função que para a cena
        this.time.delayedCall(1000, () => {
            this.scene.stop('cena2');
        });
    });

    }

    update () {
        
        if (this.teclado.left.isDown) {
            this.player.setVelocityX(-250);
            this.player.setFlip(true, false); // Inverte a orientação da personagem
            this.player.anims.play('Walk', true);
        }

        
        else if (this.teclado.right.isDown) {
            this.player.setVelocityX(250);
            this.player.setFlip(false, false); // Inverte a orientação da personagem
            this.player.anims.play('Walk', true);
        }

        else if (this.teclado.up.isDown && this.teclado.right.isDown) {
            this.player.setVelocityY(-300);
            this.player.setVelocityY(250);
            this.player.setVelocityX(250);
            this.player.setFlip(false, false); // Inverte a orientação da personagem
        }

        else if (this.teclado.up.isDown && this.teclado.left.isDown) {
            this.player.setVelocityY(-300);
            this.player.setVelocityY(250);
            this.player.setVelocityX(-250);
            this.player.setFlip(true, false); // Inverte a orientação da personagem
        }

        else if (this.teclado.up.isDown) {
            this.player.setVelocityY(-300);
            this.player.anims.play('Walk', true);
        }

        else if(this.placar === 5) {
          //  this.scene.start('cena2');

        }

        else {
            this.player.setVelocityX(0);
            this.player.anims.play('Walk', false);
        }

    }
}