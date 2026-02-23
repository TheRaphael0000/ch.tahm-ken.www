use wasm_bindgen::prelude::*;


#[wasm_bindgen]
pub fn optimize_selection(challenges: Vec<i32>, champions: Vec<String>) -> Result<JsValue, JsValue> {

    let mut compositions: Vec<Vec<String>> = Vec::new();

    let composition = vec![
        String::from("Mordekaiser"), 
        String::from("MasterYi"),
        String::from("Zed"),
        String::from("Jinx"),
        String::from("Sona"),
    ];
    compositions.push(composition.clone());
    compositions.push(composition.clone());

    Ok(serde_wasm_bindgen::to_value(&compositions)?)
}