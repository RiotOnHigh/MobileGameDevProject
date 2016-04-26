/**
 * Created by B00252361 on 22/04/2016.
 */
var button;

var menu =
{
    //Loads Assets for game before it starts
    preload: function()
    {
        // Loading images is required so that later on we can create sprites based on the them.
        // The first argument is how our image will be refered to,
        // the second one is the path to our file.
        this.load.image('title', 'Assets/Images/PlaceholderTitle.png');
        this.load.image('start', 'Assets/Images/StartButton.jpg');
        this.load.spritesheet('button','Assets/Images/button_sprite_sheet.png',193,71);
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
        this.add.button(0, 0, 'button', startGame, this,2,1,0);

    }
};

function startGame () {
    // Change the state to the actual game.
    game.state.start('play');
}
