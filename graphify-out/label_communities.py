import sys, json
from graphify.build import build_from_json
from graphify.analyze import suggest_questions
from graphify.report import generate
from pathlib import Path

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text())
detection  = json.loads(Path('graphify-out/.graphify_detect.json').read_text())
analysis   = json.loads(Path('graphify-out/.graphify_analysis.json').read_text())

G = build_from_json(extraction)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

# Top Community Labels
labels = {
    0: "Core App & Payload Config",
    1: "Seed Operations",
    2: "Frontend Client Components",
    3: "Redirects & Document Loading",
    4: "Metadata & SEO",
    5: "Plugins & User Utilities",
    6: "Link Fields & Deep Merge",
    7: "Header & Global Data",
    8: "Theme Management",
    9: "Media & Image Utilities",
    10: "Search & Debounce",
    11: "Page Revalidation Hooks",
    12: "Post Revalidation Hooks",
    13: "Dashboard Seed UI",
    14: "Pagination UI",
}

# Fill in the rest with defaults
for cid in communities:
    if cid not in labels:
        labels[cid] = f"Community {cid}"

# Regenerate questions with real community labels
questions = suggest_questions(G, communities, labels)

report = generate(G, communities, cohesion, labels, analysis['gods'], analysis['surprises'], detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report)
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}))
print('Report updated with community labels')
