

class API {
  constructor() {

  }
  make_call(data, callback, try_login=true) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    var on_complete = (function(text) {
      var response = JSON.parse(text);
      console.log(response);
      if(response.success === "false" && response.logged_in === "false" && try_login) {
        this.login((function() {this.make_call(data, callback, try_login=false);}).bind(this), response.message);
      } else {
        if(callback) callback(response);
      }
    }).bind(this);

    xhr.onreadystatechange = (function() {
      if (this.readyState == 4 && this.status == 200) {
        on_complete(xhr.responseText);
      };
    });

    if(this.token) data.auth_token = this.token;
    console.log(data);
    xhr.send(JSON.stringify(data));
  }
  login(callback, last_error=false) {

    login_prompt((function(username, password) {
      this.make_call(
        {"method": "login", "username": username, "password": password},
        (function(response){
          this.token = response.auth_token;
          if(callback) callback();
        }).bind(this)
      );
    }).bind(this), last_error);
  }
  create_account(username, password, callback) {
    this.make_call(
      {"method": "createuser", "username": username, "password1": password, "password2": password},
      (function(response){
        if(callback && response.success === "true") {
          this.token = response.auth_token;
          callback(true);
        } else {
          callback(response.message);
        }
      }).bind(this),
      false
    );
  }
  upload_save_state(state) {
    this.make_call({"data": state,"method": "set_save"});
  }
  download_save_state(callback) {
    this.make_call( {"method": "get_save"}, (function(response){if(callback)callback(response['data']);}).bind(this));
  }
}
