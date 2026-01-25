import { Unit } from './types';

export const section3Data: Unit = {
    id: "section-3",
    title: "Section 3: Edge Detection & Morphology",
    description: "Detecting edges, contours, and morphological image processing.",
    topics: [
        {
            id: "edge-detection",
            title: "Edge Detection Techniques",
            description: "Gradient-based and advanced edge detection algorithms.",
            details: `
## Edge Detection

### What is an Edge?
An edge is a significant **local change** in image intensity, usually associated with:
- Discontinuities in depth
- Discontinuities in surface orientation  
- Changes in material properties
- Variations in scene illumination

### Types of Edges
1. **Step Edge:** Abrupt intensity change
2. **Ramp Edge:** Gradual intensity change
3. **Ridge/Roof Edge:** Intensity peak or valley
4. **Line Edge:** Isolated intensity change

---

### Gradient-Based Edge Detection

#### Image Gradient
The gradient is a 2D vector pointing in direction of greatest intensity increase.

**Formula:**
∇f = [∂f/∂x, ∂f/∂y] = [Gₓ, Gᵧ]

**Magnitude (Edge Strength):**
|∇f| = √(Gₓ² + Gᵧ²)
Approximation: |∇f| ≈ |Gₓ| + |Gᵧ| (faster)

**Direction (Edge Orientation):**
θ = atan2(Gᵧ, Gₓ)

---

### Classical Edge Detectors

#### 1. Sobel Operator
**Kernels:**
Gₓ = [-1  0  1]      Gᵧ = [-1  -2  -1]
     [-2  0  2]           [ 0   0   0]
     [-1  0  1]           [ 1   2   1]

**Characteristics:**
- Combines differentiation and smoothing
- 3×3 kernel
- Emphasizes pixels closer to center
- Good for moderately noisy images

**Extended Sobel (5×5, 7×7):**
- Better noise suppression
- Smoother gradients

#### 2. Prewitt Operator
Gₓ = [-1  0  1]      Gᵧ = [-1  -1  -1]
     [-1  0  1]           [ 0   0   0]
     [-1  0  1]           [ 1   1   1]
- Pure averaging (equal weights)
- Slightly more noise-sensitive than Sobel

#### 3. Roberts Cross Operator
Gₓ = [ 1   0]         Gᵧ = [ 0   1]
     [ 0  -1]              [-1   0]
- 2×2 kernel
- Diagonal difference
- Fast but very noise-sensitive
- Rarely used today

---

### Canny Edge Detector
**Developed by John Canny (1986) - Optimal Edge Detector**

#### Design Criteria (Goals):
1. **Good Detection:** Low error rate (few false positives/negatives)
2. **Good Localization:** Detected edges close to true edges
3. **Single Response:** Only one response per edge

#### Algorithm Steps:

**Step 1: Noise Reduction**
- Apply Gaussian filter to smooth image
- Typical: σ = 1.4, kernel size 5×5
- Formula: G(x,y) = (1/(2πσ²)) × e^(-(x²+y²)/(2σ²))

**Step 2: Gradient Calculation**
- Compute Gₓ and Gᵧ using Sobel operators
- Calculate magnitude: M(x,y) = √(Gₓ² + Gᵧ²)
- Calculate direction: θ(x,y) = atan2(Gᵧ, Gₓ)

**Step 3: Non-Maximum Suppression (NMS)**
- **Goal:** Thin edges to 1-pixel width
- Check if pixel is local maximum along gradient direction
- **Process:**
  1. Quantize gradient direction to 0°, 45°, 90°, 135°
  2. Compare pixel with two neighbors along gradient
  3. If not maximum, suppress (set to 0)

**Why NMS?** Gradient gives thick edges; NMS produces thin, precise edges

**Step 4: Double Thresholding**
- Use two thresholds: T_high and T_low
- Ratio typically: T_high / T_low = 2 or 3

**Classification:**
- M > T_high: **Strong edge** (definitely edge)
- M < T_low: **Non-edge** (discard)
- T_low ≤ M ≤ T_high: **Weak edge** (potential edge)

**Step 5: Edge Tracking by Hysteresis**
- **Goal:** Connect edge fragments, suppress noise
- **Rule:** Keep weak edges **only if connected** to strong edges
- **Implementation:** BFS/DFS from strong edges

**Algorithm:**
1. Mark all strong edges as final edges
2. For each weak edge:
   - If connected (8-connectivity) to strong edge → Keep
   - Else → Discard

---

### Laplacian of Gaussian (LoG)
**Combines:** Gaussian smoothing + Laplacian edge detection

#### Why LoG?
- Pure Laplacian extremely noise-sensitive
- Smoothing first (Gaussian) removes high-frequency noise
- Then Laplacian finds zero-crossings

**Mathematical Form:**
LoG(x,y) = -1/(πσ⁴) × [1 - (x² + y²)/(2σ²)] × e^(-(x² + y²)/(2σ²))

**Mexican Hat Function:** Shape resembles a sombrero

**Zero-Crossing Detection:**
- LoG produces zero value at edge center
- Detect sign changes in adjacent pixels
- More robust to noise than raw Laplacian

**Relationship to DoG (Difference of Gaussians):**
LoG ≈ DoG for σ₂/σ₁ ≈ 1.6
- DoG faster to compute
- Used in SIFT features

---

### Morphological Image Processing

#### Structuring Element (SE)
Small shape (kernel) used to probe/describe image structure.
- Common shapes: Rectangle, Cross, Disk, Diamond
- Size: 3×3, 5×5, etc.
- **Origin:** Reference point (usually center)

---

### Fundamental Operations

#### 1. Erosion
**Definition:** Shrinks/erodes boundaries of foreground objects.

**Mathematical:** (A ⊖ B)(x,y) = min{A(x+x', y+y') - B(x', y')}

**Binary Image:** Output pixel = 1 **only if** SE fits entirely in foreground

**Effects:**
- Removes small white noises (salt noise)
- Separates connected objects
- Shrinks objects
- Removes boundary pixels

**Applications:**
- Remove small noise particles
- Separate touching objects
- Find shape skeleton

#### 2. Dilation
**Definition:** Expands boundaries of foreground objects.

**Mathematical:** (A ⊕ B)(x,y) = max{A(x-x', y-y') + B(x', y')}

**Binary Image:** Output pixel = 1 if SE **overlaps** with foreground

**Effects:**
- Fills small holes (pepper noise)
- Connects nearby objects
- Enlarges objects
- Adds boundary pixels

**Applications:**
- Fill gaps in broken lines
- Connect nearby components
- Highlight features

#### Duality Property
Erosion and Dilation are **duals**:
(A ⊖ B)^c = A^c ⊕ B̂
- Eroding foreground = Dilating background
- B̂ = reflected structuring element

---

### Compound Operations

#### 3. Opening
**Definition:** Erosion followed by Dilation
A ∘ B = (A ⊖ B) ⊕ B

**Effects:**
- Removes small objects (less than SE)
- Smooths object contours
- Breaks narrow connections
- **Preserves size** of large objects

**Use Cases:**
- Remove salt noise (small bright spots)
- Separate connected objects at thin joints

**Properties:**
- **Idempotent:** (A ∘ B) ∘ B = A ∘ B
- A ∘ B ⊆ A (subimage)

#### 4. Closing
**Definition:** Dilation followed by Erosion  
A • B = (A ⊕ B) ⊖ B

**Effects:**
- Fills small holes (less than SE)
- Smooths object contours
- Fuses narrow breaks
- **Preserves size** of large objects

**Use Cases:**
- Remove pepper noise (small dark spots)
- Fill gaps in contours
- Connect nearby objects

**Properties:**
- **Idempotent:** (A • B) • B = A • B
- A ⊆ A • B (superimage)

---

### Advanced Morphological Operations

#### 5. Morphological Gradient
**External Gradient:** (A ⊕ B) - A (Dilation minus original)
**Internal Gradient:** A - (A ⊖ B) (Original minus erosion)
**Morphological Gradient:** (A ⊕ B) - (A ⊖ B)

**Effect:** Highlights object boundaries

#### 6. Top-Hat Transform
**White Top-Hat:** f - (f ∘ b)
- Extracts small bright elements

**Black Top-Hat:** (f • b) - f
- Extracts small dark elements

**Applications:**
- Enhance contrast
- Extract features smaller than SE

#### 7. Hit-or-Miss Transform
Used for **shape detection** in binary images.
- Requires two SEs: One for foreground, one for background
- Finds exact match of template

---

### Morphology on Grayscale Images

#### Grayscale Erosion
Takes **minimum** value under SE window.
- Shrinks bright regions
- Expands dark regions

#### Grayscale Dilation  
Takes **maximum** value under SE window.
- Expands bright regions
- Shrinks dark regions

**Applications:**
- Remove small bright/dark features
- Morphological smoothing
- Contrast enhancement

---

### Practical Applications

#### Noise Removal Strategy
1. **Salt Noise (white spots):** Opening
2. **Pepper Noise (black spots):** Closing
3. **Salt-and-Pepper:** Opening followed by Closing

#### Boundary Extraction
boundary = A - (A ⊖ B)

#### Region Filling
Iteratively dilate starting from seed point inside boundary:
Xₖ = (Xₖ₋₁ ⊕ B) ∩ A^c

#### Skeletonization
Iteratively erode while preserving connectivity.
- Reduces objects to 1-pixel-wide lines
- Preserves topology
            `
        }
    ]
};
