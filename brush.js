import * as THREE from './public/vendor/three.module.js';

// Lightweight procedural spoolie: one instanced draw call for all 780 bristles.
export function initBrush(container, gsap, ScrollTrigger) {
 const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 container.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,50);camera.position.set(0,0,11.6);
 const brush=new THREE.Group();scene.add(brush);
 const violet=new THREE.MeshPhysicalMaterial({color:0x794aa7,metalness:.48,roughness:.23,clearcoat:1,clearcoatRoughness:.2});
 const silver=new THREE.MeshStandardMaterial({color:0xe1d8ed,metalness:.92,roughness:.2});
 const black=new THREE.MeshStandardMaterial({color:0x24152d,metalness:.05,roughness:.48});
 function cylinder(top,bottom,height,y,material,segments=24){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(top,bottom,height,segments),material);mesh.position.y=y;brush.add(mesh);return mesh}
 cylinder(.105,.075,2.85,-1.35,violet,40);
 const cap=new THREE.Mesh(new THREE.SphereGeometry(.076,20,12),violet);cap.scale.y=.45;cap.position.y=-2.78;brush.add(cap);
 cylinder(.113,.113,.24,.12,silver,32);
 cylinder(.116,.116,.026,.23,black,32);
 cylinder(.025,.025,.66,.55,silver,12);
 cylinder(.022,.022,1.65,1.67,black,10);
 // Fine twisted wire spine, visible between the spiraling rows of nylon hairs.
 const spinePoints=[];
 for(let j=0;j<=150;j++){const t=j/150,a=t*Math.PI*16;spinePoints.push(new THREE.Vector3(Math.cos(a)*.022,.81+t*1.72,Math.sin(a)*.022))}
 const spine=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spinePoints),150,.007,4,false),silver);brush.add(spine);
 const bristles=new THREE.InstancedMesh(new THREE.CylinderGeometry(.003,.008,1,4),black,780);
 const dummy=new THREE.Object3D(),up=new THREE.Vector3(0,1,0);
 for(let i=0;i<780;i++){
  const t=i/779,angle=i*2.39996+t*Math.PI*20;
  const taper=Math.pow(Math.sin(Math.PI*(.06+t*.88)),.6);
  const length=(.12+taper*.22)*(1+Math.sin(i*14.31)*.09);
  const direction=new THREE.Vector3(Math.cos(angle),.1*Math.sin(i*2.1),Math.sin(angle)).normalize();
  dummy.position.copy(direction).multiplyScalar(length*.5+.022);dummy.position.y+=.84+t*1.64;
  dummy.quaternion.setFromUnitVectors(up,direction);dummy.scale.set(1,length,1);dummy.updateMatrix();bristles.setMatrixAt(i,dummy.matrix);
 }
 bristles.instanceMatrix.needsUpdate=true;brush.add(bristles);
 const ink=document.createElement('canvas');ink.width=512;ink.height=96;const c=ink.getContext('2d');c.fillStyle='#ede1fb';c.font='500 54px Georgia';c.textAlign='center';c.fillText('É C L A T',256,66);
 const logo=new THREE.Mesh(new THREE.PlaneGeometry(.93,.174),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(ink),transparent:true,depthWrite:false}));logo.position.set(0,-1.45,.107);logo.rotation.z=Math.PI/2;brush.add(logo);
 scene.add(new THREE.HemisphereLight(0xf3e5ff,0x39204c,3));
 const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(-3,4,5);scene.add(key);
 const rim=new THREE.DirectionalLight(0xc095f4,5);rim.position.set(3,-1,2);scene.add(rim);
 const back=new THREE.DirectionalLight(0xffffff,3);back.position.set(0,3,-4);scene.add(back);
 let path=[],dirty=true,lastY=-1,disposed=false,lastFrame=0,canvasSize=0,pageHeight=1;
 const mobile=()=>innerWidth<=600;
 const top=id=>document.querySelector(id).getBoundingClientRect().top+scrollY;
 function resize(){
  const size=mobile()?280:450;if(canvasSize!==size){canvasSize=size;renderer.setSize(size,size);container.style.width=size+'px';container.style.height=size+'px'}pageHeight=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  const h=innerHeight;
  path=[
   {s:0,x:1.1,y:.4,z:-.6,rx:.4,ry:.4,k:.48,a:0},
   {s:h*.55,x:.95,y:.7,z:-.85,rx:.6,ry:.7,k:.60,a:1},
   {s:top('#efeitos')+h*.3,x:mobile()?1.03:.985,y:.32,z:.3,rx:.2,ry:1.5,k:mobile()?.32:.48,a:1},
   {s:top('#ritual-3d')-h*.85,x:.91,y:.7,z:2.3,rx:.8,ry:2.1,k:.65,a:1},
   {s:top('#ritual-3d')-h*.15,x:mobile()?.65:.7,y:.3,z:3.7,rx:.25,ry:3.2,k:mobile()?.95:1.18,a:1},
   {s:top('#ritual-3d')+h*.42,x:mobile()?.62:.65,y:mobile()?.35:.52,z:5.6,rx:.5,ry:4.2,k:mobile()?1.02:1.35,a:1},
   {s:top('#ritual-3d')+h*.92,x:mobile()?1.05:.72,y:mobile()?.7:.8,z:7.3,rx:.25,ry:5.6,k:mobile()?.85:1.1,a:1},
   {s:top('#match')+h*.3,x:mobile()?1.06:.98,y:.75,z:8.5,rx:.4,ry:6.4,k:.42,a:1},
   {s:top('#experiencia')+h*.05,x:mobile()?.02:.035,y:.36,z:9.7,rx:.65,ry:7.1,k:.48,a:1},
   {s:top('.lookbook')+h*.08,x:mobile()?1.08:.98,y:.3,z:10.7,rx:.2,ry:8.5,k:.43,a:1},
   {s:top('#duvidas')+h*.25,x:mobile()?1.09:.97,y:.65,z:11.8,rx:.5,ry:9.4,k:.40,a:1},
   {s:top('#agendar')+h*.1,x:.89,y:.72,z:13.2,rx:.2,ry:10.7,k:.7,a:1},
   {s:top('footer'),x:.85,y:1.5,z:14.5,rx:.6,ry:11.7,k:.5,a:0}
  ].sort((a,b)=>a.s-b.s);
  dirty=true;
 }
 const update=()=>{dirty=true};
 function render(){
  if(disposed||document.hidden||document.body.classList.contains('menu-open')||document.body.classList.contains('modal-open'))return;const now=performance.now();if(now-lastFrame<32)return;lastFrame=now;
  const scroll=window.scrollY;
  if(scroll!==lastY){dirty=true;lastY=scroll}
  if(!dirty)return;dirty=false;
  let a=path[0],b=path.at(-1);
  for(let i=1;i<path.length;i++)if(scroll<=path[i].s){a=path[i-1];b=path[i];break}
  let t=THREE.MathUtils.clamp((scroll-a.s)/Math.max(1,b.s-a.s),0,1);t=t*t*(3-2*t);
  const lerp=k=>THREE.MathUtils.lerp(a[k],b[k],t);
  const size=canvasSize;
  container.style.transform=`translate3d(${lerp('x')*innerWidth-size/2}px,${lerp('y')*innerHeight-size/2}px,0)`;
  container.style.opacity=String(lerp('a'));
  container.dataset.progress=((scroll)/pageHeight).toFixed(3);
  brush.rotation.set(lerp('rx'),lerp('ry'),lerp('z'),'ZXY');brush.scale.setScalar(lerp('k'));
  renderer.render(scene,camera);
 }
 resize();render();gsap.ticker.add(render);
 const onResize=()=>{resize();render()};addEventListener('resize',onResize,{passive:true});
 ScrollTrigger.addEventListener('refresh',onResize);
 new ResizeObserver(()=>{resize()}).observe(document.querySelector('main'));
 addEventListener('scroll',update,{passive:true});
 container.classList.add('ready');document.documentElement.classList.add('has-brush-3d');
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();disposed=true;container.hidden=true;document.documentElement.classList.remove('has-brush-3d');gsap.ticker.remove(render)});
 return {refresh:resize};
}
