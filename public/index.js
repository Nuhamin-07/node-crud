const addContact = document.getElementById("addContact");
const contactForm = document.getElementById("contactForm");
const saveContact = document.getElementById("saveContact");
const contactList = document.getElementById("contactList");

addContact.addEventListener("click", function () {
  contactForm.style.display = "block";
});

saveContact.addEventListener("click", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone_number = document.getElementById("phone").value;

  const data = { name, email, phone_number };

  const response = await fetch("/newContact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  console.log(result);

  contactForm.reset();
  contactForm.style.display = "none";

  loadContacts();
});

async function loadContacts() {
  try {
    const response = await fetch("/contacts");
    const contacts = await response.json();
    contactList.innerHTML = "";

    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Name", "Email", "Phone", "Actions"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      th.style.border = "1px solid #000";
      th.style.padding = "8px";
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    contacts.forEach((contact) => {
      const tr = document.createElement("tr");

      [contact.name, contact.email, contact.phone_number].forEach((value) => {
        const td = document.createElement("td");
        td.textContent = value;
        td.style.border = "1px solid #000";
        td.style.padding = "8px";
        tr.appendChild(td);
      });

      const actionTd = document.createElement("td");

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.style.marginRight = "5px";
      editBtn.addEventListener("click", () => editContact(contact));
      actionTd.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteContact(contact.id));
      actionTd.appendChild(deleteBtn);

      tr.appendChild(actionTd);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    contactList.appendChild(table);
  } catch (err) {
    console.error("Error loading contacts:", err);
  }
}
loadContacts();
