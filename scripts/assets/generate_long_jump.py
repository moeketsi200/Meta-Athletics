import bpy
import math

# ==========================================
# META-ATHLETICS — LONG JUMP
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
track_mat = create_glb_material("LongJump_Track", (0.6, 0.1, 0.1, 1.0), 0.0, 0.8) # Tartan track red
wood_white_mat = create_glb_material("LongJump_Board", (0.9, 0.9, 0.9, 1.0), 0.0, 0.9)
plasticine_red_mat = create_glb_material("LongJump_Plasticine", (0.8, 0.1, 0.1, 1.0), 0.1, 0.4)
sand_mat = create_glb_material("LongJump_Sand", (0.8, 0.7, 0.5, 1.0), 0.0, 1.0)
concrete_mat = create_glb_material("LongJump_ConcreteBorder", (0.5, 0.5, 0.5, 1.0), 0.0, 0.9)
marker_mat = create_glb_material("LongJump_Marker", (0.1, 0.1, 0.1, 1.0), 0.0, 0.5)

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
# Positioned so that the take-off board is roughly at origin or slightly offset
runway = cube(
    "MetaAthletics_LongJump_Runway_collider",
    (0, -20, 0.025), # 40m long, goes backwards from Y=0
    (1.22/2, 20, 0.025), # Scale is half-extents
    track_mat
)

# ==========================================
# 2. TAKE-OFF BOARD (1.22m wide, 0.20m long)
# ==========================================
board = cube(
    "MetaAthletics_LongJump_Board_collider",
    (0, 0.1, 0.05),
    (1.22/2, 0.1, 0.05),
    wood_white_mat
)

# ==========================================
# 3. PLASTICINE INDICATOR BOARD (1.22m wide, 0.10m long)
# ==========================================
indicator = cube(
    "MetaAthletics_LongJump_Indicator",
    (0, 0.25, 0.06), # Slightly elevated and right after the board
    (1.22/2, 0.05, 0.06),
    plasticine_red_mat
)

# ==========================================
# 4. SAND PIT (3m wide, 9m long)
# ==========================================
# Start of pit is 1-3m from take-off board. Let's make it 2m away (starts at Y=2.2)
# Pit is 9m long. Ends at Y=11.2. Center is 6.7
sand_pit = cube(
    "MetaAthletics_LongJump_Sand_collider",
    (0, 6.7, 0.04),
    (3.0/2, 4.5, 0.04),
    sand_mat
)

# ==========================================
# 5. SAND PIT BORDER
# ==========================================
# Left border
border_l = cube(
    "MetaAthletics_LongJump_Border_L_collider",
    (-1.55, 6.7, 0.05),
    (0.05, 4.5, 0.05),
    concrete_mat
)

# Right border
border_r = cube(
    "MetaAthletics_LongJump_Border_R_collider",
    (1.55, 6.7, 0.05),
    (0.05, 4.5, 0.05),
    concrete_mat
)

# Far border
border_f = cube(
    "MetaAthletics_LongJump_Border_F_collider",
    (0, 11.25, 0.05),
    (1.6, 0.05, 0.05),
    concrete_mat
)

# Near border (facing the runway)
border_n = cube(
    "MetaAthletics_LongJump_Border_N_collider",
    (0, 2.15, 0.05),
    (1.6, 0.05, 0.05),
    concrete_mat
)

# ==========================================
# 6. DISTANCE MARKERS (placed alongside the pit)
# ==========================================
for i in range(5, 10):
    dist_marker = cube(
        f"MetaAthletics_LongJump_Marker_{i}m",
        (1.8, i + 0.1, 0.1), # Offset slightly so 0 is take-off board
        (0.1, 0.1, 0.1),
        marker_mat
    )

# ==========================================
# 7. SELECT EVERYTHING
# ==========================================
bpy.ops.object.select_all(action='SELECT')
