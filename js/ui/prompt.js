function login_prompt(callback, error_message=null) {
  var fields = [
    {display: "Login", type: "header"},
    {display: "Email", name: "email", type: "text"},
    {display: "Password", name: "password", type: "password"},
    {display: "Login", name: "login_button", type: "button", action: function() {
      var username = login_form.email.value;
      var password = login_form.password.value;

      callback(username, password);
      remove_prompt();
  	}},{
      display: "Create an Account", type: "message", action: function() {
      remove_prompt();
      create_account(callback);
    }}
  ];
  if(error_message) {
    fields.push({display: error_message, type: "error_message"});
  }
  prompt(fields);
}

function create_account(callback, error_message=null) {
  var fields = [
    {display: "Create an Account", type: "header"},
    {display: "Email", name: "email", type: "text"},
    {display: "Password", name: "password", type: "password"},
    {display: "Create Account", name: "create_button", type: "button", action: function() {
      var username = login_form.email.value;
      var password = login_form.password.value;

      window.game.api.create_account(username, password, function(success) {
        remove_prompt();
        if(success === true) {
          callback(username, password);
        } else {
          create_account(callback, success);
        }
      });

  	}},
    {display: "Go to login", type: "message", action: function() {
      login_prompt(callback);
  	}}
  ];
  if(error_message) {
    fields.push({display: error_message, type: "error_message"});
  }
  prompt(fields);
}

function remove_prompt() {
  console.log("remove prmpt");
  var form_div = d3.select(".prompt_box");
  var ps = form_div.select("form")
    .selectAll("p")
    .on("click", null)
      .selectAll("button")
      .on("click", null);

  form_div.remove();
}

function prompt(structure) {
  remove_prompt();
  var form = d3.select("#ui")
    .append("div")
    .classed("prompt_box", true)
    .style("background-color", "white")
    .style("border", "4px solid grey")
    .style("margin", "0px auto")
    .style("width", "300px")
    .style("padding", "20px")
      .append("form")
      .style("margin", "10px 0px")
      .attr("name", "login_form")
      .attr("action", null)
      .style("width", "100%");

  form.selectAll("p")
    .data(structure)
    .enter()
      .append("p")

      .classed("prompt", true)
      .each(function (d) {
        var self = d3.select(this);
        if(d.type == "text" || d.type == "password") {
          var label = self.append("label")
            .text(d.display)
            .style("width", "100px")
            .style("display", "inline-block");
          var input = self.append("input")
            .attr("type", function(d) {return d.type;})
            .attr("name", function(d) {return d.name;})
            .style("margin", "5px");
        }
        if(d.type == "header") {
          self.append("h2")
            .text(d.display);
        }

        if(d.type == "button") {
          self.append("button")
            .text(d.display)
            .attr("type", "button")
            .classed("button", true)
            .on("click", d.action);
        }

        if(d.type == "message") {
          self.text(d.display)
            .classed("message", true)
            .on("click", d.action);
        }

        if(d.type == "error_message") {
          self.text(d.display)
            .classed("prompt error_message", true)
            .on("click", d.action);
        }
      });

}
