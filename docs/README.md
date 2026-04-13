# Introdução

Informações básicas do projeto.

* **Projeto:** Vigilare
* **Repositório GitHub:** [Github](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0438100-sentinelas/tree/master)
* **Membros da equipe:**
  * [Arthur Estevão](https://github.com/ArthurEstevaoST)
  * [Bernardo Ramos](https://github.com/bernardorf5)
  * [Francisco Filipe](https://github.com/franciscofilipeee)
  * [Gabriel de Oliveira](https://github.com/Biels2w)
  * [João Pedro](https://github.com/)
  * [Victor Dante](https://github.com/victordante666)

## Sumário

- [Introdução](#introdução)
  - [Sumário](#sumário)
- [Contexto](#contexto)
  - [Problema](#problema)
  - [Objetivos](#objetivos)
  - [Justificativa](#justificativa)
  - [Público-Alvo](#público-alvo)
- [Product Discovery](#product-discovery)
  - [Etapa de Entendimento](#etapa-de-entendimento)
  - [Etapa de Definição](#etapa-de-definição)
    - [Personas](#personas)
- [Product Design](#product-design)
  - [Histórias de Usuários](#histórias-de-usuários)
  - [](#)
  - [Requisitos](#requisitos)
    - [Requisitos Funcionais](#requisitos-funcionais)
    - [Requisitos não Funcionais](#requisitos-não-funcionais)
  - [Projeto de Interface](#projeto-de-interface)
    - [Wireframes](#wireframes)
    - [User Flow](#user-flow)
    - [Protótipo Interativo](#protótipo-interativo)
- [Metodologia](#metodologia)
  - [Gerenciamento do Projeto](#gerenciamento-do-projeto)
- [Solução Implementada](#solução-implementada)
  - [Vídeo do Projeto](#vídeo-do-projeto)
  - [Funcionalidades](#funcionalidades)
        - [Funcionalidade 1 - Cadastro de Contatos ⚠️ EXEMPLO ⚠️](#funcionalidade-1---cadastro-de-contatos-️-exemplo-️)
  - [Estruturas de Dados](#estruturas-de-dados)
        - [Estrutura de Dados - Contatos   ⚠️ EXEMPLO ⚠️](#estrutura-de-dados---contatos---️-exemplo-️)
        - [Estrutura de Dados - Usuários  ⚠️ EXEMPLO ⚠️](#estrutura-de-dados---usuários--️-exemplo-️)
  - [Módulos e APIs](#módulos-e-apis)
- [Referências](#referências)

---

# Contexto

O projeto Vigilare é uma iniciativa desenvolvida no contexto de crescente preocupação com a segurança pública em Belo Horizonte. O projeto nasceu da necessidade de combater o aumento significativo de crimes, que afetam a população em geral e demandam uma resposta inovadora e colaborativa.

Este documento constitui a documentação da fase estratégica do projeto, contendo a análise detalhada do problema, os objetivos propostos, o público-alvo identificado, e o processo de descoberta e design do produto que orientará o desenvolvimento da solução tecnológica.

---

## Problema

O Brasil enfrenta uma crise significativa de segurança pública caracterizada pelo aumento exponencial de crimes contra o patrimônio. Utilizando como base os dados da Secretaria de Estado de Justiça e Segurança Pública de Belo Horizonte, indicam que de janeiro a abril de 2025, a capital mineira registrou 23.541 ocorrências de furto, representando uma média diária de 196 casos.

Especificamente, o furto de celulares apresenta taxas alarmantes: durante o período de carnaval de 2025, foram registrados aproximadamente 200 aparelhos roubados ou furtados por dia. De janeiro a março do mesmo ano, o volume chegou a 5.734 ocorrências apenas para esta categoria.

As análises das causas do aumento criminal apontam para três fatores principais:

- **Ruas mais "calmas":** A redução da movimentação em determinadas áreas cria oportunidades para atividades criminosas com menor risco de intervenção.

- **Impotência da sociedade:** A população carece de mecanismos eficazes para reportar crimes, compartilhar informações sobre incidentes e coordenar respostas coletivas.

- **Baixa atuação da força policial:** A capacidade operacional insuficiente das instituições de segurança limita a resposta imediata e preventiva.

---

## Objetivos

Desenvolver uma aplicação web e mobile que permita aos cidadãos de um mesmo bairro ou cidade compartilhar informações sobre crimes, testemunhas e evidências, integrando essas informações diretamente com as instituições de segurança pública para facilitação de respostas rápidas e coordenadas.

1. **Facilitar o compartilhamento de informações sobre crimes:** Criar uma rede de vigilância colaborativa entre moradores e comerciantes de uma mesma região que aumente a conscientização sobre riscos locais.

2. **Integrar os dados coletados com as instituições de segurança pública:** Permitir que as forças policiais acessem informações relevantes em tempo real para melhor direcionamento de operações preventivas e repressivas.

3. **Ampliar a acessibilidade tecnológica:** Garantir que usuários com diferentes níveis de familiaridade com tecnologia possam utilizar a plataforma de forma intuitiva e sem barreiras.

---

## Justificativa

A escolha do Vigilare como tema de desenvolvimento justifica-se por sua relevância social e urgência. O projeto aborda um problema que afeta diretamente a qualidade de vida de milhões de cidadãos e representa uma oportunidade de demonstrar como tecnologia e design podem contribuir para o bem público.

A insegurança crônica prejudica não apenas a integridade patrimonial dos indivíduos, mas também sua saúde mental e sua liberdade de circulação. A solução proposta busca restaurar o sentimento de segurança por meio da colaboração e transparência.

O desenvolvimento do Vigilare é viável através de tecnologias consolidadas e acessíveis, incluindo arquiteturas web escaláveis, APIs de geolocalização, e integração com sistemas de dados públicos. As tecnologias selecionadas serão detalhadas na seção Metodologia.

A implementação do Vigilare tem potencial para reduzir em até 30% os crimes contra o patrimônio em áreas piloto, conforme evidências de aplicações similares em outras cidades brasileiras. Além disso, pode servir como modelo replicável para outras municipalidades.

---

## Público-Alvo

O Vigilare é projetado para servir uma população heterogênea, variando desde usuários com baixíssima familiaridade com tecnologia até profissionais que trabalham nesta área. A seguir, descrevem-se os principais segmentos do público-alvo:

- **Moradores e Comerciantes Comuns:** Indivíduos que vivem ou trabalham em uma região específica, com variados níveis de escolaridade e familiaridade com tecnologia, buscando contribuir para a segurança comunitária.

- **Cidadãos Familiarizados com a Tecnologia:** Usuários que atuarão como promotores da plataforma e contribuirão com análises mais sofisticadas de dados.

- **Força Policial:** Agentes e instituições de segurança que utilizarão a plataforma como ferramenta de inteligência operacional.

- **Gestores Públicos:** Administradores municipais e estaduais interessados em dados sobre criminalidade para planejamento estratégico.

- **Corretoras de Imóveis:** Profissionais que utilizam a plataforma para assessoramento sobre segurança em bairros.

---

# Product Discovery

## Etapa de Entendimento

A Matriz CSD foi utilizada para organizar o conhecimento e facilitar a tomada de decisão sobre os requisitos da solução:

| Certezas                              | Suposições                                | Dúvidas                                   |
| ------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| Há um problema real de criminalidade  | Cidadãos querem contribuir para segurança | Qual será o nível de adoção inicial?      |
| Tecnologia pode facilitar colaboração | Usuários farão registros consistentemente | Como garantir confiabilidade dos relatos? |
|                                       | Dados ajudarão polícia a reduzir crimes   | Qual será a frequência de uso?            |
|                                       | Interface simples será adotada por todos  |                                           |

Os principais stakeholders do projeto foram mapeados conforme sua influência e interesse:

| Stakeholder                | Interesse/Influência                   |
| -------------------------- | -------------------------------------- |
| Cidadãos Comuns            | Alto interesse, média-alta influência  |
| Força Policial             | Alto interesse, muito alta influência  |
| Gestão Municipal           | Médio interesse, muito alta influência |
| Tecnólogos/Desenvolvedores | Alto interesse, média influência       |

Foram realizadas análises de dados públicos e revisão de literatura sobre segurança urbana. Os principais achados:

- De janeiro a abril de 2025: 23.541 furtos em BH (média de 196/dia)
- Março de 2025: mês com maior incidência (6.740 casos)
- Furto de celulares: 5.734 em 3 meses (200/dia durante o carnaval)
- Locais críticos: hipercentro, semáforos, transportes coletivos, saídas de bares
- Perfil dos infratores: dependentes de drogas, pessoas em situação de rua, especialistas
- Fenômeno de receptação alimenta a cadeia criminal

## Etapa de Definição

### Personas

![Personas e proposta de valor](images/personas.jpg)

---

# Product Design

Nesse momento, vamos transformar os insights e validações obtidos em soluções tangíveis e utilizáveis. Essa fase envolve a definição de uma proposta de valor, detalhando a prioridade de cada ideia e a consequente criação de wireframes, mockups e protótipos de alta fidelidade, que detalham a interface e a experiência do usuário.

## Histórias de Usuários

Com base na análise das personas foram identificadas as seguintes histórias de usuários:

| EU COMO...`PERSONA`  | QUERO/PRECISO ...`FUNCIONALIDADE`                             | PARA ...`MOTIVO/VALOR`                                   |
| -------------------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| Morador/Comerciante  | Denunciar crimes que acontecem na região                      | Alertar as pessoas sobre crimes próximos                 |
| Morador/Comerciante  | Visualizar denúncias feitas por outros moradores/comerciantes | Saber o que está acontecendo na minha região             |
| Morador/Comerciante  | Apoiar denúncias dos vizinhos                                 | Tornar a denúncia mais relevante com mais testemunhas    |
| Morador/Comerciante  | Editar, excluir e visualizar minhas denúncias                 | Corrigir eventuais erros nas denúncias                   |
| Vendedor imobiliário | Visualizar estatísticas de criminalidade                      | Precificar imóveis com base na segurança da região       |
| Policial             | Visualizar denúncias mais relevantes                          | Priorizar ações e atender melhor a população             |
| Morador/Comerciante  | Visualizar mapa de calor (mapa de cores)                      | Identificar áreas perigosas e definir rotas mais seguras |
| Corretora de imóveis | Checar áreas residenciais mais seguras                        | Indicar os melhores bairros para seus clientes           |


##

!['Personas + proposta de valor](images/personas.jpg)

---

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

| ID     | Descrição do Requisito                                                                                                                              | Prioridade |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| RF-001 | Cadastrar denúncias de crimes: O sistema deve permitir que moradores e comerciantes registrem ocorrências com dados e evidências.                   | ALTA       |
| RF-002 | Geolocalização de incidentes: O usuário deve ser capaz de marcar o local exato do crime no mapa durante o fluxo de denúncia.                        | ALTA       |
| RF-003 | Visualizar mapa de calor/crimes: O sistema deve exibir um mapa interativo com a localização e intensidade das ocorrências por região.               | ALTA       |
| RF-004 | Autenticação de usuários: Permitir login, registro e validação de usuários comuns e perfis especiais (polícia/gestores).                            | ALTA       |
| RF-005 | Apoiar denúncias (Testemunhas): Permitir que usuários adicionem relatos ou confirmem denúncias de terceiros para aumentar a relevância do registro. | MÉDIA      |
| RF-006 | Gestão de denúncias próprias: O usuário deve poder editar, excluir e visualizar seu histórico de denúncias realizadas.                              | MÉDIA      |
| RF-007 | Dashboard Analítico e Relatórios: Fornecer painéis de dados, filtros regionais e exportação de estatísticas para forças policiais e gestores.       | MÉDIA      |
| RF-008 | Notificações em tempo real: Enviar alertas de segurança e atualizações de incidentes próximos à localização do usuário.                             | BAIXA      |

### Requisitos não Funcionais

| ID      | Descrição do Requisito                                                                                                                                    | Prioridade |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| RNF-001 | Multiplataforma/Responsividade: A aplicação deve ser acessível via web e dispositivos móveis (Android/iOS).                                               | ALTA       |
| RNF-002 | Usabilidade/Acessibilidade: A interface deve ser intuitiva para usuários com diferentes níveis de literacia tecnológica (ex: botões grandes para idosos). | ALTA       |
| RNF-003 | Escalabilidade: A infraestrutura (Google Cloud) deve suportar o crescimento do volume de dados e acessos simultâneos.                                     | ALTA       |
| RNF-004 | Confiabilidade dos dados: O sistema deve possuir mecanismos para validar a veracidade dos relatos e reduzir "ruídos" ou denúncias falsas.                 | ALTA       |
| RNF-005 | Segurança e Privacidade: Garantir a integridade das informações e o acesso restrito a dados sensíveis por perfis autorizados (ex: dashboard policial).    | MÉDIA      |
| RNF-006 | Performance: Integração eficiente com APIs de geolocalização (Google Maps) para carregamento rápido dos mapas de incidentes.                              | MÉDIA      |

## Projeto de Interface

Artefatos relacionados com a interface e a interacão do usuário na proposta de solução.

### Wireframes

Os wireframes foram desenvolvidos utilizando ferramentas de prototipagem (Excalidraw e Figma), representando as principais telas da aplicação:

- **Homepage:** Apresenta a proposta de valor e opções de login/cadastro
  
  ![Homepage](images/homepage.png)

- **Realizar Denúncia:** Formulário para preenchimento de dados de denúncia com geolocalização

  ![Realizar Denúncia](images/denuncia.png)

- **Meu Perfil:** Visualização e edição de informações do usuário

  ![Meu Perfil](images/meuperfil.png)

- **Denúncias:** Feed de denúncias com filtros e detalhes

  ![Denúncias](images/denuncias.png)

- **Notificações:** Centro de notificações com alertas e atualizações

  ![Notificações](images/notificacoes.png)

### User Flow

Um protótipo interativo foi desenvolvido permitindo ao usuário navegar pelas funcionalidades como se estivesse lidando com o software pronto. O protótipo foi construído utilizando Figma e pode ser acessado através do seguinte link:

**[User Flow - Figma](https://www.figma.com/design/hZV6VQyhKt3hQ1hpg6199s/TIAW-Interface?node-id=131-68&t=2BesBlw9wMAW2h04-0)**

---

### Protótipo Interativo

**[Protótipo Interativo - Figma](https://www.figma.com/design/hZV6VQyhKt3hQ1hpg6199s/TIAW-Interface?node-id=131-68&t=2BesBlw9wMAW2h04-0)**

# Metodologia

Detalhes sobre a organização do grupo e o ferramental empregado.

| Ambiente                    | Plataforma | Link de acesso                                                                                         |
| --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| Processo de Design Thinking | Miro       | https://miro.com/app/board/uXjVGtt_X9U=/?share_link_id=672081213527                                    |
| Repositório de código       | GitHub     | https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0438100-sentinelas/tree/master            |
| Hospedagem do site          | Render     |                                                                                                        |
| Protótipo Interativo        | Figma      | https://www.figma.com/design/hZV6VQyhKt3hQ1hpg6199s/TIAW-Interface?node-id=131-68&t=2BesBlw9wMAW2h04-0 |
|                             |            |                                                                                                        |

## Gerenciamento do Projeto

Divisão de papéis no grupo e apresentação da estrutura da ferramenta de controle de tarefas (Kanban).

- **Arthur Estevão** - Developer
- **Bernardo Ramos** - Developer
- **Francisco Filipe** - Scrum Master
- **Gabriel de Oliveira** - Developer
- **João Pedro** - Developer
- **Sophia Nicole** - Product Owner
- **Victor Dante** - Developer

![Imagem do kanban](images/kanban.png)

---


# Solução Implementada

Esta seção apresenta todos os detalhes da solução criada no projeto.

## Vídeo do Projeto

O vídeo a seguir traz uma apresentação do problema que a equipe está tratando e a proposta de solução. ⚠️ EXEMPLO ⚠️

[![Vídeo do projeto](images/video.png)](https://www.youtube.com/embed/70gGoFyGeqQ)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> O video de apresentação é voltado para que o público externo possa conhecer a solução. O formato é livre, sendo importante que seja apresentado o problema e a solução numa linguagem descomplicada e direta.
>
> Inclua um link para o vídeo do projeto.

## Funcionalidades

Esta seção apresenta as funcionalidades da solução.Info

##### Funcionalidade 1 - Cadastro de Contatos ⚠️ EXEMPLO ⚠️

Permite a inclusão, leitura, alteração e exclusão de contatos para o sistema

* **Estrutura de dados:** [Contatos](#ti_ed_contatos)
* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o menu principal e escolha a opção Cadastros
  * Em seguida, escolha a opção Contatos
* **Tela da funcionalidade**:

![Tela de Funcionalidade](images/exemplo-funcionalidade.png)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente cada uma das funcionalidades que a aplicação fornece tanto para os usuários quanto aos administradores da solução.
>
> Inclua, para cada funcionalidade, itens como: (1) titulos e descrição da funcionalidade; (2) Estrutura de dados associada; (3) o detalhe sobre as instruções de acesso e uso.

## Estruturas de Dados

Descrição das estruturas de dados utilizadas na solução com exemplos no formato JSON.Info

##### Estrutura de Dados - Contatos   ⚠️ EXEMPLO ⚠️

Contatos da aplicação

```json
  {
    "id": 1,
    "nome": "Leanne Graham",
    "cidade": "Belo Horizonte",
    "categoria": "amigos",
    "email": "Sincere@april.biz",
    "telefone": "1-770-736-8031",
    "website": "hildegard.org"
  }
  
```

##### Estrutura de Dados - Usuários  ⚠️ EXEMPLO ⚠️

Registro dos usuários do sistema utilizados para login e para o perfil do sistema

```json
  {
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    email: "admin@abc.com",
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    login: "admin",
    nome: "Administrador do Sistema",
    senha: "123"
  }
```

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente as estruturas de dados utilizadas na solução tanto para dados utilizados na essência da aplicação quanto outras estruturas que foram criadas para algum tipo de configuração
>
> Nomeie a estrutura, coloque uma descrição sucinta e apresente um exemplo em formato JSON.
>
> **Orientações:**
>
> * [JSON Introduction](https://www.w3schools.com/js/js_json_intro.asp)
> * [Trabalhando com JSON - Aprendendo desenvolvimento web | MDN](https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Objects/JSON)

## Módulos e APIs

Esta seção apresenta os módulos e APIs utilizados na solução

**Images**:

* Unsplash - [https://unsplash.com/](https://unsplash.com/) ⚠️ EXEMPLO ⚠️

**Fonts:**

* Icons Font Face - [https://fontawesome.com/](https://fontawesome.com/) ⚠️ EXEMPLO ⚠️

**Scripts:**

* jQuery - [http://www.jquery.com/](http://www.jquery.com/) ⚠️ EXEMPLO ⚠️
* Bootstrap 4 - [http://getbootstrap.com/](http://getbootstrap.com/) ⚠️ EXEMPLO ⚠️

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente os módulos e APIs utilizados no desenvolvimento da solução. Inclua itens como: (1) Frameworks, bibliotecas, módulos, etc. utilizados no desenvolvimento da solução; (2) APIs utilizadas para acesso a dados, serviços, etc.

# Referências

1. ABNT NBR 6023. Informação e documentação - Referências - Elaboração. Rio de Janeiro: ABNT, 2018.

2. BRASIL. Secretaria de Estado de Justiça e Segurança Pública de Minas Gerais. Dados de criminalidade em Belo Horizonte (2025).

3. O TEMPO - Artigo sobre 8 furtos por hora em BH (23/05/2025)

4. O TEMPO - Artigo sobre moradores denunciando insegurança (10/06/2025)

5. Estado de Minas - Artigo sobre 272 furtos de celulares por dia no carnaval (06/03/2025)

---