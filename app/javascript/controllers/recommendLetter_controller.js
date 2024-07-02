
import { Controller } from "@hotwired/stimulus";
export default class extends Controller {
  static targets = ["letterToggle","stepfrom", "previous", "next", "downloadbtn", "progress", "barpercentage","letterInput", "letterTag","photoDisplay", "uploadText", "deleteText","imgcontainerHider","downloadPDF", "recommendLetterCapture", "titleInput","removeclass","signatureCanvas", "signatureImage", "fileInput",'signcontainer',"defaultContent","customContent", "letterFormHide", 'letterEditorShow',"btnIndicaterleft","ckEditor", "ckEditorContent"];

  connect() {
    this.currentstepfrom = 1
    this.updateProgressBar()
    this.updateLetterField()
    this.signaturePad = new SignaturePad(this.signatureCanvasTarget);
    this.CKEditor();
  }

  displayLetter() {
    this.letterToggleTarget.classList.remove("hidden");
    this.letterToggleTarget.classList.remove("slide-out-left");
    this.letterToggleTarget.classList.add("slide-in-right");
    this.letterToggleTarget.classList.add("block");   
     document.body.style.overflow = "hidden";
  }
  hideLetter() {
    this.letterToggleTarget.classList.remove("block");
    this.letterToggleTarget.classList.remove("slide-in-right");
    this.letterToggleTarget.classList.add("slide-out-left");
    document.body.style.overflow = "visible";
  }
  

  defaultmode() {
    this.defaultContentTarget.classList.remove('hidden');
    this.customContentTarget.classList.add('hidden');
    this.letterFormHideTargets.forEach(element => {
      element.classList.remove('hidden')
    });
    this.letterEditorShowTargets.forEach(element => {
      element.classList.add('hidden');
    });
    this.btnIndicaterleftTarget.style.left = '2px';
  }

  letterdisplay() {
    this.customContentTarget.classList.remove('hidden');
    this.defaultContentTarget.classList.add('hidden');
    this.letterFormHideTargets.forEach(element => {
      element.classList.add('hidden')
    });
    this.letterEditorShowTargets.forEach(element => {
      element.classList.remove('hidden');
    });
    this.btnIndicaterleftTarget.style.left = 'calc(50% - 2px)';
  }

  next() {
    // Check if the next stepfrom exists
    if (this.currentstepfrom < this.stepfromTargets.length) {
      // Hide current stepfrom
      this.stepfromTargets.find(element => element.dataset.stepfromValue == this.currentstepfrom).classList.add('hidden')
      // Move to next stepfrom
      this.currentstepfrom += 1
      // Show next stepfrom
      this.stepfromTargets.find(element => element.dataset.stepfromValue == this.currentstepfrom).classList.remove('hidden')
    }

    // Show the "Previous" button if not on the first stepfrom
    if (this.currentstepfrom > 1) {
      this.previousTarget.classList.remove('hidden')
    }

    // Hide the "Next" button and show the "downloadbtn" button if on the last stepfrom
    if (this.currentstepfrom == this.stepfromTargets.length) {
      this.nextTarget.classList.add('hidden')
      this.downloadbtnTarget.classList.remove('hidden')
    }

    // Update progress bar and barpercentage
    this.updateProgressBar()
  }

  previous() {
    // Check if the previous stepfrom exists
    if (this.currentstepfrom > 1) {
      // Hide current stepfrom
      this.stepfromTargets.find(element => element.dataset.stepfromValue == this.currentstepfrom).classList.add('hidden')
      // Move to previous stepfrom
      this.currentstepfrom -= 1
      // Show previous stepfrom
      this.stepfromTargets.find(element => element.dataset.stepfromValue == this.currentstepfrom).classList.remove('hidden')
    } else {
      console.log("This is the first stepfrom.")
    }

    // Hide the "Previous" button if on the first stepfrom
    if (this.currentstepfrom == 1) {
      this.previousTarget.classList.add('hidden')
    }

    // Show the "Next" button and hide the "downloadbtn" button if not on the last stepfrom
    if (this.currentstepfrom < this.stepfromTargets.length) {
      this.nextTarget.classList.remove('hidden')
      this.downloadbtnTarget.classList.add('hidden')
    }

    // Update progress bar and barpercentage
    this.updateProgressBar()
  }
  updateProgressBar() {
    let roundedProgress;
  
    if (this.currentstepfrom === 1) {
      roundedProgress = 0;
    } else {
      const progress = (this.currentstepfrom / this.stepfromTargets.length) * 100;
      roundedProgress = Math.floor(progress / 10) * 10; // Round down to nearest 10%
    }
  
    this.progressTarget.style.width = `${roundedProgress}%`;
    this.barpercentageTarget.textContent = `${roundedProgress}%`;
  }
  
  
  updateLetterField() {
    this.letterInputTargets.forEach((inputElement) => {
        const letterTagElement1 = this.letterTagTargets.find(target => target.id === inputElement.id + 'Letter1');
        const letterTagElement2 = this.letterTagTargets.find(target => target.id === inputElement.id + 'Letter2');
        const letterTagElement3 = this.letterTagTargets.find(target => target.id === inputElement.id + 'Letter3');

        if (letterTagElement1) {
            inputElement.addEventListener('input', function() {
                const inputText = inputElement.value;
                if (letterTagElement1) {
                    letterTagElement1.textContent = inputText;
                }
                if (letterTagElement2) {
                    letterTagElement2.textContent = inputText;
                }
                if (letterTagElement3) {
                    letterTagElement3.textContent = inputText;
                }
            });
        }
    });
}


  

updatePhoto(event) {
  const file = event.target.files[0]
  const reader = new FileReader()

  reader.onload = () => {
    const imageDataUrl = reader.result
    this.photoDisplayTargets.forEach((display, index) => {
      display.src = imageDataUrl;
      if (index === 0) {
        display.classList.add('absolute', 'top-0');
      }
    });
    this.uploadTextTarget.classList.add("hidden")
    this.deleteTextTarget.classList.remove("hidden")
    this.imgcontainerHiderTarget.classList.remove("hidden")
    this.removeclassTargets[0].classList.add("grid");
    this.removeclassTargets[1].classList.add("w-fit");
  }
  reader.readAsDataURL(file)
}
deletePhoto() {
  const confirmed = confirm("Are you sure you want to delete the picture?");
  
  if (confirmed) {
    this.element.querySelector("#photoInput").value = "";
  
    // Update the first photo
    const firstPhoto = this.photoDisplayTargets[0];
    firstPhoto.src = 'data:image/svg+xml;charset=utf-8,<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 122.88 95.52"><title>upload-image</title><path d="M5.68,12.23H61.14a36.79,36.79,0,0,0-2.3,6.7H6.74V88.78h98.72V63.65a37.49,37.49,0,0,0,6.7-2.64V89.88a5.58,5.58,0,0,1-1.65,4,1.6,1.6,0,0,1-.3.26,5.48,5.48,0,0,1-3.73,1.4H5.64a5.61,5.61,0,0,1-4-1.66,5.68,5.68,0,0,1-1.65-4v-72a5.63,5.63,0,0,1,5.64-5.63ZM95.19,0A27.69,27.69,0,1,1,67.51,27.68,27.68,27.68,0,0,1,95.19,0Zm-4,41h8.07a2.91,2.91,0,0,0,2.91-2.9V28.91h5.12a2.4,2.4,0,0,0,2.06-1c1.07-1.61-.39-3.2-1.42-4.33C105,20.44,98.47,14.69,97,13a2.35,2.35,0,0,0-3.7,0C91.86,14.73,85,20.83,82.2,23.92c-1,1.07-2.14,2.54-1.14,4a2.41,2.41,0,0,0,2,1h5.15v9.23A2.91,2.91,0,0,0,91.17,41ZM29,31.78a8.1,8.1,0,1,1-8.09,8.09A8.09,8.09,0,0,1,29,31.78ZM63,66.51,69.68,55a37.3,37.3,0,0,0,19.66,9.61l7.07,18.2H16.16V76.63l6.74-.34,6.74-16.52L33,71.57H43.13L51.9,49,63,66.51Z"/></svg>';
    firstPhoto.classList.remove('absolute', 'top-0');
  
    // Reset the second photo
    const secondPhoto = this.photoDisplayTargets[1];
    secondPhoto.src = '';
    this.uploadTextTarget.classList.remove("hidden");
    this.deleteTextTarget.classList.add("hidden");
    this.imgcontainerHiderTarget.classList.add("hidden");
    this.removeclassTargets[0].classList.remove("grid");
    this.removeclassTargets[1].classList.remove("w-fit");
  }
}


  downloadPDF() {
    var element = this.recommendLetterCaptureTarget;
    var titleInput = this.titleInputTarget.innerHTML;
    var opt = {
        margin:10, // [top, right, bottom, left]
        filename: `${titleInput} Recommendation Letter`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 5 },
        jsPDF: { unit: 'mm', format:'a4', orientation: 'portrait' }
    };
    html2pdf(element, opt);
  }

  addSignature() {
    if (!this.signaturePad.isEmpty()) {
      const signatureData = this.signaturePad.toDataURL();
      this.signatureImageTarget.src = signatureData;
      this.signatureImageTarget.classList.remove("hidden")
      let resetInputSign=document.getElementById("typeSignature");
      let resetSignOutput=document.getElementById("typeSignatureLetter1");
      resetInputSign.value='';
      resetSignOutput.innerText='';
    }
    this.fileInputTarget.value='';
  }

  clearSignature() {
    this.signaturePad.clear();
    this.signatureImageTarget.classList.add("hidden")
    this.signatureImageTarget.src = '';
    let resetInputSign=document.getElementById("typeSignature");
    let resetSignOutput=document.getElementById("typeSignatureLetter1");
    resetInputSign.value='';
    resetSignOutput.innerText='';
    this.fileInputTarget.value='';
  }


  upload() {
    let resetInputSign=document.getElementById("typeSignature");
    let resetSignOutput=document.getElementById("typeSignatureLetter1");
    resetInputSign.value='';
    resetSignOutput.innerText='';
    const file = this.fileInputTarget.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const maxWidth = 100;
        const maxHeight = 100;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = maxWidth;
          canvas.height = maxHeight;
          ctx.drawImage(img, 0, 0, maxWidth, maxHeight);

          const resizedDataURL = canvas.toDataURL('image/png');
          this.signatureImageTarget.src = resizedDataURL;
          this.signaturePad.clear();
        } else {
          this.signatureImageTarget.src = reader.result;
          this.signaturePad.clear();
        }
      };

      img.onerror = () => {
        alert('Invalid file format. Please upload an SVG, PNG, or JPEG image.');
      };

      img.src = reader.result;
    }

    if (file) {
      const fileType = file.type;
      if (!(fileType === 'image/svg+xml' || fileType === 'image/png' || fileType === 'image/jpeg')) {
        alert('Invalid file format. Please upload an SVG, PNG, or JPEG image.');
        return;
      }

      reader.readAsDataURL(file);
      
      this.signatureImageTarget.classList.remove("hidden")
    }
    
  }

  imgreset() {
    this.signatureImageTarget.src = '';
    this.signatureImageTarget.classList.add("hidden")
  }
  
  changeContent(event) {
    const selectedOption = event.target.value;
    const signcontainerTarget = this.signcontainerTarget;
    // Add class based on selected option
    if (selectedOption === "option1") {
      signcontainerTarget.classList.add("signatureFont1");
      signcontainerTarget.classList.remove("signatureFont2");
    } else if (selectedOption === "option2") {
      signcontainerTarget.classList.add("signatureFont2");
      signcontainerTarget.classList.remove("signatureFont1");

    }
  }

  CKEditor() {
    ClassicEditor
      .create(this.ckEditorTarget, {
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent'
          ],
          shouldNotGroupWhenFull: true
        },
        language: 'en'
      })
      .then(editor => {
        editor.model.document.on('change:data', () => {
          const content = editor.getData();
          this.ckEditorContentTarget.innerHTML = content;
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  generate(event) {
    event.preventDefault();
    const apiKey = document.querySelector('[data-api-key]').dataset.apiKey;
    const clickedButton = event.currentTarget;
    const loader = clickedButton.querySelector("[data-cv-target='loader']");
    loader.classList.remove("hidden");
    const label = clickedButton.dataset.cvLabel;
    const cvId = clickedButton.dataset.cvId;
    const editorIndex = this.ckEditorInstances.findIndex(instance => instance.id === cvId);

    // Collect job information
    const jobInfo = document.querySelector("#jobTitle").value;

    // Collect all degree and institute information
    const degreeElements = document.querySelectorAll("[degreeValue]");
    const instituteElements = document.querySelectorAll("[instituteValue]");
    let degrees = Array.from(degreeElements).map(el => el.value).filter(Boolean); // Get values and filter out empty ones
    let institutes = Array.from(instituteElements).map(el => el.value).filter(Boolean); // Get values and filter out empty ones

    let prompt;
   
    if (degrees.length > 0 && institutes.length > 0) {
      const degreeInfo = degrees.join(', '); // Join all degrees
      const instituteInfo = institutes.join(', '); // Join all institutes
      prompt = `I'm creating a CV for Fang company. Please help me write a brief ${label} (up to 5 lines) that highlights the key accomplishments and skills relevant to this position (don't generate (*,[],#,{}) or any kind of symbol generate text plain) Degree ${degreeInfo} and institute ${instituteInfo}`;
    } else if (jobInfo) {
      prompt = `I'm creating a CV for Fang company. Please help me write a brief ${label} (up to 5 lines) that highlights the key accomplishments and skills relevant to this position (don't generate (*,[],#,{}) or any kind of symbol generate text plain) job title is ${jobInfo}`;
    } else {
      alert("You haven't provided Job Title or Degree and Institute information. A default CV section will be generated.");
      prompt = `I'm creating a CV for Fang company. Please help me write a brief ${label} (up to 5 lines) that highlights the key accomplishments and skills relevant to this position (don't generate (*,[],#,{}) or any kind of symbol generate text plain) job title is ${defaultJobInfo}, Degree ${defaultDegree}, and institute ${defaultInstitute}`;
    }

    if (editorIndex !== -1 && this.ckEditorInstances[editorIndex]) {
      const apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

      fetch(`${apiEndpoint}?key=${apiKey}`, {  // Accessing API key from environment variable
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })
        .then(response => response.json())
        .then(data => {
          const generatedText = data.candidates[0].content.parts[0].text;
          const cleanedText = generatedText.replace(/\./g, '').replace(/<br\s*\/?>/g, '');
          this.ckEditorInstances[editorIndex].editor.setData(cleanedText.trim());
        })
        .catch(error => {
          console.error("Error:", error);
        })
        .finally(() => {
          loader.classList.add("hidden");
        });
    } else {
      loader.classList.add("hidden");
    }
  }


}





