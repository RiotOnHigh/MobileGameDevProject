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
        this.load.image('car', 'Assets/Images/car.png');
        this.load.spritesheet('character','Assets/Images/character.png',32,32);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.map = null;
        this.layer = null;
        this.car = null;

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

        this.autoScreenScaling();

        //this.add.button(this.world.centerX, this.world.centerY, 'button', startGame, this,2,1,0);
        //this.add.button(0, 0, 'button2', startGame2, this,2,1,0);

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
        this.player.body.collideWorldBounds = true;

        //  Adding player animations
        this.player.animations.add('down', [0, 1, 2, 1], 10, true);
        this.player.animations.add('left', [3, 4, 5, 4], 10, true);
        this.player.animations.add('right', [6, 7, 8, 7], 10, true);
        this.player.animations.add('up', [9, 10, 11, 10], 10, true);


        this.car = this.add.sprite(48, 272, 'car');
        this.car.anchor.set(0.5);

        this.physics.arcade.enable(this.car);

        this.move(Phaser.DOWN);
    },

    update: function() {
        //  Collide the this.player and the stars with the platforms
       // this.physics.arcade.collide(this.player, platforms);


        //  Reset the this.players velocity (movement)
        //this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.body.x -= this.player.speed; //this.player speed
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.body.x += this.player.speed;
            this.player.animations.play('right');
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.y += this.player.speed;
            this.player.animations.play('down');
        }
        else if (this.cursors.up.isDown)
        {
            this.player.body.y -= this.player.speed;
            this.player.animations.play('up');
        }
        else
        {
            //  Stand still
            this.player.body.velocity = 0;
            this.player.animations.stop();
            this.player.frame = 1;
        }


        this.physics.arcade.collide(this.car, this.layer);

        this.marker.x = this.math.snapToFloor(Math.floor(this.car.x), this.gridsize) / this.gridsize;
        this.marker.y = this.math.snapToFloor(Math.floor(this.car.y), this.gridsize) / this.gridsize;

        //  Update our grid sensors
        this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
        this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
        this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
        this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);

        this.checkKeys();

        if (this.turning !== Phaser.NONE) {
            this.turn();
        }

    },

    autoScreenScaling: function () {
        // For Screen Scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
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

    },

    checkKeys: function() {

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

    turn: function() {

        var cx = Math.floor(this.car.x);
        var cy = Math.floor(this.car.y);

        //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
        if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold)) {
            return false;
        }

        this.car.x = this.turnPoint.x;
        this.car.y = this.turnPoint.y;

        this.car.body.reset(this.turnPoint.x, this.turnPoint.y);

        this.move(this.turning);

        this.turning = Phaser.NONE;

        return true;

    },

    move: function(direction) {

        var speed = this.speed;

        if (direction === Phaser.LEFT || direction === Phaser.UP) {
            speed = -speed;
        }

        if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
            this.car.body.velocity.x = speed;
        } else {
            this.car.body.velocity.y = speed;
        }

        this.add.tween(this.car).to({
            angle: this.getAngle(direction)
        }, this.turnSpeed, "Linear", true);

        this.current = direction;

    },

    getAngle: function(to) {

        //  About-face?
        if (this.current === this.opposites[to]) {
            return "180";
        }

        if ((this.current === Phaser.UP && to === Phaser.LEFT) ||
            (this.current === Phaser.DOWN && to === Phaser.RIGHT) ||
            (this.current === Phaser.LEFT && to === Phaser.DOWN) ||
            (this.current === Phaser.RIGHT && to === Phaser.UP)) {
            return "-90";
        }

        return "90";

    }

};



function startGame2 () {
    // Change the state to the actual this.
    this.state.start('menu');
}

