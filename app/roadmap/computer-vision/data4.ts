import { Unit } from './types';

export const section4Data: Unit = {
    id: "unit-4",
    title: "Unit IV: Feature Detection, Description & Matching",
    description: "Feature detectors (Harris, SIFT, SURF, ORB, HOG), matching strategies, and RANSAC.",
    topics: [
        {
            id: "feature-detection",
            title: "Feature Detection and Description",
            description: "Harris corner detector, SIFT, SURF, FAST, BRIEF, ORB, and HOG descriptors.",
            details: `
## Feature Detection and Description

### Overview of Feature Detection

A **feature** (or interest point / keypoint) is a distinctive location in an image that can be reliably detected and described.

**Properties of good features:**
- **Repeatability:** Detected in the same scene region across different images
- **Distinctiveness:** Each feature has a unique description
- **Locality:** Describes a small region
- **Accuracy:** Precise localization
- **Efficiency:** Fast to compute

**Types of features:**
- **Corners:** Points where two or more edges meet (high gradient in all directions)
- **Blobs:** Regions that differ from their surroundings (scale-space detection)
- **Edges:** Boundaries between regions (used less commonly as keypoints)

---

### 1. Harris Corner Detector

**Intuition:** A corner shows large intensity change when a small window is moved in **any direction**.

#### Harris Response Function

The **second moment matrix (structure tensor)** M captures local gradient structure:

\`\`\`
M = Σ w(x,y) [Iₓ²    IₓIᵧ]
              [IₓIᵧ   Iᵧ² ]
\`\`\`

Eigenvalues λ₁, λ₂ of M indicate:
- **Flat region:** Both λ₁ ≈ λ₂ ≈ 0
- **Edge:** λ₁ >> λ₂ (or vice versa)
- **Corner:** Both λ₁ and λ₂ are large

**Harris response (avoids eigenvalue computation):**

**R = det(M) - k × trace(M)²**
- det(M) = λ₁ × λ₂
- trace(M) = λ₁ + λ₂
- k ≈ 0.04–0.06 (empirical constant)

**Interpretation:**
- R >> 0: Corner (both eigenvalues large)
- R << 0: Edge (one eigenvalue much larger)
- |R| ≈ 0: Flat region

**Properties:**
- **Rotation invariant:** M is computed from gradients, unaffected by rotation
- **NOT scale invariant:** Window size fixed → different response at different scales
- **Partially illumination invariant:** Gradient-based

---

### 2. Scale Invariant Feature Transform (SIFT)

SIFT (Lowe, 2004) detects and describes local features that are invariant to scale, rotation, and partially to illumination.

#### SIFT Detection: Scale-Space Extrema
1. **Build Gaussian Scale Space:** Convolve image with Gaussians at multiple scales σ
2. **Difference of Gaussians (DoG):** D(x,y,σ) = G(σ_i+1) * I - G(σ_i) * I
3. **Keypoint candidates:** Local extrema (maxima/minima) in DoG across scale and space
4. **Keypoint refinement:** Remove low-contrast and edge-response points

#### SIFT Orientation Assignment
- Compute gradient magnitudes and orientations in a neighborhood
- Create **histogram of orientations** (36 bins, 10° each)
- Dominant orientation assigned to keypoint → **rotation invariance**
- Multiple orientations if secondary peaks > 80% of main peak

#### SIFT Descriptor
1. Take 16×16 neighborhood around keypoint
2. Divide into 4×4 cells
3. Compute 8-bin orientation histogram per cell
4. **Total descriptor: 4×4×8 = 128 dimensions**
5. Normalize to unit length, clip values > 0.2, renormalize → illumination invariance

**Properties:**
- Scale and rotation invariant
- Partially invariant to affine changes and illumination
- Distinctive and robust descriptors
- **Slow** — patented (now expired)

---

### 3. SURF (Speeded Up Robust Features)

SURF (Bay et al., 2006) is an approximation of SIFT that is faster.

**Key differences from SIFT:**
- **Box filter approximation** of Laplacian of Gaussian → can use integral images for speed
- **Haar wavelet responses** in x and y for orientation
- Descriptor: 4×4 cells of 4 Haar wavelet responses = **64 dimensions** (vs SIFT's 128)
- **3–7× faster** than SIFT while comparable in matching performance

---

### 4. Binary Feature Detectors

Binary descriptors represent features as **binary strings** — very fast to compute and match (using Hamming distance).

#### FAST (Features from Accelerated Segment Test)

**Detection principle:**
1. Consider a circle of 16 pixels around a candidate point p
2. p is a corner if there are N ≥ 9 **consecutive pixels** on the circle either all brighter than p + threshold or all darker than p - threshold
3. Very fast (can use decision tree to reject non-corners early)

**Not descriptor** — just a detector. Often combined with BRIEF or ORB.

#### BRIEF (Binary Robust Independent Elementary Features)

**Descriptor (not detector):**
- Select n pairs of pixels (x, y) in a patch around the keypoint
- For each pair: bit = 1 if I(x) < I(y), else 0
- **256-bit string (32 bytes)** with n=256 pairs
- Matched using **Hamming distance** (XOR + popcount) — very fast

**Weakness:** Not rotation or scale invariant (pairs are fixed).

#### ORB (Oriented FAST and Rotated BRIEF)

ORB (Rublee et al., 2011) combines FAST + BRIEF with rotation invariance:
1. **Detector:** FAST with scale pyramid (scale invariance)
2. **Orientation:** Intensity centroid method to assign orientation
3. **Descriptor:** Rotated BRIEF (rBRIEF) — rotate sampling pairs according to keypoint orientation
4. **Pair selection:** Learns uncorrelated, high-variance pairs (better than random)

**Advantages:**
- Free (no patent)
- Fast (real-time capable)
- Robust to rotation and noise
- 256-bit descriptor

---

### 5. HOG (Histogram of Oriented Gradients)

HOG is a **dense descriptor** for object detection (not a sparse keypoint detector).

**Originally proposed for pedestrian detection (Dalal & Triggs, 2005).**

#### HOG Computation Steps:
1. **Gradient computation:** Compute Gₓ, Gᵧ using simple filters
2. **Gradient magnitude and orientation:** M = √(Gₓ² + Gᵧ²), θ = atan2(Gᵧ, Gₓ)
3. **Cell histograms:** Divide image into cells (8×8 pixels each); build 9-bin orientation histogram weighted by magnitude
4. **Block normalization:** Group 2×2 cells into a block; normalize histogram → illumination invariance
5. **Concatenate:** All block descriptors → feature vector

**For 64×128 pedestrian detection window:**
- 8×16 blocks → 7×15 = 105 blocks
- Each block: 2×2 cells × 9 bins = 36 values
- **Total: 105 × 36 = 3,780-dimensional feature vector**

**Applications:**
- Pedestrian detection
- Object recognition with sliding window
- Combined with SVM classifier
            `,
            codeExample: `
import cv2
import numpy as np

img  = cv2.imread('scene.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# ========================================
# 1. HARRIS CORNER DETECTOR
# ========================================

gray_f32 = np.float32(gray)
harris   = cv2.cornerHarris(gray_f32, blockSize=2, ksize=3, k=0.04)

# Dilate to mark corners
harris = cv2.dilate(harris, None)

# Threshold and mark
result    = img.copy()
threshold = 0.01 * harris.max()
result[harris > threshold] = [0, 0, 255]   # Red corners
print(f"Harris: {(harris > threshold).sum()} corners detected")

# ========================================
# 2. SIFT
# ========================================

sift = cv2.SIFT_create(nfeatures=500)
kp_sift, des_sift = sift.detectAndCompute(gray, None)

img_sift = cv2.drawKeypoints(img, kp_sift, None,
                              flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
print(f"SIFT: {len(kp_sift)} keypoints, descriptor shape: {des_sift.shape}")

# ========================================
# 3. ORB
# ========================================

orb = cv2.ORB_create(nfeatures=500)
kp_orb, des_orb = orb.detectAndCompute(gray, None)

img_orb = cv2.drawKeypoints(img, kp_orb, None, color=(0, 255, 0))
print(f"ORB:  {len(kp_orb)} keypoints, descriptor shape: {des_orb.shape}")

# ========================================
# 4. FAST DETECTOR
# ========================================

fast = cv2.FastFeatureDetector_create(threshold=20, nonmaxSuppression=True)
kp_fast = fast.detect(gray, None)

img_fast = cv2.drawKeypoints(img, kp_fast, None, color=(255, 0, 0))
print(f"FAST: {len(kp_fast)} keypoints detected")

# ========================================
# 5. HOG DESCRIPTOR
# ========================================

from skimage.feature import hog
from skimage import exposure

# Compute HOG
hog_features, hog_image = hog(
    gray,
    orientations=9,
    pixels_per_cell=(8, 8),
    cells_per_block=(2, 2),
    visualize=True,
    block_norm='L2-Hys'
)

# Enhance contrast for visualization
hog_image_rescaled = exposure.rescale_intensity(hog_image, in_range=(0, 10))
print(f"HOG feature vector length: {len(hog_features)}")

# OpenCV HOG descriptor
winSize   = (64, 128)
blockSize = (16, 16)
blockStride = (8, 8)
cellSize  = (8, 8)
nbins     = 9

hog_cv = cv2.HOGDescriptor(winSize, blockSize, blockStride, cellSize, nbins)
h, w = gray.shape
roi = gray[:128, :64]   # Extract a 64x128 window
descriptor = hog_cv.compute(roi)
print(f"OpenCV HOG descriptor length: {len(descriptor)}")
`
        },
        {
            id: "feature-matching",
            title: "Feature Matching and Model Fitting",
            description: "Similarity measures, brute force, K-D tree, LSH, and RANSAC for robust matching.",
            details: `
## Feature Matching and Model Fitting

### Overview of Feature Matching

Feature matching finds **corresponding keypoints** between images — the foundation of many CV tasks (stereo, SfM, object recognition, panoramas).

**Pipeline:**
1. Detect keypoints and extract descriptors in both images
2. Match descriptors using a similarity/distance measure
3. Filter matches (ratio test, cross-check, RANSAC)
4. Use matches for geometric estimation

---

### Similarity Measures

The choice of distance metric depends on the descriptor type:

#### For Float Descriptors (SIFT, SURF, HOG)

**Euclidean Distance (L2)**
- d = √(Σ(aᵢ - bᵢ)²)
- Standard for SIFT and SURF
- Computationally moderate

**Dot Product / Cosine Similarity**
- sim = (a · b) / (||a|| ||b||)
- Equivalent to L2 when descriptors are L2-normalized
- Range: [-1, 1] → higher = more similar

#### For Binary Descriptors (BRIEF, ORB, BRISK)

**Hamming Distance**
- Number of bit positions where the two bit strings differ
- d = popcount(A XOR B)
- Extremely fast using hardware instructions (1-2 clock cycles for 64-bit XOR)
- Used for ORB, BRIEF, BRISK, FREAK

---

### Brute Force Matching

**Method:** Compare every descriptor in image A with every descriptor in image B.

- **Complexity:** O(N × M × D) where N, M = number of keypoints, D = descriptor dimension
- **Advantage:** Always finds the true nearest neighbor
- **Disadvantage:** Slow for large datasets

#### Lowe's Ratio Test (Nearest Neighbor Ratio)
For each query descriptor q:
1. Find the **two nearest neighbors** n₁ (closest) and n₂ (second closest)
2. Accept match only if: **d(q, n₁) / d(q, n₂) < threshold** (typically 0.75)
3. **Rationale:** Distinctive matches have a large gap between best and second-best match

This removes ~90% of false matches while retaining ~95% of true matches.

#### Cross-Check / Mutual Best Match
Match is accepted only if:
- n₁ is the nearest neighbor of q in image B **AND**
- q is the nearest neighbor of n₁ in image A
- Symmetric consistency improves precision

---

### K-D Tree

A **K-D Tree** (K-dimensional tree) is a space-partitioning data structure for efficient nearest-neighbor search.

#### Building a K-D Tree:
1. Choose a dimension d (cycle through dimensions or pick highest variance)
2. Split points at the **median** value in dimension d
3. Recursively build left and right subtrees
4. **Build time:** O(N log N), **Space:** O(N)

#### K-D Tree Search (Approximate NN):
- Traverse tree, backtrack to check other branches
- **Exact NN search:** O(log N) average, O(N) worst case
- **Approximate NN:** Restrict backtracking → much faster, small accuracy loss

#### When K-D Trees are Effective:
- Low to moderate dimensions (< 20)
- SIFT descriptors (128-D) benefit with **randomized K-D trees** (FLANN)
- Poor performance in very high dimensions ("curse of dimensionality")

---

### Locality-Sensitive Hashing (LSH)

**LSH** is an approximate nearest-neighbor search method that works well for **high-dimensional binary descriptors**.

#### Key Idea:
Hash similar items into the same bucket with high probability.
Different items hash into different buckets with high probability.

#### How LSH Works for Hamming Distance:
1. Choose random bit positions as hash functions
2. Each descriptor is assigned to buckets based on its values at those positions
3. Query: hash the query descriptor and search only within matching buckets
4. Much faster than exhaustive search for binary descriptors

**Complexity:** O(N^ρ × D) for search, where ρ < 1 depends on approximation factor.

**Used in:** OpenCV FLANN, FAISS library, large-scale image search.

---

### RANSAC for Robust Matching

**RANSAC** (Random Sample Consensus, Fischler & Bolles 1981) is an iterative algorithm for **fitting a model to noisy data with outliers**.

#### Why RANSAC?
Feature matching produces many **outliers** (wrong matches). A geometric model (Homography, Fundamental matrix) cannot be fitted directly because outliers corrupt the least-squares solution.

#### RANSAC Algorithm:
\`\`\`
Repeat for N iterations:
  1. Randomly sample minimal set of matches:
     - Homography: 4 correspondences
     - Fundamental matrix: 7–8 correspondences
  2. Compute model H (or F) from this sample
  3. Count INLIERS: matches where reprojection error < threshold t
     - Inlier: d(x', H x) < t (typically 1–5 pixels)
  4. If inlier count > best so far: save this model
Return model with most inliers; refit using all inliers
\`\`\`

#### Choosing Number of Iterations N
To ensure (with probability p) that at least one sample contains only inliers:

**N = log(1 - p) / log(1 - (1 - ε)^s)**

where:
- p = desired success probability (e.g., 0.99)
- ε = expected outlier ratio
- s = sample size (4 for homography)

**Example:** 50% outliers, s=4, p=0.99 → N ≈ 72 iterations

#### RANSAC Variants
- **MSAC (M-estimator SAmple Consensus):** Minimizes truncated sum of squared errors
- **MLESAC:** Maximizes likelihood instead of inlier count
- **PROSAC:** Samples preferentially from high-quality matches (faster convergence)
- **LO-RANSAC:** Local optimization step on best model

#### Using Matches for Geometric Estimation
\`\`\`
Final pipeline:
1. Detect keypoints → SIFT/ORB
2. Match descriptors → BFMatcher or FLANN
3. Apply ratio test → filter matches
4. RANSAC → estimate Homography or Fundamental matrix
5. Use inliers for transformation / reconstruction
\`\`\`
            `,
            codeExample: `
import cv2
import numpy as np

img1 = cv2.imread('query.jpg',    cv2.IMREAD_GRAYSCALE)
img2 = cv2.imread('reference.jpg', cv2.IMREAD_GRAYSCALE)

# ========================================
# 1. SIFT + BRUTE FORCE MATCHING
# ========================================

sift = cv2.SIFT_create(nfeatures=1000)
kp1, des1 = sift.detectAndCompute(img1, None)
kp2, des2 = sift.detectAndCompute(img2, None)

# Brute force with L2 distance (float descriptors)
bf = cv2.BFMatcher(cv2.NORM_L2, crossCheck=False)

# k-NN matching for ratio test (k=2)
matches = bf.knnMatch(des1, des2, k=2)

# Lowe's ratio test
good_matches = []
for m, n in matches:
    if m.distance < 0.75 * n.distance:
        good_matches.append(m)

print(f"Total matches:  {len(matches)}")
print(f"After ratio test: {len(good_matches)}")

# Draw matches
img_matches = cv2.drawMatches(img1, kp1, img2, kp2, good_matches[:50],
                               None, flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)

# ========================================
# 2. ORB + HAMMING DISTANCE MATCHING
# ========================================

orb = cv2.ORB_create(nfeatures=500)
kp1_orb, des1_orb = orb.detectAndCompute(img1, None)
kp2_orb, des2_orb = orb.detectAndCompute(img2, None)

# Brute force with Hamming distance (binary descriptors)
bf_hamming = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
matches_orb = bf_hamming.match(des1_orb, des2_orb)

# Sort by distance (best first)
matches_orb = sorted(matches_orb, key=lambda x: x.distance)
print(f"ORB matches (cross-check): {len(matches_orb)}")

# ========================================
# 3. FLANN MATCHING (K-D TREE for SIFT)
# ========================================

# FLANN parameters for SIFT (float descriptors)
FLANN_INDEX_KDTREE = 1
index_params  = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
search_params = dict(checks=50)  # Higher = more accurate, slower

flann   = cv2.FlannBasedMatcher(index_params, search_params)
matches_flann = flann.knnMatch(des1, des2, k=2)

good_flann = [m for m, n in matches_flann if m.distance < 0.75 * n.distance]
print(f"FLANN matches: {len(good_flann)}")

# FLANN with LSH (for ORB binary descriptors)
FLANN_INDEX_LSH = 6
index_params_lsh  = dict(algorithm=FLANN_INDEX_LSH, table_number=6,
                          key_size=12, multi_probe_level=1)
flann_lsh = cv2.FlannBasedMatcher(index_params_lsh, search_params)
matches_lsh = flann_lsh.knnMatch(des1_orb, des2_orb, k=2)
good_lsh = [m for m, n in matches_lsh
            if len([m, n]) == 2 and m.distance < 0.75 * n.distance]
print(f"LSH matches:   {len(good_lsh)}")

# ========================================
# 4. RANSAC FOR HOMOGRAPHY ESTIMATION
# ========================================

if len(good_matches) >= 4:
    pts1 = np.float32([kp1[m.queryIdx].pt for m in good_matches])
    pts2 = np.float32([kp2[m.trainIdx].pt for m in good_matches])

    # RANSAC to find homography and filter outliers
    H, mask = cv2.findHomography(pts1, pts2,
                                  cv2.RANSAC,
                                  ransacReprojThreshold=5.0,
                                  confidence=0.99,
                                  maxIters=2000)

    inliers  = good_matches[:][mask.ravel() == 1]
    outliers = good_matches[:][mask.ravel() == 0]

    print(f"\\nRANSAC Results:")
    print(f"  Inliers:  {mask.sum()} / {len(good_matches)}")
    print(f"  Outlier ratio: {1 - mask.mean():.2%}")

    # Visualize object location in scene
    h, w = img1.shape
    corners = np.float32([[0, 0], [0, h], [w, h], [w, 0]]).reshape(-1, 1, 2)
    transformed_corners = cv2.perspectiveTransform(corners, H)
    img2_annotated = cv2.polylines(cv2.cvtColor(img2, cv2.COLOR_GRAY2BGR),
                                    [np.int32(transformed_corners)],
                                    True, (0, 255, 0), 3)

# ========================================
# 5. MANUAL RANSAC IMPLEMENTATION
# ========================================

def ransac_homography(pts1, pts2, threshold=5.0, n_iters=1000, p=0.99):
    """Simple RANSAC for homography estimation."""
    best_inliers = []
    best_H       = None
    n            = len(pts1)

    # Adaptive number of iterations
    N = n_iters
    for i in range(N):
        # 1. Random sample of 4 correspondences
        idx    = np.random.choice(n, 4, replace=False)
        s1, s2 = pts1[idx], pts2[idx]

        # 2. Compute homography from sample
        H, _ = cv2.findHomography(s1, s2)
        if H is None:
            continue

        # 3. Count inliers
        pts1_h = np.hstack([pts1, np.ones((n, 1))])
        proj   = (H @ pts1_h.T).T
        proj   = proj[:, :2] / proj[:, 2:3]
        errors = np.linalg.norm(pts2 - proj, axis=1)
        inliers = np.where(errors < threshold)[0]

        # 4. Update best
        if len(inliers) > len(best_inliers):
            best_inliers = inliers
            best_H       = H

            # Update N based on inlier ratio
            w  = len(inliers) / n
            if w > 0 and w < 1:
                N = int(np.log(1 - p) / np.log(1 - w**4))
                N = min(N, n_iters)

    print(f"Manual RANSAC: {len(best_inliers)}/{n} inliers, H estimated")
    return best_H, best_inliers
`
        }
    ]
};
