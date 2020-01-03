function debounce(fn, debounceDuration) {
  // summary:
  //      Returns a debounced function that will make sure the given
  //      function is not triggered too much.
  // fn: Function
  //      Function to debounce.
  // debounceDuration: Number
  //      OPTIONAL. The amount of time in milliseconds for which we
  //      will debounce the function. (defaults to 100ms)

  debounceDuration = debounceDuration || 100;

  return function() {
    if (!fn.debouncing) {
      // tslint:disable-next-line: no-any
      const args = Array.prototype.slice.apply(arguments);
      fn.lastReturnVal = fn.apply(this, args);
      fn.debouncing = true;
    }
    clearTimeout(fn.debounceTimeout);
    fn.debounceTimeout = setTimeout(() => {
      fn.debouncing = false;
    }, debounceDuration);

    return fn.lastReturnVal;
  };
}

function getBoundingBox(obj) {
  return new THREE.Box3().setFromObject(obj);
}

function getFileExtension(file) {
    return file.substring(file.lastIndexOf(".") + 1);
}

function getMesh(model) {
  let mesh = null;

  if (model instanceof THREE.Mesh) {
    mesh = model;
  } else if (model) {
    model.traverse(child => {
      if (child instanceof THREE.Mesh && mesh === null) {
        mesh = child;
        return mesh;
      }
    });
  } else if (model && model._bBox) {
    mesh = model._bBox._mesh;
  } else if (model) {
    mesh = model._mesh;
  }

  return mesh;
}

function getCameraStateFromModel(model, zoomFactor, fov) {
  let center;
  let position;
  let sceneDistance;

  if (model) {
    const box = getBoundingBox(model);
    center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();

    sceneDistance =
      (zoomFactor * size) /
      Math.tan((fov * Math.PI) / 180);

    position = new THREE.Vector3();
    position.copy(center);
    position.z += sceneDistance;

    return {
      target: center,
      position: position
    };
  }

  return null;
}

// function getCameraStateFromMesh(mesh, zoomFactor, fov) {
//   let meshCenter;
//   let position;
//   let sceneDistance;

//   if (mesh) {
//     const geom = mesh.geometry;
//     meshCenter = this.getGeometryCenter(geom);
//     sceneDistance =
//       (zoomFactor * geom.boundingSphere.radius) /
//       Math.tan((fov * Math.PI) / 180);

//     position = new THREE.Vector3();
//     position.copy(meshCenter);
//     position.z += sceneDistance;

//     return {
//       target: meshCenter,
//       position: position
//     };
//   }

//   return null;
// }

function getGeometryCenter(geometry) {
  let geom;
  if (geometry instanceof THREE.BufferGeometry) {
    geom = new THREE.Geometry().fromBufferGeometry(geometry);
  } else {
    geom = geometry;
  }
  geom.computeBoundingSphere();
  return geom.boundingSphere.center;
}

function lookToFrustrumSpace(
    object,
    camera,
    worldPosition,
    cameraPosition
  ) {
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const distance = cameraPosition.distanceTo(new THREE.Vector3(0, 0, 0));
    const lookPlane = new THREE.Plane(cameraDirection, distance);

    const frustrumDirection = new THREE.Vector3();
    lookPlane.projectPoint(worldPosition, frustrumDirection);

    object.lookAt(frustrumDirection);
  }

function objectToVector3(vec) {
  const res = new THREE.Vector3();
  res.x = vec.x;
  res.y = vec.y;
  res.z = vec.z;
  return res;
}

function stringifyVec3(vec3) {
  return AFRAME.utils.coordinates.stringify(vec3);
}

function waitOneFrame(func, minFrameMS) {
  window.setTimeout(() => {
    func();
  }, minFrameMS);
}