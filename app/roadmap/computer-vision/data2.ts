import { Unit } from './types';

export const section2Data: Unit = {
    id: "section-2",
    title: "Section 2: Image Enhancement & Filtering",
    description: "Techniques to improve image quality in spatial and frequency domains.",
    topics: [
        {
            id: "intensity-transforms",
            title: "Intensity Transformations",
            description: "Point processing operations for brightness and contrast adjustment.",
            details: `
## Intensity Transformations (Spatial Domain - Point Processing)

### Overview
Intensity transformations operate on single pixels, independent of their neighbors.
**General Form:** s = T(r)
- **r**: input intensity level
- **s**: output intensity level
- **T**: transformation function

---

### Basic Intensity Transformations

#### 1. Image Negatives
**Formula:** s = L - 1 - r
- L = number of intensity levels (256 for 8-bit)
- Reverses the intensity levels

**Applications:**
- Medical imaging: Better visibility of white/gray detail in dark regions (X-rays, mammograms)
- Film negatives processing

**Example:**
- Input black (0) → Output white (255)
- Input white (255) → Output black (0)

#### 2. Log Transformation
**Formula:** s = c × log(1 + r)
- c: scaling constant
- Compresses dynamic range of images with large variations in pixel values

**Why log(1 + r) instead of log(r)?**
- Avoids log(0) = undefined
- Maps 0 → 0

**Applications:**
- Fourier spectrum visualization (values in frequency domain vary greatly)
- Compressing dynamic range in images

**Characteristics:**
- Expands dark pixel values (brightens shadows)
- Compresses bright pixel values
- **Inverse log:** Opposite effect - s = c × (e^r - 1)

#### 3. Power-Law (Gamma) Transformation
**Formula:** s = c × r^γ
- γ (gamma): controls the shape of the curve
- c: normalization constant (usually 1)

**Gamma Values:**
- **γ < 1**: Image brightening (expands dark values, compresses bright)
  - Example: γ = 0.5, γ = 0.4
- **γ = 1**: Identity transformation (no change)
- **γ > 1**: Image darkening (compresses dark values, expands bright)
  - Example: γ = 2.0, γ = 2.5

**Gamma Correction:**
Different devices (monitors, printers) have different response curves. Gamma correction compensates for this.
- CRT monitors typically have γ ≈ 2.5
- Correction applies γ = 1/2.5 = 0.4 to linearize

**Applications:**
- Monitor calibration
- Correcting washed-out images
- Medical imaging enhancement

#### 4. Piecewise-Linear Transformation Functions

**Contrast Stretching:**
Increases the dynamic range of gray levels.
- (r₁, s₁) and (r₂, s₂) control the shape
- If r₁ = s₁ and r₂ = s₂: Identity (no change)
- If r₁ = r₂, s₁ = 0, s₂ = L-1: Thresholding function

**Gray-Level Slicing:**
Highlights specific range of gray levels.
- **Type 1**: Brighten range [A, B], darken everything else
- **Type 2**: Brighten range [A, B], preserve everything else

**Bit-Plane Slicing:**
Each pixel has 8 bits in an 8-bit image.
- **Most Significant Bit (MSB)**: Bit 7 - carries most visual information
- **Least Significant Bit (LSB)**: Bit 0 - appears random
- Useful for image compression and watermarking

---

### Histogram Processing

#### Understanding Image Histograms
A histogram is a graphical representation showing the frequency of each gray level.
**Formula:** h(rₖ) = nₖ
- rₖ: kth gray level
- nₖ: number of pixels with gray level rₖ

**Normalized Histogram (PDF):**
p(rₖ) = nₖ / n
- n = total number of pixels = M × N

**Histogram Characteristics:**
- **Dark image**: Histogram concentrated on left (low values)
- **Bright image**: Histogram concentrated on right (high values)
- **Low contrast**: Narrow histogram
- **High contrast**: Wide, spread-out histogram

#### Histogram Equalization (HE)
**Goal:** Transform image so histogram is approximately uniform (flat).

**Mathematical Derivation:**
For continuous variables, the transformation is:
s = T(r) = ∫₀ʳ pᵣ(w) dw

Discrete form:
sₖ = T(rₖ) = Σⱼ₌₀ᵏ p(rⱼ) = Σⱼ₌₀ᵏ (nⱼ/n)

**Algorithm Steps:**
1. Compute histogram of input image
2. Compute cumulative distribution function (CDF)
3. Normalize CDF to [0, L-1]
4. Map each input pixel to output using CDF

**Properties:**
- Fully automatic (no parameters)
- Works well for bi-modal histograms
- **Limitation:** Can over-enhance noise in regions with similar intensities
- **Not invertible** (information loss)

**When HE Fails:**
- Images where both foreground and background are bright
- Images where both are dark
- Solution: Adaptive Histogram Equalization

#### Adaptive Histogram Equalization (AHE)
Computes histogram equalization for small tiles/regions.

**CLAHE (Contrast Limited AHE):**
- **Problem with AHE:** Over-amplifies noise in homogeneous regions
- **Solution:** Clip histogram before computing CDF
- **Clip Limit:** Threshold to prevent over-amplification

**Parameters:**
- **Tile Size**: 8×8 or 16×16 typically
- **Clip Limit**: 2.0 to 4.0 (higher = more contrast)

**Applications:**
- Medical imaging (X-rays, CT scans)
- Underwater image enhancement
- Low-light photography

#### Histogram Matching (Specification)
Generate processed image with a **specified histogram**.

**Use Case:** Match histogram of one image to another (e.g., color correction across video frames)

**Algorithm:**
1. Equalize input image histogram → Get s
2. Equalize desired histogram → Get v  
3. Apply inverse transformation: z = G⁻¹(s)

---

### Using Histogram for Segmentation

#### Global Thresholding
**Formula:** 
g(x,y) = 1 if f(x,y) > T
g(x,y) = 0 if f(x,y) ≤ T

**Choosing Threshold T:**
- Manually (trial and error)
- Automatically using histogram analysis
- Peak-to-valley approach

#### Basic Global Thresholding Algorithm
1. Select initial estimate of T (e.g., average intensity)
2. Segment image using T into G₁ (pixels > T) and G₂ (pixels ≤ T)
3. Compute average intensities m₁ and m₂ for G₁ and G₂
4. Compute new threshold: T = (m₁ + m₂) / 2
5. Repeat steps 2-4 until T stabilizes

#### Otsu's Method (Optimal Thresholding)
Automatically finds threshold that **maximizes inter-class variance** (or minimizes intra-class variance).

**Between-Class Variance:**
σ²_B(T) = ω₀(T) × ω₁(T) × [μ₀(T) - μ₁(T)]²

Where:
- ω₀: Probability of class 0 (background)
- ω₁: Probability of class 1 (foreground)
- μ₀, μ₁: Mean intensities of each class

**Algorithm:**
1. Compute normalized histogram
2. For each threshold T from 0 to L-1:
   - Compute ω₀, ω₁, μ₀, μ₁
   - Compute σ²_B
3. Select T that maximizes σ²_B

**Advantages:**
- No user input required
- Works well for bimodal histograms
- Fast computation

**Limitations:**
- Assumes bimodal distribution
- Fails with unimodal histograms
- Sensitive to noise
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt

# ========================================
# 1. BASIC INTENSITY TRANSFORMATIONS
# ========================================

img = cv2.imread('low_contrast.jpg', 0)

# Image Negative
negative = 255 - img

# Log Transformation
c = 255 / np.log(1 + np.max(img))
log_transformed = c * np.log(1 + img)
log_transformed = np.array(log_transformed, dtype=np.uint8)

# Gamma Correction
def gamma_correction(img, gamma):
    """Apply gamma correction with normalization"""
    # Normalize to [0, 1]
    normalized = img / 255.0
    # Apply gamma
    corrected = np.power(normalized, gamma)
    # Scale back to [0, 255]
    return np.uint8(corrected * 255)

gamma_05 = gamma_correction(img, 0.5)  # Brighten
gamma_20 = gamma_correction(img, 2.0)  # Darken

# Using LUT (Look-Up Table) for faster gamma correction
def gamma_lut(gamma):
    """Create lookup table for gamma correction"""
    inv_gamma = 1.0 / gamma
    table = np.array([((i / 255.0) ** inv_gamma) * 255 
                      for i in range(256)]).astype("uint8")
    return table

table = gamma_lut(2.2)
gamma_fast = cv2.LUT(img, table)

# ========================================
# 2. PIECEWISE LINEAR TRANSFORMATIONS
# ========================================

# Contrast Stretching
def contrast_stretching(img, r1, s1, r2, s2):
    """
    Apply contrast stretching
    (r1, s1) and (r2, s2) define the transformation
    """
    img_stretched = img.copy().astype(float)
    
    # Region 1: 0 to r1
    mask1 = img <= r1
    img_stretched[mask1] = (s1 / r1) * img[mask1]
    
    # Region 2: r1 to r2
    mask2 = (img > r1) & (img <= r2)
    img_stretched[mask2] = ((s2 - s1) / (r2 - r1)) * (img[mask2] - r1) + s1
    
    # Region 3: r2 to 255
    mask3 = img > r2
    img_stretched[mask3] = ((255 - s2) / (255 - r2)) * (img[mask3] - r2) + s2
    
    return np.uint8(img_stretched)

stretched = contrast_stretching(img, 50, 0, 200, 255)

# Bit-plane Slicing
def extract_bit_plane(img, bit):
    """Extract specific bit plane (0-7)"""
    return ((img >> bit) & 1) * 255

bit_planes = [extract_bit_plane(img, i) for i in range(8)]

# ========================================
# 3. HISTOGRAM PROCESSING
# ========================================

# Calculate and plot histogram
hist = cv2.calcHist([img], [0], None, [256], [0, 256])

plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.imshow(img, cmap='gray')
plt.title('Original Image')
plt.subplot(1, 2, 2)
plt.plot(hist)
plt.title('Histogram')
plt.xlabel('Pixel Intensity')
plt.ylabel('Frequency')

# Global Histogram Equalization
hist_eq = cv2.equalizeHist(img)

# CLAHE (Contrast Limited Adaptive Histogram Equalization)
clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
clahe_img = clahe.apply(img)

# Compare results
hist_eq_hist = cv2.calcHist([hist_eq], [0], None, [256], [0, 256])
clahe_hist = cv2.calcHist([clahe_img], [0], None, [256], [0, 256])

# ========================================
# 4. MANUAL HISTOGRAM EQUALIZATION
# ========================================

def manual_histogram_equalization(img):
    """
    Implement histogram equalization from scratch
    for better understanding
    """
    # Get image dimensions
    h, w = img.shape
    n_pixels = h * w
    
    # Calculate histogram
    hist, bins = np.histogram(img.flatten(), 256, [0, 256])
    
    # Calculate CDF (Cumulative Distribution Function)
    cdf = hist.cumsum()
    
    # Normalize CDF to [0, 255]
    cdf_normalized = cdf * 255 / cdf[-1]
    
    # Use linear interpolation to find new pixel values
    img_equalized = np.interp(img.flatten(), bins[:-1], cdf_normalized)
    
    return img_equalized.reshape(img.shape).astype(np.uint8)

manual_eq = manual_histogram_equalization(img)

# ========================================
# 5. THRESHOLDING
# ========================================

# Simple binary thresholding
ret, thresh_binary = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)

# Otsu's thresholding (automatic threshold selection)
ret_otsu, thresh_otsu = cv2.threshold(img, 0, 255, 
                                       cv2.THRESH_BINARY + cv2.THRESH_OTSU)
print(f"Otsu's optimal threshold: {ret_otsu}")

# Manual Otsu implementation for understanding
def otsu_threshold(img):
    """
    Implement Otsu's method from scratch
    """
    # Calculate normalized histogram
    hist = cv2.calcHist([img], [0], None, [256], [0, 256]).flatten()
    hist_norm = hist / hist.sum()
    
    # Calculate cumulative sums and means
    cum_sum = np.cumsum(hist_norm)
    cum_mean = np.cumsum(hist_norm * np.arange(256))
    global_mean = cum_mean[-1]
    
    # Calculate between-class variance for all thresholds
    between_class_variance = np.zeros(256)
    
    for t in range(256):
        # Weight of background class
        w0 = cum_sum[t]
        # Weight of foreground class
        w1 = 1 - w0
        
        if w0 == 0 or w1 == 0:
            continue
            
        # Mean of background class
        m0 = cum_mean[t] / w0 if w0 > 0 else 0
        # Mean of foreground class  
        m1 = (global_mean - cum_mean[t]) / w1 if w1 > 0 else 0
        
        # Between-class variance
        between_class_variance[t] = w0 * w1 * (m0 - m1) ** 2
    
    # Find threshold that maximizes between-class variance
    optimal_threshold = np.argmax(between_class_variance)
    
    return optimal_threshold

manual_otsu_t = otsu_threshold(img)
print(f"Manual Otsu threshold: {manual_otsu_t}")

# ========================================
# 6. ADAPTIVE THRESHOLDING
# ========================================

# Adaptive Mean Thresholding
adaptive_mean = cv2.adaptiveThreshold(img, 255, 
                                      cv2.ADAPTIVE_THRESH_MEAN_C,
                                      cv2.THRESH_BINARY, 11, 2)

# Adaptive Gaussian Thresholding
adaptive_gaussian = cv2.adaptiveThreshold(img, 255,
                                          cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                          cv2.THRESH_BINARY, 11, 2)
`
        },
        {
            id: "spatial-filtering",
            title: "Spatial Filtering Techniques",
            description: "Smoothing and sharpening using convolution kernels.",
            details: `
## Spatial Filtering (Neighborhood Processing)

### Fundamentals of Spatial Filtering

**Definition:** Using a filter mask (kernel) that moves through the image and performs a mathematical operation on pixel neighborhoods.

**General Process:**
1. Place kernel center on pixel (x, y)
2. Multiply kernel coefficients with corresponding pixel values
3. Sum all products
4. Result becomes output pixel value

**Notation:**
- **Correlation:** g(x,y) = w ⊗ f
- **Convolution:** g(x,y) = w ∗ f

**Difference:**
- **Correlation**: Filter slides as-is
- **Convolution**: Filter is rotated 180°
- For symmetric filters (like Gaussian), both produce identical results

---

### Smoothing (Low-Pass) Filters

#### Purpose
- Noise reduction (blurring)
- Remove small details before extracting large objects
- Bridge small gaps in lines or curves

#### 1. Mean Filter (Box Filter)
**Kernel (3×3):**
1/9 × [1  1  1]
      [1  1  1]
      [1  1  1]

**Properties:**
- Replaces pixel with average of neighborhood
- Simple, fast
- **Drawback:** Blurs edges significantly

**Weighted Average:**
- Center pixel given more weight
- Example: [1, 2, 1; 2, 4, 2; 1, 2, 1] / 16

#### 2. Gaussian Filter
**Formula (2D):**
G(x,y) = (1/(2πσ²)) × e^(-(x² + y²)/(2σ²))

**Properties:**
- Bell-shaped curve
- σ (sigma) controls spread/blur amount
- Weights decrease with distance from center
- **Isotropic:** Rotation-invariant
- Separable: Can apply 1D filter in x, then y (faster)

**Why Gaussian?**
- Mathematically optimal for many applications
- No negative weights (preserves image brightness)
- Central Limit Theorem: Repeated convolutions approach Gaussian
- Frequency domain: Gaussian remains Gaussian

**Kernel Size Selection:**
- Rule of thumb: Size ≥ 6σ + 1
- σ = 0.5: Small blur
- σ = 2.0: Strong blur

#### 3. Median Filter (Non-linear)
**Operation:**
- Replace pixel with **median** of neighborhood
- Not based on convolution!

**Algorithm:**
1. Extract neighborhood (e.g., 3×3 window)
2. Sort all values
3. Select middle value

**Key Advantage:**
- **Best for Salt-and-Pepper Noise**
- Preserves edges better than mean filter
- Removes outliers effectively

**Why Median Preserves Edges:**
- Edge pixels are not averaged
- Sharp transitions remain intact

#### 4. Bilateral Filter (Edge-Preserving)
Combines **spatial** and **intensity** filtering.

**Formula:**
BF[I]ₚ = (1/Wₚ) Σ_q I_q × G_σs(||p-q||) × G_σr(|Iₚ-I_q|)

Where:
- G_σs: Spatial Gaussian (distance)
- G_σr: Range Gaussian (intensity difference)

**Behavior:**
- Nearby pixels with **similar intensity**: High weight (smooth)
- Nearby pixels with **different intensity**: Low weight (preserve edge)

**Applications:**
- Noise reduction while preserving edges
- Photography (portrait smoothing)
- HDR tone mapping

---

### Sharpening (High-Pass) Filters

#### Purpose
- Enhance edges and fine details
- Compensate for blur
- Medical imaging, print reproduction

#### 1. Derivative-Based Sharpening

**First Derivative (Gradient):**
- Measures rate of change
- **Properties:**
  - Zero in constant regions
  - Non-zero at onset of step/ramp
  - Non-zero along ramps

**Roberts Cross Operator:**
Gx = [-1  0]    Gy = [ 0   1]
     [ 0  1]         [-1   0]

**Prewitt Operator:**
Gx = [-1  0  1]    Gy = [-1  -1  -1]
     [-1  0  1]         [ 0   0   0]
     [-1  0  1]         [ 1   1   1]

**Sobel Operator (Most Common):**
Gx = [-1  0  1]    Gy = [-1  -2  -1]
     [-2  0  2]         [ 0   0   0]
     [-1  0  1]         [ 1   2   1]
- Includes averaging (smoothing) effect
- Less noise-sensitive than Roberts/Prewitt
- **Magnitude:** G = √(Gx² + Gy²)
- **Direction:** θ = atan2(Gy, Gx)

**Second Derivative (Laplacian):**
∇²f = ∂²f/∂x² + ∂²f/∂y²

**Discrete Laplacian Kernel:**
[ 0  -1   0]    or    [-1  -1  -1]
[-1   4  -1]          [-1   8  -1]
[ 0  -1   0]          [-1  -1  -1]

**Properties:**
- Isotropic (rotation-invariant)
- Highlights regions of rapid intensity change
- **Very sensitive to noise**
- Zero-crossing detection for edges

#### 2. Unsharp Masking
Classic sharpening technique.

**Steps:**
1. Blur original image: f_blur = Gaussian(f)
2. Subtract blur from original: mask = f - f_blur
3. Add mask back: g = f + k × mask

**Combined:** g(x,y) = f(x,y) + k × [f(x,y) - f_blur(x,y)]

**Parameters:**
- k = 1: Standard sharpening  
- k > 1: Strong sharpening (may introduce halos)
- k < 1: Mild sharpening

**Highboost Filtering:**
g = A × f - f_blur
- A ≥ 1 controls boosting
- A = 1: Standard unsharp mask

#### 3. Laplacian Sharpening
**Formula:** g(x,y) = f(x,y) - ∇²f(x,y)

**Why subtract?**
- Laplacian kernel with positive center gives negative edges
- Subtracting negative values adds them back

**Common Combined Kernel:**
[ 0  -1   0]  (for 4-conn)    [-1  -1  -1]  (for 8-conn)
[-1   5  -1]                   [-1   9  -1]
[ 0  -1   0]                   [-1  -1  -1]

---

### Order-Statistic Filters (Non-linear)

#### Min Filter
- Takes minimum value in neighborhood
- **Effect:** Reduces bright points (salt noise)
- Darkens image

#### Max Filter  
- Takes maximum value in neighborhood
- **Effect:** Reduces dark points (pepper noise)
- Brightens image

#### Midpoint Filter
Output = (min + max) / 2
- Works best with random noise (Gaussian, uniform)
- Combines order-statistic and averaging

#### Alpha-Trimmed Mean Filter
**Algorithm:**
1. Sort neighborhood pixels
2. Delete d/2 lowest and d/2 highest values
3. Average remaining pixels

**Special Cases:**
- d = 0: Arithmetic mean filter
- d = mn-1: Median filter (m×n kernel)

**Use Case:** Multiple noise types present
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt

# ========================================
# SPATIAL FILTERING EXAMPLES
# ========================================

img = cv2.imread('image.jpg', 0)

# ========================================
# 1. SMOOTHING FILTERS
# ========================================

# Mean Filter (Box Filter)
mean_3x3 = cv2.blur(img, (3, 3))
mean_5x5 = cv2.blur(img, (5, 5))

# Custom mean filter using cv2.filter2D
kernel_mean = np.ones((5,5), np.float32) / 25
mean_custom = cv2.filter2D(img, -1, kernel_mean)

# Gaussian Filter
gaussian = cv2.GaussianBlur(img, (5, 5), 0)
gaussian_sigma = cv2.GaussianBlur(img, (5, 5), sigmaX=1.5)

# Manual Gaussian kernel
def gaussian_kernel(size, sigma=1):
    """Generate a Gaussian kernel"""
    kernel = np.fromfunction(
        lambda x, y: (1/(2*np.pi*sigma**2)) * 
                     np.exp(-((x-(size-1)/2)**2 + (y-(size-1)/2)**2)/(2*sigma**2)),
        (size, size)
    )
    return kernel / np.sum(kernel)

gauss_kernel = gaussian_kernel(5, sigma=1.0)
gaussian_manual = cv2.filter2D(img, -1, gauss_kernel)

# Median Filter
median = cv2.medianBlur(img, 5)

# Bilateral Filter (edge-preserving)
bilateral = cv2.bilateralFilter(img, d=9, sigmaColor=75, sigmaSpace=75)

# ========================================
# 2. SHARPENING FILTERS
# ========================================

# Laplacian
laplacian = cv2.Laplacian(img, cv2.CV_64F)
laplacian_abs = np.uint8(np.absolute(laplacian))

# Sobel Operator
sobelx = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)  # X-direction
sobely = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)  # Y-direction

# Magnitude and direction
magnitude = np.sqrt(sobelx**2 + sobely**2)
direction = np.arctan2(sobely, sobelx)

# Combined Sobel
sobel_combined = np.uint8(np.absolute(magnitude))

# Prewitt Operator (manual)
kernelx = np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]])
kernely = np.array([[-1, -1, -1], [0, 0, 0], [1, 1, 1]])
prewittx = cv2.filter2D(img, -1, kernelx)
prewitty = cv2.filter2D(img, -1, kernely)

# Roberts Cross Operator
roberts_x = np.array([[1, 0], [0, -1]])
roberts_y = np.array([[0, 1], [-1, 0]])
robertsx = cv2.filter2D(img, -1, roberts_x)
robertsy = cv2.filter2D(img, -1, roberts_y)

# ========================================
# 3. UNSHARP MASKING
# ========================================

def unsharp_mask(image, kernel_size=(5, 5), sigma=1.0, amount=1.0, threshold=0):
    """
    Apply unsharp masking for image sharpening
    
    Args:
        image: Input image
        kernel_size: Gaussian kernel size
        sigma: Gaussian sigma
        amount: Strength of sharpening
        threshold: Threshold for masking
    """
    # Blur the image
    blurred = cv2.GaussianBlur(image, kernel_size, sigma)
    
    # Calculate the mask
    mask = cv2.subtract(image, blurred)
    
    # Apply threshold if needed
    if threshold > 0:
        _, mask = cv2.threshold(mask, threshold, 255, cv2.THRESH_BINARY)
    
    # Add weighted mask back to original
    sharpened = cv2.addWeighted(image, 1.0, mask, amount, 0)
    
    return sharpened

# Apply unsharp masking
sharpened = unsharp_mask(img, amount=1.5)

# ========================================
# 4. LAPLACIAN SHARPENING
# ========================================

# Method 1: Using cv2.Laplacian
laplacian = cv2.Laplacian(img, cv2.CV_64F)
sharpened_lap = cv2.subtract(img.astype(np.float64), laplacian)
sharpened_lap = np.clip(sharpened_lap, 0, 255).astype(np.uint8)

# Method 2: Using combined kernel
kernel_sharpen = np.array([[0, -1, 0],
                          [-1, 5, -1],
                          [0, -1, 0]])
sharpened_kernel = cv2.filter2D(img, -1, kernel_sharpen)

# Method 3: 8-connected Laplacian
kernel_sharpen_8 = np.array([[-1, -1, -1],
                             [-1, 9, -1],
                             [-1, -1, -1]])
sharpened_8conn = cv2.filter2D(img, -1, kernel_sharpen_8)

# ========================================
# 5. ORDER-STATISTIC FILTERS
# ========================================

# Morphological operations can be used as order-statistic filters
kernel = np.ones((5,5), np.uint8)

# Min Filter (Erosion)
min_filter = cv2.erode(img, kernel, iterations=1)

# Max Filter (Dilation)
max_filter = cv2.dilate(img, kernel, iterations=1)

# Midpoint Filter (manual implementation)
def midpoint_filter(img, kernel_size=5):
    """Apply midpoint filter"""
    result = img.copy()
    pad = kernel_size // 2
    padded = cv2.copyMakeBorder(img, pad, pad, pad, pad, cv2.BORDER_REFLECT)
    
    for i in range(pad, padded.shape[0] - pad):
        for j in range(pad, padded.shape[1] - pad):
            window = padded[i-pad:i+pad+1, j-pad:j+pad+1]
            result[i-pad, j-pad] = (np.min(window) + np.max(window)) // 2
    
    return result

midpoint = midpoint_filter(img)

# Alpha-Trimmed Mean Filter
def alpha_trimmed_mean(img, kernel_size=5, d=4):
    """
    Apply alpha-trimmed mean filter
    
    Args:
        img: Input image
        kernel_size: Size of the kernel
        d: Number of values to trim (d/2 from each end)
    """
    result = img.copy().astype(np.float64)
    pad = kernel_size // 2
    padded = cv2.copyMakeBorder(img, pad, pad, pad, pad, cv2.BORDER_REFLECT)
    
    for i in range(pad, padded.shape[0] - pad):
        for j in range(pad, padded.shape[1] - pad):
            window = padded[i-pad:i+pad+1, j-pad:j+pad+1].flatten()
            window_sorted = np.sort(window)
            # Remove d/2 smallest and d/2 largest
            trimmed = window_sorted[d//2:-(d//2)]
            result[i-pad, j-pad] = np.mean(trimmed)
    
    return result.astype(np.uint8)

alpha_trimmed = alpha_trimmed_mean(img, kernel_size=5, d=4)

# ========================================
# 6. COMPARISON VISUALIZATION
# ========================================

plt.figure(figsize=(15, 10))

images = [
    (img, 'Original'),
    (mean_5x5, 'Mean Filter'),
    (gaussian, 'Gaussian Filter'),
    (median, 'Median Filter'),
    (bilateral, 'Bilateral Filter'),
    (sharpened, 'Unsharp Mask'),
    (sobel_combined, 'Sobel Edge'),
    (laplacian_abs, 'Laplacian'),
]

for idx, (image, title) in enumerate(images):
    plt.subplot(2, 4, idx + 1)
    plt.imshow(image, cmap='gray')
    plt.title(title)
    plt.axis('off')

plt.tight_layout()
plt.show()

# ========================================
# 7. NOISE REMOVAL COMPARISON
# ========================================

# Add salt and pepper noise
def add_salt_pepper(img, salt_prob=0.01, pepper_prob=0.01):
    """Add salt and pepper noise to image"""
    noisy = img.copy()
    # Salt noise
    salt = np.random.rand(*img.shape) < salt_prob
    noisy[salt] = 255
    # Pepper noise
    pepper = np.random.rand(*img.shape) < pepper_prob
    noisy[pepper] = 0
    return noisy

noisy_img = add_salt_pepper(img)

# Compare filters on noisy image
mean_denoised = cv2.blur(noisy_img, (5, 5))
gaussian_denoised = cv2.GaussianBlur(noisy_img, (5, 5), 0)
median_denoised = cv2.medianBlur(noisy_img, 5)

print("Median filter is superior for salt-and-pepper noise!")
`
        }
    ]
};
