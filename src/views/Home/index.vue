<template>
  <div class="home bg-background-light">
    <div class="home__container">
      <section class="home__banner bg-primary-base p-5 flex">
        <div class="container">
          <div class="home__banner-logo flex justify-center self-start">
            <router-link :to="{ name: 'Home' }">
              <img src="@/assets/logo.svg" alt="Perfil Político" />
            </router-link>
          </div>

          <div class="flex justify-center items-center h-4/5">
            <div>
              <div class="home__banner-content text-white font-bold uppercase">
                <div
                  class="home__banner-content-emphasis flex items-center flex-col md:flex-row mb-3 sm:justify-center"
                >
                  <div class="sm:pr-5 mb-4">
                    <img
                      src="@/assets/icons/icon-perfil-politico.svg"
                      alt="Ícone Perfil Político"
                    />
                  </div>
                  <div>
                    <h1
                      class="home__banner-content-emphasis_title text-white md:text-4xl uppercase md:text-left text-center text-xl"
                    >
                      Conheça o Perfil Político das <br class="hidden md:block" />
                      <span class="text-secondary-base"
                        >pessoas candidatas em 2022</span
                      >
                    </h1>
                  </div>
                </div>

                <div
                  class="home__banner-content-action flex flex-col w-full mt-6"
                >
                  <FormSearchCandidate></FormSearchCandidate>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-center text-white">
            <p class="font-regular md:text-lg sm:text-base">Por que usar o Perfil Político?</p>
            <svg
              class="md:w-6 md:h-6 w-4 h-4 animate__animated animate__bounce animate__infinite"
              fill="none"
              stroke="#FFFFFF"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </section>

      <section class="home__differentials bg-background-light relative px-5">
        <div class="container relative">
          <div
            class="home__differentials_content absolute bg-white text-center -top-16 p-10 rounded-3xl"
          >
            <h2
              class="home__differentials_title text-primary-base uppercase font-bold sm:text-4xl text-center text-xl"
            >
              Diferenciais do Perfil Político
            </h2>
            <div class="md:mt-16 mt-8 block lg:grid grid-flow-col xl:gap-36 gap-5">
              <div class="flex flex-col justify-start items-center lg:mb-0 mb-6">
                <img
                  src="@/assets/icons/icon-historico.svg"
                  alt="Visualização da trajetória política"
                  class="md:w-32 w-24"
                />
                <h4 class="text-primary-base md:text-xl font-bold my-3 text-base">
                  Visualização da trajetória política
                </h4>
                <p class="text-text-light font-regular md:text-base text-sm">
                  Você pode comparar e conhecer o histórico das milhares de
                  candidaturas, as mudanças de partido, eleições disputadas e
                  ganhas.
                </p>
              </div>
              <div class="flex flex-col justify-start items-center lg:mb-0 mb-6">
                <img
                  src="@/assets/icons/icon-patrimonio.svg"
                  alt="Patrimônio do candidato"
                  class="md:w-32 w-24"
                />
                <h4 class="text-primary-base md:text-xl font-bold my-3 text-base">
                  Histórico do patrimônio declarado
                </h4>
                <p class="text-text-light font-regular md:text-base text-sm">
                  A ficha de cada pessoa candidata apresenta o patrimônio
                  declarado patrimônio declarado ao longo de todas as eleições
                  disputadas e a comparação com o patrimônio das outras
                  candidaturas do mesmo ano.
                </p>
              </div>
              <div class="flex flex-col justify-start items-center lg:mb-0 mb-6">
                <img
                  src="@/assets/icons/icon-representatividade.svg"
                  alt="Análise de representatividade"
                  class="md:w-32 w-24"
                />
                <h4 class="text-primary-base md:text-xl font-bold my-3 text-base">
                  Análise de representatividade
                </h4>
                <p class="text-text-light font-regular md:text-base text-sm">
                  Veja como está a representatividade de gênero e cor/raça de
                  todas as candidaturas para um cargo - e se as pessoas, de
                  fato, representam você.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="home__about bg-background-light lg:mt-20">
        <div
          class="home__about-content container px-5 xl:grid xl:grid-cols-9 xl:gap-16 lg:py-20"
        >
          <div class="col-span-3 col-start-2 flex items-center justify-center sm:mb-10">
            <IconPP></IconPP>
          </div>
          <div
            class="col-span-4 flex flex-col justify-center xl:items-start items-center container"
          >
            <h2
              class="text-primary-base uppercase font-bold sm:text-4xl sm:text-left text-center text-xl"
            >
              Sobre o Perfil Político
            </h2>
            <p
              class="text-text-light my-10 sm:text-2xl xl:text-left text-center text-base font-regular"
            >
              O Perfil Político é uma plataforma desenvolvida pela Open
              Knowledge Brasil para tornar mais acessíveis as informações sobre
              a trajetória das pessoas candidatas. A ferramenta utiliza dados
              abertos por órgãos como o Tribunal Superior Eleitoral e a Receita
              Federal do Brasil e tem seu código aberto para colaboração. Com
              ela, a população pode consultar e comparar candidaturas do ponto
              de vista de gênero, raça/cor, dentre outras características.
            </p>
            <router-link
              type="button"
              class="text-primary-base uppercase font-bold bg-secondary-base hover:brightness-75 font-medium rounded-full text-sm px-12 py-4 text-center mr-2 mb-2 transition-colors"
              :to="{ name: 'About' }"
            >
              Saiba mais
            </router-link>
          </div>
        </div>
      </section>

      <section
        class="home__common-questions bg-background-light sm:py-20 py-10"
        id="perguntas-frequentes"
      >
        <div class="container px-5">
          <h2
            class="text-primary-base uppercase font-bold sm:text-4xl text-center text-xl sm:mb-16 mb-5"
          >
            PERGUNTAS FREQUENTES
          </h2>
          <Accordion
            title="Quais candidaturas posso analisar no Perfil Político?"
          >
            Você pode achar dados sobre todas as candidaturas aos cargos de
            deputado(a) federal, estadual e distrital, senador(a), governador(a)
            e presidente(a) nas eleições gerais de 2022.
          </Accordion>
          <Accordion
            title="Como faço para realizar uma comparação de candidaturas?"
          >
            Para fazer uma comparação entre pessoas candidatas ao mesmo cargo:
            <ol class="ml-8 mt-2 list-decimal">
              <li>
                Selecione um cargo e o estado (não se aplica em consulta de
                presidenciáveis ou deputado(a) distrital) e clique em “COMPARAR
                CANDIDATURAS”;
              </li>
              <li>
                No menu de “Filtros” (barra lateral em dispositivos de mesa e
                topo da tela em dispositivos móveis) é possível filtrar por
                partidos ou alterar o cargo ou estado escolhido;
              </li>
              <li>
                Acima da grade de candidaturas, ao expandir o menu de “Filtro
                por Análises”, em roxo, você poderá clicar nas perguntas que
                desejar e isso fará com que as candidaturas apresentadas na
                listagem correspondam apenas às perguntas realizadas. A análise
                da representatividade aparece em gráfico;
              </li>
              <li>
                A qualquer momento você pode clicar em uma pessoa candidata da
                grade e isso levará à página com informações detalhadas do
                perfil dela.
              </li>
            </ol>
          </Accordion>
          <Accordion title="Como utilizo a busca por nome?">
            Você pode buscar por uma candidatura específica selecionando um
            cargo e o estado (não se aplica em consulta de presidenciáveis ou
            deputado(a) distrital). Em seguida, digite o nome da pessoa no campo
            “TEM UMA PESSOA CANDIDATA EM MENTE?”, e selecione o nome da lista
            que aparece. Por fim, é só clicar no botão “BUSCAR” e visualizar o
            perfil da pessoa candidata.
          </Accordion>
          <Accordion title="Quem desenvolveu e mantém o Perfil Político?">
            A plataforma foi desenvolvida pelo programa
            <i>Ciência de Dados para Inovação Cívica</i> da
            <a
              href="https://ok.org.br/"
              target="_blank"
              class="font-bold hover:underline"
              >Open Knowledge Brasil</a
            >. Em 2018, a primeira versão da plataforma foi realizada em
            parceria com o site
            <a
              href="https://theintercept.com/brasil/"
              target="_blank"
              class="font-bold hover:underline"
              >The Intercept Brasil</a
            >
            e o
            <a
              href="https://brasil.io/home/"
              target="_blank"
              class="font-bold hover:underline"
              >Brasil.io</a
            >.
          </Accordion>
          <Accordion title="De onde vêm os dados do Perfil Político?">
            A fonte primária dos dados, ou seja, de onde eles foram retirados, é
            o Tribunal Superior Eleitoral (TSE). Outras fontes também são
            utilizadas, como a Câmara dos Deputados, o Senado Federal e a
            Receita Federal, e os dados estão disponíveis através da API para
            serem utilizados por outros projetos, como o
            <a
              href="https://parlametria.org.br/"
              target="_blank"
              class="font-bold hover:underline"
              >Parlametria</a
            >. Você pode obter esses dados, já organizados, no
            <a
              href="https://brasil.io/home/"
              target="_blank"
              class="font-bold hover:underline"
              >Brasil.io</a
            >, no
            <a
              href="https://github.com/cuducos/raspadorlegislativo"
              target="_blank"
              class="font-bold hover:underline"
              >Raspador Legislativo</a
            >
            e na
            <a
              href="https://serenata.ai/"
              target="_blank"
              class="font-bold hover:underline"
              >Operação Serenata de Amor</a
            >.
          </Accordion>
          <Accordion title="Quais dados são utilizados na plataforma?">
            A ficha dos candidatos reúne informações básicas como idade, gênero,
            cor/raça, escolaridade e ocupação, mas também dados sobre patrimônio
            declarado em todas as eleições disputadas, mudanças de partidos,
            histórico de candidaturas e de eleições ganhas.
          </Accordion>
          <Accordion
            title="Quando os dados foram coletados? Eles são atualizados com alguma periodicidade?"
          >
            <p>
              Os dados do TSE foram coletados pelo TSE estão sendo coletados
              continuamente à medida que estão sendo disponibilizados desde o
              início de agosto de 2022, logo após o TSE oficializar as
              candidaturas para as eleições gerais de 2022 e começar a
              disponibilizá-los em 20 de julho.
            </p>
            <p>
              A série histórica de filiação partidária deixou de ser publicada
              pelo TSE em razão da Lei Geral de Proteção de Dados (LGPD) em
              agosto de 2021. Apenas as filiações ativas passaram a ser
              disponibilizadas poucos meses antes das eleições. A última versão
              do histórico partidário armazenada pelo Perfil Político é do final
              de 2020 e as filiações atuais foram coletadas em agosto de 2022.
            </p>
            <p>
              Os dados da Câmara dos Deputados e do Senado Federal foram
              coletados em julho de 2022 e os dados da Receita Federal foram
              coletados em outubro de 2021.
            </p>
          </Accordion>
          <Accordion
            title="Encontrei dados na plataforma que estão diferentes dos dados encontrados no site do TSE, por quê?"
          >
            O TSE oferece duas formas para os cidadãos acessarem os dados. Um é
            um site navegável para humanos, o
            <a
              href="https://divulgacandcontas.tse.jus.br/divulga/#/"
              target="_blank"
              class="font-bold hover:underline"
              >Divulgação de Candidaturas e Contas Eleitorais</a
            >, outro é o
            <a
              href="https://dadosabertos.tse.jus.br/"
              target="_blank"
              class="font-bold hover:underline"
              >Portal de Dados Abertos</a
            >, que oferece dados em massa, legíveis por máquinas. Em raros casos
            o site diverge do portal, então existem chances da diferença ser uma
            inconsistência do próprio TSE ou uma atualização no portal que ainda
            não foi incorporada ao
            <span class="text-primary-base">Perfil Político</span>.
          </Accordion>
          <Accordion title="Como a plataforma é financiada?">
            O projeto foi desenvolvido com recursos da
            <a
              href="https://ok.org.br/"
              target="_blank"
              class="font-bold hover:underline"
              >Open Knowledge Brasil</a
            >. O
            <a
              href="https://theintercept.com/brasil/"
              target="_blank"
              class="font-bold hover:underline"
              >The Intercept Brasil</a
            >
            apoiou o projeto cobrindo os custos de infraestrutura tecnológica
            para armazenamento dos dados durante sua criação em 2018. Para que a
            equipe do projeto possa continuar aperfeiçoando esse e outros
            projetos do
            <i>Programa de Ciência de Dados para Inovação Cívica</i>, dependemos
            das contribuições dos nossos usuários, que podem doar pelo site
            <a
              href="https://apoia.se/serenata"
              target="_blank"
              class="font-bold hover:underline"
              >apoia.se/serenata</a
            >.
          </Accordion>
          <Accordion title="Qual o objetivo da ferramenta?">
            <p>
              <span class="text-primary-base">Perfil Político</span> é uma
              plataforma para comparar e conhecer o histórico das milhares de
              candidaturas às eleições. A ferramenta ajuda o eleitorado a
              selecionar as pessoas candidatas pelos seus perfis: você pode
              filtrar por pessoas novas e antigas na política. Pode ver como o
              seu estado está em termos de representatividade de gênero e
              cor/raça – e se as candidaturas, de fato, representam você.
            </p>
            <p>
              A ficha das pessoas candidatadas reúne informações básicas como
              idade, gênero, cor/raça, escolaridade e ocupação, mas também dados
              sobre patrimônio declarado em todas as eleições disputadas,
              mudanças de partidos, histórico de candidaturas e de eleições
              ganhas
            </p>
          </Accordion>
          <Accordion title="O código da plataforma é aberto?">
            Sim! Temos dois repositórios com o código que faz o
            <span class="text-primary-base">Perfil Político</span> funcionar. Um
            para a
            <a
              href="https://github.com/okfn-brasil/perfil-politico"
              target="_blank"
              class="font-bold hover:underline"
              >API</a
            >
            que é em Python (Django), e outro para a
            <a
              href="https://github.com/okfn-brasil/perfil-politico-frontend/"
              target="_blank"
              class="font-bold hover:underline"
              >interface</a
            >
            que é JavaScript (Vue), HTML e CSS.
          </Accordion>
        </div>
      </section>
    </div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import Footer from "@/components/Footer.vue";
import Accordion from "./Accordion.vue";
import FormSearchCandidate from "./FormSearchCandidate.vue";
import IconPP from "../../components/IconPP.vue";

export default {
  components: {
    Footer,
    Accordion,
    FormSearchCandidate,
    IconPP,
  },
};
</script>

<style lang="postcss">
.home__banner {
  @apply bg-no-repeat bg-center;
  background-image: url("../../assets/icons/mapa-brasil-bolhas.svg");
  min-height: 769px;
}
.home__banner::after {
  @apply bg-primary-base opacity-25;
}

.home__differentials {
  min-height: 400px;
}

@media (max-width: 1024px) {
  .home__about {
    @apply mt-2/3
  }
}

@media (max-width: 768px) {
  .home__about {
    @apply mt-96
  }
}

@media (max-width: 600px) {
  .home__banner {
    min-height: 900px;
  }
  .home__differentials {
    min-height: 880px;
  }
  .home__about {
    @apply mt-0
  }
}

@media (max-width: 425px) {
  .list-search {
    width: 350px;
  }
  
}
@media (max-width: 375px) {
  .list-search {
    width: 300px;
  }
  .home__about {
    @apply mt-20
  }
}
@media (max-width: 360px) {
  .home__about {
    @apply mt-20
  }
}
</style>
