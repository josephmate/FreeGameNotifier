const axios = require('axios');
const freeGameUrl = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=CA&allowCountries=CA";
const epicDevTestAcct = {
  id: "o-ufmrk5furrrxgsp5tdngefzt5rxdcn",
  name: "Epic Dev Test Account"
};

const parseFreeGames = function(response) {
  var currentDate = new Date(); 
  let currentFreeGames = [];
  let nextWeekFreeGames = [];
  console.log(JSON.stringify(response.data));
  response.data.data.Catalog.searchStore.elements.forEach(game => {
    if (!isVaultedGame(game)) {
      let slug = null

      try {
        slug = game.catalogNs.mappings[0].pageSlug

        // fallback to old implementation if this fails
        if (!slug || slug == "null") {
          slug = game.productSlug
        }
  
      } catch(e) {
        slug = game.productSlug
      }

      let url = `https://www.epicgames.com/store/p/${slug}`
      if(game.promotions
        && game.promotions.promotionalOffers
        && game.promotions.promotionalOffers.length > 0
        && game.promotions.promotionalOffers[0].promotionalOffers.length > 0
        && game.promotions.promotionalOffers[0].promotionalOffers[0].discountSetting.discountType == "PERCENTAGE"
        && game.promotions.promotionalOffers[0].promotionalOffers[0].discountSetting.discountPercentage == 0
      ) {
        currentFreeGames.push({
          title: game.title,
          url: url
        });
      } else if(game.promotions
        && game.promotions.upcomingPromotionalOffers
        && game.promotions.upcomingPromotionalOffers.length > 0
        && game.promotions.upcomingPromotionalOffers[0].promotionalOffers.length > 0
        && game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].discountSetting.discountType == "PERCENTAGE"
        && game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].discountSetting.discountPercentage == 0
      ) {
        nextWeekFreeGames.push({
          title: game.title,
          url: url
        });
      }
    }
  });

  let message = "";
  if (currentFreeGames.length > 0) {
    currentFreeGames.forEach(game => {
      message += `FREE: ${game.title} at ${game.url}\n`;
    });
  } else {
    message += "Remember to checkout https://www.epicgames.com/store/ for this week's free game.\n";
  }
  nextWeekFreeGames.forEach(game => {
    message += `Next week: ${game.title} at ${game.url}\n`;
  });

  return message;
}

const getImpl = async function (
){
  return await axios({
    url: freeGameUrl,
    method: 'get',
    responseType: 'json',
  })
    .then(parseFreeGames)
    .catch(err => {
      console.log(`There was an issue ${err}. Falling back to default message`);
      return "Remember to checkout https://www.epicgames.com/store/ for this week's free game.";
    });

}

const isVaultedGame = function(game) {
  let seller = game.seller

  if (seller) {
    return seller.id == epicDevTestAcct.id || seller.name == epicDevTestAcct.name
  }

  let categories = game.categories

  // tertiary var since js can't return from foreach lol
  let isVaulted = false

  if (categories) {
    categories.forEach(category => {
      if (category.path == "freegames/vaulted") {
        isVaulted = true
      }
    })
  }

  return isVaulted
}

module.exports = {
  get: getImpl,
  parseFreeGames: parseFreeGames,
  epicDevTestAcct: epicDevTestAcct,
  isVaultedGame: isVaultedGame
};
