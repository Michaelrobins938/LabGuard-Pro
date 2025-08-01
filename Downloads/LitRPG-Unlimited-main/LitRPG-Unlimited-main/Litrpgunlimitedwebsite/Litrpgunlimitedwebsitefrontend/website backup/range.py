import bpy

# Create Ranger model
bpy.ops.mesh.primitive_cylinder_add(radius=0.75, depth=2, location=(0, 0, 0))
ranger = bpy.context.object
ranger.name = "Ranger"

# Export as GLTF
bpy.ops.export_scene.gltf(filepath="ranger.glb")

