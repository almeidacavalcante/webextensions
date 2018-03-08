beginScript();

function beginScript() {
  login();
}

function login() {
  if (isLoginScreen()) {
    $('#User').val('jose.cavalcante');
    $('#Password').val('');
    $('#LoginButton').click();
  }
}

function isLoginScreen() {
  $userField = $('#User');
  $passField = $('#Password');

  if ($userField != undefined && $passField != undefined) {
    return true;
  } else {
    return false;
  }
}
