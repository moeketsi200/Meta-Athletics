import bpy
import math

# ==========================================
# META-ATHLETICS — TRIPLE JUMP
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
track_mat = create_glb_material("TripleJump_Track", (0.6, 0.1, 0.1, 1.0), 0.0, 0.8) # Tartan track red
wood_white_mat = create_glb_material("TripleJump_Board", (0.9, 0.9, 0.9, 1.0), 0.0, 0.9)
plasticine_red_mat = create_glb_material("TripleJump_Plasticine", (0.8, 0.1, 0.1, 1.0), 0.1, 0.4)
sand_mat = create_glb_material("TripleJump_Sand", (0.8, 0.7, 0.5, 1.0), 0.0, 1.0)
concrete_mat = create_glb_material("TripleJump_ConcreteBorder", (0.5, 0.5, 0.5, 1.0), 0.0, 0.9)
marker_mat = create_glb_material("TripleJump_Marker", (0.1, 0.1, 0.1, 1.0), 0.0, 0.5)

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
# 1. RUNWAY (40m long, 1.22m wide)
# ==========================================
runway = cube(
    "MetaAthletics_TripleJump_Runway_collider",
    (0, -20, 0.025), # 40m long, goes backwards from Y=0
    (1.22/2, 20, 0.025), # Scale is half-extents
    track_mat
)

# ==========================================
# 2. TAKE-OFF BOARD (13m from the pit for men)
# Let's say origin Y=0 is the take-off board for men
# ==========================================
board = cube(
    "MetaAthletics_TripleJump_Board_collider",
    (0, 0.1, 0.05),
    (1.22/2, 0.1, 0.05),
    wood_white_mat
)

# ==========================================
# 3. PLASTICINE INDICATOR BOARD
# ==========================================
indicator = cube(
    "MetaAthletics_TripleJump_Indicator",
    (0, 0.25, 0.06), 
    (1.22/2, 0.05, 0.06),
    plasticine_red_mat
)

# ==========================================
# 4. WOMEN'S TAKE-OFF BOARD (11m from the pit)
# Placed 2m ahead of the men's board
# ==========================================
board_women = cube(
    "MetaAthletics_TripleJump_WomenBoard_collider",
    (0, 2.1, 0.05),
    (1.22/2, 0.1, 0.05),
    wood_white_mat
)

indicator_women = cube(
    "MetaAthletics_TripleJump_WomenIndicator",
    (0, 2.25, 0.06), 
    (1.22/2, 0.05, 0.06),
    plasticine_red_mat
)

# ==========================================
# 5. SAND PIT (3m wide, 9m long)
# For triple jump, pit starts 13m from the main take-off board
# ==========================================
sand_pit = cube(
    "MetaAthletics_TripleJump_Sand_collider",
    (0, 17.5, 0.04), # Center of the 9m pit starting at Y=13
    (3.0/2, 4.5, 0.04),
    sand_mat
)

# ==========================================
# 6. SAND PIT BORDER
# ==========================================
# Left border
border_l = cube(
    "MetaAthletics_TripleJump_Border_L_collider",
    (-1.55, 17.5, 0.05),
    (0.05, 4.5, 0.05),
    concrete_mat
)

# Right border
border_r = cube(
    "MetaAthletics_TripleJump_Border_R_collider",
    (1.55, 17.5, 0.05),
    (0.05, 4.5, 0.05),
    concrete_mat
)

# Far border
border_f = cube(
    "MetaAthletics_TripleJump_Border_F_collider",
    (0, 22.05, 0.05),
    (1.6, 0.05, 0.05),
    concrete_mat
)

# Near border (facing the runway)
border_n = cube(
    "MetaAthletics_TripleJump_Border_N_collider",
    (0, 12.95, 0.05),
    (1.6, 0.05, 0.05),
    concrete_mat
)

# ==========================================
# 7. SELECT EVERYTHING
# ==========================================
bpy.ops.object.select_all(action='SELECT')
