// easydoc_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["editor", "markdown", "themeselecter", "prompt", "hitgenerate", "downloadpdf"]

  connect() {
    this.initializeCodeMirror()
    this.initializeConverter()
    this.setupEventListeners()
    this.updatePreview();
    
  }

  initializeCodeMirror() {
    console.log("Initializing CodeMirror")
    this.editor = CodeMirror(this.editorTarget, {
      mode: "markdown",
      theme: "3024-night",
      lineNumbers: true,
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true,
    })

    const initialContent = "# Hello, Markdown World!\nThis is a default content."
    this.editor.setValue(initialContent)
    this.updatePreview()
  }

  initializeConverter() {
    console.log("Initializing Showdown converter")
    if (window.showdown) {
      this.converter = new window.showdown.Converter()
    } else {
      console.error("Showdown library not found")
    }
  }

  setupEventListeners() {
    console.log("Setting up event listeners")
    this.editor.on("change", () => this.updatePreview())
    this.themeselecterTarget.addEventListener("change", () => this.changeTheme())
    this.hitgenerateTarget.addEventListener("click", () => this.generateMarkdown())
    this.downloadpdfTarget.addEventListener("click", () => this.downloadPDF())
  }
  
  updatePreview() {
    console.log("Updating preview")
    const markdownText = this.editor.getValue()
    if (this.converter) {
      const htmlText = this.converter.makeHtml(markdownText)
      this.markdownTarget.innerHTML = htmlText
      if (window.Prism) window.Prism.highlightAll()
    }
    console.log("Preview updated with:", markdownText)
  }

  changeTheme() {
    console.log("Changing theme")
    const theme = this.themeselecterTarget.value
    this.editor.setOption("theme", theme)
    this.markdownTarget.classList.remove(...this.markdownTarget.classList)
    this.markdownTarget.classList.add(theme)
  }

  async generateMarkdown() {
    console.log("Generating markdown")
    const prompt = this.promptTarget.value.trim()
    if (prompt) {
      this.editor.setValue('Generating...')
      const markdown = await this.callGeminiAPI(prompt)
      this.editor.setValue(markdown)
      this.updatePreview()
    } else {
      alert('Please enter a prompt.')
    }
  }

  async callGeminiAPI(prompt) {
    console.log("Calling Gemini API")
    const API_KEY = 'AIzaSyC-IHRSLmAL645a2zbXo3ngz0C7XsnkRJM'
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }

    try {
      const response = await fetch(`${url}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) throw new Error('API request failed')

      const data = await response.json()
      return data.candidates[0].content.parts[0].text
    } catch (error) {
      console.error('Error:', error)
      return 'An error occurred while generating the markdown.'
    }
  }

  downloadPDF() {
    console.log("Downloading PDF");
    this.updatePreview();
    const element = this.markdownTarget;

    if (window.html2pdf) {
        const opt = {
            margin:       1,
            filename:     'output.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // New Promise-based usage:
        html2pdf().from(element).set(opt).save();
    } else {
        console.error("html2pdf library not found");
    }
}


  
}