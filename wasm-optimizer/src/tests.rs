#[cfg(test)]
mod tests {
    use crate::challenges::{complete_comp, find_challenges};
    use crate::tools::vec_to_set;

    #[test]
    fn test_complete_comp() {
        // assert_eq!(
        //     complete_comp(vec_to_set(vec![303403]), vec_to_set(vec![1]), 10).len(),
        //     10
        // );

        // let result = complete_comp(vec_to_set(vec![303407,303509]), vec_to_set(vec![]), 10);

        // let result = complete_comp(vec_to_set(vec![303401]), vec_to_set(vec![166, 103, 266, 22]), 10000);
        let result = complete_comp(vec_to_set(vec![303501]), vec_to_set(vec![]), 10000);
        // let result = complete_comp(vec_to_set(vec![303401, 303402, 303403, 303404]), vec_to_set(vec![]), 100);

        // let comps = complete_comp(
        //     vec_to_set(vec![303401, 303402, 303403]),
        //     vec_to_set(vec![]),
        //     1000000,
        // );

        for (nb_challenges, comps) in &result {
            println!("{}: {}", nb_challenges, comps.len());
        }

        // let comps = complete_comp(
        //     vec_to_set(vec![303401]),
        //     vec_to_set(vec![166, 22, 136, 432]),
        //     1000,
        // );

        // println!("{}", comps.len());

        assert!(false);
    }

    #[test]
    fn test_find_challenges() {
        assert_eq!(find_challenges(&vec_to_set(vec![432, 233, 99])), vec_to_set(vec![303401, 303402, 303403]));
        assert_eq!(find_challenges(&vec_to_set(vec![432, 233, 136])), vec_to_set(vec![303401, 303402]));
        assert_eq!(find_challenges(&vec_to_set(vec![166, 141, 161, 33, 133])), vec_to_set(vec![]));
    }
}
