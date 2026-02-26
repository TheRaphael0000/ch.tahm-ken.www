#[cfg(test)]
mod tests {
    use crate::challenges::{complete_comp, find_challenges};
    use crate::tools::vec_to_set;

    #[test]
    fn test_complete_comp() {
        // only used for debugging no actual unit test

        // let result = complete_comp(vec_to_set(vec![303407,303509]), vec_to_set(vec![]), 10);
        // let result = complete_comp(vec_to_set(vec![303401]), vec_to_set(vec![166, 103, 266, 22]), 10000);
        // let result = complete_comp(vec_to_set(vec![303501]), vec_to_set(vec![]), 10000);
        // let result = complete_comp(vec_to_set(vec![303401, 303402, 303403, 303404]), vec_to_set(vec![]), 100);
        // let result = complete_comp(vec_to_set(vec![303401]), vec_to_set(vec![166, 22, 136, 432]), 1000);
        let result = complete_comp(vec_to_set(vec![303408]), vec_to_set(vec![40]), 100);

        for (nb_challenges, comps) in &result {
            println!("{}: {}", nb_challenges, comps.len());
        }

        assert!(true);
    }

    #[test]
    fn test_find_challenges() {
        assert_eq!(find_challenges(&vec_to_set(vec![432, 233, 99])), vec_to_set(vec![303401, 303402, 303403]));
        assert_eq!(find_challenges(&vec_to_set(vec![432, 233, 136])), vec_to_set(vec![303401, 303402]));
        assert_eq!(find_challenges(&vec_to_set(vec![166, 141, 161, 33, 133])), vec_to_set(vec![]));
    }
}
