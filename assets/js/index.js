const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const galleryModal = document.querySelector(".galleryModal");
const modalContainer = document.querySelector(".modalContainer");
const modifier = document.querySelector(".modifier");
const faXmark = document.querySelector(".fa-xmark");
const modalBtnAdd = document.querySelector(".modalContents button");
const modalAdd = document.querySelector(".modalAdd");
const arrowL = document.querySelector(".fa-arrow-left");
const xmark = document.querySelector('.modalAdd .fa-xmark');
const validationBtn = document.querySelector('#validationBtn');
const modalContents = document.querySelector('.modalContents');
const imgAddLoad = document.querySelector('.containerAddFile img');
const inputTypeFile = document.querySelector('.containerAddFile input');
const form = document.querySelector('.modalAdd form');
const errorMessage = document.querySelector('#error-message');

const token = window.sessionStorage.getItem("token");

// Fonction pour obtenir les travaux depuis l'API
async function catchWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  return await response.json();
}

// Fonction pour afficher les travaux dans la galerie principale
async function displayWorks() {
  gallery.innerHTML = "";
  const works = await catchWorks();
  works.forEach((work) => {
    createWork(work);
  });
}

// Fonction pour créer les éléments HTML et les ajouter à la galerie
function createWork(work) {
  const figure = document.createElement('figure');
  figure.dataset.id = work.id;
  const img = document.createElement('img');
  const figcaption = document.createElement('figcaption');
  img.src = work.imageUrl;
  
  figcaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

// Fonction pour obtenir les catégories depuis l'API
async function getCategories() {
  const responseCategories = await fetch("http://localhost:5678/api/categories");
  return await responseCategories.json();
}

// Fonction pour afficher les boutons de catégories
// Fonction pour afficher les boutons de catégories
async function displayBtnCategories() {
  const categories = await getCategories();

  // Ajouter le bouton "Tous" en premier
  const allBtn = document.createElement("button");
  allBtn.id = 0;
  allBtn.textContent = "Tous";
  filters.appendChild(allBtn);

  // Ajouter les autres boutons de catégories
  categories.forEach(categorie => {
    const btn = document.createElement("button");
    btn.id = categorie.id;
    btn.textContent = categorie.name;
    filters.appendChild(btn);
  });
}

// async function displayBtnCategories() {
//   const categories = await getCategories();
//   categories.unshift({ id: 0, name: "Tous" });
//   categories.forEach(categorie => {
//     const btn = document.createElement("button");
//     btn.id = categorie.id;
//     btn.textContent = categorie.name;
//     filters.appendChild(btn);
//   });
// }
// displayBtnCategories();

// // Fonction pour filtrer les travaux par catégorie
// async function filterCategories() {
//   const projet = await catchWorks();
//   const buttons = document.querySelectorAll(".filters button");
  
//     buttons.addEventListener("click", (e) => {
//       const clickedButton = e.target;
//       if (clickedButton.tagName ==="BUTTON"){
     
//         const btnId = e.target.id;
//         gallery.innerHTML = "";
//         if (btnId !== "0") {
//           const projetFiltersTri = projet.filter(work => work.categoryId == btnId);
//           projetFiltersTri.forEach(work => {
//             createWork(work);
//           });
//         } else {
//           displayWorks();
//         }
//       }
//       }
//     )};


async function filterCategories() {
  const projet = await catchWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach(button => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const projetFiltersTri = projet.filter(work => work.categoryId == btnId);
        projetFiltersTri.forEach(work => {
          createWork(work);
        });
      } else {
        displayWorks();
      }
    });
  });
}
// Fonction de connexion et vérification de statut de connexion
function checkLoginStatus() {
  const loginButton = document.querySelector("#login-button");
  const topMenu = document.querySelector(".topMenu");
  const token = window.sessionStorage.getItem("token");
  if (token) {
    loginButton.textContent = "Logout";
    loginButton.href = "#";
    loginButton.addEventListener("click", handleLogout);
    modifier.style.display = "block";
    topMenu.style.display = "flex";
   filters.style.display = "none";

  } else {

    loginButton.textContent = "Login";
    loginButton.href = "./login.html";
    loginButton.removeEventListener("click", handleLogout);
    modifier.style.display = "none";
    topMenu.style.display = "none";
    filters.style.display = "block";
   
    filterCategories();
  }
}

function handleLogout(e) {
  e.preventDefault();
  logout();
}

function logout() {
  window.sessionStorage.removeItem("token");
  checkLoginStatus();
}

// Fonction pour afficher les travaux dans la modale
async function displayGalleryModal() {
  galleryModal.innerHTML = "";
  const works = await catchWorks();
  works.forEach(work => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const trash = document.createElement('i');

    figure.dataset.id = work.id;
    trash.classList.add('fa-solid', 'fa-trash');
    trash.dataset.id = work.id;
    img.src = work.imageUrl;

    // Ajoutez un gestionnaire d'événements click à l'icône de suppression
    trash.addEventListener('click', async function() {
      await deleteWork(work.id); // Appele une fonction pour supprimer le travail
      figure.remove(); // Suppression l'élément figure du DOM
      removeWorkFromGallery(work.id); // Suppression également l'élément de la galerie principale
    });

    figure.appendChild(trash);
    figure.appendChild(img);
    galleryModal.appendChild(figure);
  });
}

// Fonction pour supprimer un travail de la source de données
async function deleteWork(id) {
  try {
    const token = window.sessionStorage.getItem("token"); // Récupérer le jeton d'authentification
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // Ajouter le jeton à l'en-tête de la requête
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du travail');
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Fonction pour supprimer un travail de la galerie principale
function removeWorkFromGallery(id) {
  const workFigure = gallery.querySelector(`figure[data-id='${id}']`);
  if (workFigure) {
    workFigure.remove();
  }
}


// Réinitialiser la modale d'ajout
function resetAddModal() {
  form.reset(); // Réinitialiser le formulaire HTML
  imgAddLoad.src = ''; // Réinitialiser l'image d'aperçu
  imgAddLoad.style.display = 'none'; // Masquer l'image d'aperçu
  document.querySelector('.containerAddFile label').style.display = 'block';
  document.querySelector('.containerAddFile .fa-image').style.display = 'block';
  document.querySelector('.containerAddFile p').style.display = 'block';
}

// Réinitialiser la modalContents
function resetModalContents() {
  // Ajoutez ici toute réinitialisation nécessaire pour modalContents
}

// Affichage de la modale et gestion de sa fermeture
modifier.addEventListener("click", () => {
  resetModalContents(); // Réinitialiser la modalContents avant de l'afficher
  modalAdd.style.display = "none"; // Assurez-vous que modalAdd est masqué
  modalContents.style.display = "flex"; // Afficher modalContents
  modalContainer.style.display = "flex";
});

faXmark.addEventListener("click", () => {
  modalContainer.style.display = "none";
});

modalContainer.addEventListener("click", (e) => {
  if (e.target.className === "modalContainer") {
    modalContainer.style.display = "none";
  }
});

// Affichage de la deuxième modale
function displayAddModal () {
  modalBtnAdd.addEventListener("click", () => {
    resetAddModal(); // Réinitialiser modalAdd avant de l'afficher
    modalAdd.style.display = "flex";
    modalContents.style.display = "none";
  });
  arrowL.addEventListener("click", () => {
    modalAdd.style.display = "none";
    modalContents.style.display = "flex";
  });
  xmark.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });
}
displayAddModal();

// Prévisualisation de l'image
inputTypeFile.addEventListener("change", () => {
  const file = inputTypeFile.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imgAddLoad.src = e.target.result;
      imgAddLoad.style.display = 'flex';
      document.querySelector('.containerAddFile label').style.display = 'none';
      document.querySelector('.containerAddFile .fa-image').style.display = 'none';
      document.querySelector('.containerAddFile p').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

// Listing des catégories dans le formulaire
async function displayCatImg() {
  const select = document.querySelector("#category");
  const categories = await getCategories();
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
displayCatImg();

// Ajout d'un nouveau travail
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMessage.style.display = 'none'; // Masquer le message d'erreur au début
  errorMessage.textContent = ''; // Réinitialiser le texte du message d'erreur


  const formData = new FormData(form);
  // Vérification des champs obligatoires
  const title = formData.get('title');
  const category = formData.get('category');
  const image = formData.get('image');

  if (!title || !category || !image) {
    errorMessage.textContent = 'Veuillez remplir tous les champs obligatoires.';
    errorMessage.style.display = 'block';
    return;
  }


  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (response.ok) {
      const newWork = await response.json();
      createWork(newWork); // ajout de nouveau travail à la galerie principale
      displayGalleryModal(); // mise à jour la galerie modale
      modalContainer.style.display = "none";
    } else {
      console.error('Erreur lors de l\'ajout');
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
});

// initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  displayWorks();
  displayBtnCategories();
  filterCategories();
  displayGalleryModal();
});
// verification du formulaire
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Empêche l'envoi du formulaire

  // Récupérer les valeurs des champs
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Vérifier si tous les champs sont remplis
  if (name === '' || email === '' || message === '') {
      // Afficher le message d'erreur et cacher le message de succès
      document.getElementById('errorMessage').style.display = 'block';
      document.getElementById('successMessage').style.display = 'none';
  } else {
      // Cacher le message d'erreur et afficher le message de succès
      document.getElementById('errorMessage').style.display = 'none';
      document.getElementById('successMessage').style.display = 'block';
  }
});





