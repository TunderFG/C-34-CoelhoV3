const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var ground, rope,rope2,rope3;
var bgImg, fruitImg, bunnyImg;
var bunny,button;
var blink,eat,sad;
var bgsound,eatsound,sadsound,ballonsound,cutsound;
var button2,button3,mute;
var onestar,emptystar,twostars,star;
var estrela,estrela2,balloon;
var stardisplay;

function preload(){
  bgImg = loadImage("assets/background.png");
  fruitImg = loadImage("assets/melon.png");
  bunnyImg = loadImage("assets/Rabbit-01.png");
  blink = loadAnimation("assets/blink_1.png","assets/blink_2.png","assets/blink_3.png");
  eat = loadAnimation("assets/eat_0.png","assets/eat_1.png","assets/eat_2.png","assets/eat_3.png","assets/eat_4.png");
  sad = loadAnimation("assets/sad_1.png","assets/sad_2.png","assets/sad_3.png");
  bgsound = loadSound("assets/sound1.mp3");
  eatsound = loadSound("assets/eating_sound.mp3");
  sadsound = loadSound("assets/sad.wav");
  ballonsound = loadSound("assets/air.wav");
  cutsound = loadSound("assets/rope_cut.mp3");
  onestar = loadImage("assets/one_star.png");
  emptystar = loadImage("assets/empty.png");
  twostars = loadImage("assets/stars.png");
  star = loadImage("assets/star.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
}


function setup() 
{
  createCanvas(600,700);
  engine = Engine.create();
  world = engine.world;

  bgsound.play();
  bgsound.setVolume(0.2);

  //Botão

  button = createImg("assets/cut_btn.png");
  button.position(180,90);
  button.size(50,50)
  button.mouseClicked(drop);

  button2 = createImg("assets/cut_btn.png");
  button2.position(390,90);
  button2.size(50,50)
  button2.mouseClicked(drop2);


  mute = createImg("assets/mute.png");
  mute.position(width-50,30);
  mute.size(50,50);
  mute.mouseClicked(mutebg);

  //Comandos referentes ao coelho

  blink.frameDelay = 7;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(200,height-80,100,100);
  bunny.scale = 0.21;

  bunny.addAnimation("piscando",blink);
  bunny.addAnimation("comendo",eat);
  bunny.addAnimation("triste",sad);
  bunny.changeAnimation("piscando");

  ground = new Ground(300,height,width,20);
  rope = new Rope(7,{
    x: 200,
    y: 90
  })

  rope2 = new Rope(7,{
    x: 400,
    y: 90
  })


  var fruit_options = {
    density: 0.001
  }

  fruit = Bodies.circle(300,300,20,fruit_options);
  Matter.Composite.add(rope.body,fruit);

  fruitlink = new Link(rope,fruit);
  fruitlink2 = new Link(rope2,fruit);

  //Estrelas

  estrela = createSprite(320,50,20,20);
  estrela.scale = 0.02;
  estrela.addImage(star);

  estrela2 = createSprite(50,370,20,20);
  estrela2.scale = 0.02;
  estrela2.addImage(star);

  stardisplay = createSprite(50,20,30,30);
  stardisplay.scale = 0.2;
  stardisplay.addImage("vazio",emptystar);
  stardisplay.addImage("one",onestar);
  stardisplay.addImage("full",twostars);
  stardisplay.changeImage("vazio");

  //baloon

  balloon = createImg("assets/baloon2.png");
  balloon.position(260,370);
  balloon.size(120,120);
  balloon.mouseClicked(airbaloon);
  

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
  imageMode(CENTER);
}
 
function draw() 
{
  background(51);
  image(bgImg,width/2,height/2,width,height);
  Engine.update(engine);
  ground.show();
  rope.show();
  rope2.show();
 

  if (fruit !== null){
    image(fruitImg,fruit.position.x,fruit.position.y,70,70);
  }

  if(collide(fruit,bunny,80) === true){
    World.remove(world,fruit);
    fruit = null;
    bunny.changeAnimation("comendo");
    eatsound.play();
    bgsound.stop()
  }
  if(fruit !== null && fruit.position.y >= 550){
    bunny.changeAnimation("triste");
    //sadsound.play();
    bgsound.stop()
  }

  if(collide(fruit,estrela,20) === true){
    estrela.visible = false;
    stardisplay.changeImage("one")
  }

  if(collide(fruit,estrela2,20) === true){
    estrela2.visible = false;
    stardisplay.changeImage("full")
  }

  drawSprites();
   
}

function drop(){
  rope.break();
  fruitlink.separar();
  fruitlink = null;
  cutsound.play();
}

function drop2(){
  rope2.break();
  fruitlink2.separar();
  fruitlink2 = null;
  cutsound.play();
}


function collide(body1,body2,x){
  if(body1 !== null){
    var d = dist(body1.position.x,body1.position.y,body2.position.x,body2.position.y);
    if(d <= x){
      return true;
    }
    else{
      return false;
    } 
  }
}

function airbaloon(){
  Matter.Body.applyForce(fruit,{
    x: 0,
    y: 0
  },{
    x: 0,
    y: -0.03
  });
  ballonsound.play()
}

function mutebg(){
  if(bgsound.isPlaying()){
    bgsound.stop();
  }
else{
  bgsound.play();
} 
}



