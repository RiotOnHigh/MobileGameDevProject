/**
 * Created by Fritz8 on 28/04/2016.
 */

var player;

var readiness = {};

if (fb) {
    // This gets a reference to the 'location" node.
    var fbReadiness = fb.child("/readiness");
    // Now we can install event handlers for nodes added, changed and removed.
    fbReadiness.on('child_added', function(sn){
        var data = sn.val();
        //console.dir({'added': data});
        readiness[sn.key()] = data;
    });
    fbReadiness.on('child_changed', function(sn){
        var data = sn.val();
        readiness[sn.key()] = data;
        //console.dir({'moved': data})
    });
    fbReadiness.on('child_removed', function(sn){
        var data = sn.val();
        delete readiness[sn.key()];
        //console.dir(({'removed': data}));
    });
}


var lobby =
{

    preload : function() {
        this.load.image('title', 'Assets/Images/TitleBackground.png');
        this.load.spritesheet('button','Assets/Images/button_sprite_sheet.png',193,71);
        this.load.spritesheet('player1','Assets/Images/player1.png',193,71);
        this.load.spritesheet('player2','Assets/Images/player2.png',193,71);
        addReadiness('player1',false, false);
        addReadiness('player2',false, false);
    },

    create : function() {
        this.title = this.game.add.sprite(0, 0, 'title');
        this.add.button(0, 0, 'player1', startGame1, this,1,0,1);
        this.add.button(200, 0, 'player2', startGame2, this,1,0,1);
        this.text = this.add.text(150, 200, "player1 ready:" + readiness[getRKey('player1')].ready, style);
        this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.text2 = this.add.text(150, 300, "player2 ready:" + readiness[getRKey('player2')].ready, style);
        this.text2.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    },

    update : function() {
        this.text.setText("player1 ready:" + readiness[getRKey('player1')].ready);
        this.text2.setText("player2 ready:" + readiness[getRKey('player2')].ready);
        if ( readiness[getRKey('player1')].ready==true && readiness[getRKey('player2')].ready==true){
            console.log(readiness[getRKey('player1')].ready);
            console.log(readiness[getRKey('player2')].ready);
            this.state.start('play');
        }
    }

};

function getRKey(name){
    var loc;
    for(loc in readiness){
        if(readiness[loc].player === name){
            return loc;
        }
    }
    return null;
}

function addReadiness(name, ready, ingame) {
    // Prevent a duplicate name...
    if (getRKey(name)) return;
    // Name is valid - go ahead and add it...
    fb.child("/readiness").push({
        player: name,
        ready : ready,
        ingame: ingame
    }, function(err) {
        if(err) console.dir(err);
        //showLocations();
    });
}

function updateReadiness(ref, name, ready, ingame){
    fb.child("/readiness/" + ref).set({
        player: name,
        ready : ready,
        ingame: ingame
    }, function(err) {
        if(err) {
            console.dir(err);
        }
        //showLocations();
    });
}

function startGame1 () {
    // Change the state to the actual game.
    if (player == 'player2'){
        updateReadiness(getRKey(player),player,false,false);
    }
    player = 'player1';
    updateReadiness(getRKey(player),player,true,false);
}

function startGame2 () {
    // Change the state to the actual game.
    if (player == 'player1'){
        updateReadiness(getRKey(player),player,false,false);
    }
    player = 'player2';
    updateReadiness(getRKey(player),player,true,false);
}