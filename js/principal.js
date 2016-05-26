if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var camera, cameraControls, scene, renderer;
var group;

var clock = new THREE.Clock();

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

        addToScene(initSpotLight());
        addToScene(drawPlane(100,100));
        addToScene(drawCube(10));
        addToScene(drawSphere(5));
        addToScene(drawToro(5,1));
        addToScene(drawOct(5));

        window.addEventListener( 'resize', onWindowResize, false );

}

function initSpotLight() {
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 0, 100 );

    spotLight.castShadow = true;
    spotLight.angle=(Math.PI)/3;

    //
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    //
    // spotLight.shadow.camera.near = 500;
    // spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 10;
    return spotLight;
}

function drawPlane(width,height){
    var plane_geometry = new THREE.PlaneGeometry(width,height);
    var material = new THREE.MeshPhongMaterial({color:0x255f00,side:THREE.DoubleSide});
    var mesh = new THREE.Mesh(plane_geometry,material);
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


function addToScene(geom){
    scene.add(geom);
}

function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        renderer.render(scene, camera);

}

function animate() {

        var delta = clock.getDelta();

        requestAnimationFrame(animate);

        cameraControls.update(delta);

        renderer.render(scene, camera);

}
