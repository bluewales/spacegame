function login_prompt(callback) {

  var fields = [
    {display:"Email", name:"email", type:"text"},
    {display:"Password", name:"password", type:"password"}
  ];

  var form = d3.select("#ui")
    .append("div")
    .style("background-color", "white")
    .style("border", "4px solid grey")
    .style("margin", "0px auto")
    .style("width", "300px")
    .style("padding", "20px")
      .append("form")
      .style("margin", "10px 0px")
      .attr("name", "login_form")
      .attr("action", "");


  form.selectAll("p")
    .data(fields)
    .enter()
      .append("p")
      .style("color", "black")
      .each(function (d) {
        var self = d3.select(this);
        var label = self.append("label")
          .text(d.display)
          .style("width", "100px")
          .style("display", "inline-block");
        var input = self.append("input")
          .attr("type", function(d) {return d.type;})
          .attr("name", function(d) {return d.name;})
          .style("margin", "5px");
      });
  form.append("button")
    .attr('type', 'button')
    .text('Login')
    .style("float", "right")
    .on("click", function() {
      callback(login_form.email.value, login_form.password.value);
      d3.select("#ui").remove();
  	});

}
