import json
from pathlib import Path

analysis = json.loads(Path('graphify-out/.graphify_analysis.json').read_text())
extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text())
nodes_map = {n['id']: n['label'] for n in extraction['nodes']}

top_communities = sorted(analysis['communities'].items(), key=lambda x: len(x[1]), reverse=True)[:20]

for cid, members in top_communities:
    print(f"Community {cid} ({len(members)} nodes):")
    for m in members[:10]:
        print(f"  - {nodes_map.get(m, m)}")
    print()
