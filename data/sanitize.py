import csv
import json
import re


def is_english_word(word):
    return not bool(re.search(r'[^a-zA-Z -/&]', word))


def convert_csv_to_json(input_file, output_file):
    results = []

    with open(input_file, 'r', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)

        for row in reader:
            try:
                title = row[0].strip()
                if not is_english_word(title):
                    print(title)
                    continue

                pdl_count = int(row[1].replace(',', ''))

                related_titles = []
                for i in range(2, len(row)):
                    if row[i].strip():
                        related_title = row[i].strip()
                        if is_english_word(related_title):
                            if related_title not in related_titles:
                                related_titles.append(related_title)

                json_obj = {
                    'name': title,
                    'pdl_count': pdl_count,
                    'top_related_titles': related_titles
                }

                results.append(json_obj)
            except Exception as e:
                print(f"Error processing row {row}: {e}")

    with open(output_file, 'w', encoding='utf-8') as jsonfile:
        json.dump(results, jsonfile, indent=2)

    print(f"Converted {len(results)} records to JSON in {output_file}")
    return results

if __name__ == "__main__":
    input_csv = "2019_free_title_data.csv"
    output_json = "output.json"
    convert_csv_to_json(input_csv, output_json)
