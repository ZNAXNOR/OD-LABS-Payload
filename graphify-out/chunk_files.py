import json
from pathlib import Path

files = Path('graphify-out/.graphify_uncached.txt').read_text().splitlines()
# Separate images from other files
images = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
others = [f for f in files if f not in images]

chunks = []
# Group others into chunks of ~22
for i in range(0, len(others), 22):
    chunks.append(others[i:i + 22])

# Each image gets its own chunk as per instructions
for img in images:
    chunks.append([img])

print(json.dumps(chunks))
