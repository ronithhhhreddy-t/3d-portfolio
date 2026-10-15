import gsap from "gsap"

import { PROJECTS, PROJECTS_BY_ID, getProjectCopy } from "./projectsData"

// Small DOM builder: text always goes through textContent, never as HTML
function element(tag, className, text) {
  const node = document.createElement(tag)

  if (className) node.className = className
  if (text != null) node.textContent = text

  return node
}

function section(className, heading, ...children) {
  const wrapper = element("section", `project-detail__section ${className ?? ""}`.trim())

  wrapper.append(element("h3", "project-detail__heading", heading), ...children)

  return wrapper
}

function bulletList(items) {
  const list = element("ul", "project-detail__bullets")

  items.forEach((item) => list.append(element("li", null, item)))

  return list
}

const EXTERNAL_ARROW = "↗"

export function createProjectDetail({ dialog, i18n, reducedMotion = false, onOpen, onClose }) {
  if (!dialog) {
    return { open: () => {} }
  }

  const content = dialog.querySelector(".project-detail__content")
  const scroller = dialog.querySelector(".project-detail__scroll")
  const language = i18n.language
  const t = (key) => i18n.t(`home.projectDetail.${key}`)

  let entranceTween = null

  // ----------------------
  // Render
  // ----------------------
  function renderHero(project, copy) {
    const hero = element("header", "project-detail__hero")

    const eyebrow = element(
      "p",
      "project-detail__eyebrow project-detail__animate",
      `${project.index} — ${copy.status}`,
    )

    const title = element("h2", "project-detail__title project-detail__animate", project.title)
    title.id = "project-detail-title"

    const category = element("p", "project-detail__category project-detail__animate", copy.category)
    const tagline = element("p", "project-detail__tagline project-detail__animate", copy.tagline)

    const links = element("div", "project-detail__links project-detail__animate")

    if (project.liveUrl) {
      const live = element("a", "project-detail__link", `${t("liveSite")} ${EXTERNAL_ARROW}`)
      live.href = project.liveUrl
      live.target = "_blank"
      live.rel = "noopener noreferrer"
      links.append(live)
    }

    if (project.githubUrl) {
      const github = element("a", "project-detail__link project-detail__link--ghost", "GitHub")
      github.href = project.githubUrl
      github.target = "_blank"
      github.rel = "noopener noreferrer"
      links.append(github)
    }

    if (!project.liveUrl && !project.githubUrl) {
      links.append(element("span", "project-detail__links-soon", t("linksSoon")))
    }

    hero.append(eyebrow, title, category, tagline, links)

    return hero
  }

  function renderCover(project, copy) {
    if (!project.cover) {
      const empty = element("div", "project-detail__cover project-detail__cover--empty project-detail__animate")
      empty.append(element("span", "project-detail__cover-soon", t("previewSoon")))
      return empty
    }

    const figure = element("figure", "project-detail__cover project-detail__animate")
    const image = element("img")

    image.src = project.cover
    image.alt = copy.coverAlt ?? project.title
    image.decoding = "async"

    figure.append(image)

    return figure
  }

  function renderBody(project, copy) {
    const body = element("div", "project-detail__body")

    // Narrative column
    const main = element("div", "project-detail__main")

    main.append(
      section("project-detail__animate", t("overview"), element("p", "project-detail__text", copy.overview)),
    )

    if (copy.purpose) {
      main.append(
        section("project-detail__animate", t("purpose"), element("p", "project-detail__text", copy.purpose)),
      )
    }

    // Facts column
    const aside = element("aside", "project-detail__aside")

    const pills = element("ul", "project-detail__pills")
    project.technologies.forEach((technology) =>
      pills.append(element("li", "project-detail__pill", technology)),
    )
    aside.append(section("project-detail__animate", t("stack"), pills))

    if (copy.recognition) {
      aside.append(
        section(
          "project-detail__recognition project-detail__animate",
          t("recognition"),
          element("p", null, copy.recognition),
        ),
      )
    }

    aside.append(section("project-detail__animate", t("highlights"), bulletList(copy.highlights)))

    body.append(main, aside)

    return body
  }

  function renderFeatures(copy) {
    const grid = element("div", "project-detail__features")

    copy.features.forEach((group) => {
      const card = element("article", "project-detail__feature project-detail__animate")

      card.append(element("h4", "project-detail__feature-title", group.title), bulletList(group.items))
      grid.append(card)
    })

    return section("project-detail__built", t("built"), grid)
  }

  function renderGallery(project, copy) {
    if (!project.gallery.length) return null

    const grid = element("div", "project-detail__gallery")

    project.gallery.forEach((shot) => {
      const figure = element("figure", "project-detail__shot project-detail__animate")
      const image = element("img")

      image.src = shot.src
      image.alt = shot.caption?.[language] ?? shot.caption?.en ?? project.title
      image.loading = "lazy"
      image.decoding = "async"

      figure.append(image)

      const caption = shot.caption?.[language] ?? shot.caption?.en
      if (caption) figure.append(element("figcaption", null, caption))

      grid.append(figure)
    })

    return section("project-detail__preview", t("preview"), grid)
  }

  function renderNext(project) {
    const currentIndex = PROJECTS.indexOf(project)
    const next = PROJECTS[(currentIndex + 1) % PROJECTS.length]

    const footer = element("footer", "project-detail__next")
    const button = element("button", "project-detail__next-button")

    button.type = "button"
    button.dataset.project = next.id

    button.append(
      element("span", "project-detail__heading", t("nextProject")),
      element("span", "project-detail__next-name", next.name),
    )

    footer.append(button)

    return footer
  }

  function render(project) {
    const copy = getProjectCopy(project, language)

    content.replaceChildren(
      renderHero(project, copy),
      renderCover(project, copy),
      renderBody(project, copy),
      renderFeatures(copy),
      ...[renderGallery(project, copy)].filter(Boolean),
      renderNext(project),
    )

    dialog.dataset.project = project.id
  }

  // ----------------------
  // Motion
  // ----------------------
  function animateContentIn() {
    entranceTween?.kill()

    if (reducedMotion) return

    entranceTween = gsap.fromTo(
      content.querySelectorAll(".project-detail__animate"),
      { y: 28, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.05,
        delay: 0.12,
        ease: "expo.out",
        clearProps: "transform,opacity,visibility",
      },
    )
  }

  // ----------------------
  // Open / close
  // ----------------------
  function show(projectId) {
    const project = PROJECTS_BY_ID[projectId]

    if (!project) return

    render(project)
    scroller.scrollTop = 0

    if (!dialog.open) {
      onOpen?.()
      dialog.showModal()
    }

    animateContentIn()
  }

  dialog.addEventListener("close", () => {
    entranceTween?.kill()
    onClose?.()
  })

  dialog.querySelector(".project-detail__close")?.addEventListener("click", () => {
    dialog.close()
  })

  // "Next project" swaps the content in place
  content.addEventListener("click", (event) => {
    const nextButton = event.target.closest(".project-detail__next-button")

    if (!nextButton) return

    show(nextButton.dataset.project)
    dialog.querySelector(".project-detail__close")?.focus()
  })

  // Light dismiss for browsers without <dialog closedby="any"> (Safari):
  // a click on the backdrop targets the dialog itself, outside its box.
  if (!("closedBy" in HTMLDialogElement.prototype)) {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return

      const rect = dialog.getBoundingClientRect()
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.bottom &&
        rect.left <= event.clientX &&
        event.clientX <= rect.right

      if (!isInside) dialog.close()
    })
  }

  return {
    open: show,
  }
}
