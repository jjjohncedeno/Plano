if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var camera, cameraControls, scene, renderer;
var group;

var clock = new THREE.Clock();
var cube=null;
var toroide=null;

init();
animate();


function init() {

        // renderer

        renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapType = THREE.PCFShadowMap;

        container = document.getElementById('container');
        container.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
        camera.position.z = 100;

        cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
        cameraControls.target.set(0, 0, 0);
        cameraControls.rotateSpeed = .02
        scene = new THREE.Scene();



        group = new THREE.Object3D();

        plane_figure = new THREE.Group();
        plane_figure.visible = false;

        plane_figure = drawPlane(100,100,0);
        cube = drawCube(10);
    toroide=drawToro(5,1);


        addToScene(initLight(20,20));
        addToScene(initLight(-20,-20));
        addToScene(plane_figure);
        addToScene(drawPlane(100,100,1));
        addToScene(cube);
        addToScene(drawSphere(5));
        addToScene(toroide);
        addToScene(drawOct(5));
        addMenu();
    rotate(cube);
        window.addEventListener( 'resize', onWindowResize, false );

}

function initLight(x,y) {
    var spotLight = new THREE.PointLight( 0xffffff );
    spotLight.position.set( x, y, 100 );

    spotLight.castShadow = true;
    //spotLight.angle=(Math.PI)/3;

    //
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    //
    // spotLight.shadow.camera.near = 500;
    // spotLight.shadow.camera.far = 4000;
    //spotLight.shadow.camera.fov = 10;
    return spotLight;
}

function drawPlane(width,height,face){
    var texture = new THREE.TextureLoader().load( "img/tablero.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    var materials = [new THREE.MeshPhongMaterial({map: texture, side: THREE.FrontSide}),
                 new THREE.MeshPhongMaterial({color: 0x255f00, side: THREE.BackSide})];

    var plane_geometry = new THREE.PlaneGeometry(width,height);
    //var material = new THREE.MeshPhongMaterial({color:0x255f00,side:THREE.DoubleSide});


    var mesh = new THREE.Mesh(plane_geometry,materials[face]);
    //var object = THREE.SceneUtils.createMultiMaterialObject( plane_geometry, materials );
    mesh.receiveShadow = true;
    return mesh;
}

function drawCube(dimension){
    var cube_geometry = new THREE.BoxGeometry(dimension,dimension,dimension);
    var material = new THREE.MeshPhongMaterial({color:0x55aaaa,side:THREE.DoubleSide});
    var mesh = new THREE.Mesh(cube_geometry,material);
    mesh.position.set(-0,-30,10);
    mesh.castShadow = true;
    return mesh;

}

function drawSphere(radius) {
    var sphere_geometry = new THREE.SphereGeometry(radius);
    var material = new THREE.MeshPhongMaterial({color:0xea350e,side:THREE.DoubleSide});
    var mesh = new THREE.Mesh(sphere_geometry,material);
    mesh.position.set(-20,0,30);
    mesh.castShadow = true;
    return mesh;

}

function drawToro(rmenor, rmayor) {
    var toro_geometry = new THREE.TorusGeometry(rmenor, rmayor, 16, 100);
    var material = new THREE.MeshPhongMaterial({color:0xaa55aa,side:THREE.DoubleSide});
    var mesh = new THREE.Mesh(toro_geometry,material);
    mesh.position.set(20,0,40);
    mesh.castShadow = true;
    return mesh;

}

function drawOct(radius) {
    var oct_geometry = new THREE.OctahedronGeometry(radius, 0);
    var material = new THREE.MeshPhongMaterial({color:0x08cd02,side:THREE.DoubleSide});
    var mesh = new THREE.Mesh(oct_geometry,material);
    mesh.position.set(0,20,50);
    mesh.castShadow = true;
    return mesh;

}

function addMenu(){
    var color = new THREE.Color( 0x255f00 );
    var c_white = new THREE.Color( 0xffffff );
    var texture = new THREE.TextureLoader().load( "img/tablero.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    var gui = new dat.GUI(),
        folder = gui.addFolder( "Opciones:" ),
        props = {
            get 'Tablero'() { return renderer.localClippingEnabled; },
            set 'Tablero'( v ) {
                    console.log(plane_figure.material);
                    renderer.localClippingEnabled = v;
                    if ( v ) {
                        plane_figure.material.map = texture;
                        plane_figure.material.color = c_white;
                    }
                    else {
                        plane_figure.material.color = color;
                        plane_figure.material.map = null;
                    };
                },
            
        };
    folder.add( props, 'Tablero' );
    
}


function addToScene(geom){
    scene.add(geom);
}

function rotate(obj,eje,velocidad){
    if(eje=='z')
        obj.rotateZ(velocidad);
    if(eje=='x')
        obj.rotateX(velocidad);
    if(eje=='y')
        obj.rotateY(velocidad);
}

function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        renderer.render(scene, camera);

}

function animate() {

        var delta = clock.getDelta();
        rotate(cube,'z',0.01);
    rotate(toroide,'x',0.02);
        requestAnimationFrame(animate);

        cameraControls.update(delta);

        renderer.render(scene, camera);

}
