import json

def update_json(filepath, lang):
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    if lang == 'it':
        data['Olio']['acts']['act4']['description'] = "Equilibrato e versatile, il nostro Extravergine raggiunge la sua massima espressione gustato in purezza, oppure utilizzato per esaltare i piatti della tradizione toscana, dalle zuppe calde ai crudi."
        data['Olio']['acts']['act4']['formatsTitle'] = "I Formati"
        data['Olio']['acts']['act4']['formats'] = [
            { "name": "Bottiglia di Vetro", "size": "500 ml", "idealFor": "Degustazione in tavola" },
            { "name": "Lattina Tradizionale", "size": "3 Litri", "idealFor": "La dispensa di casa" },
            { "name": "Lattina Tradizionale", "size": "5 Litri", "idealFor": "Famiglie e ristorazione" }
        ]
    else:
        data['Olio']['acts']['act4']['description'] = "Balanced and versatile, our Extra Virgin reaches its maximum expression tasted pure, or used to enhance traditional Tuscan dishes, from warm soups to raw preparations."
        data['Olio']['acts']['act4']['formatsTitle'] = "Available Formats"
        data['Olio']['acts']['act4']['formats'] = [
            { "name": "Glass Bottle", "size": "500 ml", "idealFor": "Table tasting" },
            { "name": "Traditional Tin", "size": "3 Liters", "idealFor": "Daily kitchen use" },
            { "name": "Traditional Tin", "size": "5 Liters", "idealFor": "Family & culinary use" }
        ]

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

update_json("messages/it.json", "it")
update_json("messages/en.json", "en")
