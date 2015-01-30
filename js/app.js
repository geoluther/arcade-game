

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// Math.floor(Math.random() * (max - min)) + min;

var Gem = function() {

    this.rowOffset = 18;
    
    //init position
    this.reset();
    console.log("i made a gem!");
    console.log('row: ' + this.row + 'col: ' + this.col );
};

Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Gem.prototype.reset = function() {

    this.row = Math.floor(Math.random() * (4 - 1)) + 1;
    this.col = Math.floor(Math.random() * (5 - 0)) + 0;
    this.x = this.col * 101;
    this.y = this.row * 83 - this.rowOffset;
    
    var color = Math.floor(Math.random() * (3 - 0)) + 0;
    console.log('gem init color: ' + color);

    if ( color === 0 ) {
        this.sprite = 'images/Gem-Blue.png';
    } else if ( color === 1 ) {
        this.sprite = 'images/Gem-Green.png';
    } else {
        this.sprite = 'images/Gem-Orange.png';
    }

}

Gem.prototype.hide = function() {
    this.row = -1;
    this.col = -1;
    this.x = this.col * 101;
    this.y = this.row * 83 - this.rowOffset;
}


// Enemies our player must avoid

var Enemy = function(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // initial vars
    this.x ;
    this.speed;

    // initialize enemy postition to origin
    // assign enemy speed
    this.reset();

    // align image to middle of row
    this.rowOffset = 18;
    this.y = row * 83 - this.rowOffset;

    //set yOffset for top of bounding box
    this.yOffset = 72;
    this.xOffset = 0;

    // bounding box hight and width
    this.boxWidth = 100;
    this.boxHeight = 75;

};

Enemy.prototype.setSpeed = function() {
    this.speed = ( Math.random() * 3 + 1 ).toFixed(2);
}

Enemy.prototype.initX = function() {
    this.x = Math.floor(( Math.random() * 300 + 101 )) * -1;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // x = col * 101, y = row * 83
    
    // check if image hasn't wrapped off right side of screen
    if (this.x < 505 ) {
        this.x = this.x + (100 * dt) * this.speed;
    }
    // if offscreen, reset speed, starting point
    else {
        this.reset();
    }

    // update bounding box

    this.left = this.x + this.xOffset; // left edge of current column
    this.top = this.y + this.yOffset;  // top edge of current column.
    this.right = this.x + this.boxWidth;
    this.bottom = this.y + this.boxHeight + this.yOffset;

}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    // ctx.strokeStyle = "#FF0000";
    // ctx.strokeRect(this.left, this.top, this.boxWidth, this.boxHeight);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.reset = function() {
    // reset enemies back to left side of screen
    this.initX();
    this.setSpeed();
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.score = 0;
    this.lives = 3;
    // initial position
    this.col;
    this.row;

    // initialize player postition to origin
    this.reset();

    // nudge player graphic 
    // up to middle of the row
    this.rowOffset = 7;

    // offset for bounding box
    // move top and left side closer
    // since top of image is much higher
    // than the player character
    this.xOffset = 12;
    this.yOffset = 60;
    this.boxWidth = 88 - this.xOffset;;
    this.boxHeight = 80;

};

Player.prototype.update = function() {
    // change x, y to current col, row
    // x = col * 101, y = row * 83
    // image location update
    this.x = this.col * 101;
    this.y = this.row * 83 - this.rowOffset;

    // bounding box values
    // top: The y-value of the top of the rectangle
    // bottom: the y-value of the bottom of the rectangle
    // right: the x-value of the right side of the rectangle
    // left: the x-value of the left side of the rectangle

    this.left = this.x + this.xOffset;
    this.top = this.y + this.yOffset;
    this.right = this.x + this.boxWidth;
    this.bottom = this.y + this.boxHeight;
}

Player.prototype.render = function() {
    // ctx.strokeStyle = "#FF0000";
    // ctx.strokeRect(this.left, this.top, this.boxWidth, this.boxHeight);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


Player.prototype.reset = function() {
    this.col = 2;
    this.row = 5;
}

Player.prototype.updateColumn = function(x) {
    this.col = this.col + x;
}

Player.prototype.updateRow = function(x) {
    this.row = this.row + x;
}


Player.prototype.handleInput = function(keyCode) {
    // refactor to switch?
    console.log(keyCode);

    if ( keyCode === "left") {
        if ( this.col > 0 ) {
            this.updateColumn(-1);
        }

    } else if ( keyCode === "right") {
        if ( this.col < 4 ) {
            this.updateColumn(1);
        }

    } else if ( keyCode === "up") {
        if ( this.row > 0 ) {
            this.updateRow(-1);
        }

    } else if ( keyCode === "down") {
        if ( this.row < 5 ) { 
            this.updateRow(1);
        }

    } else {
        console.log('invalid move or key: ' + keyCode);
    }

    // getPosition();
}

function checkCollisions() {
        // console.log('in check collision');
        // loop through enemies, check pos with player
        // var result = false;
    var collision = false;

    allEnemies.forEach(function(enemy) {
        if ( intersectRect(enemy, player) ) {
         /// console.log("objects collide");
         collision = true;
        }
    });

    if (player.row === 0) {
        player.score += 1;
        collision = true;
        console.log("score: ", player.score);
    }


    for (var i = 0, len = allGems.length; i < len; i++) {
        if ( colIntersect(allGems[i], player) ){
            console.log("gem + player");
            player.score += 1;
            allGems[i].hide();
        }
    }
        // doesn't know where collision was
        return collision;
    }

// intersectRect returns a boolean indicating
// whether the two rectangles 'r1' and 'r2'
// intersect each other.

intersectRect = function(r1, r2) {
    // return a boolean value indicating whether 'r1' and 'r2'
    // intersect each other.
    // hack: clean up var names in objects
    // x = left, y = top

    return !(r2.left > r1.right ||
             r2.right < r1.left ||
             r2.top > r1.bottom ||
             r2.bottom < r1.top);
}

// takes player and gem
colIntersect = function(player, gem) {
    return ( player.row === gem.row &&
             player.col === gem.col);
}

// show position of player and gems
getPosition = function() {
    console.log("Player: " + player.row + ', ' + player.col);
    for (var i = allGems.length - 1; i >= 0; i--) {
        console.log("Gem: " + allGems[i].row + ', ' + allGems[i].col);
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemy1 = new Enemy(1);
var enemy2 = new Enemy(2);
var enemy3 = new Enemy(3);
var enemy4 = new Enemy(2);
var enemy5 = new Enemy(1);

var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
var player = new Player();

var gem = new Gem();
var gem2 = new Gem();
var allGems = [gem, gem2];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

