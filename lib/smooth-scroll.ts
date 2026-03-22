/**
 * Smooth scroll utility for navigation
 */

export const smoothScrollTo = (elementId: string, offset: number = 80) => {
  const element = document.getElementById(elementId)
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * Hook for smooth scrolling with programmatic control
 */
export const useSmoothScroll = () => {
  const scrollToSection = (sectionId: string, offset?: number) => {
    smoothScrollTo(sectionId, offset)
  }

  const scrollToTopHandler = () => {
    scrollToTop()
  }

  return {
    scrollToSection,
    scrollToTop: scrollToTopHandler
  }
}
