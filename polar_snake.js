let snake;
let food;
let width = 700;
let height = 700;
let size = 40;
let score = 0;
let left_buffered = false;
let right_buffered = false;
let turn_rad = 2;

function mod(n, m) {
    return ((n % m) + m) % m;
}

function setup() {
    createCanvas(width, height)
    background(0)
    noStroke();
    snake = new Snake();
    food = new Food();
}

function Food() {
    this.x = random(width);
    this.y = random(height);

    this.isEaten = function() {
        this.x = random(width);
        this.y = random(height);
    }

    this.show = function() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, size, size);
    }
}

function Snake() {
    this.head = new BodyPart(width / 2, height / 2);
    this.tail = this.head;
    this.nodes = [this.head];
    this.theta_movement = 0;
    this.delta = 2 * Math.PI / 24;
    this.speed = size;
    this.dead = false;

    this.check_hit_self = function() {
        let tolerance = size - 2;
        this.nodes.forEach((node) => {
            if (node.x == this.head.x && node.y == this.head.y) {
                return
            }
            let d = dist(this.head.x, this.head.y, node.x, node.y);
            let overlapping = d < tolerance;
            if (overlapping) {
                snake.dead = true;
            }
        });
    }

    this.try_eat = function() {
        let tolerance = size * 2 - 2;
        let overlapping = dist(this.head.x, this.head.y, food.x, food.y) < tolerance;
        if (overlapping) {
            this.grow(size);
            food.isEaten();
            score += 10;
        }
    }

    this.move = function() {
        if (left_buffered) {
            this.turnLeft(1);
        } else if (right_buffered) {
            this.turnRight(1);
        }
        this.try_eat();
        this.check_hit_self();
        this.grow(this.speed);
        this.tail = this.tail.link;
        this.nodes.shift();
    }

    this.grow = function() {
        let [new_x, new_y] = this.get_next_xy();
        let new_head = new BodyPart(new_x, new_y, null);
        this.head.link = new_head;
        this.head = this.head.link;
        this.nodes.push(this.head);
    }

    this.get_next_xy = function() {
        let new_x = this.head.x + size*cos(this.theta_movement);
        let new_y = this.head.y + size*sin(this.theta_movement);
        return [mod(new_x, width), mod(new_y, height)];
    }

    this.show = function() {
        fill(255);
        this.nodes.forEach((node) => {
            ellipse(node.x, node.y, size, size);
        })
    }

    this.turnRight = function() {
        this.theta_movement += this.delta * turn_rad;
    }

    this.turnLeft = function() {
        this.theta_movement -= this.delta * turn_rad;
    }
}

function BodyPart(x, y, link) {
    this.x = x;
    this.y = y;
    this.link = link;
}

function keyReleased() {
    if (keyCode == LEFT_ARROW) {
        left_buffered = false;
    } else if (keyCode == RIGHT_ARROW) {
        right_buffered = false;
    }
}

function keyPressed() {
    if (key == 1 || key == 2 || key == 3) {
        turn_rad = key;
    }
    if (keyCode == LEFT_ARROW) {
        left_buffered = true;
        right_buffered = false;
    } else if (keyCode == RIGHT_ARROW) {
        right_buffered = true;
        left_buffered = false;
    }
}

function draw() {
    if (frameCount % 10 != 0) {
        return
    }
    background(0);
    if (snake.dead) {
        text("dead", width / 2, height / 2);
        noLoop();
        return;
    }
    fill(255);
    text(score, 10, 15);
    snake.show();
    food.show();
    snake.move();
}
