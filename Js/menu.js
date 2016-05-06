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
        this.load.image('title', 'Assets/Images/TitleBackground.png');
        this.load.spritesheet('button','Assets/Images/start.png',193,71);
        this.load.spritesheet('reset','Assets/Images/reset.png',193,71);
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

        // Add menu screen.
        this.title = this.game.add.sprite(0, 0, 'title');

        // Add menu buttons
        this.add.button(this.world.width/2, this.world.height/2, 'button', toLobby, this,1,0,2);
        this.add.button(this.world.width/2, this.world.height/1.2, 'reset', resetFirebase, this,1,0,2);
    },

    update: function() {

    }
    
    
    
};

function toLobby () {
    // Change the state to lobby
    game.state.start('lobby');
}

function resetFirebase () {
    fb.child("/location").set(null, function(err){ if (err) console.dir(err); });
    fb.child("/readiness").set(null, function(err){ if (err) console.dir(err); });
}