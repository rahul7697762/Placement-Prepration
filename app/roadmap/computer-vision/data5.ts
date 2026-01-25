import { Unit } from './types';

export const section5Data: Unit = {
    id: "section-5",
    title: "Section 5: Deep Learning & Object Detection",
    description: "CNNs, architectures, and modern object detection frameworks.",
    topics: [
        {
            id: "cnn-fundamentals",
            title: "Convolutional Neural Networks (CNNs)",
            description: "Deep learning architecture for computer vision tasks.",
            details: `
## Convolutional Neural Networks

### Why CNNs for Images?

**Problems with Fully Connected Networks:**
1. **Too many parameters:** 200×200 RGB image = 120,000 inputs
   - Hidden layer with 1000 neurons = 120 million weights!
2. **No spatial structure:** Treats nearby and distant pixels equally
3. **Not translation invariant:** Cat in top-left ≠ cat in bottom-right

**CNN Solutions:**
1. **Local connectivity:** Neurons connect to small region
2. **Parameter sharing:** Same weights across image
3. **Built-in translation invariance**

---

### CNN Building Blocks

#### 1. Convolutional Layer

**Operation:**
Output(i,j) = Σₘ Σₙ Input(i+m, j+n) × Kernel(m,n) + Bias

**Key Concepts:**

**Filters (Kernels):**
- Small matrix (e.g., 3×3, 5×5, 7×7)
- Learned during training
- Each filter detects specific feature (edge, texture, pattern)

**Depth (Number of Filters):**
- Common: 32, 64, 128, 256, 512
- Each produces one feature map (channel)

**Stride:**
- Step size when sliding filter
- Stride = 1: Every pixel
- Stride = 2: Every other pixel (downsamples)

**Padding:**
- **Valid:** No padding (output smaller)
- **Same:** Pad with zeros (output same size)
- Formula: Pad = (F - 1) / 2 for odd F

**Output Size:**
W_out = (W_in - F + 2P) / S + 1
- W: width/height
- F: filter size
- P: padding
- S: stride

**Parameters:**
- Weights: F × F × D_in × D_out
- Biases: D_out
- Much fewer than fully connected!

**Feature Maps:**
- Output of convolutional layer
- Each filter → one feature map
- Early layers: Low-level features (edges)
- Deep layers: High-level features (objects)

---

#### 2. Activation Functions

**Purpose:** Introduce non-linearity

**ReLU (Rectified Linear Unit):**
f(x) = max(0, x)

**Advantages:**
- Computationally efficient
- Reduces vanishing gradient problem
- Induces sparsity (many zeros)

**Disadvantages:**
- "Dying ReLU" problem (neurons output 0 forever)

**Variants:**

**Leaky ReLU:**
f(x) = max(0.01x, x)
- Prevents dying neurons

**Parametric ReLU (PReLU):**
f(x) = max(αx, x)
- α learned during training

**ELU (Exponential Linear Unit):**
f(x) = x if x > 0, else α(e^x - 1)

**Other Activations:**
- **Sigmoid:** σ(x) = 1/(1 + e^(-x))
  - Output (0, 1)
  - Used in output layer for binary classification
- **Tanh:** tanh(x) = (e^x - e^(-x))/(e^x + e^(-x))
  - Output (-1, 1)
  - Zero-centered (better than sigmoid)
- **Softmax:** For multi-class output
  - σ(z)ᵢ = e^zᵢ / Σⱼ e^zⱼ

---

#### 3. Pooling Layer

**Purpose:**
- Reduce spatial dimensions
- Reduce computational cost
- Provide translation invariance

**Max Pooling (Most Common):**
- Take maximum value in window
- Typical: 2×2 window, stride 2
- Reduces size by half (discards 75% of activations)

**Average Pooling:**
- Take average value in window
- Smoother but less common

**Global Average Pooling:**
- One value per feature map
- Used before final classification layer
- Reduces overfitting

**Output Size:**
W_out = (W_in - F) / S + 1

**No Learnable Parameters:**
- Just pooling operation
- Reduces model complexity

---

#### 4. Fully Connected (Dense) Layer

**Purpose:** Final classification

**Operation:**
y = Wx + b
- All neurons connected to all inputs
- Typically at end of network
- Followed by softmax for classification

**Modern Trend:**
- Replace with Global Average Pooling + 1×1 conv
- Fewer parameters, less overfitting

---

### CNN Architectures (Historical Progression)

#### LeNet-5 (1998) - Yann LeCun
**For:** Handwritten digit recognition (MNIST)

**Structure:**
- Conv → Pool → Conv → Pool → FC → FC
- 60K parameters
- Used sigmoid/tanh activation

**Historical Significance:** First successful CNN

---

#### AlexNet (2012) - ImageNet Winner
**Breakthrough:** Revived deep learning in computer vision

**Key Innovations:**
1. **ReLU** instead of tanh (6× faster training)
2. **Dropout** (0.5) to reduce overfitting
3. **Data augmentation** (crops, flips, color jittering)
4. **GPU training** (2 GPUs)
5. **Local Response Normalization (LRN)**

**Architecture:**
- 5 Conv layers + 3 FC layers
- 60 million parameters
- 650K neurons

**Impact:** Reduced ImageNet error from 26% to 15.3%

---

#### VGGNet (2014) - Oxford
**Philosophy:** Deeper is better with small filters

**Key Principles:**
1. **Only 3×3 conv filters** throughout
2. **Very deep:** VGG-16 (16 layers), VGG-19 (19 layers)
3. **Simplicity:** Uniform architecture

**Why 3×3?**
- Two 3×3 conv = effective receptive field of 5×5
- Three 3×3 conv = effective 7×7
- Fewer parameters, more non-linearity

**Disadvantages:**
- 138 million parameters (very large)
- Slow to train
- Memory intensive

---

#### GoogLeNet/Inception (2014)
**Innovation:** Inception module

**Inception Module:**
- Parallel pathways with different filter sizes
- 1×1, 3×3, 5×5 conv + 3×3 pool
- Concatenate outputs
- Network learns which to use

**1×1 Convolution:**
- **Dimensionality reduction** (bottleneck)
- Reduces parameters drastically
- Adds non-linearity

**Key Stats:**
- 22 layers deep
- Only 5 million parameters (cf. VGG's 138M)
- Won ImageNet 2014

**Global Average Pooling:**
- Replaced FC layers
- Reduced overfitting

---

#### ResNet (2015) - Microsoft Research
**Problem:** Very deep networks had **degradation** (higher training error)
- Not overfitting (training error increases!)
- Optimization difficulty

**Solution: Residual Learning**

**Skip Connections (Shortcuts):**
H(x) = F(x) + x

Instead of learning H(x) directly, learn residual F(x) = H(x) - x

**Why It Works:**
- Easier to learn residuals (small adjustments)
- Gradients flow directly through shortcuts
- Identity mapping always available (worst case)

**Architectures:**
- ResNet-50, ResNet-101, ResNet-152
- Won ImageNet 2015
- 152 layers with 3.57% error (human-level)

**Variants:**
- Pre-activation ResNet
- ResNeXt (group convolutions)
- Wide ResNet

---

### Training CNNs

#### Forward Propagation
1. Input image → Conv → ReLU → Pool
2. Repeat conv blocks
3. Flatten → FC → Softmax
4. Output probabilities

#### Loss Function
**Cross-Entropy Loss (Classification):**
L = -Σᵢ yᵢ log(ŷᵢ)
- y: true label (one-hot)
- ŷ: predicted probability

#### Backpropagation
Compute gradients using chain rule backward through layers.

**Weight Update:**
W_new = W_old - η × ∂L/∂W
- η: learning rate

---

### Optimization

#### Gradient Descent Variants

**SGD (Stochastic Gradient Descent):**
- Update with single sample or mini-batch
- Faster, more stochastic

**Momentum:**
v_t = γv_(t-1) + η∇L
W = W - v_t
- Accelerates in consistent direction
- Dampens oscillations

**Adam (Adaptive Moment Estimation):**
- Combines momentum + adaptive learning rates
- Most popular for deep learning
- Default choice for most tasks

---

### Regularization

#### 1. Dropout
Randomly drop neurons during training (p = 0.5 typical).
- Prevents co-adaptation
- Ensemble effect

#### 2. Data Augmentation
- Random crops
- Horizontal flips
- Color jittering
- Rotation, scaling

#### 3. Batch Normalization
Normalize activations per mini-batch:
- Faster training
- Higher learning rates
- Less sensitive to initialization

#### 4. L2 Regularization (Weight Decay)
Add penalty: L_total = L + λ||W||²

---

## Object Detection

### Task Definition
**Input:** Image
**Output:** Multiple bounding boxes + class labels

**Challenges:**
- Multiple objects per image
- Various sizes and aspect ratios
- Real-time requirements

---

### Two-Stage Detectors (R-CNN Family)

#### R-CNN (2014)
**Stages:**
1. **Region Proposals:** Selective Search (~2000 regions)
2. **Feature Extraction:** Resize each proposal, CNN features
3. **Classification:** SVM for each class
4. **Bounding Box Regression:** Refine boxes

**Problems:**
- Very slow (47s per image)
- Training multi-stage
- High memory (features stored on disk)

---

#### Fast R-CNN (2015)
**Improvements:**
1. **Single CNN** for whole image
2. **RoI Pooling:** Extract fixed-size features for each proposal
3. **End-to-end training:** Softmax classifier (not SVM)
4. **Multi-task loss:** Classification + BB regression

**Speed:** 0.3s per image (vs 47s)

---

#### Faster R-CNN (2016)
**Key Innovation: Region Proposal Network (RPN)**

**RPN:**
- Fully convolutional network
- Shares features with detection network
- Predicts objectness + box refinement
- **Anchors:** Pre-defined boxes at multiple scales/ratios

**Pipeline:**
1. Feature extraction (ResNet/VGG)
2. RPN generates proposals
3. RoI pooling
4. Classification + BB regression

**Speed:** 0.2s per image (5 FPS)
**Accuracy:** State-of-art at the time

---

### One-Stage Detectors

#### YOLO (You Only Look Once) - 2016

**Philosophy:** Detection as regression (no region proposals)

**Process:**
1. Divide image into S×S grid
2. Each cell predicts B bounding boxes
3. Each box: (x, y, w, h, confidence)
4. Each cell: Class probabilities

**Output:** S × S × (B × 5 + C) tensor
- S = 7, B = 2, C = 20 (Pascal VOC)

**Confidence:** P(Object) × IoU

**Loss Function:**
- Localization loss (x, y, w, h)
- Confidence loss
- Classification loss

**Advantages:**
- **Very fast:** 45 FPS (YOLOv1)
- End-to-end training
- Sees whole image (better context)

**Disadvantages:**
- Struggles with small objects
- Lower accuracy than Faster R-CNN

**Evolution:**
- **YOLOv2 (YOLO9000):** Batch norm, anchor boxes
- **YOLOv3:** Multi-scale predictions, better backbone
- **YOLOv4, v5, v6, v7, v8:** Continuous improvements

---

#### SSD (Single Shot MultiBox Detector)
**Combines:** YOLO speed + Faster R-CNN accuracy

**Multi-Scale Feature Maps:**
- Predictions at multiple layers
- Early layers: Small objects
- Late layers: Large objects

**Default Boxes (Anchors):**
- Multiple aspect ratios per location

**Performance:** 59 FPS with better accuracy than YOLO

---

### Evaluation Metrics

#### IoU (Intersection over Union)
IoU = Area of Overlap / Area of Union

**Threshold:** Typically 0.5
- IoU > 0.5: Correct detection
- IoU < 0.5: Incorrect

#### Precision and Recall
**Precision:** TP / (TP + FP) - How many detections are correct?
**Recall:** TP / (TP + FN) - How many objects were found?

#### Average Precision (AP)
Area under Precision-Recall curve.

**mAP (mean AP):**
Average AP across all classes.
- mAP@.5: IoU threshold 0.5
- mAP@.5:.95: Average across IoU 0.5 to 0.95

#### NMS (Non-Maximum Suppression)
Remove duplicate detections:
1. Sort boxes by confidence
2. Keep highest
3. Remove boxes with IoU > threshold
4. Repeat
            `
        }
    ]
};
