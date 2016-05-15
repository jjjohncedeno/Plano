if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var camera, cameraControls, scene, renderer, mesh;
var group;

var clock = new THREE.Clock();

init();
animate();


function init() {

        // renderer

        renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setSize(window.innerWidth, window.innerHeight);

        container = document.getElementById('container');
        container.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
        camera.position.z = 100;

        cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
        cameraControls.target.set(0, 0, 0);

        scene = new THREE.Scene();

        material = new THREE.MeshBasicMaterial({
            color: 'black'
        });

        group = new THREE.Object3D();
        var geometriaCubo = new THREE.CubeGeometry(
            100, // Dimensiones en eje X
            1, // Dimensiones en eje Y
            100 // Dimensiones en eje Z
        );

        //load mesh
        modelLoadedCallback(geometriaCubo, material)

        window.addEventListener( 'resize', onWindowResize, false );

}


function drawSquare(x1, y1, x2, y2) {

  var square = new THREE.Geometry();

  //set 4 points
  square.vertices.push( new THREE.Vector3( x1,y2,0) );
  square.vertices.push( new THREE.Vector3( x1,y1,0) );
  square.vertices.push( new THREE.Vector3( x2,y1,0) );
  square.vertices.push( new THREE.Vector3( x2,y2,0) );

  //push 1 triangle
  square.faces.push( new THREE.Face3( 0,1,2) );

  //push another triangle
  square.faces.push( new THREE.Face3( 0,3,2) );

  //return the square object with BOTH faces
  return square;
}

function modelLoadedCallback(geometry, material) {

        mesh = new THREE.Mesh( geometry, material );
        group.add(mesh);
        scene.add( group );

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
