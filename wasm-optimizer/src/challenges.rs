use itertools::Itertools;
use std::collections::HashSet;

use crate::data::get_challenges;
use crate::data_transform::{get_challenge_requirements, get_challenges_by_champions, get_champions};
use crate::tools::combinations_count;

const COMP_SIZE: i32 = 5;

struct ChallengeExplore {
    addable_champions: HashSet<i32>,
    missing: i32,
    explore_size: i64,
}

fn complete_comp_recursive(
    selected_challenges: HashSet<i32>,
    selected_champions: HashSet<i32>,
    results: &mut Vec<HashSet<i32>>,
    limit: i32,
    max_depth: Option<i32>,
) -> bool {
    let depth = max_depth.unwrap_or(10);
    if depth <= 0 {
        println!("max depth reached!!!");
        return false;
    }

    let current_challenges = find_challenges(&selected_champions);
    let still_missing_challenges: HashSet<i32> = selected_challenges.difference(&current_challenges).copied().collect();
    let available_champion_slots = COMP_SIZE - (selected_champions.len() as i32);

    // if we enter with valid comp we stop this leaf
    if available_champion_slots <= 0 && still_missing_challenges.is_empty() {
        let comp = selected_champions.clone();
        // println!("found!");
        results.push(comp);

        // if we reach enough comps we start the exit condition
        return (results.len() as i32) < limit;
    }

    let challenges = get_challenges();
    let champions = get_champions();
    let challenges_by_champions = get_challenges_by_champions();
    let mut challenges_to_explore: Vec<ChallengeExplore> = Vec::new();

    for &challenge_id in &still_missing_challenges {
        let challenge_champions = challenges.get(&challenge_id).unwrap();
        let addable_champions: HashSet<i32> = challenge_champions.difference(&selected_champions).copied().collect();
        let intersection: HashSet<i32> = challenge_champions.intersection(&selected_champions).copied().collect();
        let missing = get_challenge_requirements(challenge_id) - (intersection.len() as i32);
        let size = addable_champions.len() as i32;

        // we already have this challenge don't need to explore
        if missing <= 0 {
            continue;
        }

        // we don't have enough available stop to add this challenge
        // we stop this leaf
        if missing > available_champion_slots {
            // println!("missing {:?} available_champion_slots {:?}", missing, available_champion_slots);
            return true;
        }

        let explore_size = combinations_count(size as i64, missing as i64);

        challenges_to_explore.push(ChallengeExplore {
            addable_champions,
            missing,
            explore_size,
        });
    }

    // when we have all challenges we still need to add champions to keep adding champions to have a complete comp
    if challenges_to_explore.len() <= 0 {
        let remaining_champions: HashSet<i32> = champions.difference(&selected_champions).copied().collect();

        challenges_to_explore.push(ChallengeExplore {
            addable_champions: remaining_champions,
            missing: available_champion_slots,
            explore_size: -1, // don't need to count that since we don't use heuristic for the default case
        });
    } else {
        // explore the challenge with the least leafs first
        challenges_to_explore.sort_by_key(|l| l.explore_size);
    }

    let challenge_to_explore = &challenges_to_explore[0];

    // we want to add champions that are present in a lot of challenges first (heuristic)
    let mut addable_champions: Vec<i32> = challenge_to_explore.addable_champions.iter().copied().collect();
    addable_champions.sort_by(|a, b| {
        let freq_a = challenges_by_champions.get(a).map(|set| set.len()).unwrap_or(0);
        let freq_b = challenges_by_champions.get(b).map(|set| set.len()).unwrap_or(0);
        freq_b.cmp(&freq_a).then(a.cmp(b))
    });

    for composition in addable_champions.into_iter().combinations(challenge_to_explore.missing as usize) {
        let new_selected_champions: HashSet<i32> = HashSet::from_iter(composition).union(&selected_champions).copied().collect();

        if complete_comp_recursive(still_missing_challenges.clone(), new_selected_champions, results, limit, Some(depth - 1)) == false {
            // propagate the stop exit condition
            return false;
        }
    }

    true
}

pub fn complete_comp(selected_challenges: HashSet<i32>, selected_champions: HashSet<i32>, limit: i32) -> Vec<HashSet<i32>> {
    let mut results = Vec::new();
    complete_comp_recursive(selected_challenges, selected_champions, &mut results, limit, None);
    results
}

pub fn find_challenges(composition: &HashSet<i32>) -> HashSet<i32> {
    let mut challanges_found = HashSet::new();
    let challenges = get_challenges();

    for (challenge_id, challenge) in challenges {
        let intersect = challenge.intersection(&composition);

        if intersect.count() as i32 >= get_challenge_requirements(challenge_id) {
            challanges_found.insert(challenge_id);
        }
    }

    return challanges_found;
}
