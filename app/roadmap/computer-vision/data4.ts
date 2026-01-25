import { Unit } from './types';

export const section4Data: Unit = {
    id: "section-4",
    title: "Section 4: Feature Detection & Segmentation",
    description: "Feature extraction, descriptors, corner detection, and image segmentation.",
    topics: [
        {
            id: "corner-detection",
            title: "Corner & Interest Point Detection",
            description: "Harris, Shi-Tomasi, and FAST corner detectors.",
            details: `
## Corner Detection

### What is a Corner?
A corner is a point where **two edges meet** or where there is a significant change in intensity in **all directions**.

**Why Detect Corners?**
- Invariant to rotation
- Partially invariant to illumination
- Distinctive features for matching
- Fewer than edge pixels (more efficient)

---

### Harris Corner Detector

#### Intuition
Move a small window in any direction:
- **Flat region:** No change in any direction
- **Edge:** No change along edge direction
- **Corner:** Significant change in all directions

#### Mathematical Formulation

**Step 1: Compute Gradients**
Iₓ = ∂I/∂x (horizontal gradient)
Iᵧ = ∂I/∂y (vertical gradient)

**Step 2: Structure Tensor (Second Moment Matrix)**
M = Σ w(x,y) [Iₓ²    IₓIᵧ]
              [IₓIᵧ   Iᵧ² ]

Where w(x,y) is a Gaussian window (weights nearby pixels)

**Step 3: Corner Response Function**
R = det(M) - k × trace(M)²
R = λ₁λ₂ - k(λ₁ + λ₂)²

Where:
- λ₁, λ₂ are eigenvalues of M
- k is empirical constant (typically 0.04 - 0.06)

**Step 4: Decision**
- |R| small: Flat region
- R < 0: Edge (one large eigenvalue)
- R > 0 (large): Corner (two large eigenvalues)

**Step 5: Non-Maximum Suppression**
- Apply threshold to R
- Keep only local maxima

#### Eigenvalue Interpretation
- **Both λ₁, λ₂ small:** Flat region (constant intensity)
- **One large, one small:** Edge
- **Both large:** Corner

---

### Shi-Tomasi Corner Detector
**Improvement over Harris:**

Instead of R = det(M) - k × trace(M)²
Use: R = min(λ₁, λ₂)

**Advantage:**
- If min eigenvalue > threshold → Corner
- More reliable corner detection
- Used in optical flow tracking (KLT tracker)

---

### FAST (Features from Accelerated Segment Test)

#### Algorithm
For each pixel p with intensity Iₚ:

**Step 1:** Consider circle of 16 pixels around p
**Step 2:** Choose threshold T
**Step 3:** Count pixels on circle where:
- I(x) > Iₚ + T (brighter)
- I(x) < Iₚ - T (darker)

**Step 4:** If ≥ N contiguous pixels are brighter or darker → p is corner

**Typical:** N = 9, 12 (FAST-9, FAST-12)

**Speed Optimization:**
- Test pixels 1, 5, 9, 13 first (high-speed test)
- If ≥ 3 meet criterion, check all 16

**Advantages:**
- Very fast (hence the name)
- Good for real-time applications
- Machine learning can optimize

**Disadvantages:**
- Not robust to high levels of noise
- No orientation component
- Multiple features at adjacent locations

---

## Feature Descriptors

### Why Descriptors?
Keypoint location alone insufficient for matching.
Need **descriptor**: A vector representing local appearance.

**Desirable Properties:**
1. **Repeatability:** Same feature detected in different images
2. **Distinctiveness:** Different features have different descriptors
3. **Robustness:** Invariant to scale, rotation, illumination
4. **Compactness:** Small memory footprint
5. **Efficiency:** Fast to compute and match

---

### SIFT (Scale-Invariant Feature Transform)

#### Overview
**Developed by:** David Lowe (1999)
**Patent:** Expired (March 2020)

**Invariant to:**
- Scale
- Rotation
- Illumination changes (partially)
- Affine distortion (partially)

#### Algorithm Steps

**1. Scale-Space Extrema Detection**

Build **Gaussian Pyramid:**
- L(x, y, σ) = G(x, y, σ) * I(x, y)
- Multiple octaves (downsample by 2)
- Multiple scales per octave

**Difference of Gaussians (DoG):**
D(x, y, σ) = L(x, y, kσ) - L(x, y, σ)

Approximates Laplacian of Gaussian:
∇²G ≈ (G(kσ) - G(σ)) / (kσ - σ)

**Extrema Detection:**
- Compare pixel to 26 neighbors (9 in current scale, 9 above, 9 below)
- If maximum or minimum → Potential keypoint

**2. Keypoint Localization**

**Sub-pixel accuracy:**
- Use Taylor expansion to find precise location
- Fit quadratic function near extrema

**Eliminate Low-Contrast Points:**
- Threshold DoG response
- Reject points with |D(x)| < 0.03

**Eliminate Edge Responses:**
- Compute Hessian matrix
- If principal curvature ratio too high → Edge (discard)
- Keep only corners (well-defined peaks)

**3. Orientation Assignment**

**Goal:** Achieve rotation invariance

**Process:**
- Compute gradient magnitude and orientation in neighborhood
- Create histogram of orientations (36 bins, 0-360°)
- Weight by gradient magnitude and Gaussian window
- Peak(s) in histogram = dominant direction(s)
- Assign orientation to keypoint

**Multiple Orientations:**
- If secondary peak ≥ 80% of maximum → Create additional keypoint

**4. Descriptor Generation**

**Process:**
- Rotate patch to align with dominant orientation
- Divide 16×16 window into 4×4 grid of cells
- Compute 8-bin orientation histogram per cell
- Concatenate: 4 × 4 × 8 = **128-dimensional vector**

**Normalization:**
- Normalize to unit length (illumination invariance)
- Threshold values > 0.2, renormalize (non-linear illumination)

---

### SURF (Speeded-Up Robust Features)

#### Key Differences from SIFT
- Uses **Hessian matrix** instead of DoG
- Uses **integral images** for fast convolution
- **64-dimensional** descriptor (vs SIFT's 128)
- Faster than SIFT, similar accuracy

**Patent:** Still active (use with caution commercially)

---

### ORB (Oriented FAST and Rotated BRIEF)

#### Overview
**free and open-source** alternative to SIFT/SURF
Combines:
- **FAST** keypoint detector
- **BRIEF** descriptor

#### oFAST (Oriented FAST)
- Adds orientation to FAST corners
- Uses **intensity centroid:**
  - Moments: m_pq = Σ x^p y^q I(x,y)
  - Centroid: C = (m₁₀/m₀₀, m₀₁/m₀₀)
  - Orientation: θ = atan2(m₀₁, m₁₀)

#### rBRIEF (Rotated BRIEF)

**BRIEF (Binary Robust Independent Elementary Features):**
- Sample pairs of pixels in patch
- Compare intensities: 1 if p₁ > p₂, else 0  
- Create binary string (256 or 512 bits)

**Rotation:**
- Use orientation from oFAST
- Rotate sampling pattern accordingly

**Advantages:**
- **Very fast** (binary descriptor)
- **Memory efficient** (256 bits vs 128 floats)
- Hamming distance for matching (XOR + bit count)

**Disadvantages:**
- Not scale-invariant (use image pyramids)
- Less distinctive than SIFT

---

## Feature Matching

### Brute-Force Matcher
Compare every descriptor in set A with every descriptor in set B.

**Distance Metrics:**
- **SIFT/SURF:** L2 (Euclidean) or L1 (Manhattan)
- **ORB/BRIEF:** Hamming distance (bit differences)

**Complexity:** O(N × M) for N and M features

---

### FLANN (Fast Library for Approximate Nearest Neighbors)

**For large databases:**
- KD-tree for SIFT/SURF
- LSH (Locality Sensitive Hashing) for binary descriptors
- Approximate but much faster

---

### Matching Strategies

#### 1. Nearest Neighbor
- For each descriptor in A, find closest in B
- Match if distance < threshold

#### 2. Ratio Test (Lowe's)
- Find two nearest neighbors
- Match if distance₁ / distance₂ < 0.7-0.8
- **Rejects ambiguous matches**

**Why Effective:**
- Distinctive features have low ratio
- Ambiguous matches rejected

---

## Image Segmentation

### Definition
Partition image into constituent regions or objects.

**Goal:** Simplify representation for easier analysis

**Categories:**
1. **Thresholding-based**
2. **Region-based**
3. **Edge-based**
4. **Clustering-based**

---

### Thresholding Segmentation

#### Global Thresholding
Single threshold T for entire image.

**Otsu's Method** (covered in Section 2):
- Automatic threshold selection
- Maximizes between-class variance

#### Variable Thresholding
Threshold varies based on local properties.

**Image Dependent:**
T = T(x, y, f(x,y), p(x,y))
- f(x,y): intensity
- p(x,y): local property (mean, variance)

---

### Region-Based Segmentation

#### Region Growing
**Algorithm:**
1. Select seed point(s)
2. Add neighboring pixels if similar
3. Continue until no more pixels can be added

**Similarity Criteria:**
- Intensity difference < threshold
- Texture similarity
- Color distance

**Challenges:**
- Seed selection
- Threshold selection
- Computational cost

#### Region Splitting and Merging
**Quadtree Approach:**

**Split:**
1. Start with entire image
2. If region not uniform → Split into quadrants
3. Recursively split non-uniform regions

**Merge:**
1. Merge adjacent similar regions

**Predicate P(R):**
- True if region uniform
- Based on: variance, range, etc.

---

### Watershed Segmentation

#### Concept
Treat image as topographic surface:
- Intensity = altitude
- Flood from minima
- Watersheds = boundaries where waters meet

**Process:**
1. Compute gradient magnitude
2. Find local minima (catchment basins)
3. Flood from minima
4. Build dams at watershed lines

**Marker-Controlled Watershed:**
- Use markers to avoid over-segmentation
- Markers define foreground/background
- Only flood from markers

**Application:**
- Separate touching objects
- Medical image analysis

---

### Clustering-Based Segmentation

#### K-Means Clustering
**For color/grayscale segmentation:**

**Algorithm:**
1. Choose K cluster centers
2. Assign pixels to nearest center
3. Recompute centers (mean of assigned pixels)
4. Repeat until convergence

**Distance Metric:**
- RGB/Grayscale: Euclidean distance
- Can include spatial coordinates (x,y,r,g,b)

**Limitation:**
- Must specify K
- Sensitive to initialization

#### Mean Shift
**Non-parametric clustering:**
- No need to specify K
- Iteratively shifts points toward mode (density peak)
- Natural convergence to clusters
            `
        }
    ]
};
