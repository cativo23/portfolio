export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === 'undefined') return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  function scan() {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
      observer.observe(el)
    })
  }

  nuxtApp.hook('page:transition:finish', scan)
  scan()
})
