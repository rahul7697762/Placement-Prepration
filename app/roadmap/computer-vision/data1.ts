import { Unit } from './types';

export const section1Data: Unit = {
    id: "section-1",
    title: "Section 1: Digital Image Fundamentals",
    description: "Core concepts of image formation, sampling, quantization, and representation.",
    topics: [
        {
            id: "image-formation",
            title: "Image Formation & Digital Representation",
            description: "Understanding how images are captured, sampled, and stored digitally.",
            details: `
## Digital Image Fundamentals

### What is a Digital Image?
A digital image is a two-dimensional function **f(x, y)**, where:
- **(x, y)** are spatial coordinates
- **f** is the amplitude at any pair of coordinates, called **intensity** or **gray level**

When x, y, and f are all finite and discrete quantities, we call it a **digital image**.

---

### Image Acquisition Process

#### 1. Image Formation (Physical World → Sensor)
The process begins with electromagnetic energy (light) that is:
1. **Illuminated** by an energy source
2. **Reflected** from objects in the scene
3. **Captured** by imaging sensors (cameras)

The energy captured depends on:
- **Illumination**: i(x, y) - Amount of source illumination incident on the scene
- **Reflectance**: r(x, y) - Amount of illumination reflected by objects
- **Combined**: f(x, y) = i(x, y) × r(x, y)

**Typical Ranges:**
- 0 < i(x, y) < ∞
- 0 < r(x, y) < 1 (Total absorption = 0, Total reflection = 1)

#### 2. Sampling (Spatial Digitization)
Converting continuous spatial coordinates into discrete values.

**Key Concept:** Nyquist Sampling Theorem
- To avoid aliasing (distortion), sample at **at least twice** the highest frequency present in the image
- Undersampling causes **aliasing** (checkerboard patterns, moiré patterns)

**Spatial Resolution:** Determined by the smallest discernible detail
- Higher resolution = More samples = Larger file size
- Common resolutions: 640×480 (VGA), 1920×1080 (Full HD), 3840×2160 (4K)

#### 3. Quantization (Intensity Digitization)
Converting continuous intensity values into discrete levels.

**Gray Levels:** L = 2^k where k is the number of bits
- k = 1: Binary image (2 levels - black/white)
- k = 8: 256 gray levels (standard grayscale)
- k = 16: 65,536 levels (medical imaging)

**Quantization Effects:**
- Too few levels → **False contouring** (visible boundaries between intensity regions)
- Storage requirement = M × N × k bits (for M×N image with k-bit depth)

---

### Pixel Relationships and Connectivity

#### Distance Metrics Between Pixels
For pixels p at (x, y) and q at (s, t):

1. **Euclidean Distance**
   - D_e(p, q) = √[(x-s)² + (y-t)²]
   - Geometric straight-line distance

2. **City Block Distance (D4)**
   - D_4(p, q) = |x-s| + |y-t|
   - Manhattan distance (taxi-cab metric)

3. **Chessboard Distance (D8)**
   - D_8(p, q) = max(|x-s|, |y-t|)
   - King's move in chess

#### Pixel Neighbors
For a pixel p at (x, y):

**4-neighbors (N₄(p)):**
- Horizontal and vertical neighbors
- (x+1, y), (x-1, y), (x, y+1), (x, y-1)

**Diagonal neighbors (N_D(p)):**
- (x+1, y+1), (x+1, y-1), (x-1, y+1), (x-1, y-1)

**8-neighbors (N₈(p)):**
- N₄(p) ∪ N_D(p)
- All surrounding pixels

#### Adjacency and Connectivity
Two pixels are **adjacent** if they:
1. Are neighbors (based on chosen neighborhood)
2. Satisfy a gray-level similarity criterion

**Types of Adjacency:**
- **4-adjacency**: Using N₄
- **8-adjacency**: Using N₈
- **m-adjacency** (mixed): Eliminates multiple path ambiguities

**Path:** Sequence of distinct pixels with each pixel adjacent to the next
**Connected Component:** Set of pixels with a connecting path between any two pixels

---

### Color Image Fundamentals

#### RGB Color Model (Additive)
Most common model for displays and cameras.
- **Red (R)**, **Green (G)**, **Blue (B)** channels
- Each channel typically 8-bit (0-255)
- Total: 24-bit color = 16.7 million colors
- **(0,0,0)** = Black, **(255,255,255)** = White

**Color Cube Representation:**
- 3D space with R, G, B axes
- Main diagonal = Gray levels (R=G=B)

#### CMY/CMYK Color Model (Subtractive)
Used in printing.
- **Cyan (C)**, **Magenta (M)**, **Yellow (Y)**
- Conversion: C = 1 - R, M = 1 - G, Y = 1 - B
- **K (Black)** added for practical reasons (CMYK)

#### HSV/HSI Color Model
Decouples chromatic information from intensity.

**Components:**
1. **Hue (H)**: Color type
   - Represented as angle (0-360°)
   - 0° = Red, 120° = Green, 240° = Blue

2. **Saturation (S)**: Color purity
   - 0 = Gray (no color)
   - 1 = Pure color
   - Distance from gray axis in HSV cone

3. **Value/Intensity (V/I)**: Brightness
   - 0 = Black
   - 1 = Maximum brightness

**Why HSV for Computer Vision?**
- Separates color from lighting conditions
- Better for color-based segmentation and tracking
- Robust to illumination changes
- Human perception is closer to HSV than RGB

**RGB to HSV Conversion:**
V = max(R, G, B)
S = (V - min(R, G, B)) / V  if V ≠ 0
H = angle depending on which component is max


---

### Image File Formats (Storage)

#### Lossless Formats
**PNG (Portable Network Graphics)**
- Lossless compression
- Supports transparency (alpha channel)
- Best for: Graphics, text, screenshots
- Larger file sizes than JPEG

**TIFF (Tagged Image File Format)**
- Can be compressed or uncompressed
- Supports multiple pages
- Best for: Medical imaging, professional photography
- Contains metadata tags

**BMP (Bitmap)**
- Minimal or no compression
- Large file sizes
- Simple structure

#### Lossy Formats
**JPEG (Joint Photographic Experts Group)**
- DCT-based compression
- Adjustable quality/compression tradeoff
- Best for: Natural photographs
- Artifacts appear as "blocky" regions at high compression

**Key Concept:** Lossy compression removes information that human eye is less sensitive to (high-frequency details, slight color variations)
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt

# ========================================
# 1. IMAGE I/O AND BASIC PROPERTIES
# ========================================

# Load image in different modes
img_color = cv2.imread('image.jpg', cv2.IMREAD_COLOR)      # BGR, 8-bit per channel
img_gray = cv2.imread('image.jpg', cv2.IMREAD_GRAYSCALE)   # Single channel
img_unchanged = cv2.imread('image.jpg', cv2.IMREAD_UNCHANGED) # With alpha if present

# Check if image loaded successfully
if img_color is None:
    print("Error: Could not load image")
    exit()

# Image properties
print(f"Shape: {img_color.shape}")        # (Height, Width, Channels)
print(f"Size: {img_color.size} pixels")   # Total number of elements
print(f"Data type: {img_color.dtype}")    # Usually uint8
print(f"Dimensions: {img_color.ndim}")    # 2 for grayscale, 3 for color

# ========================================
# 2. PIXEL ACCESS AND MANIPULATION
# ========================================

# Access individual pixel (returns BGR, not RGB!)
px = img_color[100, 100]
print(f"Pixel at (100,100): B={px[0]}, G={px[1]}, R={px[2]}")

# Modify pixel value
img_color[100, 100] = [255, 255, 255]  # Set to white

# Access specific channel
blue_channel = img_color[:, :, 0]
green_channel = img_color[:, :, 1]
red_channel = img_color[:, :, 2]

# ========================================
# 3. COLOR SPACE CONVERSIONS
# ========================================

# BGR to RGB (for matplotlib display)
img_rgb = cv2.cvtColor(img_color, cv2.COLOR_BGR2RGB)

# BGR to Grayscale
gray = cv2.cvtColor(img_color, cv2.COLOR_BGR2GRAY)

# BGR to HSV
hsv = cv2.cvtColor(img_color, cv2.COLOR_BGR2HSV)

# Split HSV channels
h, s, v = cv2.split(hsv)
print(f"Hue range: {h.min()}-{h.max()}")        # 0-179 in OpenCV
print(f"Saturation range: {s.min()}-{s.max()}") # 0-255
print(f"Value range: {v.min()}-{v.max()}")      # 0-255

# Merge channels back
merged = cv2.merge([h, s, v])

# ========================================
# 4. REGION OF INTEREST (ROI)
# ========================================

# Extract ROI (Region of Interest)
roi = img_color[200:400, 300:500]  # [y1:y2, x1:x2]

# Copy ROI to another location
img_color[50:250, 50:250] = roi

# ========================================
# 5. CHANNEL OPERATIONS
# ========================================

# Split into individual channels
b, g, r = cv2.split(img_color)

# Create image with only blue channel
img_blue_only = img_color.copy()
img_blue_only[:, :, 1] = 0  # Zero out green
img_blue_only[:, :, 2] = 0  # Zero out red

# ========================================
# 6. QUANTIZATION DEMONSTRATION
# ========================================

def quantize_image(img, levels):
    """Reduce number of intensity levels"""
    factor = 256 / levels
    quantized = (img / factor).astype(np.uint8) * factor
    return quantized

# Demonstrate false contouring with different bit depths
img_4bit = quantize_image(gray, 16)   # 4 bits = 16 levels
img_3bit = quantize_image(gray, 8)    # 3 bits = 8 levels
img_2bit = quantize_image(gray, 4)    # 2 bits = 4 levels

# ========================================
# 7. DISTANCE CALCULATIONS
# ========================================

def calculate_distances(p1, p2):
    """Calculate different distance metrics between two points"""
    x1, y1 = p1
    x2, y2 = p2
    
    # Euclidean distance
    d_euclidean = np.sqrt((x2-x1)**2 + (y2-y1)**2)
    
    # City block (Manhattan) distance
    d_cityblock = abs(x2-x1) + abs(y2-y1)
    
    # Chessboard distance
    d_chessboard = max(abs(x2-x1), abs(y2-y1))
    
    return d_euclidean, d_cityblock, d_chessboard

point1 = (10, 20)
point2 = (50, 80)
de, d4, d8 = calculate_distances(point1, point2)
print(f"Distances: Euclidean={de:.2f}, CityBlock={d4}, Chessboard={d8}")
`
        }
    ]
};
