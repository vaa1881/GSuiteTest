/**
* Returns the array of cards that should be rendered for the current
* e-mail thread. The name of this function is specified in the
* manifest 'onTriggerFunction' field, indicating that this function
* runs every time the add-on is started.
*
* @param {Object} e The data provided by the Gmail UI.
* @return {Card[]}
*/
function buildAddOn(e) {
  var card = buildRootView();
  return [card];
}

function openWorkDetails(event) {
  var ID = event.parameters.ID;
  var objCode = event.parameters.objCode;
  try {
    var workItem = getWorkItem(objCode, ID);
  } catch (e) {
    var nav = CardService.newNavigation();
    var error = JSON.parse(e);
    if (error.status === 401) {
      nav.pushCard(buildAuthorizationView());
    } else {
      nav.pushCard(buildErrorView(e));
    }
    var nav = CardService.newNavigation()
    return CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .build();
  }
  var nav = CardService.newNavigation().pushCard(buildWorkItemView(workItem));
  return CardService.newActionResponseBuilder()
  .setNavigation(nav)
  .build();
}

function logout() {
  resetOAuth();
  var nav = CardService.newNavigation().popToRoot().updateCard(buildAuthorizationView());
  return CardService.newActionResponseBuilder()
  .setNavigation(nav)
  .setStateChanged(true)
  .build();
}