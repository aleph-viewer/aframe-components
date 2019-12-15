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

function getCameraStateFromMesh(mesh, zoomFactor, fov) {
  let meshCenter;
  let position;
  let sceneDistance;

  if (mesh) {
    const geom = mesh.geometry;
    meshCenter = this.getGeometryCenter(geom);
    sceneDistance =
      (zoomFactor * geom.boundingSphere.radius) /
      Math.tan((fov * Math.PI) / 180);

    position = new THREE.Vector3();
    position.copy(meshCenter);
    position.z += sceneDistance;

    return {
      target: meshCenter,
      position: position
    };
  }

  return null;
}

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