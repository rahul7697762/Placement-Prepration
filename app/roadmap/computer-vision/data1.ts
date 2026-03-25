import { Unit, MCQ } from './types';

export const section1Data: Unit = {
    id: "unit-1",
    title: "Unit I: Fundamentals of Image Processing",
    description: "Introduction to image processing, image enhancement, and noise removal & filtering.",
    topics: [
        {
            id: "intro-image-processing",
            title: "Introduction to Image Processing & Computer Vision",
            description: "Key differences between image processing and computer vision, applications, and image file formats.",
            details: `
## Introduction to Image Processing

### What is Digital Image Processing?

A **digital image** is a two-dimensional function f(x, y), where x and y are spatial (plane) coordinates, and the amplitude of f at any pair of coordinates (x, y) is called the **intensity** or **gray level** of the image at that point.

When x, y, and the amplitude values of f are all finite, discrete quantities, we call the image a **digital image**.

- **Input:** An image (raw, noisy, low-contrast, etc.)
- **Processing:** Mathematical operations on pixel values
- **Output:** Either an improved image OR extracted features/characteristics

Digital image processing covers:
1. **Low-level processing** – noise removal, contrast enhancement, sharpening
2. **Mid-level processing** – segmentation, object description
3. **High-level processing** – making sense of objects (computer vision)

---

### What is Computer Vision?

Computer vision is a field of artificial intelligence that aims to replicate and extend human visual perception in machines. It enables computers to derive **meaningful high-level information** from digital images, video, or other visual inputs.

- **Input:** An image or video stream
- **Output:** Scene interpretation, object labels, decisions, 3D models
- **Core philosophy:** "See and understand" rather than "see and transform"

---

### Key Differences: Image Processing vs Computer Vision

| Aspect | Image Processing | Computer Vision |
|--------|-----------------|-----------------|
| **Primary Goal** | Improve image quality or extract low-level features | Understand scene content, make decisions |
| **Input** | Digital image/video | Digital image/video |
| **Output** | Modified image or numerical feature data | High-level description, recognition, decisions |
| **Level of Analysis** | Low-level (pixel operations) | High-level (semantic understanding) |
| **Intelligence Required** | Minimal (rule-based math) | High (ML/DL models, reasoning) |
| **Examples** | Noise removal, contrast stretch, histogram EQ | Object detection, face recognition, scene understanding |
| **Techniques** | Filters, DFT, morphological ops, histograms | CNNs, RNNs, transformers, SLAM, stereo vision |
| **Human Interpretation** | Not required (mathematical operations) | Goal is to replicate human understanding |
| **Processing Speed** | Generally fast | Can be computationally expensive |
| **Training Data** | Not typically needed | Often requires large labeled datasets |

> **Key insight:** Image Processing is a **tool** used within Computer Vision. A typical pipeline is:
> Raw Image → **Image Processing** (enhance, denoise) → **Computer Vision** (detect, recognize, decide)

---

### Applications of Image Processing

#### 1. Medical Imaging
- X-ray enhancement for better bone/tissue visibility
- MRI and CT scan noise reduction
- Tumor boundary detection
- Mammography screening
- Retinal image analysis for diabetic retinopathy

#### 2. Remote Sensing & Satellite Imagery
- Land cover classification
- Vegetation index computation (NDVI)
- Flood/fire/drought detection
- Urban sprawl monitoring

#### 3. Document Processing
- OCR (Optical Character Recognition) preprocessing
- Binary thresholding for document scanning
- Skew correction of scanned pages
- Barcode and QR code reading

#### 4. Photography & Cinematography
- HDR (High Dynamic Range) imaging
- Noise reduction in low-light photos
- Image stabilization
- Depth-of-field simulation

#### 5. Industrial Inspection
- PCB defect detection
- Surface scratch and crack inspection
- Dimensional measurement using machine vision
- Product sorting by color, shape, size

#### 6. Security & Forensics
- Fingerprint enhancement and matching
- Face image restoration
- License plate recognition
- Surveillance video analysis

---

### Applications of Computer Vision

#### 1. Autonomous Vehicles
- Lane line detection
- Pedestrian and obstacle detection
- Traffic sign recognition
- 3D scene reconstruction using LiDAR + cameras

#### 2. Facial Recognition
- Unlock systems (iPhone Face ID)
- Attendance management
- Law enforcement (surveillance matching)
- Emotion and age estimation

#### 3. Medical Diagnosis (AI-assisted)
- Diabetic retinopathy classification from fundus images
- Skin lesion classification (benign vs malignant)
- COVID-19 detection from chest X-rays
- Polyp detection in colonoscopy

#### 4. Augmented & Virtual Reality
- Marker-based AR (detecting fiducial markers)
- SLAM (Simultaneous Localization and Mapping)
- Hand gesture recognition
- Body pose estimation

#### 5. Robotics
- Object grasping using visual feedback
- Obstacle avoidance
- Navigation in unknown environments

#### 6. Agriculture (Precision Farming)
- Crop disease detection from drone imagery
- Weed vs crop classification
- Irrigation planning via NDVI mapping

#### 7. Retail & E-commerce
- Amazon Go: cashierless checkout using cameras
- Visual product search (Google Lens)
- Inventory shelf monitoring

---

### Image File Formats

An image file format is a standardized way of organizing and storing digital images. Formats differ in:
- **Compression:** Lossless vs Lossy
- **Color depth:** 1-bit, 8-bit, 16-bit, HDR
- **Transparency support:** Alpha channel
- **Color spaces supported**

#### Lossless Formats (No quality loss on compression)

**BMP (Bitmap Image File)**
- Little or no compression (Run-Length Encoding optional)
- Simple structure: file header + pixel array
- Large file sizes (stores every pixel raw)
- Native Windows format
- **Best for:** Raw uncompressed data, simple applications
- **Color depth:** 1, 4, 8, 16, 24, 32-bit

**PNG (Portable Network Graphics)**
- Lossless compression using DEFLATE (LZ77 + Huffman coding)
- Supports **transparency** (alpha channel, 8 or 16-bit)
- Supports: RGB, RGBA, Grayscale, Indexed color
- Better than GIF for non-animated images
- **Best for:** Web graphics, screenshots, logos, text overlays
- **Not ideal for:** Photographs (large file size vs JPEG)

**TIFF (Tagged Image File Format)**
- Can be lossless or lossy compressed
- Supports multiple pages (multi-page documents)
- Rich metadata support (EXIF, IPTC, XMP)
- Supports: 8-bit, 16-bit, 32-bit (HDR) per channel
- **Best for:** Medical imaging, professional photography, archival, printing workflows
- **Color spaces:** RGB, CMYK, Lab, YCbCr

**GIF (Graphics Interchange Format)**
- Lossless LZW compression
- **Limited to 256 colors** (8-bit palette)
- Supports frame-based animation
- Supports 1-bit transparency (binary, not alpha)
- **Best for:** Simple animations, icons with few colors
- **Not suitable for:** Photographs, gradient-rich images

**WebP (by Google, Lossless mode)**
- Lossless uses LZ77 + Huffman coding (like PNG but ~26% smaller)
- Supports alpha channel in lossless mode

---

#### Lossy Formats (Quality reduced to achieve compression)

**JPEG (Joint Photographic Experts Group)**
- Compression: **DCT (Discrete Cosine Transform)** based
  1. Convert RGB → YCbCr (chroma subsampling)
  2. Divide into 8×8 blocks
  3. Apply 2D DCT to each block
  4. Quantize DCT coefficients (lossy step)
  5. Entropy code (Huffman / arithmetic coding)
- **Quality factor:** 1–100 (higher = less compression, better quality)
- **Artifacts:** "Blocky" regions and ringing at high compression
- **Does NOT support transparency**
- **Best for:** Natural photographs, complex images with gradients
- **Not ideal for:** Text, sharp edges, logos (JPEG artifacts visible)

**WebP (by Google, Lossy mode)**
- Based on VP8 video codec's intra-frame coding
- Combines DCT (like JPEG) with predictive coding
- **25–34% smaller** than JPEG at equivalent quality
- Supports both transparency and animation
- **Best for:** Web images where bandwidth matters

**HEIF/HEIC (High Efficiency Image File Format)**
- Based on HEVC/H.265 video codec
- ~50% smaller than JPEG at same perceptual quality
- Supports 16-bit color, depth maps, HDR
- Default format on iPhone (iOS 11+)
- Limited browser support (mainly Safari)

---

#### Format Comparison Table

| Format | Compression | Transparency | Animation | Best Use |
|--------|-------------|--------------|-----------|----------|
| **BMP** | None/RLE | No | No | Raw pixel editing |
| **PNG** | Lossless (DEFLATE) | Yes (alpha) | No | Web graphics, screenshots |
| **TIFF** | Lossless/Lossy | Yes | Multi-page | Professional, medical |
| **GIF** | Lossless (LZW) | 1-bit | Yes | Simple animations |
| **JPEG** | Lossy (DCT) | No | No | Photographs |
| **WebP** | Both | Yes | Yes | Modern web |
| **HEIC** | Lossy (HEVC) | Yes | Yes | Mobile photos |

---

#### Color Depth and Representation

| Type | Bits/Pixel | Gray Levels / Colors | Usage |
|------|-----------|---------------------|-------|
| Binary | 1 | 2 (black/white) | Document scans |
| Grayscale | 8 | 256 gray levels | Medical, surveillance |
| True Color | 24 | 16.7 million colors (RGB) | Photography |
| Deep Color | 48 | 281 trillion (RGB 16-bit/ch) | Professional editing, HDR |
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt
import os

# ========================================
# 1. LOADING AND INSPECTING IMAGES
# ========================================

# Load image in different modes
img_color = cv2.imread('image.jpg', cv2.IMREAD_COLOR)       # BGR (3 channels)
img_gray  = cv2.imread('image.jpg', cv2.IMREAD_GRAYSCALE)   # Single channel
img_alpha = cv2.imread('image.png', cv2.IMREAD_UNCHANGED)   # With alpha channel

# Image properties
print(f"Shape     : {img_color.shape}")    # (Height, Width, Channels)
print(f"Data type : {img_color.dtype}")    # uint8 (0-255 per channel)
print(f"Min/Max   : {img_color.min()} / {img_color.max()}")
print(f"Total px  : {img_color.shape[0] * img_color.shape[1]:,}")

# ========================================
# 2. COLOR SPACE CONVERSIONS
# ========================================

img_rgb  = cv2.cvtColor(img_color, cv2.COLOR_BGR2RGB)    # BGR → RGB
gray     = cv2.cvtColor(img_color, cv2.COLOR_BGR2GRAY)   # BGR → Grayscale
hsv      = cv2.cvtColor(img_color, cv2.COLOR_BGR2HSV)    # BGR → HSV
lab      = cv2.cvtColor(img_color, cv2.COLOR_BGR2Lab)    # BGR → CIE L*a*b*
ycrcb    = cv2.cvtColor(img_color, cv2.COLOR_BGR2YCrCb)  # BGR → YCrCb (JPEG)

h, s, v  = cv2.split(hsv)
print(f"HSV range: H[0-180], S[0-255], V[0-255]")

# ========================================
# 3. SAVING IN DIFFERENT FORMATS
# ========================================

cv2.imwrite('output.bmp', img_color)                            # Uncompressed BMP
cv2.imwrite('output.png', img_color)                            # Lossless PNG
cv2.imwrite('output_q90.jpg', img_color,                        # JPEG quality=90
            [cv2.IMWRITE_JPEG_QUALITY, 90])
cv2.imwrite('output_q10.jpg', img_color,                        # High compression
            [cv2.IMWRITE_JPEG_QUALITY, 10])
cv2.imwrite('output.webp', img_color,                           # WebP
            [cv2.IMWRITE_WEBP_QUALITY, 90])

# ========================================
# 4. COMPARING FILE SIZES
# ========================================

files = {
    'BMP (raw)':        'output.bmp',
    'PNG (lossless)':   'output.png',
    'JPEG Q=90':        'output_q90.jpg',
    'JPEG Q=10':        'output_q10.jpg',
    'WebP':             'output.webp',
}
for label, fname in files.items():
    if os.path.exists(fname):
        sz = os.path.getsize(fname)
        print(f"{label:20s}: {sz:8,d} bytes  ({sz/1024:.1f} KB)")

# ========================================
# 5. BASIC PIXEL OPERATIONS
# ========================================

# Access and modify pixel values
px = img_color[100, 200]              # pixel at row=100, col=200
print(f"BGR: B={px[0]}, G={px[1]}, R={px[2]}")

img_copy = img_color.copy()
img_copy[50:150, 50:150] = [0, 0, 255]   # Draw a red square
`
        },
        {
            id: "image-enhancement",
            title: "Image Enhancement",
            description: "Contrast enhancement, histogram equalization, and histogram specification.",
            details: `
## Image Enhancement

Image enhancement is the process of improving the visual appearance of an image OR converting it to a form better suited for subsequent processing and analysis.

> **Key principle:** Enhancement does not add new information — it makes existing information more visible or useful.

Enhancement techniques fall into two broad categories:
1. **Spatial domain methods** – operate directly on pixels
2. **Frequency domain methods** – operate on the Fourier transform of the image

---

## 1. Contrast Enhancement

**Contrast** = the difference in luminance or color that makes objects distinguishable. Low contrast images appear washed out or too dark.

### 1.1 Linear Contrast Stretching (Min-Max Normalization)

Maps the input range [r_min, r_max] to the full output range [0, L−1].

**Formula:**
\`\`\`
s = (r - r_min) / (r_max - r_min) × (L - 1)
\`\`\`

Where:
- r = input pixel value
- r_min, r_max = minimum and maximum input pixel values
- L = number of gray levels (typically 256)
- s = output pixel value

**Example:**
- If input range is [50, 200] and L = 256
- Pixel with value 50 → maps to 0
- Pixel with value 200 → maps to 255
- Linear stretch in between

**Limitation:** Sensitive to outliers (even one bright pixel can compress the rest of the image).

**Robust variant:** Percentile stretching — ignore the bottom and top 2% of intensities before stretching.

---

### 1.2 Piecewise Linear Contrast Stretching

Applies different linear mappings to different intensity ranges:

\`\`\`
       s
       |   /
       |  /
       | /________       (compress highlights)
       |/
s_2    +---/
       |  /
s_1    | /
       |/ 
       +--+----+---→ r
          r_1  r_2
\`\`\`

- **r < r_1:** Dark region (expanded in output)
- **r_1 ≤ r ≤ r_2:** Mid-range (unchanged or emphasized)
- **r > r_2:** Bright region (compressed in output)

Useful for highlighting specific intensity bands (e.g., enhance soft tissue in X-ray while suppressing bone brightness).

---

### 1.3 Gamma Correction (Power-Law Transform)

**Formula:** s = c × r^γ

Where c is a constant (usually 1), and γ (gamma) controls the shape of the curve.

| γ Value | Effect | Use Case |
|---------|--------|----------|
| γ < 1 | Brightens dark pixels | Underexposed images |
| γ = 1 | No change (identity) | — |
| γ > 1 | Darkens bright pixels | Overexposed images |
| γ = 0.5 | Significant brightening | Very dark images |
| γ = 2.5 | Significant darkening | Very bright/washed-out images |

**Why it's important:**
- CRT monitors had γ ≈ 2.2 (power-law response)
- Camera sensors are linear but displays are non-linear → **gamma correction bridges the gap**
- Video standards (sRGB, Rec.709) define specific gamma curves
- Used in High Dynamic Range (HDR) tone mapping

---

### 1.4 Log Transform

**Formula:** s = c × log(1 + r)

Where c is a scaling constant.

**Effect:**
- Expands the range of dark pixel values
- Compresses the range of bright pixel values
- Maps a wide dynamic range to a narrower range

**Use cases:**
- Displaying Fourier spectrum (values range from 1 to ~10^6, log makes it viewable)
- Enhancing details in very dark image regions
- Compression of high-dynamic-range data

**Inverse Log Transform (Exponential):** To reverse: r = e^s − 1

---

### 1.5 Negative Image (Linear Inversion)

**Formula:** s = (L − 1) − r

Reverses the intensity: dark becomes bright and vice versa.

**Use cases:**
- Medical X-rays (white bones on black background → black bones on white for some analyses)
- Highlighting fine white detail embedded in dark regions

---

## 2. Histogram Equalization

### What is a Histogram?

A **gray-level histogram** H(r_k) counts the number of pixels at each intensity level r_k (0 to L−1) in the image.

**Normalized histogram (probability):** p(r_k) = H(r_k) / (M × N)

Where M × N is the total number of pixels.

A histogram shows the **tonal distribution** of an image:
- **Left-heavy (dark):** Low brightness image
- **Right-heavy (bright):** Overexposed / washed-out image
- **Wide spread:** High contrast
- **Narrow peak:** Low contrast

---

### What is Histogram Equalization?

Histogram Equalization is a technique to **redistribute pixel intensities** to achieve a more uniform (flat) histogram, thereby enhancing global contrast automatically.

**Goal:** Transform the input image so its histogram is approximately uniform — every intensity level is used equally.

### Mathematical Derivation

For a continuous image with PDF p_r(r), we seek a transformation s = T(r) such that p_s(s) is uniform.

**The answer is the CDF:**
s = T(r) = (L−1) × CDF_r(r) = (L−1) × ∫₀ʳ p_r(w) dw

**For discrete images (step-by-step):**

1. **Compute Histogram:** H(k) = count of pixels with intensity k
2. **Normalize:** p(k) = H(k) / (M × N)
3. **Compute CDF:** CDF(k) = Σⱼ₌₀ᵏ p(j)
4. **Apply Mapping:** s_k = round(CDF(k) × (L − 1))
5. **Map pixels:** each pixel with value k is replaced by s_k

### Numerical Example:

| r_k | H(r_k) | p(r_k) | CDF | s_k = round(CDF × 7) |
|-----|---------|---------|-----|----------------------|
| 0 | 790 | 0.19 | 0.19 | 1 |
| 1 | 1023 | 0.25 | 0.44 | 3 |
| 2 | 850 | 0.21 | 0.65 | 5 |
| 3 | 656 | 0.16 | 0.81 | 6 |
| 4 | 329 | 0.08 | 0.89 | 6 |
| 5 | 245 | 0.06 | 0.95 | 7 |
| 6 | 122 | 0.03 | 0.98 | 7 |
| 7 | 81 | 0.02 | 1.00 | 7 |

(L = 8, 4096 pixels total)

**Effect of Histogram Equalization:**
- Dark images become brighter (dark pixels spread to brighter values)
- Washed-out images gain contrast
- Automatically adapts to image content
- Works best for images with poor global contrast

**Limitations:**
- May over-enhance noise in smooth regions
- Can produce unnatural "washed-out" effects for most images
- Same transformation applied globally (poor results for images with multiple regions of different brightness)

---

### CLAHE – Contrast Limited Adaptive Histogram Equalization

**Regular Adaptive HE:**
- Divides image into non-overlapping tiles (e.g., 8×8)
- Applies histogram equalization independently to each tile
- Uses bilinear interpolation to remove tile boundary artifacts

**Problem with Adaptive HE:** In homogeneous regions (uniform sky, walls), the histogram equalization amplifies small normal variations → **noise is greatly enhanced**.

**CLAHE Solution:**
1. Divide image into small tiles
2. For each tile, clip the histogram at a **clip limit** (prevents over-amplification)
3. Redistribute clipped values uniformly across the histogram
4. Apply equalization per tile
5. Interpolate between tiles (no block boundaries)

**Result:** Enhanced contrast without excessive noise amplification.

**Key parameter:** \`clipLimit\` (typically 2.0–4.0)

**Applications:**
- Medical imaging (X-ray, MRI, CT enhancement)
- Low-light photography
- Satellite/aerial image enhancement
- Face recognition preprocessing

---

## 3. Histogram Specification (Histogram Matching)

Unlike equalization (which targets a flat histogram), **histogram specification** transforms the input image to match a **user-specified target histogram**.

**Why use it:**
- Make two images taken under different lighting conditions look similar
- Simulate a specific photographic "look"
- Preprocess images for consistent appearance before further analysis

### Mathematical Approach

Let:
- p_r(r) = PDF of source image
- p_z(z) = PDF of target (specified) image

**Step 1:** Equalize source image:
s = T(r) = (L−1) × CDF_r(r)

**Step 2:** Equalize target histogram:
v = G(z) = (L−1) × CDF_z(z)

**Step 3:** Find the mapping:
z = G⁻¹(s) = G⁻¹(T(r))

**Discrete Algorithm:**
1. Compute CDF_s for the source image (normalized, 0–1)
2. Compute CDF_z for the target histogram (normalized, 0–1)
3. For each source intensity level r_k:
   - Find z that minimizes |CDF_z(z) − CDF_s(r_k)|
   - Create lookup table: LUT[r_k] = z
4. Apply LUT to all pixels of source image

**Applications:**
- Satellite image time-series analysis (normalize images from different dates)
- Color grading in film/video production
- Medical image normalization across different scanners

---

## Summary Table: Image Enhancement Techniques

| Technique | Operation | Best For | Limitation |
|-----------|-----------|----------|------------|
| Contrast Stretch | Linear remapping | Global contrast boost | Sensitive to outliers |
| Gamma Correction | Power-law transform | Display calibration, dark/bright fix | Manual γ selection needed |
| Log Transform | Logarithmic scaling | Wide dynamic range images | Fixed transformation |
| Hist. Equalization | CDF-based remapping | Automatic global enhancement | Noise amplification |
| CLAHE | Tile-based clipped EQ | Medical images, faces | Tile size tuning needed |
| Hist. Specification | Match to target CDF | Cross-image normalization | Target histogram selection |
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt

img = cv2.imread('image.jpg', cv2.IMREAD_GRAYSCALE)

# ========================================
# 1. LINEAR CONTRAST STRETCHING
# ========================================
def contrast_stretch(img, low_pct=2, high_pct=98):
    """
    Robust contrast stretching using percentiles.
    Ignores bottom low_pct% and top high_pct% of intensities.
    """
    r_min = np.percentile(img, low_pct)
    r_max = np.percentile(img, high_pct)
    stretched = np.clip((img.astype(np.float32) - r_min) / (r_max - r_min) * 255, 0, 255)
    return stretched.astype(np.uint8)

stretched = contrast_stretch(img)

# ========================================
# 2. GAMMA CORRECTION
# ========================================
def gamma_correction(img, gamma):
    """
    s = c * r^gamma  (c=1 here)
    gamma < 1 → brighten, gamma > 1 → darken
    """
    normalized = img.astype(np.float32) / 255.0
    corrected  = np.power(normalized, gamma) * 255.0
    return corrected.astype(np.uint8)

bright = gamma_correction(img, 0.4)   # brighten
dark   = gamma_correction(img, 2.5)   # darken

# ========================================
# 3. LOG TRANSFORM
# ========================================
def log_transform(img, c=None):
    """
    s = c * log(1 + r)
    """
    log_img = np.log1p(img.astype(np.float32))
    c = 255 / np.log1p(255) if c is None else c  # auto-scale
    result  = c * log_img
    return np.clip(result, 0, 255).astype(np.uint8)

log_img = log_transform(img)

# ========================================
# 4. NEGATIVE IMAGE
# ========================================
def negative_image(img):
    return (255 - img).astype(np.uint8)

negative = negative_image(img)

# ========================================
# 5. HISTOGRAM EQUALIZATION (Manual)
# ========================================
def hist_equalize_manual(img):
    """Step-by-step manual histogram equalization."""
    L = 256
    M, N = img.shape
    
    # Step 1: Compute histogram
    hist = np.zeros(L, dtype=np.int64)
    for val in img.ravel():
        hist[val] += 1
    
    # Step 2: Normalized histogram (probability)
    p = hist / (M * N)
    
    # Step 3: Compute CDF
    cdf = np.cumsum(p)
    
    # Step 4: Apply mapping
    lut = np.round(cdf * (L - 1)).astype(np.uint8)
    
    # Step 5: Map pixels
    return lut[img]

eq_manual = hist_equalize_manual(img)

# OpenCV built-in (same result, faster)
eq_opencv = cv2.equalizeHist(img)

# ========================================
# 6. CLAHE
# ========================================
clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
eq_clahe = clahe.apply(img)

# CLAHE on color image (apply only to Luminance channel)
color_img = cv2.imread('image.jpg')
lab        = cv2.cvtColor(color_img, cv2.COLOR_BGR2Lab)
l, a, b    = cv2.split(lab)
l_clahe    = clahe.apply(l)
enhanced   = cv2.merge([l_clahe, a, b])
enhanced   = cv2.cvtColor(enhanced, cv2.COLOR_Lab2BGR)

# ========================================
# 7. HISTOGRAM SPECIFICATION (MATCHING)
# ========================================
def match_histograms(source, reference):
    """
    Match the histogram of source to match reference.
    Returns: transformed source with reference's histogram.
    """
    src_hist, _ = np.histogram(source.ravel(), 256, [0, 256])
    ref_hist, _ = np.histogram(reference.ravel(), 256, [0, 256])
    
    # Compute CDFs (normalized)
    src_cdf = src_hist.cumsum() / src_hist.sum()
    ref_cdf = ref_hist.cumsum() / ref_hist.sum()
    
    # Lookup table: for each src level → find closest ref CDF level
    lut = np.zeros(256, dtype=np.uint8)
    for src_val in range(256):
        diff = np.abs(ref_cdf - src_cdf[src_val])
        lut[src_val] = np.argmin(diff)
    
    return lut[source]

# Usage
ref_img = cv2.imread('reference.jpg', cv2.IMREAD_GRAYSCALE)
matched = match_histograms(img, ref_img)

# ========================================
# 8. PLOTTING HISTOGRAMS SIDE BY SIDE
# ========================================
fig, axes = plt.subplots(2, 4, figsize=(20, 10))
images = [img, stretched, gamma_correction(img, 0.5), log_img,
          eq_opencv, eq_clahe, matched, negative]
titles = ['Original', 'Contrast Stretch', 'Gamma 0.5', 'Log',
          'Hist. Equalized', 'CLAHE', 'Hist. Matched', 'Negative']

for ax, image, title in zip(axes.flat, images, titles):
    ax.hist(image.ravel(), bins=256, range=[0, 256], color='steelblue', alpha=0.7)
    ax.set_title(title, fontsize=10)
    ax.set_xlim([0, 255])
plt.tight_layout()
plt.savefig('enhancement_histograms.png', dpi=150)
`
        },
        {
            id: "noise-filtering",
            title: "Noise Removal and Filtering",
            description: "Types of image noise, spatial domain filtering, and frequency domain filtering.",
            details: `
## Noise Removal and Filtering

---

## 1. Image Noise and Its Types

**Definition:** Noise is any unwanted variation in image intensity that does **not** correspond to actual scene features. It corrupts the true pixel values.

**Mathematical model:** Corrupted image g(x,y) = f(x,y) + η(x,y)
- f(x,y) = original (noise-free) image
- η(x,y) = noise function
- g(x,y) = observed (noisy) image

For **multiplicative noise:** g(x,y) = f(x,y) × η(x,y)

### Sources of Noise
- **Electronic noise:** Thermal agitation of electrons (Johnson noise)
- **Photon shot noise:** Discrete nature of light (photon counting)
- **Sensor imperfections:** Dead pixels, hot pixels, dark current
- **Quantization noise:** Rounding during analog-to-digital conversion
- **Transmission errors:** Bit errors during image compression/transmission
- **Environmental:** Vibration, temperature fluctuations, EMI

---

### Types of Image Noise

#### 1. Gaussian Noise (Additive White Gaussian Noise — AWGN)
- Most common and well-studied noise type
- Intensity values disturbed by random values drawn from a **Normal (Gaussian) distribution**

**Probability Density Function:**
\`\`\`
PDF(z) = (1 / (√(2π)σ)) × e^(-(z-μ)² / 2σ²)
\`\`\`
- μ = mean (usually 0 for zero-mean noise)
- σ = standard deviation (controls noise amplitude)

**Characteristics:**
- Affects all pixels uniformly
- Each pixel's noise value is independent of neighbors
- μ shifts average brightness; σ controls fuzziness
- Cause: Thermal noise in camera sensors (especially in dark/low-light conditions)

**Removal:** Gaussian filter, mean filter, bilateral filter

---

#### 2. Salt-and-Pepper Noise (Impulse Noise)
- Random pixels are set to either maximum (255 — "salt") or minimum (0 — "pepper") values
- All other pixels remain unchanged

**Probability model:**
\`\`\`
P(g = 255) = Pa/2    (salt)
P(g = 0)   = Pb/2    (pepper)
P(g = f)   = 1 - Pa  (unchanged)
\`\`\`

**Characteristics:**
- Appears as white dots (salt) and black dots (pepper) on image
- Typically caused by: sudden bit errors in data transmission, malfunctioning sensor pixels, rapid transients in analog-to-digital circuits
- Probability Pa (fraction of pixels corrupted)

**Removal:** Median filter (most effective), morphological operations

---

#### 3. Uniform Noise
- Noise values distributed uniformly between [a, b]

**PDF:**
\`\`\`
PDF(z) = 1/(b-a)   for a ≤ z ≤ b
PDF(z) = 0         otherwise
\`\`\`

**Mean:** (a+b)/2, **Variance:** (b−a)²/12

**Characteristics:**
- Less common in practice
- Can model quantization errors in digitization
- Used in theoretical analysis and Monte Carlo simulations

---

#### 4. Speckle Noise (Multiplicative Noise)
**Model:** g(x,y) = f(x,y) × n(x,y)   where n ~ Gamma distribution

**Characteristics:**
- Gives the image a grainy, granular texture
- Noise amplitude is proportional to local signal intensity (brighter areas have more noise)
- Very common in: **Ultrasound images**, **SAR (Synthetic Aperture Radar)** images, **Laser speckle photography**

**Removal:** Lee filter, Frost filter, speckle reducing anisotropic diffusion (SRAD), wavelet-based denoising

---

#### 5. Poisson Noise (Shot Noise / Photon Noise)
- Arises from the **discrete, statistical nature of photon arrivals** at a detector
- Number of detected photons in a time interval follows a **Poisson distribution**

**Property:** Variance = Mean (signal-dependent noise)
\`\`\`
P(k photons detected | λ expected) = (λ^k × e^-λ) / k!
\`\`\`

**Characteristics:**
- Significant in **low-light conditions** (few photons per pixel)
- Noise increases with signal (but SNR also increases with signal)
- Common in: astronomical imaging, fluorescence microscopy, single-photon imaging

**Removal:** Anscombe transform (converts Poisson→Gaussian), then Gaussian denoise

---

#### 6. Periodic Noise
- Result of regular disturbances in image acquisition (e.g., electrical interference with camera electronics)
- Appears as **sinusoidal patterns** superimposed on the image

**Best removed in:** Frequency domain (identify and remove frequency peaks)

---

### Noise Comparison Summary

| Noise Type | Distribution | Main Cause | Best Removal Method |
|------------|-------------|------------|---------------------|
| Gaussian | Normal | Thermal/electronic | Gaussian filter, bilateral |
| Salt & Pepper | Impulse | Bit errors, dead pixels | Median filter |
| Uniform | Uniform | Quantization | Mean/Gaussian filter |
| Speckle | Multiplicative | Coherent imaging (US, SAR) | Lee/Frost filter, SRAD |
| Poisson | Poisson | Photon counting | Anscombe + Gaussian |
| Periodic | Sinusoidal | Electrical interference | Band-reject in freq. domain |

---

## 2. Spatial Domain Filtering

Spatial domain filters operate **directly on pixel values** using a **convolution/correlation** operation with a filter kernel (mask).

**General linear filtering operation:**
\`\`\`
g(x,y) = Σ Σ w(s,t) × f(x+s, y+t)
         s  t
\`\`\`
Where w(s,t) is the filter kernel and f(x,y) is the input image.

This is the **2D convolution** (technically correlation in image processing, since kernels aren't flipped in practice).

### Padding Strategies (for border pixels):
- **Zero padding:** Fill border with 0s
- **Replicate/Clamp:** Repeat nearest border pixel
- **Reflect:** Mirror the image at borders
- **Wrap:** Treat image as periodic (circular convolution)

---

### Linear Spatial Filters

#### 1. Mean (Averaging) Filter
- Replace each pixel with the **arithmetic mean** of all pixels in its neighborhood
- All kernel values = 1/(n×n) for an n×n neighborhood

**3×3 Mean kernel:**
\`\`\`
    1/9 × | 1  1  1 |
           | 1  1  1 |
           | 1  1  1 |
\`\`\`

**Effect:** Low-pass filter — blurs the image, reduces high-frequency noise
**Limitation:** Blurs edges (doesn't distinguish between edge pixels and noise pixels)
**Best for:** Reducing Gaussian noise when edge preservation is not critical
**PSNR improvement:** Moderate

---

#### 2. Gaussian Filter
- Weighted average where weights decrease with distance from center (Gaussian function)

**Continuous 2D Gaussian:**
\`\`\`
G(x,y) = (1/(2πσ²)) × e^(-(x²+y²) / 2σ²)
\`\`\`

**3×3 Gaussian kernel (σ ≈ 0.85):**
\`\`\`
    1/16 × | 1  2  1 |
            | 2  4  2 |
            | 1  2  1 |
\`\`\`

**5×5 Gaussian kernel:**
\`\`\`
    1/256 × |  1   4   6   4   1 |
             |  4  16  24  16   4 |
             |  6  24  36  24   6 |
             |  4  16  24  16   4 |
             |  1   4   6   4   1 |
\`\`\`

**Properties:**
- **Separable:** G(x,y) = G(x) × G(y) → can decompose 2D into two 1D passes (faster)
- **Rotationally symmetric:** No directional bias
- **σ controls:** Larger σ = more blurring = more noise reduction = more detail loss

**Comparison to Mean filter:**
- Better preserves edges (gives less weight to far pixels)
- More natural-looking blur
- Computationally heavier (but separability helps)

---

#### 3. Laplacian Filter (Sharpening)
- Second-order derivative filter — highlights regions of rapid intensity change (edges)
- **Not a noise reduction filter** — it amplifies noise!

**Laplacian operator:**
\`\`\`
∇²f = ∂²f/∂x² + ∂²f/∂y²
\`\`\`

**Discrete Laplacian kernels:**
\`\`\`
4-connectivity:          8-connectivity:
| 0   1   0 |            | 1   1   1 |
| 1  -4   1 |     or     | 1  -8   1 |
| 0   1   0 |            | 1   1   1 |
\`\`\`

**Unsharp Masking:**
\`\`\`
g = f − k × ∇²f     (k controls sharpening strength)
\`\`\`

---

### Non-Linear Spatial Filters

#### 4. Median Filter (Most Important!)
- Replace each pixel with the **median** value of all pixels in its neighborhood
- Non-linear — cannot be expressed as a convolution

**Algorithm:**
1. Extract all pixels in n×n neighborhood → sort them
2. Take the middle value (median)
3. Replace center pixel with this median

**Properties:**
- **Excellent for salt-and-pepper noise** (impulse noise)
- **Preserves edges** much better than linear filters
- The median is always an actual image value (no new gray levels created)
- Does not spread noise across edges
- Computationally more expensive than mean filter

**Limitation:** Smears fine details and thin lines; over-smooths texture

---

#### 5. Min/Max Filters (Morphological)
- **Erosion (Min filter):** Replace pixel with minimum value in neighborhood
  - Removes small bright spots (salt noise)
  - Slightly shrinks bright regions
- **Dilation (Max filter):** Replace pixel with maximum value in neighborhood
  - Removes small dark spots (pepper noise)
  - Slightly expands bright regions

Often used in combination: **Opening** (erosion then dilation) or **Closing** (dilation then erosion).

---

#### 6. Bilateral Filter
- Edge-preserving smoothing filter
- Weighted average of neighbors — weights based on **two factors:**
  a. **Spatial proximity** (same as Gaussian)
  b. **Intensity similarity** (prevents averaging across edges)

**Formula:**
\`\`\`
g(x,y) = (1/W_p) × Σ f(q) × G_σs(||p-q||) × G_σr(|f(p)-f(q)|)
             q∈Ω
\`\`\`

Where:
- G_σs = spatial Gaussian (favors nearby pixels)
- G_σr = range Gaussian (favors pixels with similar intensity)
- W_p = normalization factor

**Parameters:**
- σ_s (spatial sigma): Controls how far to consider neighboring pixels
- σ_r (range sigma): Controls what "similar intensity" means

**Effect:**
- Smooth flat regions (noise removed)
- Sharp edges preserved (pixels across edges do not get averaged together)

**Trade-off:** Computationally much more expensive than Gaussian filter (~O(σs² × n²) per pixel)

**Applications:** Portrait photography (skin smoothing), depth map filtering, style transfer preprocessing

---

#### 7. Non-Local Means (NLM) Filter
- Modern, sophisticated edge-preserving denoising method
- Instead of averaging nearby pixels, averages pixels with **similar patch neighborhoods** throughout the entire image

**Key idea:** A pixel at location x is denoised by computing a weighted average of all pixels y where the patch around y is similar to the patch around x.

**Superior to bilateral filter** but much slower → requires acceleration (e.g., GPU implementation)

Used in professional imaging pipelines and as a benchmark for denoising algorithms.

---

### Comparison of Spatial Filters

| Filter | Type | Best Noise | Edge Preservation | Speed |
|--------|------|------------|-------------------|-------|
| Mean | Linear | Gaussian | Poor | Fast |
| Gaussian | Linear | Gaussian | Moderate | Fast |
| Median | Non-linear | Salt & Pepper | Good | Moderate |
| Bilateral | Non-linear | Gaussian | Excellent | Slow |
| NLM | Non-linear | General | Excellent | Very Slow |

---

## 3. Frequency Domain Filtering

Instead of operating on pixels directly, frequency domain filtering:
1. Transforms the image using the **Discrete Fourier Transform (DFT)**
2. Applies a filter in the frequency domain
3. Transforms back using the **Inverse DFT (IDFT)**

**Why frequency domain?**
- Some operations are conceptually simpler
- Computationally efficient using FFT: O(N log N) vs O(N²) for direct convolution
- Certain noise patterns (periodic noise) are easy to identify and isolate

---

### Discrete Fourier Transform (DFT)

**Forward DFT (spatial → frequency):**
\`\`\`
F(u,v) = Σₓ Σᵧ f(x,y) × e^(-j2π(ux/M + vy/N))
\`\`\`

**Inverse DFT (frequency → spatial):**
\`\`\`
f(x,y) = (1/MN) × Σᵤ Σᵥ F(u,v) × e^(+j2π(ux/M + vy/N))
\`\`\`

**DFT output F(u,v) is complex:**
- |F(u,v)| = magnitude spectrum (usually displayed in log scale)
- ∠F(u,v) = phase spectrum

**Frequency Interpretation:**
- **(u,v) = (0,0):** DC component = average brightness of image
- **Low frequencies** (near center after fftshift): Smoothly varying regions (backgrounds, large objects)
- **High frequencies** (far from center): Rapidly changing regions → edges, fine detail, noise

**Convolution Theorem (key theorem):**
\`\`\`
Spatial domain convolution ↔ Frequency domain multiplication
g(x,y) = f(x,y) ∗ h(x,y)   ↔   G(u,v) = F(u,v) × H(u,v)
\`\`\`

This means: instead of convolving a large kernel in spatial domain, we can multiply in frequency domain!

---

### Fast Fourier Transform (FFT)
- Efficient algorithm to compute DFT in **O(N log N)** instead of O(N²)
- Developed by Cooley and Tukey (1965)
- Revolutionized signal and image processing
- Used by \`numpy.fft.fft2()\` and \`cv2.dft()\`

---

### Types of Frequency Domain Filters

#### 1. Low-Pass Filter (LPF) — Smoothing / Noise Removal

Passes **low frequencies**, blocks (attenuates) **high frequencies**.

**Effect:** Smooths the image (equivalent to blurring in spatial domain), removes high-frequency noise.

**Three types of ideal → practical LPF:**

**Ideal LPF:**
\`\`\`
H(u,v) = 1 if D(u,v) ≤ D₀
H(u,v) = 0 if D(u,v) > D₀
\`\`\`
D(u,v) = √(u² + v²) from center, D₀ = cutoff frequency
- **Problem:** Creates "ringing" (Gibbs phenomenon) in spatial output

**Butterworth LPF (order n):**
\`\`\`
H(u,v) = 1 / (1 + (D(u,v)/D₀)^(2n))
\`\`\`
- Smooth rolloff → no ringing
- Higher order n → sharper cutoff (approaches ideal)

**Gaussian LPF:**
\`\`\`
H(u,v) = e^(-D²(u,v) / 2D₀²)
\`\`\`
- Smoothest rolloff
- No ringing
- Corresponds to Gaussian spatial filter

---

#### 2. High-Pass Filter (HPF) — Edge / Detail Enhancement

Passes **high frequencies**, blocks **low frequencies**.

**Effect:** Enhances edges and fine details, suppresses smooth regions.

\`\`\`
H_HP(u,v) = 1 − H_LP(u,v)
\`\`\`

**Applications:**
- Edge detection and sharpening
- Image detail/texture enhancement
- Unsharp masking in photography

**Caution:** Also amplifies noise (noise is usually high-frequency)

---

#### 3. Band-Pass Filter

Passes frequencies within a specific range [D₁, D₂]:
\`\`\`
H_BP(u,v) = H_HP with cutoff D₁ − H_HP with cutoff D₂
\`\`\`

**Applications:**
- Extracting texture at specific scales
- Wavelet-like multi-scale analysis
- Removing specific frequency bands of noise

---

#### 4. Band-Reject Filter (Notch Filter)

**Opposite of band-pass:** Removes a specific range of frequencies.

\`\`\`
H_BR(u,v) = 1 − H_BP(u,v)
\`\`\`

**Specific Notch filter:** Removes specific frequency pairs (u₀,v₀) and (−u₀,−v₀)

**Best use case:** **Periodic noise removal**
- Periodic noise creates bright spots in the magnitude spectrum at specific frequencies
- Identify these spots visually
- Apply notch filters at those locations
- Result: periodic noise dramatically reduced without affecting the rest of the image

---

### Filtering Pipeline

\`\`\`
Original image f(x,y)
        ↓
DFT → F(u,v)           (convert to frequency domain)
        ↓
fftshift                (center DC component)
        ↓  
Apply filter H(u,v)     (multiply element-wise: G = F × H)
        ↓
ifftshift
        ↓
IDFT → g(x,y)           (convert back to spatial domain)
        ↓
Take absolute value     (result is complex, take real part or magnitude)
        ↓
Clip to [0, 255]
\`\`\`

---

### Spatial vs Frequency Domain: When to Use Which?

| Criterion | Spatial Domain | Frequency Domain |
|-----------|---------------|-----------------|
| **Simple filters** (small kernel) | ✅ More efficient | ❌ Overhead |
| **Large kernels** | ❌ Slow O(N²k²) | ✅ Fast O(N² log N) |
| **Periodic noise removal** | ❌ Difficult | ✅ Natural, easy |
| **Edge sharpening** | ✅ Simple kernels | ✅ Possible |
| **Understanding noise** | ❌ Hard to visualize | ✅ Spectrum shows structure |
| **Precision control** | ❌ Limited | ✅ Fine-grained cutoff |
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt

img = cv2.imread('image.jpg', cv2.IMREAD_GRAYSCALE).astype(np.float32)
img_uint8 = img.astype(np.uint8)

# ========================================
# 1. ADDING DIFFERENT TYPES OF NOISE
# ========================================
def add_gaussian_noise(img, mean=0, sigma=25):
    """Additive White Gaussian Noise."""
    noise = np.random.normal(mean, sigma, img.shape).astype(np.float32)
    return np.clip(img + noise, 0, 255).astype(np.uint8)

def add_salt_pepper_noise(img, prob=0.05):
    """Salt & Pepper (Impulse) Noise."""
    noisy = img.copy()
    # Salt (white pixels)
    salt_mask   = np.random.random(img.shape) < prob / 2
    noisy[salt_mask] = 255
    # Pepper (black pixels)
    pepper_mask = np.random.random(img.shape) < prob / 2
    noisy[pepper_mask] = 0
    return noisy

def add_speckle_noise(img, variance=0.1):
    """Multiplicative speckle noise ~ Gamma distribution."""
    noise = np.random.randn(*img.shape) * np.sqrt(variance)
    noisy = img.astype(np.float32) + img.astype(np.float32) * noise
    return np.clip(noisy, 0, 255).astype(np.uint8)

noisy_gaussian = add_gaussian_noise(img_uint8, sigma=30)
noisy_sp       = add_salt_pepper_noise(img_uint8, prob=0.05)
noisy_speckle  = add_speckle_noise(img_uint8, variance=0.05)

# ========================================
# 2. SPATIAL DOMAIN FILTERS
# ========================================

# --- Linear Filters ---
mean_3x3    = cv2.blur(noisy_gaussian, (3, 3))     # Mean filter 3×3
mean_5x5    = cv2.blur(noisy_gaussian, (5, 5))     # Mean filter 5×5
gauss_5x5   = cv2.GaussianBlur(noisy_gaussian, (5, 5), sigmaX=1.5)
gauss_big   = cv2.GaussianBlur(noisy_gaussian, (11, 11), sigmaX=3.0)

# Custom sharpening kernel (Unsharp Masking)
sharpen_k   = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=np.float32)
sharpened   = cv2.filter2D(img_uint8, -1, sharpen_k)

# Laplacian for edges
laplacian   = cv2.Laplacian(img_uint8, cv2.CV_64F)
laplacian   = np.uint8(np.absolute(laplacian))

# --- Non-Linear Filters ---
median_3    = cv2.medianBlur(noisy_sp, 3)           # Best for salt & pepper
median_5    = cv2.medianBlur(noisy_sp, 5)

# Bilateral filter: edge-preserving Gaussian denoising
bilateral   = cv2.bilateralFilter(noisy_gaussian,
                                   d=9,              # Diameter of pixel neighborhood
                                   sigmaColor=75,    # Range parameter (intensity similarity)
                                   sigmaSpace=75)    # Spatial parameter (proximity)

# Min/Max morphological filters
kernel = np.ones((3, 3), np.uint8)
eroded     = cv2.erode(img_uint8, kernel)    # Min filter (removes bright spots)
dilated    = cv2.dilate(img_uint8, kernel)   # Max filter (removes dark spots)
opened     = cv2.morphologyEx(img_uint8, cv2.MORPH_OPEN, kernel)    # Erosion→Dilation
closed     = cv2.morphologyEx(img_uint8, cv2.MORPH_CLOSE, kernel)   # Dilation→Erosion

# ========================================
# 3. FREQUENCY DOMAIN FILTERING
# ========================================
def dft_filter(img_gray, filter_type='low', cutoff=30, order=2):
    """
    Apply ideal, Butterworth, or Gaussian frequency-domain filter.
    filter_type: 'low', 'high', 'butterworth_lp', 'gaussian_lp'
    cutoff: cutoff radius in frequency domain pixels
    """
    rows, cols = img_gray.shape
    crow, ccol = rows // 2, cols // 2

    # Step 1: Compute DFT and shift DC to center
    dft         = np.fft.fft2(img_gray)
    dft_shifted = np.fft.fftshift(dft)

    # Step 2: Build filter mask
    y, x  = np.ogrid[:rows, :cols]
    D     = np.sqrt((x - ccol)**2 + (y - crow)**2)  # distance from center

    if filter_type == 'low':
        mask = np.zeros((rows, cols), dtype=np.float32)
        mask[D <= cutoff] = 1                     # Ideal LPF

    elif filter_type == 'high':
        mask = np.ones((rows, cols), dtype=np.float32)
        mask[D <= cutoff] = 0                     # Ideal HPF

    elif filter_type == 'butterworth_lp':
        mask = 1 / (1 + (D / cutoff) ** (2 * order))        # Butterworth LPF

    elif filter_type == 'gaussian_lp':
        mask = np.exp(-(D**2) / (2 * cutoff**2))             # Gaussian LPF

    elif filter_type == 'band_reject':
        # Example: reject band between 20 and 40
        d_low, d_high = 20, 40
        mask = np.ones((rows, cols), dtype=np.float32)
        mask[(D >= d_low) & (D <= d_high)] = 0

    # Step 3: Apply filter and inverse DFT
    filtered_dft     = dft_shifted * mask
    filtered_idft    = np.fft.ifftshift(filtered_dft)
    result           = np.abs(np.fft.ifft2(filtered_idft))
    return np.clip(result, 0, 255).astype(np.uint8)

# Apply different frequency domain filters
ideal_lpf     = dft_filter(img, filter_type='low',         cutoff=40)
ideal_hpf     = dft_filter(img, filter_type='high',        cutoff=40)
butter_lpf    = dft_filter(img, filter_type='butterworth_lp', cutoff=40, order=2)
gauss_lpf     = dft_filter(img, filter_type='gaussian_lp', cutoff=40)

# ========================================
# 4. VISUALIZING THE DFT SPECTRUM
# ========================================
def show_spectrum(img_gray, title=""):
    dft         = np.fft.fft2(img_gray)
    dft_shifted = np.fft.fftshift(dft)
    magnitude   = np.abs(dft_shifted)
    spectrum    = np.log1p(magnitude)          # Log scale for visualization
    spectrum    = (spectrum / spectrum.max() * 255).astype(np.uint8)
    return spectrum

spectrum_original = show_spectrum(img, "Original Spectrum")
spectrum_noisy    = show_spectrum(noisy_gaussian, "Noisy Spectrum")

# ========================================
# 5. QUANTITATIVE EVALUATION (PSNR)
# ========================================
def psnr(original, denoised):
    mse = np.mean((original.astype(np.float32) - denoised.astype(np.float32)) ** 2)
    if mse == 0:
        return float('inf')
    return 20 * np.log10(255.0 / np.sqrt(mse))

print("\\n===== PSNR Comparison (Gaussian noise, σ=30) =====")
print(f"  Input noisy PSNR  : {psnr(img_uint8, noisy_gaussian):.2f} dB")
print(f"  Mean 5×5          : {psnr(img_uint8, mean_5x5):.2f} dB")
print(f"  Gaussian 5×5      : {psnr(img_uint8, gauss_5x5):.2f} dB")
print(f"  Bilateral         : {psnr(img_uint8, bilateral):.2f} dB")
print(f"  Ideal LPF (D=40)  : {psnr(img_uint8, ideal_lpf):.2f} dB")
print(f"  Butterworth LPF   : {psnr(img_uint8, butter_lpf):.2f} dB")
print(f"  Gaussian LPF      : {psnr(img_uint8, gauss_lpf):.2f} dB")

print("\\n===== PSNR Comparison (Salt & Pepper, p=0.05) =====")
print(f"  Input noisy PSNR  : {psnr(img_uint8, noisy_sp):.2f} dB")
print(f"  Median 3×3        : {psnr(img_uint8, median_3):.2f} dB")
print(f"  Median 5×5        : {psnr(img_uint8, median_5):.2f} dB")
`
        }
    ],
    mcqs: [
        // ── Introduction to Image Processing & Computer Vision ──────────────
        {
            id: "u1q1",
            question: "A digital image is mathematically represented as a 2D function f(x, y). What does the amplitude f(x, y) represent in a grayscale image?",
            options: [
                "The position of the pixel in the image matrix",
                "The intensity or gray level at spatial coordinates (x, y)",
                "The frequency content at position (x, y)",
                "The color channel index at position (x, y)"
            ],
            correctIndex: 1,
            explanation: "In a digital image f(x, y), x and y are spatial coordinates and the amplitude (value of f) at any point is the intensity or gray level of the image at that location."
        },
        {
            id: "u1q2",
            question: "Which of the following is classified as a LOW-LEVEL image processing task?",
            options: [
                "Object recognition and labeling",
                "Scene understanding and decision making",
                "Noise removal and contrast enhancement",
                "Facial recognition"
            ],
            correctIndex: 2,
            explanation: "Low-level processing involves operations directly on pixel values such as noise removal, contrast enhancement, and sharpening — no semantic understanding is required."
        },
        {
            id: "u1q3",
            question: "What is the primary distinction between Image Processing and Computer Vision?",
            options: [
                "Image processing requires hardware; computer vision is purely software",
                "Image processing produces a modified image or features; computer vision produces high-level semantic interpretation",
                "Computer vision works on single images only; image processing works on video",
                "Image processing uses deep learning; computer vision uses classical algorithms"
            ],
            correctIndex: 1,
            explanation: "Image processing transforms or analyzes pixels (output: enhanced image or numerical features), while computer vision aims to understand and interpret the scene content (output: labels, decisions, 3D models)."
        },
        {
            id: "u1q4",
            question: "For a digital image to be considered truly 'digital', which condition must hold?",
            options: [
                "Only x and y coordinates must be discrete",
                "Only the amplitude values must be discrete",
                "x, y coordinates AND amplitude values must all be finite and discrete",
                "The image must be stored in a binary format"
            ],
            correctIndex: 2,
            explanation: "A digital image requires that x, y (spatial coordinates) and the amplitude values of f are all finite, discrete quantities."
        },
        {
            id: "u1q5",
            question: "Which image compression technique is used by the JPEG format?",
            options: [
                "LZW (Lempel-Ziv-Welch)",
                "DEFLATE (LZ77 + Huffman)",
                "DCT (Discrete Cosine Transform) + Huffman",
                "RLE (Run-Length Encoding)"
            ],
            correctIndex: 2,
            explanation: "JPEG uses DCT-based compression: the image is divided into 8×8 blocks, DCT is applied to each block, coefficients are quantized (lossy step), and then entropy coded using Huffman coding."
        },
        {
            id: "u1q6",
            question: "An 8-bit grayscale image can represent how many distinct intensity levels?",
            options: [
                "128",
                "255",
                "256",
                "512"
            ],
            correctIndex: 2,
            explanation: "An 8-bit image uses 2^8 = 256 distinct gray levels, ranging from 0 (black) to 255 (white)."
        },
        {
            id: "u1q7",
            question: "Which image format uses LZW lossless compression but is LIMITED to 256 colors?",
            options: [
                "PNG",
                "TIFF",
                "GIF",
                "BMP"
            ],
            correctIndex: 2,
            explanation: "GIF uses lossless LZW compression but supports only an 8-bit palette (256 colors maximum), making it unsuitable for photographs with rich gradients."
        },
        {
            id: "u1q8",
            question: "A 24-bit true-color image uses 8 bits per RGB channel. Approximately how many distinct colors can it represent?",
            options: [
                "65,536",
                "1,677,216",
                "16,777,216",
                "281 trillion"
            ],
            correctIndex: 2,
            explanation: "24-bit color = 8 bits × 3 channels = 2^24 ≈ 16.7 million colors."
        },
        {
            id: "u1q9",
            question: "Which image format does NOT support transparency (alpha channel)?",
            options: [
                "PNG",
                "TIFF",
                "JPEG",
                "WebP"
            ],
            correctIndex: 2,
            explanation: "JPEG does not support an alpha channel (transparency). PNG, TIFF, and WebP all support alpha transparency."
        },
        {
            id: "u1q10",
            question: "In the JPEG compression pipeline, RGB is first converted to which color space before DCT is applied?",
            options: [
                "HSV",
                "YCbCr",
                "CIE L*a*b*",
                "CMYK"
            ],
            correctIndex: 1,
            explanation: "JPEG converts RGB to YCbCr first, enabling chroma subsampling (since the human eye is less sensitive to chroma than luminance), then applies 2D DCT to 8×8 blocks."
        },
        {
            id: "u1q11",
            question: "WebP lossless mode achieves approximately how much smaller file sizes compared to PNG?",
            options: [
                "5% smaller",
                "26% smaller",
                "50% smaller",
                "75% smaller"
            ],
            correctIndex: 1,
            explanation: "WebP lossless mode uses LZ77 + Huffman coding (similar to PNG's DEFLATE) and achieves approximately 26% smaller file sizes than PNG."
        },
        {
            id: "u1q12",
            question: "Which image format is the DEFAULT format on iPhones (iOS 11+) due to its ~50% size advantage over JPEG?",
            options: [
                "WebP",
                "AVIF",
                "HEIC/HEIF",
                "TIFF"
            ],
            correctIndex: 2,
            explanation: "HEIC/HEIF (High Efficiency Image File Format) is based on HEVC/H.265 codec and is ~50% smaller than JPEG at the same perceptual quality. It became the default on iPhone with iOS 11."
        },
        {
            id: "u1q13",
            question: "In the pipeline 'Raw Image → [A] → [B]', where A is image processing and B is computer vision, what is the correct sequence of operations?",
            options: [
                "A: Object detection; B: Noise removal",
                "A: Enhance/denoise; B: Detect/recognize/decide",
                "A: Scene understanding; B: Contrast stretch",
                "A: CNN inference; B: Histogram equalization"
            ],
            correctIndex: 1,
            explanation: "The standard pipeline is: Image Processing (enhance, denoise, sharpen) provides clean input to Computer Vision (detect objects, recognize faces, make decisions)."
        },
        {
            id: "u1q14",
            question: "Which application domain uses NDVI (Normalized Difference Vegetation Index) computed from satellite imagery?",
            options: [
                "Medical imaging",
                "Document processing",
                "Remote sensing & precision farming",
                "Industrial PCB inspection"
            ],
            correctIndex: 2,
            explanation: "NDVI is computed from multispectral satellite imagery in remote sensing and precision agriculture to assess vegetation health and plan irrigation."
        },
        {
            id: "u1q15",
            question: "A binary (1-bit) image can represent how many distinct values per pixel?",
            options: [
                "1",
                "2",
                "8",
                "256"
            ],
            correctIndex: 1,
            explanation: "A 1-bit binary image has only 2 values per pixel: 0 (black) and 1 (white). These are used for document scans and masks."
        },
        {
            id: "u1q16",
            question: "PNG uses which compression algorithm for lossless compression?",
            options: [
                "DCT",
                "LZW",
                "DEFLATE (LZ77 + Huffman coding)",
                "HEVC"
            ],
            correctIndex: 2,
            explanation: "PNG uses DEFLATE compression (a combination of LZ77 sliding-window compression and Huffman coding) for lossless compression with alpha channel support."
        },
        {
            id: "u1q17",
            question: "Which of the following is a HIGH-LEVEL computer vision application?",
            options: [
                "Noise removal from a scanned document",
                "Gamma correction of a photograph",
                "Autonomous vehicle pedestrian detection",
                "Resizing an image to 256×256 pixels"
            ],
            correctIndex: 2,
            explanation: "Pedestrian detection in autonomous vehicles is a high-level computer vision task requiring semantic understanding, object localization, and often deep learning models."
        },
        // ── Image Enhancement ──────────────────────────────────────────────
        {
            id: "u1q18",
            question: "In point processing, the output pixel s is related to the input pixel r by s = T(r). When T(r) = 255 − r, what transformation is applied?",
            options: [
                "Gamma correction",
                "Log transformation",
                "Negative (intensity inversion)",
                "Contrast stretching"
            ],
            correctIndex: 2,
            explanation: "s = 255 − r produces a negative image by inverting intensity values: bright pixels become dark and vice versa. This is useful for enhancing details in dark regions of medical images."
        },
        {
            id: "u1q19",
            question: "The power-law (gamma) transformation is defined as s = c · r^γ. What effect does γ < 1 have on the image?",
            options: [
                "Darkens the image (reduces intensity)",
                "Brightens the image (boosts low intensities)",
                "Increases contrast in bright regions only",
                "Converts the image to grayscale"
            ],
            correctIndex: 1,
            explanation: "When γ < 1, the power-law curve maps low input values to higher output values, effectively brightening the image. γ > 1 darkens it. γ = 1 is the identity."
        },
        {
            id: "u1q20",
            question: "Histogram Equalization aims to produce which type of output histogram?",
            options: [
                "Gaussian (bell-curve) distribution",
                "Uniform (flat) distribution",
                "Bimodal distribution",
                "Exponential distribution"
            ],
            correctIndex: 1,
            explanation: "Histogram Equalization transforms pixel intensities via the CDF so that the output histogram is approximately uniform (flat), maximizing contrast across the full dynamic range."
        },
        {
            id: "u1q21",
            question: "What is the main advantage of CLAHE (Contrast Limited Adaptive Histogram Equalization) over standard HE?",
            options: [
                "It is faster to compute",
                "It works only on color images",
                "It prevents over-amplification of noise by limiting the contrast enhancement in each local tile",
                "It uses frequency domain operations"
            ],
            correctIndex: 2,
            explanation: "CLAHE divides the image into small tiles and applies HE locally, but clips the histogram at a limit before redistribution to prevent over-amplifying noise — a major drawback of global HE."
        },
        {
            id: "u1q22",
            question: "In histogram equalization, the transformation function T(r) is derived from which mathematical quantity?",
            options: [
                "The probability density function (PDF) of intensities",
                "The cumulative distribution function (CDF) of intensities",
                "The Fourier transform of the image",
                "The gradient magnitude of the image"
            ],
            correctIndex: 1,
            explanation: "The HE transformation is s = T(r) = (L-1) × CDF(r), where CDF(r) is the cumulative distribution function of the intensity histogram. This maps intensities to spread them uniformly."
        },
        {
            id: "u1q23",
            question: "The log transformation s = c · log(1 + r) is especially useful for:",
            options: [
                "Darkening overexposed images",
                "Expanding dark pixel values while compressing bright ones",
                "Detecting edges in the image",
                "Removing Gaussian noise"
            ],
            correctIndex: 1,
            explanation: "The log transform maps a narrow range of low input values to a wider range of output values while compressing the high values, making it useful for displaying Fourier spectrum magnitudes and expanding detail in dark regions."
        },
        {
            id: "u1q24",
            question: "Linear contrast stretching maps the input range [r_min, r_max] to [0, 255]. What happens to an image with r_min=10 and r_max=140 after stretching?",
            options: [
                "The image becomes darker",
                "Pixel values are clipped above 140",
                "The full 0–255 dynamic range is utilized, improving contrast",
                "The image histogram becomes Gaussian"
            ],
            correctIndex: 2,
            explanation: "Contrast stretching linearly maps [10, 140] → [0, 255], spreading the clustered values across the full range, which significantly improves the perceived contrast."
        },
        {
            id: "u1q25",
            question: "Which of the following IS a spatial-domain image enhancement technique?",
            options: [
                "Ideal Low-Pass Filter (frequency domain)",
                "Butterworth High-Pass Filter",
                "Unsharp Masking (sharpening by subtracting blurred version)",
                "DFT magnitude spectrum visualization"
            ],
            correctIndex: 2,
            explanation: "Unsharp masking operates directly on pixel values (spatial domain): sharpened = original + k × (original − blurred). The other options are frequency-domain techniques."
        },
        {
            id: "u1q26",
            question: "A Laplacian filter kernel (center=4, neighbors=−1, corners=0) is used to sharpen an image. The output is computed as:",
            options: [
                "output = original − Laplacian(original)",
                "output = original + Laplacian(original)",
                "output = Laplacian(original) only",
                "output = Gaussian(original) − Laplacian(original)"
            ],
            correctIndex: 1,
            explanation: "To sharpen using Laplacian: output = original + c × Laplacian(original). Adding the Laplacian (which detects rapid intensity changes) to the original enhances edges and fine detail."
        },
        {
            id: "u1q27",
            question: "In the HSV color space, what does the 'V' (Value) channel represent?",
            options: [
                "The dominant wavelength of the color",
                "The purity or saturation of the color",
                "The brightness or lightness of the color",
                "The hue angle in degrees"
            ],
            correctIndex: 2,
            explanation: "In HSV: H (Hue) = dominant wavelength/color angle, S (Saturation) = purity/colorfulness, V (Value) = brightness/lightness. Adjusting V changes overall brightness without affecting color."
        },
        {
            id: "u1q28",
            question: "Which enhancement technique is most suitable for improving contrast in medical X-ray images where detail is often hidden in dark regions?",
            options: [
                "Log transformation",
                "Negative transformation",
                "Power-law with γ > 1",
                "Ideal High-Pass Filter"
            ],
            correctIndex: 0,
            explanation: "The log transformation expands dark (low-intensity) pixel values, making detail in dark regions (such as subtle lesions in X-rays) more visible, while compressing bright highlights."
        },
        {
            id: "u1q29",
            question: "The Sobel operator computes which property of an image?",
            options: [
                "Histogram equalization mapping",
                "Gradient magnitude for edge detection",
                "Gaussian blur for noise removal",
                "DCT coefficients for compression"
            ],
            correctIndex: 1,
            explanation: "The Sobel operator computes approximate image gradients (∂f/∂x and ∂f/∂y) and their magnitude √(Gx² + Gy²) to detect edges — regions of rapid intensity change."
        },
        {
            id: "u1q30",
            question: "What is the result of applying a sharpening filter to a perfectly uniform (constant-value) image?",
            options: [
                "The image becomes brighter",
                "The image is unchanged (output = input)",
                "All pixels become 0 (black)",
                "The image becomes noisier"
            ],
            correctIndex: 2,
            explanation: "Sharpening filters enhance differences between neighboring pixels. In a uniform image there are no differences, so the high-pass (sharpening) component is 0 everywhere, resulting in a black image."
        },
        {
            id: "u1q31",
            question: "In OpenCV, the function cv2.equalizeHist() requires the input image to be in which format?",
            options: [
                "3-channel BGR color image",
                "Single-channel (grayscale) 8-bit image",
                "32-bit float image",
                "RGBA 4-channel image"
            ],
            correctIndex: 1,
            explanation: "cv2.equalizeHist() in OpenCV works only on single-channel (grayscale) 8-bit images. For color images, you should convert to HSV or YCrCb, equalize only the intensity channel, then convert back."
        },
        {
            id: "u1q32",
            question: "Unsharp masking produces a sharpened image using the formula: sharp = original + k × (original − blurred). What is the term 'original − blurred' called?",
            options: [
                "Laplacian mask",
                "Gradient mask",
                "High-boost filter",
                "High-frequency mask (unsharp mask)"
            ],
            correctIndex: 3,
            explanation: "'original − blurred' isolates high-frequency details (edges, fine texture) by removing the low-frequency blurred version. Adding this back to the original sharpens the image."
        },
        {
            id: "u1q33",
            question: "Histogram specification (histogram matching) differs from histogram equalization in that it:",
            options: [
                "Always produces a uniform histogram",
                "Is applied only in the frequency domain",
                "Maps the input histogram to match a specific TARGET histogram",
                "Increases image resolution"
            ],
            correctIndex: 2,
            explanation: "Histogram specification maps pixel intensities so that the output histogram matches a user-specified target histogram, giving more control than equalization's forced uniform distribution."
        },
        {
            id: "u1q34",
            question: "PSNR (Peak Signal-to-Noise Ratio) is measured in decibels (dB). A HIGHER PSNR value indicates:",
            options: [
                "More noise/distortion between original and processed image",
                "Better image quality (less distortion)",
                "More compression artifacts",
                "Lower bit depth"
            ],
            correctIndex: 1,
            explanation: "PSNR = 20 × log10(MAX / RMSE). Higher PSNR means lower RMSE (less distortion between original and processed images), indicating better preservation of image quality."
        },
        // ── Noise Removal & Filtering ──────────────────────────────────────
        {
            id: "u1q35",
            question: "Gaussian noise in images follows a Gaussian (normal) distribution. Which filter is MOST effective for removing Gaussian noise?",
            options: [
                "Median filter",
                "Gaussian / Mean (averaging) filter",
                "Sobel edge filter",
                "Max filter (dilation)"
            ],
            correctIndex: 1,
            explanation: "Gaussian and mean (averaging) filters smooth Gaussian noise by averaging neighboring pixels. The Gaussian filter weights pixels by distance, better preserving structure than a simple mean."
        },
        {
            id: "u1q36",
            question: "Salt-and-pepper noise adds random BLACK and WHITE pixels to an image. Which filter is specifically designed to remove it with minimal edge blurring?",
            options: [
                "Gaussian filter",
                "Mean filter",
                "Median filter",
                "Bilateral filter"
            ],
            correctIndex: 2,
            explanation: "The median filter replaces each pixel with the median of its neighborhood. Since extreme salt/pepper values (0 or 255) are rarely the median, they are effectively removed without blurring edges."
        },
        {
            id: "u1q37",
            question: "A bilateral filter is described as 'edge-preserving'. What is its key difference from a Gaussian filter?",
            options: [
                "It uses a larger kernel size",
                "It weights neighbors by BOTH spatial distance AND intensity similarity",
                "It operates in the frequency domain",
                "It requires a training dataset"
            ],
            correctIndex: 1,
            explanation: "A bilateral filter uses two Gaussians: one for spatial proximity (like standard Gaussian blur) and one for intensity similarity. Pixels across an edge have very different intensities, so they get low weight — preserving the edge."
        },
        {
            id: "u1q38",
            question: "Which of the following operations INCREASES the effective kernel size of a filter while keeping the number of operations constant, by inserting zeros between kernel elements?",
            options: [
                "Stride convolution",
                "Dilated (atrous) convolution",
                "Transposed convolution",
                "Depthwise separable convolution"
            ],
            correctIndex: 1,
            explanation: "Dilated (atrous) convolution inserts 'holes' (zeros) between kernel elements, expanding the receptive field without increasing the parameter count or computational cost proportionally."
        },
        {
            id: "u1q39",
            question: "In spatial filtering, a 3×3 mean filter kernel has all 9 elements equal to 1/9. Applying this filter to an image effectively performs:",
            options: [
                "Edge enhancement by emphasizing differences",
                "Low-pass filtering by averaging neighborhood pixels",
                "High-pass filtering by amplifying high frequencies",
                "Morphological erosion"
            ],
            correctIndex: 1,
            explanation: "Averaging each pixel with its 8 neighbors (weighted 1/9 each) smooths the image, removing high-frequency noise. This is equivalent to low-pass filtering in the frequency domain."
        },
        {
            id: "u1q40",
            question: "The ideal Low-Pass Filter (LPF) in the frequency domain sets all frequencies ABOVE the cutoff D₀ to zero. What is its main drawback?",
            options: [
                "It amplifies noise instead of removing it",
                "It causes 'ringing' artifacts (Gibbs phenomenon) in the spatial domain",
                "It sharpens edges instead of blurring them",
                "It requires color images to work"
            ],
            correctIndex: 1,
            explanation: "The ideal LPF has a sharp rectangular cutoff in frequency domain. Its inverse Fourier transform (sinc function) produces oscillatory ringing artifacts near sharp edges — the Gibbs phenomenon."
        },
        {
            id: "u1q41",
            question: "A Butterworth Low-Pass Filter of order n=2 with cutoff D₀ has the transfer function H(u,v) = 1 / (1 + (D/D₀)^(2n)). Compared to the ideal LPF, the Butterworth filter:",
            options: [
                "Produces sharper frequency cutoff with more ringing",
                "Produces a smooth roll-off reducing ringing artifacts",
                "Is always better than the Gaussian LPF",
                "Only works for n > 10"
            ],
            correctIndex: 1,
            explanation: "The Butterworth filter has a smooth (gradual) roll-off from passband to stopband. This smooth transition avoids the sharp discontinuity of the ideal LPF, significantly reducing ringing artifacts."
        },
        {
            id: "u1q42",
            question: "What is the key property of a Gaussian Low-Pass Filter in the frequency domain?",
            options: [
                "Its Fourier transform is also a Gaussian, producing no ringing",
                "It has a sharper cutoff than the ideal LPF",
                "It amplifies mid-frequency components",
                "It is identical to the mean filter"
            ],
            correctIndex: 0,
            explanation: "The Gaussian function is its own Fourier transform. A Gaussian LPF in frequency domain corresponds to Gaussian smoothing in spatial domain, and the smooth roll-off produces zero ringing artifacts."
        },
        {
            id: "u1q43",
            question: "In morphological image processing, EROSION shrinks bright regions. Which operation performs EROSION followed by DILATION?",
            options: [
                "Closing",
                "Opening",
                "Gradient",
                "Top-hat transform"
            ],
            correctIndex: 1,
            explanation: "Opening = Erosion followed by Dilation. It removes small bright objects (noise) while preserving the shape and size of larger objects. Closing = Dilation then Erosion (fills small dark holes)."
        },
        {
            id: "u1q44",
            question: "In the frequency domain, the DFT of a spatial-domain convolution (f * g) equals:",
            options: [
                "F(u,v) + G(u,v)",
                "F(u,v) − G(u,v)",
                "F(u,v) × G(u,v)",
                "F(u,v) / G(u,v)"
            ],
            correctIndex: 2,
            explanation: "The Convolution Theorem states that spatial-domain convolution (f * g) corresponds to pointwise multiplication in the frequency domain: DFT(f * g) = F(u,v) × G(u,v). This is why filtering is efficient in the frequency domain."
        },
        {
            id: "u1q45",
            question: "When computing the DFT for filtering, why is np.fft.fftshift() applied?",
            options: [
                "To normalize the DFT coefficients to [0,1]",
                "To shift the zero-frequency (DC) component to the CENTER of the spectrum",
                "To apply the inverse DFT",
                "To convert from complex to real values"
            ],
            correctIndex: 1,
            explanation: "np.fft.fftshift() rearranges the DFT output so the DC component (zero frequency) is at the center. This makes it visually intuitive and easier to define circular frequency-domain filters."
        },
        {
            id: "u1q46",
            question: "Which noise model adds pixel values drawn from a Gaussian distribution N(0, σ²) to the original image?",
            options: [
                "Salt-and-pepper noise",
                "Poisson noise",
                "Speckle noise",
                "Gaussian (additive white) noise"
            ],
            correctIndex: 3,
            explanation: "Gaussian noise adds random values from a zero-mean Gaussian distribution to each pixel: noisy = original + N(0, σ²). It models electronic sensor noise and thermal noise in camera systems."
        },
        {
            id: "u1q47",
            question: "A Max filter (morphological dilation) replaces each pixel with the MAXIMUM value in its neighborhood. It is effective for removing:",
            options: [
                "Salt noise (isolated white pixels)",
                "Pepper noise (isolated black pixels)",
                "Gaussian noise",
                "Periodic (sinusoidal) noise"
            ],
            correctIndex: 1,
            explanation: "A Max filter (dilation) picks the maximum value, so isolated dark pixels (pepper noise) get replaced by the maximum of their surroundings, effectively removing them. A Min filter removes salt noise."
        },
        {
            id: "u1q48",
            question: "In the bilateral filter, the parameter σ_color (sigmaColor) controls:",
            options: [
                "The spatial size of the filter kernel",
                "The range of intensities considered 'similar' (color space weighting)",
                "The number of filter iterations",
                "The cutoff frequency in the frequency domain"
            ],
            correctIndex: 1,
            explanation: "σ_color (sigmaColor) defines how much intensity difference is tolerated before downweighting a neighbor. Large σ_color makes the filter more like a Gaussian (ignoring edges); small σ_color strictly preserves edges."
        },
        {
            id: "u1q49",
            question: "After applying a High-Pass Filter (HPF) to an image, the result mainly contains:",
            options: [
                "Smooth, slowly-varying regions (background)",
                "Edges, fine textures, and high-frequency details",
                "The DC component (average intensity)",
                "Low-frequency color information"
            ],
            correctIndex: 1,
            explanation: "A high-pass filter passes high-frequency components and blocks low frequencies. High frequencies in images correspond to edges, sharp transitions, and fine texture."
        },
        {
            id: "u1q50",
            question: "Given PSNR values after applying different filters to a Gaussian-noisy image: Mean=28 dB, Gaussian=30 dB, Bilateral=32 dB. What can we conclude?",
            options: [
                "Mean filter best preserves image quality",
                "Bilateral filter achieves the best noise reduction while preserving quality",
                "All filters perform equally well",
                "Lower PSNR indicates better denoising"
            ],
            correctIndex: 1,
            explanation: "Higher PSNR = less distortion from the original. Bilateral (32 dB) > Gaussian (30 dB) > Mean (28 dB), indicating the bilateral filter best removes Gaussian noise while preserving edges and fine details."
        }
    ]
};
