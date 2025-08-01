import bpy

# Create Mage model
bpy.ops.mesh.primitive_torus_add(major_radius=1, minor_radius=0.25, location=(0, 0, 0))
mage = bpy.context.object
mage.name = "Mage"

# Export as GLTF
bpy.ops.export_scene.gltf(filepath="mage.glb")