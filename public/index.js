const addContact = document.getElementById("addContact");
const contactForm = document.getElementById("contactForm");
const saveContact = document.getElementById("saveContact");
const contactList = document.getElementById("contactList");

let editingContactId = null;

addContact.addEventListener("click", () => {
  resetForm();
  contactForm.style.display = "block";
  saveContact.textContent = "Save Contact";
});

saveContact.addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone_number = document.getElementById("phone").value;

  const data = { name, email, phone_number };

  try {
    if (editingContactId) {
      await fetch(`/contacts/${editingContactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/newContact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    resetForm();
    loadContacts();
  } catch (err) {
    console.error("Error saving contact:", err);
  }
});

function resetForm() {
  contactForm.reset();
  contactForm.style.display = "none";
  saveContact.style.display = "inline";
  document.getElementById("name").readOnly = false;
  document.getElementById("email").readOnly = false;
  document.getElementById("phone").readOnly = false;
  editingContactId = null;
}

async function loadContacts() {
  try {
    const response = await fetch("/contacts");
    const contacts = await response.json();

    contacts.sort((a, b) => a.id - b.id);

    contactList.innerHTML = "";

    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Name", "Email", "Phone", "Actions"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      th.style.border = "1px solid #000";
      th.style.padding = "8px";
      th.style.backgroundColor = "#f2f2f2";
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

      const viewBtn = document.createElement("button");
      viewBtn.textContent = "View";
      viewBtn.style.marginRight = "5px";
      viewBtn.addEventListener("click", () => viewContact(contact));
      actionTd.appendChild(viewBtn);

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

function viewContact(contact) {
  contactForm.style.display = "block";

  document.getElementById("name").value = contact.name;
  document.getElementById("email").value = contact.email;
  document.getElementById("phone").value = contact.phone_number;

  document.getElementById("name").readOnly = true;
  document.getElementById("email").readOnly = true;
  document.getElementById("phone").readOnly = true;

  saveContact.style.display = "none";
}

function editContact(contact) {
  contactForm.style.display = "block";

  document.getElementById("name").value = contact.name;
  document.getElementById("email").value = contact.email;
  document.getElementById("phone").value = contact.phone_number;

  document.getElementById("name").readOnly = false;
  document.getElementById("email").readOnly = false;
  document.getElementById("phone").readOnly = false;

  saveContact.textContent = "Update Contact";
  saveContact.style.display = "inline";

  editingContactId = contact.id;
}

async function deleteContact(id) {
  if (!confirm("Are you sure you want to delete this contact?")) return;

  try {
    await fetch(`/contacts/${id}`, { method: "DELETE" });
    loadContacts();
  } catch (err) {
    console.error("Error deleting contact:", err);
  }
}

loadContacts();
