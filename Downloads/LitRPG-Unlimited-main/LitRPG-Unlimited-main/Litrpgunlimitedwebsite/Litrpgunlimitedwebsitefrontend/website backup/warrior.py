import bpy

# Create Warrior model
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
warrior = bpy.context.object
warrior.name = "Warrior"

# Export as GLTF
bpy.ops.export_scene.gltf(filepath="warrior.glb")
