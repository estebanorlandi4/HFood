// Fetch Data
export const GET_RECIPES = "GET_RECIPES";
export const RECIPE_DETAILS = "RECIPE_DETAILS";
export const DIET_TYPES = "DIET_TYPES";
export const CREATE_RECIPE = "CREATE_RECIPE";
export const ERROR = "ERROR";
export const THEME = "THEME";

// Handle Data
export const PAGE = "PAGE";
export const FILTER = "FILTER";

export function getRecipes(name = "") {
  return (dispatch) =>
    fetch(`http://localhost:3001/recipe?name=${name}`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: GET_RECIPES, payload: data }));
}

export function getDetails(id) {
  return (dispatch) =>
    fetch(`http://localhost:3001/recipe/${id}`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: RECIPE_DETAILS, payload: data }));
}

export function getTypes() {
  return (dispatch) =>
    fetch(`http://localhost:3001/diet`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: DIET_TYPES, payload: data }));
}

export function createRecipe(body) {
  return (dispatch) =>
    fetch(`http://localhost:3001/recipe`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => dispatch({ type: CREATE_RECIPE, payload: data.created }));
}

export function filter(filters) {
  return { type: FILTER, payload: filters };
}

export function page(number) {
  return { type: PAGE, payload: number };
}

export function removeError() {
  return { type: ERROR };
}

export function themeHandle(select) {
  return { type: THEME, payload: select };
}
