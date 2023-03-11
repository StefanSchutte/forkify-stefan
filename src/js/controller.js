import * as model from './model.js';

import View from './views/view.js';

import recipeView from './views/recipeView.js';

import searchView from './views/search.js';

import resultsView from './views/resultsView.js';

import bookmarksView from './views/bookmarksView.js';

import paginationView from './views/paginationView.js';

import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import resultsView from './views/resultsView.js';

import { MODAL_CLOSE_SEC } from './config.js';
//if (module.hot) {
//  module.hot.accept();
//}

//const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    resultsView.renderSpinner();
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;

    // loading recipe

    recipeView.renderSpinner();

    // 0) update results view to mark selected search results 999probleem
    //resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    //const { recipe } = model.state;

    //rendering recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(`${err} wtf`);
    console.error(err);
  }
};
//controlRecipes();

//window.addEventListener('hashchange', controlRecipes);

//window.addEventListener('load', controlRecipes);

const controlSearchResults = async function () {
  try {
    //1 get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2 load search results
    await model.loadSearchResults(query);

    //3 render results

    //console.log(model.state.search.results);
    //resultsView.render(model.state.search.results);

    resultsView.render(model.getSearchResultsPage());

    //4 render initial pagination buttons

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1 render new results
  //console.log('pag controller');

  resultsView.render(model.getSearchResultsPage(goToPage));

  //2 render new pagination btns
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update recipe servings(in state)

  model.updateServings(newServings);

  //update the view(recipe view)
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1 add or remove bbokmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //console.log(model.state.recipe);
  //2 update recipe view
  recipeView.update(model.state.recipe);

  //3 render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {};
bookmarksView.render(model.state.bookmarks);

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);

  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);

    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success msg
    addRecipeView.renderMessage();

    //render bookmarkview
    bookmarksView.render(model.state.bookmarks);

    //change id i url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //window.history.back()

    //close form window

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('welcome');
};
init();
