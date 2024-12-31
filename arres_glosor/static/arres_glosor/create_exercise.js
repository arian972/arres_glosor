document.addEventListener('click', function(event) {
    if (event.target.classList.contains('dropdown-item1')) {
        document.querySelector('#input-language1').value = event.target.textContent;
        document.querySelector('.dropdown-content1').classList.remove('show');
        setTimeout(() => document.querySelector('.dropdown-content1').classList.add('none'), 100);
    }

    else if (event.target.classList.contains('dropdown-item2')) {
        document.querySelector('#input-language2').value = event.target.textContent;
        document.querySelector('.dropdown-content2').classList.remove('show');
        setTimeout(() => document.querySelector('.dropdown-content2').classList.add('none'), 100);
    }

    else {
        if (event.target.id !== 'dropdown-button1') {
            document.querySelector('.dropdown-content1').classList.remove('show');
            setTimeout(() => document.querySelector('.dropdown-content1').classList.add('none'), 100);
        }

        if (event.target.id !== 'dropdown-button2') {
            document.querySelector('.dropdown-content2').classList.remove('show');
            setTimeout(() => document.querySelector('.dropdown-content2').classList.add('none'), 100);
        }


    }
});

document.querySelector('#dropdown-button1').addEventListener('click', function() {
    const dropdown = document.querySelector('.dropdown-content1');

    if (dropdown.classList.contains('none')) {
        dropdown.classList.remove('none');
        setTimeout(() => dropdown.classList.add('show'), 10);
    } else {
        dropdown.classList.remove('show');
        setTimeout(() => dropdown.classList.add('none'), 100);
    }

});

document.querySelector('#dropdown-button2').addEventListener('click', function() {
    const dropdown = document.querySelector('.dropdown-content2');

    if (dropdown.classList.contains('none')) {
        dropdown.classList.remove('none');
        setTimeout(() => dropdown.classList.add('show'), 10);
    } else {
        dropdown.classList.remove('show');
        setTimeout(() => dropdown.classList.add('none'), 100);
    }
});

function create_exercise() {
    document.querySelectorAll('.warning-message1').forEach(element => element.remove());

    const name = document.querySelector('#input-exercise-name').value
    const language1 = document.querySelector('#input-language1').value
    const language2 = document.querySelector('#input-language2').value

    const csrfToken = document.querySelector('#csrf-token').value;

    if (!name) {
        const parentDiv = document.querySelector('#input-exercise-name').parentElement.parentElement;

        let warningElement = document.createElement('div');
        warningElement.textContent = 'Detta fält får inte vara tomt!';
        warningElement.classList.add('warning-message1', 'input-exercise-name-size');


        parentDiv.appendChild(warningElement);
    }

    else if (!language1 || !language2) {
        if (!language1) {
            const parentDiv = document.querySelector('#input-language1').parentElement.parentElement;

            let warningElement = document.createElement('div');
            warningElement.textContent = 'Detta fält får inte vara tomt!';
            warningElement.classList.add('warning-message1', 'input-width1');
            const computedStyle = window.getComputedStyle(document.querySelector('#input-language1'));
            const currentWidth = parseFloat(computedStyle.width); // Convert "300px" to a number (e.g., 300)
            const newWidth = currentWidth + 50;
            warningElement.style.width = `${newWidth}px`;

            parentDiv.appendChild(warningElement);
        }

        if (!language2) {
            const parentDiv = document.querySelector('#input-language2').parentElement.parentElement;

            let warningElement = document.createElement('div');
            warningElement.textContent = 'Detta fält får inte vara tomt!';
            warningElement.classList.add('warning-message1', 'input-width1');
            const computedStyle = window.getComputedStyle(document.querySelector('#input-language2'));
            const currentWidth = parseFloat(computedStyle.width);
            const newWidth = currentWidth + 50;
            warningElement.style.width = `${newWidth}px`;


            parentDiv.appendChild(warningElement);
        }
    }

    else {
        const data = {
            'exercise_name': name,
            'language1': language1,
            'language2': language2
        };

        fetch('/skapa', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            next_id = data.next_id;

            window.location.href = `/edit/id=${next_id}`;
        })
    }
}


document.querySelector('#create-button').addEventListener('click', function() {
    create_exercise()
});

