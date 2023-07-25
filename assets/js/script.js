//gestion du form ajout d'ingredients



document.getElementById('ingredientForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = {};
    let url = this.getAttribute('action');
    
   
    let method = url!= null ? 'PUT' : 'POST';
   
    // Convertir FormData en objet JSON
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    try {
        const response = await fetch(url || '/addIngredient', {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData.error
        }
        
        window.location.reload();
        
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

document.querySelectorAll('.myEditBtn').forEach(function (button) {
    button.addEventListener('click', function (){
        let ingredient = JSON.parse(this.getAttribute('dataIngredient')).dataValues;
        console.log(ingredient);
        document.getElementById('modalTitle').innerHTML = "Modifier "+ capitalize(ingredient.name) 
        document.getElementById('name').value = capitalize(ingredient.name) 
        document.getElementById('price').value = ingredient.price
        document.getElementById('type').value = ingredient.type
        document.getElementById('unit_mesure').value = ingredient.unit_mesure
        document.getElementById('ingredientForm').setAttribute('action', '/updateIngredient/' + ingredient.id )
    })
})


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

