// تحميل مكتبات Firebase (تم بالفعل في index.html)

const firebaseConfig = {
  apiKey: "AIzaSyCDdpTizZEN6MUnsealEnWEstCu168OYw0",
  authDomain: "no-to-losers.firebaseapp.com",
  databaseURL: "https://no-to-losers-default-rtdb.firebaseio.com",
  projectId: "no-to-losers",
  storageBucket: "no-to-losers.firebasestorage.app",
  messagingSenderId: "614042942914",
  appId: "1:614042942914:web:362ea7549b3a2b2e8dea5b",
  measurementId: "G-XX6N16BQLD"
};

// تهيئة الاتصال بـ Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// تحديد اسم الغرفة من رابط اللعبة
const room = new URLSearchParams(window.location.search).get('room') || "default";

// تعريف معلومات اللاعب
const playerId = Math.random().toString(36).substr(2, 9);
const color = "#" + Math.floor(Math.random()*16777215).toString(16);
let x = Math.random() * 300;
let y = 200;

// الإعدادات للرسم
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.8;

// رفع موقع اللاعب
function updatePosition() {
  db.ref(`rooms/${room}/players/${playerId}`).set({ x, y, color });
}

// التحكم بالحركة
function move(dir) {
  if (dir === "left") x -= 10;
  if (dir === "right") x += 10;
  if (dir === "up") y -= 10;
  updatePosition();
}

// رسم اللاعبين على الشاشة
function draw(players) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let id in players) {
    const p = players[id];
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 30, 30);
  }
}

// التحديث عند تغيير بيانات اللاعبين
db.ref(`rooms/${room}/players`).on("value", (snapshot) => {
  const players = snapshot.val() || {};
  draw(players);
});

// إرسال أول موقع عند دخول اللاعب
updatePosition();
