/*
  Source : https://dev.to/dannyengelman/load-file-web-component-add-external-content-to-the-dom-1nd
*/

function cloneScript(node) {
  const newScript = document.createElement("script");
  newScript.innerHTML = node.innerHTML;
  node.replaceWith(newScript)
}

const ElementSet = new Set()

customElements.define("load-component", class extends HTMLElement {

  async connectedCallback(
    src = this.getAttribute("src"),
    shadowRoot = this.shadowRoot || this.attachShadow({ mode: "open" })
  ) {
    if (src == null) {
      throw new Error("Source was null")
    }
    shadowRoot.innerHTML = await (await fetch(src)).text()

    shadowRoot.append(...this.querySelectorAll("[shadowRoot]"))

    const allTemplates = this.shadowRoot?.querySelectorAll("template")
    if (allTemplates != null) {
      for (const template of allTemplates) {
        if (ElementSet.has(template.id)) {
          throw new Error("Conflicting Template IDs")
        }
        ElementSet.add(template.id)
        document.body.appendChild(template)
      }
    }

    const allScripttags = this.shadowRoot?.querySelectorAll("script") ?? []
    // clone scripts and remove them from template DOM
    allScripttags.forEach((x) => cloneScript(x))
  }
})
