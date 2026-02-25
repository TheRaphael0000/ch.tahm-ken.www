use std::collections::HashSet;
use std::hash::Hash;

pub fn vec_to_set<T>(vec: Vec<T>) -> HashSet<T>
where
    T: Eq + Hash,
{
    HashSet::from_iter(vec)
}

pub fn combinations_count(n: i64, r: i64) -> i64 {
    if r > n {
        return 0;
    }
    if r == 0 || r == n {
        return 1;
    }
    let mut res = 1;
    for i in 0..r {
        res = res * (n - i) as i64 / (i + 1) as i64;
    }
    res
}
