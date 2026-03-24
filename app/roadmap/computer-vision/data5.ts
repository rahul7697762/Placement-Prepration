import { Unit } from './types';

export const section5Data: Unit = {
    id: "unit-5",
    title: "Unit V: Color Processing & Range Image Processing",
    description: "Color models, color space conversion, color augmentation, range images, and 3D sensors.",
    topics: [
        {
            id: "color-processing",
            title: "Color Processing",
            description: "Importance of color, color models, color space conversion, augmentation, and color constancy.",
            details: `
## Color Processing

### Importance of Color in Computer Vision

Color provides crucial information that grayscale images cannot:
- **Object recognition:** A banana is yellow, grass is green
- **Scene understanding:** Sky (blue), vegetation (green), road (gray)
- **Medical imaging:** Tissue differentiation, blood detection
- **Segmentation:** Separating objects by color
- **Tracking:** Following a colored object across frames
- **Quality control:** Detecting color defects in manufacturing
- **Face detection:** Skin color provides a useful prior

---

### Color Models

A **color model** defines a coordinate system and a subspace within that system where each color is represented as a single point.

#### 1. RGB (Additive Model)
**Used in:** Displays, cameras, screens

- Primary colors: Red, Green, Blue
- **Additive mixing:** Colors created by adding light
- Each channel: 0–255 (8-bit) → 16.7 million colors total
- **(0,0,0)** = Black, **(255,255,255)** = White
- **Color cube:** 3D unit cube with R, G, B axes

**When to use:** Image capture, display, storage.

#### 2. CMY / CMYK (Subtractive Model)
**Used in:** Printing

- **Cyan, Magenta, Yellow** (+ Black key for CMYK)
- Subtractive: colors formed by absorbing light
- Conversion: C = 1-R, M = 1-G, Y = 1-B (normalized)
- **K** (black) added because mixing CMY gives dark brown, not true black

#### 3. HSV / HSI / HSL
**Used in:** Image processing, user interfaces, color-based segmentation

Separates **chromatic** information from **intensity**:

**HSV (Hue, Saturation, Value):**
- **H (Hue):** Color type, 0–360° (0°=Red, 120°=Green, 240°=Blue)
- **S (Saturation):** Color purity, 0–1 (0=gray, 1=pure color)
- **V (Value):** Brightness, 0–1 (0=black)
- Shape: Inverted cone / hexcone

**HSI (Hue, Saturation, Intensity):**
- **I** = (R + G + B) / 3
- Based on human perception model
- H and S similar to HSV

**Why use HSV for CV?**
- Color detection robust to lighting changes
- Segment a specific color with simple H range threshold
- More intuitive for color specification

**RGB to HSV Conversion:**
\`\`\`
V = max(R, G, B)
S = (V - min(R,G,B)) / V  if V ≠ 0, else 0
H = 60 × (G-B)/(V-min) + 0°    if V = R
    60 × (B-R)/(V-min) + 120°  if V = G
    60 × (R-G)/(V-min) + 240°  if V = B
\`\`\`

#### 4. YCbCr / YUV
**Used in:** Video compression (JPEG, MPEG), TV broadcast

- **Y:** Luminance (brightness)
- **Cb, Cr (or U, V):** Chrominance (color difference) components
- Human eye more sensitive to luminance → can compress Cb/Cr more
- JPEG: 4:2:0 subsampling (half resolution for color)

**Conversion (digital):**
- Y  =  0.299R + 0.587G + 0.114B
- Cb = -0.169R - 0.331G + 0.500B + 128
- Cr =  0.500R - 0.419G - 0.081B + 128

#### 5. LAB (CIE L*a*b*)
**Used in:** Color difference measurement, image editing

- **L*:** Lightness (0=black, 100=white)
- **a*:** Green to Red axis
- **b*:** Blue to Yellow axis
- **Perceptually uniform:** Euclidean distance in L*a*b* ≈ perceived color difference
- Good for color comparison and correction

---

### Conversion Between Color Spaces

Key conversions and their uses:

| From → To | When to use |
|-----------|-------------|
| RGB → HSV | Color-based segmentation, tracking |
| RGB → Gray | Reducing complexity, edge detection |
| RGB → YCbCr | Video compression, face detection |
| RGB → LAB | Accurate color matching, white balance |
| BGR → RGB | OpenCV (BGR) to display (RGB) |

---

### Color Augmentation Techniques

**Color augmentation** artificially increases training data diversity for deep learning:

**1. Brightness adjustment**
- Multiply V channel (HSV) or all RGB by a random factor
- Simulates different lighting conditions

**2. Contrast adjustment**
- Adjust spread of intensity values
- Simulates different camera settings

**3. Saturation adjustment**
- Multiply S channel (HSV) by a random factor
- More/less vivid colors

**4. Hue shift**
- Add a random offset to H channel (HSV)
- Simulates color cast

**5. Color jitter**
- Random combination of brightness + contrast + saturation + hue
- Standard augmentation in PyTorch: \`transforms.ColorJitter()\`

**6. Random grayscale**
- Convert to grayscale with some probability
- Forces model to be robust without color cues

**7. Channel shuffling**
- Randomly permute R, G, B channels
- Useful for multi-spectral data

---

### Color Constancy

**Problem:** The perceived color of an object changes under different illumination (a white paper looks orange under tungsten light).

**Goal:** Recover the true surface color independent of the light source.

#### Gray World Assumption
- Assumes the average color of a scene is gray
- **Estimate illuminant:** l = (mean_R, mean_G, mean_B)
- **Correct:** R_corrected = R × (mean_G / mean_R), etc.
- Simple but fails for scenes with dominant single colors

#### White Patch / Max-RGB
- Assumes the brightest pixel in each channel reflects the illuminant
- **Estimate:** (R_max, G_max, B_max)
- **Correct:** Normalize each channel by its max

#### Retinex
- Based on Land's Retinex theory: human visual system separates reflectance from illumination
- **MSRCR (Multi-Scale Retinex with Color Restoration):** Estimates illumination at multiple scales and removes it
- Used in: Low-light enhancement, haze removal

#### Learning-Based Methods
- Deep learning models trained to predict the illuminant
- Much more accurate on complex real-world scenes
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt

img_bgr = cv2.imread('image.jpg')
img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

# ========================================
# 1. COLOR SPACE CONVERSIONS
# ========================================

# RGB to HSV
img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
h, s, v = cv2.split(img_hsv)

# RGB to LAB
img_lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
L, a, b = cv2.split(img_lab)

# RGB to YCbCr
img_ycbcr = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2YCrCb)
Y, Cr, Cb = cv2.split(img_ycbcr)

# RGB to Grayscale
img_gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

print("HSV range — H:", h.min(), h.max(),
      "S:", s.min(), s.max(), "V:", v.min(), v.max())

# ========================================
# 2. COLOR-BASED SEGMENTATION (HSV)
# ========================================

def segment_color(img_bgr, lower_hsv, upper_hsv):
    """Segment a specific color range using HSV."""
    hsv  = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, lower_hsv, upper_hsv)
    # Morphological cleanup
    kernel  = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask    = cv2.morphologyEx(mask, cv2.MORPH_OPEN,  kernel)
    mask    = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    result  = cv2.bitwise_and(img_bgr, img_bgr, mask=mask)
    return mask, result

# Segment red objects (two hue ranges due to hue wrap-around)
lower_red1, upper_red1 = np.array([0,   80, 50]), np.array([10,  255, 255])
lower_red2, upper_red2 = np.array([170, 80, 50]), np.array([180, 255, 255])
mask1, _ = segment_color(img_bgr, lower_red1, upper_red1)
mask2, _ = segment_color(img_bgr, lower_red2, upper_red2)
red_mask  = cv2.bitwise_or(mask1, mask2)

# Segment green objects
lower_green = np.array([35,  50, 50])
upper_green = np.array([85, 255, 255])
green_mask, green_result = segment_color(img_bgr, lower_green, upper_green)

# ========================================
# 3. COLOR AUGMENTATION
# ========================================

def color_jitter(img_bgr, brightness=0.3, contrast=0.3,
                 saturation=0.3, hue=0.1):
    """Apply random color jitter augmentation."""
    img = img_bgr.copy().astype(np.float32) / 255.0

    # Brightness
    factor = 1 + np.random.uniform(-brightness, brightness)
    img    = np.clip(img * factor, 0, 1)

    # Contrast
    factor = 1 + np.random.uniform(-contrast, contrast)
    mean   = img.mean()
    img    = np.clip((img - mean) * factor + mean, 0, 1)

    img_uint8 = (img * 255).astype(np.uint8)
    img_hsv   = cv2.cvtColor(img_uint8, cv2.COLOR_BGR2HSV).astype(np.float32)

    # Saturation
    factor            = 1 + np.random.uniform(-saturation, saturation)
    img_hsv[:, :, 1] = np.clip(img_hsv[:, :, 1] * factor, 0, 255)

    # Hue shift
    shift            = np.random.uniform(-hue * 180, hue * 180)
    img_hsv[:, :, 0] = (img_hsv[:, :, 0] + shift) % 180

    return cv2.cvtColor(img_hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

augmented = color_jitter(img_bgr)

# ========================================
# 4. COLOR CONSTANCY (GRAY WORLD)
# ========================================

def gray_world_correction(img_bgr):
    """Apply Gray World color constancy correction."""
    img_f   = img_bgr.astype(np.float32)
    mean_b  = img_f[:, :, 0].mean()
    mean_g  = img_f[:, :, 1].mean()
    mean_r  = img_f[:, :, 2].mean()
    overall = (mean_b + mean_g + mean_r) / 3.0

    img_corrected        = img_f.copy()
    img_corrected[:,:,0] = np.clip(img_f[:,:,0] * (overall / mean_b), 0, 255)
    img_corrected[:,:,1] = np.clip(img_f[:,:,1] * (overall / mean_g), 0, 255)
    img_corrected[:,:,2] = np.clip(img_f[:,:,2] * (overall / mean_r), 0, 255)

    return img_corrected.astype(np.uint8)

def white_patch_correction(img_bgr):
    """Apply White Patch (Max-RGB) color constancy correction."""
    img_f    = img_bgr.astype(np.float32)
    max_b    = img_f[:, :, 0].max()
    max_g    = img_f[:, :, 1].max()
    max_r    = img_f[:, :, 2].max()

    img_corrected        = img_f.copy()
    img_corrected[:,:,0] = np.clip(img_f[:,:,0] * (255.0 / max_b), 0, 255)
    img_corrected[:,:,1] = np.clip(img_f[:,:,1] * (255.0 / max_g), 0, 255)
    img_corrected[:,:,2] = np.clip(img_f[:,:,2] * (255.0 / max_r), 0, 255)

    return img_corrected.astype(np.uint8)

corrected_gw = gray_world_correction(img_bgr)
corrected_wp = white_patch_correction(img_bgr)

# ========================================
# 5. SKIN DETECTION (COLOR-BASED)
# ========================================

def detect_skin(img_bgr):
    """Detect skin regions using YCbCr color space."""
    img_ycbcr = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2YCrCb)
    # Skin color range in YCbCr
    lower = np.array([0,  133, 77],  dtype=np.uint8)
    upper = np.array([255, 173, 127], dtype=np.uint8)
    mask  = cv2.inRange(img_ycbcr, lower, upper)
    return mask

skin_mask   = detect_skin(img_bgr)
skin_region = cv2.bitwise_and(img_bgr, img_bgr, mask=skin_mask)
`
        },
        {
            id: "range-image-processing",
            title: "Range Image Processing",
            description: "Range images, 2D vs 3D images, active sensors, preprocessing, and applications.",
            details: `
## Range Image Processing

### Introduction to Range Images

A **range image** (also called depth image or 2.5D image) stores the **distance from the sensor to the surface** at each pixel, rather than intensity or color.

**Types of data representation:**
- **f(x, y) = depth** — 2D grid of depth values (range image)
- **Point cloud** — unordered set of 3D points (X, Y, Z)
- **Mesh** — 3D surface with vertices and faces

---

### Difference Between 2D Intensity Images and 3D Range Images

| Feature | 2D Intensity Image | 3D Range Image |
|---------|-------------------|----------------|
| **Stored value** | Light intensity (brightness) | Distance to surface |
| **Data type** | uint8 (0–255) | float32 (meters) |
| **Information** | Appearance (texture, color) | Geometry (shape, depth) |
| **Affected by** | Lighting, shadow, reflectance | Object geometry, sensor range |
| **Typical format** | JPEG, PNG | PLY, PCD, numpy array |
| **Visualization** | Direct display | Pseudocolor, point cloud rendering |
| **Missing data** | Rare (except occlusions) | Common (transparent, shiny surfaces) |

**2D images** capture **what** things look like. **3D range images** capture **where** things are.

---

### Active Range Sensors

**Active sensors** project their own energy (light, sound) and measure the return signal. They don't rely on ambient light.

#### 1. Structured Light
- Projects known **pattern** (stripes, grid, random dots) onto the scene
- Camera captures the **deformed pattern**
- Depth computed from deformation using triangulation
- **Examples:** Intel RealSense D435, Microsoft Kinect v1
- **Pros:** Dense depth map, works in dark
- **Cons:** Affected by sunlight, poor on shiny/transparent surfaces

#### 2. Time-of-Flight (ToF) Camera
- Emits **modulated light** and measures the **phase shift** of returning signal
- Depth = (phase shift × c) / (4π × f_mod)
- **Examples:** Microsoft Kinect v2, PMD CamBoard
- **Pros:** Fast (real-time), works in dark
- **Cons:** Limited range, multi-path errors

#### 3. LiDAR (Light Detection and Ranging)
- Emits **laser pulses** and measures time for reflection to return
- **Depth = (time × c) / 2**
- Rotating mirror scans a wide field of view
- **Examples:** Velodyne HDL-64E (autonomous vehicles)
- **Pros:** High accuracy, long range (100m+), outdoor use
- **Cons:** Expensive, lower density than cameras, not good at texture

#### 4. Stereo Vision (Passive but provides range)
- Two cameras capture images simultaneously
- Depth estimated from **disparity** between matched points
- Depth Z = f × B / d (f=focal length, B=baseline, d=disparity)
- **Pros:** Low cost, provides both color and depth
- **Cons:** Fails on untextured surfaces, computationally expensive

#### 5. Ultrasonic / Sonar
- Emits **sound waves** and measures time-of-flight
- Used in robotics for obstacle detection
- Low resolution, short range
- Unaffected by lighting, transparent objects

---

### Preprocessing of Range Data

Raw range data often requires extensive preprocessing:

#### 1. Noise Removal
- Range sensors have measurement noise (especially ToF and stereo)
- **Statistical outlier removal:** Remove points far from neighborhood mean
- **Radius outlier removal:** Remove isolated points with few neighbors
- **Bilateral filter on depth:** Smooth while preserving edges

#### 2. Hole Filling (Missing Data)
- Transparent/shiny surfaces absorb laser → no return → holes
- **Methods:**
  - Inpainting (copy surrounding values)
  - Bilateral filter across holes
  - Learning-based depth completion

#### 3. Normal Estimation
- Surface normals are needed for many algorithms
- For each point, fit a plane to its k nearest neighbors
- Normal = plane normal (eigenvector with smallest eigenvalue)
- **OpenCV/PCL:** \`cv2.createNormalEstimator()\`, \`pcl.NormalEstimation\`

#### 4. Downsampling
- LiDAR point clouds can have millions of points
- **Voxel grid filter:** Divide space into voxels, keep centroid per voxel
- Reduces data size while preserving geometry

#### 5. Registration (ICP — Iterative Closest Point)
- Aligning two overlapping point clouds
- **ICP algorithm:**
  1. Find closest point correspondences
  2. Compute optimal R, t minimizing sum of distances
  3. Apply R, t, repeat until convergence
- Used in: 3D SLAM, scene reconstruction, object alignment

---

### Applications of Range Data

**1. Autonomous Driving**
- LiDAR point clouds for obstacle detection and avoidance
- 3D object detection (vehicles, pedestrians, cyclists)
- HD map creation and localization

**2. Robotics**
- Robot arm grasping: detecting object pose from depth
- Navigation and obstacle avoidance
- Simultaneous Localization and Mapping (SLAM)

**3. Medical Imaging / Surgery**
- 3D reconstruction of patient anatomy
- Surgical robot guidance
- Wound measurement

**4. Industrial Inspection**
- Quality control: measuring dimensions, detecting defects
- Part alignment and pick-and-place

**5. Architecture and Construction**
- 3D scanning of buildings (BIM — Building Information Modeling)
- Heritage preservation scanning

**6. Gesture Recognition & AR**
- Depth data enables hand tracking (Microsoft Kinect)
- Augmented reality (placing virtual objects in correct depth)

**7. Agriculture**
- Crop height measurement
- Fruit detection and yield estimation
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt

# ========================================
# 1. LOADING AND VISUALIZING DEPTH DATA
# ========================================

# Load a depth image (16-bit PNG is common for depth)
depth_raw = cv2.imread('depth.png', cv2.IMREAD_UNCHANGED)

# Convert to meters (e.g., Kinect stores depth in mm)
depth_m = depth_raw.astype(np.float32) / 1000.0

print(f"Depth range: {depth_m[depth_m>0].min():.2f}m "
      f"to {depth_m[depth_m>0].max():.2f}m")

# Visualize with colormap
depth_vis = depth_m.copy()
depth_vis[depth_vis == 0] = depth_vis.max()  # Mark invalid as far
depth_norm = cv2.normalize(depth_vis, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
depth_color = cv2.applyColorMap(depth_norm, cv2.COLORMAP_JET)
cv2.imwrite('depth_colored.png', depth_color)

# ========================================
# 2. DEPTH TO POINT CLOUD
# ========================================

def depth_to_pointcloud(depth_m, K):
    """Convert depth image to 3D point cloud using camera intrinsics."""
    h, w    = depth_m.shape
    fx, fy  = K[0, 0], K[1, 1]
    cx, cy  = K[0, 2], K[1, 2]

    # Create pixel coordinate grids
    u = np.arange(w)
    v = np.arange(h)
    uu, vv = np.meshgrid(u, v)

    # Back-project to 3D
    Z = depth_m
    X = (uu - cx) * Z / fx
    Y = (vv - cy) * Z / fy

    # Stack into Nx3 array, removing invalid points
    points = np.stack([X, Y, Z], axis=-1).reshape(-1, 3)
    valid  = points[:, 2] > 0
    return points[valid]

K = np.array([[525.0,   0, 319.5],
              [  0,   525.0, 239.5],
              [  0,     0,    1.0]])

points = depth_to_pointcloud(depth_m, K)
print(f"Point cloud: {len(points)} points")

# ========================================
# 3. DEPTH PREPROCESSING
# ========================================

def fill_depth_holes(depth, max_hole_size=50):
    """Fill small holes in depth map using inpainting."""
    mask = (depth == 0).astype(np.uint8)
    # Only fill small holes
    kernel  = np.ones((max_hole_size, max_hole_size), np.uint8)
    large   = cv2.dilate(mask, kernel)
    small_mask = mask & (~large)
    depth_f = depth.astype(np.float32)
    depth_f[small_mask == 0] = 0  # Only inpaint small holes
    filled  = cv2.inpaint(depth_f, small_mask, 3, cv2.INPAINT_NS)
    return filled

def smooth_depth(depth_m, sigma_spatial=3.0, sigma_range=0.1):
    """Apply bilateral filter to depth map (preserves edges)."""
    depth_mm = (depth_m * 1000).astype(np.float32)
    smoothed = cv2.bilateralFilter(depth_mm,
                                   d=9,
                                   sigmaColor=sigma_range * 1000,
                                   sigmaSpace=sigma_spatial)
    return smoothed / 1000.0

def statistical_outlier_removal(points, k=20, std_ratio=2.0):
    """Remove statistical outliers from point cloud."""
    from scipy.spatial import cKDTree
    tree      = cKDTree(points)
    dists, _  = tree.query(points, k=k + 1)
    mean_dist = dists[:, 1:].mean(axis=1)
    threshold = mean_dist.mean() + std_ratio * mean_dist.std()
    mask      = mean_dist < threshold
    return points[mask]

depth_filled   = fill_depth_holes(depth_m)
depth_smoothed = smooth_depth(depth_m)

# ========================================
# 4. NORMAL ESTIMATION FROM DEPTH
# ========================================

def estimate_normals(depth_m, K):
    """Estimate surface normals from a depth image."""
    fx, fy = K[0, 0], K[1, 1]
    cx, cy = K[0, 2], K[1, 2]

    h, w = depth_m.shape
    dzdx = np.gradient(depth_m, axis=1)   # Depth gradient in x
    dzdy = np.gradient(depth_m, axis=0)   # Depth gradient in y

    # Surface tangent vectors
    u  = np.zeros((h, w, 3))
    v_ = np.zeros((h, w, 3))
    u[..., 0]  = 1.0 / fx
    u[..., 2]  = dzdx
    v_[..., 1] = 1.0 / fy
    v_[..., 2] = dzdy

    # Normal = u × v
    normals = np.cross(u, v_)
    # Normalize
    norms   = np.linalg.norm(normals, axis=2, keepdims=True)
    normals = normals / (norms + 1e-8)

    # Visualize: map normals to [0, 255] RGB
    normal_vis = ((normals + 1) / 2 * 255).astype(np.uint8)
    return normals, normal_vis

normals, normal_vis = estimate_normals(depth_smoothed, K)
cv2.imwrite('surface_normals.png', normal_vis)

# ========================================
# 5. DISPARITY TO DEPTH (STEREO)
# ========================================

def disparity_to_depth(disparity, focal_length, baseline):
    """Convert disparity map to depth map."""
    # Avoid division by zero
    depth = np.where(disparity > 0,
                     focal_length * baseline / disparity,
                     0)
    return depth

# Example: f=800px, B=0.12m
disparity = cv2.imread('disparity.png', cv2.IMREAD_UNCHANGED).astype(np.float32)
depth_from_stereo = disparity_to_depth(disparity, focal_length=800, baseline=0.12)
print(f"Stereo depth range: "
      f"{depth_from_stereo[depth_from_stereo>0].min():.2f}m to "
      f"{depth_from_stereo[depth_from_stereo>0].max():.2f}m")
`
        }
    ]
};
