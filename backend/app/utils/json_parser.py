import json
import re


def extract_json(text: str):

    # remove markdown
    text = text.replace("```json", "")
    text = text.replace("```", "")

    # find first {
    start = text.find("{")

    # find last }
    end = text.rfind("}")

    if start == -1 or end == -1:
        raise Exception("No JSON found.")

    json_text = text[start:end + 1]

    try:

        return json.loads(json_text)

    except json.JSONDecodeError as e:

        raise Exception(
            f"Invalid JSON: {e}"
        )