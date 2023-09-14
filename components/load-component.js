/*
  Source : https://dev.to/dannyengelman/load-file-web-component-add-external-content-to-the-dom-1nd
*/

function cloneScriptAndRemove(node) {
  const newScript = document.createElement("script");
  newScript.innerHTML = node.innerHTML;
  node.remove()
  return newScript
}

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

    const allScripttags = this.shadowRoot?.querySelectorAll("script") ?? []
    // clone scripts and remove them from template DOM
    const newScripts = [...allScripttags].map((x) => cloneScriptAndRemove(x))

    /* this.hasAttribute("replaceWith") && */ this.replaceWith(...shadowRoot.childNodes)

    // populate cloned scripts in head element
    for (const s of newScripts) { document.head.append(s) }

  }
})
