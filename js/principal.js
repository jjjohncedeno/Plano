if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var camera, cameraControls, scene, renderer, mesh;
var group;

var clock = new THREE.Clock();

init();
animate();


function init() {

        // renderer

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);

        container = document.getElementById('container');
        container.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
        camera.position.z = 100;

        cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
        cameraControls.target.set(0, 0, 0);

        scene = new THREE.Scene();

        var pointLight = new THREE.PointLight(0xFFFFFF);
        pointLight.position.set(100, 250, 100);
        scene.add(pointLight);

        materialPlano = new THREE.MeshPhongMaterial({
            color: 'gray'
        });

        var GeometriaPlano = new THREE.CubeGeometry(100, 1, 100 );
        var Plano = new THREE.Mesh(GeometriaPlano, materialPlano);
        Plano.position.x=0;
        Plano.position.y=0;
        Plano.position.z=0;
        scene.add(Plano);

        materialCubo = new THREE.MeshPhongMaterial({color: 'blue'});
        var GeometriaCubo = new THREE.CubeGeometry(5, 5, 5 );
        var Cubo = new THREE.Mesh(GeometriaCubo, materialCubo);
        Cubo.position.x=-20;
        Cubo.position.y=10;
        Cubo.position.z=-20;
        scene.add(Cubo);

        materialSphere = new THREE.MeshPhongMaterial({color: 'green'});
        var GeometriaSphere = new THREE.SphereGeometry(5, 64, 64);
        var Sphere = new THREE.Mesh(GeometriaSphere, materialSphere);
        Sphere.position.x=20;
        Sphere.position.y=10;
        Sphere.position.z=-20;
        scene.add(Sphere);

          var GeometriaToro = new THREE.TorusGeometry( 5, 1, 16, 100 );
        var materialToro = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
        var torus = new THREE.Mesh( GeometriaToro, materialToro );
        torus.position.x=20;
        torus.position.y=10;
        torus.position.z=20;
        scene.add( torus );


        var GeometriaCono = new THREE.OctahedronGeometry( 5,0 );
        var materialCono = new THREE.MeshPhongMaterial( {color: 0xffff00} );
        var cone = new THREE.Mesh( GeometriaCono, materialCono );
        cone.position.x=-20;
        cone.position.y=10;
        cone.position.z=20;
        scene.add( cone );


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
