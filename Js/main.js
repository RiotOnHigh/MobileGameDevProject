/**
 * Created by B00252361 on 22/04/2016.
 */
    //Initiate the phaser framework
var game = new Phaser.Game(640, 360, Phaser.CANVAS);

    //Initiate the game state
//var game;

//First parameter is how our state will be called
//Second is an object containing the needed methods for state functionality
game.state.add('menu', menu);

// Adding the Game state.
game.state.add('play', play);

//adding the gameover state
game.state.add('gameOver', gameOver);

game.state.start('menu');