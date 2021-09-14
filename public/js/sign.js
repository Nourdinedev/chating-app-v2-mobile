
// //Scroll Down effect
// const Scrollbtn = document.getElementById("scrollDown-btn")
// Scrollbtn.addEventListener("click", () => {
//    window.scrollBy({
//       top: 1000,
//       left: 0,
//       behavior: "smooth"
//    })
//    // 
//    // console.log("clicked")
// })

//sign-in and sign-up switch
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
   container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
   container.classList.remove("right-panel-active");
});

//show and hide password
//for sign up form
const showPassSignUp = document.getElementById("show-password-sign-up")
const hidePassSignUp = document.getElementById("hide-password-sign-up")

const passwordInputSignUp = document.getElementById("password-sign-up")

showPassSignUp.addEventListener("click", () => {
   passwordInputSignUp.type = ""
   showPassSignUp.classList.add("hide")
   hidePassSignUp.classList.remove("hide")
})

hidePassSignUp.addEventListener("click", () => {
   passwordInputSignUp.type = "password"
   hidePassSignUp.classList.add("hide")
   showPassSignUp.classList.remove("hide")
})

//for sign in form
const showPassSignIn = document.getElementById("show-password-sign-in")
const hidePassSignIn = document.getElementById("hide-password-sign-in")

const passwordInputSignIn = document.getElementById("password-sign-in")

showPassSignIn.addEventListener("click", () => {
   passwordInputSignIn.type = ""
   showPassSignIn.classList.add("hide")
   hidePassSignIn.classList.remove("hide")
})

hidePassSignIn.addEventListener("click", () => {
   passwordInputSignIn.type = "password"
   hidePassSignIn.classList.add("hide")
   showPassSignIn.classList.remove("hide")
})

// sign-up form validation
const form = document.getElementById('form');
const username = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password-sign-up');


form.addEventListener('submit', e => {
   e.preventDefault();

   function checkInputs() {
      // trim to remove the whitespaces
      const usernameValue = username.value.trim();
      const emailValue = email.value.trim();
      const passwordValue = password.value.trim();


      if (usernameValue === '') {
         setErrorFor(username, 'Name cannot be blank');
      } else {
         setSuccessFor(username);
         if (emailValue === '') {
            setErrorFor(email, 'Email cannot be blank');
         } else if (!isEmail(emailValue)) {
            setErrorFor(email, 'Not a valid email');
         } else {
            setSuccessFor(email);
            if (passwordValue === '') {
               setErrorFor(password, 'Password cannot be blank');
            } else if (passwordValue.length < 6) {
               setErrorFor(password, 'Password must be at least 6 characters long');
            } else {
               setSuccessFor(password);
               e.currentTarget.submit();
            }
         }
      }



   }

   checkInputs();

});


// sign-in form validation
const form2 = document.getElementById('form2');
const email2 = document.getElementById('email2');
const password2 = document.getElementById('password-sign-in');


form2.addEventListener('submit', e => {
   e.preventDefault();

   function checkInputs2() {
      // trim to remove the whitespaces
      const emailValue2 = email2.value.trim();
      const passwordValue2 = password2.value.trim();


      if (emailValue2 === '') {
         setErrorFor(email2, 'Email cannot be blank');
      } else if (!isEmail(emailValue2)) {
         setErrorFor(email2, 'Not a valid email');
      } else {
         setSuccessFor(email2);
         if (passwordValue2 === '') {
            setErrorFor(password2, 'Password cannot be blank');
         } else {
            setSuccessFor(password2);
            e.currentTarget.submit();
         }
      }
   }

   checkInputs2();
});



function setErrorFor(input, message) {
   const formControl = input.parentElement;
   const small = formControl.querySelector('small');
   formControl.className = 'form-control error';
   small.innerText = message;
}

function setSuccessFor(input) {
   const formControl = input.parentElement;
   formControl.className = 'form-control';
}

function isEmail(email) {
   return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}
