import { Unit } from './types';

export const section6Data: Unit = {
    id: "unit-6",
    title: "Unit VI: Image Segmentation & Advanced Computer Vision",
    description: "Image segmentation techniques and advanced topics including Vision Transformers, generative models, and Vision-Language Models.",
    topics: [
        {
            id: "image-segmentation",
            title: "Image Segmentation",
            description: "Thresholding, edge-based, region-based, and clustering-based segmentation.",
            details: `
## Image Segmentation

### Overview of Image Segmentation

**Image segmentation** partitions an image into meaningful regions or segments. Each segment corresponds to a distinct object, surface, or semantic category.

**Types of segmentation:**
- **Semantic segmentation:** Assign a class label to every pixel (e.g., road, car, sky)
- **Instance segmentation:** Separately identify and segment each object instance
- **Panoptic segmentation:** Combination of semantic + instance segmentation

**Applications:**
- Medical imaging (tumor delineation, organ segmentation)
- Autonomous driving (road, pedestrian, vehicle detection)
- Satellite image analysis
- Object-based image compression
- Video surveillance

---

### 1. Thresholding-Based Segmentation

**Idea:** Separate pixels into foreground and background based on intensity.

#### Global Thresholding
**Binary thresholding:**
- Pixel value > T → foreground (255)
- Pixel value ≤ T → background (0)

**Choosing T:**
- Manual: Domain knowledge
- **Otsu's Method (automatic):** Maximizes between-class variance

#### Otsu's Method
Finds the threshold T that **minimizes within-class variance** (equivalently maximizes between-class variance):

**σ²_between(T) = w₀(T) × w₁(T) × [μ₀(T) - μ₁(T)]²**

where:
- w₀, w₁ = fraction of pixels in each class
- μ₀, μ₁ = mean intensity of each class

Tries all possible T values (0–255), selects T with maximum σ²_between.

**Works well when:** Bimodal histogram (clear separation of foreground and background).

#### Adaptive Thresholding
- Use different thresholds for different regions
- **Mean-adaptive:** T = local mean - C
- **Gaussian-adaptive:** T = Gaussian-weighted local mean - C
- Better for images with non-uniform illumination

#### Multi-Level Thresholding
- Multiple thresholds T₁, T₂, ..., Tₙ create multiple regions
- **Otsu extended** to multiple classes or use histogram analysis

---

### 2. Edge-Based Segmentation

**Idea:** Use edges (boundaries between regions) to define segment borders.

#### Step 1: Edge Detection
- Apply gradient operator (Sobel, Prewitt, Canny)
- **Canny Edge Detector** (best practice):
  1. Gaussian smoothing
  2. Gradient magnitude and direction (Sobel)
  3. Non-maximum suppression (thin edges to 1 pixel)
  4. Double thresholding (strong and weak edges)
  5. Edge tracking by hysteresis (connect weak edges to strong)

#### Step 2: Edge Linking
- Detected edges are often **broken or disconnected**
- Link pixels with similar gradient magnitude/direction
- Use **graph search** to find closed contours

#### Step 3: Region Filling
- After finding closed contours → fill inside contour to form regions

**Limitations:**
- Noise creates spurious edges
- Edges often don't form closed contours
- Post-processing required to extract clean regions

#### Hough Transform
- Detect specific shapes (lines, circles, ellipses) from edge points
- Maps edge pixels to parameter space; accumulate votes
- **Line detection:** ρ = x cos(θ) + y sin(θ) → peaks in (ρ, θ) space

---

### 3. Region-Based Segmentation

**Idea:** Group pixels into regions based on **similarity** (intensity, color, texture).

#### Region Growing
1. Select **seed pixels** (manually or automatically)
2. Expand each region by adding neighboring pixels that satisfy a **similarity criterion** (|I(neighbor) - I(seed)| < threshold)
3. Continue until no more pixels can be added
4. Merge regions that are sufficiently similar

**Pros:** Simple, can produce connected regions.
**Cons:** Result depends on seed selection; sensitive to noise.

#### Region Splitting and Merging (Quadtree)
1. **Split:** If a region is not uniform (variance > threshold), split into 4 quadrants
2. **Merge:** Merge adjacent regions if their union is uniform
3. Uses **quadtree** data structure for hierarchical subdivision

**Pros:** No seed dependence.
**Cons:** Blocky results (aligned with quadtree grid).

#### Watershed Algorithm
Treats image as a **topographic landscape** (intensity = elevation):
1. Local minima = catchment basins (seeds)
2. Water "rises" from each basin simultaneously
3. Where water from different basins meets = **watershed line** (boundary)

**Problem:** Over-segmentation (too many regions) due to noise minima.
**Solution:** Use **markers** (seeds) to control flood sources.

---

### 4. Clustering-Based Segmentation

#### K-Means Clustering
1. Choose K cluster centers randomly
2. Assign each pixel to the nearest center (by color/intensity distance)
3. Recompute centers as mean of assigned pixels
4. Repeat until convergence

**Can cluster in:**
- Intensity space: 1D
- RGB space: 3D
- RGB + spatial (x,y): 5D (more coherent regions)

**Pros:** Simple, efficient.
**Cons:** K must be specified, sensitive to initialization, assumes spherical clusters.

#### Mean Shift Clustering
- **Non-parametric** clustering — no need to specify K
- Slides a window toward the **mode** (peak) of the local density
- Multiple windows converge to different modes → cluster boundaries
- **Pros:** Automatically finds K, handles arbitrary cluster shapes.
- **Cons:** Slower than K-means.

#### Graph Cut (GrabCut)
Formulates segmentation as an **energy minimization** on a graph:
- Nodes = pixels + two terminal nodes (source = foreground, sink = background)
- Edges = pixel similarities (n-links) and foreground/background affinities (t-links)
- **Min-cut/Max-flow** finds the partition with minimum energy
- **GrabCut:** Interactive version with bounding box or scribble initialization

#### DBSCAN (Density-Based)
- Groups densely connected points as clusters
- Marks low-density points as noise (outliers)
- Useful for point cloud segmentation
            `,
            codeExample: `
import cv2
import numpy as np
from matplotlib import pyplot as plt
from sklearn.cluster import KMeans

img  = cv2.imread('scene.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# ========================================
# 1. THRESHOLDING SEGMENTATION
# ========================================

# Global threshold (manual)
_, binary = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)

# Otsu's automatic threshold
thresh_val, otsu = cv2.threshold(gray, 0, 255,
                                  cv2.THRESH_BINARY + cv2.THRESH_OTSU)
print(f"Otsu threshold: {thresh_val}")

# Adaptive thresholding (for non-uniform lighting)
adaptive_mean  = cv2.adaptiveThreshold(gray, 255,
                    cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)
adaptive_gauss = cv2.adaptiveThreshold(gray, 255,
                    cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

# ========================================
# 2. EDGE-BASED SEGMENTATION (CANNY)
# ========================================

# Canny edge detector
edges = cv2.Canny(gray, threshold1=50, threshold2=150, apertureSize=3)

# Find contours from edges
contours, hierarchy = cv2.findContours(
    edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Draw contours on image
img_contours = img.copy()
cv2.drawContours(img_contours, contours, -1, (0, 255, 0), 2)
print(f"Canny: {len(contours)} contours found")

# Hough Line Detection
lines = cv2.HoughLinesP(edges, rho=1, theta=np.pi/180,
                         threshold=100, minLineLength=50, maxLineGap=10)
if lines is not None:
    img_lines = img.copy()
    for line in lines:
        x1, y1, x2, y2 = line[0]
        cv2.line(img_lines, (x1, y1), (x2, y2), (255, 0, 0), 2)
    print(f"Hough: {len(lines)} lines detected")

# ========================================
# 3. REGION-BASED SEGMENTATION
# ========================================

# Watershed Algorithm
def watershed_segment(img_bgr):
    gray   = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 0, 255,
                               cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Noise removal
    kernel  = np.ones((3,3), np.uint8)
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2)

    # Sure background and foreground
    sure_bg  = cv2.dilate(opening, kernel, iterations=3)
    dist     = cv2.distanceTransform(opening, cv2.DIST_L2, 5)
    _, sure_fg = cv2.threshold(dist, 0.7 * dist.max(), 255, 0)
    sure_fg  = sure_fg.astype(np.uint8)

    # Unknown region
    unknown  = cv2.subtract(sure_bg, sure_fg)

    # Label markers
    _, markers = cv2.connectedComponents(sure_fg)
    markers    = markers + 1
    markers[unknown == 255] = 0

    # Apply watershed
    markers = cv2.watershed(img_bgr, markers)

    # Mark boundaries in red
    result = img_bgr.copy()
    result[markers == -1] = [255, 0, 0]
    return result, markers

ws_result, ws_markers = watershed_segment(img)
n_segments = ws_markers.max()
print(f"Watershed: {n_segments} segments")

# Region Growing
def region_growing(img_gray, seed, threshold=15):
    """Simple region growing from a seed point."""
    h, w    = img_gray.shape
    visited = np.zeros((h, w), dtype=bool)
    region  = np.zeros((h, w), dtype=np.uint8)
    queue   = [seed]
    seed_val = int(img_gray[seed[1], seed[0]])
    visited[seed[1], seed[0]] = True

    while queue:
        x, y = queue.pop(0)
        region[y, x] = 255
        for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx]:
                if abs(int(img_gray[ny, nx]) - seed_val) < threshold:
                    visited[ny, nx] = True
                    queue.append((nx, ny))
    return region

# Grow from center
cx, cy    = gray.shape[1] // 2, gray.shape[0] // 2
grown_region = region_growing(gray, (cx, cy), threshold=20)
print(f"Region growing: {grown_region.sum() // 255} pixels in region")

# ========================================
# 4. K-MEANS CLUSTERING SEGMENTATION
# ========================================

def kmeans_segment(img_bgr, K=4, include_position=False):
    """Segment image using K-Means clustering."""
    h, w = img_bgr.shape[:2]
    pixels = img_bgr.reshape(-1, 3).astype(np.float32)

    if include_position:
        # Add spatial coordinates for position-aware clustering
        y_coords, x_coords = np.mgrid[0:h, 0:w]
        coords = np.stack([x_coords.ravel(), y_coords.ravel()], axis=1).astype(np.float32)
        # Normalize position to similar scale as color
        coords /= np.array([w, h]) * 0.5
        pixels = np.hstack([pixels / 255.0, coords])

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
    _, labels, centers = cv2.kmeans(pixels[:, :3] if not include_position else pixels,
                                     K, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

    # Reconstruct segmented image
    centers_bgr = (centers[:, :3] * (255 if include_position else 1)).astype(np.uint8)
    segmented   = centers_bgr[labels.flatten()].reshape(h, w, 3)
    return segmented, labels.reshape(h, w)

segmented_k4, labels_k4 = kmeans_segment(img, K=4)
segmented_k8, labels_k8 = kmeans_segment(img, K=8)

print(f"K-Means (K=4): {np.unique(labels_k4).size} segments")
`
        },
        {
            id: "advanced-topics",
            title: "Advanced Topics in Computer Vision",
            description: "Generative models, Vision Transformers, multimodal vision, large vision models, and Vision-Language Models.",
            details: `
## Advanced Topics in Computer Vision

### 1. Generative Models

Generative models learn the underlying **data distribution** and can generate new, realistic images.

#### Generative Adversarial Networks (GANs)
Introduced by Goodfellow et al. (2014).

**Two-network system:**
- **Generator G:** Takes random noise z → generates fake images G(z)
- **Discriminator D:** Classifies images as real or fake, outputs probability D(x)

**Min-max objective:**
\`\`\`
min_G max_D E[log D(x)] + E[log(1 - D(G(z)))]
\`\`\`

**Key GAN variants:**
- **DCGAN:** Deep convolutional GAN (stable training)
- **StyleGAN / StyleGAN2:** High-quality face generation with style control
- **Pix2Pix:** Conditional GAN for image-to-image translation (sketch→photo)
- **CycleGAN:** Unpaired image-to-image translation (horse↔zebra)
- **BigGAN:** Large-scale class-conditional generation

**Applications:**
- Data augmentation, super-resolution, inpainting, style transfer, deepfakes (detection)

#### Variational Autoencoders (VAEs)
- Encoder maps image to latent space (mean μ, variance σ)
- Decoder reconstructs image from sampled latent code z ~ N(μ, σ²)
- **ELBO loss:** Reconstruction + KL divergence regularization
- Smooth, interpolatable latent space
- Less sharp than GANs but more stable to train

#### Diffusion Models
State-of-the-art generative models (2021–present).

**Forward process:** Gradually add Gaussian noise to data over T steps.
**Reverse process (denoising):** Train a neural network to reverse the noise at each step.

**Key models:**
- **DDPM** (Ho et al., 2020): Denoising Diffusion Probabilistic Models
- **Stable Diffusion:** Latent diffusion model — run diffusion in compressed latent space
- **DALL-E 2, Imagen:** Text-guided image generation

**Advantages over GANs:** No mode collapse, more stable training, better diversity.

---

### 2. Vision Transformers (ViT)

Dosovitskiy et al. (2020) applied the **Transformer architecture** (originally for NLP) to images.

#### How ViT Works:
1. **Patch embedding:** Split image into fixed-size patches (e.g., 16×16 pixels)
2. **Linear projection:** Flatten each patch, project to embedding dimension D
3. **Position embeddings:** Add learnable position encodings
4. **[CLS] token:** Prepend a classification token
5. **Transformer encoder:** L layers of Multi-head Self-Attention + MLP
6. **Classification head:** Use [CLS] token embedding for final prediction

**Self-Attention mechanism:**
- Each patch attends to all other patches
- **Q, K, V = patch embeddings × weight matrices**
- Attention(Q, K, V) = softmax(QKᵀ/√d_k) × V
- Captures **global context** from the first layer (vs CNNs which are local)

#### ViT Variants
- **DeiT:** Data-efficient ViT — distillation training for smaller datasets
- **Swin Transformer:** Hierarchical ViT with shifted windows — efficient for dense prediction
- **BEiT:** BERT-style pre-training for vision (mask patch modeling)
- **MAE (Masked Autoencoder):** Pre-train by reconstructing masked patches

**ViT vs CNN:**
| | CNN | ViT |
|--|-----|-----|
| **Inductive bias** | Translation equivariance, locality | None |
| **Data efficiency** | Better (less data) | Needs more data (or pretraining) |
| **Scalability** | Limited | Scales well with data and compute |
| **Global context** | Needs deep network | From first layer |

---

### 3. Multimodal Vision Models

**Multimodal models** process and relate multiple modalities — primarily **images and text**.

#### CLIP (Contrastive Language-Image Pretraining)
Radford et al. (OpenAI, 2021).

**Training:** 400M image-text pairs from the internet.
**Method:** Contrastive learning — maximize similarity of matching image-text pairs, minimize similarity of non-matching pairs.

**Two encoders:**
- Image encoder (ViT or ResNet) → image embedding
- Text encoder (Transformer) → text embedding

**Applications:**
- **Zero-shot image classification:** No fine-tuning needed for new classes
- **Text-to-image retrieval:** Find images matching a text query
- Foundation for many downstream models

#### ALIGN, Florence, ImageBind
- Similar vision-language contrastive learning approaches
- Scale to even larger datasets and modalities

---

### 4. Large Vision Models (Foundation Models)

**Foundation models** are large models pre-trained on massive datasets that can be fine-tuned or adapted for many downstream tasks.

#### SAM (Segment Anything Model)
Meta AI (2023).
- Pre-trained on 1 billion masks across 11 million images
- Can segment **any object** given a point, box, or text prompt
- Zero-shot generalization to unseen categories and domains

**Architecture:**
- Image encoder (MAE pre-trained ViT)
- Prompt encoder (points, boxes, text)
- Mask decoder (lightweight Transformer)

#### DINO / DINOv2
Self-supervised vision features.
- **DINO:** Self-distillation with no labels — emerges semantic segmentation
- **DINOv2:** Improved training, state-of-the-art general-purpose visual features
- Used as backbone for many downstream tasks

#### Grounding DINO
Open-set object detection — detect any object described by text.

---

### 5. Vision-Language Models (VLMs)

VLMs combine visual understanding with language generation.

#### Architecture
Typically: **Vision Encoder + Language Model**

1. **Extract image features:** Use a pre-trained vision encoder (ViT/CLIP)
2. **Project to language space:** MLP or cross-attention to map visual tokens to LLM token space
3. **Language model generates response:** GPT-style autoregressive generation

#### Key Models

**LLaVA (Large Language and Vision Assistant)**
- Connects CLIP image encoder with Vicuna/LLaMA language model
- Visual instruction tuning on image-text conversation data

**GPT-4V / GPT-4o**
- OpenAI's multimodal model
- Answers questions about images, documents, charts

**Gemini (Google)**
- Natively multimodal (trained on text, images, audio, video together)

**InternVL / Qwen-VL / CogVLM**
- Open-source VLMs with strong performance

#### Capabilities of VLMs
- **Visual Question Answering (VQA):** "What color is the car?"
- **Image captioning:** Describe what's in an image
- **OCR and document understanding:** Extract text from images
- **Chart and diagram analysis:** Interpret graphs, plots
- **Visual reasoning:** Multi-step reasoning with images
- **Grounding:** Locate objects mentioned in text (predict bounding boxes)

#### Training Pipeline
1. **Pre-training:** Align visual features with language (image-text pairs)
2. **Instruction fine-tuning:** Train on instruction-following data (image + question → answer)
3. **RLHF (optional):** Human feedback for better alignment

#### Evaluation Benchmarks
- **VQAv2:** Visual question answering
- **MMBench:** Multimodal benchmark
- **MMMU:** Multi-discipline multimodal understanding
- **TextVQA:** QA on images with text
- **ScienceQA:** Scientific reasoning with images
            `,
            codeExample: `
import torch
import numpy as np
from PIL import Image

# ========================================
# 1. USING CLIP FOR ZERO-SHOT CLASSIFICATION
# ========================================

# pip install transformers
from transformers import CLIPProcessor, CLIPModel

model     = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Load image
image = Image.open("image.jpg")

# Zero-shot classification
class_names = ["a photo of a cat",
               "a photo of a dog",
               "a photo of a car",
               "a photo of a person"]

inputs  = processor(text=class_names, images=image,
                    return_tensors="pt", padding=True)

with torch.no_grad():
    outputs    = model(**inputs)
    logits     = outputs.logits_per_image   # (1, num_classes)
    probs      = logits.softmax(dim=1).squeeze()

for cls, prob in zip(class_names, probs):
    print(f"{cls}: {prob.item():.3f}")

# ========================================
# 2. VISION TRANSFORMER (ViT) INFERENCE
# ========================================

from transformers import ViTFeatureExtractor, ViTForImageClassification

extractor  = ViTFeatureExtractor.from_pretrained('google/vit-base-patch16-224')
vit_model  = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')

inputs    = extractor(images=image, return_tensors="pt")
with torch.no_grad():
    outputs = vit_model(**inputs)
    logits  = outputs.logits

predicted_class_idx = logits.argmax(-1).item()
print(f"\\nViT Prediction: {vit_model.config.id2label[predicted_class_idx]}")

# ========================================
# 3. SAM (SEGMENT ANYTHING MODEL)
# ========================================

# pip install segment-anything
# from segment_anything import sam_model_registry, SamPredictor
#
# sam   = sam_model_registry["vit_h"](checkpoint="sam_vit_h.pth")
# predictor = SamPredictor(sam)
#
# image_np = np.array(image)
# predictor.set_image(image_np)
#
# # Segment with a point prompt (click on object)
# input_point = np.array([[500, 375]])   # (x, y)
# input_label = np.array([1])             # 1 = foreground
#
# masks, scores, logits = predictor.predict(
#     point_coords=input_point,
#     point_labels=input_label,
#     multimask_output=True)
#
# # best_mask = masks[scores.argmax()]
# print(f"SAM generated {len(masks)} mask(s)")

# ========================================
# 4. VISION-LANGUAGE MODEL (LLaVA-STYLE)
# ========================================

# Using transformers pipeline for VQA
from transformers import pipeline

# Visual Question Answering
vqa = pipeline("visual-question-answering",
               model="dandelin/vilt-b32-finetuned-vqa")

question = "What color is the sky?"
result   = vqa(image, question, top_k=3)
print("\\nVQA Results:")
for r in result:
    print(f"  {r['answer']}: {r['score']:.3f}")

# Image captioning
captioner = pipeline("image-to-text",
                     model="Salesforce/blip-image-captioning-base")
caption = captioner(image)
print(f"\\nCaption: {caption[0]['generated_text']}")

# ========================================
# 5. GAN INFERENCE (STYLE TRANSFER DEMO)
# ========================================

# Simple neural style transfer using pre-trained VGG
import cv2
import torch
import torchvision.transforms as transforms
import torchvision.models as models

def gram_matrix(feature_map):
    """Compute Gram matrix for style representation."""
    b, c, h, w = feature_map.size()
    features   = feature_map.view(b * c, h * w)
    gram       = torch.mm(features, features.t())
    return gram / (b * c * h * w)

# Load VGG for feature extraction
vgg = models.vgg19(pretrained=True).features.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

img_tensor = transform(image).unsqueeze(0)

# Extract features at different layers
layer_outputs = {}
x = img_tensor
for name, layer in vgg._modules.items():
    x = layer(x)
    if name in ['3', '8', '15', '22']:   # relu1_2, relu2_2, relu3_3, relu4_3
        layer_outputs[name] = x

print("\\nVGG feature shapes for style transfer:")
for k, v in layer_outputs.items():
    print(f"  Layer {k}: {v.shape}")

# ========================================
# 6. DIFFUSION MODEL (CONCEPTUAL)
# ========================================

# Simplified forward diffusion process (adding noise)
def forward_diffusion_sample(x_0, t, T=1000):
    """Add noise to image at timestep t (forward process)."""
    # Linear noise schedule
    beta_start, beta_end = 1e-4, 0.02
    betas     = torch.linspace(beta_start, beta_end, T)
    alphas    = 1. - betas
    alpha_bar = torch.cumprod(alphas, dim=0)

    sqrt_alpha_bar     = alpha_bar[t].sqrt()
    sqrt_one_minus_ab  = (1. - alpha_bar[t]).sqrt()

    noise  = torch.randn_like(x_0)
    x_t    = sqrt_alpha_bar * x_0 + sqrt_one_minus_ab * noise
    return x_t, noise

# Demonstrate forward process
img_tensor_norm = (img_tensor - 0.5) / 0.5  # Normalize to [-1, 1]
t = torch.tensor(500)
x_noisy, noise = forward_diffusion_sample(img_tensor_norm, t)
print(f"\\nDiffusion forward (t=500): noise level = {noise.std():.3f}")
`
        }
    ]
};
