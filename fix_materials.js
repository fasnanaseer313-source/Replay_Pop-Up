const { NodeIO } = require('@gltf-transform/core');
const { KHRMeshQuantization } = require('@gltf-transform/extensions');

async function run() {
    const io = new NodeIO().registerExtensions([KHRMeshQuantization]);
    const doc = await io.read('assets/tripo_rc_car_uncompressed.glb');
    const materials = doc.getRoot().listMaterials();
    for(const mat of materials) {
        console.log(`Material: ${mat.getName()}, AlphaMode: ${mat.getAlphaMode()}, AlphaCutoff: ${mat.getAlphaCutoff()}`);
        
        // Fix alpha mode to OPAQUE if it's not
        if (mat.getAlphaMode() !== 'OPAQUE') {
            console.log(`Fixing alpha mode for ${mat.getName()} to OPAQUE`);
            mat.setAlphaMode('OPAQUE');
        }
    }
    
    await io.write('assets/tripo_rc_car_uncompressed.glb', doc);
    console.log("Material fix complete!");
}
run().catch(console.error);
