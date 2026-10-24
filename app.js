const M=[
  {n:"Vanessa Vane",c:50,tag:"RED LACE 💋",v:"2.4k",s:4.9,img:"https://images.unsplash.com/photo-1525672716948-1f0bb9c49883?auto=format&fit=crop&w=700&q=85",alt:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",msg:"¡Hola mi amor! Puse música sensual para los dos... ¿bailamos juntos? 💕",d:"Latina sensual en baby doll y lencería roja pasión."},
  {n:"Camila Sweet",c:50,tag:"PINK SILK 🌸",v:"1.9k",s:4.8,img:"https://images.unsplash.com/photo-1574539602047-548bf9557352?auto=format&fit=crop&w=700&q=85",alt:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",msg:"¡Hola cielo! Me estaba cambiando con mi bata de seda... qué rico que llegaste 🥰",d:"Dulzura en babydoll de seda rosada y charlas íntimas."},
  {n:"Nicole Ross",c:75,tag:"BLACK CORSET 🔥",v:"3.2k",s:5.0,img:"https://images.unsplash.com/photo-1568663521381-33b7c467fda0?auto=format&fit=crop&w=700&q=85",alt:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",msg:"Buenas noches querido. La suite VIP está lista para nuestro show privado 🍸",d:"Elegancia pura en corset de encaje negro y miradas seductoras."},
  {n:"Scarlet Diamond",c:100,tag:"GOLD SATIN 👑",v:"4.5k",s:5.0,img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85",alt:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",msg:"Bienvenido a mi sala VIP. Esta noche las reglas las pones tú 🔥",d:"Bata de satén dorado, curvas y exclusividad total."}
];

const $=(id)=>document.getElementById(id);
const fConfig={apiKey:"AIzaSyDLVDVzc6w9S68BvL7H_b_95vF9yvIsGgo",authDomain:"camchat-900d6.firebaseapp.com",projectId:"camchat-900d6"};
let auth,db,user=null,curShow=null,mediaStream=null,studioInterval=null,liveRealModels=[],streamTimerSecs=600,streamTimerInterval=null,deferredPrompt=null;
const BEP20="0x29f0f1edd5258ee3b7553bff665df4d1dd811af0";
try{if(!firebase.apps.length)firebase.initializeApp(fConfig);auth=firebase.auth();db=firebase.firestore();}catch(e){}

const ADMIN="kervinjose022@gmail.com";
const isAdmin=(em,rol)=>em&&(em.toLowerCase()===ADMIN.toLowerCase()||(rol&&rol.toLowerCase().includes("admin")));
const isModel=(rol)=>rol&&(rol.toLowerCase().includes("modelo")||rol.toLowerCase().includes("streamer"));

// SINTETIZADOR DE AUDIO PARA REGALOS (Web Audio API)
function reproducirSonidoRegalo(){
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type="sine";
    osc.frequency.setValueAtTime(587.33,ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880,ctx.currentTime+0.15);
    osc.frequency.exponentialRampToValueAtTime(1174.66,ctx.currentTime+0.35);
    gain.gain.setValueAtTime(0.25,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.6);
    osc.connect(gain);gain.connect(ctx.destination);
    osc.start();osc.stop(ctx.currentTime+0.6);
  }catch(e){}
}

function renderModelos(){
  const g=$("grid-modelos");if(!g)return;
  let html="";
  if(liveRealModels.length>0){
    html+=liveRealModels.map(m=>'<div class="mcard border-pink-500 shadow-lg shadow-pink-900/30"><div class="relative aspect-[3/4] bg-zinc-950 flex items-center justify-center overflow-hidden"><img src="'+(m.foto||'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85')+'" class="w-full h-full object-cover live-motion"><div class="absolute inset-0 bg-gradient-to-t from-[#111320] via-transparent to-black/30"></div><div class="absolute top-2 left-2 flex items-center gap-1"><span class="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-white ldot"></span> STREAM REAL</span></div><div class="absolute top-2 right-2 bg-zinc-900/90 border border-amber-500/50 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">🪙 '+(m.costo||60)+'/m</div><div class="absolute bottom-2 left-2"><span class="bg-gradient-to-r from-red-600 to-pink-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow">🔴 EN VIVO AHORA</span></div></div><div class="p-2 space-y-1.5 flex-1 flex flex-col justify-between"><div><div class="flex justify-between items-center"><h3 class="font-bold text-xs text-white">'+(m.nombre||'Modelo Real')+'</h3><span class="text-[10px] text-amber-400 font-bold">⭐ 5.0</span></div><p class="text-[9px] text-pink-300 line-clamp-1 font-semibold">Transmisión en directo real</p></div><button onclick="entrarShowReal(\''+m.id+'\',\''+(m.nombre||'Modelo')+'\','+(m.costo||60)+')" class="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black py-1.5 text-xs shadow rounded-xl active:scale-95"><i class="fa-solid fa-play text-[8px]"></i> ENTRAR EN VIVO</button></div></div>').join("");
  }
  html+=M.map((m,i)=>'<div class="mcard"><div class="relative aspect-[3/4] bg-zinc-950 overflow-hidden"><img src="'+m.img+'" onerror="this.onerror=null;this.src=\''+m.alt+'\'" class="w-full h-full object-cover live-motion"><div class="absolute inset-0 bg-gradient-to-t from-[#111320] via-transparent to-black/30"></div><div class="absolute top-2 left-2 flex items-center gap-1"><span class="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-white ldot"></span> EN VIVO</span><span class="bg-black/60 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded-full">👁️ '+m.v+'</span></div><div class="absolute top-2 right-2 bg-zinc-900/90 border border-amber-500/50 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">🪙 '+m.c+'/m</div><div class="absolute bottom-2 left-2"><span class="bg-pink-950 text-pink-300 border border-pink-500/40 text-[8px] font-bold px-1.5 py-0.5 rounded">'+m.tag+'</span></div></div><div class="p-2 space-y-1.5 flex-1 flex flex-col justify-between"><div><div class="flex justify-between items-center"><h3 class="font-bold text-xs text-white">'+m.n+'</h3><span class="text-[10px] text-amber-400 font-bold">⭐ '+m.s+'</span></div><p class="text-[9px] text-zinc-400 line-clamp-1">'+m.d+'</p></div><button onclick="abrirShow('+i+')" class="w-full btn-p py-1.5 text-xs shadow active:scale-95"><i class="fa-solid fa-play text-[8px]"></i> ENTRAR AL SHOW</button></div></div>').join("");
  g.innerHTML=html;
  renderPanelSalas();
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
    if((u.tokens_balance||0)<=0){u.tokens_balance=100;localStorage.setItem("cam_u",JSON.stringify(u));if(db)db.collection("Usuarios").doc(u.uid).set({tokens_balance:100},{merge:true}).catch(()=>{});}
    pill.classList.add("flex");
    $("header-tokens-val").textContent=u.tokens_balance;
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
      const tokG=u.tokens_ganados||0;
      $("model-badge-tokens").textContent=tokG;
      $("model-badge-usd").textContent="$"+(tokG*0.1).toFixed(1)+" USD";
      iniciarEscuchaUsuariosAdmin();
    }else{
      badge.textContent="VIP";badge.className="px-1 py-0.2 rounded text-[8px] font-bold bg-pink-900/60 text-pink-300";
      aBanner.classList.add("hidden");mBanner.classList.add("hidden");
    }
  }else{
    aBanner.classList.add("hidden");mBanner.classList.add("hidden");
  }
}

function cerrarSesion(){if(mediaStream)detenerCamaraWeb();if(auth)auth.signOut().catch(()=>{});localStorage.removeItem("cam_u");updateUI(null);cambiarVista("modelos");alertar("Sesión cerrada.");}
function cambiarVista(v){
  const isAdminView=(v==="admin");
  $("vista-modelos").classList.toggle("hidden",isAdminView);
  $("vista-admin").classList.toggle("hidden",!isAdminView);
  if(isAdminView)iniciarEscuchaUsuariosAdmin();
}

function cambiarSubTabPanel(t){
  const tabs=['salas','espectadores','modelos','regalos','finanzas'];
  tabs.forEach(tab=>{
    const b=$("tab-panel-"+tab),sec=$("subseccion-"+tab);
    if(b&&sec){
      const isAct=(tab===t);
      sec.classList.toggle("hidden",!isAct);
      b.className=isAct?"px-3 py-1.5 rounded-lg text-xs font-black bg-pink-600 text-white flex items-center gap-1.5 shrink-0":"px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 text-zinc-300 flex items-center gap-1.5 shrink-0";
    }
  });
}

function renderPanelSalas(){
  const g=$("panel-grid-salas");if(!g)return;
  let html="";
  if(liveRealModels.length>0){
    html+=liveRealModels.map(m=>'<div class="bg-[#121422] border border-rose-500/60 rounded-xl overflow-hidden p-2.5 flex flex-col justify-between"><div class="relative aspect-video rounded-lg overflow-hidden bg-black mb-2"><img src="'+(m.foto||'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85')+'" class="w-full h-full object-cover"><span class="absolute top-1.5 left-1.5 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-white ldot"></span> EN VIVO</span></div><div class="mb-2"><div class="font-black text-xs text-white">'+m.nombre+'</div><div class="text-[10px] text-pink-300">Sala Real WebCam</div></div><button onclick="entrarShowReal(\''+m.id+'\',\''+m.nombre+'\','+(m.costo||60)+')" class="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black py-1.5 rounded-lg text-xs shadow flex items-center justify-center gap-1.5 active:scale-95"><i class="fa-solid fa-eye"></i> VER SALA</button></div>').join("");
  }
  html+=M.map((m,i)=>'<div class="bg-[#121422] border border-pink-500/30 rounded-xl overflow-hidden p-2.5 flex flex-col justify-between"><div class="relative aspect-video rounded-lg overflow-hidden bg-black mb-2"><img src="'+m.img+'" onerror="this.src=\''+m.alt+'\'" class="w-full h-full object-cover"><span class="absolute top-1.5 left-1.5 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-white ldot"></span> SALA VIP</span><span class="absolute bottom-1.5 right-1.5 bg-black/70 text-amber-300 font-mono text-[9px] px-1 rounded">🪙 '+m.c+'/m</span></div><div class="mb-2"><div class="font-black text-xs text-white">'+m.n+'</div><div class="text-[10px] text-zinc-400">'+m.tag+'</div></div><button onclick="abrirShow('+i+')" class="w-full btn-p py-1.5 rounded-lg text-xs shadow flex items-center justify-center gap-1.5 active:scale-95"><i class="fa-solid fa-eye"></i> VER SALA</button></div>').join("");
  g.innerHTML=html;
}

function mostrarModalAuth(tab){$("auth-err").classList.add("hidden");$("modal-auth").classList.remove("hidden");$("modal-auth").classList.add("flex");tabAuth(tab);}
function tabAuth(t){
  $("auth-err").classList.add("hidden");const isL=(t==="login");
  $("tab-login").className=isL?"flex-1 pb-1.5 text-xs font-bold text-pink-400 border-b-2 border-pink-500":"flex-1 pb-1.5 text-xs font-bold text-zinc-400";
  $("tab-registro").className=!isL?"flex-1 pb-1.5 text-xs font-bold text-pink-400 border-b-2 border-pink-500":"flex-1 pb-1.5 text-xs font-bold text-zinc-400";
  $("f-login").classList.toggle("hidden",!isL);$("f-reg").classList.toggle("hidden",isL);
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
    }catch(e){}
  }
  const isAdm=(em===ADMIN.toLowerCase());
  if(isAdm||uData){
    const s={uid:docId,email:em,nombre:(uData&&(uData.nombre||uData.name))||(isAdm?"Kervin Admin":em.split("@")[0]),rol:isAdm?"Administrador":((uData&&uData.rol)||"Usuario"),tokens_balance:isAdm?99999:((uData&&(uData.tokens_balance??100))??100),tokens_ganados:uData&&uData.tokens_ganados?uData.tokens_ganados:0};
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

/* STUDIO MODELO REAL */
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
  }catch(err){alertar("Error al activar cámara: "+err.message);}
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
    $("stat-salas-activas").textContent=4+liveRealModels.length;
    renderModelos();
  },()=>{});
}

function entrarShowReal(id,nom,costo){
  if(!user){mostrarModalAuth("login");return;}
  curShow={id:id,n:nom,c:costo,tag:"🔴 MODELO REAL",v:"1.1k",s:5.0,img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",alt:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",isReal:true};
  const simg=$("stream-img");simg.src=curShow.img;
  $("stream-model-name").textContent=nom;
  $("stream-model-tag").textContent="🔴 TRANSMISIÓN REAL EN DIRECTO";
  $("chat-tokens-val").textContent=user.tokens_balance||0;
  $("stream-chat-messages").innerHTML='<div class="bg-rose-950/70 border border-rose-500/40 p-2 rounded-xl text-rose-100"><div class="font-bold text-rose-400 text-[10px]">🔴 '+nom+' (En Vivo)</div><div>¡Hola mi amor! Gracias por entrar a mi sala real. ¿Qué regalo me quieres enviar hoy? 💋</div></div>';
  $("stream-time-expired").classList.add("hidden");
  $("modal-showroom").classList.remove("hidden");$("modal-showroom").classList.add("flex");
  iniciarTemporizadorShow();
}

/* SHOWROOM & TEMPORIZADOR 10 MINUTOS */
function abrirShow(i){
  const m=M[i];if(!user){mostrarModalAuth("login");return;}
  curShow={...m,isReal:false};
  const simg=$("stream-img");simg.onerror=()=>{simg.src=m.alt;};simg.src=m.img;
  $("stream-model-name").textContent=m.n;
  $("stream-model-tag").textContent=m.tag;
  $("chat-tokens-val").textContent=user.tokens_balance||0;
  $("stream-chat-messages").innerHTML='<div class="bg-pink-950/70 border border-pink-500/40 p-2 rounded-xl text-pink-100"><div class="font-bold text-pink-400 text-[10px]">💖 '+m.n+'</div><div>'+m.msg+'</div></div>';
  $("stream-time-expired").classList.add("hidden");
  $("modal-showroom").classList.remove("hidden");$("modal-showroom").classList.add("flex");
  iniciarTemporizadorShow();
}

function cerrarShow(){
  if(streamTimerInterval)clearInterval(streamTimerInterval);
  $("modal-showroom").classList.add("hidden");
}

function iniciarTemporizadorShow(){
  if(streamTimerInterval)clearInterval(streamTimerInterval);
  const isAdm=user&&isAdmin(user.email,user.rol);
  if(isAdm){$("stream-timer-val").textContent="VIP ∞";return;}
  streamTimerInterval=setInterval(()=>{
    if(streamTimerSecs>0){
      streamTimerSecs--;
      const min=Math.floor(streamTimerSecs/60),sec=streamTimerSecs%60;
      $("stream-timer-val").textContent=(min<10?"0":"")+min+":"+(sec<10?"0":"")+sec;
      if(streamTimerSecs===60)alertar("⚠️ Te queda 1 minuto de transmisión gratis. Recarga con BEP-20.");
    }else{
      clearInterval(streamTimerInterval);
      $("stream-time-expired").classList.remove("hidden");
    }
  },1000);
}

/* MODAL BEP-20 */
function mostrarModalBEP20(){
  $("modal-bep20").classList.remove("hidden");
  $("modal-bep20").classList.add("flex");
}
function cerrarModalBEP20(){
  $("modal-bep20").classList.add("hidden");
  $("modal-bep20").classList.remove("flex");
}
function copiarBilleteraBEP20(){
  navigator.clipboard.writeText(BEP20).then(()=>{
    alertar("✅ Dirección BEP-20 copiada: "+BEP20);
