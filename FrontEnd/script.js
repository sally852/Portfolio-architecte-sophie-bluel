document.getElementById("login-button").addEventListener("click", () => {
    window.location.href = "login.html"; 
})


// main page

let allProjects = [];
let categories = [];

let apiUrl = 'http://localhost:5678/api'

//fetching data
const fetchCategories = async () => {
    try {
      const response = await fetch(apiUrl + '/categories');
      if (!response.ok) throw new Error();
      
      categories = await response.json(); 
      console.log(categories);
      displayCategoryButtons(categories); 
      displayModalCategory(categories);
  
    } catch (error) {
      console.error('Error fetching categories :', error);
    }
};

const fetchProjects = async () => {
  try {
    const response = await fetch(apiUrl + '/works');

    if (!response.ok) throw new Error();

    allProjects = await response.json(); 
    console.log(allProjects);
    displayProjects(allProjects); 
    displayModalProjects(allProjects)

  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};


// display categories
const displayCategoryButtons = (categories) => {
  const buttonsContainer = document.getElementById('category-buttons');

  //button all
  const allButton = document.createElement('button');
  allButton.textContent = "All";
  allButton.classList.add("category-button", "active"); 
  allButton.addEventListener('click', () => {
    displayProjects(allProjects);
    setActiveButton(allButton); 
  });
  buttonsContainer.appendChild(allButton);

  //other buttons
  categories.forEach((category) => {
    const categoryButton = document.createElement('button');
    categoryButton.textContent = category.name;
    categoryButton.classList.add("category-button");
    categoryButton.addEventListener('click', () => {
      displayCategory(allProjects, category.id);
      setActiveButton(categoryButton);
    });
    buttonsContainer.appendChild(categoryButton);
  });
};
  
const setActiveButton = (activeButton) => {
    const buttons = document.querySelectorAll(".category-button");

    buttons.forEach((button) => {
    button.classList.remove("active"); 
    });

    activeButton.classList.add("active"); 
};
    

// display projets
const displayProjects = (projects) => {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = ''; 
  
  projects.forEach((project) => {
    const figure = document.createElement('figure'); 
    const img = document.createElement('img');
    img.src = project.imageUrl;
    img.alt = project.title; 
    figure.appendChild(img); 

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = project.title; 
    figure.appendChild(figcaption); 
    
    gallery.appendChild(figure);
  });
};


// display projects by category
const displayCategory = (projects, filterCategoryId) => {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = ''; 

  const filteredProjects = projects.filter((project) => project.categoryId == filterCategoryId);
  displayProjects(filteredProjects);
};


fetchCategories();
fetchProjects();






//login page

const modal = document.querySelector(".modal");
const modall = document.querySelector(".modall");
const overlay = document.querySelector(".overlay");
const openDeletePhotoBtn = document.querySelector(".btn-open");
const closeDeletePhotoBtn = document.querySelector(".btn-close");
const openAddPhotoBtn = document.querySelector(".btn-add");
const closeAddPhotoBtn = document.querySelector(".bttn-close");
const goBackBtn = document.querySelector(".btn-goback");
const editBtn = document.querySelector(".edit-btn");
const form = document.getElementById("ProjectForm");
const titleInput = document.getElementById("titleInput");
const confirmBtn = document.getElementById("confirmBtn");
const fileInput = document.getElementById("fileInput");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const preview = document.getElementById("preview");


//modal
const openDeletePhotoModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  fetchProjects();
};
const closeDeletePhotoModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
const openAddPhotoModal = function () {
  modall.classList.remove("hidden");
  overlay.classList.remove("hidden");
  modal.classList.add("hidden");
  preview.style.display = "none"; 
  document.getElementById('titleInput').value = '';
  categorySelect.value = '';
  confirmBtn.style.backgroundColor = '#A7A7A7';
};
const closeAddPhotoModal = function () {
  modall.classList.add("hidden");
  overlay.classList.add("hidden");
};
const goBack = function () {
  modall.classList.add("hidden");
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
const deleteimg = function () {
  img-container.classList.add("hidden");
};


// login
const token = localStorage.getItem('authToken'); 
if (token) {
  document.getElementById('login-button').style.display = 'none'; 
  document.getElementById('logout-button').style.display = 'block';
  document.getElementById('category-buttons').style.display = 'none'; 
  editBtn.style.display = 'block'

  openDeletePhotoBtn.addEventListener("click", openDeletePhotoModal);
  closeDeletePhotoBtn.addEventListener("click", closeDeletePhotoModal);
  overlay.addEventListener("click",closeDeletePhotoModal );
  openAddPhotoBtn.addEventListener("click", openAddPhotoModal);
  closeAddPhotoBtn.addEventListener("click", closeAddPhotoModal);
  overlay.addEventListener("click",closeAddPhotoModal);
  goBackBtn.addEventListener("click", goBack); 
  
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeDeletePhotoModal();
      closeAddPhotoModal();
    }
  });
}


//display projects on the modal
const displayModalProjects = (projects) => {
  const gallery = document.getElementById('delete-img');
  gallery.innerHTML = ''; 
  
  projects.forEach((project) => {
    const figure = document.createElement('figure'); 
    figure.classList.add("photo-container");
    figure.setAttribute("data-id", project.id);
    
    const img = document.createElement('img');
    img.classList.add("img-container");

    const deleteIcon = document.createElement('button');

    img.src = project.imageUrl;
    img.alt = project.title; 
     
    deleteIcon.textContent = "🗑"; 
    deleteIcon.classList.add("delete-btn");
    
    figure.appendChild(img); 
    figure.appendChild(deleteIcon);
    gallery.appendChild(figure);
  });
  addDeleteEvent();
};


//display categories on the modal
const displayModalCategory = (categories) => {
  const categorySelect = document.getElementById("categorySelect");
  
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id; 
    option.textContent = category.name;
    categorySelect.appendChild(option); 
  });
};



// delete project
const addDeleteEvent = () => {
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async (event) => {
      const figure = event.target.closest(".photo-container");
      const projectId = figure.getAttribute("data-id");

      const confirmation = confirm("Are you sure you want to delete this photo?");

      try {
        const response = await fetch(apiUrl + `/works/${projectId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          alert("Failed to delete! Please try again.");
          throw new Error("Failed to delete!");
        }

        figure.remove(); 
        alert("Photo deleted!");

        fetchProjects();

      } catch (error) {
        console.error("Erreur :", error);
      }
    });
  });
};


//files picker
addPhotoBtn.addEventListener("click", () => {
  fileInput.click(); 
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0]; 

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result; 
      preview.style.display = "block"; 
    };
    reader.readAsDataURL(file); 
  }
});


  

//add project
const getFormValues = () => ({
  file: fileInput.files[0],
  title: titleInput.value,
  categoryId: categorySelect.value
});

const checkFields = () => {
  const { file, title, categoryId } = getFormValues();

  if (file && title && categoryId) {
    confirmBtn.style.backgroundColor = '#1D6154';
  }

  if (file) {
    fileError.style.display = "none";
    document.getElementById('add-img').style.borderColor = ""; 
  }

  if (title) {
    titleError.style.display = "none";
    titleInput.style.borderColor = ""; 
  }
 
  if (categoryId) {
    categoryError.style.display = "none"; 
    categorySelect.style.borderColor = ""; 
  }
};

fileInput.addEventListener("change", checkFields);
titleInput.addEventListener('input', checkFields);
categorySelect.addEventListener("change", checkFields);


//FormData
confirmBtn.addEventListener("click", async () => {
  const { file, title, categoryId } = getFormValues();

  if (!file) {
    document.getElementById('add-img').style.border = "1px solid red";
    fileError.style.display = "block";
  }

  if (!title) {
    titleInput.style.border = "1px solid red";
    titleError.style.display = "block";
  } 

  if (!categoryId) {
    categorySelect.style.border = "1px solid red";
    categoryError.style.display = "block";  
  } 

  if (!file || !title || !categoryId) {
    return;
  }

  const formData = new FormData();
  formData.append("title", title);  
  formData.append("category", categoryId);  
  formData.append("image", file);  

  try {
    const response = await fetch(apiUrl + "/works", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`, 
      },
      body: formData, 
    });

    if (!response.ok) {
      alert("Failed to add the project!");
      throw new Error("Failed to add the project!");
    }

    const data = await response.json();
    console.log("added:", data);

    alert("correctly sent!");

    fetchProjects();

  } catch (error) {
    console.error(error);
  }

  modal.classList.add("hidden");
  modall.classList.add("hidden");
  overlay.classList.add("hidden");

});



// logout
document.getElementById('logout-button').addEventListener('click', () => {
  
  localStorage.removeItem('authToken');
  window.location.href = 'index.html';
})

