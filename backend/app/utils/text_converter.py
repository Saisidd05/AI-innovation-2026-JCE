def row_to_document(row: dict) -> str:
    """
    Dynamically converts a CSV row (as a dictionary) into a readable English sentence.
    This helps the embedding model understand the context better than raw JSON.
    """
    parts = []
    
    # Try to extract common identifier fields for the intro
    case_id = row.get('case_id') or row.get('case_no') or row.get('CaseID')
    
    if case_id:
        intro = f"Case {case_id} contains a record with the following details: "
    else:
        intro = "This record contains the following details: "
        
    for key, value in row.items():
        # Skip empty values
        if value is None or str(value).strip() == "" or str(value).lower() == "nan":
            continue
            
        # Format the key to be more readable (e.g. 'phone_number' -> 'phone number')
        formatted_key = str(key).replace('_', ' ').title()
        parts.append(f"{formatted_key} is {value}")
        
    return intro + ", ".join(parts) + "."
