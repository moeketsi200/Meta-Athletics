import bpy

# ==========================================
# META-ATHLETICS — STARTING BLOCKS
# ==========================================

# ------------------------------------------
# Clear scene
# ------------------------------------------
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# ------------------------------------------
# GLB-Ready Material Helper
# ------------------------------------------
def create_glb_material(name, color, metallic, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Roughness"].default_value = roughness
        
    return mat

# ------------------------------------------
# Materials
# ------------------------------------------
metal_frame_mat = create_glb_material("StartingBlocks_Frame", (0.3, 0.3, 0.35, 1.0), 0.8, 0.3)
pad_mat = create_glb_material("StartingBlocks_Pads", (0.1, 0.1, 0.1, 1.0), 0.1, 0.7) # Rubber pads

# ------------------------------------------
# Object Helpers
# ------------------------------------------
def cube(name, location, scale, material):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    obj.rotation_euler = (0, 0, 0)
    return obj

# ==========================================
# 1. MAIN CENTER RAIL
# ==========================================
# Standard rail is about 0.8m - 1m long
rail = cube(
    "MetaAthletics_StartingBlocks_Rail",
    (0, 0, 0.02),
    (0.04, 0.45, 0.02),
    metal_frame_mat
)

# ==========================================
# 2. FRONT T-BAR / GROUND SUPPORT
# ==========================================
front_support = cube(
    "MetaAthletics_StartingBlocks_FrontSupport",
    (0, 0.45, 0.015),
    (0.15, 0.02, 0.015),
    metal_frame_mat
)

# ==========================================
# 3. REAR GROUND SUPPORT
# ==========================================
rear_support = cube(
    "MetaAthletics_StartingBlocks_RearSupport",
    (0, -0.45, 0.015),
    (0.15, 0.02, 0.015),
    metal_frame_mat
)

# ==========================================
# 4. LEFT FOOT PEDAL
# ==========================================
# Placed forward
pedal_l_base = cube(
    "MetaAthletics_StartingBlocks_Pedal_L_Base",
    (-0.1, 0.15, 0.06),
    (0.06, 0.02, 0.05),
    metal_frame_mat
)

pedal_l_pad = cube(
    "MetaAthletics_StartingBlocks_Pedal_L_Pad",
    (-0.1, 0.17, 0.06),
    (0.06, 0.01, 0.06),
    pad_mat
)
# Tilt the pad backwards
pedal_l_pad.rotation_euler = (-0.785, 0, 0) # roughly -45 degrees
bpy.context.view_layer.objects.active = pedal_l_pad
bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)


# ==========================================
# 5. RIGHT FOOT PEDAL
# ==========================================
# Placed further back
pedal_r_base = cube(
    "MetaAthletics_StartingBlocks_Pedal_R_Base",
    (0.1, -0.15, 0.06),
    (0.06, 0.02, 0.05),
    metal_frame_mat
)

pedal_r_pad = cube(
    "MetaAthletics_StartingBlocks_Pedal_R_Pad",
    (0.1, -0.13, 0.06),
    (0.06, 0.01, 0.06),
    pad_mat
)
# Tilt the pad backwards
pedal_r_pad.rotation_euler = (-0.785, 0, 0) # roughly -45 degrees
bpy.context.view_layer.objects.active = pedal_r_pad
bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)

# ==========================================
# 6. SELECT EVERYTHING
# ==========================================
bpy.ops.object.select_all(action='SELECT')
