AFRAME.registerComponent('al-env-map', {
  multiple: true,

  schema: {
    path: {default: ''},
    hdr: {default: ''},
    enableBackground: {default: false}
  },

  init: function () {
    const data = this.data;

    var pmremGenerator = new THREE.PMREMGenerator(this.el.sceneEl.renderer);
				pmremGenerator.compileEquirectangularShader();

    new THREE.RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .setPath(data.path)
      .load(data.hdr, function (texture) {

        var envMap = pmremGenerator.fromEquirectangular(texture).texture;

        if (data.enableBackground) {
          this.setBackground(envMap);
        }
        
        this.setEnvironment(envMap);

        texture.dispose();
        pmremGenerator.dispose();

        //render();

        // model

        // use of RoughnessMipmapper is optional
        // var roughnessMipmapper = new RoughnessMipmapper( renderer );

        // var loader = new GLTFLoader().setPath( 'models/gltf/DamagedHelmet/glTF/' );
        // loader.load( 'white-claw-can.glb', function ( gltf ) {

        //   gltf.scene.traverse( function ( child ) {

        //     if ( child.isMesh ) {

        //       roughnessMipmapper.generateMipmaps( child.material );

        //     }

        //   } );

        //   scene.add( gltf.scene );

        //   roughnessMipmapper.dispose();

        //   render();

        // });
    });
  },

  remove: function () {
    this.setEnvironment(null);
    if (data.enableBackground) this.setBackground(null);
  },

  setEnvironment: function (texture) {
    this.el.sceneEl.object3D.environment = texture;
  },

  setBackground: function (texture) {
    this.el.sceneEl.object3D.background = texture;
  }
});