import json

def fix_json(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    quote = data['Olio']['acts']['act4']['quoteHtml']
    # Replace <brResp></br> with <br></br>
    quote = quote.replace("<brResp></br>", "<br></br>")
    data['Olio']['acts']['act4']['quoteHtml'] = quote

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

fix_json("messages/it.json")
fix_json("messages/en.json")
