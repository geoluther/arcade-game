
// to add:
// entity class with render function

// Enemies our player must avoid

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// Math.floor(Math.random() * (max - min)) + min;

var Gem = function() {

	// var color = Math.floor(Math.random() * (3 - 0)) + 0;

	// switch (color) {
 //    	case "0":
    this.sprite = 'images/Gem-Blue.png';
        	//break;
        // case "1":
        // 	this.sprite = 'images/Gem-Green.png';
        // 	break;
        // default:
        // 	this.sprite = 'images/Gem-Orange.png';
        // }

	this.row = Math.floor(Math.random() * (4 - 1)) + 1;
	this.column = Math.floor(Math.random() * (5 - 0)) + 0;
	// this.row = 2;
	// this.column = 3;

	this.rowOffset = 18;
	this.x = this.column * 101;
    this.y = this.row * 83 - this.rowOffset;
    console.log("i made a gem!");
    console.log('row: ' + this.row + 'col: ' + this.column );

};

Gem.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

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
    // ctx.fillText(this.score);
    //ctx.font = "bold 40px sans-serif";
    //ctx.font = "35px 'Press Play 2P'";
    // ctx.fillText("Hello World", 20, 40);
    //ctx.fillText("Score: " + this.score, 20, 50);
}


// just a test function
Player.prototype.getPosition = function() {
    console.log('Player Position: (col:' + this.col + ',row:' 
        + this.row + ')');
    console.log('left, top: ' + this.x + ',' + this.y );
    console.log('right, bottom: ' + this.right + ',' + this.bottom );
}

Player.prototype.reset = function() {
    this.col = 2;
    this.row = 5;
};

Player.prototype.updateColumn = function(x) {
    this.col = this.col + x;
};

Player.prototype.updateRow = function(x) {
    this.row = this.row + x;
};


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

    // buggy, shows previous, not current location
    // since update isn't called yet.
    // this.getPosition();
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
        // bug: only tells you if there was a collision
        // doesn't break at collison
        // doesn't report where collision was
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

