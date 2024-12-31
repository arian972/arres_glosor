isOneCharacterDifferent;
display_wrong_answer;

function display_new(not_use="") {

    let randomIndex = Math.floor(Math.random() * translations.length);
    let randomObject = translations[randomIndex];;

    if (translations.length > 1) {
        do {
            randomIndex = Math.floor(Math.random() * translations.length);
            randomObject = translations[randomIndex];
        } while (randomObject[answer_language] === not_use);
    }


    document.querySelector('#word-field').value = randomObject[display_language];
    document.querySelector('#word-field').setAttribute('data-glosa-index', randomIndex);
}

function submit_answer() {
    const answer = document.querySelector('#answer-field').value.trim();
    const index = document.querySelector('#word-field').getAttribute('data-glosa-index')
    const correct_answer = translations[index][answer_language];

    document.querySelectorAll('.feedback_glosa_answer_frame').forEach((element) => {
        element.remove();
    });

    if (!answer) {
        wrong_answers.add(answer);
        display_wrong_answer(correct_answer)

        const all_translations_index = all_translations.findIndex((dict) => {
            return dict[answer_language] === correct_answer;
        });

        all_translations[all_translations_index]["answer_state"] = "incorrect"

        display_new(correct_answer)
    }

    else if (answer === correct_answer) {
        display_correct_answer()

        const all_translations_index = all_translations.findIndex((dict) => {
            return dict[answer_language] === correct_answer;
        });

        if (!("answer_state" in all_translations[all_translations_index])) {
            all_translations[all_translations_index]["answer_state"] = "correct"
        }

        translations.splice(index, 1);

        if (translations.length > 0) {
            display_new()
        } else {
            display_results()
        }

    }

    else if (isOneCharacterDifferent(answer, correct_answer)) {
        wrong_answers.add(correct_answer);
        display_semi_correct_answer(answer)

        const all_translations_index = all_translations.findIndex((dict) => {
            return dict[answer_language] === correct_answer;
        });

        if (all_translations[all_translations_index]["answer_state"] !== "incorrect") {
            all_translations[all_translations_index]["answer_state"] = "semi_correct"
        }

    }



    else {
        wrong_answers.add(correct_answer);
        display_wrong_answer(correct_answer, entered=answer)

        const all_translations_index = all_translations.findIndex((dict) => {
            return dict[answer_language] === correct_answer;
        });

        all_translations[all_translations_index]["answer_state"] = "incorrect"

        display_new(correct_answer)
    }

    const answerField = document.querySelector('#answer-field');
    if (answerField) {
        answerField.value = "";
        answerField.focus();
    }
}

function display_results() {
    const display_frame = document.querySelector('#display-frame')
    display_frame.innerHTML = '';

    const num_wrong_answers = wrong_answers.size
    const num_right_answers = num_glosor - num_wrong_answers

    const answerDisplayFrame = document.createElement('div');
    answerDisplayFrame.classList.add('answer-display-frame');
    answerDisplayFrame.innerHTML = `Rätta svar: <b>${num_right_answers} / ${num_glosor}</b>`;

    const answer_glosa_grid = document.createElement('div');
    answer_glosa_grid.classList.add('grid-container-3');

    const glosa_element1 = document.createElement('div');
    glosa_element1.classList.add("answer-display-glosa-heading", "border-t-l-8px");
    glosa_element1.innerHTML = display_language_specific;

    const glosa_element2 = document.createElement('div');
    glosa_element2.classList.add("answer-display-glosa-heading", "border-t-r-8px");
    glosa_element2.innerHTML = answer_language_specific;

    answer_glosa_grid.appendChild(glosa_element1);
    answer_glosa_grid.appendChild(glosa_element2);


    for (let index in all_translations) {
        const glosa_element1 = document.createElement('div');
        glosa_element1.classList.add(`answer-display-glosa-${all_translations[index]["answer_state"]}`);
        glosa_element1.innerHTML = all_translations[index][display_language];

        const glosa_element2 = document.createElement('div');
        glosa_element2.classList.add(`answer-display-glosa-${all_translations[index]["answer_state"]}`);
        glosa_element2.innerHTML = all_translations[index][answer_language];

        if (index == all_translations.length - 1) {
            glosa_element1.classList.add("border-b-l-8px");
            glosa_element2.classList.add("border-b-r-8px");
        }

        answer_glosa_grid.appendChild(glosa_element1);
        answer_glosa_grid.appendChild(glosa_element2);
    }

    const button = document.createElement('button');
    button.id = 'play-again-button'
    button.classList.add('button-play-again');
    button.textContent = 'Spela igen';

    display_frame.appendChild(answerDisplayFrame);
    display_frame.appendChild(answer_glosa_grid);
    display_frame.appendChild(button);

    document.querySelector('#play-again-button').addEventListener('click', play_again);

}

function isOneCharacterDifferent(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;

    if (Math.abs(len1 - len2) > 1) {
        return false;
    }

    let differenceCount = 0;
    let i = 0, j = 0;

    while (i < len1 && j < len2) {
        if (str1[i] !== str2[j]) {
            differenceCount++;
            if (differenceCount > 1) {
                return false;
            }

            if (len1 > len2) {
                i++;
            } else if (len1 < len2) {
                j++;
            } else {
                i++;
                j++;
            }
        } else {
            i++;
            j++;
        }
    }

    if (i < len1 || j < len2) {
        differenceCount++;
    }

    return differenceCount === 1;
}


function display_wrong_answer(correct_answer, entered="") {

    const div = document.createElement("div");
    div.classList.add("feedback_glosa_answer_frame", "answer-display-glosa-incorrect", 'animate-fade-in');

    const p = document.createElement("p");

    if (entered) {
        p.innerHTML = `Fel! &nbsp;&nbsp;Du svarade: <b>${entered}</b> &nbsp;&nbsp;Rätt svar: <b>${correct_answer}</b>`;
    } else {
        p.innerHTML = `Fel! Rätt svar: <b>${correct_answer}</b>`;
    }

    div.appendChild(p);
    document.querySelector('#display-frame').prepend(div);

}


function display_correct_answer() {
    const div = document.createElement("div");
    div.classList.add("feedback_glosa_answer_frame", "answer-display-glosa-correct", 'animate-fade-in');

    const p = document.createElement("p");
    p.innerHTML = "Rätt svar!";

    div.appendChild(p);
    document.querySelector('#display-frame').prepend(div);}


function display_semi_correct_answer(entered) {
    const div = document.createElement("div");
    div.classList.add("feedback_glosa_answer_frame", "answer-display-glosa-semi_correct", 'animate-fade-in');

    const p = document.createElement("p");
    p.innerHTML = `Mycket nära - försök igen! &nbsp;&nbsp;Du svarade: <b>${entered}</b>`;

    div.appendChild(p);
    document.querySelector('#display-frame').prepend(div);
}



const num_glosor = translations.length
const wrong_answers = new Set();
const all_translations = [...translations]

display_new()


