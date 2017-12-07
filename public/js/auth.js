$('#register').submit(function (e) {
  e.preventDefault();
  console.log('USER SIGNING UP  ...');
  let username = $('#user-name').val();
  let password = $('#user-pass').val();

  console.log(username, password)

  let data = {
      "username": username,
      "password": password
  }

  $.post('/register', data, function(data){
      console.log('--------------------')
      console.log("SUCCESS!")
  }).catch((err) => {
      window.setTimeout(hidewindow, 1000)
      $('#errorbox').css("opacity", "100")
      $('#errorbox').html(err.responseText)
      console.log(err.responseText)
  })

  const hidewindow = function(){
      $('#errorbox').animate({opacity: "0"}, 1000)
  }
});
