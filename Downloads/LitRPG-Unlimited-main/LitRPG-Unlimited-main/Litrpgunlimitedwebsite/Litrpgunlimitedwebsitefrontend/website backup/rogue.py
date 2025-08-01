import bpy

# Create Rogue model
bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=1, depth=2, location=(0, 0, 0))
rogue = bpy.context.object
rogue.name = "Rogue"

# Export as GLTF
bpy.ops.export_scene.gltf(filepath="rogue.glb")
