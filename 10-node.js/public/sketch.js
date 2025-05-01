let socket;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  socket = io();

  socket.on('mouse', (data) => {
    fill(255, 0, 100);
    noStroke();
    ellipse(data.x, data.y, 20, 20);
  });
}

function mouseDragged() {
  fill(255);
  noStroke();
  ellipse(mouseX, mouseY, 20, 20);

  const data = {
    x: mouseX,
    y: mouseY
  };

  socket.emit('mouse', data);
}
