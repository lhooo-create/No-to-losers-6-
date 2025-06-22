// Firebase Config (replace with your own if different)
const firebaseConfig={
 apiKey:"AIzaSyCDdpTizZEN6MUnsealEnWEstCu168OYw0",
 authDomain:"no-to-losers.firebaseapp.com",
 databaseURL:"https://no-to-losers-default-rtdb.firebaseio.com",
 projectId:"no-to-losers",
 storageBucket:"no-to-losers.firebasestorage.app",
 messagingSenderId:"614042942914",
 appId:"1:614042942914:web:362ea7549b3a2b2e8dea5b"};

firebase.initializeApp(firebaseConfig);
const db=firebase.database();

// room id from URL
const room=new URLSearchParams(location.search).get('room')||'default';

// unique player id and random skin index
const playerId=Math.random().toString(36).substr(2,9);
const skinIndex=(Math.floor(Math.random()*10)+1);

// images
const bg=new Image();
bg.src='https://static.vecteezy.com/system/resources/thumbnails/034/324/791/small_2x/dark-cave-game-background-tillable-horizontally-dark-terrible-empty-place-with-rock-lighting-walls-in-side-view-for-2d-games-location-illustration-vector.jpg';

const sprites={};
for(let i=1;i<=10;i++){sprites[i]=new Image();sprites[i].src=`player_${i}.png`;}

// canvas setup
const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth;canvas.height=innerHeight*0.8;groundY=canvas.height-60;}
window.addEventListener('resize',resize);let groundY;resize();

// physics
let x=Math.random()*200+50;
let y=groundY-40;
let vy=0;
const gravity=0.8;
let vx=0;

// send to db
function push(){db.ref(`rooms/${room}/players/${playerId}`).set({x,y,skinIndex});}
function move(dir){const speed=6;if(dir==='left')vx=-speed;if(dir==='right')vx=speed;if(dir==='jump'&&Math.abs(vy)<1){vy=-16;}}
window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')move('left');if(e.key==='ArrowRight')move('right');if(e.key==='ArrowUp')move('jump');});

// idle breathing
function idleOffset(){return Math.sin(Date.now()/400)*2;}

// game loop
let players={};
function loop(){
  // physics update for local player
  x+=vx;
  vy+=gravity;
  y+=vy;
  if(y>groundY-40){y=groundY-40;vy=0;}
  if(vx>0)vx*=0.9;if(vx<0)vx*=0.9;

  push();

  // draw
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // background
  if(bg.complete) ctx.drawImage(bg,0,0,canvas.width,canvas.height);

  // draw all players
  for(const id in players){
    const p=players[id];
    const img=sprites[p.skinIndex]||sprites[1];
    const drawY=p.y+(id===playerId?idleOffset():0);
    if(img.complete) ctx.drawImage(img,p.x,drawY,40,60);
  }
  requestAnimationFrame(loop);
}

// listen to db
db.ref(`rooms/${room}/players`).on('value',snap=>{players=snap.val()||{};});

loop();