
// link HTML DOM
const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById('fav-meals');
const serchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
const mealInfoEl = document.getElementById('meal-info')
const mealPopup = document.getElementById('meal-popup');
const popupCloseBtn = document.getElementById('close-popup');

// -----------------------------


// excecute main function
getRandomMeal();
fetchFavMeals();


// link in the meal DB

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

// ------


function addMeal(mealData, random = false) {

  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
    <div class="meal-header">
      ${random ? `
      <span class="random"> Random Recipe </span>` : ""}
      <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
    </div>
    <div class="meal-body">
      <h4>${mealData.strMeal}</h4>
      <button class="fav-button" ><i class="fas fa-thumbs-up"></i></button>
    </div>
    <div class="meal-foot">
      
    </div>
    `;
    
  const btn = meal.querySelector(".meal-body .fav-button");


  btn.addEventListener("click", () => { // click event
    if(btn.classList.contains('active')) { // check active class
      removeMealLS(mealData.idMeal) //  if unclick remove idMeal
      btn.classList.remove("active") // remove active
    } 
    else { // if active class already in there
      addMealLS(mealData.idMeal)  // add idMeal from mealData
      btn.classList.add("active") // then add active class
    }


    fetchFavMeals();


  });

  meal.addEventListener('click', () => {
    showMealInfo(mealData);
  });

  mealsEl.appendChild(meal); 
}

function addMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
  const mealIds = getMealsLS();
  
  localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));

}

function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem('mealIds'));

  return mealIds === null ? [] : mealIds; // mealIDs 가 null 이면 [] otherwise mealIds
}


async function fetchFavMeals() {

  // clean the container
  favoriteContainer.innerHTML = "";

  const mealIds = getMealsLS();

  const meals = [];

  for(let i=0; i<mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);

    addMealFav(meal);
  }
}



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


  favoriteContainer.appendChild(favMeal); 
}

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


searchBtn.addEventListener('click', async () => {
  // clean container
  mealsEl.innerHTML = "";

  const search = serchTerm.value;
  const meals = await getMealBySearch(search);

  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});



popupCloseBtn.addEventListener('click', () => {
  mealPopup.classList.add('hidden');
})

