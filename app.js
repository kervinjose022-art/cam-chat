const M=[
  {n:"Vanessa Vane",c:50,tag:"RED LACE 💋",v:"2.4k",s:4.9,img:"https://images.unsplash.com/photo-1525672716948-1f0bb9c49883?auto=format&fit=crop&w=700&q=85",alt:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",msg:"¡Hola mi amor! Puse música sensual para los dos... ¿bailamos juntos? 💕",d:"Latina sensual en baby doll y lencería roja pasión."},
  {n:"Camila Sweet",c:50,tag:"PINK SILK 🌸",v:"1.9k",s:4.8,img:"https://images.unsplash.com/photo-1574539602047-548bf9557352?auto=format&fit=crop&w=700&q=85",alt:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",msg:"¡Hola cielo! Me estaba cambiando con mi bata de seda... qué rico que llegaste 🥰",d:"Dulzura en babydoll de seda rosada y charlas íntimas."},
  {n:"Nicole Ross",c:75,tag:"BLACK CORSET 🔥",v:"3.2k",s:5.0,img:"https://images.unsplash.com/photo-1568663521381-33b7c467fda0?auto=format&fit=crop&w=700&q=85",alt:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",msg:"Buenas noches querido. La suite VIP está lista para nuestro show privado 🍸",d:"Elegancia pura en corset de encaje negro y miradas seductoras."},
  {n:"Scarlet Diamond",c:100,tag:"GOLD SATIN 👑",v:"4.5k",s:5.0,img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85",alt:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",msg:"Bienvenido a mi sala VIP. Esta noche las reglas las pones tú 🔥",d:"Bata de satén dorado, curvas y exclusividad total."}
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
  curShow=m;
  const simg=$("stream-img");simg.onerror=()=>{simg.src=m.alt;};simg.src=m.img;
  $("stream-model-name").textContent=m.n;
  $("stream-model-tag").textContent=m.tag;
  $("stream-chat-messages").innerHTML='<div class="bg-pink-950/70 border border-pink-500/40 p-2 rounded-xl text-pink-100"><div class="font-bold text-pink-400 text-[10px]">💖 '+m.n+'</div><div>'+m.msg+'</div></div>';
  $("modal-showroom").classList.remove("hidden");$("modal-showroom").classList.add("flex");
}

/* GESTOS Y MOVIMIENTOS EN VIVO */
function animarGesto(t){
  const img=$("stream-img"),badge=$("model-gesture-badge"),layer=$("floating-layer");
  if(!img)return;
  img.classList.remove("kiss-anim","wink-anim","dance-anim","zoom-anim");
  void img.offsetWidth;
  let txt="",anim="",sym="";
  const mN=(curShow?curShow.n:"La modelo");
  if(t==="beso"){anim="kiss-anim";txt="💋 "+mN+" te lanza un beso ardiente...";sym="💋";}
  else if(t==="guiño"){anim="wink-anim";txt="😉 "+mN+" te guiña el ojo con picardía...";sym="😉";}
  else if(t==="baile"){anim="dance-anim";txt="💃 "+mN+" baila sensualmente para ti...";sym="✨";}
  else if(t==="acercar"){anim="zoom-anim";txt="🔥 "+mN+" se acerca a tu pantalla...";sym="🔥";}
  img.classList.add(anim);
  if(badge){badge.textContent=txt;badge.classList.remove("hidden");setTimeout(()=>badge.classList.add("hidden"),2500);}
  if(layer&&sym){
    for(let k=0;k<3;k++){
      setTimeout(()=>{
        const f=document.createElement("div");f.className="fheart absolute text-2xl font-bold drop-shadow";
        f.style.left=(25+Math.random()*50)+"%";f.style.bottom=(30+Math.random()*25)+"%";f.textContent=sym;
        layer.appendChild(f);setTimeout(()=>f.remove(),1200);
      },k*180);
    }
  }
}

function pedirGesto(t){
  if(!curShow)return;
  const nom=(user?user.nombre:"Mi rey");animarGesto(t);
  const chat=$("stream-chat-messages");
  let uReq="",rep="";
  if(t==="beso"){uReq="💋 ¡Lánzame un beso mi amor!";rep="¡Muakkk para ti sólito "+nom+"! 💋 Te mando un beso bien apasionado...";}
  else if(t==="guiño"){uReq="😉 ¡Dame un guiño picarón!";rep="[Te mira fijamente, sonríe coqueta y te guiña el ojo] 😉 ¿Te gustó mi guiño mi rey?";}
  else if(t==="baile"){uReq="💃 ¡Baila sensual para mí!";rep="Mmm me encanta cómo me lo pides... [da una vuelta suave moviendo sus curvas] 🔥";}
  else if(t==="acercar"){uReq="🔥 ¡Acércate más a la pantalla!";rep="[Se acerca a la cámara mirándote fijamente a los ojos] Aquí estoy bien cerquita de ti "+nom+" 😏";}
  chat.innerHTML+='<div class="bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-zinc-200"><div class="font-bold text-zinc-400 text-[10px]">'+nom+'</div><div>'+uReq+'</div></div>';
  chat.scrollTop=chat.scrollHeight;
  setTimeout(()=>{
    chat.innerHTML+='<div class="bg-pink-950/70 border border-pink-500/40 p-2 rounded-xl text-pink-100"><div class="font-bold text-pink-400 text-[10px]">💖 '+curShow.n+'</div><div>'+rep+'</div></div>';
    chat.scrollTop=chat.scrollHeight;
  },800);
}

function responderChatInteligente(raw){
  const t=raw.toLowerCase(),nom=(user?(user.nombre||"mi rey"):"mi amor"),mN=(curShow?curShow.n:"Vanessa");
  const has=(k)=>t.includes(k);
  if(has("beso")||has("besito")||has("muak")||has("pico")){animarGesto("beso");return "¡Muakkk! 💋 Te mandé un beso apasionado a tus labios "+nom+"... ¿lo sentiste rico? 🥰";}
  if(has("guiñ")||has("ojo")||has("ojito")){animarGesto("guiño");return "[Te mira con picardía y te guiña el ojo] 😉 Ese guiño fue exclusivo para ti mi cielo...";}
  if(has("baila")||has("baile")||has("mueve")||has("vuelta")||has("cuerpo")){animarGesto("baile");return "Mmm me encanta bailar para ti... [gira sensualmente al ritmo] 🔥 ¿Te gusta cómo me muevo?";}
  if(has("cerca")||has("acerca")||has("ven")||has("mira")){animarGesto("acercar");return "[Se acerca a la cámara susurrándote] Aquí estoy bien cerquita de ti "+nom+"... 😏";}
  if(has("hola")||has("buenas")||has("hey")||has("saludos")){return "¡Hola "+nom+"! Qué delicia tenerte en mi sala hoy. ¿Cómo te trata la noche? Estoy lista para ti 💕";}
  if(has("hermosa")||has("linda")||has("bella")||has("rica")||has("guapa")||has("preciosa")||has("mamacita")||has("diosa")){animarGesto("guiño");return "Ayyy qué lindo eres "+nom+"... me haces sonrojar 🙈 Me fascinan tus piropos, quédate conmigo a solas 💋";}
  if(has("ropa")||has("lencer")||has("quitate")||has("desnud")||has("show")||has("sexy")){return "Mmm qué travieso... 🔥 Mándame una propina o una coronita VIP 👑 y te doy un show privado ardiente.";}
  if(has("te amo")||has("te quiero")||has("amor")||has("bebe")||has("bb")||has("cariño")||has("gracias")){return "¡Tan tierno mi amor! Me encanta cuando me hablas así de dulce... me tienes fascinada 💕✨";}
  if(has("si")||has("sí")||has("claro")||has("dale")||has("ok")||has("vamos")||has("quiero")){animarGesto("beso");return "¡Esooo! Me fascinan los hombres decididos 😏 Pídeme un baile, un besito o un guiño mi cielo.";}
  if(has("donde")||has("edad")||has("haces")||has("nombre")){return "Soy "+mN+" y transmito en vivo para ti mi rey 🔥 ¿Desde qué ciudad me estás viendo hoy?";}
  const v=["¡Qué rico mensaje "+nom+"! Me fascina tu compañía en mi sala ❤️","¡Disfrutemos este show privado juntos mi amor! ✨","¡Gracias por estar aquí "+nom+"! Mándame un guiño o corazoncito para seguir jugando juntos 💋","¡Aquí estoy toda tuya cielo! Dime qué más quieres ver de mí... 😏"];
  return v[Math.floor(Math.random()*v.length)];
}

function enviarMensajeChat(e){
  e.preventDefault();const inp=$("stream-chat-input");const txt=inp.value.trim();if(!txt)return;
  const chat=$("stream-chat-messages");
  chat.innerHTML+='<div class="bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-zinc-200"><div class="font-bold text-zinc-400 text-[10px]">'+(user?user.nombre:"Tú")+'</div><div>'+txt+'</div></div>';
  inp.value="";chat.scrollTop=chat.scrollHeight;
  setTimeout(()=>{
    const rep=responderChatInteligente(txt);
    chat.innerHTML+='<div class="bg-pink
