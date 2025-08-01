import bpy

# Create Elf model
bpy.ops.mesh.primitive_cone_add(vertices=10, radius1=1, depth=2, location=(0, 0, 0))
elf = bpy.context.object
elf.name = "Elf"

# Export as GLTF
bpy.ops.export_scene.gltf(filepath="elf.glb")
