export default AFRAME.registerComponent("al-billboard", {
  schema: {
    controlsType: { type: "string", default: ControlsType.ORBIT },
    cameraPosition: { type: "string" },
    worldPosition: { type: "string" },
    cameraTarget: { type: "string", default: "0 0 0" },
    minFrameMS: { type: "number", default: 15 }
  },

  init() {
    this.bindMethods();
    this.addEventListeners();
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      this.data.minFrameMS,
      this
    );
  },

  bindMethods() {},

  addEventListeners() {},

  removeEventListeners() {},

  tickFunction() {
    const camera = this.el.sceneEl.camera;
    const object = this.el.object3D;
    const worldPosition = AFRAME.utils.coordinates.parse(this.data.worldPosition);
    const cameraPosition = AFRAME.utils.coordinates.parse(this.data.cameraPosition);

    ThreeUtils.lookToFrustrumSpace(
      object,
      camera,
      worldPosition,
      cameraPosition
    );
    object.up.copy(this.el.sceneEl.camera.up);
  },

  tick() {
    this.tickFunction();
  },

  remove() {
    this.removeEventListeners();
  }
});