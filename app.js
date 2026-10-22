const M=[
  {n:"Vanessa Vane",c:50,tag:"LATINA",v:"1.4k",s:4.9,img:"models/vanessa.jpg",alt:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",msg:"¡Hola amor! Qué lindo verte 💕",d:"Streamer latina y música en vivo."},
  {n:"Camila Sweet",c:50,tag:"BLONDE",v:"980",s:4.8,img:"models/camila.jpg",alt:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",msg:"¡Hola cielo! Te esperaba 🥰",d:"Dulzura y charlas íntimas."},
  {n:"Nicole Ross",c:75,tag:"TOP VIP",v:"2.1k",s:5.0,img:"models/nicole.jpg",alt:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",msg:"Buenas noches querido 🍸",d:"Elegancia y shows exclusivos."},
  {n:"Scarlet VIP",c:100,tag:"👑 MASTER",v:"3.4k",s:5.0,img:"models/scarlet.jpg",alt:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",msg:"Bienvenido a mi sala VIP 🔥",d:"La reina del salón privado."}
];

function renderModelos(){
  const g=document.getElementById("grid-modelos");if(!g)return;
  g.innerHTML=M.map((m,i)=>'<div class="mcard"><div class="relative aspect-[3/4] bg-zinc-950"><img src="'+m.img+'" onerror="this.onerror=null;this.src=\''+m.alt+'\'" class="w-full h-full object-cover"><div class="absolute inset-0 bg-gradient-to-t from-[#111320] via-transparent to-black/30"></div><div class="absolute top-2 left-2 flex items-center gap-1"><span class="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-white ldot"></span> EN VIVO</span><span class="bg-black/60 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded-full">👁️ '+m.v+'</span></div><div class="absolute top-2 right-2 bg-zinc-900/90 border border-amber-500/50 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">🪙 '+m.c+'/m</div><div class="absolute bottom-2 left-2"><span class="bg-pink-950 text-pink-300 border border-pink-500/40 text-[8px] font-bold px-1.5 py-0.5 rounded">'+m.tag+'</span></div></div><div class="p-2 space-y-1.5 flex-1 flex flex-col justify-between"><div><div class="flex justify-between items-center"><h3 class="font-bold text-xs text-white">'+m.n+'</h3><span class="text-[10px] text-amber-400 font-bold">⭐ '+m.s+'</span></div><p class="text-[9px] text-zinc-400 line-clamp-1">'+m.d+'</p></div><button onclick="abrirShow('+i+')" class="w-full btn-p py-1.5 text-xs shadow"><i class="fa-solid fa-play text-[8px]"></i> ENTRAR</button></div></div>').join("");
}

const fConfig={apiKey:"AIzaSyDLVDVzc6w9S68BvL7H_b_95vF9yvIsGgo",authDomain:"camchat-900d6.firebaseapp.com",projectId:"camchat-900d6"};
let auth,db,user=null,curShow=null;
try{if(!firebase.apps.length)firebase.initializeApp(fConfig);auth=firebase.auth();db=firebase.firestore();}catch(e){}
const ADMIN="kervinjose022@gmail.com";
const isAdmin=(em,rol)=>em&&(em.toLowerCase()===ADMIN.toLowerCase()||(rol&&rol.toLowerCase().includes("admin")));

function updateUI(u){
  user=u;
  document.getElementById("active-user-name").textContent=u?(u.nombre||u.email.split("@")[0]):"Invitado";
  document.getElementById("auth-buttons").classList.toggle("hidden",!!u);
  document.getElementById("btn-logout").classList.toggle("hidden",!u);
  const pill=document.getElementById("user-token-pill");
  pill.classList.toggle("hidden",!u);
  if(u){
    pill.classList.add("flex");
    document.getElementById("header-tokens-val").textContent=u.tokens_balance||0;
    const isAdm=isAdmin(u.email,u.rol);
    const badge=document.getElementById("active-user-badge");
    badge.classList.remove("hidden");
    badge.textContent=isAdm?"👑 MASTER":(u.rol||"USUARIO");
    badge.className=isAdm?"px-1 py-0.2 rounded text-[8px] font-black bg-amber-500 text-zinc-950":"px-1 py-0.2 rounded text-[8px] font-bold bg-pink-900/60 text-pink-300";
    document.getElementById("admin-top-banner").classList.toggle("hidden",!isAdm);
    if(isAdm){document.getElementById("admin-badge-email").textContent=u.email;iniciarEscuchaUsuariosAdmin();}
  }else{
    document.getElementById("admin-top-banner").classList.add("hidden");cambiarVista("modelos");
  }
}
function cerrarSesion(){if(auth)auth.signOut().catch(()=>{});localStorage.removeItem("cam_u");updateUI(null);alertar("Sesión cerrada.");}
function cambiarVista(v){
  document.getElementById("vista-modelos").classList.toggle("hidden",v==="admin");
  document.getElementById("vista-admin").classList.toggle("hidden",v!=="admin");
}
function mostrarModalAuth(tab){
  document.getElementById("auth-err").classList.add("hidden");
  document.getElementById("modal-auth").classList.remove("hidden");
  document.getElementById("modal-auth").classList.add("flex");
  tabAuth(tab);
}
function tabAuth(t){
  document.getElementById("auth-err").classList.add("hidden");
  const isL=(t==="login");
  document.getElementById("tab-login").className=isL?"flex-1 pb-1.5 text-xs font-bold text-pink-400 border-b-2 border-pink-500":"flex-1 pb-1.5 text-xs font-bold text-zinc-400";
  document.getElementById("tab-registro").className=!isL?"flex-1 pb-1.5 text-xs font-bold text-pink-400 border-b-2 border-pink-500":"flex-1 pb-1.5 text-xs font-bold text-zinc-400";
  document.getElementById("f-login").classList.toggle("hidden",!isL);
  document.getElementById("f-reg").classList.toggle("hidden",isL);
}
function loginRapido(){
  const em=(document.getElementById("login-email").value||"").trim().toLowerCase();
  if(!em){document.getElementById("auth-err").textContent="Escribe tu correo arriba.";document.getElementById("auth-err").classList.remove("hidden");return;}
  ejecutarLogin(em);
}
function procesarLogin(e){e.preventDefault();ejecutarLogin((document.getElementById("login-email").value||"").trim().toLowerCase(),document.getElementById("login-pass").value);}

async function ejecutarLogin(em,pw){
  const err=document.getElementById("auth-err");err.classList.add("hidden");
  if(auth&&pw&&pw.length>=6){try{await auth.signInWithEmailAndPassword(em,pw);}catch(e){}}
  const docId=em.replace(/[^a-zA-Z0-9]/g,"_");
  let uData=null;
  if(db){
    try{
      const d=await db.collection("Usuarios").doc(docId).get();
      if(d.exists)uData=d.data();
      if(!uData){const q=await db.collection("Usuarios").where("correo","==",em).limit(1).get();if(!q.empty)uData=q.docs[0].data();}
      if(!uData){const d2=await db.collection("users").doc(docId).get();if(d2.exists)uData=d2.data();}
    }catch(e){}
  }
  const isAdm=(em===ADMIN.toLowerCase());
  if(isAdm||uData){
    const s={uid:docId,email:em,nombre:(uData&&(uData.nombre||uData.name))||(isAdm?"Kervin Admin":em.split("@")[0]),rol:isAdm?"Administrador":((uData&&uData.rol)||"Usuario"),tokens_balance:isAdm?99999:((uData&&(uData.tokens_balance??50))??50)};
    if(isAdm&&db)db.collection("Usuarios").doc(docId).set({nombre:s.nombre,correo:em,rol:"Administrador",tokens_balance:99999},{merge:true}).catch(()=>{});
    localStorage.setItem("cam_u",JSON.stringify(s));updateUI(s);document.getElementById("modal-auth").classList.add("hidden");alertar("¡Bienvenido "+s.nombre+"!");
  }else{
    err.textContent="No existe cuenta con este correo. Pulsa Crear Cuenta.";err.classList.remove("hidden");
  }
}

async function procesarReg(e){
  e.preventDefault();
  const nom=document.getElementById("reg-nom").value.trim(),em=document.getElementById("reg-mail").value.trim().toLowerCase(),pw=document.getElementById("reg-pw").value;
  const isAdm=(em===ADMIN.toLowerCase());const docId=em.replace(/[^a-zA-Z0-9]/g,"_");
  if(auth&&pw&&pw.length>=6){try{await auth.createUserWithEmailAndPassword(em,pw);}catch(e){}}
  const doc={nombre:nom,correo:em,rol:isAdm?"Administrador":"Usuario",tokens_balance:isAdm?99999:100,creado_en:new Date().toISOString()};
  if(db)db.collection("Usuarios").doc(docId).set(doc,{merge:true}).catch(()=>{});
  const s={uid:docId,email:em,nombre:nom,rol:doc.rol,tokens_balance:doc.tokens_balance};
  localStorage.setItem("cam_u",JSON.stringify(s));updateUI(s);document.getElementById("modal-auth").classList.add("hidden");alertar("¡Cuenta creada!");
}

function abrirShow(i){
  const m=M[i];if(!user){mostrarModalAuth("login");return;}
  const isAdm=isAdmin(user.email,user.rol);
  if(!isAdm&&(user.tokens_balance||0)<m.c){alertar("Tokens insuficientes. Pulsa + Recargar.");return;}
  if(!isAdm&&db){user.tokens_balance-=m.c;updateUI(user);db.collection("Usuarios").doc(user.uid).update({tokens_balance:user.tokens_balance}).catch(()=>{});}
  curShow=m;
  const simg=document.getElementById("stream-img");simg.onerror=()=>{simg.src=m.alt;};simg.src=m.img;
  document.getElementById("stream-model-name").textContent=m.n;
  document.getElementById("stream-chat-messages").innerHTML='<div class="bg-pink-950/70 border border-pink-500/40 p-2 rounded-xl text-pink-100"><div class="font-bold text-pink-400 text-[10px]">💖 '+m.n+'</div><div>'+m.msg+'</div></div>';
  document.getElementById("modal-showroom").classList.remove("hidden");document.getElementById("modal-showroom").classList.add("flex");
}

function enviarMensajeChat(e){
  e.preventDefault();const inp=document.getElementById("stream-chat-input");const txt=inp.value.trim();if(!txt)return;
  const chat=document.getElementById("stream-chat-messages");
  chat.innerHTML+='<div class="bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-zinc-200"><div class="font-bold text-zinc-400 text-[10px]">'+(user.nombre||"Tú")+'</div><div>'+txt+'</div></div>';
  inp.value="";chat.scrollTop=chat.scrollHeight;
  setTimeout(()=>{
    const rep=["¡Qué lindo mensaje! Me encanta tenerte aquí ❤️","¡Disfrutemos este show privado juntos! ✨","¡Gracias mi amor! ¿Quieres una sorpresa? 💋"];
    chat.innerHTML+='<div class="bg-pink-950/70 border border-pink-500/40 p-2 rounded-xl text-pink-100"><div class="font-bold text-pink-400 text-[10px]">💖 '+curShow.n+'</div><div>'+rep[Math.floor(Math.random()*rep.length)]+'</div></div>';
    chat.scrollTop=chat.scrollHeight;
  },1000);
}

function enviarPropina(cant,desc){
  if(!user)return;
  const isAdm=isAdmin(user.email,user.rol);
  if(!isAdm&&(user.tokens_balance||0)<cant){alertar("Tokens insuficientes.");return;}
  if(!isAdm&&db){user.tokens_balance-=cant;updateUI(user);db.collection("Usuarios").doc(user.uid).update({tokens_balance:user.tokens_balance}).catch(()=>{});}
  const l=document.getElementById("floating-layer");
  const f=document.createElement("div");f.className="fheart absolute text-xl font-bold text-pink-400 drop-shadow";f.style.left=(35+Math.random()*30)+"%";f.style.bottom="20%";f.textContent=desc;l.appendChild(f);setTimeout(()=>f.remove(),1200);
  const chat=document.getElementById("stream-chat-messages");
  chat.innerHTML+='<div class="bg-amber-950/70 border border-amber-500/40 p-2 rounded-xl text-amber-200 text-[11px]"><div class="font-bold text-amber-400 text-[10px]">🪙 Propina</div>'+cant+' Tokens • '+desc+'</div>';
  chat.scrollTop=chat.scrollHeight;
}

function recargarBonoGratis(){
  if(!user){mostrarModalAuth("login");return;}
  user.tokens_balance=(user.tokens_balance||0)+50;updateUI(user);
  if(db)db.collection("Usuarios").doc(user.uid).update({tokens_balance:user.tokens_balance}).catch(()=>{});
  alertar("+50 Tokens Bono sumados a tu cuenta.");
}

function iniciarEscuchaUsuariosAdmin(){
  if(!db)return;
  db.collection("Usuarios").onSnapshot(snap=>{
    let docs=[];snap.forEach(d=>docs.push({id:d.id,...d.data()}));
    let tok=0,uC=0,mC=0;
    docs.forEach(u=>{tok+=parseInt(u.tokens_balance||0,10);if((u.rol||"").toLowerCase().includes("modelo"))mC++;else uC++;});
    document.getElementById("stat-total-usuarios").textContent=docs.length;
    document.getElementById("stat-usuarios-reg").textContent=uC;
    document.getElementById("stat-modelos-reg").textContent=mC;
    document.getElementById("stat-total-tokens").textContent=tok.toLocaleString();
    const tbody=document.getElementById("admin-usuarios-tbody");
    tbody.innerHTML=docs.map(u=>{
      const isK=(u.correo||"").toLowerCase()===ADMIN.toLowerCase();
      return '<tr class="hover:bg-zinc-800/40"><td class="py-2 px-2.5 font-bold text-white">'+(u.nombre||u.correo||"Anon")+'</td><td class="py-2 px-2 text-[10px] text-zinc-400 font-mono">'+(u.correo||"-")+'</td><td class="py-2 px-2 text-[10px] font-bold '+(isK?"text-amber-400":"text-zinc-300")+'">'+(isK?"👑 Admin":(u.rol||"Usuario"))+'</td><td class="py-2 px-2 text-amber-400 font-mono font-bold text-xs">🪙 '+(u.tokens_balance||0)+'</td><td class="py-2 px-2"><button onclick="sumarTokensUsuario(\''+u.id+'\',50)" class="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded text-[10px] font-bold">+50</button></td></tr>';
    }).join("");
  },()=>{});
}

async function sumarTokensUsuario(uid,c){
  if(!db)return;
  try{
    const r=db.collection("Usuarios").doc(uid);const s=await r.get();
    const cur=(s.exists&&s.data().tokens_balance)||0;
    await r.update({tokens_balance:cur+c});alertar("+"+c+" tokens asignados.");
  }catch(e){}
}

function alertar(m){
  const al=document.getElementById("global-alert");
  document.getElementById("global-alert-text").textContent=m;
  al.className="mb-3 p-2 rounded-xl border bg-pink-950 border-pink-500/60 text-pink-200 text-xs flex justify-between";
  al.classList.remove("hidden");setTimeout(()=>al.classList.add("hidden"),3500);
}

window.addEventListener("DOMContentLoaded",()=>{
  renderModelos();
  const s=localStorage.getItem("cam_u");
  if(s){try{const p=JSON.parse(s);if(p&&p.email)updateUI(p);}catch(e){}}
});
