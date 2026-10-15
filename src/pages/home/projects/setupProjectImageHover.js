import gsap from "gsap"

import { PROJECTS, PROJECTS_BY_ID } from "./projectsData"

// Read at hover time: the i18n module sets <html lang> after this module is imported
const getLanguage = () => (document.documentElement.lang === "fr" ? "fr" : "en")

let projectImagesPreloadStarted = false

export function preloadProjectImages() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches

  if (!canHover) return
  if (projectImagesPreloadStarted) return

  projectImagesPreloadStarted = true

  PROJECTS.forEach((project) => {
    project.previews.forEach((preview) => {
      if (!preview.src) return

      const image = new Image()
      image.src = preview.src
    })
  })
}

export function setupProjectImageHover(links) {
  // ----------------------
  // Setup project hovers
  // ----------------------
  links.forEach((link) => {
    // Project data
    const project = PROJECTS_BY_ID[link.dataset.project]
    const images = project?.previews

    if (!images?.length) return

    const letters = [...link.querySelectorAll(".project-letter__content")]

    // Project state
    const overflows = new Array(letters.length).fill(0)
    let imageIndex = 0

    // Calculate and animate letter offsets
    function applyLetterOffsets() {
      if (letters.length === 0) return

      let spaceOnTheLeft = 0
      const targets = []

      for (let index = 0; index < overflows.length; index++) {
        const overflow = overflows[index]

        const overflowsOnTheRight = overflows.slice(index + 1)

        const spaceOnTheRight = overflowsOnTheRight.reduce((total, value) => total + value, 0)

        const x = spaceOnTheLeft - spaceOnTheRight

        spaceOnTheLeft += overflow

        targets.push(x)
      }

      gsap.to(letters, {
        x: (index) => targets[index],
        duration: 0.3,
        ease: "back.out(3)",
        overwrite: "auto",
      })
    }

    // ----------------------
    // 3. Letter hover
    // ----------------------
    letters.forEach((letter, letterIndex) => {
      if (letter.textContent.trim() === "") return

      letter.addEventListener("mouseenter", () => {
        // Prevent multiple image on same letter
        const currentImage = letter.querySelector(".project-letter__image")

        if (currentImage) return

        // Select next preview and loop back
        const preview = images[imageIndex % images.length]
        imageIndex++

        const image = createPreviewElement(preview, project)

        // Insert inside hovered letter
        letter.append(image)

        // Center image
        gsap.set(image, {
          xPercent: -50,
          yPercent: -50,
        })

        // Image entrance
        gsap.from(image, {
          rotation: (Math.random() - 0.5) * 20,
          scale: 1.05,
          duration: 0.3,
          ease: "back.out(2)",
        })

        // Reserve space around the image
        const letterWidth = letter.getBoundingClientRect().width
        const imageSpacingWidth = 0.085 * window.innerWidth
        const extraWidth = imageSpacingWidth - letterWidth
        const overflowX = Math.max(0, extraWidth / 2)
        overflows[letterIndex] = overflowX
        applyLetterOffsets()

        // Remove image and restore spacing
        gsap.delayedCall(1.2, () => {
          const parent = image.parentElement

          if (!parent) return

          overflows[letterIndex] = 0

          image.remove()

          applyLetterOffsets()

          // Letter reappearance
          gsap.from(parent, {
            rotation: (Math.random() - 0.5) * 20,
            scale: 1.05,
            duration: 0.3,
            ease: "back.out(2)",
          })
        })
      })
    })
  })
}

// A screenshot crop, or a short text tile for projects without screenshots yet
function createPreviewElement(preview, project) {
  const format = preview.format === "portrait" ? "is-portrait" : "is-square"

  if (preview.src) {
    const image = document.createElement("img")

    image.src = preview.src
    image.alt = ""
    image.classList.add("project-letter__image", format)

    return image
  }

  const tile = document.createElement("span")

  tile.setAttribute("aria-hidden", "true")
  tile.classList.add("project-letter__image", "project-letter__tile", format)

  // A different crop of the warm gradient each time, so tiles never look stamped
  tile.style.backgroundPosition = `${Math.round(Math.random() * 100)}% ${Math.round(Math.random() * 100)}%`

  const index = document.createElement("span")
  index.classList.add("project-letter__tile-index")
  index.textContent = project.index

  const label = document.createElement("span")
  label.classList.add("project-letter__tile-label")
  label.textContent = preview.tile[getLanguage()] ?? preview.tile.en

  tile.append(index, label)

  return tile
}
