const fs = require('fs');
const { NodeIO } = require('@gltf-transform/core');
const { EXTMeshoptCompression } = require('@gltf-transform/extensions');
const { MeshoptDecoder, MeshoptEncoder } = require('meshoptimizer');

async function run() {
    await MeshoptDecoder.ready;
    await MeshoptEncoder.ready;
    
    const io = new NodeIO()
        .registerExtensions([EXTMeshoptCompression])
        .registerDependencies({
            'meshopt.decoder': MeshoptDecoder,
            'meshopt.encoder': MeshoptEncoder,
        });

    const doc = await io.read('assets/tripo_rc_car.glb');
    
    // Remove meshopt compression extension
    const meshoptExtension = doc.createExtension(EXTMeshoptCompression);
    meshoptExtension.dispose(); // This removes it and decompresses the buffers upon write!
    
    await io.write('assets/tripo_rc_car_uncompressed.glb', doc);
    console.log("Decompression complete!");
}

run().catch(console.error);
