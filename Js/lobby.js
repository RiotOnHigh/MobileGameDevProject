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
        this.load.spritesheet('button','Assets/Images/button_sprite_sheet.png',193,71);
        addReadiness('player1',false, false);
        addReadiness('player2',false, false);
    },

    create : function() {
        this.add.button(0, 0, 'button', startGame1, this,2,1,0);
        this.add.button(200, 0, 'button', startGame2, this,2,1,0);

    },

    update : function() {


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
    player = 'player1';
    updateReadiness(getRKey(player),player,true,false);
}

function startGame2 () {
    // Change the state to the actual game.
    player = 'player2';
    updateReadiness(getRKey(player),player,true,false);
}