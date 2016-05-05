/**
 * Created by B00252361 on 22/04/2016.
 */

//firebase stuff
var fb = new Firebase("https://glaring-fire-4830.firebaseio.com/");

var menu =
{
    //Loads Assets for game before it starts
    preload: function()
    {
        // Loading images is required so that later on we can create sprites based on the them.
        // The first argument is how our image will be refered to,
        // the second one is the path to our file.
        this.load.image('title', 'Assets/Images/TitleBackground.png');
        //this.load.image('start', 'Assets/Images/StartButton.jpg');
        this.load.spritesheet('button','Assets/Images/StartClick.png',193,71);


    },

    //Executes everything after loaded
    create: function()
    {
        // For Screen Scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.minWidth = 640;
        this.scale.minHeight = 360;
        this.scale.maxWidth = 1024;
        this.scale.maxHeight = 768;
        this.scale.forceLandscape = true;

        // Add a sprite to your game, here the sprite will be the game's logo
        // Parameters are : X , Y , image name (see above)
        this.title = this.game.add.sprite(0, 0, 'title');
        //this.start = this.game.add.sprite(game.world.centerX - 95, 400, 'start');

        // Add menu screen.
        // It will act as a button to start the game.
        this.add.button(this.world.width/2, this.world.height/2, 'button', toLobby, this,1,0,2);
    }
};

function toLobby () {
    // Change the state to lobby
    game.state.start('lobby');
}
 