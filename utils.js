function getBoundingBox(obj) {
  return new THREE.Box3().setFromObject(obj);
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