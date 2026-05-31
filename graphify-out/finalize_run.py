import sys, json
from graphify.build import build_from_json
from graphify.cluster import score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from pathlib import Path

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text())
detection  = json.loads(Path('graphify-out/.graphify_detect.json').read_text())
analysis   = json.loads(Path('graphify-out/.graphify_analysis.json').read_text())

G = build_from_json(extraction)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

labels = {
    0: "Next.js Routing & Pages",
    1: "Form Block System",
    2: "Database Seeding Logic",
    3: "Metadata & User Utilities",
    4: "Header Theme & Client Pages",
    5: "CMS Blocks (Accordion, Archive, Banner)",
    6: "Comparison & CTA Blocks",
    7: "Field Links & Merge Utilities",
    8: "Artifact Diagram Rendering",
    9: "Artifact Registry & Configuration",
    10: "Comparison Block Components",
    11: "Theme Management System",
    12: "Payload Admin & Page Loading",
    13: "Hero Component System",
    14: "Media & UI Cards",
    15: "Cached Data Fetching",
    16: "Metadata & URL Utilities",
    17: "Header Global Configuration",
    18: "Grid & Section Styles",
    19: "Theme Provider & Selector"
}

# Add default labels for the rest
for cid in communities:
    if cid not in labels:
        labels[cid] = f"Community {cid}"

questions = suggest_questions(G, communities, labels)

report = generate(G, communities, cohesion, labels, analysis['gods'], analysis['surprises'], detection, tokens, 'src', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report)
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}))
print('Report updated with community labels')
