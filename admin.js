const KEY_STUDENTS = "deutschpulse_candidates_v1";
const KEY_PASS = "deutschpulse_admin_pass_v1";
const ADMIN_USER = "jayasree";

function getPass() {
  return localStorage.getItem(KEY_PASS) || "jnvc";
}

function getStudents() {
  try {
    return JSON.parse(localStorage.getItem(KEY_STUDENTS)) || [];
  } catch (e) {
    return [];
  }
}

function saveStudents(list) {
  localStorage.setItem(KEY_STUDENTS, JSON.stringify(list));
}

function esc(t) {
  return String(t || "")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

function render(list) {
  const countEl = document.getElementById("totalCount");
  const tbody = document.getElementById("tableBody");
  if (countEl) countEl.textContent = list.length;
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-400">No candidates found.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(function(s) {
    return '<tr class="hover:bg-slate-900/50">' +
      '<td class="p-4"><span class="px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-mono text-xs font-bold">' + esc(s.id) + '</span><div class="text-[11px] text-slate-400 mt-1">' + esc(s.timestamp) + '</div></td>' +
      '<td class="p-4"><div class="font-bold text-white">' + esc(s.name) + '</div><div class="text-xs text-emerald-400">' + esc(s.mobile) + '</div><div class="text-xs text-slate-300">' + esc(s.email) + '</div></td>' +
      '<td class="p-4 text-xs text-slate-300">' + esc(s.purpose) + '</td>' +
      '<td class="p-4"><span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">' + esc(s.progress) + '</span></td>' +
      '<td class="p-4 text-xs"><div class="text-brand-gold font-semibold">' + esc(s.module) + '</div><div class="text-slate-400 mt-1">' + esc(s.remarks) + '</div></td>' +
      '<td class="p-4 text-center space-x-1"><button type="button" data-edit="' + esc(s.id) + '" class="edit-btn px-2.5 py-1 rounded bg-brand-gold text-brand-navy font-bold text-xs">Edit</button><button type="button" data-del="' + esc(s.id) + '" class="del-btn px-2.5 py-1 rounded bg-red-500/20 text-red-300 font-bold text-xs">Del</button></td>' +
      '</tr>';
  }).join("");
}

document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("adminLoginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const uEl = document.getElementById("adminUser");
      const pEl = document.getElementById("adminPass");
      const err = document.getElementById("loginErr");
      const u = uEl ? uEl.value.trim().toLowerCase() : "";
      const p = pEl ? pEl.value : "";

      if (u === ADMIN_USER && p === getPass()) {
        if (err) err.classList.add("hidden");
        const gate = document.getElementById("loginGate");
        const dash = document.getElementById("dashboardView");
        if (gate) gate.classList.add("hidden");
        if (dash) dash.classList.remove("hidden");
        render(getStudents());
      } else if (err) {
        err.textContent = "Invalid Username or Password.";
        err.classList.remove("hidden");
      }
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      const gate = document.getElementById("loginGate");
      const dash = document.getElementById("dashboardView");
      const pEl = document.getElementById("adminPass");
      if (dash) dash.classList.add("hidden");
      if (gate) gate.classList.remove("hidden");
      if (pEl) pEl.value = "";
    });
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", function() {
      const q = this.value.toLowerCase();
      render(getStudents().filter(function(s) {
        return (s.name + s.mobile + s.email + s.id).toLowerCase().includes(q);
      }));
    });
  }

  const addManualBtn = document.getElementById("addManualBtn");
  if (addManualBtn) {
    addManualBtn.addEventListener("click", function() {
      document.getElementById("modalTitle").textContent = "Add Candidate";
      document.getElementById("editId").value = "";
      document.getElementById("editName").value = "";
      document.getElementById("editMobile").value = "";
      document.getElementById("editEmail").value = "";
      document.getElementById("editProgress").value = "10%";
      document.getElementById("editModule").value = "Week 1: German Phonetics and Greetings";
      document.getElementById("editRemarks").value = "";
      document.getElementById("editModal").classList.remove("hidden");
    });
  }

  const tableBody = document.getElementById("tableBody");
  if (tableBody) {
    tableBody.addEventListener("click", function(e) {
      const eb = e.target.closest(".edit-btn");
      if (eb) {
        const s = getStudents().find(function(x) { return x.id === eb.getAttribute("data-edit"); });
        if (!s) return;
        document.getElementById("modalTitle").textContent = "Edit " + s.name;
        document.getElementById("editId").value = s.id;
        document.getElementById("editName").value = s.name;
        document.getElementById("editMobile").value = s.mobile;
        document.getElementById("editEmail").value = s.email;
        document.getElementById("editProgress").value = s.progress || "10%";
        document.getElementById("editModule").value = s.module || "";
        document.getElementById("editRemarks").value = s.remarks || "";
        document.getElementById("editModal").classList.remove("hidden");
      }

      const db = e.target.closest(".del-btn");
      if (db && confirm("Delete this candidate?")) {
        const list = getStudents().filter(function(x) { return x.id !== db.getAttribute("data-del"); });
        saveStudents(list);
        render(list);
      }
    });
  }

  const closeEditModal = document.getElementById("closeEditModal");
  if (closeEditModal) {
    closeEditModal.addEventListener("click", function() {
      document.getElementById("editModal").classList.add("hidden");
    });
  }

  const editForm = document.getElementById("editForm");
  if (editForm) {
    editForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const list = getStudents();
      const id = document.getElementById("editId").value;
      const entry = {
        id: id || ("DP-" + Math.floor(1000 + Math.random() * 9000)),
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        name: document.getElementById("editName").value.trim(),
        mobile: document.getElementById("editMobile").value.trim(),
        email: document.getElementById("editEmail").value.trim(),
        course: "German A1 (Rs 6,000 / 2 Mos)",
        timing: "05:00 PM - 06:00 PM (Mon-Fri)",
        purpose: "Goethe-Zertifikat A1",
        progress: document.getElementById("editProgress").value,
        module: document.getElementById("editModule").value.trim(),
        remarks: document.getElementById("editRemarks").value.trim()
      };
      const idx = list.findIndex(function(x) { return x.id === id; });
      if (idx !== -1) {
        entry.timestamp = list[idx].timestamp;
        entry.purpose = list[idx].purpose;
        list[idx] = entry;
      } else {
        list.unshift(entry);
      }
      saveStudents(list);
      render(list);
      document.getElementById("editModal").classList.add("hidden");
    });
  }

  const openPassBtn = document.getElementById("openPassBtn");
  if (openPassBtn) {
    openPassBtn.addEventListener("click", function() {
      document.getElementById("passMsg").classList.add("hidden");
      document.getElementById("passModal").classList.remove("hidden");
    });
  }

  const closePassModal = document.getElementById("closePassModal");
  if (closePassModal) {
    closePassModal.addEventListener("click", function() {
      document.getElementById("passModal").classList.add("hidden");
    });
  }

  const passForm = document.getElementById("passForm");
  if (passForm) {
    passForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const cur = document.getElementById("curPass").value;
      const np = document.getElementById("newPass").value;
      const cp = document.getElementById("cnfPass").value;
      const msg = document.getElementById("passMsg");

      if (cur !== getPass()) {
        msg.textContent = "Wrong current password.";
        msg.className = "text-xs p-2 rounded-lg bg-red-950 text-red-400 block";
        return;
      }
      if (np !== cp) {
        msg.textContent = "Passwords do not match.";
        msg.className = "text-xs p-2 rounded-lg bg-red-950 text-red-400 block";
        return;
      }

      localStorage.setItem(KEY_PASS, np);
      msg.textContent = "Password updated!";
      msg.className = "text-xs p-2 rounded-lg bg-emerald-950 text-emerald-400 block";
      setTimeout(function() {
        document.getElementById("passModal").classList.add("hidden");
      }, 900);
    });
  }

  const exportCsvBtn = document.getElementById("exportCsvBtn");
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", function() {
      const list = getStudents();
      if (!list.length) return alert("No records to export.");
      const headers = ["ID", "Date", "Name", "Mobile", "Email", "Purpose", "Progress", "Module", "Remarks"].join(",");
      const lines = [headers];
      for (let i = 0; i < list.length; i++) {
        const s = list[i];
        const cols = [s.id, s.timestamp, s.name, s.mobile, s.email, s.purpose, s.progress, s.module, s.remarks]
          .map(function(v) { return '"' + String(v || "").replace(/"/g, '""') + '"'; });
        lines.push(cols.join(","));
      }
      const csvOutput = lines.join("\r\n");
      const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "DeutschPulse_Candidates.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
});
