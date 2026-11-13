/* ==========================================================
   Musily, script
   Tout ce qui se règle est dans CONFIG.
   ========================================================== */

const CONFIG = {
  // Adresse du formulaire Formspree (voir README), du type "https://formspree.io/f/abcdwxyz"
  adresseFormulaire: "https://formspree.io/f/xwlopnwa",

  // Prix affiché sur le site, en euros par heure, APRÈS crédit d'impôt
  prix: 25,

  // E-mail de contact affiché en bas de page
  email: "musily.contact@gmail.com",
};

/* ---------- Prix et e-mail ---------- */

document.querySelectorAll(".js-prix").forEach((el) => { el.textContent = CONFIG.prix; });
document.querySelectorAll(".js-prix-plein").forEach((el) => { el.textContent = CONFIG.prix * 2; });
document.querySelectorAll(".js-email").forEach((el) => {
  el.textContent = CONFIG.email;
  el.href = "mailto:" + CONFIG.email;
});

/* ---------- Logo : la note à la place du "l" ---------- */

document.querySelectorAll(".logo").forEach((el) => {
  el.setAttribute("aria-label", "Musily");
  el.innerHTML = 'musi<svg class="logo__note" aria-hidden="true" viewBox="0 0 50 78">' +
    '<rect x="35" y="0" width="14" height="62"></rect>' +
    '<ellipse cx="25" cy="61" rx="25" ry="16" transform="rotate(-20 25 61)"></ellipse></svg>y';
});

/* ---------- Portée jouable (page d'accueil) ---------- */

const FREQUENCES = {
  do: 261.63, re: 293.66, mi: 329.63, fa: 349.23,
  sol: 392.0, la: 440.0, si: 493.88, do2: 523.25,
};

let audio = null;

function jouerNote(bouton) {
  const Contexte = window.AudioContext || window.webkitAudioContext;
  if (Contexte) {
    if (!audio) audio = new Contexte();
    if (audio.state === "suspended") audio.resume();
    const t = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "triangle";
    osc.frequency.value = FREQUENCES[bouton.dataset.note];
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + 0.9);
  }
  bouton.classList.remove("jouee");
  void bouton.offsetWidth; // relance l'animation
  bouton.classList.add("jouee");
}

document.querySelectorAll(".note").forEach((note) => {
  note.addEventListener("pointerdown", () => jouerNote(note));
  // clavier : Entrée ou Espace déclenchent un "click" sans pointerdown
  note.addEventListener("click", (e) => { if (e.detail === 0) jouerNote(note); });
});

/* ---------- Formulaire élève : textes selon "Mon enfant" / "Moi" ---------- */

document.querySelectorAll('input[name="pour_qui"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const cle = radio.value === "Moi" ? "moi" : "enfant";
    document.querySelectorAll("[data-enfant]").forEach((el) => {
      el.textContent = el.dataset[cle];
    });
  });
});

/* ---------- Grille des disponibilités ---------- */

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const CRENEAUX = [
  { nom: "matin", titre: "Matin", detail: "avant 12 h" },
  { nom: "après-midi", titre: "Après-midi", detail: "12 h à 17 h" },
  { nom: "soir", titre: "Soir", detail: "après 17 h" },
];

document.querySelectorAll(".js-dispos").forEach((zone) => {
  let html = "<table class='dispos'><thead><tr><td></td>";
  CRENEAUX.forEach((c) => { html += `<th scope="col">${c.titre}<small>${c.detail}</small></th>`; });
  html += "</tr></thead><tbody>";
  JOURS.forEach((jour) => {
    html += `<tr><th scope="row">${jour}</th>`;
    CRENEAUX.forEach((c) => {
      html += `<td><label><input type="checkbox" class="dispo" value="${jour} ${c.nom}"><span class="cache">${jour} ${c.nom}</span></label></td>`;
    });
    html += "</tr>";
  });
  zone.innerHTML = html + "</tbody></table>";
});

/* ---------- Champ "Autre instrument" ---------- */

document.querySelectorAll("select[data-autre]").forEach((liste) => {
  const bloc = document.getElementById(liste.dataset.autre);
  const champ = bloc.querySelector("input");
  liste.addEventListener("change", () => {
    const autre = liste.value === "Autre";
    bloc.hidden = !autre;
    champ.required = autre;
    if (autre) champ.focus();
  });
});

/* ---------- Envoi des formulaires ---------- */

document.querySelectorAll(".formulaire").forEach((formulaire) => {
  const message = formulaire.querySelector(".formulaire__message");
  const bouton = formulaire.querySelector("button[type=submit]");

  formulaire.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    if (!formulaire.checkValidity()) {
      formulaire.reportValidity();
      return;
    }

    // les cases cochées de la grille sont regroupées dans un seul champ
    const champDispos = formulaire.querySelector('input[name="disponibilites"]');
    if (champDispos) {
      const cochees = [...formulaire.querySelectorAll(".dispo:checked")].map((c) => c.value);
      champDispos.value = cochees.join(", ");
    }

    if (!CONFIG.adresseFormulaire) {
      message.textContent = "Le formulaire n'est pas encore branché : renseignez adresseFormulaire dans script.js.";
      return;
    }

    const texteBouton = bouton.textContent;
    bouton.disabled = true;
    bouton.textContent = "Envoi en cours";

    try {
      const reponse = await fetch(CONFIG.adresseFormulaire, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(formulaire),
      });
      if (!reponse.ok) throw new Error("Réponse " + reponse.status);
      afficherConfirmation(formulaire);
    } catch (erreur) {
      bouton.disabled = false;
      bouton.textContent = texteBouton;
      message.textContent = "L'envoi n'a pas fonctionné. Réessayez, ou écrivez-nous à " + CONFIG.email + ".";
    }
  });
});

function afficherConfirmation(formulaire) {
  const prof = formulaire.dataset.type === "prof";
  const bloc = document.createElement("div");
  bloc.className = "confirmation";
  bloc.setAttribute("role", "status");
  bloc.innerHTML = prof
    ? "<h3>Profil envoyé</h3><p>Merci. On vous recontacte par e-mail dès qu'on a des élèves dans votre secteur.</p>"
    : "<h3>Demande envoyée</h3><p>Merci. On vous écrit dès qu'un professeur est disponible près de chez vous.</p>";
  bloc.innerHTML += '<a href="index.html">Retour à l\'accueil</a>';
  formulaire.replaceChildren(bloc);
  bloc.scrollIntoView({ block: "center", behavior: "smooth" });
}
