const config = {
    type: Phaser.AUTO,
    width: 1440, // largura do meu jogo
    height: 810, // altura do meu jogo 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: true
        } // com o physics de tipo 'arcade', consigo fazer um efeito de gravidade com o 'gravity', e com o 'debug' defino que não quero visualizar os limites dos elementos do meu jogo
    },
    
    scene: [cena1, cena2], // lista de cenas em ordem

};

const game = new Phaser.Game(config);
