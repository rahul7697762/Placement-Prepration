import { Unit } from './types';

export const section2Data: Unit = {
    id: "unit-2",
    title: "Unit II: Camera Geometry & 2-D Projective Geometry",
    description: "Camera models, calibration, 2-D projective geometry, Homography, and applications.",
    topics: [
        {
            id: "camera-geometry",
            title: "Camera Geometry",
            description: "Pinhole cameras, lenses, CCD cameras, projective and affine cameras, and camera calibration.",
            details: `
## Camera Geometry

### 1. Pinhole Camera Model

The **pinhole camera** is the simplest and most fundamental camera model in computer vision.

#### Basic Principle
A pinhole camera consists of:
- A **dark box** with a tiny hole (the pinhole) on one side
- An **image plane** (film/sensor) on the opposite side
- Light rays from a scene point pass through the pinhole and project onto the image plane

#### Perspective Projection
For a 3D world point **P = (X, Y, Z)** and focal length **f**:

**Projection equations:**
- x = f × X / Z
- y = f × Y / Z

This is called **perspective projection** (central projection).

**Key characteristics:**
- Parallel lines in 3D converge to a **vanishing point** in the image
- Objects farther away appear **smaller** (foreshortening)
- The pinhole acts as the **center of projection**

#### Camera Coordinate System
- **Camera center C:** Origin of the camera coordinate system
- **Principal axis:** Line through C perpendicular to the image plane
- **Principal point p:** Intersection of principal axis with image plane
- **Focal length f:** Distance from C to image plane

#### Homogeneous Coordinates Representation

The projection can be written as a matrix equation:

**λ [x, y, 1]ᵀ = P × [X, Y, Z, 1]ᵀ**

where **P = K [R | t]** is the 3×4 camera projection matrix:

- **K:** Intrinsic matrix (camera internal parameters)
- **R:** Rotation matrix (camera orientation)
- **t:** Translation vector (camera position)

**Intrinsic Matrix K:**
\`\`\`
K = | f_x   s   c_x |
    |  0   f_y  c_y |
    |  0    0    1  |
\`\`\`
- f_x, f_y: focal lengths in pixels (x and y directions)
- c_x, c_y: principal point coordinates (optical center)
- s: skew (usually 0 for modern cameras)

---

### 2. Cameras with Lenses

Real cameras use **lenses** to collect more light than a pinhole.

#### Why Lenses?
- Pinhole cameras need tiny holes → very little light → long exposure
- Lenses focus light from multiple rays to a single image point
- Allow shorter exposure times and sharper images

#### Thin Lens Model
For a thin lens with focal length f:

**Lens equation:** 1/f = 1/d_o + 1/d_i

- d_o: object distance (scene to lens)
- d_i: image distance (lens to image plane)
- f: focal length of the lens

#### Depth of Field
Only objects at a specific distance (in focus) are sharp.
- Objects closer or farther are **blurred** (bokeh effect)
- Larger aperture → shallower depth of field
- Smaller aperture → greater depth of field

#### Lens Distortion
Real lenses introduce geometric distortions:

**1. Radial Distortion** (most significant)
- Barrel distortion: Image magnification decreases towards edges (k < 0)
- Pincushion distortion: Image magnification increases towards edges (k > 0)
- **Correction:** x_corrected = x(1 + k₁r² + k₂r⁴ + k₃r⁶)

**2. Tangential Distortion**
- Due to lens not being perfectly parallel to image plane
- **Correction involves p₁, p₂ parameters**

---

### 3. CCD Cameras

**CCD (Charge-Coupled Device)** cameras are the most common type of digital camera.

#### How CCD Works:
1. **Photoelectric effect:** Photons hit silicon and release electrons
2. **Charge accumulation:** Electrons accumulate proportional to light intensity
3. **Charge transfer:** Charges are shifted along CCD rows to readout register
4. **Analog-to-digital conversion:** Charge levels converted to digital values

#### Key Parameters:
- **Resolution:** Number of pixels (e.g., 1920×1080)
- **Pixel size:** Physical size of each pixel (affects sensitivity)
- **Bit depth:** Gray levels (8-bit = 256 levels, 12-bit = 4096 levels)
- **Frame rate:** Images per second
- **Dynamic range:** Ratio of maximum to minimum detectable intensity
- **Quantum efficiency:** Percentage of photons converted to electrons

#### CCD vs CMOS
| Feature | CCD | CMOS |
|---------|-----|------|
| **Power** | High | Low |
| **Speed** | Slower | Faster |
| **Noise** | Lower | Higher |
| **Cost** | Higher | Lower |
| **Rolling Shutter** | No (global) | Common |
| **Integration** | Separate | Integrated circuits |

---

### 4. General Projective Cameras

A **general projective camera** maps 3D points to 2D image points via a 3×4 projection matrix:

**x = P X**  (homogeneous coordinates)

where P has rank 3 and 11 degrees of freedom (up to scale).

#### Camera Matrix Decomposition
P = K [R | t]

**Degrees of freedom:**
- K: 5 (f_x, f_y, c_x, c_y, s)
- R: 3 (rotation — 3 Euler angles)
- t: 3 (translation)
- **Total: 11 DOF**

---

### 5. Affine Cameras

An **affine camera** is a special case where the projection is affine (parallel lines in 3D remain parallel in 2D).

Used when:
- The scene depth variation is small compared to the distance to camera
- Approximation of perspective projection at large distances

**Affine projection matrix form:**
\`\`\`
P = | m₁₁ m₁₂ m₁₃ t₁ |
    | m₂₁ m₂₂ m₂₃ t₂ |
    |  0   0   0   1  |
\`\`\`

Special cases:
- **Orthographic projection:** Object projected along parallel rays perpendicular to image
- **Weak perspective:** Scale factor accounts for average depth
- **Para-perspective:** More accurate approximation of full perspective

---

### 6. Camera Calibration

**Camera calibration** estimates the intrinsic matrix K and distortion coefficients.

#### Calibration Process (Zhang's Method — Most Common)
1. Print a **calibration pattern** (checkerboard) of known dimensions
2. Take **multiple photos** of the pattern at different orientations
3. Detect corner points in each image
4. Use the known 3D coordinates and detected 2D points to estimate:
   - **Intrinsic parameters:** K (focal length, principal point, skew)
   - **Extrinsic parameters:** R, t for each image pose
   - **Distortion coefficients:** k₁, k₂, p₁, p₂

#### Reprojection Error
Measure of calibration quality:
- Project 3D calibration points back to 2D using estimated parameters
- Measure distance to detected 2D points
- **Good calibration:** < 1 pixel reprojection error

#### Why Calibrate?
- Accurate 3D reconstruction
- Undistorting images
- Stereo vision and depth estimation
- Augmented reality (placing virtual objects accurately)
            `,
            codeExample: `
import cv2
import numpy as np

# ========================================
# 1. CAMERA PROJECTION (PINHOLE MODEL)
# ========================================

def project_point(K, R, t, world_point):
    """Project 3D world point to 2D image point."""
    # Extrinsic: transform world to camera coordinates
    cam_point = R @ world_point + t

    # Perspective division
    x = cam_point[0] / cam_point[2]
    y = cam_point[1] / cam_point[2]

    # Apply intrinsics
    px = K[0, 0] * x + K[0, 2]
    py = K[1, 1] * y + K[1, 2]
    return np.array([px, py])

# Example intrinsic matrix
K = np.array([[800,   0, 320],
              [  0, 800, 240],
              [  0,   0,   1]], dtype=np.float64)

# Identity rotation, no translation
R = np.eye(3)
t = np.array([0, 0, 5.0])   # Camera 5m in front

world_pt = np.array([0.5, 0.3, 0.0])
image_pt = project_point(K, R, t, world_pt)
print(f"World point {world_pt} → Image point {image_pt}")

# ========================================
# 2. CAMERA CALIBRATION (ZHANG'S METHOD)
# ========================================

# Prepare object points for 9x6 chessboard
CHECKERBOARD = (9, 6)
objp = np.zeros((CHECKERBOARD[0] * CHECKERBOARD[1], 3), np.float32)
objp[:, :2] = np.mgrid[0:CHECKERBOARD[0],
                        0:CHECKERBOARD[1]].T.reshape(-1, 2)
# Each square is 25mm
objp *= 25.0

objpoints = []   # 3D points in world space
imgpoints = []   # 2D points in image space

import glob
images = glob.glob('calibration_images/*.jpg')

for fname in images:
    img  = cv2.imread(fname)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Find chessboard corners
    ret, corners = cv2.findChessboardCorners(gray, CHECKERBOARD, None)

    if ret:
        objpoints.append(objp)

        # Refine corner locations to sub-pixel accuracy
        criteria = (cv2.TERM_CRITERIA_EPS +
                    cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)
        corners2 = cv2.cornerSubPix(gray, corners, (11, 11),
                                    (-1, -1), criteria)
        imgpoints.append(corners2)

# Calibrate camera
ret, K_cal, dist, rvecs, tvecs = cv2.calibrateCamera(
    objpoints, imgpoints, gray.shape[::-1], None, None)

print("\\nCalibration Results:")
print(f"Reprojection error: {ret:.4f} pixels")
print(f"\\nIntrinsic Matrix K:\\n{K_cal}")
print(f"\\nDistortion Coefficients:\\n{dist}")

# ========================================
# 3. UNDISTORT AN IMAGE
# ========================================

img_distorted = cv2.imread('distorted.jpg')
h, w = img_distorted.shape[:2]

# Get optimal new camera matrix (avoids black borders)
K_new, roi = cv2.getOptimalNewCameraMatrix(K_cal, dist, (w, h), 1, (w, h))

# Method 1: undistort
undistorted = cv2.undistort(img_distorted, K_cal, dist, None, K_new)

# Method 2: remap (more efficient for multiple images)
mapx, mapy = cv2.initUndistortRectifyMap(K_cal, dist, None,
                                          K_new, (w, h), cv2.CV_32FC1)
undistorted2 = cv2.remap(img_distorted, mapx, mapy, cv2.INTER_LINEAR)

# Crop to valid region
x, y, w, h = roi
undistorted = undistorted[y:y+h, x:x+w]

print(f"\\nOriginal size: {img_distorted.shape[:2]}")
print(f"Undistorted size: {undistorted.shape[:2]}")
`
        },
        {
            id: "projective-geometry",
            title: "2-D Projective Geometry & Homography",
            description: "Planar geometry, projective spaces, Homography and its applications.",
            details: `
## 2-D Projective Geometry

### Planar Geometry

**Euclidean Geometry** describes the familiar plane with points, lines, distances, and angles. However, it has limitations for computer vision — parallel lines never meet, and perspective effects cannot be modeled simply.

**Projective Geometry** extends Euclidean geometry by:
- Adding **points at infinity** (where parallel lines meet)
- Allowing more general transformations
- Providing a unified framework for perspective projection

---

### Projective Spaces

#### Homogeneous Coordinates
In 2D projective space **P²**, a point is represented by a **triple (x, y, w)** with (x, y, w) ≠ (0, 0, 0).

The actual Euclidean point is recovered by dividing by w:
- **(x, y, w) → (x/w, y/w)** in Euclidean coordinates

**Key properties:**
- **(x, y, w)** and **(kx, ky, kw)** represent the same point (scale invariant)
- **(x, y, 0)** represents a **point at infinity** (direction, not location)
- Euclidean point (a, b) → Homogeneous (a, b, 1)

#### Lines in Projective Space
A line in P² is represented by **l = (a, b, c)** such that:
- Point **x** lies on line **l** iff **l · x = ax + by + cw = 0**
- Line through two points: **l = x₁ × x₂** (cross product)
- Intersection of two lines: **x = l₁ × l₂** (cross product)
- This **duality** between points and lines is elegant and useful

#### Transformations in P²
**Hierarchy of 2D transformations (from least to most general):**

| Transform | DOF | Preserves |
|-----------|-----|-----------|
| **Euclidean (Isometry)** | 3 | Distances, angles, areas |
| **Similarity** | 4 | Angles, ratios of lengths |
| **Affine** | 6 | Parallelism, ratios of areas |
| **Projective (Homography)** | 8 | Straight lines, cross-ratio |

---

### Homography

A **Homography** (projective transformation) is a mapping between two projective planes:

**x' = H x**

where H is a 3×3 non-singular matrix (defined up to scale, so 8 DOF).

In coordinates:
\`\`\`
[x']     [h₁₁ h₁₂ h₁₃] [x]
[y'] ~ = [h₂₁ h₂₂ h₂₃] [y]
[w']     [h₃₁ h₃₂ h₃₃] [w]
\`\`\`

Then: x_euclidean = x'/w', y_euclidean = y'/w'

#### Properties of Homography
1. **Preserves straight lines** — any line maps to a line
2. **Preserves cross-ratio** — the only projective invariant
3. **Invertible** — H⁻¹ maps back from target to source
4. **Composable** — H₂ ∘ H₁ is also a homography
5. **8 DOF** — need at least **4 point correspondences** to compute H

#### Computing Homography (Direct Linear Transform — DLT)
Given 4+ point correspondences (x_i ↔ x_i'):

Each correspondence gives 2 equations. With 4 points → 8 equations → solve for 8 unknowns of H.

**Setup:** Ah = 0 where A is a 2n×9 matrix and h = vec(H)

**Solution:** h = eigenvector of AᵀA corresponding to smallest eigenvalue (SVD).

**Normalization (recommended):**
- Translate points to centroid
- Scale so mean distance from origin = √2
- Improves numerical conditioning of the linear system

---

### Applications

#### 1. Image Stitching (Panoramas)
**Goal:** Combine multiple overlapping images into a wide panorama.

**Process:**
1. Detect feature points (SIFT/ORB) in overlapping images
2. Match features between pairs of images
3. Estimate Homography H using RANSAC
4. Warp each image to a common plane using H
5. Blend overlapping regions

The Homography is valid because if both images show the same **planar surface** or the camera only **rotates** (no translation), a Homography exactly describes the mapping.

#### 2. Perspective Correction
**Goal:** Remove perspective distortion from a planar object.

**Example:** Scanning a document photographed at an angle.

**Process:**
1. Detect the four corners of the document
2. Define corresponding corners in the rectified output
3. Compute Homography from 4 correspondences
4. Apply warpPerspective to get top-down view

#### 3. Rectification
**Goal:** Transform images so that **epipolar lines become horizontal** (simplifies stereo matching).

**Planar rectification:**
1. Find Fundamental matrix F from point correspondences
2. Compute rectifying homographies H₁, H₂
3. Apply to both images → corresponding points lie on same horizontal scan line
            `,
            codeExample: `
import cv2
import numpy as np

# ========================================
# 1. HOMOGENEOUS COORDINATES
# ========================================

def to_homogeneous(pts):
    """Add homogeneous coordinate (w=1)."""
    return np.hstack([pts, np.ones((len(pts), 1))])

def from_homogeneous(pts_h):
    """Convert from homogeneous to Euclidean."""
    return pts_h[:, :2] / pts_h[:, 2:3]

# Example points
points = np.array([[100, 200], [300, 150], [400, 350], [150, 400]])
pts_h  = to_homogeneous(points)
print("Homogeneous:", pts_h)

# Line through two points using cross product
p1 = np.array([1, 2, 1])
p2 = np.array([4, 3, 1])
line = np.cross(p1, p2)
print(f"Line through {p1} and {p2}: {line}")

# ========================================
# 2. COMPUTING HOMOGRAPHY (DLT)
# ========================================

# Define 4 point correspondences (source → destination)
src_pts = np.float32([[100, 200],
                      [300, 200],
                      [300, 400],
                      [100, 400]])

dst_pts = np.float32([[150, 180],
                      [350, 210],
                      [340, 420],
                      [120, 390]])

# OpenCV computes H using DLT + RANSAC
H, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
print(f"\\nHomography Matrix H:\\n{H}")

# Apply homography to a point manually
pt = np.array([200, 300, 1.0])  # homogeneous
pt_transformed = H @ pt
pt_euclidean = pt_transformed[:2] / pt_transformed[2]
print(f"\\nTransformed point: {pt_euclidean}")

# ========================================
# 3. PERSPECTIVE CORRECTION
# ========================================

img = cv2.imread('document.jpg')
h_img, w_img = img.shape[:2]

# Source: corners of document in the image (detected manually or via CV)
src_corners = np.float32([[50,  80],
                           [420, 60],
                           [440, 580],
                           [30,  600]])

# Destination: rectangle of desired output size
out_w, out_h = 400, 550
dst_corners  = np.float32([[0,    0],
                            [out_w, 0],
                            [out_w, out_h],
                            [0,    out_h]])

# Compute homography and warp
H_rect = cv2.getPerspectiveTransform(src_corners, dst_corners)
rectified = cv2.warpPerspective(img, H_rect, (out_w, out_h))

cv2.imwrite('rectified_document.jpg', rectified)

# ========================================
# 4. IMAGE STITCHING (PANORAMA)
# ========================================

def stitch_images(img1, img2):
    """Stitch two overlapping images using Homography."""
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    # Detect and match features
    sift = cv2.SIFT_create()
    kp1, des1 = sift.detectAndCompute(gray1, None)
    kp2, des2 = sift.detectAndCompute(gray2, None)

    bf     = cv2.BFMatcher()
    matches = bf.knnMatch(des1, des2, k=2)

    # Lowe's ratio test
    good = []
    for m, n in matches:
        if m.distance < 0.75 * n.distance:
            good.append(m)

    print(f"Good matches: {len(good)}")

    if len(good) < 4:
        raise ValueError("Not enough matches for homography")

    # Extract matched point coordinates
    pts1 = np.float32([kp1[m.queryIdx].pt for m in good])
    pts2 = np.float32([kp2[m.trainIdx].pt for m in good])

    # Estimate Homography with RANSAC
    H, mask = cv2.findHomography(pts2, pts1, cv2.RANSAC, 5.0)
    inliers = mask.ravel().sum()
    print(f"RANSAC inliers: {inliers}/{len(good)}")

    # Warp img2 into img1's coordinate frame
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    canvas_w = w1 + w2
    canvas_h = max(h1, h2)

    warped = cv2.warpPerspective(img2, H, (canvas_w, canvas_h))
    warped[:h1, :w1] = img1   # Overlay img1

    return warped

# img_left  = cv2.imread('left.jpg')
# img_right = cv2.imread('right.jpg')
# panorama  = stitch_images(img_left, img_right)
# cv2.imwrite('panorama.jpg', panorama)
`
        }
    ]
};
