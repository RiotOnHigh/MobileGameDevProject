/**
 * Created by B00252361 on 22/04/2016.
 */
    //Initiate the phaser framework
var game = new Phaser.Game(640, 360, Phaser.CANVAS);

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
        // For Screen Scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;this.scale.minWidth = 480;this.scale.minHeight = 260;this.scale.maxWidth = 1024;this.scale.maxHeight = 768;this.scale.forceLandscape = true;this.scale.pageAlignHorizontally = true;

    },

    //This is executed multiple times per second
    update: function()
    {


        
    },
};



game.state.add('GameState', GameState);
game.state.start('GameState');