/**
 * Created by B00252361 on 22/04/2016.
 */


var gameOver = {

    preload : function(){
        this.load.image('title', 'Assets/Images/TitleBackground.png');
        this.load.spritesheet('button','Assets/Images/StartClick.png',193,71);
    },

    create : function() {
        //this.title = this.add.sprite(0, 0, 'title');
        this.add.button(300,100, 'button', toMenu, this,1,0,2);
        
        console.log(winner);
        this.text = this.add.text(250, 180, "The winner is : " + winner, style);
    }
};

function toMenu () {
    // Change the state to lobby
    updateReadiness(getRKey(player),player,false,false);
    game.state.start('menu');
}
   