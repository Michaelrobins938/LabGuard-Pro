import bpy
# Create Dwarf model
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0, 0, 0))
dwarf = bpy.context.object
dwarf.name = "Dwarf"

# Export as GLTF
bpy.ops.export_scene.gltf(filepath="dwarf.glb")