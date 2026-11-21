export type CategoryId =
  | "canecas"
  | "tematicas"
  | "vestuario"
  | "casa"
  | "escritorio"
  | "brindes"
  | "eventos";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  cover: string;
}

export const CATEGORIES: Category[] = [
  { id: "canecas", name: "Canecas & Xícaras", blurb: "Branca, mágica, colorida, com colher…", cover: "caneca-personalizada" },
  { id: "tematicas", name: "Canecas com frase", blurb: "Flork, datas especiais e frases divertidas", cover: "caneca-pessoa-favorita" },
  { id: "vestuario", name: "Camisetas & Vestuário", blurb: "Camisetas, polos, bodies, bonés e aventais", cover: "raglan-branca" },
  { id: "casa", name: "Casa & Decoração", blurb: "Azulejos, almofadas, quebra-cabeças", cover: "azulejo" },
  { id: "escritorio", name: "Escritório & Papelaria", blurb: "Agendas, cadernos, crachás, canetas", cover: "agenda" },
  { id: "brindes", name: "Brindes & Lembranças", blurb: "Chaveiros, squeezes, copos, cofrinhos", cover: "squeeze" },
  { id: "eventos", name: "Convites & Eventos", blurb: "Convites, impressos e lembrancinhas", cover: "cofrinho" },
];

/** How the live preview draws the product while the customer personalizes it. */
export type Mockup = "mug" | "shirt" | "square" | "photo";

export interface OptionChoice {
  label: string;
  /** Product color shown in the swatch and in the preview. */
  color?: string;
}

export interface ProductOption {
  id: string;
  label: string;
  choices: OptionChoice[];
  /** Only ask this option when another option has one of these values. */
  showWhen?: { option: string; values: string[] };
}

export function visibleOptions(product: Product, selections: Record<string, string>): ProductOption[] {
  return (product.options ?? []).filter((o) => {
    if (!o.showWhen) return true;
    const current = selections[o.showWhen.option];
    return current !== undefined && o.showWhen.values.includes(current);
  });
}

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  /** Reference price in BRL from the catalog. Absent = "sob consulta". */
  price?: number;
  oldPrice?: number;
  /** Shows "a partir de" before the price. */
  fromPrice?: boolean;
  unitNote?: string;
  image?: string;
  description: string;
  mockup: Mockup;
  options?: ProductOption[];
  textLabel?: string;
  featured?: boolean;
}

const MUG_COLORS: OptionChoice[] = [
  { label: "Vermelha", color: "oklch(0.6 0.22 27)" },
  { label: "Rosa", color: "oklch(0.74 0.17 350)" },
  { label: "Azul", color: "oklch(0.6 0.15 245)" },
  { label: "Azul-claro", color: "oklch(0.8 0.1 220)" },
  { label: "Verde", color: "oklch(0.7 0.17 145)" },
  { label: "Amarela", color: "oklch(0.88 0.16 95)" },
  { label: "Laranja", color: "oklch(0.75 0.17 55)" },
  { label: "Preta", color: "oklch(0.22 0.01 255)" },
];

const SHIRT_COLORS: OptionChoice[] = [
  { label: "Branca", color: "oklch(0.99 0 0)" },
  { label: "Preta", color: "oklch(0.2 0.01 255)" },
  { label: "Azul-marinho", color: "oklch(0.32 0.08 260)" },
  { label: "Vermelha", color: "oklch(0.58 0.21 27)" },
  { label: "Rosa", color: "oklch(0.8 0.1 355)" },
  { label: "Amarela", color: "oklch(0.88 0.16 95)" },
  { label: "Verde", color: "oklch(0.62 0.15 150)" },
  { label: "Cinza", color: "oklch(0.7 0.01 255)" },
];

const ADULT_SIZES: ProductOption = {
  id: "tamanho",
  label: "Tamanho",
  choices: ["P", "M", "G", "GG", "XG"].map((label) => ({ label })),
};

const PRINT_SIDE: ProductOption = {
  id: "estampa",
  label: "Local da estampa",
  choices: [{ label: "Frente" }, { label: "Costas" }, { label: "Frente e costas" }],
};

const themed = (
  slug: string,
  name: string,
  image: string,
  price: number,
  oldPrice: number,
  featured = false,
): Product => ({
  slug,
  name,
  category: "tematicas",
  price,
  oldPrice,
  image,
  mockup: "photo",
  description:
    "Caneca de porcelana com arte pronta. Se quiser, colocamos um nome ou recado especial junto da estampa.",
  textLabel: "Nome ou recado (opcional)",
  featured,
});

export const PRODUCTS: Product[] = [
  // Canecas & Xícaras
  {
    slug: "caneca-personalizada",
    name: "Caneca Personalizada",
    category: "canecas",
    price: 35,
    fromPrice: true,
    image: "caneca-personalizada",
    mockup: "mug",
    featured: true,
    description:
      "Caneca de porcelana 100% personalizada com sua foto, logo, frase ou arte criada por nós. Escolha o modelo e veja a prévia.",
    options: [
      {
        id: "modelo",
        label: "Modelo",
        choices: [
          { label: "Branca" },
          { label: "Alça e interior coloridos" },
          { label: "Colorida" },
          { label: "Tarja preta" },
          { label: "Pequena (cafezinho)" },
          { label: "Com colher" },
        ],
      },
      {
        id: "cor",
        label: "Cor",
        choices: MUG_COLORS,
        showWhen: { option: "modelo", values: ["Alça e interior coloridos", "Colorida"] },
      },
    ],
    textLabel: "Nome ou frase na caneca",
  },
  {
    slug: "caneca-alca-coracao",
    name: "Caneca com Alça de Coração",
    category: "canecas",
    price: 44.99,
    image: "caneca-alca-coracao",
    mockup: "mug",
    featured: true,
    description: "Caneca de porcelana com alça em formato de coração e interior colorido. Perfeita para presentear quem você ama.",
    options: [{ id: "cor", label: "Cor da alça", choices: MUG_COLORS.slice(0, 7) }],
    textLabel: "Nome ou frase na caneca",
  },
  {
    slug: "caneca-magica",
    name: "Caneca Mágica de Porcelana",
    category: "canecas",
    price: 70,
    image: "caneca-magica",
    mockup: "mug",
    featured: true,
    description: "Preta por fora — ao receber bebida quente, revela a sua foto ou mensagem. Um presente que surpreende.",
    textLabel: "Mensagem revelada",
  },
  {
    slug: "caneca-aluminio",
    name: "Caneca de Alumínio",
    category: "canecas",
    price: 50,
    image: "caneca-aluminio",
    mockup: "photo",
    description: "Caneca de alumínio com mosquetão, leve e resistente. Ótima para trilhas, academia e brindes.",
    textLabel: "Nome ou frase",
  },
  {
    slug: "xicara-com-pires",
    name: "Xícara com Pires Personalizada",
    category: "canecas",
    price: 69.99,
    image: "xicara",
    mockup: "photo",
    description: "Conjunto de xícara e pires em porcelana com sua ideia ou logo. Elegante para presentes e cafeterias.",
    textLabel: "Nome, frase ou logo",
  },

  // Canecas com frase
  themed("caneca-dia-das-maes", "Caneca Dia das Mães", "caneca-maes", 35, 35, true),
  themed("caneca-flork-pessoa-favorita", "Caneca Flork Pessoa Favorita", "caneca-pessoa-favorita", 35, 50, true),
  themed("caneca-flork", "Caneca Flork “Eu te amo”", "caneca-flork", 35, 50),
  themed("caneca-flork-sempre-certo", "Caneca Flork “Sr. Sempre Certo”", "caneca-sempre-certo", 35, 50),
  themed("caneca-flork-gravidinha", "Caneca Flork Gravidinha", "caneca-flork-gravidinha", 40, 60),
  themed("caneca-mae-on-off", "Caneca “Mãe On / Off”", "caneca-mae-off", 40, 60),
  themed("caneca-dona-da-verdade", "Caneca “Sra. Dona da Verdade”", "caneca-dona-verdade", 45, 50),
  themed("caneca-patoda-vida", "Caneca “Te amo pato da vida”", "caneca-patoda", 35, 50),
  themed("caneca-tatudo-bem", "Caneca “Com você tá tudo bem”", "caneca-tatudo", 35, 50),
  themed("caneca-nao-e-porco", "Caneca “Te amo e não é porco”", "caneca-porco", 35, 50),
  themed("caneca-nao-lavo-o-pe", "Caneca “Por você eu lavo até o pé”", "caneca-lavo-pe", 35, 50),
  themed("caneca-nao-toque", "Caneca “Não toque na minha caneca”", "caneca-nao-toque", 35, 58),
  themed("caneca-bob-esponja", "Caneca Bob Esponja", "caneca-bob", 40, 60),
  themed("caneca-bob-esponja-patrick", "Caneca Bob Esponja e Patrick", "caneca-bob-patrick", 40, 60),

  // Vestuário
  {
    slug: "camiseta-branca",
    name: "Camiseta Branca Personalizada",
    category: "vestuario",
    price: 50,
    image: "camiseta-branca",
    mockup: "shirt",
    featured: true,
    description: "Camiseta branca com estampa da sua foto, logo ou frase. Ideal para aniversários, formaturas e eventos.",
    options: [ADULT_SIZES, PRINT_SIDE],
    textLabel: "Frase ou nome na estampa",
  },
  {
    slug: "camiseta-colorida",
    name: "Camiseta Colorida",
    category: "vestuario",
    price: 65,
    image: "camiseta-colorida",
    mockup: "shirt",
    description: "Camiseta colorida personalizada. Consulte as cores disponíveis no momento do pedido.",
    options: [{ id: "cor", label: "Cor da camiseta", choices: SHIRT_COLORS.slice(1) }, ADULT_SIZES, PRINT_SIDE],
    textLabel: "Frase ou nome na estampa",
  },
  {
    slug: "camiseta-raglan-mangas-coloridas",
    name: "Camiseta Raglan Branca com Mangas Coloridas",
    category: "vestuario",
    price: 65,
    image: "raglan-branca",
    mockup: "shirt",
    description: "Raglan branca com mangas coloridas — clássica para equipes, festas e encontros de família.",
    options: [{ id: "manga", label: "Cor da manga", choices: SHIRT_COLORS.slice(1) }, ADULT_SIZES, PRINT_SIDE],
    textLabel: "Frase ou nome na estampa",
  },
  {
    slug: "camiseta-raglan-poliester",
    name: "Camiseta Poliéster Raglan",
    category: "vestuario",
    price: 70,
    image: "raglan-poliester",
    mockup: "shirt",
    description: "Raglan em poliéster com estampa total ou parcial. Leve e confortável.",
    options: [{ id: "manga", label: "Cor da manga", choices: SHIRT_COLORS.slice(1) }, ADULT_SIZES, PRINT_SIDE],
    textLabel: "Frase ou nome na estampa",
  },
  {
    slug: "camisa-polo",
    name: "Camisa Polo",
    category: "vestuario",
    price: 90,
    fromPrice: true,
    image: "polo-branca",
    mockup: "shirt",
    description: "Camisa polo personalizada com logo bordado ou estampado. Disponível em 2 cores.",
    options: [{ id: "cor", label: "Cor", choices: SHIRT_COLORS.slice(0, 2) }, ADULT_SIZES],
    textLabel: "Nome da empresa ou texto",
  },
  {
    slug: "body-colorido",
    name: "Body Colorido Personalizado (P ao GG)",
    category: "vestuario",
    price: 65,
    image: "body-colorido",
    mockup: "shirt",
    description: "Body de bebê colorido com estampa personalizada. Tamanhos do P ao GG.",
    options: [
      { id: "cor", label: "Cor", choices: SHIRT_COLORS.slice(1) },
      { id: "tamanho", label: "Tamanho", choices: ["P", "M", "G", "GG"].map((label) => ({ label })) },
    ],
    textLabel: "Nome do bebê ou frase",
  },
  {
    slug: "body-branco",
    name: "Body Branco Personalizado",
    category: "vestuario",
    image: "body-branco",
    mockup: "shirt",
    description: "Body branco com a estampa que você quiser — mesversário, chá revelação e lembranças.",
    options: [{ id: "tamanho", label: "Tamanho", choices: ["P", "M", "G", "GG"].map((label) => ({ label })) }],
    textLabel: "Nome do bebê ou frase",
  },
  {
    slug: "avental",
    name: "Avental Personalizado",
    category: "vestuario",
    price: 70,
    image: "avental",
    mockup: "photo",
    description: "Avental branco ou preto com nome, logo ou frase. Para churrasqueiros, chefs e negócios.",
    options: [{ id: "cor", label: "Cor", choices: [SHIRT_COLORS[0]!, SHIRT_COLORS[1]!] }],
    textLabel: "Nome ou frase",
  },
  {
    slug: "bone",
    name: "Boné Personalizado",
    category: "vestuario",
    image: "bone",
    mockup: "photo",
    description: "Boné trucker com sua logo ou foto. Diversas cores de tela disponíveis.",
    textLabel: "Logo ou texto",
  },
  {
    slug: "bone-12-unidades",
    name: "Boné Personalizado — 12 unidades",
    category: "vestuario",
    price: 270,
    unitNote: "kit com 12",
    image: "bone-12",
    mockup: "photo",
    description: "Kit com 12 bonés personalizados. Ótimo para equipes, eventos e empresas.",
    textLabel: "Logo ou texto",
  },

  // Casa & Decoração
  {
    slug: "azulejo-personalizado",
    name: "Azulejo Personalizado",
    category: "casa",
    price: 40,
    fromPrice: true,
    image: "azulejo",
    mockup: "square",
    featured: true,
    description: "Azulejo com suporte, estampado com sua foto, frase ou arte. Decora e emociona.",
    textLabel: "Frase no azulejo",
  },
  {
    slug: "sua-foto-no-azulejo",
    name: "Sua Foto no Azulejo",
    category: "casa",
    price: 70,
    oldPrice: 100,
    image: "azulejo-foto",
    mockup: "square",
    description: "Personalize seu azulejo com a sua foto favorita. Acompanha suporte.",
    textLabel: "Legenda (opcional)",
  },
  {
    slug: "almofada",
    name: "Almofada Personalizada",
    category: "casa",
    price: 65,
    fromPrice: true,
    image: "almofada",
    mockup: "square",
    description: "Almofada com foto ou frase. Disponível em 2 cores.",
    textLabel: "Frase na almofada",
  },
  {
    slug: "quebra-cabeca",
    name: "Quebra-cabeça Personalizado",
    category: "casa",
    price: 44.99,
    fromPrice: true,
    image: "quebra-cabeca",
    mockup: "square",
    description: "Quebra-cabeça com a sua foto. Escolha a quantidade de peças.",
    options: [{ id: "pecas", label: "Peças", choices: [{ label: "24 peças" }, { label: "48 peças" }, { label: "60 peças" }] }],
    textLabel: "Frase (opcional)",
  },
  {
    slug: "toalhinhas",
    name: "Toalhinhas Personalizadas",
    category: "casa",
    price: 20,
    image: "toalhinhas",
    mockup: "photo",
    description: "Toalhinhas com nome bordado ou estampado. Lembrança útil para eventos.",
    textLabel: "Nome ou frase",
  },

  // Escritório & Papelaria
  {
    slug: "agenda",
    name: "Agenda Personalizada",
    category: "escritorio",
    price: 74.9,
    image: "agenda",
    mockup: "photo",
    featured: true,
    description: "Agenda com capa personalizada — seu nome, foto ou logo da empresa.",
    textLabel: "Nome na capa",
  },
  {
    slug: "caderno",
    name: "Caderno Personalizado",
    category: "escritorio",
    price: 59.9,
    image: "caderno",
    mockup: "photo",
    description: "Caderno com capa personalizada, ideal para escola, faculdade e empresas.",
    textLabel: "Nome na capa",
  },
  {
    slug: "bloquinho",
    name: "Bloquinho Personalizado",
    category: "escritorio",
    price: 18,
    image: "bloquinho",
    mockup: "photo",
    description: "Bloquinho de anotações com arte personalizada. Ótimo como lembrança.",
    textLabel: "Frase ou nome",
  },
  {
    slug: "cracha",
    name: "Crachá Personalizado",
    category: "escritorio",
    price: 30,
    image: "cracha",
    mockup: "photo",
    description: "Crachá com nome, foto e logo da empresa.",
    textLabel: "Nome e cargo",
  },
  {
    slug: "cracha-cordao-10",
    name: "Crachá + Cordão — 10 unidades",
    category: "escritorio",
    price: 340,
    unitNote: "kit com 10",
    image: "cracha-cordao",
    mockup: "photo",
    description: "Kit com 10 crachás personalizados e cordões. Envie a lista de nomes pelo WhatsApp.",
    textLabel: "Nome da empresa",
  },
  {
    slug: "cordinha-cracha",
    name: "Cordinha p/ Crachá Personalizada",
    category: "escritorio",
    price: 15,
    image: "cordinha-cracha",
    mockup: "photo",
    description: "Cordão para crachá com estampa personalizada.",
    textLabel: "Texto ou logo",
  },
  {
    slug: "mousepad",
    name: "Mousepad Personalizado",
    category: "escritorio",
    price: 29.99,
    image: "mousepad",
    mockup: "square",
    description: "Mousepad com sua foto ou logo.",
    textLabel: "Frase ou nome",
  },
  {
    slug: "mousepad-10",
    name: "Mousepad Personalizado — 10 unidades",
    category: "escritorio",
    price: 180,
    unitNote: "kit com 10",
    image: "mousepad-10",
    mockup: "square",
    description: "Kit com 10 mousepads personalizados para empresas e eventos.",
    textLabel: "Nome da empresa",
  },
  {
    slug: "caneta",
    name: "Caneta Personalizada",
    category: "escritorio",
    price: 5,
    image: "caneta",
    mockup: "photo",
    description: "Caneta com nome ou logo — brinde barato e útil.",
    textLabel: "Nome ou logo",
  },
  {
    slug: "etiquetas",
    name: "Etiquetas Personalizadas",
    category: "escritorio",
    price: 10,
    image: "etiquetas-redondas",
    mockup: "photo",
    description: "Cartela de etiquetas personalizadas para lembrancinhas, embalagens e material escolar.",
    textLabel: "Texto da etiqueta",
  },
  {
    slug: "cartao-de-visita",
    name: "Cartão de Visita — 1.000 unidades",
    category: "escritorio",
    price: 170,
    unitNote: "1.000 un.",
    image: "cartao-visita",
    mockup: "photo",
    description: "1.000 cartões de visita personalizados. Criamos a arte para você.",
    textLabel: "Nome, cargo e contato",
  },

  // Brindes & Lembranças
  {
    slug: "chaveiros",
    name: "Chaveiros Personalizados",
    category: "brindes",
    price: 10,
    image: "chaveiros",
    mockup: "photo",
    featured: true,
    description: "Chaveiros com foto ou arte. Lembrança querida para festas e eventos.",
    textLabel: "Nome ou frase",
  },
  {
    slug: "squeeze",
    name: "Squeeze de Alumínio",
    category: "brindes",
    price: 50,
    image: "squeeze",
    mockup: "photo",
    description: "Garrafa squeeze de alumínio personalizada.",
    textLabel: "Nome ou frase",
  },
  {
    slug: "porta-latao",
    name: "Porta Latão de Alumínio",
    category: "brindes",
    price: 50,
    image: "porta-latao",
    mockup: "photo",
    description: "Porta latão térmico de alumínio com personalização.",
    textLabel: "Nome ou frase",
  },
  {
    slug: "kit-30-copos",
    name: "Kit 30 Copos",
    category: "brindes",
    price: 180,
    unitNote: "kit com 30",
    image: "kit-copos",
    mockup: "photo",
    description: "Kit com 30 copos coloridos personalizados — sucesso em festas e formaturas.",
    textLabel: "Nome ou tema da festa",
  },
  {
    slug: "porta-copos",
    name: "Porta Copos Personalizado",
    category: "brindes",
    price: 18,
    image: "porta-copos",
    mockup: "photo",
    description: "Porta copos com sua logo ou arte.",
    textLabel: "Texto ou logo",
  },
  {
    slug: "porta-copos-latex",
    name: "Porta Copos Látex Personalizado",
    category: "brindes",
    price: 14.99,
    image: "porta-copos-latex",
    mockup: "photo",
    description: "Porta copos em látex com estampa personalizada.",
    textLabel: "Texto ou logo",
  },
  {
    slug: "chinelo",
    name: "Chinelo Personalizado",
    category: "brindes",
    price: 34.99,
    image: "chinelo",
    mockup: "photo",
    description: "Chinelo com estampa personalizada — clássico de casamentos e festas.",
    options: [
      {
        id: "tamanho",
        label: "Numeração",
        choices: ["33/34", "35/36", "37/38", "39/40", "41/42", "43/44"].map((label) => ({ label })),
      },
    ],
    textLabel: "Nome ou frase",
  },
  {
    slug: "lixeira-carro",
    name: "Lixeira p/ Carro Personalizada",
    category: "brindes",
    price: 15,
    image: "lixeira-carro",
    mockup: "photo",
    description: "Lixeirinha para carro com logo — brinde ideal para empresas e oficinas.",
    textLabel: "Logo ou texto",
  },

  // Convites & Eventos
  {
    slug: "cofrinho",
    name: "Cofrinho Personalizado",
    category: "eventos",
    price: 4,
    image: "cofrinho",
    mockup: "photo",
    description: "Cofrinho colorido com etiqueta personalizada. Lembrancinha de aniversário infantil.",
    textLabel: "Nome e tema da festa",
  },
  {
    slug: "ima",
    name: "Ímã Personalizado",
    category: "eventos",
    price: 3.5,
    image: "ima",
    mockup: "photo",
    description: "Ímã de geladeira 5×10 cm com calendário ou foto. Lembrança para eventos e empresas.",
    textLabel: "Texto do ímã",
  },
  {
    slug: "convites-e-impressos",
    name: "Convites e Impressos",
    category: "eventos",
    mockup: "photo",
    description:
      "Convites de aniversário, casamento, formatura e chá de bebê, além de outros impressos. Criamos a arte do seu jeito.",
    options: [
      {
        id: "ocasiao",
        label: "Ocasião",
        choices: [
          { label: "Aniversário" },
          { label: "Casamento" },
          { label: "Formatura" },
          { label: "Chá de bebê" },
          { label: "Outro" },
        ],
      },
    ],
    textLabel: "Nomes, data e local do evento",
  },
  {
    slug: "lembrancas-para-eventos",
    name: "Lembranças para Eventos",
    category: "eventos",
    mockup: "photo",
    description:
      "Kits de lembrancinhas personalizadas para aniversários, casamentos, formaturas e datas comemorativas. Conte sua ideia!",
    options: [
      {
        id: "ocasiao",
        label: "Ocasião",
        choices: [
          { label: "Aniversário" },
          { label: "Casamento" },
          { label: "Formatura" },
          { label: "Batizado" },
          { label: "Empresa" },
          { label: "Outro" },
        ],
      },
    ],
    textLabel: "Tema e quantidade de convidados",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function productsIn(category: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export const OCCASIONS = [
  "Aniversários",
  "Casamentos",
  "Formaturas",
  "Dia das Mães",
  "Dia dos Namorados",
  "Natal",
  "Chá de bebê",
  "Empresas",
];
