const { NodeIO } = require('@gltf-transform/core');
const { KHRMeshQuantization } = require('@gltf-transform/extensions');

async function run() {
    const io = new NodeIO().registerExtensions([KHRMeshQuantization]);
    const doc = await io.read('assets/tripo_rc_car_uncompressed.glb');
    const root = doc.getRoot();
    const meshes = root.listMeshes();
    console.log(`Found ${meshes.length} meshes`);
    for(const mesh of meshes) {
        for(const prim of mesh.listPrimitives()) {
            const position = prim.getAttribute('POSITION');
            if (position) {
                console.log('Min:', position.getMinNormalized([]));
                console.log('Max:', position.getMaxNormalized([]));
            }
        }
    }
}
run().catch(console.error);
