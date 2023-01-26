# Coding-Ninjas-Meals

Language Used

  i.   Vanilla JS
  ii.  CSS
  iii. HTML




1. API

async function getRandomMeal() {
  const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  console.log(randomMeal)

  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

  const respData = await resp.json();

  const meal = respData.meals[0];

  return meal
}

async function getMealBySearch(term) {
  const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);

  const respData = await resp.json();
  const meals = respData.meals;

  return meals;
}



2. Favourite Meals

function addMealFav(mealData) {

  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class= "clear"><i class="fas fa-window-close"></i></button>
  `;

  const btn = favMeal.querySelector('.clear');

  btn.addEventListener('click', () => {
    removeMealLS(mealData.idMeal);

    fetchFavMeals();
  });

  favMeal.addEventListener('click', () => {
    showMealInfo(mealData);
  });
  
  
  
  
  3.Reciepe information model
  
  
function showMealInfo(mealData) {
  // clean it up

  mealInfoEl.innerHTML = '';

  // update the Meal info
  const mealEl = document.createElement('div');

  const ingredients = [];

  // get ingredients and measures
  for(let i=1; i<=20; i++) {
    if(mealData['strIngredient' + i]) {
      ingredients.push(`${mealData['strIngredient' + i]} - ${mealData['strMeasure' + i]}`)
    } else {
      break;
    }
  }

  // JS regular expressions (get ID)
  const youtubeEl = mealData.strYoutube
  const selectURL = youtubeEl.match(/(?<=\=).{1,}/g)

  mealEl.innerHTML = `
    <h1>${mealData.strMeal}</h1>
    <iframe class="video-wrap" width="100%" height="315" src="https://www.youtube.com/embed/${selectURL}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <h3>Ingredients: </h3>
    <ul>
      ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>
    <p>${mealData.strInstructions}</p>
    <img src="${mealData.strMealThumb}" alt="">
  `

  mealInfoEl.appendChild(mealEl);

  // show the popup
  mealPopup.classList.remove('hidden')
}
