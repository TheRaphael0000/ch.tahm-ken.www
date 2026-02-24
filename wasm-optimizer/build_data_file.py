import json

challenges = json.load(open("../src/data/lcu/challenges.json", "r"))

# rust data file generation
rows = []
for challenge_k, challenge in challenges.items():
    if len(challenge["availableIds"]) <= 0:
        continue

    print(challenge_k, len(challenge["availableIds"]))

    row = f"""
    challenges.insert(
        {challenge_k},
        vec_to_set(vec!{str(challenge["availableIds"])}),
    );
    """
    rows.append(row)

rows = "".join(rows)

template = f"""use crate::tools::vec_to_set;
use std::collections::{{HashMap, HashSet}};

pub fn get_challenges() -> HashMap<i32, HashSet<i32>> {{
    let mut challenges: HashMap<i32, HashSet<i32>> = HashMap::new();
    {rows}
    challenges
}}
"""

open("src/data.rs", "w").write(template)
print("src/data.rs written!")