if (!Detector.webgl) Detector.addGetWebGLMessage();

var container;

var camera, cameraControls, scene, renderer;
var group;

var clock = new THREE.Clock();
var plane_figure;
var cube = null;
var toroide = null;
var sphere = null;
var octaedro = null;
var cubeV, sphereV, octaedroV, toroV;
var objetoSelect, objetoParametros;
var gui, guiN, colorN, folderN;
var luz1, luz2;
var time = Date.now();
var isRotate = false;
var radioSphere, radioCube, radioOctaedro, radioToro;

//variables para evento clic
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),
    intersection = new THREE.Vector3(),
    INTERSECTED, SELECTED;
var controls;
var objects = [];
var plane_move = new THREE.Plane();

//Variables para textuas
var textureBarraDiag = new THREE.TextureLoader().load( 'img/barras diagonales.png' );
var textureManchas = new THREE.TextureLoader().load( 'img/manchas.png' );
var flatBarraDiag = new THREE.MeshPhongMaterial( { map: textureBarraDiag, side: THREE.DoubleSide } );
var flatManchas = new THREE.MeshPhongMaterial( { map: textureManchas, side: THREE.DoubleSide } );


var tableroParam = {
    Tablero: true,
    Sombra: true,
    Luz1: true,
    Luz2: true,
    Rotacion: false,
}

var param_texure = {
  Imagen : "Imagen 1"
}

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

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    document.addEventListener('click', clickObject, false);
    camera.position.z = 100;

    cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);
    cameraControls.rotateSpeed = .02
    scene = new THREE.Scene();

    // group = new THREE.Object3D();
    //
    // plane_group = new THREE.Group();
    // plane_group.visible = false;
    group = new THREE.Group();
    plane_figure = drawPlane(100, 100, 0);
    cubeParams = param(-0, -30, 10, "#470e98", 0, 0, 0);
    cube = drawCube(10);
    radioCube = pitagora(cube.position.x, cube.position.y);
    cubeV = new Velocity(0, 0, 0);

    toroParams = param(-0, -30, 10, "#c600e1", 0, 0, 0);
    toroide = drawToro(5, 1);
    radioToro = pitagora(toroide.position.x, toroide.position.y);
    toroV = new Velocity(0, 0, 0);

    sphereParams = param(-0, -30, 10, "#e10034", 0, 0, 0);
    sphere = drawSphere(5);
    radioSphere = pitagora(sphere.position.x, sphere.position.y);
    sphereV = new Velocity(0, 0, 0);

    octaedroParams = param(-0, -30, 10, "#00e14f", 0, 0, 0);
    octaedro = drawOct(5);
    radioOctaedro = pitagora(octaedro.position.x, octaedro.position.y);
    console.log(radioOctaedro)
    octaedroV = new Velocity(0, 0, 0);


    luz1 = initLight(20, 20);
    luz2 = initLight(-20, -20);
    addToScene(luz1);
    addToScene(luz2);


    group.add(plane_figure);
    group.add(cube);
    group.add(sphere);
    group.add(toroide);
    group.add(octaedro);

    // addToScene(plane_figure);
    // addToScene(cube);
    // addToScene(sphere);
    // addToScene(toroide);
    // addToScene(octaedro);
    addToScene(group);

    addMenu();

    // Agregar a objects las figuras
    objects.push(cube);
    objects.push(sphere);
    objects.push(toroide);
    objects.push(octaedro);

    //Evento clic
    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);


    window.addEventListener('resize', onWindowResize, false);

}

function pitagora(x, y) {
    var res;
    var mult = x * x + y * y;
    res = Math.sqrt(mult);
    console.log(res);
    return res;
}

// Funciones para mover
function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    if (SELECTED) {
        if (raycaster.ray.intersectPlane(plane_move, intersection)) {
            SELECTED.position.copy(intersection.sub(offset));
        }
        return;
    }
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            plane_move.setFromNormalAndCoplanarPoint(
                camera.getWorldDirection(plane_move.normal),
                INTERSECTED.position);
        }
        container.style.cursor = 'pointer';
    } else {
        if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
        container.style.cursor = 'auto';
    }
}
function onDocumentMouseDown(event) {
    event.preventDefault();
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        cameraControls.enabled = false;
        SELECTED = intersects[0].object;
        if (raycaster.ray.intersectPlane(plane_move, intersection)) {
            offset.copy(intersection).sub(SELECTED.position);
        }
        container.style.cursor = 'move';
    }
}

function onDocumentMouseUp(event) {
    event.preventDefault();
    cameraControls.enabled = true;
    if (INTERSECTED) {
        SELECTED = null;
    }
    container.style.cursor = 'auto';
    radioChange(sphere);
    radioChange(octaedro);
    radioChange(cube);
    radioChange(toroide);
}

function Velocity(x, y, z) {
    this.vx = x;
    this.vy = y;
    this.vz = z;
}

function initLight(x, y) {
    var spotLight = new THREE.PointLight(0xffffff);
    spotLight.position.set(x, y, 100);
    spotLight.castShadow = true;
    //spotLight.angle=(Math.PI)/3;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    // spotLight.shadow.camera.near = 500;
    // spotLight.shadow.camera.far = 4000;
    //spotLight.shadow.camera.fov = 10;
    return spotLight;
}

function drawPlane(width, height, face) {
    var texture = new THREE.TextureLoader().load("img/tablero.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    var materials = [new THREE.MeshPhongMaterial({map: texture, side: THREE.FrontSide}),
        new THREE.MeshPhongMaterial({color: 0x255f00, side: THREE.BackSide})];

    var plane_geometry = new THREE.PlaneGeometry(width, height);
    //var material = new THREE.MeshPhongMaterial({color:0x255f00,side:THREE.DoubleSide});
    var mesh = new THREE.Mesh(plane_geometry, materials[face]);
    //var object = THREE.SceneUtils.createMultiMaterialObject( plane_geometry, materials );
    mesh.receiveShadow = true;
    return mesh;
}

function drawCube(dimension, params) {
    var cube_geometry = new THREE.BoxGeometry(dimension, dimension, dimension);
    var material = new THREE.MeshPhongMaterial({color: "#470e98", side: THREE.DoubleSide});
    var mesh = new THREE.Mesh(cube_geometry, material);
    mesh.position.set(-0, -3, 10);
    mesh.castShadow = true;
    return mesh;
}

function drawSphere(radius) {
    //creamos el elemento geometrico de la esfera
    var sphere_geometry = new THREE.SphereGeometry(radius);
    var material = new THREE.MeshPhongMaterial({color: "#e10034", side: THREE.DoubleSide});
    var mesh = new THREE.Mesh(sphere_geometry, material);
    //seteamos la posicion del objeto en el espacio coordenado
    mesh.position.set(-20, 0, 30);
    //habilitamos el objeto para que cree la sombra
    // que se proyecte sobre el plano
    mesh.castShadow = true;
    return mesh;
}

function drawToro(rmenor, rmayor) {
    var toro_geometry = new THREE.TorusGeometry(rmenor, rmayor, 16, 100);
    var material = new THREE.MeshPhongMaterial({color: "#c600e1", side: THREE.DoubleSide});
    var mesh = new THREE.Mesh(toro_geometry, material);
    mesh.position.set(20, 0, 40);
    mesh.castShadow = true;
    return mesh;
}

function drawOct(radius) {
    var oct_geometry = new THREE.OctahedronGeometry(radius, 0);
    var material = new THREE.MeshPhongMaterial({color: "#00e14f", side: THREE.DoubleSide});
    var mesh = new THREE.Mesh(oct_geometry, material);
    mesh.position.set(0, 20, 50);
    mesh.castShadow = true;
    return mesh;
}

function addMenu() {

    gui = new dat.GUI();
    guiN = new dat.GUI();
    addMenuFigura(octaedro, "Octaedro", octaedroParams, octaedroV, guiN);
    guiN.visible = false;
    addMenuPlane();

}

function addMenuPlane() {
    var color = new THREE.Color(0x255f00);
    var c_white = new THREE.Color(0xffffff);
    var texture = new THREE.TextureLoader().load("img/tablero.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    var folder = gui.addFolder("Opciones:");

    var textureTablero = folder.add(tableroParam, 'Tablero').listen();
    textureTablero.onChange(function (value) {
        if (value) {
            plane_figure.material.map = texture;
            plane_figure.material.color = c_white;
            plane_figure.material.needsUpdate = true;
        }
        else {
            plane_figure.material.color = color;
            plane_figure.material.map = null;
            plane_figure.material.needsUpdate = true;
        }
        ;
    });

    var reflexionSombra = folder.add(tableroParam, 'Sombra').listen();
    reflexionSombra.onChange(function (value) {
        if (value) {
            plane_figure.receiveShadow = true;
            plane_figure.material.needsUpdate = true;
        }
        else {
            plane_figure.receiveShadow = false;
            plane_figure.material.needsUpdate = true;

        }
        ;

    });

    var luz1menu = folder.add(tableroParam, 'Luz1').listen();
    luz1menu.onChange(function (value) {
        if (value) {
            luz1.visible = true;
        }
        else {
            luz1.visible = false;
        }
        ;

    });

    var luz2menu = folder.add(tableroParam, 'Luz2').listen();
    luz2menu.onChange(function (value) {
        if (value) {
            luz2.visible = true;
        }
        else {
            luz2.visible = false;
        }
        ;
    });

    var rotacion = folder.add(tableroParam, 'Rotacion').listen();
    rotacion.onChange(function (value) {
        if (value) {
            isRotate = true;
        }
        else {
            isRotate = false;
        }
        ;
    });

}

function param(posx, posy, posz, colores, velx, vely, velz) {
    parameters =
    {
        PosicionX: posx, PosicionY: posy, PosicionZ: posz,
        color: colores, // color (change "#" to "0x")
        VelocidadX: velx, VelocidadY: vely, VelocidadZ: velz,
    };
    return parameters;
}
function addMenuFigura(obj, nombre, param, vel, guiA){

  obj = obj;
  parameters = param;
  folderN = guiA.addFolder(nombre);
  var objX = folderN.add( parameters, 'PosicionX' ).min(-38).max(38).step(1).listen();
  var objY = folderN.add( parameters, 'PosicionY' ).min(-38).max(38).step(1).listen();
  var objZ = folderN.add( parameters, 'PosicionZ' ).min(-0).max(60).step(1).listen();

  objX.onChange(function(value)   {   obj.position.x = value; radioChange(obj);  });
  objY.onChange(function(value)  {   obj.position.y = value;  radioChange(obj); });
  objZ.onChange(function(value)   {   obj.position.z = value;   });

  var velZ = folderN.add( parameters, 'VelocidadZ' ).min(0).max(0.2).step(0.01).listen();
  var velX = folderN.add( parameters, 'VelocidadX' ).min(0).max(0.2).step(0.01).listen();
  var velY = folderN.add( parameters, 'VelocidadY' ).min(0).max(0.2).step(0.01).listen();

  velX.onChange(function(value)   {   vel.vx=value;   });
  velY.onChange(function(value)  {   vel.vy=value; });
  velZ.onChange(function(value)   {   vel.vz=value;  });

  var c_white = new THREE.Color( 0xffffff );
  var textura_menu = folderN.add( param_texure, "Imagen", [ "Manchas", "Barras diagonales"] ).name( "Textura" );
  textura_menu.onChange(function(value) {
      if (value == "Manchas") {
        obj.material.map = THREE.ImageUtils.loadTexture( "img/manchas.png" );
        obj.material.needsUpdate = true;
        //obj.material.color = c_white;
      }
      if (value == "Barras diagonales") {
        obj.material.map = textureBarraDiag;
      }
  })

  colorN = guiA.addColor( parameters, 'color' ).name('Color').listen();
  colorN.onChange(function(value) // onFinishChange
  {   obj.material.color.setHex( value.replace("#", "0x") );   });

}

function radioChange(obj) {
    var radio = pitagora(obj.position.x, obj.position.y);
    if (obj.geometry.type == "BoxGeometry") {
        radioCube = radio;
    } else if (obj.geometry.type == "TorusGeometry") {
        radioToro = radio;
    } else if (obj.geometry.type == "SphereGeometry") {
        radioSphere = radio;
    } else if (obj.geometry.type == "OctahedronGeometry") {
        radioOctaedro = radio;
    }
}

function addToScene(geom) {
    scene.add(geom);
}

function rotate(obj, velx, vely, velz) {

    obj.rotateZ(velz);
    obj.rotateX(velx);
    obj.rotateY(vely);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);

}

function clickObject(e) {

    var vector = new THREE.Vector3(( e.clientX / window.innerWidth ) * 2 - 1, -( e.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects([toroide, cube, sphere, octaedro]);

    if (intersects.length > 0) {
        guiN.destroy();
        guiN = new dat.GUI();
        objetoSelect = intersects[0].object;
        console.log(objetoSelect.geometry.type);
        addMenuFigura(objetoSelect, getName(objetoSelect), getParams(objetoSelect), getRota(objetoSelect), guiN);
    }
}

function getName(obj) {
    if (objetoSelect.geometry.type == "BoxGeometry") {
        return "Cubo";
    } else if (objetoSelect.geometry.type == "TorusGeometry") {
        return "Toroide";
    } else if (objetoSelect.geometry.type == "SphereGeometry") {
        return "Esfera";
    } else if (objetoSelect.geometry.type == "OctahedronGeometry") {
        return "Octaedro";
    }
}

function getParams(obj) {
    if (objetoSelect.geometry.type == "BoxGeometry") {
        return cubeParams;
    } else if (objetoSelect.geometry.type == "TorusGeometry") {
        return toroParams;
    } else if (objetoSelect.geometry.type == "SphereGeometry") {
        return sphereParams;
    } else if (objetoSelect.geometry.type == "OctahedronGeometry") {
        return octaedroParams;
    }
}

function getRota(obj) {
    if (objetoSelect.geometry.type == "BoxGeometry") {
        return cubeV;
    } else if (objetoSelect.geometry.type == "TorusGeometry") {
        return toroV;
    } else if (objetoSelect.geometry.type == "SphereGeometry") {
        return sphereV;
    } else if (objetoSelect.geometry.type == "OctahedronGeometry") {
        return octaedroV;
    }
}

function rotateOnEje(objeto, radio) {
    var time = Date.now();
    objeto.position.x = Math.cos(time * 0.001 + 20) * radio;
    objeto.position.y = Math.sin(time * 0.001 + 20) * radio;
}

function animate() {

    var delta = clock.getDelta();
    rotate(cube, cubeV.vx, cubeV.vy, cubeV.vz)
    rotate(toroide, toroV.vx, toroV.vy, toroV.vz)
    rotate(sphere, sphereV.vx, sphereV.vy, sphereV.vz)
    rotate(octaedro, octaedroV.vx, octaedroV.vy, octaedroV.vz)
    if (isRotate) {
        //rotate(group, 0.01, 0, 0);
        rotateOnEje( sphere , radioSphere )
        rotateOnEje( toroide, radioToro )
        rotateOnEje( cube, radioCube )
        rotateOnEje( octaedro, radioOctaedro )
    }

    requestAnimationFrame(animate);

    cameraControls.update(delta);

    renderer.render(scene, camera);

}
