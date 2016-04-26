var player;

var play =
{
    preload: function() {
        // Loading images is required so that later on we can create sprites based on the them.
        // The first argument is how our image will be refered to,
        // the second one is the path to our file.
        //this.load.spritesheet('dude','Assets/Images/dude.png',32,48);
        this.load.tilemap('map', 'Assets/Images/map2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/Images/tiles.png');
        this.load.spritesheet('character','Assets/Images/character.png',32,32);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.game.world.setBounds(-256, -128, 1240, 800);
        this.map = null;
        this.layer = null;

        this.safetile = 1;
        this.gridsize = 32;

        this.speed = 100;
        this.threshold = 3;
        this.turnSpeed = 150;

        this.marker = new Phaser.Point();
        this.turnPoint = new Phaser.Point();

        this.directions = [null, null, null, null, null];
        this.opposites = [Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];

        this.current = Phaser.UP;
        this.turning = Phaser.NONE;
    },

    create: function() {
        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //this.autoScreenScaling();
        
        //  Adding the map and setting the collision
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('tiles', 'tiles');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.setCollision(20, true, this.layer);

        // The this.player and its settings
        this.player = this.add.group();
        this.player = this.add.sprite(48, 272, 'character');
        this.player.speed = 2;
        this.player.anchor.set(0.5);

        //  Player physics properties.
        this.physics.arcade.enable(this.player);
        //this.player.body.collideWorldBounds = true;

        //  Adding player animations
        this.player.animations.add('down', [0, 1, 2, 1], 10, true);
        this.player.animations.add('left', [3, 4, 5, 4], 10, true);
        this.player.animations.add('right', [6, 7, 8, 7], 10, true);
        this.player.animations.add('up', [9, 10, 11, 10], 10, true);

        //this.move(Phaser.DOWN);

        game.camera.follow(this.player);

    },

    playerKeys: function () {
        if (this.cursors.left.isDown) {
            //  Move to the left
            this.player.body.x -= this.player.speed; //this.player speed
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown) {
            //  Move to the right
            this.player.body.x += this.player.speed;
            this.player.animations.play('right');
        }
        else if (this.cursors.down.isDown) {
            this.player.body.y += this.player.speed;
            this.player.animations.play('down');
        }
        else if (this.cursors.up.isDown) {
            this.player.body.y -= this.player.speed;
            this.player.animations.play('up');
        }
        else {
            //  Stand still
            this.player.body.velocity = 0;
            this.player.animations.stop();
            this.player.frame = 1;
        }



    },

    update: function() {

        this.playerKeys();
        
        this.physics.arcade.collide(this.player, this.layer);

        this.marker.x = this.math.snapToFloor(Math.floor(this.player.x), this.gridsize) / this.gridsize;
        this.marker.y = this.math.snapToFloor(Math.floor(this.player.y), this.gridsize) / this.gridsize;

        //  Update our grid sensors
        this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
        this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
        this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
        this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);

       // this.checkKeys();

    },

    autoScreenScaling: function () {
        // For Screen Scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.minWidth = 480;
        this.scale.minHeight = 260;
        this.scale.maxWidth = 1024;
        this.scale.maxHeight = 768;
        this.scale.forceLandscape = true;
        this.scale.pageAlignHorizontally = true;
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

        //this.this.debug.geom(this.turnPoint, '#ffff00');

        game.debug.cameraInfo(game.camera, 32, 32);

        game.debug.spriteCoords(this.player, 32, 200);

    },

    /*checkKeys: function() {

        if (this.cursors.left.isDown && this.current !== Phaser.LEFT) {
            this.checkDirection(Phaser.LEFT);
        } else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT) {
            this.checkDirection(Phaser.RIGHT);
        } else if (this.cursors.up.isDown && this.current !== Phaser.UP) {
            this.checkDirection(Phaser.UP);
        } else if (this.cursors.down.isDown && this.current !== Phaser.DOWN) {
            this.checkDirection(Phaser.DOWN);
        } else {
            //  This forces them to hold the key down to turn the corner
            this.turning = Phaser.NONE;
        }
    },

    checkDirection: function(turnTo) {

        if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile) {
            //  Invalid direction if they're already set to turn that way
            //  Or there is no tile there, or the tile isn't index a floor tile
            return;
        }

        //  Check if they want to turn around and can
        if (this.current === this.opposites[turnTo]) {
            this.move(turnTo);
        } else {
            this.turning = turnTo;

            this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
            this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
        }

    },

    move: function(direction) {

        var speed = this.speed;

        if (direction === Phaser.LEFT || direction === Phaser.UP) {
            speed = -speed;
        }

        if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
            this.player.body.x = speed;
        } else {
            this.player.body.y = speed;
        }

        this.current = direction;

    }*/

};



function startGame2 () {
    // Change the state to the actual this.
    this.state.start('menu');
}

