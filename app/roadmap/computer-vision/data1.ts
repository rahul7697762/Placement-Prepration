import { Unit } from './types';

export const section1Data: Unit = {
    id: "unit-1",
    title: "Unit I: Fundamentals of Image Processing",
    description: "Introduction to image processing, image enhancement, and noise removal & filtering.",
    topics: [
        {
            id: "intro-image-processing",
            title: "Introduction to Image Processing & Computer Vision",
            description: "Key differences between image processing and computer vision, and their applications.",
            details: `
## Introduction to Image Processing

### What is Image Processing?
Image processing is a method of performing operations on an image to:
- **Enhance** the image or extract useful information
- **Input:** An image
- **Output:** Either an improved image or characteristics/features of the image

### What is Computer Vision?
Computer vision aims to make computers **understand and interpret** images and videos as humans do.
- **Input:** An image or video
- **Output:** Interpretation, understanding, or decisions based on the visual data

---

### Key Differences: Image Processing vs Computer Vision

| Aspect | Image Processing | Computer Vision |
|--------|-----------------|-----------------|
| **Goal** | Improve image quality or extract features | Understand scene content and make decisions |
| **Output** | Modified image or numerical features | High-level description or decisions |
| **Intelligence** | Low-level operations | High-level semantic understanding |
| **Examples** | Noise removal, contrast enhancement | Object recognition, autonomous driving |
| **Techniques** | Filters, transforms, histograms | ML/DL models, geometric reasoning |

**Image Processing** operates at the **pixel level** (low-level).
**Computer Vision** operates at the **semantic level** (high-level).

A typical pipeline: Raw Image → *Image Processing* → Enhanced Image → *Computer Vision* → Understanding

---

### Applications of Image Processing
1. **Medical Imaging:** X-ray enhancement, MRI analysis, tumor detection
2. **Remote Sensing:** Satellite image processing, land cover classification
3. **Document Processing:** OCR (Optical Character Recognition), document scanning
4. **Photography:** Photo editing, noise reduction, HDR imaging
5. **Industrial Inspection:** Defect detection in manufacturing
6. **Security:** Fingerprint analysis, face image enhancement

### Applications of Computer Vision
1. **Autonomous Vehicles:** Lane detection, obstacle avoidance, traffic sign recognition
2. **Facial Recognition:** Security systems, phone unlock
3. **Medical Diagnosis:** Disease detection from scans (diabetic retinopathy, cancer)
4. **Augmented Reality:** Tracking and overlaying digital content on real world
5. **Robotics:** Object manipulation, navigation
6. **Retail:** Automated checkout, inventory management
7. **Agriculture:** Crop disease detection, yield prediction

---

### Image File Formats

#### Lossless Formats
**PNG (Portable Network Graphics)**
- Lossless compression using DEFLATE algorithm
- Supports transparency (alpha channel)
- Best for: Graphics, text, screenshots, images with sharp edges
- Larger file sizes than JPEG

**TIFF (Tagged Image File Format)**
- Can be lossless or lossy compressed
- Supports multiple pages and metadata tags
- Best for: Medical imaging, professional photography, archival
- Very flexible, widely used in printing

**BMP (Bitmap)**
- Little or no compression
- Simple, uncompressed format
- Large file sizes
- Native format for Windows

**GIF (Graphics Interchange Format)**
- Lossless compression (LZW)
- Limited to 256 colors
- Supports animation
- Best for: Simple animations, icons

#### Lossy Formats
**JPEG (Joint Photographic Experts Group)**
- DCT-based (Discrete Cosine Transform) compression
- Adjustable quality/compression tradeoff (quality factor 1–100)
- Best for: Natural photographs, complex images
- Artifacts: "Blocky" regions at high compression ratios
- Does NOT support transparency

**WebP**
- Modern format by Google
- Both lossy and lossless support
- Better compression than JPEG/PNG at same quality
- Supports transparency and animation

#### Choosing the Right Format
- **Photos:** JPEG (lossy) or PNG (lossless)
- **Web graphics with transparency:** PNG or WebP
- **Medical/archival:** TIFF
- **Animations:** GIF or WebP
- **Icons/logos:** PNG or SVG
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt

# ========================================
# 1. LOADING AND INSPECTING IMAGES
# ========================================

# Load image in different modes
img_color = cv2.imread('image.jpg', cv2.IMREAD_COLOR)      # BGR (3 channels)
img_gray  = cv2.imread('image.jpg', cv2.IMREAD_GRAYSCALE)  # Single channel
img_alpha = cv2.imread('image.png', cv2.IMREAD_UNCHANGED)  # With alpha channel

# Image properties
print(f"Shape:     {img_color.shape}")    # (Height, Width, Channels)
print(f"Data type: {img_color.dtype}")   # uint8 (0-255 per channel)
print(f"Min/Max:   {img_color.min()} / {img_color.max()}")

# ========================================
# 2. COLOR SPACE CONVERSIONS
# ========================================

# BGR → RGB (for matplotlib display)
img_rgb = cv2.cvtColor(img_color, cv2.COLOR_BGR2RGB)

# BGR → Grayscale
gray = cv2.cvtColor(img_color, cv2.COLOR_BGR2GRAY)

# BGR → HSV
hsv = cv2.cvtColor(img_color, cv2.COLOR_BGR2HSV)
h, s, v = cv2.split(hsv)

# ========================================
# 3. SAVING IN DIFFERENT FORMATS
# ========================================

cv2.imwrite('output.png', img_color)        # Lossless PNG
cv2.imwrite('output.jpg', img_color,        # Lossy JPEG, quality=90
            [cv2.IMWRITE_JPEG_QUALITY, 90])
cv2.imwrite('output_lowq.jpg', img_color,   # High compression
            [cv2.IMWRITE_JPEG_QUALITY, 10])

# ========================================
# 4. BASIC PIXEL OPERATIONS
# ========================================

# Access pixel value (OpenCV uses BGR order)
px = img_color[100, 200]         # pixel at row=100, col=200
print(f"BGR: B={px[0]}, G={px[1]}, R={px[2]}")

# Modify a region
img_copy = img_color.copy()
img_copy[50:150, 50:150] = [0, 0, 255]   # Draw red square

# ========================================
# 5. COMPARING IMAGE FORMATS (SIZE)
# ========================================

import os

cv2.imwrite('/tmp/test.bmp', img_color)
cv2.imwrite('/tmp/test.png', img_color)
cv2.imwrite('/tmp/test.jpg', img_color, [cv2.IMWRITE_JPEG_QUALITY, 95])

for fmt in ['bmp', 'png', 'jpg']:
    size = os.path.getsize(f'/tmp/test.{fmt}')
    print(f"{fmt.upper():4s}: {size:8,d} bytes  ({size/1024:.1f} KB)")
`
        },
        {
            id: "image-enhancement",
            title: "Image Enhancement",
            description: "Contrast enhancement, histogram equalization, and histogram specification.",
            details: `
## Image Enhancement

Image enhancement improves the visual appearance of an image or converts it to a form better suited for analysis.

### 1. Contrast Enhancement

**Contrast** is the difference in intensity between the brightest and darkest areas of an image.

#### Linear Contrast Stretching
Maps the input range [min, max] to the full output range [0, 255].

**Formula:** s = (r - r_min) / (r_max - r_min) × (L - 1)

where:
- r = input pixel value
- r_min, r_max = minimum and maximum input values
- L = number of gray levels (256)
- s = output pixel value

#### Gamma Correction (Power-Law Transform)
**Formula:** s = c × r^γ

- **γ < 1:** Brightens dark images (gamma expansion)
- **γ > 1:** Darkens bright images (gamma compression)
- **γ = 1:** Linear (no change)
- Used in display calibration and HDR imaging

#### Log Transform
**Formula:** s = c × log(1 + r)

- Expands dark pixel values, compresses bright ones
- Useful for Fourier spectrum display (large range of values)

---

### 2. Histogram Equalization

A **histogram** of an image shows the frequency of each intensity level.

**Goal of Histogram Equalization:** Redistribute pixel intensities so the histogram becomes approximately uniform (flat), improving global contrast.

#### Steps for Histogram Equalization:
1. Compute histogram H(r) of the input image
2. Compute normalized histogram (probability): p(r) = H(r) / (M × N)
3. Compute cumulative distribution function (CDF):
   - CDF(k) = Σ p(r_j) for j = 0 to k
4. Map using: s_k = round(CDF(k) × (L - 1))

**Effect:**
- Stretches frequently occurring intensity values
- Dark images become brighter; washed-out images gain contrast
- Works well for images with poor global contrast

**Limitation:** May over-enhance noise in smooth regions.

#### CLAHE (Contrast Limited Adaptive Histogram Equalization)
- Applies histogram equalization on small tiles (local)
- Clips histogram at a limit to prevent over-amplifying noise
- Much better results for medical images and faces

---

### 3. Histogram Specification (Matching)

Instead of equalizing to a flat histogram, map the input histogram to match a **target (specified) histogram**.

**Use case:** Make two images taken under different lighting conditions look similar.

#### Steps:
1. Compute CDF of input image: CDF_s
2. Compute CDF of target histogram: CDF_z
3. For each input level r_k, find output level z that satisfies:
   - CDF_z(z) ≈ CDF_s(r_k)
4. Apply the mapping r_k → z

This gives fine-grained control over the output histogram shape.
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt

img = cv2.imread('image.jpg', cv2.IMREAD_GRAYSCALE)

# ========================================
# 1. CONTRAST STRETCHING
# ========================================

def contrast_stretch(img):
    r_min = img.min()
    r_max = img.max()
    stretched = (img.astype(np.float32) - r_min) / (r_max - r_min) * 255
    return stretched.astype(np.uint8)

stretched = contrast_stretch(img)

# ========================================
# 2. GAMMA CORRECTION
# ========================================

def gamma_correction(img, gamma):
    # Normalize to [0,1], apply gamma, scale back
    normalized = img.astype(np.float32) / 255.0
    corrected  = np.power(normalized, gamma) * 255.0
    return corrected.astype(np.uint8)

bright = gamma_correction(img, 0.5)   # γ < 1: brighter
dark   = gamma_correction(img, 2.0)   # γ > 1: darker

# ========================================
# 3. LOG TRANSFORM
# ========================================

def log_transform(img, c=1):
    log_img = c * np.log1p(img.astype(np.float32))
    # Scale to [0, 255]
    log_img = (log_img / log_img.max() * 255).astype(np.uint8)
    return log_img

log_img = log_transform(img)

# ========================================
# 4. HISTOGRAM EQUALIZATION
# ========================================

# Global histogram equalization
eq_global = cv2.equalizeHist(img)

# CLAHE (Contrast Limited Adaptive Histogram Equalization)
clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
eq_clahe = clahe.apply(img)

# ========================================
# 5. PLOTTING HISTOGRAMS
# ========================================

fig, axes = plt.subplots(2, 3, figsize=(15, 8))

images = [img, stretched, eq_global, eq_clahe, bright, dark]
titles = ['Original', 'Contrast Stretched', 'Hist. Equalized',
          'CLAHE', 'Gamma γ=0.5', 'Gamma γ=2.0']

for ax, image, title in zip(axes.flat, images, titles):
    ax.hist(image.ravel(), bins=256, range=[0, 256], color='gray')
    ax.set_title(title)
    ax.set_xlabel('Pixel Value')
    ax.set_ylabel('Frequency')

plt.tight_layout()
plt.savefig('histograms.png')

# ========================================
# 6. HISTOGRAM SPECIFICATION (MATCHING)
# ========================================

def match_histograms(source, reference):
    """Match histogram of source to reference image."""
    # Compute CDFs
    src_hist, _ = np.histogram(source.flatten(), 256, [0, 256])
    ref_hist, _ = np.histogram(reference.flatten(), 256, [0, 256])

    src_cdf = src_hist.cumsum() / src_hist.sum()
    ref_cdf = ref_hist.cumsum() / ref_hist.sum()

    # Build lookup table: for each src level find closest ref level
    lut = np.zeros(256, dtype=np.uint8)
    for src_val in range(256):
        diff = np.abs(ref_cdf - src_cdf[src_val])
        lut[src_val] = np.argmin(diff)

    return lut[source]

ref_img = cv2.imread('reference.jpg', cv2.IMREAD_GRAYSCALE)
matched = match_histograms(img, ref_img)
`
        },
        {
            id: "noise-filtering",
            title: "Noise Removal and Filtering",
            description: "Types of image noise, spatial domain filtering, and frequency domain filtering.",
            details: `
## Noise Removal and Filtering

### Image Noise and Its Types

**Noise** is any unwanted variation in image intensity that does not correspond to actual scene content.

#### Sources of Noise
- Sensor limitations (thermal noise, shot noise)
- Transmission errors
- Analog-to-digital conversion
- Environmental factors (vibration, lighting variation)

#### Types of Image Noise

**1. Gaussian Noise**
- Most common type
- Follows a **normal distribution** in intensity
- Due to thermal agitation of electrons in sensors
- Affects all pixels uniformly
- **Formula:** PDF(z) = (1/√(2πσ²)) × e^(-(z-μ)²/2σ²)
  - μ = mean (usually 0), σ = standard deviation

**2. Salt-and-Pepper Noise (Impulse Noise)**
- Random white (salt) and black (pepper) pixels
- Due to sudden disturbances in the signal
- Characterized by probability p of a pixel being corrupted

**3. Uniform Noise**
- Noise uniformly distributed between [a, b]
- Less common in practice
- **PDF(z) = 1/(b-a)** for a ≤ z ≤ b

**4. Speckle Noise**
- Multiplicative noise: f(x,y) = s(x,y) × n(x,y)
- Common in **ultrasound** and **SAR (Synthetic Aperture Radar)** images
- Grainy texture appearance

**5. Poisson Noise (Shot Noise)**
- Follows Poisson distribution
- Occurs when detecting photons
- Signal-dependent (noise variance ∝ intensity)

---

### Spatial Domain Filtering

Filters are applied directly in the **spatial domain** (pixel space) using **convolution/correlation** with a kernel.

**General operation:** g(x,y) = H[f(x,y)] where H is the filtering operator

#### Linear Filters

**1. Mean (Averaging) Filter**
- Replace each pixel with the **average** of its neighborhood
- Kernel (3×3): All values = 1/9
- **Effect:** Blurs image, reduces Gaussian noise
- **Drawback:** Also blurs edges

**2. Gaussian Filter**
- Weighted average with Gaussian weights
- **Formula:** G(x,y) = (1/2πσ²) × e^(-(x²+y²)/2σ²)
- Better edge preservation than mean filter
- **σ** controls amount of smoothing
- Most commonly used noise reduction filter

**3. Weighted Average Filter**
- Different weights for neighbors
- Center pixel gets more weight
- Example 3×3: [1,2,1; 2,4,2; 1,2,1] / 16

#### Non-Linear Filters

**4. Median Filter**
- Replace each pixel with the **median** value of its neighborhood
- Excellent for **salt-and-pepper noise**
- **Preserves edges** better than linear filters
- Does not spread noise across edges

**5. Min/Max Filter**
- Min filter: Replace with minimum (erosion effect, removes bright spots)
- Max filter: Replace with maximum (dilation effect, removes dark spots)

**6. Bilateral Filter**
- Weighted average considering both **spatial distance** and **intensity similarity**
- Preserves edges while smoothing flat regions
- **Formula:** Combines Gaussian spatial kernel with intensity range kernel
- Computationally expensive but very effective

---

### Frequency Domain Filtering

Operate on the **Fourier transform** of the image.

#### Discrete Fourier Transform (DFT)
Convert spatial domain → frequency domain:

**F(u,v) = Σ Σ f(x,y) × e^(-j2π(ux/M + vy/N))**

- **Low frequencies:** Slowly varying regions (background)
- **High frequencies:** Rapidly changing regions (edges, noise)

**Convolution Theorem:** Convolution in spatial domain = Multiplication in frequency domain

#### Types of Frequency Domain Filters

**1. Low-Pass Filter (LPF)**
- Passes low frequencies, blocks high frequencies
- **Effect:** Blurs image, removes high-frequency noise
- Types: Ideal LPF, Butterworth LPF, Gaussian LPF

**2. High-Pass Filter (HPF)**
- Passes high frequencies, blocks low frequencies
- **Effect:** Enhances edges and fine details
- Used for edge detection and sharpening

**3. Band-Pass / Band-Reject Filter**
- Band-pass: Passes frequencies in a specific range
- Band-reject (Notch filter): Removes specific frequencies (e.g., periodic noise)

#### Why Use Frequency Domain?
- Some operations are easier to implement/understand
- Computationally efficient using FFT (Fast Fourier Transform) – O(N log N) vs O(N²)
- Can visualize and selectively remove noise frequencies
- Periodic noise is easy to identify and remove in frequency domain
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt

img = cv2.imread('image.jpg', cv2.IMREAD_GRAYSCALE).astype(np.float32)

# ========================================
# 1. ADDING DIFFERENT TYPES OF NOISE
# ========================================

def add_gaussian_noise(img, mean=0, sigma=25):
    noise = np.random.normal(mean, sigma, img.shape).astype(np.float32)
    noisy = np.clip(img + noise, 0, 255).astype(np.uint8)
    return noisy

def add_salt_pepper_noise(img, prob=0.05):
    noisy = img.copy().astype(np.uint8)
    # Salt (white pixels)
    salt_mask = np.random.random(img.shape) < prob / 2
    noisy[salt_mask] = 255
    # Pepper (black pixels)
    pepper_mask = np.random.random(img.shape) < prob / 2
    noisy[pepper_mask] = 0
    return noisy

img_uint8 = img.astype(np.uint8)
noisy_gaussian   = add_gaussian_noise(img_uint8, sigma=30)
noisy_sp         = add_salt_pepper_noise(img_uint8, prob=0.05)

# ========================================
# 2. SPATIAL DOMAIN FILTERS
# ========================================

# Mean (Averaging) filter
mean_filtered = cv2.blur(noisy_gaussian, (5, 5))

# Gaussian filter
gauss_filtered = cv2.GaussianBlur(noisy_gaussian, (5, 5), sigmaX=1.5)

# Median filter — best for salt & pepper noise
median_filtered = cv2.medianBlur(noisy_sp, 5)

# Bilateral filter — edge-preserving
bilateral = cv2.bilateralFilter(noisy_gaussian, d=9,
                                sigmaColor=75, sigmaSpace=75)

# Custom kernel: Sharpening
sharpen_kernel = np.array([[ 0, -1,  0],
                            [-1,  5, -1],
                            [ 0, -1,  0]])
sharpened = cv2.filter2D(img_uint8, -1, sharpen_kernel)

# ========================================
# 3. FREQUENCY DOMAIN FILTERING
# ========================================

def frequency_domain_filter(img, filter_type='low', cutoff=30):
    # Compute DFT
    dft = np.fft.fft2(img)
    dft_shifted = np.fft.fftshift(dft)  # Center the zero-frequency

    rows, cols = img.shape
    crow, ccol = rows // 2, cols // 2   # Center

    # Create circular mask
    mask = np.zeros((rows, cols), dtype=np.float32)
    y, x = np.ogrid[:rows, :cols]
    dist = np.sqrt((x - ccol)**2 + (y - crow)**2)

    if filter_type == 'low':
        mask[dist <= cutoff] = 1   # Pass low frequencies
    elif filter_type == 'high':
        mask[dist > cutoff] = 1    # Pass high frequencies

    # Apply mask and inverse DFT
    filtered_dft = dft_shifted * mask
    filtered_idft = np.fft.ifftshift(filtered_dft)
    filtered_img  = np.abs(np.fft.ifft2(filtered_idft))

    return np.clip(filtered_img, 0, 255).astype(np.uint8)

lpf_result = frequency_domain_filter(img, 'low',  cutoff=40)
hpf_result = frequency_domain_filter(img, 'high', cutoff=40)

# ========================================
# 4. VISUALIZING THE DFT SPECTRUM
# ========================================

dft         = np.fft.fft2(img)
dft_shifted = np.fft.fftshift(dft)
magnitude   = np.abs(dft_shifted)
spectrum    = np.log1p(magnitude)  # Log scale for visualization
spectrum    = (spectrum / spectrum.max() * 255).astype(np.uint8)

print("Spatial filters applied:")
print(f"  Mean filter:     PSNR = {cv2.PSNR(img_uint8, mean_filtered):.2f} dB")
print(f"  Gaussian filter: PSNR = {cv2.PSNR(img_uint8, gauss_filtered):.2f} dB")
print(f"  Bilateral:       PSNR = {cv2.PSNR(img_uint8, bilateral):.2f} dB")
`
        }
    ]
};
