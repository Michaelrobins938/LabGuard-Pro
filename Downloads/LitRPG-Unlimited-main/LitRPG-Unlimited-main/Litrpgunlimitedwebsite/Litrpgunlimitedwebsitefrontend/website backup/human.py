# Create Human model
bpy.ops.mesh.primitive_cylinder_add(radius=1, depth=2, location=(0, 0, 0))
human = bpy.context.object
human.name = "Human"

# Export as GLTF
bpy.ops.export_scene.gltf(filepath="human.glb")