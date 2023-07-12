//gestion du form ajout d'ingredients

// Pass single element
// const element = document.getElementById('ingredientName')
// var choices = new Choices(element, {
//     allowHTML: true
// });

//initialiser le select avec choices.js
function choicesLaunch(elem) {
    new Choices(elem, {
        allowHTML: true
    });
}



document.getElementById('ingredientForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};

    // Convertir FormData en objet JSON
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    try {
        const response = await fetch('/addIngredient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData.error
        }

        const responseData = await response.json();

        //setter la valeur du nouvel ingrédient dans l'input
        choices.setChoices([{ value: responseData.id, label: responseData.name, selected: true }], 'value', 'label', false);

        let newOption = {
            value: responseData.id,
            label: responseData.name,
            selected: false
        };


        // Créez un nouvel objet groupe
        let newGroup = {
            label: "nouveau",
            id: 1, // vous pouvez attribuer un id unique à votre groupe
            choices: [newOption]
        };

        // Ajoutez le groupe et l'option via Choices.js
        choices.setChoices([newGroup], 'value', 'label', false);

        //afficher le succes dans une alert et fermer la modal
        alert(responseData.message);
        document.getElementById('closeModalButton').click();

    } catch (error) {
        console.log(error);

        if (error.name) {
            document.getElementById('errorName').innerHTML = `<div class="absolute right-0 flex items-center pr-3 pointer-events-none top-10 ">
            <svg class="w-5 h-5 text-red-500" width="16" height="16" fill="currentColor" viewbox="0 0 16 16" aria-hidden="true">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
            </div>
            <p class="mt-2 text-red-500">${error.name}</p>`;
            document.getElementById('name').classList.remove('bg-gray-50');
            document.getElementById('name').classList.add('ring-2', 'ring-red-500', 'bg-red-100');
        }

        if (error.type) {
            document.getElementById('errorType').innerHTML = `<div class="absolute inset-y-0 right-0 flex items-center pr-8 pointer-events-none">
            <svg class="w-4 h-4 text-red-500" width="16" height="16" fill="currentColor" viewbox="0 0 16 16" aria-hidden="true">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
            </div>
            <p class="mt-2 text-sm text-red-600">${error.type}</p>`
            document.getElementById('type').classList.remove('bg-gray-50');
            document.getElementById('type').classList.add('ring-2', 'ring-red-500', 'bg-red-100');
        }

        if (error.price) {
            document.getElementById('errorPrice').innerHTML = `<div class="absolute right-0 flex items-center pr-3 pointer-events-none top-10 ">
            <svg class="w-5 h-5 text-red-500" width="16" height="16" fill="currentColor" viewbox="0 0 16 16" aria-hidden="true">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
            </div>
            <p class="mt-2 text-red-500">${error.price}</p>`

            document.getElementById('price').classList.remove('bg-gray-50');
            document.getElementById('price').classList.add('ring-2', 'ring-red-500', 'bg-red-100');
        }

        if (error.unit_mesure) {
            document.getElementById('errorUM').innerHTML = `<div class="absolute inset-y-0 right-0 flex items-center pr-8 pointer-events-none">
            <svg class="w-4 h-4 text-red-500" width="16" height="16" fill="currentColor" viewbox="0 0 16 16" aria-hidden="true">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
            </div>`
            document.getElementById('errorUM2').innerHTML = `<p class="mt-2 text-sm text-red-600">${error.unit_mesure}</p>`
        }
    }

});


let idCount = 0
//fonction creation de ligne d'input pour les ingredients
function createIngredientInput(i) {
    idCount++

    // Crée une nouvelle div
    let newDiv = document.createElement("div");
    newDiv.className = "py-5 px-10 grid gap-4 my-4 grid-cols-2 md:grid-cols-4 md:gap-6  border-t  border-gray-800  ";

    let selectContainer = document.createElement("div");
    selectContainer.className = "relative col-span-2 md:col-span-2  mx-auto w-full"
    newDiv.appendChild(selectContainer);

    let newLabel = document.createElement("label");
    newLabel.htmlFor = `ingredientName${idCount}`;
    newLabel.textContent = "Nom de l'ingrédient";
    newLabel.className = "block mb-2 text-sm font-medium text-white";
    selectContainer.appendChild(newLabel);

    let selectWrapper = document.createElement("div");
    selectWrapper.className = "relative"
    selectContainer.appendChild(selectWrapper);

    let newSelect = document.createElement("select");
    newSelect.name = "ingredients[]";
    newSelect.id = `ingredientName${idCount}`;
    newSelect.className = " border border-gray-300 bg-gray-50  text-gray-900 text-sm rounded-lg  focus:outline-teal-700 block w-full p-2.5 transition-all ";
    newSelect.required = true;
    selectWrapper.appendChild(newSelect);

    let defaultCategory = document.createElement("optgroup")
    defaultCategory.label = ""
    newSelect.appendChild(defaultCategory);

    let defaultOption = document.createElement('option');
    defaultOption.selected = true;

    if (i >= 0) {
        defaultOption.value = post.ingredients[i]
        let ingredientName = null;
        for (let category in ingredients) {

            for (let j = 0; j < ingredients[category].length; j++) {

                if (ingredients[category][j].dataValues.id == post.ingredients[i]) {
                    ingredientName = ingredients[category][j].dataValues.name;
                    break;
                }
            }
            if (ingredientName) break;
        }

        defaultOption.textContent = ingredientName || "";
    }
    else {
        defaultOption.textContent = ""
    }
    defaultCategory.appendChild(defaultOption);


    for (let category in ingredients) {
        let optgroup = document.createElement('optgroup');
        optgroup.label = category;

        // Parcourir tous les ingrédients dans une catégorie spécifique
        for (let j = 0; j < ingredients[category].length; j++) {
            let option = document.createElement('option');
            option.value = ingredients[category][j].dataValues.id;
            option.textContent = ingredients[category][j].dataValues.name;
            optgroup.appendChild(option);
        }

        newSelect.appendChild(optgroup);
    }

    let quantityContainer = document.createElement('div');
    quantityContainer.className = "relative col-span-1  mx-auto w-full "
    newDiv.appendChild(quantityContainer);

    let label = document.createElement('label');
    label.setAttribute('for', `quantity${idCount}`);
    label.textContent = "Quantitée";
    label.className = "block mb-2 text-sm font-medium text-teal-50";
    quantityContainer.appendChild(label);

    let input = document.createElement('input');
    input.type = "number";
    input.name = "quantity[]";
    input.id = `quantity${idCount}`;  // Remplacez 'counter' par le nombre approprié
    input.className = "border w-full border-gray-300  bg-gray-50  text-gray-900 text-sm rounded-lg  focus:outline-teal-700 block  p-2.5 transition-all";  // Vous devrez gérer la logique des erreurs en JavaScript

    input.min = 0.01;
    input.step = 0.01;
    input.required = true;

    if (i >= 0) {
        input.value = post.quantity[i]
    }
    else {
        input.value = 0;
    }
    quantityContainer.appendChild(input);

    var deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Supprimer";
    deleteBtn.className = " col-span-1 mt-6 md:mx-7  py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-red-200 font-semibold text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800 "
    deleteBtn.addEventListener("click", function () {
        this.parentNode.remove();
    });
    newDiv.appendChild(deleteBtn);

    document.getElementById('ingredientStepInputs').appendChild(newDiv)

    choicesLaunch(newSelect)
}


//bouton pour ajouter une ligne d'inputs d'ingrédient
document.getElementById('createInputBtn').addEventListener('click', () => {
    createIngredientInput();
})

for (let i = 0; i < post.ingredients.length; i++) {
    createIngredientInput(i);

}