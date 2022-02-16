const UtilsService = {
  isMobile() {
    return window.innerWidth < 768;
  },
  capitalize(w: string) {
    const word = w[0].toUpperCase() + w.slice(1).toLowerCase();
    return word.replace(/([' -][A-Za-zÀ-ÖØ-öø-ÿ])/g, (s) => s.toUpperCase());
  },
};

export default UtilsService;
