function toggleModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function register(event) {
  event.preventDefault();
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  localStorage.setItem("user", JSON.stringify({ username, password }));
  document.getElementById("registerResponse").innerText = "Registration successful!";
  toggleModal('registerModal');
}

function login(event) {
  event.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const savedUser = JSON.parse(localStorage.getItem("user"));
  if (savedUser && savedUser.username === username && savedUser.password === password) {
    localStorage.setItem("loggedInUser", username);
    updateAuthDisplay();
    toggleModal('loginModal');
  } else {
    document.getElementById("loginResponse").innerText = "Invalid credentials!";
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  updateAuthDisplay();
}

function updateAuthDisplay() {
  const username = localStorage.getItem("loggedInUser");
  const userSpan = document.getElementById("userWelcome");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (username) {
    userSpan.innerText = `Welcome, ${username}`;
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    userSpan.innerText = "";
    loginBtn.style.display = "inline-block";
    registerBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
}

function attemptDonation() {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!savedUser) {
    alert("No user registered yet. Please register first.");
    toggleModal('registerModal');
    return;
  }

  if (!loggedInUser) {
    alert("You're registered but not logged in. Please login first.");
    toggleModal('loginModal');
    return;
  }

  toggleModal('donationModal');
}

function donateMoney(event) {
  event.preventDefault();
  const amount = document.getElementById("donationAmount").value;
  const username = localStorage.getItem("loggedInUser");

  if (!username) return;

  const donation = {
    amount: parseFloat(amount),
    date: new Date().toLocaleString()
  };

  // Store donations per user
  const allDonations = JSON.parse(localStorage.getItem("donations")) || {};
  if (!allDonations[username]) {
    allDonations[username] = [];
  }

  allDonations[username].push(donation);
  localStorage.setItem("donations", JSON.stringify(allDonations));

  document.getElementById("donationResponse").innerText = `Thank you for donating ₹${amount}!`;
  setTimeout(() => {
    toggleModal('donationModal');
    showDonationHistory(); // update UI
  }, 2000);
}

function submitForm(event) {
  event.preventDefault();
  document.getElementById("formResponse").innerText = "Message sent! We'll get back to you soon.";
}

window.onload = updateAuthDisplay;

function showDonationHistory() {
  const username = localStorage.getItem("loggedInUser");
  const donationList = document.getElementById("donationHistoryList");
  donationList.innerHTML = "";

  if (!username) {
    donationList.innerHTML = "<li>Please login to view your donation history.</li>";
    return;
  }

  const allDonations = JSON.parse(localStorage.getItem("donations")) || {};
  const userDonations = allDonations[username] || [];

  if (userDonations.length === 0) {
    donationList.innerHTML = "<li>No donations made yet.</li>";
    return;
  }

  userDonations.forEach((donation, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ₹${donation.amount} donated on ${donation.date}`;
    donationList.appendChild(li);
  });
}