
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
  dd = '0' + dd;
}

if (mm < 10) {
  mm = '0' + mm;
}

today = yyyy + '-' + mm + '-' + dd;

var blood_group = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
var options = '';
for (var i = 0; i < blood_group.length; i++) {
  options += '<option value="' + blood_group[i] + '" />';
}

blood_groups.innerHTML = options

var questions = [
  { question: "What's your blood group?", type: "text" },
  { question: "What's your full name?", type: "text" },
  { question: "What's your address?", type: "text"},
  { question: "What's your email?", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  { question: "What's your phone number?", type: "tel" },
  { question: "What's your date of birth?", type: "date" },
  { question: "Create your password", type: "password" }
];

/**********    
  Credits for the design go to XavierCoulombeM
  https://dribbble.com/shots/2510592-Simple-register-form 
 
 **********/

function register_animate() {

  var tTime = 100  // transition transform time from #register in ms
  var wTime = 200  // transition width time from #register in ms
  var eTime = 1000 // transition width time from ril in ms

  // init
  // --------------
  var position = 0

  putQuestion()

  rnext.addEventListener('click', validate)
  rif.addEventListener('keyup', function (e) {
    transform(0, 0) // i.e. hack to redraw
    if (e.keyCode == 13) validate()
  })

  // functions
  // --------------

  // load the next question
  function putQuestion() {
    ril.innerHTML = questions[position].question

    if (position == 0) {
      rif.value = '';
    } 
    else if (position == 5) {
      rif.value = today;
    }
    else if (position == 1){
      rif.value = ''
      rif.list.id = ''
    }
    else {
      rif.value = ''
    }

    rif.type = questions[position].type || 'text'
    rif.focus()
    showCurrent()
  }

  // when all the questions have been answered
  function done() {

    // remove the box if there is no next question
    register.className = '';
    register.classList.add('close');

    $.ajax({
      url: "./Backend/user_register_submit.php",
      type: "POST",
      data: {
        blood_group: questions[0].value,
        name: questions[1].value,
        address: questions[2].value,
        email: questions[3].value,
        phone: questions[4].value,
        dob: questions[5].value,
        psd: questions[6].value
      },
      cache: false,
      success: function (response) {
        var h1 = document.createElement('h1')
        var pre = document.createElement("pre")
        h1.appendChild(pre)

        alert(response);
        // if (response == 0) {
        //   // add the h1 at the end with the welcome text
        //   pre.appendChild(document.createTextNode("Registration failed due to network issues.\n Please try again."));
        //   // location.reload();
        // }
        // else if(response == 1){
        //   // add the h1 at the end with the welcome text
        //   pre.appendChild(document.createTextNode('Welcome ' + questions[1].value + '!'));
        //   pre.appendChild(document.createTextNode("\nPlease Login to continue."));
        // }
        // setTimeout(function () {
        //   register.parentElement.appendChild(h1)
        //   setTimeout(function () { h1.style.opacity = 5 }, 50)
        // }, eTime)
      }
    });
  }

  // when submitting the current question
  function validate() {

    // set the value of the field into the array
    questions[position].value = rif.value

    // check if the pattern matches
    if (!rif.value.match(questions[position].pattern || /.+/)) wrong()
    else ok(function () {

      if (position == 3 || position == 4) {

        if (position == 3){
            Url = "./Backend/log_mail_submit.php"
            detail = { email: questions[3].value }
        }
        else if(position == 4){
            Url = "./Backend/reg_phone_submit.php"
            detail = { phone: questions[4].value }
        }

        $.ajax({
          url: Url,
          type: "POST",
          data: detail,
          cache: false,
          success: function (res) {

            if (res == 0) {
              alert("Unable to reach the server.\n Please try again.")
            }
            else if (res == 2) {
              // set the progress of the background
              rprogress.style.width = ++position * 100 / questions.length + 'vw'

              // if there is a new question, hide current and load next
              if (questions[position]) hideCurrent(putQuestion)
              else hideCurrent(done)
            }
            else if (res == 1){
              wrong()
              alert("User already exist.");
            }

          }
        });
      }
      else {
        // set the progress of the background
        rprogress.style.width = ++position * 100 / questions.length + 'vw'

        // if there is a new question, hide current and load next
        if (questions[position]) hideCurrent(putQuestion)
        else hideCurrent(done)
      }
    })

  }

  // helper
  // --------------

  function hideCurrent(callback) {
    ric.style.opacity = 0
    rip.style.transition = 'none'
    rip.style.width = 0
    setTimeout(callback, wTime)
  }

  function showCurrent(callback) {
    ric.style.opacity = 1
    rip.style.transition = ''
    rip.style.width = '100%'
    setTimeout(callback, wTime)
  }

  function transform(x, y) {
    register.style.transform = 'translate(' + x + 'px ,  ' + y + 'px)'
  }

  function ok(callback) {
    register.className = '';
    register.classList.add('mainform');
    setTimeout(transform, tTime * 0, 0, 10)
    setTimeout(transform, tTime * 1, 0, 0)
    setTimeout(callback, tTime * 2)
  }

  function wrong(callback) {
    register.className = ''
    register.classList.add('mainform');
    register.classList.add('wrong');
    for (var i = 0; i < 6; i++) // shaking motion
      setTimeout(transform, tTime * i, (i % 2 * 2 - 1) * 20, 0)
    setTimeout(transform, tTime * 6, 0, 0)
    setTimeout(callback, tTime * 7)
  }

}

var reg_btn = document.getElementById("reg-btn");
reg_btn.addEventListener("click", register_animate());