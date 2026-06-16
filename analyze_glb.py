import json
import struct
import sys

def parse_glb(filepath):
    with open(filepath, 'rb') as f:
        magic = f.read(4)
        if magic != b'glTF':
            print("Not a GLB file")
            return
        version, = struct.unpack('<I', f.read(4))
        length, = struct.unpack('<I', f.read(4))
        
        chunk0_length, = struct.unpack('<I', f.read(4))
        chunk0_type = f.read(4)
        if chunk0_type != b'JSON':
            print("First chunk is not JSON")
            return
            
        json_data = f.read(chunk0_length).decode('utf-8')
        gltf = json.loads(json_data)
        
        print("GLTF Nodes:", len(gltf.get('nodes', [])))
        print("GLTF Meshes:", len(gltf.get('meshes', [])))
        
        # Accessors contain the min/max for position
        accessors = gltf.get('accessors', [])
        for i, acc in enumerate(accessors):
            if acc.get('type') == 'VEC3' and 'min' in acc and 'max' in acc:
                min_val = acc['min']
                max_val = acc['max']
                center = [(min_val[j] + max_val[j])/2 for j in range(3)]
                print(f"Accessor {i} (possibly Position):")
                print(f"  Min: {min_val}")
                print(f"  Max: {max_val}")
                print(f"  Center: {center}")

parse_glb('assets/car.glb')
