import { Unit } from './types';

export const section3Data: Unit = {
    id: "unit-3",
    title: "Unit III: Stereo Geometry & 3D Reconstruction",
    description: "Epipolar geometry, fundamental matrix, camera motion, optical flow, and 3D reconstruction.",
    topics: [
        {
            id: "stereo-geometry",
            title: "Stereo Geometry & Epipolar Geometry",
            description: "Epipolar constraint, fundamental matrix, and algorithms for stereo calibration.",
            details: `
## Stereo Geometry

### What is Stereo Vision?
Stereo vision uses **two cameras** (like human eyes) to estimate **depth** (3D structure) from 2D images.

**Key challenge:** Given a point in one image, where is the corresponding point in the other image?

---

### Epipolar Geometry

Epipolar geometry describes the **geometric relationship between two views** of the same scene.

#### Key Elements

**1. Epipoles**
- **e₁:** Projection of camera center C₂ into image 1
- **e₂:** Projection of camera center C₁ into image 2
- The epipoles are where the **baseline** (line connecting the two camera centers) intersects each image plane

**2. Epipolar Plane**
- For a 3D point X, the **epipolar plane** is defined by:
  - X, C₁ (camera 1 center), C₂ (camera 2 center)

**3. Epipolar Lines**
- The intersection of the epipolar plane with each image plane
- If point **x** is in image 1, its corresponding point in image 2 **must lie on the epipolar line l'**
- This reduces the **2D correspondence search** to a **1D search along a line**

#### The Epipolar Constraint
For corresponding points x ↔ x' in two images:

**x'ᵀ F x = 0**

where **F** is the **Fundamental Matrix**.

This is the core constraint of epipolar geometry.

---

### The Fundamental Matrix

The **Fundamental Matrix F** is a 3×3 matrix of rank 2 with 7 DOF (defined up to scale, with rank constraint).

#### Properties of F
1. **F** is a 3×3 matrix with **rank 2**
2. **7 degrees of freedom** (9 elements - 1 scale - 1 rank constraint)
3. **x'ᵀ F x = 0** for all corresponding points x ↔ x'
4. **F x** = epipolar line in image 2 corresponding to x in image 1
5. **Fᵀ x'** = epipolar line in image 1 corresponding to x' in image 2
6. **F e₁ = 0** and **Fᵀ e₂ = 0** (epipoles in null space)

#### Computing F from Camera Matrices
If camera matrices P and P' are known:
**F = [e']× P' P⁺**

where P⁺ is the pseudoinverse of P and [e']× is the skew-symmetric matrix of the epipole e'.

---

### Normalized 8-Point Algorithm

The **8-point algorithm** (Longuet-Higgins, 1981) computes F from at least 8 point correspondences.

#### Why 8 Points?
F has 7 DOF → need 7 equations → 7 correspondences (or 8 for the linear algorithm).

#### Steps of the Normalized 8-Point Algorithm:

**Step 1: Normalize the points**
- Translate centroid to origin
- Scale so mean distance from origin = √2
- Apply same transform T, T' to both sets of points
- **Why normalize?** Improves numerical conditioning dramatically

**Step 2: Set up the linear system**
For each correspondence (x_i, x_i'), write:
- **x_i'ᵀ F x_i = 0** as a linear equation in 9 unknowns (elements of F)
- Stack n equations into matrix **A** (n×9 matrix)

**Step 3: Solve Af = 0**
- f = vector of 9 elements of F
- Solution: **f = eigenvector of AᵀA** with smallest eigenvalue (SVD)
- Or equivalently: last row of **V** in SVD of **A = UΣVᵀ**

**Step 4: Enforce rank-2 constraint**
- F from step 3 is generally rank 3
- Compute SVD: F = U diag(d₁, d₂, d₃) Vᵀ
- Set smallest singular value to 0: F̂ = U diag(d₁, d₂, 0) Vᵀ

**Step 5: Denormalize**
- **F_final = T'ᵀ F̂ T**

---

### Algebraic Minimization Algorithm

Instead of the linear DLT approach, minimize the **algebraic distance**:

**Minimize:** Σᵢ (x_i'ᵀ F x_i)² subject to ||f|| = 1

This is exactly what the 8-point algorithm does (it minimizes algebraic error).

**Limitation:** Algebraic error is not geometrically meaningful. Geometric errors give better results.

---

### Geometric Distance Computation

**Geometric error** measures the **reprojection error** — how far the estimated correspondences deviate from the true epipolar constraint.

#### Sampson Distance (First-Order Approximation)
A good approximation to geometric distance:

**d_Sampson² = (x'ᵀ F x)² / [(Fx)₁² + (Fx)₂² + (Fᵀx')₁² + (Fᵀx')₂²]**

- Much cheaper to compute than true geometric distance
- Very good approximation in practice
- Used in robust estimation (RANSAC)

#### Gold Standard Algorithm
Minimizes true geometric distance:
- Nonlinear optimization (Levenberg-Marquardt)
- Minimize Σ [d(x, x̂)² + d(x', x̂')²]
- More accurate but computationally expensive
- Use 8-point result as initialization
            `,
            codeExample: `
import cv2
import numpy as np

# ========================================
# 1. COMPUTING THE FUNDAMENTAL MATRIX
# ========================================

# Load stereo image pair
img1 = cv2.imread('left.jpg',  cv2.IMREAD_GRAYSCALE)
img2 = cv2.imread('right.jpg', cv2.IMREAD_GRAYSCALE)

# Detect and match features
sift = cv2.SIFT_create()
kp1, des1 = sift.detectAndCompute(img1, None)
kp2, des2 = sift.detectAndCompute(img2, None)

bf      = cv2.BFMatcher()
matches = bf.knnMatch(des1, des2, k=2)

# Lowe's ratio test
good = [m for m, n in matches if m.distance < 0.75 * n.distance]

# Extract matched point coordinates
pts1 = np.float32([kp1[m.queryIdx].pt for m in good])
pts2 = np.float32([kp2[m.trainIdx].pt for m in good])

# Compute Fundamental Matrix (normalized 8-point + RANSAC)
F, mask = cv2.findFundamentalMat(pts1, pts2,
                                  cv2.FM_RANSAC,
                                  ransacReprojThreshold=1.0,
                                  confidence=0.99)

print(f"Fundamental Matrix F:\\n{F}")
print(f"Rank of F: {np.linalg.matrix_rank(F)}")   # Should be 2

# ========================================
# 2. EPIPOLAR CONSTRAINT VERIFICATION
# ========================================

# Filter to inlier points only
pts1_in = pts1[mask.ravel() == 1]
pts2_in = pts2[mask.ravel() == 1]

# Check epipolar constraint: x'ᵀ F x ≈ 0
ones = np.ones((len(pts1_in), 1))
pts1_h = np.hstack([pts1_in, ones])  # homogeneous
pts2_h = np.hstack([pts2_in, ones])

residuals = np.abs(np.sum(pts2_h @ F * pts1_h, axis=1))
print(f"\\nEpipolar constraint residuals:")
print(f"  Mean: {residuals.mean():.4f}")
print(f"  Max:  {residuals.max():.4f}")

# ========================================
# 3. DRAWING EPIPOLAR LINES
# ========================================

def draw_epipolar_lines(img1, img2, F, pts1, pts2, num=10):
    """Draw epipolar lines on both images."""
    img1_c = cv2.cvtColor(img1, cv2.COLOR_GRAY2BGR)
    img2_c = cv2.cvtColor(img2, cv2.COLOR_GRAY2BGR)

    # Select random subset
    idx    = np.random.choice(len(pts1), num, replace=False)
    pts1_s = pts1[idx]
    pts2_s = pts2[idx]

    # Epipolar lines in image 2 (l' = F x)
    lines2 = cv2.computeCorrespondEpilines(
        pts1_s.reshape(-1, 1, 2), 1, F).reshape(-1, 3)

    h, w = img1.shape
    for line, pt1, pt2 in zip(lines2, pts1_s, pts2_s):
        a, b, c = line
        # Line: ax + by + c = 0 → endpoints at x=0 and x=w
        x0, y0 = 0,     int(-c / b)
        x1, y1 = w - 1, int(-(c + a * (w - 1)) / b)
        color = tuple(np.random.randint(0, 255, 3).tolist())
        cv2.line(img2_c, (x0, y0), (x1, y1), color, 1)
        cv2.circle(img1_c, tuple(pt1.astype(int)), 5, color, -1)
        cv2.circle(img2_c, tuple(pt2.astype(int)), 5, color, -1)

    return img1_c, img2_c

# ========================================
# 4. STEREO RECTIFICATION
# ========================================

# After calibration (assuming K1, K2, dist1, dist2 are known)
# K1 = K2 = K (same camera)
# Use stereoRectify to compute rectifying homographies
K = np.array([[800, 0, 320], [0, 800, 240], [0, 0, 1]], dtype=np.float64)
dist = np.zeros(5)
R = np.eye(3)
T = np.array([[-0.1], [0], [0]])  # 10cm baseline

R1, R2, P1, P2, Q, roi1, roi2 = cv2.stereoRectify(
    K, dist, K, dist,
    img1.shape[::-1], R, T)

# Compute rectification maps
map1x, map1y = cv2.initUndistortRectifyMap(K, dist, R1, P1,
                                            img1.shape[::-1], cv2.CV_32F)
map2x, map2y = cv2.initUndistortRectifyMap(K, dist, R2, P2,
                                            img2.shape[::-1], cv2.CV_32F)

rect1 = cv2.remap(img1, map1x, map1y, cv2.INTER_LINEAR)
rect2 = cv2.remap(img2, map2x, map2y, cv2.INTER_LINEAR)
`
        },
        {
            id: "camera-motion-3d",
            title: "Camera Motion & 3D Reconstruction",
            description: "Camera motion models, optical flow, and linear triangulation for 3D reconstruction.",
            details: `
## Camera Motion and 3D Reconstruction

### Camera Motion

**Camera motion** describes how the camera moves between frames or viewpoints.

#### Degrees of Freedom
A rigid camera can move with **6 DOF**:
- **3 translational:** X, Y, Z displacement
- **3 rotational:** Roll, Pitch, Yaw

#### Types of Camera Motion

**1. Pure Rotation**
- Camera center stays fixed, only orientation changes
- Results in a **homography** between frames (no depth needed)
- Common in: panoramic photography, camera rig head

**2. Pure Translation**
- Camera orientation fixed, only position changes
- Creates **disparity** proportional to depth
- Epipolar lines are **parallel** (when translating sideways)

**3. General Motion**
- Both rotation and translation
- Most common in practice (handheld camera, robot, vehicle)
- Full epipolar geometry applies

---

### Motion Models

#### Parametric Motion Models

**1. Translational Model (2 DOF)**
- u = dx, v = dy (constant displacement for all pixels)
- Assumption: all pixels move the same amount

**2. Affine Model (6 DOF)**
- u = a₁x + a₂y + a₃
- v = a₄x + a₅y + a₆
- Models: translation, rotation, scaling, shear

**3. Projective Model (8 DOF / Homography)**
- Most general for planar scenes or pure rotation
- u = (h₁x + h₂y + h₃) / (h₇x + h₈y + 1)
- v = (h₄x + h₅y + h₆) / (h₇x + h₈y + 1)

---

### Optical Flow

**Optical flow** is the apparent motion of image pixels between consecutive frames, caused by relative motion between the camera and the scene.

#### Optical Flow Constraint (Horn-Schunck)
Assuming brightness constancy:
**I(x, y, t) = I(x + u, y + v, t + 1)**

Taylor expansion gives the **Optical Flow Equation:**
**Iₓ u + Iᵧ v + Iₜ = 0**

where:
- Iₓ, Iᵧ: spatial image gradients
- Iₜ: temporal image gradient
- (u, v): optical flow vector

**Aperture Problem:** One equation, two unknowns — underdetermined!
- Cannot determine flow parallel to an edge locally
- Requires additional constraints (smoothness, feature tracking)

#### Lucas-Kanade Method (Local Approach)
Assumes **constant flow within a local window** (W × W neighborhood):

For each pixel in the window, the optical flow equation holds:
- **A w = b**

where A is 2N×2 (N = W²), w = [u, v]ᵀ, b = -[Iₜ] vector.

**Least-squares solution:** w = (AᵀA)⁻¹ Aᵀ b

**AᵀA is the structure tensor M:**
\`\`\`
M = Σ [Iₓ²   IₓIᵧ]
      [IₓIᵧ  Iᵧ² ]
\`\`\`

Flow is reliable when **M** has two large eigenvalues (corners/textures).

**Limitations:**
- Fails for large displacements
- Solved with image pyramids (coarse-to-fine)

#### Farneback Method (Dense Optical Flow)
- Approximates each neighborhood as a polynomial
- Estimates dense flow field for every pixel
- Available in OpenCV as \`cv2.calcOpticalFlowFarneback\`

#### Applications of Optical Flow
- Video stabilization
- Object tracking
- Action recognition in videos
- Autonomous driving (ego-motion estimation)
- Medical imaging (cardiac motion analysis)

---

### 3D Reconstruction: Linear Triangulation

**Triangulation** recovers the **3D position** of a point given its 2D projections in two or more views and the camera matrices.

#### The Triangulation Problem
Given:
- Camera matrices P and P'
- 2D points x = Pˈ X and x' = P' X for 3D point X

Find X.

#### Direct Linear Transform (DLT) for Triangulation
Each point correspondence gives 2 equations:

**x × PX = 0** → 2 independent linear equations
**x' × P'X = 0** → 2 more equations

For two views: **AX = 0** where A is 4×4.

**Solution:** X = eigenvector of AᵀA with smallest eigenvalue (SVD).

**Why "linear"?** We use the cross-product form, which is linear in the homogeneous coordinates of X.

#### Optimal Triangulation
The linear method minimizes algebraic error. For better accuracy:
- Minimize geometric reprojection error:
- **Minimize:** d(x, x̂)² + d(x', x̂')²
- Subject to: x̂' F x̂ = 0
- Use Sampson error as first approximation
- Non-linear optimization for exact solution

#### Structure from Motion (SfM)
Full 3D reconstruction from multiple images:
1. **Feature detection and matching** across all image pairs
2. **Pairwise fundamental matrix** estimation
3. **Camera motion estimation** (recover R, t from F using Essential matrix)
4. **Incremental reconstruction:** Add cameras and triangulate points
5. **Bundle adjustment:** Global nonlinear optimization of all cameras and 3D points

#### Bundle Adjustment
Minimize total reprojection error over all cameras and 3D points:
**Minimize:** Σᵢ Σⱼ ||xᵢⱼ - π(Pᵢ, Xⱼ)||²

where π(P, X) is the projection function.
- Solved with Levenberg-Marquardt algorithm
- Uses sparse structure of the Jacobian for efficiency
            `,
            codeExample: `
import cv2
import numpy as np

# ========================================
# 1. LUCAS-KANADE SPARSE OPTICAL FLOW
# ========================================

cap = cv2.VideoCapture('video.mp4')

# Parameters for ShiTomasi corner detection
feature_params = dict(maxCorners=100, qualityLevel=0.3,
                      minDistance=7, blockSize=7)

# Parameters for Lucas-Kanade optical flow
lk_params = dict(winSize=(15, 15), maxLevel=2,
                 criteria=(cv2.TERM_CRITERIA_EPS |
                            cv2.TERM_CRITERIA_COUNT, 10, 0.03))

ret, old_frame = cap.read()
old_gray = cv2.cvtColor(old_frame, cv2.COLOR_BGR2GRAY)

# Detect initial features
p0 = cv2.goodFeaturesToTrack(old_gray, mask=None, **feature_params)

mask = np.zeros_like(old_frame)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Calculate optical flow
    p1, st, err = cv2.calcOpticalFlowPyrLK(
        old_gray, frame_gray, p0, None, **lk_params)

    # Select good points (status == 1)
    good_new = p1[st == 1]
    good_old = p0[st == 1]

    # Draw flow vectors
    for new, old in zip(good_new, good_old):
        a, b = new.ravel().astype(int)
        c, d = old.ravel().astype(int)
        mask  = cv2.line(mask, (a, b), (c, d), (0, 255, 0), 2)
        frame = cv2.circle(frame, (a, b), 5, (0, 0, 255), -1)

    img = cv2.add(frame, mask)
    cv2.imshow('Optical Flow (LK)', img)

    old_gray = frame_gray.copy()
    p0       = good_new.reshape(-1, 1, 2)

    if cv2.waitKey(30) & 0xFF == ord('q'):
        break

cap.release()

# ========================================
# 2. DENSE OPTICAL FLOW (FARNEBACK)
# ========================================

cap = cv2.VideoCapture('video.mp4')
ret, frame1 = cap.read()
prev_gray   = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)

while True:
    ret, frame2 = cap.read()
    if not ret:
        break

    curr_gray = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)

    # Dense optical flow
    flow = cv2.calcOpticalFlowFarneback(
        prev_gray, curr_gray, None,
        pyr_scale=0.5, levels=3, winsize=15,
        iterations=3, poly_n=5, poly_sigma=1.2, flags=0)

    # Convert flow to HSV for visualization
    magnitude, angle = cv2.cartToPolar(flow[..., 0], flow[..., 1])
    hsv = np.zeros_like(frame1)
    hsv[..., 0] = angle * 180 / np.pi / 2   # Hue = direction
    hsv[..., 1] = 255
    hsv[..., 2] = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX)
    bgr = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

    cv2.imshow('Dense Optical Flow', bgr)
    prev_gray = curr_gray

    if cv2.waitKey(30) & 0xFF == ord('q'):
        break

cap.release()

# ========================================
# 3. TRIANGULATION (3D RECONSTRUCTION)
# ========================================

def triangulate_points(P1, P2, pts1, pts2):
    """Linear triangulation of 3D points from two views."""
    points_4d = cv2.triangulatePoints(P1, P2,
                                       pts1.T, pts2.T)  # 4xN homogeneous
    points_3d = points_4d[:3] / points_4d[3]            # Divide by w
    return points_3d.T  # Nx3

# Camera matrices (simplified example)
K = np.array([[800, 0, 320], [0, 800, 240], [0, 0, 1]], dtype=np.float64)
R1, t1 = np.eye(3), np.zeros((3, 1))
R2 = cv2.Rodrigues(np.array([0, 0.1, 0]))[0]  # Small rotation
t2 = np.array([[-0.5], [0], [0]])              # 50cm baseline

P1 = K @ np.hstack([R1, t1])
P2 = K @ np.hstack([R2, t2])

# Triangulate matched points
pts1 = np.float32([[320, 240], [400, 200], [250, 300]])
pts2 = np.float32([[310, 240], [388, 200], [240, 300]])

points_3d = triangulate_points(P1, P2, pts1, pts2)
print("Reconstructed 3D points:")
for i, pt in enumerate(points_3d):
    print(f"  Point {i}: X={pt[0]:.2f}, Y={pt[1]:.2f}, Z={pt[2]:.2f}")

# ========================================
# 4. DISPARITY MAP → DEPTH MAP
# ========================================

img_left  = cv2.imread('left_rect.jpg',  cv2.IMREAD_GRAYSCALE)
img_right = cv2.imread('right_rect.jpg', cv2.IMREAD_GRAYSCALE)

# SGBM stereo matcher
stereo = cv2.StereoSGBM_create(
    minDisparity=0,
    numDisparities=128,     # Must be divisible by 16
    blockSize=11,
    P1=8  * 3 * 11**2,
    P2=32 * 3 * 11**2,
    disp12MaxDiff=1,
    uniquenessRatio=10,
    speckleWindowSize=100,
    speckleRange=32)

disparity = stereo.compute(img_left, img_right).astype(np.float32) / 16.0

# Depth from disparity: Z = f * B / d
# where f = focal length (pixels), B = baseline (meters), d = disparity
f = 800.0   # focal length in pixels
B = 0.1     # baseline in meters
depth = np.where(disparity > 0, f * B / disparity, 0)
print(f"Depth range: {depth[depth>0].min():.2f}m to {depth[depth>0].max():.2f}m")
`
        }
    ]
};
