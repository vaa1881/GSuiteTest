function getOAuthService() {
  var oauthService = OAuth2.createService("workfront")
  .setAuthorizationBaseUrl("https://gsuite.ngrok.io?id=" + encodeURIComponent(Utilities.base64EncodeWebSafe(Session.getEffectiveUser().getEmail(), Utilities.Charset.UTF_8)))
  .setTokenUrl("https://vahe1.ngrok.io/token")
  .setClientId("a")
  .setClientSecret("b")
  .setCallbackFunction("authCallback")
  .setPropertyStore(PropertiesService.getUserProperties())
  .setCache(CacheService.getUserCache())
  .setScope("workfront");
  
  return oauthService;
}

function resetOAuth() {
    getOAuthService().reset();
}