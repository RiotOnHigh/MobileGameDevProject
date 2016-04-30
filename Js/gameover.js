/**
 * Created by B00252361 on 22/04/2016.
 */


var gameOver = {

    preload : function(){

    },

    create : function() {
        console.log(winner);
        this.text = this.add.text(250, 180, "The winner is : " + winner, style);

    }

}
