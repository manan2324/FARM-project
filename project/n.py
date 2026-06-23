import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.pipeline import Pipeline
import joblib
df = pd.read_csv('C:/Users/Dell/Projects/SIH project/project/Crop_recommendation.csv')

# print(df.info())
df.drop(labels=['Unnamed: 8','Unnamed: 9','rainfall'],axis=1,inplace=True)
x = df.iloc[:,:-1]
y = df['label']
# print(x.describe())


x_train,x_test,y_train,y_test = train_test_split(x,y,random_state=42,test_size=0.2)

mypipeline  = Pipeline([
    ("standerdize", StandardScaler()),
    ("rcf",RandomForestClassifier(n_estimators=100,bootstrap=True,max_depth=7))
])
mypipeline.fit(x_train,y_train)
# y_pred = mypipeline.predict(x_test)
# print(accuracy_score(y_pred,y_test))
# y_pred = mypipeline.predict(x_train)
# print(accuracy_score(y_pred,y_train))
