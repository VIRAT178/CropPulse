import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
import joblib

#load dataset
data = pd.read_csv('crop_data.csv')

#Encode categorical features
le_state = LabelEncoder()
le_soil = LabelEncoder()
le_crop = LabelEncoder()

data['state'] = le_state.fit_transform(data['state'])
data['soilType'] = le_soil.fit_transform(data['soilType'])  
data['recommendedCrop'] = le_crop.fit_transform(data['recommendedCrop'])

x = data[['state','soilType','landSize']]
y = data['recommendedCrop']

#Train model
model = DecisionTreeClassifier()
model.fit(x, y)

#Save model and encoders
joblib.dump(model, 'crop_recommendation_model.pkl')
joblib.dump(le_state, 'label_encoder_state.pkl')
joblib.dump(le_soil, 'label_encoder_soil.pkl')
joblib.dump(le_crop, 'label_encoder_crop.pkl')


