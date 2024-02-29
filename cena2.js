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

    this.moedasColetadas = []; // array para armazenar as moedas coletadas, o qual irei utilizar para atualizar o placar
  
    this.cameras.main.fadeIn(1000, 0, 0, 0); // fade in para o início da cena2

    // adiciono a pontuacao do jogo
    this.pontuacao = 0;

    // adição do background
    this.fundo = this.add.image(0, 0, 'fundo2').setOrigin(0, 0).setScale(0.5);

    // chão, estático pois a personagem vai colidir com ele
    this.chao = this.physics.add.staticImage(0, 710, 'chao').setOrigin(0, 0).refreshBody();

    // adição da plataforma mais curta, estática pois a personagem vai colidir com ela
    this.plataformaP = this.physics.add.staticImage(150, 250, 'plataforma_p').setScale(0.5).refreshBody();

    // cria de um grupo para as plataformas, também estático para que a personagem possa colidir com elas
    this.plataformas = this.physics.add.staticGroup(); 
    
    //adiciono cada plataforma ao grupo 'plataformas'. o método refreshBody() serve para atualizar suas dimensões, para que correspondam perfeitamente à imagem. Outros objetos do jogo também utilizam 
    this.plataformas.create(400, 480, 'plataforma_m').setScale(0.5).refreshBody(); 
    this.plataformas.create(1100, 300, 'plataforma_m').setScale(0.5).refreshBody();


     // adiciono a personagem como um sprite, pois ela é uma spritesheet. ela é associada às físicas do jogo pois quero que ela tenha comportamentos físicos
    this.player = this.physics.add.sprite(100, 600, 'player').setScale(1.4);
    
    // defino que a personagem, ao surgir, não ultrapassará os limites da tela
    this.player.setCollideWorldBounds(true);

    //efeito de pulo quando a personagem colide com o chão
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

    // criação da moeda
    this.coin = this.physics.add.sprite(600, 0, 'coin').setScale(0.8);

    this.coin.setCollideWorldBounds(true); // garante a colisão, para que a moeda não atravesse os limites do jogo

    this.physics.add.collider(this.coin, this.chao); // define uma colisão entre o chão e a moeda

    this.physics.add.collider(this.coin, this.plataformas); // define uma colisão entre a moeda e as plataformas largas. como plataforma é um grupo, posso referenciar as duas de uma vez

    this.physics.add.collider(this.coin, this.plataformaP); // define uma colisão entre a moeda e a plataforma estreita

    this.coin.setBounce(0.4); // moeda vai ter um efeito de bounce ao tocar nos objetos

    // criação do baú
    this.bau = this.physics.add.sprite(1100, 100, 'bau').setScale(0.9).setDepth(9);

    // define que o frame do baú começa no índice 0, ou seja, a imagem inicial do baú
    this.bau.setFrame(0);

    this.physics.add.collider(this.bau, this.plataformas); // define uma colisão entre o baú e as plataformas largas

    this.bau.setCollideWorldBounds(true); // garante a colisão, para que o baú não atravesse os limites do jogo ao surgir


    // ANIMAÇÃO DA PERSONAGEM

    // andar
    this.anims.create({
        key: 'Walk',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
        frameRate: 20,
        repeat: -1
    });


     // Abaixo ficam os eventos para quando a personagem encostar (validação disso ocorre com a adição de overlap) na moeda
     this.physics.add.overlap(this.player, this.coin, () => { 

        this.coin.setVisible(false); // torno a moeda invisível

        this.posicaoMoeda_X = Phaser.Math.RND.between(50, config.width); // número é sorteado

        this.coin.setPosition(this.posicaoMoeda_X, 100); // configura nova posição da moeda para a posição do número sorteado acima

        this.pontuacao += 1; // soma pontuação

        atualizarMoedasColetadas.call(this); // chama a função que atualiza a lista de moedas coletadas

        this.coin.setVisible(true); // faz aparecer a moeda na posição do número sorteado
    });

    // overlap que define o que acontece com a colisão entre a personagem e o baú
    this.physics.add.overlap(this.player, this.bau, () => { 
        this.bau.setFrame(1); // baú muda para o frame 1, no qual ele está aberto
    
        // usei o método delayedCall para atrasar a execução da função que para a cena
        this.time.delayedCall(1000, () => {
             // para a cena
            this.scene.stop('cena2');
        });
    });

    // função que atualiza a lista de moedas coletadas
    function atualizarMoedasColetadas() {
        this.moedasColetadas.push(this.pontuacao); // Adiciona a pontuação da moeda coletada à lista de moedas coletadas

        //adicionei um for que sempre irá atualizar a pontuação, pois sua condição sempre será verdadeira, afinal, i começará em 0 e o placar sempre um número a mais, portanto i < placar sempre será verdadeiro
        for (let i = 0; i < this.moedasColetadas.length; i++) {
            this.placar.setText('Moedas: ' + this.pontuacao); // implementa o novo texto do placar
        }
       
    }

    }

    update () {
        
        // condições que realizam a movimentação da personagem
        if (this.teclado.left.isDown) {
            this.player.setVelocityX(-250); // define a velocidade para a esquerda quando a tecla esquerda é clicada

            this.player.setFlip(true, false); // Inverte a orientação da personagem
            
            this.player.anims.play('Walk', true); // dá play na animação de caminhada
        }

        
        else if (this.teclado.right.isDown) {
            this.player.setVelocityX(250); // define a velocidade para a direita quando a tecla direita é clicada

            this.player.setFlip(false, false); // Inverte a orientação da personagem

            this.player.anims.play('Walk', true);// dá play na animação de caminhada
        }

        else if (this.teclado.up.isDown && this.teclado.right.isDown) {
            // ações para o caso da tecla para cima e a tecla para a esquerda serem clicadas ao mesmo tempo

            this.player.setVelocityY(-300); // define velocidade para cima quando a tecla para cima é clicada, o número é negativo pois a coordenada y é invertida

            this.player.setVelocityY(250); // cria um efeito de gravidade, que impede que a personagem fique pulando infinitamente

            this.player.setVelocityX(250); // movimento da personagem para a direita

            this.player.setFlip(false, false); // não inverte a orientação da personagem
        }

        else if (this.teclado.up.isDown && this.teclado.left.isDown) {
        // ações para o caso da tecla para cima e a tecla para a esquerda serem clicadas ao mesmo tempo

            this.player.setVelocityY(-300); // define velocidade para cima quando a tecla para cima é clicada

            this.player.setVelocityY(250); // cria um efeito de gravidade, que impede que a personagem fique pulando infinitamente

            this.player.setVelocityX(-250); // movimento da personagem para a esquerda

            this.player.setFlip(true, false); // Inverte a orientação da personagem
        }

        else if (this.teclado.up.isDown) {
            // ações para quando apenas a tecla para cima é clicada

            this.player.setVelocityY(-300);   // ações para quando apenas a tecla para cima é clicada

            this.player.anims.play('Walk', false); // dá pause na animação de caminhada
        }


        else {
             // ações para quando nenhuma tecla é clicada

            this.player.setVelocityX(0); // zera a velocidade da personagem

            this.player.anims.play('Walk', false); // dá pause na animação de caminhada
        }

    }
}