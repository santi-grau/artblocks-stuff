// Artblocks suggested prng
class Rand{constructor(){this.ua=false;let sfc32=function(u){let a=parseInt(u.substr(0,8),16);let b=parseInt(u.substr(8,8),16);let c=parseInt(u.substr(16,8),16);let d=parseInt(u.substr(24,8),16);return()=>{a|=0;b|=0;c|=0;d|=0;let t=(((a+b)|0)+d)|0;d=(d+1)|0;a=b^(b>>>9);b=(c+(c<<3))|0;c=(c<<21)|(c>>>11);c=(c+t)|0;return (t>>>0)/4294967296;};};this.pa=new sfc32(tokenData.hash.substr(2,32));this.pb=new sfc32(tokenData.hash.substr(34,32));for(let i=0;i<1e6;i+=2){this.pa();this.pb();}};rnd(){this.ua=!this.ua;return this.ua?this.pa():this.pb();}};
// Secondary prng
let mb=(a)=>{let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}

// Basic script
class Main{
    constructor(){
        this.node = document.body;
        this.renderer = new THREE.WebGLRenderer( { antialias : true } );
        this.renderer.setPixelRatio( Math.max( 1, window.devicePixelRatio || 1 ) );
        this.node.appendChild( this.renderer.domElement );
        this.camera = new THREE.OrthographicCamera();
        this.scene = new THREE.Scene();
        
        let r = new Rand().rnd()
        let geometry = new THREE.TorusKnotGeometry( 1, 0.3, 120, 40 );
        let material = new THREE.MeshPhongMaterial( { color : 0xffffff, wireframe : (r>0.5) } );
        this.scene.add( new THREE.Mesh( geometry, material ) );
        
        let color1 = new THREE.Color( "hsl(" + mb( r * 1000 ) * 360 + ", 100%, 50%)" )
        let color2 = new THREE.Color( "hsl(" + ( mb( r * 1000 ) * 360 + 80 )  + ", 100%, 50%)" )
        
        this.scene.add( new THREE.HemisphereLight( color1, color2, 1 ) );
        
        window.addEventListener('resize', () => this.resize() );
        this.resize();
        this.raf=requestAnimationFrame(()=>this.step());
    };
    resize(){
        let [ w, h ] = [ window.innerWidth, window.innerHeight ];
        this.renderer.setSize( w, h );
        Object.assign( this.camera, { left : w / -2, right : w / 2, top : h / 2, bottom : h / -2 } );
        let scale = Math.min( w, h ) * 0.2
        
        this.camera.position.z = scale * 2;
        this.camera.updateProjectionMatrix();

        this.scene.children[ 0 ].scale.set( scale, scale, scale )
    }
    
    step(){
        this.raf = requestAnimationFrame( () => this.step( ) );
        this.scene.children[ 0 ].rotation.x += 0.01
        this.renderer.render( this.scene, this.camera )
    };
    
};

// initialize
window.onload = () => new Main();