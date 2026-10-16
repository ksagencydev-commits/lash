import * as THREE from './public/vendor/three.module.js';
export function initSculpture(container,gsap,ScrollTrigger){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);container.append(renderer.domElement);container.querySelector('svg').hidden=true;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,0,13);
 const group=new THREE.Group();scene.add(group);
 const gold=new THREE.MeshStandardMaterial({color:0xd8b99b,metalness:.86,roughness:.27});
 const dark=new THREE.MeshStandardMaterial({color:0x946776,metalness:.65,roughness:.33});
 for(let i=0;i<30;i++){
  const t=i/29,x=(t-.5)*6.6,length=2.2+Math.sin(t*Math.PI)*2.1;
  const curve=new THREE.CubicBezierCurve3(new THREE.Vector3(x,-1.55,.2*Math.cos(t*3)),new THREE.Vector3(x+.25,-.4,.7),new THREE.Vector3(x+1.4,length*.4,1.1),new THREE.Vector3(x+1.3,length-1.5,-.9));
  // Tapered tubes read as delicate individual lashes, rather than uniform wires.
  const geometry=new THREE.TubeGeometry(curve,36,.023,5,false);const pos=geometry.attributes.position;
  for(let j=0;j<pos.count;j++){const u=Math.floor(j/6)/36;const center=curve.getPointAt(Math.min(1,u));const taper=Math.max(.06,1-u*.92);pos.setXYZ(j,center.x+(pos.getX(j)-center.x)*taper,center.y+(pos.getY(j)-center.y)*taper,center.z+(pos.getZ(j)-center.z)*taper)}geometry.computeVertexNormals();group.add(new THREE.Mesh(geometry,i%5===0?dark:gold));
 }
 group.rotation.set(.1,-.38,-.24);group.position.set(.1,-.1,0);
 scene.add(new THREE.AmbientLight(0xd1b6bc,1.8));const key=new THREE.DirectionalLight(0xffe1ba,5);key.position.set(-3,5,6);scene.add(key);const rim=new THREE.PointLight(0xa36d76,35);rim.position.set(5,1,3);scene.add(rim);
 const resize=()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.render(scene,camera)};new ResizeObserver(resize).observe(container);resize();
 let visible=false;new IntersectionObserver(es=>{visible=es[0].isIntersecting}).observe(container);
 let raf;const animate=t=>{raf=requestAnimationFrame(animate);if(document.hidden||!visible)return;group.position.y=Math.sin(t*.00045)*.08;renderer.render(scene,camera)};raf=requestAnimationFrame(animate);
 if(gsap&&ScrollTrigger)gsap.to(group.rotation,{y:.65,z:.12,x:-.13,ease:'none',scrollTrigger:{trigger:'#sculpture',start:'top bottom',end:'bottom top',scrub:.8}});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);renderer.domElement.hidden=true;container.querySelector('svg').hidden=false});
}
