const addContact = document.getElementById("addContact");
const contactForm = document.getElementById("contactForm");
const saveContact = document.getElementById("saveContact");

addContact.addEventListener("click", function () {
  contactForm.style.display = "block";
});

saveContact.addEventListener("click", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone_number = document.getElementById("phone").value;

  const data = {
    name: name,
    email: email,
    phone_number: phone_number,
  };

  const response = await fetch("/newContact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  console.log(result);

  contactForm.reset();
  contactForm.style.display = "none";
});
