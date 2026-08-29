"""
FasalDoc - Baseline Crop Disease Classifier
Transfer learning on MobileNetV3Small using PlantVillage dataset.

Run this in Google Colab (free GPU: Runtime > Change runtime type > GPU).

Expected folder structure after downloading PlantVillage:
dataset/
    Tomato___healthy/
    Tomato___Early_blight/
    Tomato___Late_blight/
    ... (only keep folders for YOUR chosen 3-5 crops, delete the rest)
"""

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV3Small

# ---------------------------------------------------------
# 1. CONFIG - adjust these for your chosen crops
# ---------------------------------------------------------
DATA_DIR = "dataset"          # path to your dataset folder
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS_STAGE1 = 10             # frozen base training
EPOCHS_STAGE2 = 5              # fine-tuning
LEARNING_RATE = 1e-3

# ---------------------------------------------------------
# 2. LOAD DATA
# ---------------------------------------------------------
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="training",
    seed=42,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="validation",
    seed=42,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)

class_names = train_ds.class_names
print(f"Classes found ({len(class_names)}): {class_names}")

# Cache and prefetch for speed
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

# ---------------------------------------------------------
# 3. DATA AUGMENTATION
# Real farmer photos won't be perfectly lit/centered like lab images -
# augmentation helps the model generalize better to real-world conditions.
# ---------------------------------------------------------
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.15),
    layers.RandomZoom(0.15),
    layers.RandomContrast(0.15),
    layers.RandomBrightness(0.15),
])

# ---------------------------------------------------------
# 4. BUILD MODEL - transfer learning on MobileNetV3Small
# Chosen because it's designed for mobile/on-device inference,
# which matters for your offline-mode goal later.
# ---------------------------------------------------------
base_model = MobileNetV3Small(
    input_shape=IMG_SIZE + (3,),
    include_top=False,
    weights="imagenet",
)
base_model.trainable = False  # freeze base for stage 1

inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
x = data_augmentation(inputs)
x = tf.keras.applications.mobilenet_v3.preprocess_input(x)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(len(class_names), activation="softmax")(x)

model = models.Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

model.summary()

# ---------------------------------------------------------
# 5. STAGE 1 TRAINING - frozen base
# ---------------------------------------------------------
print("\n=== Stage 1: Training classifier head (base frozen) ===")
history1 = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS_STAGE1,
)

# ---------------------------------------------------------
# 6. STAGE 2 - FINE-TUNE
# Unfreeze the top layers of the base model for a small
# fine-tuning pass at a lower learning rate.
# ---------------------------------------------------------
print("\n=== Stage 2: Fine-tuning top layers ===")
base_model.trainable = True
# Freeze all but the last ~20 layers
for layer in base_model.layers[:-20]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE / 10),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

history2 = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS_STAGE2,
)

# ---------------------------------------------------------
# 7. SAVE MODEL
# ---------------------------------------------------------
model.save("fasaldoc_model.keras")
print("\nModel saved as fasaldoc_model.keras")

# ---------------------------------------------------------
# 8. CONVERT TO TFLITE - for on-device / offline inference
# This is the format your mobile app will actually use.
# ---------------------------------------------------------
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]  # quantization for smaller size
tflite_model = converter.convert()

with open("fasaldoc_model.tflite", "wb") as f:
    f.write(tflite_model)

print("TFLite model saved as fasaldoc_model.tflite")
print(f"\nFinal validation accuracy: {history2.history['val_accuracy'][-1]:.2%}")

# ---------------------------------------------------------
# NEXT STEPS (don't skip these):
# 1. Evaluate this model on PlantDoc (real-world images) separately -
#    expect accuracy to drop. That gap tells you how much local data you need.
# 2. Save class_names list somewhere - your backend/app needs it to map
#    prediction indices back to disease names.
# 3. Once you have local Pakistani crop images, add them to the dataset
#    folders and retrain - this is what actually makes FasalDoc defensible.
# ---------------------------------------------------------
