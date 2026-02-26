use wasm_bindgen::prelude::*;

mod challenges;
mod data;
mod data_transform;
mod tests;
mod tools;
use crate::challenges::complete_comp;
use crate::tools::vec_to_set;

#[wasm_bindgen]
pub fn optimize_selection(challenges: Vec<i32>, champions: Vec<i32>, limit: i32) -> Result<JsValue, JsValue> {
    let compositions = complete_comp(vec_to_set(challenges), vec_to_set(champions), limit);
    Ok(serde_wasm_bindgen::to_value(&compositions)?)
}
