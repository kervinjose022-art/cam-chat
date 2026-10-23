const M=[
  {n:"Vanessa Vane",c:50,tag:"RED LACE 💋",v:"2.4k",s:4.9,img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",alt:"models/vanessa.jpg",msg:"¡Hola mi amor! Puse música suave para los dos... ¿bailamos juntos? 💕",d:"Latina sensual en baby doll y lencería roja pasión."},
  {n:"Camila Sweet",c:50,tag:"PINK SILK 🌸",v:"1.9k",s:4.8,img:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",alt:"models/camila.jpg",msg:"¡Hola cielo! Me estaba perfumando... qué rico que viniste a verme 🥰",d:"Dulzura en pijama de seda rosada y charlas íntimas."},
  {n:"Nicole Ross",c:75,tag:"BLACK CORSET 🔥",v:"3.2k",s:5.0,img:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",alt:"models/nicole.jpg",msg:"Buenas noches querido. La noche recién empieza en mi suite VIP 🍸",d:"Elegancia pura en corset de encaje negro y miradas seductoras."},
  {n:"Scarlet Diamond",c:100,tag:"GOLD SATIN 👑",v:"4.5k",s:5.0,img:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",alt:"models/scarlet.jpg",msg:"Bienvenido a mi sala privada. Esta noche las reglas las pones tú 🔥",d:"Bata de satén dorado, curvas y exclusividad total."}
];

const $=(id)=>document.getElementById(id);
const fConfig={apiKey:"AIzaSyDLVDVzc6w9S68BvL7H_b_95vF9yvIsGgo",authDomain:"camchat-900d6.firebaseapp.com",projectId:"camchat-900d6"};
let auth,db,user=null,curShow=null,mediaStream=null,studioInterval=null,liveRealModels=[];
try{if(!firebase.apps.length)firebase.initializeApp(fConfig);auth=firebase.auth();db=firebase.firestore();}catch(e){}

const ADMIN="kervinjose022@gmail.com";
const isAdmin=(em,rol)=>em&&(em.toLowerCase()===ADMIN.toLowerCase()||(rol&&rol.toLowerCase().includes("admin")));
const isModel=(rol)=>rol&&(rol.toLowerCase().includes("modelo")||rol.toLowerCase().includes("streamer"));

function renderModelos(){
  const g=$("grid-modelos");if(!g)return;
  let html="";
  if(liveRealModels.length>0){
    html+=liveRealModels.map(m=>'<div class="mcard border-pink-500 shadow-lg shadow-pink-900/30"><div class="relative aspect-[3/4] bg-zinc-950 flex items-center justify-center overflow-hidden"><img src="'+(m.foto||'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85')+'" class="w-full h-full object-cover live-motion"><div class="absolute inset-0 bg-gradient-to-t from-[#111320] via-transparent to-black/30"></div><div class="absolute top-2 left-2 flex items-center gap-1"><span class="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-white ldot"></span> STREAM REAL</span></div><div class="absolute top-2 right-2 bg-zinc-900/90 border border-amber-500/50 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">🪙 '+(m.costo||60)+'/m</div><div class="absolute bottom-2 left-2"><span class="bg-gradient-to-r from-red-600 to-pink-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow">🔴 EN VIVO AHORA</span></div></div><div class="p-2 space-y-1.5 flex-1 flex flex-col justify-between"><div><div class="flex justify-between items-center"><h3 class="font-bold text-xs text-white">'+(m.nombre||'Modelo Real')+'</h3><span class="text-[10px] text-amber-400 font-bold">⭐ 5.0</span></div><p class="text-[9px] text-pink-300 line-clamp-1 font-semibold">Transmisión en directo real</p></div><button onclick="entrarShowReal(\''+m.id+'\',\''+(m.nombre||'Modelo')+'\','+(m.costo||60)+')" class="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black py-1.5 text-xs shadow rounded-xl"><i class="fa-solid fa-play text-[8px]"></i> ENTRAR EN VIVO</button></div></div>').join("");
  }
  html+=M.map((m,i)=>'<div class="mcard"><div class="relative aspect-[3/4] bg-zinc-950 overflow-hidden"><img src="'+m.img+'" onerror="this.onerror=null;this.src=\''+m.alt+'\'" class="w-full h-full object-cover live-motion"><div class="absolute inset-0 bg-gradient-to-t from-[#111320] via-transparent to-black/30"></div><div class="absolute top-2 left-2 flex items-center gap-1"><span class="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-white ldot"></span> EN VIVO</span><span class="bg-black/60 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded-full">👁️ '+m.v+'</span></div><div class="absolute top-2 right-2 bg-zinc-900/90 border border-amber-500/50 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">🪙 '+m.c+'/m</div><div class="absolute bottom-2 left-2"><span class="bg-pink-950 text-pink-300 border border-pink-500/40 text-[8px] font-bold px-1.5 py-0.5 rounded">'+m.tag+'</span></div></div><div class="p-2 space-y-1.5 flex-1 flex flex-col justify-between"><div><div class="flex justify-between items-center"><h3 class="font-bold text-xs text-white">'+m.n+'</h3><span class="text-[10px] text-amber-400 font-bold">⭐ '+m.s+'</span></div><p class="text-[9px] text-zinc-400 line-clamp-1">'+m.d+'</p></div><button onclick="abrirShow('+i+')" class="w-full btn-p py-1.5 text-xs shadow"><i class="fa-solid fa-play text-[8px]"></i> ENTRAR AL SHOW</button></div></div>').join("");
  g.innerHTML=html;
}

function updateUI(u){
  user=u;
  $("active-user-name").textContent=u?(u.nombre||u.email.split("@")[0]):"Invitado";
  $("auth-buttons").classList.toggle("hidden",!!u);
  $("btn-logout").classList.toggle("hidden",!u);
  const pill=$("user-token-pill");
  pill.classList.toggle("hidden",!u);
  const mBanner=$("model-top-banner");
  const aBanner=$("admin-top-banner");
  if(u){
    pill.classList.add("flex");
    $("header-tokens-val").textContent=u.tokens_balance||0;
    const isAdm=isAdmin(u.email,u.rol);
    const isM=isModel(u.rol);
    const badge=$("active-user-badge");
    badge.classList.remove("hidden");
    if(isAdm){
      badge.textContent="👑 MASTER";badge.className="px-1 py-0.2 rounded text-[8px] font-black bg-amber-500 text-zinc-950";
      aBanner.classList.remove("hidden");mBanner.classList.add("hidden");
      $("admin-badge-email").textContent=u.email;iniciarEscuchaUsuariosAdmin();
    }else if(isM){
      badge.textContent="💄 MODELO";badge.className="px-1 py-0.2 rounded text-[8px] font-black bg-rose-500 text-white shadow";
      mBanner.classList.remove("hidden");aBanner.classList.add("hidden");
      $("model-badge-name").textContent=u.nombre||u.email.split("@")[0];
      $("model-badge-tokens").textContent=u.tokens_ganados||0;
    }else{
      badge.textContent="VIP";badge.className="px-1 py-0.2 rounded text-[8px] font-bold bg-pink-900/60 text-pink-300";
      aBanner.classList.add("hidden");mBanner.classList.add("hidden");
    }
  }else{
    aBanner.classList.add("hidden");mBanner.classList.add("hidden");cambiarVista("modelos");
  }
}

function cerrarSesion(){if(mediaStream)detenerCamaraWeb();if(auth)auth.signOut().catch(()=>{});localStorage.removeItem("cam_u");updateUI(null);alertar("Sesión cerrada.");}
function cambiarVista(v){
  $("vista-modelos").classList.toggle("hidden",v==="admin");
  $("vista-admin").classList.toggle("hidden",v!=="admin");
}
function mostrarModalAuth(tab){
  $("auth-err").classList.add("hidden");
  $("modal-auth").classList.remove("hidden");
  $("modal-auth").classList.add("flex");
  tabAuth(tab);
}
function tabAuth(t){
  $("auth-err").classList.add("hidden");
  const isL=(t==="login");
  $("tab-login").className=isL?"flex-1 pb-1.5 text-xs font-bold text-pink-400 border-b-2 border-pink-500":"flex-1 pb-1.5 text-xs font-bold text-zinc-400";
  $("tab-registro").className=!isL?"flex-1 pb-1.5 text-xs font-bold text-pink-400 border-b-2 border-pink-500":"flex-1 pb-1.5 text-xs font-bold text-zinc-400";
  $("f-login").classList.toggle("hidden",!isL);
  $("f-reg").classList.toggle("hidden",isL);
}

function loginRapido(){
  const em=($("login-email").value||"").trim().toLowerCase();
  if(!em){$("auth-err").textContent="Escribe tu correo arriba.";$("auth-err").classList.remove("hidden");return;}
  ejecutarLogin(em);
}
function procesarLogin(e){e.preventDefault();ejecutarLogin(($("login-email").value||"").trim().toLowerCase(),$("login-pass").value);}

async function ejecutarLogin(em,pw){
  const err=$("auth-err");err.classList.add("hidden");
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
    const s={uid:docId,email:em,nombre:(uData&&(uData.nombre||uData.name))||(isAdm?"Kervin Admin":em.split("@")[0]),rol:isAdm?"Administrador":((uData&&uData.rol)||"Usuario"),tokens_balance:isAdm?99999:((uData&&(uData.tokens_balance??50))??50),tokens_ganados:uData&&uData.tokens_ganados?uData.tokens_ganados:0};
    if(isAdm&&db)db.collection("Usuarios").doc(docId).set({nombre:s.nombre,correo:em,rol:"Administrador",tokens_balance:99999},{merge:true}).catch(()=>{});
    localStorage.setItem("cam_u",JSON.stringify(s));updateUI(s);$("modal-auth").classList.add("hidden");alertar("¡Bienvenido "+s.nombre+"!");
  }else{
    err.textContent="No existe cuenta con este correo. Pulsa Crear Cuenta.";err.classList.remove("hidden");
  }
}

async function procesarReg(e){
  e.preventDefault();
  const nom=$("reg-nom").value.trim(),em=$("reg-mail").value.trim().toLowerCase(),pw=$("reg-pw").value;
  const rolSelected=$("reg-rol").value;
  const isAdm=(em===ADMIN.toLowerCase());const docId=em.replace(/[^a-zA-Z0-9]/g,"_");
  if(auth&&pw&&pw.length>=6){try{await auth.createUserWithEmailAndPassword(em,pw);}catch(e){}}
  const finalRol=isAdm?"Administrador":rolSelected;
  const doc={nombre:nom,correo:em,rol:finalRol,tokens_balance:isAdm?99999:100,tokens_ganados:0,en_vivo:false,costo_minuto:60,creado_en:new Date().toISOString()};
  if(db)db.collection("Usuarios").doc(docId).set(doc,{merge:true}).catch(()=>{});
  const s={uid:docId,email:em,nombre:nom,rol:finalRol,tokens_balance:doc.tokens_balance,tokens_ganados:0};
  localStorage.setItem("cam_u",JSON.stringify(s));updateUI(s);$("modal-auth").classList.add("hidden");alertar("¡Cuenta de "+finalRol+" creada!");
}

/* STUDIO STREAMER PARA MODELOS REALES */
function abrirStudioModelo(){
  $("modal-streamer-studio").classList.remove("hidden");
  $("modal-streamer-studio").classList.add("flex");
}
function cerrarStudioModelo(){
  $("modal-streamer-studio").classList.add("hidden");
  $("modal-streamer-studio").classList.remove("flex");
}
async function iniciarCamaraWeb(){
  try{
    mediaStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:1280}},audio:true});
    const vid=$("webcam-video");
    vid.srcObject=mediaStream;
    $("webcam-placeholder").classList.add("hidden");
    $("studio-live-hud").classList.remove("hidden");
    $("studio-controls").classList.remove("hidden");
    if(user&&db){
      db.collection("Usuarios").doc(user.uid).set({en_vivo:true,nombre:user.nombre,correo:user.email,costo_minuto:60,ultima_transmision:new Date().toISOString()},{merge:true}).catch(()=>{});
    }
    alertar("🔴 ¡Cámara activada! Tu sala está EN VIVO en CamChat.");
    studioInterval=setInterval(()=>{
      const v=Math.floor(2+Math.random()*6);
      $("studio-viewers-count").textContent=v;
    },5000);
  }catch(err){
    alertar("Error al activar cámara: "+err.message);
  }
}
function detenerCamaraWeb(){
  if(mediaStream){mediaStream.getTracks().forEach(t=>t.stop());mediaStream=null;}
  if(studioInterval)clearInterval(studioInterval);
  $("webcam-placeholder").classList.remove("hidden");
  $("studio-live-hud").classList.add("hidden");
  $("studio-controls").classList.add("hidden");
  if(user&&db){db.collection("Usuarios").doc(user.uid).set({en_vivo:false},{merge:true}).catch(()=>{});}
  alertar("Transmisión finalizada.");
}

function escucharModelosEnVivo(){
  if(!db)return;
  db.collection("Usuarios").where("en_vivo","==",true).onSnapshot(snap=>{
    let list=[];
    snap.forEach(d=>{
      const dt=d.data();
      list.push({id:d.id,nombre:dt.nombre||dt.correo||"Streamer Real",costo:dt.costo_minuto||60,foto:dt.foto||"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85"});
    });
    liveRealModels=list;
    renderModelos();
  },()=>{});
}

/* SHOWROOM */
function entrarShowReal(id,nom,costo){
  if(!user){mostrarModalAuth("login");return;}
  curShow={n:nom,c:costo,tag:"🔴 STREAM REAL",isReal:true,modelId:id};
  const simg=$("stream-img");
  simg.src="models/vanessa.jpg";
  $("stream-model-name").textContent=nom;
  $("stream-model-tag").textContent="🔴 Modelo Real en Directo";
  $("stream-chat-messages").innerHTML='<div class="bg-rose-950/80 border border-rose-500/50 p-2 rounded-xl text-rose-100"><div class="font-black text-rose-400 text-[10px]">🔴 '+nom+' (STREAMER EN VIVO)</div><div>¡Hola a todos! Qué alegría tenerlos en mi sala privada. Mándame un corazoncito 💕</div></div>';
  $("modal-showroom").classList.remove("hidden");$("modal-showroom").classList.add("flex");
}

function abrirShow(i){
  const m=M[i];if(!user){mostrarModalAuth("login");return;}
  const isAdm=isAdmin(user.email,user.rol);
  if(!isAdm&&(user.tokens_balance||0)<m.c){alertar("Tokens insuficientes. Pulsa + Recargar.");return;}
  if(!isAdm&&db){user.tokens_balance-=m.c;updateUI(user);db.collection("Usuarios").doc(user.uid).update({tokens_balance:user.tokens_balance}).catch(()=>{});}
  curShow=m;
  const simg=$("stream-img");simg.onerror=()=>{simg.src=m.alt;};simg.src=m.img;
  $("stream-model-name").textContent=m.n;
  $("stream-model-tag").textContent=m.tag;
  $("stream-chat-messages").innerHTML='<div class="bg-pink-950/70 border border-pink-500/40 p-2 rounded-xl text-pink-100"><div class="font-bold text-pink-400 text-[10px]">💖 '+m.n+'</div><div>'+m.msg+'</div></div>';
  $("modal-showroom").classList.remove("hidden");$("modal-showroom").classList.add("flex");
}

function enviarMensajeChat(e){
  e.preventDefault();const inp=$("stream-chat-input");const txt=inp.value.trim();if(!txt)return;
  const chat=$("stream-chat-messages");
  chat.innerHTML+='<div class="bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-zinc-200"><div class="font-bold text-zinc-400 text-[10px]">'+(user.nombre||"Tú")+'</div><div>'+txt+'</div></div>';
  inp.value="";chat.scrollTop=chat.scrollHeight;
  setTimeout(()=>{
    const rep=["¡Qué lindo mensaje cariño! Me encanta tenerte aquí ❤️","¡Disfrutemos este show privado juntos! ✨","¡Gracias mi amor! ¿Quieres una sorpresa especial? 💋"];
    chat.innerHTML+='<div class="bg-pink-950/70 border border-pink-500/40 p-2 rounded-xl text-pink-100"><div class="font-bold text-pink-400 text-[10px]">💖 '+(curShow?curShow.n:"Host")+'</div><div>'+rep[Math.floor(Math.random()*rep.length)]+'</div></div>';
    chat.scrollTop=chat.scrollHeight;
  },1000);
}

function enviarPropina(cant,desc){
  if(!user)return;
  const isAdm=isAdmin(user.email,user.rol);
  if(!isAdm&&(user.tokens_balance||0)<cant){alertar("Tokens insuficientes.");return;}
  if(!isAdm&&db){user.tokens_balance-=cant;updateUI(user);db.collection("Usuarios").doc(user.uid).update({tokens_balance:user.tokens_balance}).catch(()=>{});}
  if(curShow&&curShow.isReal&&curShow.modelId&&db){
    db.collection("Usuarios").doc(curShow.modelId).get().then(snap=>{
      const g=(snap.exists&&snap.data().tokens_ganados)||0;
      db.collection("Usuarios").doc(curShow.modelId).set({tokens_ganados:g+cant},{merge:true}).catch(()=>{});
    }).catch(()=>{});
  }
  const l=$("floating-layer");
  const f=document.createElement("div");f.className="fheart absolute text-xl font-bold text-pink-400 drop-shadow";f.style.left=(35+Math.random()*30)+"%";f.style.bottom="20%";f.textContent=desc;l.appendChild(f);setTimeout(()=>f.remove(),1200);
  const chat=$("stream-chat-messages");
  chat.innerHTML+='<div class="bg-amber-950/70 border border-amber-500/40 p-2 rounded-xl text-amber-200 text-[11px]"><div class="font-bold text-amber-400 text-[10px]">🪙 Propina VIP</div>'+cant+' Tokens • '+desc+'</div>';
  chat.scrollTop=chat.scrollHeight;
  setTimeout(()=>{
    let sensualResponse="¡Gracias por tu regalo mi rey! Me fascinas 🔥";
    if(cant>=100)sensualResponse="¡Waooo corona VIP! Esta noche soy completamente tuya mi amor 👑💋";
    else if(cant>=50)sensualResponse="¡Mmm qué rico beso! Te mando uno apasionado directo a la boca mi cielo 💋✨";
    chat.innerHTML+='<div class="bg-pink-950/70 border border-pink-500/40 p-2 rounded-xl text-pink-100"><div class="font-bold text-pink-400 text-[10px]">💖 '+(curShow?curShow.n:"Host")+'</div><div>'+sensualResponse+'</div></div>';
    chat.scrollTop=chat.scrollHeight;
  },1200);
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
    $("stat-total-usuarios").textContent=docs.length;
    $("stat-usuarios-reg").textContent=uC;
    $("stat-modelos-reg").textContent=mC;
    $("stat-total-tokens").textContent=tok.toLocaleString();
    const tbody=$("admin-usuarios-tbody");
    tbody.innerHTML=docs.map(u=>{
      const isK=(u.correo||"").toLowerCase()===ADMIN.toLowerCase();
      const isMod=isModel(u.rol);
      return '<tr class="hover:bg-zinc-800/40"><td class="py-2 px-2.5 font-bold text-white">'+(u.nombre||u.correo||"Anon")+'</td><td class="py-2 px-2 text-[10px] text-zinc-400 font-mono">'+(u.correo||"-")+'</td><td class="py-2 px-2 text-[10px] font-bold '+(isK?"text-amber-400":(isMod?"text-rose-400":"text-zinc-300"))+'">'+(isK?"👑 Admin":(isMod?"💄 Modelo":u.rol||"Usuario"))+'</td><td class="py-2 px-2 text-amber-400 font-mono font-bold text-xs">🪙 '+(u.tokens_balance||0)+'</td><td class="py-2 px-2"><button onclick="sumarTokensUsuario(\''+u.id+'\',50)" class="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded text-[10px] font-bold">+50</button></td></tr>';
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
  const al=$("global-alert");
  $("global-alert-text").textContent=m;
  al.className="mb-3 p-2 rounded-xl border bg-pink-950 border-pink-500/60 text-pink-200 text-xs flex justify-between";
  al.classList.remove("hidden");setTimeout(()=>al.classList.add("hidden"),3500);
}

window.addEventListener("DOMContentLoaded",()=>{
  renderModelos();
  escucharModelosEnVivo();
  const s=localStorage.getItem("cam_u");
  if(s){try{const p=JSON.parse(s);if(p&&p.email)updateUI(p);}catch(e){}}
});
