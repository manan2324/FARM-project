from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import io

#uvicorn main:app --port 8080  run in terminal

# ---- Class index to label mapping ----
class_names = {
    0: "Apple___Apple_scab",
    1: "Apple___Black_rot",
    2: "Apple___Cedar_apple_rust",
    3: "Apple___healthy",
    4: "Blueberry___healthy",
    5: "Cherry_(including_sour)_healthy",
    6: "Cherry_(including_sour)_Powdery_mildew",
    7: "Corn_(maize)_Cercospora_leaf_spot Gray_leaf_spot",
    8: "Corn_(maize)__Common_rust",
    9: "Corn_(maize)_healthy",
    10: "Corn_(maize)_Northern_Leaf_Blight",
    11: "Grape___Black_rot",
    12: "Grape__Esca(Black_Measles)",
    13: "Grape___healthy",
    14: "Grape__Leaf_blight(Isariopsis_Leaf_Spot)",
    15: "Orange__Haunglongbing(Citrus_greening)",
    16: "Peach___Bacterial_spot",
    17: "Peach___healthy",
    18: "Pepper,bell__Bacterial_spot",
    19: "Pepper,bell__healthy",
    20: "Potato___Early_blight",
    21: "Potato___healthy",
    22: "Potato___Late_blight",
    23: "Raspberry___healthy",
    24: "Soybean___healthy",
    25: "Squash___Powdery_mildew",
    26: "Strawberry___healthy",
    27: "Strawberry___Leaf_scorch",
    28: "Tomato___Bacterial_spot",
    29: "Tomato___Early_blight",
    30: "Tomato___healthy",
    31: "Tomato___Late_blight",
    32: "Tomato___Leaf_Mold",
    33: "Tomato___Septoria_leaf_spot",
    34: "Tomato___Spider_mites Two-spotted_spider_mite",
    35: "Tomato___Target_Spot",
    36: "Tomato___Tomato_mosaic_virus",
    37: "Tomato___Tomato_Yellow_Leaf_Curl_Virus"
}

disease_solutions = {
    "Apple___Apple_scab": "Apply fungicides like captan or mancozeb. Rake and destroy fallen leaves to reduce overwintering spores.",
    "Apple___Black_rot": "Prune out dead or diseased branches and remove mummified fruit. Apply fungicides during the growing season.",
    "Apple___Cedar_apple_rust": "Apply fungicides from the pink bud stage until mid-summer. If possible, remove nearby cedar or juniper trees which act as hosts.",
    "Apple___healthy": "Maintain health with regular pruning for air circulation, proper watering, and a balanced fertilization program.",
    "Blueberry___healthy": "Ensure continued health by maintaining acidic soil (pH 4.5-5.5), regular watering, and monitoring for common pests.",
    "Cherry_(including_sour)___healthy": "Keep the tree healthy by ensuring good air circulation through pruning and clearing fallen leaves and fruit debris promptly.",
    "Cherry_(including_sour)___Powdery_mildew": "Improve air circulation by pruning. Apply fungicides like sulfur, potassium bicarbonate, or neem oil at the first sign of disease.",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": "Plant resistant hybrids. Practice crop rotation and tillage to bury infected residue. Apply foliar fungicides if disease is severe.",
    "Corn_(maize)___Common_rust": "Plant resistant corn hybrids. Apply fungicides if infection is severe, especially on sweet corn, before tasseling.",
    "Corn_(maize)___healthy": "Maintain plant vigor with adequate nitrogen fertilization, proper irrigation, and effective weed control.",
    "Corn_(maize)___Northern_Leaf_Blight": "Use resistant hybrids and practice crop rotation. Tillage can help break down infected crop debris. Apply fungicides if necessary.",
    "Grape___Black_rot": "Apply fungicides starting from early spring. Prune vines for better air circulation and remove and destroy infected canes and mummified berries.",
    "Grape___Esca_(Black_Measles)": "There is no cure. Prune out and destroy symptomatic wood during winter dormancy. Double pruning may help manage symptoms.",
    "Grape___healthy": "Maintain health with a regular spray schedule for pests and diseases, proper pruning for canopy management, and consistent irrigation.",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": "This is often a minor disease. Improve air circulation through canopy management and remove severely infected leaves. Fungicides are rarely needed.",
    "Orange___Haunglongbing_(Citrus_greening)": "There is no cure. The key is prevention: control the Asian citrus psyllid vector with insecticides and immediately remove and destroy infected trees.",
    "Peach___Bacterial_spot": "Plant resistant varieties. Apply copper-based sprays during dormancy. Prune to promote good air circulation and avoid overhead watering.",
    "Peach___healthy": "Maintain tree health with a preventative spray schedule for common diseases, proper pruning, and consistent watering and fertilization.",
    "Pepper,_bell___Bacterial_spot": "Use certified disease-free seed. Spray with copper-based bactericides. Rotate crops with non-related plants and avoid working with wet plants.",
    "Pepper,_bell___healthy": "Keep plants healthy with consistent watering, mulching to maintain soil moisture, and regular monitoring for pests.",
    "Potato___Early_blight": "Apply fungicides such as chlorothalonil or mancozeb. Practice crop rotation and remove volunteer potato plants and weeds.",
    "Potato___healthy": "Ensure a healthy crop by planting certified disease-free seed potatoes, ensuring good drainage, and practicing proper hilling.",
    "Potato___Late_blight": "Use resistant varieties. Apply fungicides preventively, especially during cool, moist weather. Destroy infected plants and cull piles.",
    "Raspberry___healthy": "Maintain plant vigor by pruning canes after harvest, managing weeds, and ensuring the planting site has good drainage.",
    "Soybean___healthy": "Promote health by planting high-quality, disease-free seed in well-drained soil. Practice crop rotation with crops like corn or wheat.",
    "Squash___Powdery_mildew": "Improve air circulation by spacing plants properly. Apply fungicides like neem oil, sulfur, or potassium bicarbonate. Plant resistant varieties.",
    "Strawberry___healthy": "Keep plants productive by using disease-free stock, mulching to keep berries off the soil, and renovating beds after harvest.",
    "Strawberry___Leaf_scorch": "Plant resistant cultivars. Apply a fungicide after harvest. Remove old, infected leaves to reduce inoculum.",
    "Tomato___Bacterial_spot": "Use pathogen-free seed and transplants. Spray with copper-based products. Avoid overhead irrigation and rotate crops.",
    "Tomato___Early_blight": "Spray fungicides (chlorothalonil, mancozeb). Mulch plants to reduce soil splash and remove and destroy lower infected leaves.",
    "Tomato___healthy": "Maintain health through consistent watering, providing support (staking or caging), and ensuring proper spacing for good air circulation.",
    "Tomato___Late_blight": "Apply fungicides like chlorothalonil. Ensure good air circulation, avoid overhead watering, and destroy infected plants immediately to prevent spread.",
    "Tomato___Leaf_Mold": "Lower humidity and improve air circulation. Apply fungicides. Grow resistant varieties, especially in greenhouse environments.",
    "Tomato___Septoria_leaf_spot": "Apply fungicides (chlorothalonil, mancozeb). Remove and destroy infected lower leaves. Use mulch and practice crop rotation.",
    "Tomato___Spider_mites Two-spotted_spider_mite": "Spray with insecticidal soap or horticultural oil, especially on the undersides of leaves. Introduce natural predators like ladybugs.",
    "Tomato___Target_Spot": "Apply fungicides preventively. Improve air circulation between plants and remove crop debris after the season.",
    "Tomato___Tomato_mosaic_virus": "There is no cure. Remove and destroy infected plants. Disinfect tools and wash hands frequently. Avoid using tobacco products near tomato plants.",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Control the whitefly vector using insecticides or reflective mulch. Remove and destroy infected plants. Plant resistant varieties."
}

# ---- Define ConvBlock ----
def ConvBlock(in_channels, out_channels, pool=False):
    layers = [nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
              nn.BatchNorm2d(out_channels),
              nn.ReLU(inplace=True)]
    if pool:
        layers.append(nn.MaxPool2d(4))
    return nn.Sequential(*layers)

# ---- Define ResNet9 ----
class ResNet9(nn.Module):
    def __init__(self, in_channels, num_diseases):
        super().__init__()
        
        self.conv1 = ConvBlock(in_channels, 64)
        self.conv2 = ConvBlock(64, 128, pool=True)
        self.res1 = nn.Sequential(ConvBlock(128, 128), ConvBlock(128, 128))
        
        self.conv3 = ConvBlock(128, 256, pool=True)
        self.conv4 = ConvBlock(256, 512, pool=True)
        self.res2 = nn.Sequential(ConvBlock(512, 512), ConvBlock(512, 512))
        
        self.classifier = nn.Sequential(
            nn.MaxPool2d(4),
            nn.Flatten(),
            nn.Linear(512, num_diseases)
        )
        
    def forward(self, xb):
        out = self.conv1(xb)
        out = self.conv2(out)
        out = self.res1(out) + out
        out = self.conv3(out)
        out = self.conv4(out)
        out = self.res2(out) + out
        out = self.classifier(out)
        return out

# ---- Load model ----
num_classes = 38   # 👈 change based on dataset
model = ResNet9(in_channels=3, num_diseases=num_classes)
state_dict = torch.load("plant_disease_model.pth", map_location="cpu")
model.load_state_dict(state_dict)
model.eval()

# ---- Preprocessing ----
transform = transforms.Compose([
    transforms.Resize((256, 256)),   # match your training preprocessing
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ---- FastAPI app ----
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img = Image.open(io.BytesIO(await file.read())).convert("RGB")
    img_tensor = transform(img).unsqueeze(0)

    with torch.no_grad():
        outputs = model(img_tensor)
        _, predicted = torch.max(outputs, 1)

    class_idx = int(predicted.item())
    class_name = class_names[class_idx]
    solution = disease_solutions.get(class_name, "No solution available.")

    return JSONResponse({
        "predicted_class": class_idx,
        "predicted_label": class_name,
        "solution": solution
    })
