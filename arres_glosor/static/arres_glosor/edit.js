function exercise_save(id) {
    document.querySelectorAll('.warning-message1').forEach(element => element.remove());

    const name = document.querySelector('#input-exercise_name').value
    const language1 = document.querySelector('#input-language1').value
    const language2 = document.querySelector('#input-language2').value
    const csrfToken = document.querySelector('#csrf-token').value;

    if (!name) {
        const parentDiv = document.querySelector('#input-exercise_name').parentElement;

        let warningElement = document.createElement('div');
        warningElement.textContent = 'Detta fält får inte vara tomt!';
        warningElement.classList.add('warning-message1', 'width-1-767px');

        parentDiv.appendChild(warningElement);

        return 1
    }

    else if (!language1) {
        const parentDiv = document.querySelector('#input-language1').parentElement;

        let warningElement = document.createElement('div');
        warningElement.textContent = 'Detta fält får inte vara tomt!';
        warningElement.classList.add('warning-message1', 'width-1-767px', 'font-size-1');

        parentDiv.appendChild(warningElement);

        return 1
    }

    else if (!language2) {
        const parentDiv = document.querySelector('#input-language2').parentElement;

        let warningElement = document.createElement('div');
        warningElement.textContent = 'Detta fält får inte vara tomt!';
        warningElement.classList.add('warning-message1', 'width-1-767px', 'font-size-1');

        parentDiv.appendChild(warningElement);

        return 1
    }

    const data = {
        'id': id,
        'exercise_name': name,
        'language1': language1,
        'language2': language2
    };

    fetch('/exercise_save', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data)

    })

    return 0

}

function exercise_add(id) {
    document.querySelectorAll('.warning-message1').forEach(element => element.remove());

    const glosa_language1 = document.querySelector('#glosa-language1').value
    const glosa_language2 = document.querySelector('#glosa-language2').value
    const csrfToken = document.querySelector('#csrf-token').value;

    if (!glosa_language1) {
        const parentDiv = document.querySelector('#glosa-language1').parentElement;

        let warningElement = document.createElement('div');
        warningElement.textContent = 'Detta fält får inte vara tomt!';
        warningElement.classList.add('warning-message1', 'input-width4');

        const firstInput = document.querySelector('#glosa-language2');

        parentDiv.insertBefore(warningElement, firstInput);
    }

    else if (!glosa_language2) {
        const parentDiv = document.querySelector('#glosa-language2').parentElement;

        let warningElement = document.createElement('div');
        warningElement.textContent = 'Detta fält får inte vara tomt!';
        warningElement.classList.add('warning-message1', 'input-width4');

        parentDiv.appendChild(warningElement);
    }

    else {
        const data = {
            'id': id,
            'glosa_language1': glosa_language1,
            'glosa_language2': glosa_language2,
        };

        fetch('/exercise_add', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data)
        })

        document.querySelector('#glosa-language1').value = ""
        document.querySelector('#glosa-language2').value = ""

        let container = document.querySelector('.grid-container-1');
        let index;

        if (container.children.length > 3) {
            index = parseInt(container.lastElementChild.getAttribute("data-index")) + 1;
        } else {
            index = 0;
            document.querySelector('#content-div').classList.remove('disappear-1');
        }

        // Create the grid items
        let gridItem1 = document.createElement('div');
        gridItem1.classList.add('grid-item-1', 'border-b-l-8px');
        gridItem1.textContent = glosa_language1; // Set text to language 1

        let gridItem2 = document.createElement('div');
        gridItem2.classList.add('grid-item-1', 'b-r-none');
        gridItem2.textContent = glosa_language2; // Set text to language 2

        // Create the delete button
        let deleteContainer = document.createElement('div');
        deleteContainer.classList.add('delete-translation-index', 'delete-translation', 'border-b-r-8px');
        deleteContainer.setAttribute('data-index', index);

        let deleteImage = document.createElement('img');
        deleteImage.classList.add('delete-translation-index');
        deleteImage.setAttribute('src', trashBinImageUrl);
        deleteImage.setAttribute('alt', 'Remove');
        deleteImage.setAttribute('data-index', index);

        deleteContainer.appendChild(deleteImage);

        const lastItem = container.lastElementChild;
        lastItem.classList.remove('border-b-r-8px');

        container.appendChild(gridItem1);
        container.appendChild(gridItem2);
        container.appendChild(deleteContainer);



    }



}

function exercise_delete(id) {
    document.querySelectorAll('#delete-message-div').forEach(element => element.remove());

    const deleteMessageDiv = document.createElement('div');
    deleteMessageDiv.id = 'delete-message-div';
    deleteMessageDiv.classList.add('delete-message1', 'center-items-column');

    const paragraph = document.createElement('p');
    paragraph.textContent = 'Vill du radera övningen?';

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('center-items-row', 'mb-1-5vh');

    const confirmButton = document.createElement('button');
    confirmButton.id = 'confirm-delete-button';
    confirmButton.type = 'button';
    confirmButton.classList.add('button5');
    confirmButton.textContent = 'Ja';

    const rejectButton = document.createElement('button');
    rejectButton.id = 'reject-delete-button';
    rejectButton.type = 'button';
    rejectButton.classList.add('button5');
    rejectButton.textContent = 'Nej';

    const anchor = document.createElement('a');
    anchor.href = '/';
    anchor.appendChild(confirmButton);

    buttonContainer.appendChild(anchor);
    buttonContainer.appendChild(rejectButton);

    deleteMessageDiv.appendChild(paragraph);
    deleteMessageDiv.appendChild(buttonContainer);

    const container = document.querySelector('#delete-button').parentElement;
    container.appendChild(deleteMessageDiv);

    document.querySelector('#confirm-delete-button').addEventListener('click', function() {
        const csrfToken = document.querySelector('#csrf-token').value;

        const data = {
            'id': id,
        };

        fetch('/exercise_delete', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data)
        })
    });

    document.querySelector('#reject-delete-button').addEventListener('click', function() {
        const deleteMessageDiv = document.querySelector('#delete-message-div')
        deleteMessageDiv.remove()
    });

}

function translation_delete(id, index) {
    const csrfToken = document.querySelector('#csrf-token').value;

    const data = {
        'id': id,
        'index': index
    };

    fetch('/translation_delete', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data)
    })

    document.querySelectorAll('.delete-translation').forEach(element => {
        let element_index = parseInt(element.getAttribute("data-index"));

        if (element_index > index) {
            element_index--;
            element.setAttribute("data-index", element_index);
        }
    });


}
