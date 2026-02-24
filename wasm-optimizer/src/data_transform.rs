use std::collections::HashMap;
use std::collections::HashSet;

use crate::data::get_challenges;

pub fn get_challenge_requirements(challenge_id: i32) -> i32 {
    if challenge_id / 100 == 3035 || challenge_id == 303407 || challenge_id == 303408 {
        return 5;
    }
    return 3;
}

pub fn get_champions() -> HashSet<i32> {
    let challenges = get_challenges();
    let mut champions = HashSet::new();
    for (_challenge_id, challenge) in challenges {
        champions.extend(&challenge);
    }
    champions
}

pub fn get_challenges_by_champions() -> HashMap<i32, HashSet<i32>> {
    let mut challenges_by_champions: HashMap<i32, HashSet<i32>> = HashMap::new();
    let challenges = get_challenges();
    for (challenge_id, challenge) in challenges {
        for champion in challenge {
            challenges_by_champions.entry(champion).or_default().insert(challenge_id);
        }
    }
    challenges_by_champions
}
