"""
CareerNexus AI - ML Model Training Script
This script trains a RandomForestClassifier to predict suitable careers
based on student skills, interests, and academic performance.
"""

import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import os

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# ============================================
# 1. TRAINING DATA - Sample Career Dataset
# ============================================
"""
Features:
- Skills (encoded as proficiency levels): Python, Java, SQL, ML, Communication, ProblemSolving
- Interests (0-100): Data, Development, Management, Research, Design
- CGPA (0-10)
- Target: Career label
"""

training_data = {
    'Python': [4, 5, 3, 4, 5, 2, 4, 3, 5, 2, 4, 5, 3, 4, 2],
    'Java': [3, 4, 5, 3, 2, 5, 3, 5, 2, 4, 3, 4, 5, 2, 5],
    'SQL': [4, 3, 5, 5, 3, 5, 4, 5, 2, 5, 4, 3, 4, 5, 5],
    'ML': [5, 5, 2, 3, 5, 1, 5, 2, 5, 1, 4, 5, 2, 3, 1],
    'Communication': [4, 3, 4, 3, 4, 5, 3, 4, 3, 5, 5, 3, 4, 5, 4],
    'ProblemSolving': [5, 4, 4, 5, 4, 3, 5, 4, 5, 3, 4, 4, 3, 4, 3],
    'Data_Interest': [90, 85, 50, 70, 95, 30, 85, 45, 92, 25, 80, 88, 55, 75, 35],
    'Development_Interest': [60, 70, 90, 75, 50, 85, 65, 88, 45, 82, 60, 65, 92, 70, 80],
    'Management_Interest': [40, 35, 60, 55, 30, 75, 35, 65, 25, 80, 70, 40, 55, 60, 65],
    'Research_Interest': [85, 88, 45, 65, 90, 20, 88, 40, 88, 15, 75, 90, 50, 70, 25],
    'Design_Interest': [35, 40, 70, 50, 30, 65, 40, 75, 20, 60, 45, 35, 80, 45, 70],
    'CGPA': [8.5, 8.2, 7.5, 8.0, 9.0, 6.5, 8.7, 7.8, 9.2, 6.0, 8.3, 8.9, 7.2, 8.5, 7.0],
    'Career': [
        'Data Analyst',
        'ML Engineer',
        'Full Stack Developer',
        'Data Analyst',
        'ML Engineer',
        'Project Manager',
        'ML Engineer',
        'Full Stack Developer',
        'Data Scientist',
        'HR Manager',
        'Data Analyst',
        'ML Engineer',
        'Frontend Developer',
        'Business Analyst',
        'Product Manager'
    ]
}

df = pd.DataFrame(training_data)

print("=" * 60)
print("CareerNexus AI - Model Training")
print("=" * 60)
print(f"\nDataset shape: {df.shape}")
print(f"\nFeatures: {list(df.columns[:-1])}")
print(f"\nTarget variable (Career): {df['Career'].unique()}")
print(f"\nClass distribution:\n{df['Career'].value_counts()}")

# ============================================
# 2. FEATURE ENCODING & SCALING
# ============================================
X = df.drop('Career', axis=1)
y = df['Career']

# Split data (note: removed stratify due to imbalanced classes with small dataset)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\n" + "=" * 60)
print("Feature Scaling - StandardScaler")
print("=" * 60)
print(f"Training set shape: {X_train_scaled.shape}")
print(f"Test set shape: {X_test_scaled.shape}")

# ============================================
# 3. TRAIN RANDOM FOREST CLASSIFIER
# ============================================
"""
RandomForestClassifier is ideal for career prediction because:
1. Handles non-linear relationships between skills/interests and careers
2. Provides feature importance (which skills matter most)
3. Robust to outliers
4. No need for feature scaling (but we do it anyway for consistency)
5. Natural probability estimates for confidence scores
"""

rf_model = RandomForestClassifier(
    n_estimators=100,           # Number of trees
    max_depth=10,               # Maximum depth to prevent overfitting
    min_samples_split=2,        # Minimum samples to split a node
    min_samples_leaf=1,         # Minimum samples in leaf node
    random_state=42,
    n_jobs=-1                   # Use all processors
)

# Train the model
rf_model.fit(X_train_scaled, y_train)

# ============================================
# 4. MODEL EVALUATION
# ============================================
y_pred_train = rf_model.predict(X_train_scaled)
y_pred_test = rf_model.predict(X_test_scaled)

train_accuracy = accuracy_score(y_train, y_pred_train)
test_accuracy = accuracy_score(y_test, y_pred_test)

print("\n" + "=" * 60)
print("Model Performance")
print("=" * 60)
print(f"Training Accuracy: {train_accuracy:.2%}")
print(f"Test Accuracy: {test_accuracy:.2%}")
print(f"\nClassification Report (Test Set):\n")
print(classification_report(y_test, y_pred_test))

# ============================================
# 5. FEATURE IMPORTANCE
# ============================================
feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': rf_model.feature_importances_
}).sort_values('Importance', ascending=False)

print("\n" + "=" * 60)
print("Feature Importance (What matters most?)")
print("=" * 60)
print(feature_importance.to_string(index=False))

# ============================================
# 6. SAVE MODELS USING JOBLIB
# ============================================
"""
joblib is used for model persistence because:
1. Efficient for large numpy arrays
2. Preserves sklearn object structure
3. Handles nested objects well
4. Fast loading/saving
"""

# Save the trained model
joblib.dump(rf_model, 'models/career_rf_model.pkl')
print("\n✓ Model saved: models/career_rf_model.pkl")

# Save the scaler
joblib.dump(scaler, 'models/scaler.pkl')
print("✓ Scaler saved: models/scaler.pkl")

# Save feature names
joblib.dump(X.columns.tolist(), 'models/feature_names.pkl')
print("✓ Feature names saved: models/feature_names.pkl")

# Save label encoder (careers)
joblib.dump(rf_model.classes_, 'models/career_classes.pkl')
print("✓ Career classes saved: models/career_classes.pkl")

print("\n" + "=" * 60)
print("Training Complete! ✓")
print("=" * 60)
print(f"\nModel can now be used for career predictions.")
print(f"Next step: Run app.py to start the Flask server")
