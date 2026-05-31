import json
from pathlib import Path

all_nodes = []
all_edges = []
all_hyperedges = []
total_input_tokens = 0
total_output_tokens = 0

for i in range(15):
    path = Path(f'graphify-out/.graphify_chunk_{i}.json')
    if path.exists():
        try:
            data = json.loads(path.read_text())
            all_nodes.extend(data.get('nodes', []))
            all_edges.extend(data.get('edges', []))
            all_hyperedges.extend(data.get('hyperedges', []))
            total_input_tokens += data.get('input_tokens', 0)
            total_output_tokens += data.get('output_tokens', 0)
        except Exception as e:
            print(f"Error reading chunk {i}: {e}")

# Deduplicate nodes by id
seen_nodes = {}
for node in all_nodes:
    node_id = node.get('id')
    if node_id and node_id not in seen_nodes:
        seen_nodes[node_id] = node

merged_semantic = {
    'nodes': list(seen_nodes.values()),
    'edges': all_edges,
    'hyperedges': all_hyperedges,
    'input_tokens': total_input_tokens,
    'output_tokens': total_output_tokens,
}

Path('graphify-out/.graphify_semantic.json').write_text(json.dumps(merged_semantic, indent=2))

# Part C - Merge AST + semantic
ast = json.loads(Path('graphify-out/.graphify_ast.json').read_text())

# Merge: AST nodes first, semantic nodes deduplicated by id
seen = {n['id'] for n in ast['nodes']}
merged_nodes = list(ast['nodes'])
for n in merged_semantic['nodes']:
    if n['id'] not in seen:
        merged_nodes.append(n)
        seen.add(n['id'])

merged_edges = ast['edges'] + merged_semantic['edges']
merged_hyperedges = merged_semantic.get('hyperedges', [])

merged_final = {
    'nodes': merged_nodes,
    'edges': merged_edges,
    'hyperedges': merged_hyperedges,
    'input_tokens': merged_semantic.get('input_tokens', 0),
    'output_tokens': merged_semantic.get('output_tokens', 0),
}

Path('graphify-out/.graphify_extract.json').write_text(json.dumps(merged_final, indent=2))
print(f"Extraction complete - {len(merged_nodes)} nodes, {len(merged_edges)} edges")
