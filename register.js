const KEY_STUDENTS = "deutschpulse_candidates_v1";

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", function() {
    const btn = document.getElementById("regBtn");
    const nameEl = document.getElementById("regName");
    const mobileEl = document.getElementById("regMobile");
    const emailEl = document.getElementById("regEmail");
    const levelEl = document.getElementById("regLevel");
    const slotEl = document.getElementById("regSlot");
    const goalEl = document.getElementById("regGoal");

    const name = nameEl ? nameEl.value.trim() : "";
    const mobile = mobileEl ? mobileEl.value.trim() : "";
    const email = emailEl ? emailEl.value.trim() : "";
    const level = levelEl ? levelEl.value : "German A1 (Rs 6,000 / 2 Mos)";
    const slot = slotEl ? slotEl.value : "05:00 PM - 06:00 PM (Mon-Fri)";
    const goal = goalEl ? goalEl.value : "Goethe-Zertifikat A1";

    const studentId = "DP-" + Math.floor(1000 + Math.random() * 9000);
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const hidId = document.getElementById("hiddenStudentId");
    const hidSub = document.getElementById("hiddenSubject");
    if (hidId) hidId.value = studentId;
    if (hidSub) hidSub.value = "New DeutschPulse A1 Registration: " + name + " (" + studentId + ")";

    const list = JSON.parse(localStorage.getItem(KEY_STUDENTS) || "[]");
    list.unshift({
      id: studentId,
      timestamp: timestamp,
      name: name,
      mobile: mobile,
      email: email,
      course: level,
      timing: slot,
      purpose: goal,
      progress: "10%",
      module: "Week 1: German Phonetics and Greetings",
      remarks: "Enrolled for 05:00 PM - 06:00 PM IST Goethe A1 Batch."
    });
    localStorage.setItem(KEY_STUDENTS, JSON.stringify(list));

    if (btn) {
      btn.textContent = "Registered & Email Sent!";
      btn.classList.remove("bg-brand-gold");
      btn.classList.add("bg-emerald-600", "text-white");
    }

    const recId = document.getElementById("recId");
    const recName = document.getElementById("recName");
    const recMobile = document.getElementById("recMobile");
    const recEmail = document.getElementById("recEmail");
    const recBox = document.getElementById("receiptBox");

    if (recId) recId.textContent = studentId;
    if (recName) recName.textContent = name;
    if (recMobile) recMobile.textContent = mobile;
    if (recEmail) recEmail.textContent = email;
    if (recBox) recBox.classList.remove("hidden");
  });

  const copyBtn = document.getElementById("copyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function() {
      const id = document.getElementById("recId") ? document.getElementById("recId").textContent : "";
      const name = document.getElementById("recName") ? document.getElementById("recName").textContent : "";
      const mobile = document.getElementById("recMobile") ? document.getElementById("recMobile").textContent : "";
      const email = document.getElementById("recEmail") ? document.getElementById("recEmail").textContent : "";
      const text = "DeutschPulse A1 Registration | ID: " + id + " | Name: " + name + " | Mobile: " + mobile + " | Email: " + email + " | Timing: 5:00 PM - 6:00 PM IST | Tutor: P. Jayasree";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
      this.textContent = "Copied!";
    });
  }
});
