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

function getBoundingBox(obj) {
  return new THREE.Box3().setFromObject(obj);
}