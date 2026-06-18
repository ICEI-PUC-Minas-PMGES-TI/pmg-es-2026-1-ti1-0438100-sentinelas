(function() {
    function initSearchRedirect() {
        const btnSearch = document.querySelector('.botao-denuncias');
        const inputSearch = document.querySelector('.pesquisa-denuncias');

        if (!btnSearch || !inputSearch) return;

        const performSearch = () => {
            const query = inputSearch.value.trim();
            const placeholder = inputSearch.placeholder.toLowerCase();
            const isPropertySearch = placeholder.includes('imóveis') || placeholder.includes('imovel');
            
            let targetPath;
            let currentPath = window.location.pathname;

            if (isPropertySearch) {
                if (currentPath.includes('exibicao-imoveis.html')) {
                    return;
                }
                targetPath = 'exibicao-imoveis.html';
                if (!currentPath.includes('/modulos/imoveis/')) {
                    targetPath = '../imoveis/exibicao-imoveis.html';
                }
            } else {
                if (currentPath.includes('filtro-denuncias.html')) {
                    return;
                }
                targetPath = 'filtro-denuncias.html';
                if (!currentPath.includes('/modulos/denuncias/')) {
                    targetPath = '../denuncias/filtro-denuncias.html';
                }
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearchRedirect);
    } else {
        initSearchRedirect();
    }
})();
