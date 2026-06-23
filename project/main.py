import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import joblib
import os

PIPELINE_FILE = "pipeline.pkl"

def build_pipeline():
    return Pipeline([
        ("standardize", StandardScaler()),
        ("rcf", RandomForestClassifier(n_estimators=100, bootstrap=True, max_depth=7))
    ])

try:
    if not os.path.exists(PIPELINE_FILE):
        df = pd.read_csv('C:/Users/ASUS/Desktop/SIH project/project/Crop_recommendation.csv')
        print("CSV loaded successfully.")

        # drop columns if they exist
        df.drop(labels=['Unnamed: 8','Unnamed: 9','rainfall'],axis=1,inplace=True)
        X = df.iloc[:, :-1]
        y = df['label']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        pipeline = build_pipeline()
        pipeline.fit(X_train, y_train)
        joblib.dump(pipeline, PIPELINE_FILE)
        print("Model trained and saved as pipeline.pkl")
    else:
        pipeline = joblib.load(PIPELINE_FILE)
        print("pipeline.pkl loaded successfully.")

except Exception as e:
    print("Error:", e)
