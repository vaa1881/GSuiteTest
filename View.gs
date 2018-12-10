function buildRootView() {
try {
    return buildWorkListCard(getWorkingOn());
  } catch(e) {
    var error = JSON.parse(e);
    if (error.status === 401) {
      return buildAuthorizationView();
    } else {
      return buildErrorView(error.message);
    }
  }
}

function buildWorkListCard(data) {
  if (!data || !data.length) {
    return buildEmptyView("You don't have anything to do.");
  }
  var cardBuilder = CardService.newCardBuilder();
  
  cardBuilder.setHeader(CardService.newCardHeader().setTitle('Working On'));
  for (var i = 0; i < data.length; i++) {
    item = data[i];
    var keyValueCard = CardService.newKeyValue();
    keyValueCard.setIconUrl(item.objCode === 'TASK' ? "https://gsuite.ngrok.io/images/task512.png" : "https://gsuite.ngrok.io/images/issue512.png");
    keyValueCard.setContent(item.name);
    if (item.commitDate || item.plannedCompletionDate) {
      keyValueCard.setBottomLabel(Moment.moment(item.commitDate, "YYYY-MM-DD'T'HH:mm:ss:SSSZ") || Moment.moment(item.plannedCompletionDate, "YYYY-MM-DD'T'HH:mm:ss:SSSZ"));
    }
    keyValueCard.setMultiline(true);
    keyValueCard.setOnClickAction(CardService.newAction().setFunctionName("openWorkDetails").setParameters({ID: item.ID, objCode: item.objCode}));
    var workItemCard = CardService.newCardSection()
    .addWidget(keyValueCard);
    cardBuilder.addSection(workItemCard);
  }
  return cardBuilder.build();
}

function buildWorkItemView(workItem) {
  var cardBuilder = CardService.newCardBuilder();
  cardBuilder.setHeader(CardService.newCardHeader().setTitle(workItem[0].name));
  return cardBuilder.build();
}

function buildEmptyView(message) {
  var cardBuilder = CardService.newCardBuilder();
  cardBuilder.addSection(CardService.newCardSection().addWidget(CardService.newTextParagraph().setText(message)));
  return cardBuilder.build();
}

function buildErrorView(message) {
  var cardBuilder = CardService.newCardBuilder();
  cardBuilder.setHeader(CardService.newCardHeader().setTitle("Error")).addSection(CardService.newCardSection().addWidget(CardService.newTextParagraph().setText(message)));
  return cardBuilder.build();
}

function buildAuthorizationView() {
  var service = getOAuthService();
  var authUrl = service.getAuthorizationUrl();
  var authButton = CardService.newTextButton()
      .setText('Begin Authorization')
      .setAuthorizationAction(CardService.newAuthorizationAction()
          .setAuthorizationUrl(authUrl));

  var promptText =
      'You need to authorize app with workfront';

  var card = CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader()
          .setTitle('Authorization Required'))
      .addSection(CardService.newCardSection()
          .setHeader('You need to login addon with workfront.')
          .addWidget(CardService.newTextParagraph()
              .setText(promptText))
          .addWidget(CardService.newButtonSet()
              .addButton(authButton)))
      .build();
  return card;
}