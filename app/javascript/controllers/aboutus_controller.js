// counter_controller.js

import { Controller } from "@hotwired/stimulus"
// import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
export default class extends Controller {
    static targets = ["counter", "answer", "crossIcon"]
    connect() {
        this.counterTargets.forEach(target => {
            const targetValue = parseInt(target.getAttribute("data-aboutus-target-value"))
            const duration = 2500
            const increment = targetValue / (duration / 10)
            this.animateCounter(0, targetValue, increment, target)
        })
    }

    animateCounter(currentValue, targetValue, increment, target) {
        const interval = setInterval(() => {
            currentValue += increment
            target.textContent = Math.round(currentValue)

            if (currentValue >= targetValue) {
                clearInterval(interval)
                target.textContent = targetValue + "+";
            }
        }, 10)
    }
    toggleAnswer(event) {
        const id = event.target.dataset.id;
        const targetAnswer = this.answerTargets.find(answer => answer.id === `answer${id}`);
        const targetCrossIcon = this.crossIconTargets.find(icon => icon.dataset.id === id);

        if (targetAnswer) {
            this.answerTargets.forEach(answer => {
                if (answer !== targetAnswer) {
                    answer.classList.remove("answer-visible");
                    const otherCrossIcon = this.crossIconTargetForElement(answer);
                    if (otherCrossIcon) {
                        otherCrossIcon.classList.remove('opacity-0');
                    }
                }
            });
            targetAnswer.classList.toggle("answer-visible");
            // Toggle cross icon opacity
            targetCrossIcon.classList.toggle('opacity-0');
        }
        this.crossIconTargets.forEach(icon => {
            if (icon !== targetCrossIcon) {
                icon.classList.remove('opacity-0');
            }
        });
    }
    crossIconTargetForElement(element) {
        const id = element.dataset.id;
        return this.crossIconTargets.find(icon => icon.dataset.id === id);
    }
}






