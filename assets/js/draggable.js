

// const sortable = new Draggable.Sortable(document.querySelectorAll('.myDragSection'), {
//     draggable: '.myDraggable',  
//     delay: {
//       mouse: 0,
//       touch: 100,
//       pointer: 150,
//     }
// });


const sortable = new Draggable.Sortable(document.querySelectorAll('.myDragSection'), {
    draggable: '.myDraggable',
    sortAnimation: {
        duration: 200,
        easingFunction: 'ease-in-out',
    },
    plugins: [Draggable.Plugins.SortAnimation]

});

sortable.on('sortable:start', (evt) => {
    evt.data.dragEvent.source.classList.remove('bg-white');
    evt.data.dragEvent.source.classList.add('bg-blue-200');

});

sortable.on('sortable:stop', async (evt) => {
    let originalElement = document.querySelector('.myDragSection').children[evt.oldIndex];
    originalElement.classList.remove('bg-blue-200');
    originalElement.classList.add('bg-white');

    const newOrder = await new Promise(resolve => {
        setTimeout(() => {
            const order = Array.from(document.querySelectorAll('.myDraggable'))
                .filter(item => item.id) 
                .reduce((order, item, index) => {
                    order[item.id] = index + 1;
                    return order;
                }, {});
            resolve(order);
        }, 100);
    });
    console.log(newOrder);

    try {
        const response = await fetch('/updateRecipes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOrder)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        window.location.reload();
        console.log('Order updated successfully');
    } catch (error) {
        console.error('There was a problem with the fetch operation: ' + error.message);
    }

});