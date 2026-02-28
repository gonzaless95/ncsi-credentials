export const loadGoogleFont = (fontFamily: string) => {
    const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(linkId)) return;

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;500;600;700;900&display=swap`;
    document.head.appendChild(link);
};
