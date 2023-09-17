/*
  Source : https://dev.to/dannyengelman/load-file-web-component-add-external-content-to-the-dom-1nd
*/

customElements.define("load-component", class extends HTMLElement {

  async connectedCallback(
    src = this.getAttribute("src"),
    shadowRoot = this.shadowRoot || this.attachShadow({ mode: "open" })
  ) {
    if (src == null) {
      throw new Error("Source was null")
    }
    shadowRoot.innerHTML = await (await fetch(src)).text()
    console.log(this.getAttribute("name"))

    const scriptTag = this.shadowRoot?.querySelector("script")
    const templateTag = this.shadowRoot?.querySelector("template")

    const scriptExecutor = new Function('template', scriptTag.innerHTML);
    const customElementConstructor = scriptExecutor(templateTag?.content?.cloneNode(true))

    customElements.define(this.getAttribute("name"), customElementConstructor)
  }

})
