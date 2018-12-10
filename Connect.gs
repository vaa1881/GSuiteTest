var authService = getOAuthService();

function loadData(url) {
  var maybeAuthorized = authService.hasAccess();
  if (maybeAuthorized) {
    var resp = UrlFetchApp.fetch(url, {
      method: "GET",
      headers: {
        token: authService.getAccessToken()
      },
      muteHttpExceptions: true
    });
    var httpStatusCode = resp.getResponseCode();
    if (httpStatusCode >= 200 && httpStatusCode < 300) {
      return JSON.parse(resp.getContentText());
    } else if (httpStatusCode == 401 || httpStatusCode == 403) {
      throw JSON.stringify({status: 401, message: 'Authorization required.'});
    } else {
      console.error("Backend server error (%s): %s", code.toString(),
                    resp.getContentText("utf-8"));
      throw ("Backend server error: " + code);
    } 
  } else {
    throw JSON.stringify({status: 401, message: 'Authorization required.'});
  }
}

function getWorkingOn() {
  return loadData("https://vahe.ngrok.io/wf/getWorkingOn");
}

function getWorkItem(objCode, ID) {
  if ((objCode !== 'TASK' && objCode !== "OPTASK") || !ID) {
    throw 'objCode and ID should not be empty and should have correct values.';
  }
  return loadData("https://vahe.ngrok.io/wf/" + (objCode === 'TASK' ? "getTask" : "getIssue") + "?objID=" + ID);
}

function authCallback(callbackRequest) {
  var authorized = authService.handleCallback(callbackRequest);
  if (authorized) {
    return HtmlService.createHtmlOutput(
      'Success! <script>setTimeout(function() { top.window.close() }, 1);</script>');
  } else {
    return HtmlService.createHtmlOutput('Denied');
  }
}

function resetOauth() {
  authService.reset();
}
