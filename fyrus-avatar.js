/* Fyrus premium avatar layer. Existing procedural avatars remain the fallback. */
(function () {
  'use strict';
  if (window.__fyrusAvatarFactory) return;
  var API = window.__fyrusAvatarFactory = { version: '1.0.0', loaded: false, active: false };
  var variants = { female:'/assets/characters/glb/female-primary.glb', male:'/assets/characters/glb/male-counterpart.glb', boy:'/assets/characters/glb/boy.glb', girl:'/assets/characters/glb/girl.glb', elderlyMan:'/assets/characters/glb/elderly-man.glb', elderlyWoman:'/assets/characters/glb/elderly-woman.glb' };
  var loaderPromise;
  function loadLoader() {
    if (window.THREE && window.THREE.GLTFLoader) return Promise.resolve(window.THREE.GLTFLoader);
    if (loaderPromise) return loaderPromise;
    loaderPromise = new Promise(function (resolve, reject) { var s=document.createElement('script'); s.src='/fyrus-gltf-loader.js?v=1.0.0'; s.onload=function(){ window.THREE&&window.THREE.GLTFLoader?resolve(window.THREE.GLTFLoader):reject(new Error('GLTFLoader unavailable')); }; s.onerror=reject; document.head.appendChild(s); });
    return loaderPromise;
  }
  function world() { return window.__fyrusW && window.__fyrusW.player && window.__fyrusW.world ? window.__fyrusW : null; }
  API.spawn = function (variant, style) { var W=world(); if (!W || !window.THREE) return Promise.resolve(false); variant=variant||'female'; style=style||{}; return loadLoader().then(function(Loader){ return new Promise(function(resolve,reject){ new Loader().load(variants[variant]||variants.female,function(gltf){ var model=gltf.scene; model.name='fyrus-premium-avatar-'+variant; model.scale.setScalar(.92); model.traverse(function(o){ if(o.isMesh){o.castShadow=true;o.receiveShadow=true; if(o.material){var n=o.material.name||''; if(style.outfit==='formal'&&/cloth|accent/i.test(n))o.material.color.setHex(0x20283a); if(style.outfit==='casual'&&/cloth/i.test(n))o.material.color.setHex(0x315b68); if(style.skin==='deep'&&/skin/i.test(n))o.material.color.setHex(0x6b3824); if(style.skin==='light'&&/skin/i.test(n))o.material.color.setHex(0xe0a982); if(style.hair==='silver'&&/hair/i.test(n))o.material.color.setHex(0xaaa49a); } } }); if(W.player.premiumModel)W.player.root.remove(W.player.premiumModel); if(W.player.body)W.player.body.visible=false; W.player.root.add(model); W.player.premiumModel=model; API.loaded=true; API.active=true; resolve(true); },undefined,reject); }); }).catch(function(err){ console.warn('[Fyrus Avatar] premium model unavailable; procedural fallback retained',err&&err.message); return false; }); };
  function animate(W, now){ var m=W.player.premiumModel; if(!m)return; var moving=Number(W.player.speed||0)>0.25; m.position.y=(moving?Math.abs(Math.sin(now*.012))*0.025:Math.sin(now*.0018)*0.012); m.rotation.y += ((W.player.root.rotation.y-m.rotation.y)*0.08); m.rotation.x=moving?Math.sin(now*.012)*0.018:0; }
  function tick(now){ var W=world(); if(W&&!W.player.premiumModel&&!API.active){API.active=true;var saved='female';try{saved=localStorage.getItem('fyrus.avatar.variant')||'female'}catch(e){} API.spawn(saved);} if(W)animate(W,now||0); requestAnimationFrame(tick); }
  setTimeout(tick,1200);
})();
