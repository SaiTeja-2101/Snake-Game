const board=document.querySelector(".gameboard");
const img=document.querySelector('.img');
const starttext=document.getElementById('starttext');
const highscoretext=document.querySelector('.highest-score');
const scoretext=document.querySelector('.score');

let highscore = localStorage.getItem('highscore') ? parseInt(localStorage.getItem('highscore')) : 0;
highscoretext.textContent = highscore.toString().padStart(3, '0');
highscoretext.style.display = 'block';

let gamespeeddelay=200;let gameinterval;
let gamestarted =false;
let snake=[{x:10,y:10}];
function  draw(){
    board.innerHTML='';
    drawsnake();
    drawfood();
    updatescore();
}
let direction='right';
const gridsize=20;
let food=generateFood();

function drawsnake(){
   snake.forEach((segment)=>{
    const snakelement=createGameElement('div','snake');
    setposition(snakelement,segment);
    board.appendChild(snakelement);
});
}
function createGameElement(ele,classname){
    if(gamestarted){
    let element=document.createElement(ele);
    element.classList.add(classname);//same as element.classname=classname
    return element;
    }
}
function setposition(element,position){
  element.style.gridColumn=position.x;
  element.style.gridRow=position.y;
}
function drawfood(){
    if(gamestarted){
    const foodele=createGameElement('div','food');
    setposition(foodele,food);
    board.appendChild(foodele);
    }
}
function generateFood(){
  let x=Math.floor(Math.random()*gridsize)+1;
  let y=Math.floor(Math.random()*gridsize)+1;
  return {x,y};
}
function move(){
    let head={...snake[0]};
    switch(direction){
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;      
    }
    snake.unshift(head);
    if(head.x==food.x && head.y==food.y){
        clearInterval(gameinterval)
        food=generateFood();
        increasespeed();
        gameinterval= setInterval(()=>{
           move();
           checkCollision();
           draw();
        },gamespeeddelay);
    }
    else{
        snake.pop();
    }
}
function start(){
    gamestarted=true;
    img.style.display="none";
    starttext.style.display="none";
    gameinterval=setInterval(()=>{
        move();
        checkCollision();
        draw();
    },gamespeeddelay);
}

document.addEventListener('keydown',e=>{
    if((!gamestarted && e.code==='Space')||(!gamestarted && e.key==='c'))
        start();
    else{
        switch(e.key){
             case 'ArrowUp':
                direction='up';
                break;
              case 'ArrowDown':
                direction='down';
                break;
              case 'ArrowLeft':
                direction='left';
                break;
              case 'ArrowRight':
                direction='right';
                break;    
        }
    }
});
function increasespeed(){
    if(gamespeeddelay>150)
        gamespeeddelay-=5;
    else if(gamespeeddelay>100)
        gamespeeddelay-=3;
    else if(gamespeeddelay>50)
        gamespeeddelay-=2;
    else 
        gamespeeddelay-=1;
}
function checkCollision(){
    const head=snake[0];
    if(head.x> gridsize||head.x<1 || head.y<1 ||head.y >gridsize)
       resetgame();
    for(let i=1;i<snake.length;i++){
        if(head.x==snake[i].x && head.y==snake[i].y)
             resetgame();
    } 
}
function updatescore(){
    const prescore=snake.length-1;
    scoretext.textContent=prescore.toString().padStart(3,'0');
}
function updatehighscore(){
   const prescore=snake.length-1;
   if(highscore<prescore) 
    {
        highscore=prescore;
        highscoretext.textContent=highscore.toString().padStart(3,'0');
        localStorage.setItem('highscore', highscore); 
    }
    highscoretext.style.display='block';
}
function stopgame(){
    clearInterval(gameinterval);
    gamestarted=false;
    img.style.display="block";
    starttext.style.display="block";
}
function display(){
    document.body.classList.add("gameover");
    var aud=new Audio("Audio/wrong.mp3");
    aud.play();
    setTimeout(()=>{
       document.body.classList.remove("gameover");
    },1500);

}
function resetgame(){
    updatehighscore();
     stopgame();
     display();
    food=generateFood();
    gamespeeddelay=200;
    snake=[{x:10,y:10}];
    direction='right';
    updatescore();
}