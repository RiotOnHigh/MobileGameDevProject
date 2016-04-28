var winner;

var locations = {};

if (fb) {
    // This gets a reference to the 'location" node.
    var fbLocation = fb.child("/location");
    // Now we can install event handlers for nodes added, changed and removed.
    fbLocation.on('child_added', function(sn){
        var data = sn.val();
        //console.dir({'added': data});
        locations[sn.key()] = data;
    });
    fbLocation.on('child_changed', function(sn){
        var data = sn.val();
        locations[sn.key()] = data;
        //console.dir({'moved': data})
    });
    fbLocation.on('child_removed', function(sn){
        var data = sn.val();
        delete locations[sn.key()];
        //console.dir(({'removed': data}));
    });
}

var play =
{
    preload: function() {
        // Loading images is required so that later on we can create sprites based on the them.
        // The first argument is how our image will be refered to,
        // the second one is the path to our file.
        //this.load.spritesheet('dude','Assets/Images/dude.png',32,48);
        this.load.tilemap('map', 'Assets/Images/map2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/Images/tiles.png');
        this.load.image('bullet', 'assets/Images/purple_ball.png');
        this.load.spritesheet('character','Assets/Images/character.png',32,32);
        this.cursors = this.input.keyboard.createCursorKeys();
        console.log(player);
        updateReadiness(getRKey(player),player,true,true);
    },

    create: function() {
        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //world,map and direction settings
        this.world.setBounds(-256, -128, 1240, 800);
        this.safetile = 1;
        this.gridsize = 32;
        this.directions = [null, null, null, null, null];
        this.opposites = [Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];
        this.current = Phaser.DOWN;
        this.marker = new Phaser.Point();

        //  Adding the map and setting the collision
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('tiles', 'tiles');
        this.layer = this.map.createLayer('Tile Layer 1');
        //collisions of the map - player
        this.map.setCollision(20, true, this.layer);
        this.map.setCollision(4, true, this.layer);
        this.map.setCollision(70, true, this.layer);

        // The this.player1 and its settings
        this.player1 = this.add.group();
        this.player1.name = 'player1';

        //the this.player2 and its settingss
        this.player2 = this.add.group();
        this.player2.name = 'player2';

        //projectiles
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(200, 'bullet', 0, false);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.fireRate = 2000;
        this.nextFire = 0;

        this.compare = this.player1.name.localeCompare(player);
        console.log(this.compare);
        this.compare2 = this.player2.name.localeCompare(player);
        console.log(this.compare2);
        if (this.compare == 0) {
            //player in control
            this.control = this.add.group();
            this.control = this.add.sprite(48, 272, 'character');
            this.control.name = this.player1.name;
            addLocation('player1',this.control.x,this.control.y);
            this.physics.arcade.enable(this.control);
            this.control.speed = 2;
            this.control.anchor.set(0.5,0.5);
            this.control.animations.add('down', [0, 1, 2, 1], 10, true);
            this.control.animations.add('left', [3, 4, 5, 4], 10, true);
            this.control.animations.add('right', [6, 7, 8, 7], 10, true);
            this.control.animations.add('up', [9, 10, 11, 10], 10, true);
            this.control.currentLife = 3;

            //enemy player
            this.enemy = this.add.group();
            this.enemy = this.add.sprite(528, 272, 'character');
            this.enemy.name = 'player2';
            addLocation('player2',this.enemy.x,this.enemy.y);
            this.physics.arcade.enable(this.enemy);
            this.enemy.speed = 2;
            this.enemy.anchor.set(0.5,0.5);
            this.enemy.animations.add('down', [0, 1, 2, 1], 10, true);
            this.enemy.animations.add('left', [3, 4, 5, 4], 10, true);
            this.enemy.animations.add('right', [6, 7, 8, 7], 10, true);
            this.enemy.animations.add('up', [9, 10, 11, 10], 10, true);
            this.enemy.currentLife = 3;

        }else if (this.compare2 == 0) {
            //player in control
            this.control = this.add.group();
            this.control = this.add.sprite(528, 272, 'character');
            this.control.name = this.player2.name;
            addLocation('player2',this.control.x,this.control.y);
            this.physics.arcade.enable(this.control);
            this.control.speed = 2;
            this.control.anchor.set(0.5,0.5);
            this.control.animations.add('down', [0, 1, 2, 1], 10, true);
            this.control.animations.add('left', [3, 4, 5, 4], 10, true);
            this.control.animations.add('right', [6, 7, 8, 7], 10, true);
            this.control.animations.add('up', [9, 10, 11, 10], 10, true);
            this.control.currentLife = 3;

            //enemy player
            this.enemy = this.add.group();
            this.enemy = this.add.sprite(48, 272, 'character');
            this.enemy.name = 'player1';
            addLocation('player1',this.enemy.x,this.enemy.y);
            this.physics.arcade.enable(this.enemy);
            this.enemy.speed = 2;
            this.enemy.anchor.set(0.5,0.5);
            this.enemy.animations.add('down', [0, 1, 2, 1], 10, true);
            this.enemy.animations.add('left', [3, 4, 5, 4], 10, true);
            this.enemy.animations.add('right', [6, 7, 8, 7], 10, true);
            this.enemy.animations.add('up', [9, 10, 11, 10], 10, true);
            this.enemy.currentLife = 3;
        }

        //camera
        this.camera.follow(this.control);

        //console.log(this.control.name);
    },

    fire : function () {

        if (this.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.time.now + this.fireRate;
            this.shot = this.bullets.getFirstDead();
            this.shot.reset(this.control.body.x+16, this.control.body.y+16);

            //this.shot.move(this.current);
           this.physics.arcade.moveToPointer(this.shot, 250);
        }
    },

    playerKeys: function () {
        if (this.cursors.left.isDown) {
            //  Move to the left
            this.control.body.x -= this.control.speed; //this.player1 speed
            this.control.animations.play('left');
            this.current = Phaser.LEFT;
        }
        else if (this.cursors.right.isDown) {
            //  Move to the right
            this.control.body.x += this.control.speed;
            this.control.animations.play('right');
            this.current = Phaser.RIGHT;
        }
        else if (this.cursors.down.isDown) {
            this.control.body.y += this.control.speed;
            this.control.animations.play('down');
            this.current = Phaser.DOWN;
        }
        else if (this.cursors.up.isDown) {
            this.control.body.y -= this.control.speed;
            this.control.animations.play('up');
            this.current = Phaser.UP;
        }
        else {
            //  Stand still
            this.control.body.velocity = 0;
            this.control.animations.stop();
            //this.player1.frame = 1;
        }
        //console.log(this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown);
        if (this.input.activePointer.isDown)
        {
            this.fire();
        }
        /*function() {
            this.bullet = this.bullet.getFirstExists(false);
            this.bullet.reset(this.player1.body.x, this.player1.body.y);
            this.bullet.body.rotation = this.physics.arcade.angleToPointer(this.current);
        }*/


    },

    update: function() {
        if (readiness[getRKey(this.enemy.name)].ingame)
            updateReadiness(getRKey(this.enemy.name),this.enemy.name,false,true);
        //add text saying that the other player has joined ?

        updateLocation(getKey(this.control.name),this.control.name,this.control.x,this.control.y);
        //updateLocation(getKey(this.enemy.name),this.enemy.name,this.enemy.x,this.enemy.y);
        this.enemy.body.x = locations[getKey(this.enemy.name)].x-16;
        this.enemy.body.y = locations[getKey(this.enemy.name)].y-16;

        this.playerKeys();
        
        this.physics.arcade.collide(this.control, this.layer);
        this.physics.arcade.overlap(this.enemy,this.bullets,function(){
            play.shot.kill();
           // play.player2.currentLife--;
            //console.log(play.player2.currentLife);
        });

        /*if (this.player2.currentLife <=0) {
            winner = 'player1';
            this.state.start('gameOver');
        }

        if (this.player1.currentLife <=0) {
            winner = 'player2';
            this.state.start('gameOver');
        }*/

        this.marker.x = this.math.snapToFloor(Math.floor(this.control.x), this.gridsize) / this.gridsize;
        this.marker.y = this.math.snapToFloor(Math.floor(this.control.y), this.gridsize) / this.gridsize;

        //  Update our grid sensors
        this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
        this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
        this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
        this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);
    },

    render: function() {

        //  Un-comment this to see the debug drawing

        for (var t = 1; t < 5; t++) {
            if (this.directions[t] === null) {
                continue;
            }

            var color = 'rgba(0,255,0,0.3)';

            if (this.directions[t].index !== this.safetile) {
                color = 'rgba(255,0,0,0.3)';
            }

            if (t === this.current) {
                color = 'rgba(255,255,255,0.3)';
            }

            game.debug.geom(new Phaser.Rectangle(this.directions[t].worldX, this.directions[t].worldY, 32, 32), color, true);
        }
        game.debug.text('Active Bullets: ' + this.bullets.countLiving() + ' / ' + this.bullets.total, 32, 32);
        //this.this.debug.geom(this.turnPoint, '#ffff00');
        //game.debug.cameraInfo(game.camera, 32, 32);
        //game.debug.spriteCoords(this.player1, 32, 200);

    },

    release : function(){
        removeLocation(this.control.name);
        removeLocation(this.enemy.name);
    }
};

function addLocation(name, x, y) {
    // Prevent a duplicate name...
    if (getKey(name)) return;
    // Name is valid - go ahead and add it...
    fb.child("/location").push({
        player: name,
        x: x,
        y: y,
        timestamp: Firebase.ServerValue.TIMESTAMP
    }, function(err) {
        if(err) console.dir(err);
        //showLocations();
    });
}

function getKey(name){
    var loc;
    for(loc in locations){
        if(locations[loc].player === name){
            return loc;
        }
    }
    return null;
}

function updateLocation(ref, name, x, y){
    fb.child("/location/" + ref).set({
        player: name,
        x: x,
        y: y,
        timestamp: Firebase.ServerValue.TIMESTAMP
    }, function(err) {
        if(err) {
            console.dir(err);
        }
        //showLocations();
    });
}

function removeLocation(ref){
    fb.child("/location/" + ref).set(null, function(err){
        if (err) console.dir(err);
       //showLocations();
    });
}

