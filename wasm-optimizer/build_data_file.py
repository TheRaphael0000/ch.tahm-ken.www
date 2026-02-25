import json
from collections import defaultdict

challenges = json.load(open("../src/data/lcu/challenges.json", "r"))
champions = json.load(
    open("../src/data/cache/datadragon/champion.json", "r"))["data"]

champions_by_tag = defaultdict(list)
for c in champions.values():
    for t in c["tags"]:
        champions_by_tag[t].append(c)


def create_row(challenge_k, ids):
    return f"""
    challenges.insert(
        String::from("{challenge_k}"),
        vec_to_set(vec!{str(ids)}),
    );
    """

def create_template(rows):
    rows = "".join(rows)

    return f"""use crate::tools::vec_to_set;
use std::collections::{{HashMap, HashSet}};

pub fn get_challenges() -> HashMap<String, HashSet<i32>> {{
    let mut challenges: HashMap<String, HashSet<i32>> = HashMap::new();
    {rows}
    challenges
}}"""


# rust data file generation
rows = []
for challenge_k, challenge in challenges.items():
    if len(challenge["availableIds"]) <= 0:
        continue

    availableIds = challenge["availableIds"]
    print(challenge_k, len(availableIds))
    rows.append(create_row(challenge_k, availableIds))

for tag, champs in champions_by_tag.items():
    champs_ids = [int(c["key"]) for c in champs]
    rows.append(create_row(f"303408-{tag}", champs_ids))


template = create_template(rows)
open("src/data.rs", "w").write(template)
print("src/data.rs written!")
