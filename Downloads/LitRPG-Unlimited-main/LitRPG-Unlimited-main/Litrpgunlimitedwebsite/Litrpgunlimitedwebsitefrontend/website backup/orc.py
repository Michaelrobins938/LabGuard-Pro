import bpy

# Create Orc model
bpy.ops.mesh.primitive_ico_sphere_add(radius=1, location=(0, 0, 0))
orc = bpy.context.object
orc.name = "Orc"

# Export as GLTF
bpy.ops.export_scene.gltf(filepath="orc.glb")
