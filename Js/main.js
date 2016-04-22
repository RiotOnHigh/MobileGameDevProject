/**
 * Created by B00252361 on 22/04/2016.
 */
var GameState =
{
    //Loads Assets for game before it starts
    preload: function()
    {

        this.load.image('title', 'Assets/Images/PlaceholderTitle.png');

    },

    //Executes everything after loaded
    create: function()
    {

        this.titile = this.game.add.sprite(0, 0, 'title');

    },

    //This is executed multiple times per second
    update: function()
    {


        
    },
};

//Initiate the phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');