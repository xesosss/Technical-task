let currentPage = 1;
let sort = "username";

const sortField = document.getElementById("sort-field");
const pagination = document.getElementById("pagination");
const aboutBtn = document.getElementById("about-btn");
const userTable = document.getElementById("user-table");
const userModalWindow = document.getElementById("user-modal-window");
const addUserBtn = document.querySelector(".createNewUser");
const adminName = document.getElementById("admin-name");
const logOutBtn = document.getElementById("log-out");
const requestStatus = document.querySelector(".result-box");
const csrfToken = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

// Create Function for add elements with our params in HTML with XSS secure

const createCell = (text = "", className = "") => {
  const td = document.createElement("td");
  if (className) {
    td.classList.add(className);
  }
  td.textContent = text;
  return td;
};

const createButton = (
  text = "",
  className = "",
  userId = "",
  svgContent = null
) => {
  const btn = document.createElement("button");
  btn.className = className;
  if (userId) {
    btn.setAttribute("user-id", userId);
  }
  if (svgContent) {
    btn.innerHTML = svgContent; // For SVG innerHTML is save because content under control
  } else {
    btn.textContent = text;
  }
  return btn;
};

const createParagraph = (label, value) => {
  const p = document.createElement("p");
  p.textContent = `${label}: ${value}`;
  return p;
};

const createDivision = (classname = "", text = "") => {
  const div = document.createElement("div");
  div.className = classname;
  div.textContent = text;
  return div;
};

// Create function for show error or success

const showResult = (message, result) => {
  const label = document.createElement("label");
  label.textContent = `${result}: ${message}`;
  label.className = `${result}`;
  requestStatus.appendChild(label);
  setTimeout(() => {
    requestStatus.removeChild(label);
  }, 5000);
};

// Create function for get user data from database

const getUserInfo = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    showResult(data.message, data.result);
    return;
  }
  return data;
};

const loadUsers = async () => {
  // Get user info from data base for current page

  const data = await getUserInfo(`/api/users?page=${currentPage}&sort=${sort}`);

  adminName.innerHTML = "";
  adminName.textContent = "Account: " + data.admin;

  userTable.innerHTML = "";

  // Table header
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerData = ["Username", "First name", "Birthdate"];
  const headerRow = document.createElement("tr");
  headerData.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Fill table body

  const tbody = document.createElement("tbody");

  data.users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(user.username, "username"));
    tr.appendChild(createCell(user.first_name, "name"));
    tr.appendChild(createCell(user.birthdate, "birthdate"));

    // More info about user button

    const aboutSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width="25"
            height="25">
  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>`;
    const aboutBtn = createButton("", "about-btn", user.id, aboutSvg);
    const aboutTd = createCell("", "table-button");
    aboutTd.appendChild(aboutBtn);
    tr.appendChild(aboutTd);

    // Edit user info button

    const editSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width="25"
            height="25">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>`;
    const editBtn = createButton("", "edit-btn", user.id, editSvg);
    const editTd = createCell("", "table-button");
    editTd.appendChild(editBtn);
    tr.appendChild(editTd);

    // Delete user button
    const deleteSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width="25"
            height="25">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>`;
    const deleteBtn = createButton("", "delete-btn", user.id, deleteSvg);
    const deleteTd = createCell("", "table-button");
    deleteTd.appendChild(deleteBtn);
    tr.appendChild(deleteTd);

    // Add data in table body
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  userTable.appendChild(table);

  // pattern function for table button event listener (about,edit,delete)
  const tableButtonEventListener = (classname, func) => {
    document.querySelectorAll(classname).forEach((btn) => {
      btn.addEventListener("click", () => {
        const userId = btn.getAttribute("user-id");
        func(userId);
        document.body.classList.add("modal-open");
      });
    });
  };

  // Add event listener for buttons
  tableButtonEventListener(".about-btn", getMoreAboutUser);
  tableButtonEventListener(".edit-btn", createFormModalWindow);
  tableButtonEventListener(".delete-btn", deleteUser);

  // Add pagination
  let buttons = "";
  for (let i = 1; i <= data.totalPages; i++) {
    if (i === data.currentPage) {
      buttons += `<strong>${i}</strong> `;
    } else {
      buttons += `<a href="#" onclick="goToPage(${i})">${i}</a> `;
    }
  }
  pagination.innerHTML = buttons;
};

// Button for close modal window
const createCancelBtn = (text) => {
  const cancelBtn = createButton(text, "cancel");
  cancelBtn.addEventListener("click", () => {
    userModalWindow.innerHTML = "";
    document.body.classList.remove("modal-open");
  });
  return cancelBtn;
};

const getMoreAboutUser = async (id) => {
  // Get User id for open correct modal window
  const data = await getUserInfo(`/api/about-user?id=${id}`);

  userModalWindow.innerHTML = "";

  // Create Modal Window

  const modal = createDivision("modal-window", "");

  const content = createDivision("", "");

  // Fill modal window fields
  content.appendChild(createParagraph("First name", data.userInfo.first_name));
  content.appendChild(createParagraph("Last name", data.userInfo.last_name));
  content.appendChild(createParagraph("Gender", data.userInfo.gender));
  content.appendChild(createParagraph("Password", data.userInfo.password));
  content.appendChild(createParagraph("User name", data.userInfo.username));
  content.appendChild(createParagraph("Birthdate", data.userInfo.birthdate));

  // Add cancel button

  const cancelBtn = createCancelBtn("Close");

  content.appendChild(cancelBtn);
  modal.appendChild(content);
  userModalWindow.appendChild(modal);
};

const createFormModalWindow = async (id = "") => {
  let first_name, last_name, gender, password, username, birthdate, url;
  // Check condition (update or add) and set data
  if (id) {
    // Get User info from database
    const userdata = await getUserInfo(`/api/about-user?id=${id}`);

    first_name = userdata.userInfo.first_name;
    last_name = userdata.userInfo.last_name;
    gender = userdata.userInfo.gender;
    password = userdata.userInfo.password;
    username = userdata.userInfo.username;
    birthdate = userdata.userInfo.birthdate;
    url = `/api/update?id=${userdata.userInfo.id}`;
  } else {
    first_name = "";
    last_name = "";
    gender = "";
    password = "";
    username = "";
    birthdate = "";
    url = `/api/add-user`;
  }
  // Create modal window for edit or add user info
  userModalWindow.innerHTML = "";
  const modalWrapper = createDivision("modal-window", "");
  const modalBox = createDivision();
  modalBox.id = "edit-modal-window-box";
  const form = document.createElement("form");
  form.id = "modal-form";

  // Create pattern function for fast create row in a modal window
  const createRow = (labelText, name, value = "") => {
    const label = document.createElement("label");
    label.textContent = labelText;
    const input = document.createElement("input");
    input.name = name;
    input.value = value;
    const div = createDivision();

    div.appendChild(label);
    div.appendChild(input);

    return div;
  };

  // Fill rows

  form.appendChild(createRow("First name", "first_name", first_name));
  form.appendChild(createRow("Last name", "last_name", last_name));

  const genderDiv = createDivision();
  const genderLabel = document.createElement("label");
  genderLabel.textContent = "Gender";
  const genderSelect = document.createElement("select");
  genderSelect.name = "gender";

  const genders = ["Male", "Female"];

  // function to automatically set the current gender in <select>
  genders.forEach((usergender) => {
    const option = document.createElement("option");
    option.textContent = usergender;
    if (gender === usergender) {
      option.selected = true;
    }
    genderSelect.appendChild(option);
  });

  genderDiv.appendChild(genderLabel);
  genderDiv.appendChild(genderSelect);
  form.appendChild(genderDiv);

  form.appendChild(createRow("Password", "password", password));
  form.appendChild(createRow("User name", "username", username));
  form.appendChild(createRow("Birthdate", "birthdate", birthdate));

  const section = document.createElement("section");
  section.className = "button-box";

  // Add confirm and cancel button

  const confirmBtn = createButton("Confirm", "confirm");
  confirmBtn.type = "submit";

  const cancelBtn = createCancelBtn("Cancel");
  cancelBtn.id = "hide-modal-window-btn";

  // insert form into HTML

  section.appendChild(confirmBtn);
  section.appendChild(cancelBtn);

  form.appendChild(section);

  modalBox.appendChild(form);
  modalWrapper.appendChild(modalBox);
  userModalWindow.appendChild(modalWrapper);

  // Add functionality for submit button

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Create object from form data

    const formData = new FormData(form);
    const updateUserData = {};

    formData.forEach((value, key) => {
      updateUserData[key] = value;
    });

    if (id) {
      updateUserData.id = id;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
      body: JSON.stringify(updateUserData),
    });
    const data = await response.json();
    if (response.status === 400) {
      showResult(data.message, data.result);
    } else {
      showResult(data.message, data.result);
      loadUsers();
      userModalWindow.innerHTML = "";
      document.body.classList.remove("modal-open");
    }
  });
};

const deleteUser = async (id) => {
  // Create modal window for delete user
  userModalWindow.innerHTML = "";
  const modalWrapper = createDivision("modal-window");
  const modalBox = createDivision();
  const h2 = document.createElement("h2");
  h2.textContent = "You Sure?";
  const section = document.createElement("section");
  section.className = "delete-box";

  const confirmBtn = createButton("Confirm", "confirm");
  const cancelBtn = createCancelBtn("Cancel");
  cancelBtn.id = "hide-modal-window-btn";

  //install modal window

  section.appendChild(confirmBtn);
  section.appendChild(cancelBtn);
  modalBox.appendChild(h2);
  modalBox.appendChild(section);
  modalWrapper.appendChild(modalBox);
  userModalWindow.appendChild(modalWrapper);

  // add functionality for deleting user

  confirmBtn.addEventListener("click", async () => {
    const response = await fetch(`/api/delete-user`, {
      method: "POST",
      headers: { "Content-type": "application/json", "CSRF-Token": csrfToken },
      body: JSON.stringify({ id: id }),
    });
    const data = await response.json();
    showResult(data.message, data.result);
    loadUsers();
    userModalWindow.innerHTML = "";
    document.body.classList.remove("modal-open");
  });
};

// function for going to the page
const goToPage = (page) => {
  currentPage = page;
  loadUsers();
};

// Event Listeners with small functional

logOutBtn.addEventListener("click", async () => {
  const response = await fetch("/api/logout");
  const data = response.json();
  if (!response.ok) {
    showResult(data.message, data.result);
  }
  window.location.href = "/";
});

addUserBtn.addEventListener("click", async () => {
  createFormModalWindow();
});

sortField.addEventListener("change", () => {
  sort = sortField.value;
  loadUsers();
});

// Load users on start
loadUsers();
