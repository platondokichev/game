import mainScene from './mainScene.js'
const config = {
    type: Phaser.AUTO,
    width: 1150,
    height: 700,
    parent: 'game',
    physics:{
        default: 'arcade',
        arcade:{
            gravity: {y:300},
            debug: false
        }
    },
    scene:[mainScene]
}
new Phaser.Game(config);