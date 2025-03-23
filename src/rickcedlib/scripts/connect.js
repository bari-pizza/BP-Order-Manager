// script for Connect assignments that are just MC and have unlimited tries
(function () {
    let shouldContinue = true;
    function solveQuestion() {
        const options = document.querySelectorAll('.answer-wrap--mc'); // Replace with the actual selector

        async function clickAndWait(element, timeout = 400) {
            await element.click();
            await new Promise((resolve) => setTimeout(resolve, timeout));
        }

        async function tryAllOptions() {
            for (let i = 0; i < options.length; i++) {
                await clickAndWait(options[i]);
                const checkButton = document.querySelector('.button--check-my-work'); // Replace with the actual selector
                await clickAndWait(checkButton);

                // Check if the answer is correct (you'll need to adapt this part)
                const isCorrect = document.querySelector('.answer--is-correct'); // Replace with the actual selector
                const isIncorrect = document.querySelector('.answer--is-incorrect'); // Replace with the actual selector

                if (isCorrect) {
                    console.log('Correct answer found!');
                    const nextQuestionButton = document.querySelector('.footer__link--next ');
                    await clickAndWait(nextQuestionButton, 2000);
                    if (shouldContinue) {
                        solveQuestion();
                    } else {
                        return;
                    }
                } else if (isIncorrect) {
                    console.log('Incorrect answer, trying next option.');
                    const returnButton = document.querySelector('.button--return-to-question'); // Replace with the actual selector
                    await clickAndWait(returnButton);
                } else {
                    console.log('Answer not found, trying next option.');
                }
            }
        }

        tryAllOptions();
    }

    // Run the solveQuestion function when a specific key is pressed (e.g., 's')
    document.addEventListener('keydown', function (event) {
        if (event.key === 's') {
            solveQuestion();
        } else if (event.key === 'q') {
            // quit the process
            shouldContinue = false;
        }
    });
})();
