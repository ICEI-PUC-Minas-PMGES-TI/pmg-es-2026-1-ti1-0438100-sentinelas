(function() {
    function initSearchRedirect() {
        const btnSearch = document.querySelector('.pesquisar-resultado');
        const inputSearch = document.querySelector('.barra-pesquisa');

        if (window.location.pathname.includes('pesquisa-denuncias.html')) {
            return;
        }

        if (btnSearch && inputSearch) {
            const performSearch = () => {
                const query = inputSearch.value.trim();
                
                let targetPath = 'pesquisa-denuncias.html';
                
                if (!window.location.pathname.includes('/modulos/denuncias/')) {
                    targetPath = '../denuncias/pesquisa-denuncias.html';
                }

                window.location.href = `${targetPath}${query ? '?search=' + encodeURIComponent(query) : ''}`;
            };

            if (btnSearch.tagName === 'A') {
                btnSearch.addEventListener('click', (e) => {
                    e.preventDefault();
                    performSearch();
                });
            } else {
                btnSearch.addEventListener('click', performSearch);
            }

            inputSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearchRedirect);
    } else {
        initSearchRedirect();
    }
})();
