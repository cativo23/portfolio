import type { MetaOptions } from "~/types/meta";

export const usePageTitle = (pageTitle: string, options: MetaOptions = {}) => {
  const url = useRequestURL();
  const route = useRoute();
  const fallBackUrl = url.host + route.fullPath;
  const config = useRuntimeConfig();
  const baseTitle = config.public.baseTitle;
  const defaultOgImage: string = config.public.defaultOgImage || '/default-og-image.png';
  const defaultOgUrl: string =  fallBackUrl || config.public.defaultOgUrl;
  
  useSeoMeta({
    title: `${baseTitle} - ${pageTitle}`,
    description: options.description || `Learn more about ${baseTitle} on the ${pageTitle} page.`,
    ogTitle: options.ogTitle || `${baseTitle} - ${pageTitle}`,
    ogDescription: options.ogDescription || options.description || `Learn more about ${baseTitle} on the ${pageTitle} page.`,
    ogImage: options.ogImage || defaultOgImage,
    ogUrl: defaultOgUrl || options.ogUrl,
    twitterTitle: options.twitterTitle || `${baseTitle} - ${pageTitle}`,
    twitterDescription: options.twitterDescription || options.description || `Learn more about ${baseTitle} on the ${pageTitle} page.`,
    twitterImage: options.twitterImage || options.ogImage || defaultOgImage,
    twitterCard: options.twitterCard || 'summary',
  });
};
