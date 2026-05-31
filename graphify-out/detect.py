import json; from graphify.detect import detect; from pathlib import Path; result = detect(Path('src')); print(json.dumps(result))
