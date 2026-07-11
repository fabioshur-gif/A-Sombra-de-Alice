const STORY = {
  // ===================================================================
  // CAPÍTULO 1 — A CHEGADA
  // ===================================================================
  "start": {
    speaker: "Narrador",
    text: "O motor do carro morre com um engasgo metálico. Diante de você, sob a névoa espessa que escorre pelas montanhas como sangue de um ferimento antigo, ergue-se o casarão da família Vance.",
    background: "bg-outside-fog",
    audio: "drone_creepy",
    location: "Estrada — Entrada do Casarão",
    choices: [
      { text: "Sair do carro e encarar a casa", target: "outside_house" }
    ]
  },

  "outside_house": {
    speaker: "Clara",
    text: "Cinco anos... Cinco longos anos desde que minha irmã gêmea, Alice, desapareceu sem deixar rastros. A polícia desistiu. Meus pais enlouqueceram de dor. Mas eu sei que a resposta está aqui dentro. Ela sempre esteve aqui.",
    background: "bg-outside-house",
    character: { left: "clara", focus: "left" },
    location: "Casarão Vance — Fachada",
    choices: [
      { text: "Procurar a chave sob o vaso de flores", target: "find_key_pot" },
      { text: "Olhar através da janela empoeirada", target: "peer_window" },
      { text: "Tentar empurrar a porta — destrancada?", target: "try_door_direct" }
    ]
  },

  "try_door_direct": {
    speaker: "Narrador",
    text: "A maçaneta gira... mas a porta está travada por dentro com uma trava pesada. Você precisará de uma chave ou outra entrada.",
    background: "bg-outside-house",
    character: { left: "clara", focus: "none" },
    location: "Casarão Vance — Fachada",
    choices: [
      { text: "Procurar a chave sob o vaso de flores", target: "find_key_pot" },
      { text: "Olhar através da janela empoeirada", target: "peer_window" }
    ]
  },

  "find_key_pot": {
    speaker: "Narrador",
    text: "Você se abaixa perto dos degraus da varanda. Sob um vaso de cerâmica rachado e cheio de terra ressecada, seus dedos tocam o metal frio de uma velha chave de bronze com um laço vermelho desbotado.",
    background: "bg-outside-house",
    audio: "key_found",
    character: { left: "clara", focus: "none" },
    location: "Casarão Vance — Varanda",
    onEnter: (state) => { state.hasKey = true; },
    clue: { title: "🔑 Chave de Bronze", text: "Encontrada sob o vaso na varanda. Tem um laço vermelho desbotado. Era de quem?" },
    choices: [
      { text: "Usar a chave para abrir a porta principal", target: "enter_hallway" }
    ]
  },

  "peer_window": {
    speaker: "Narrador",
    text: "Você limpa a poeira do vidro com a manga do casaco e espia a escuridão lá dentro. Por uma fração de segundo, um vulto pálido e distorcido passa correndo pelo corredor, parando por um instante — e olhando diretamente para você.",
    background: "bg-outside-window",
    effect: "glitch",
    audio: "jumpscare_short",
    textSpeed: 50,
    character: { left: "clara", focus: "left" },
    location: "Casarão Vance — Janela Lateral",
    onEnter: (state) => { 
      state.sawShadow = true; 
      state.sanity = Math.max(0, state.sanity - 15);
    },
    choices: [
      { text: "Recuar assustada e respirar fundo", target: "outside_after_shock" }
    ]
  },

  "outside_after_shock": {
    speaker: "Clara",
    text: "O-o que foi aquilo? Havia alguém... ou algo lá dentro. Minhas mãos estão tremendo. Mas não posso voltar agora. Alice pode estar lá dentro. Eu preciso entrar.",
    background: "bg-outside-house",
    character: { left: "clara", focus: "left" },
    location: "Casarão Vance — Fachada",
    choices: [
      { text: "Procurar a chave sob o vaso", target: "find_key_pot" },
      { text: "Forçar a janela lateral", target: "enter_via_window" }
    ]
  },

  "enter_via_window": {
    speaker: "Narrador",
    text: "Você força o trinco enferrujado da janela lateral com um galho. A madeira reclama, mas cede. Você escorrega para dentro e cai no chão empoeirado de um pequeno corredor de serviço.",
    background: "bg-hallway",
    audio: "drone_tense",
    character: { left: "clara", focus: "none" },
    location: "Casarão Vance — Corredor de Serviço",
    onEnter: (state) => { state.sanity = Math.max(0, state.sanity - 5); },
    choices: [
      { text: "Avançar pelo corredor", target: "enter_hallway" }
    ]
  },

  // ===================================================================
  // HALL DE ENTRADA
  // ===================================================================
  "enter_hallway": {
    speaker: "Narrador",
    text: "A porta range ao abrir, revelando um hall de entrada mergulhado em sombras pesadas. O ar cheira a mofo, madeira podre e... algo sutilmente adocicado. Como flores em decomposição, ou cabelos molhados.",
    background: "bg-hallway",
    audio: "drone_tense",
    character: { left: "clara", focus: "none" },
    location: "Casarão Vance — Hall Principal",
    choices: [
      { text: "Explorar a Sala de Estar à esquerda", target: "living_room" },
      { text: "Subir as escadas rangentes para o segundo andar", target: "stairs_choice" },
      { text: "Examinar o quadro de chaves na parede", target: "examine_key_board" }
    ]
  },

  "examine_key_board": {
    speaker: "Clara",
    text: "Um quadro antigo de madeira com ganchos de latão. Vários estão vazios. Mas um gancho tem uma etiqueta: 'Sótão — Victor'. A chave não está mais lá. Alguém a tirou recentemente — a poeira ao redor do gancho foi perturbada.",
    background: "bg-hallway",
    character: { left: "clara", focus: "left" },
    location: "Casarão Vance — Hall Principal",
    onEnter: (state) => { state.sawKeyBoard = true; },
    clue: { title: "🗝️ Chave do Sótão", text: "O gancho 'Sótão — Victor' está vazio. A chave foi removida recentemente. Quem entrou lá?" },
    choices: [
      { text: "Continuar explorando o hall", target: "enter_hallway" }
    ]
  },

  // ===================================================================
  // SALA DE ESTAR
  // ===================================================================
  "living_room": {
    speaker: "Narrador",
    text: "A sala de estar está congelada no tempo. Lençóis brancos cobrem os móveis como fantasmas silenciosos. Na lareira apagada, repousa o retrato emoldurado da família Vance — todos os quatro, sorrindo.",
    background: "bg-living-room",
    character: { left: "clara", focus: "none" },
    location: "Casarão Vance — Sala de Estar",
    choices: [
      { text: "Examinar o retrato de família", target: "examine_portrait" },
      { text: "Procurar nas gavetas da escrivaninha", target: "examine_desk" },
      { text: "Inspecionar a lareira fria", target: "examine_fireplace" }
    ]
  },

  "examine_fireplace": {
    speaker: "Clara",
    text: "A lareira está fria há anos. Mas há cinzas recentes no centro — alguém queimou algo aqui. Entre as cinzas, você distingue fragmentos de papel com escrita à mão. Quase ilegível, mas dá pra ver: '...não foi acidente...ALICE...'",
    background: "bg-living-room",
    character: { left: "clara", focus: "left" },
    location: "Casarão Vance — Sala de Estar",
    onEnter: (state) => { 
      state.foundAshes = true;
      state.sanity = Math.max(0, state.sanity - 10);
    },
    clue: { title: "🔥 Cinzas na Lareira", text: "Alguém queimou documentos recentemente. Os fragmentos legíveis dizem '...não foi acidente...ALICE...'" },
    choices: [
      { text: "Voltar a explorar a sala", target: "living_room" }
    ]
  },

  "examine_portrait": {
    speaker: "Clara",
    text: "Olhe para nós... Éramos tão felizes antes. Papai sempre tão sério, mamãe com o sorriso forçado. E Alice ao meu lado, tão pequena. Notei algo gravado na parte de trás da moldura: 'O Aniversário de Alice — Nosso dia de luz — 10/12'. Uma data. Por que a esconderam?",
    background: "bg-portrait-zoom",
    character: { left: "clara", focus: "left" },
    location: "Sala de Estar — Retrato Familiar",
    onEnter: (state) => { state.checkedPortrait = true; },
    clue: { title: "🖼️ Retrato Familiar", text: "Atrás do retrato: 'Aniversário de Alice — 10/12'. Uma data gravada em segredo." },
    choices: [
      { text: "Voltar para o centro da sala", target: "living_room_center" }
    ]
  },

  "examine_desk": {
    speaker: "Narrador",
    text: "Você abre as gavetas emperradas da velha escrivaninha. Entre papéis amarelados e contas antigas, você encontra uma gaveta central trancada por uma fechadura eletrônica com display digital.",
    background: "bg-living-room",
    character: { left: "clara", focus: "none" },
    location: "Sala de Estar — Escrivaninha",
    choices: [
      { 
        text: "Usar a chave de bronze (se tiver)", 
        target: "unlock_desk_success", 
        condition: (state) => state.hasKey 
      },
      { text: "Digitar senha numérica de 4 dígitos", target: "puzzle_desk" },
      { text: "Forçar a gaveta com as mãos", target: "unlock_desk_fail" },
      { text: "Deixar para lá e voltar", target: "living_room_center" }
    ]
  },

  "puzzle_desk": {
    speaker: "Narrador",
    text: "A gaveta possui um painel digital de 4 dígitos. Você precisa da senha certa para abrir.",
    background: "bg-living-room",
    location: "Sala de Estar — Escrivaninha",
    puzzle: {
      password: "1012",
      success: "unlock_desk_success",
      fail: "unlock_desk_fail",
      hint: "Pense na data especial de Alice..."
    }
  },

  "unlock_desk_success": {
    speaker: "Narrador",
    text: "A gaveta abre com um clique metálico suave. Dentro, cuidadosamente guardados, há um diário encadernado em couro escuro com as iniciais 'A.V.' douradas, e uma robusta lanterna de metal. Ambos aguardavam por você.",
    background: "bg-living-room",
    audio: "item_get",
    character: { left: "clara", focus: "none" },
    location: "Sala de Estar — Escrivaninha",
    onEnter: (state) => { 
      state.hasDiary = true; 
      state.hasFlashlight = true;
    },
    clue: { title: "📖 Diário de Alice", text: "Diário encadernado em couro com as iniciais A.V. Encontrado na gaveta secreta da escrivaninha." },
    choices: [
      { text: "Ler uma página do diário de Alice", target: "read_diary" },
      { text: "Guardar tudo e voltar", target: "living_room_center" }
    ]
  },

  "read_diary": {
    speaker: "Diário de Alice",
    text: "\"12 de Outubro: Ele está no sótão de novo. Papai acha que são ratos, mas ratos não chamam meu nome. Ele diz que se eu for com ele para as sombras, a dor na minha cabeça vai sumir para sempre. Clara não acredita em mim. Ela acha que estou louca como o papai insiste.\"",
    background: "bg-diary-zoom",
    character: { left: "clara", focus: "none" },
    textSpeed: 45,
    location: "Sala de Estar — Diário de Alice",
    onEnter: (state) => { state.readDiary = true; },
    clue: { title: "📝 Entrada do Diário — 12/10", text: "Alice ouvia uma entidade no sótão que chamava seu nome. Sentia dor na cabeça. Pai Victor dizia que ela era louca." },
    choices: [
      { text: "Fechar o diário com um aperto no coração", target: "read_diary_page2" }
    ]
  },

  "read_diary_page2": {
    speaker: "Diário de Alice",
    text: "\"15 de Outubro: Papai me trancou no quarto hoje. Disse que estou 'piorando'. Mas eu não estou doente. Estou COM MEDO. Clara... eu sei que você vai encontrar isso um dia. Se isso acontecer, significa que fui buscar o que ele prometeu. Não me culpe. E não me siga.\"",
    background: "bg-diary-zoom",
    character: { left: "clara", focus: "none" },
    textSpeed: 50,
    location: "Sala de Estar — Diário de Alice",
    choices: [
      { text: "Fechar o diário com mãos trêmulas", target: "living_room_center" }
    ]
  },

  "unlock_desk_fail": {
    speaker: "Narrador",
    text: "A gaveta não se move. O visor digital pisca em vermelho: SENHA INCORRETA. Uma sensação de frustração amarga invade seu peito.",
    background: "bg-living-room",
    character: { left: "clara", focus: "none" },
    location: "Sala de Estar — Escrivaninha",
    onEnter: (state) => {
      state.sanity = Math.max(0, state.sanity - 5);
    },
    choices: [
      { text: "Tentar a senha novamente", target: "examine_desk" },
      { text: "Desistir e voltar para o centro da sala", target: "living_room_center" }
    ]
  },

  "living_room_center": {
    speaker: "Clara",
    text: "Não há muito mais o que ver aqui. O frio desta sala está ficando insuportável. Como se o ar em si não quisesse minha presença.",
    background: "bg-living-room",
    character: { left: "clara", focus: "left" },
    location: "Casarão Vance — Sala de Estar",
    choices: [
      { text: "Voltar ao corredor principal", target: "hallway_return" }
    ]
  },

  "hallway_return": {
    speaker: "Narrador",
    text: "Você retorna ao hall de entrada. O silêncio da casa pesa sobre seus ombros como um casaco encharcado. Acima de você, as escadas esperam.",
    background: "bg-hallway",
    character: { left: "clara", focus: "none" },
    location: "Casarão Vance — Hall Principal",
    choices: [
      { text: "Subir as escadas em direção ao segundo andar", target: "stairs_choice" }
    ]
  },

  // ===================================================================
  // SEGUNDO ANDAR — QUARTO DE ALICE
  // ===================================================================
  "stairs_choice": {
    speaker: "Narrador",
    text: "Cada degrau da escada de carvalho range sob seu peso, ecoando pela casa vazia como ossos quebrando. No topo, um longo corredor escuro se estende. Duas portas: o quarto de Alice — entreaberto — e, ao fundo, a porta lacrada do escritório de Victor.",
    background: "bg-stairs",
    audio: "steps_creepy",
    character: { left: "clara", focus: "left" },
    location: "Casarão Vance — Escadaria",
    choices: [
      { text: "Entrar no Quarto de Alice", target: "alice_bedroom" },
      { text: "Tentar a porta do escritório de Victor", target: "victor_room_locked" }
    ]
  },

  "victor_room_locked": {
    speaker: "Clara",
    text: "A porta do escritório de meu pai está trancada com um cadeado pesado. Novo. Alguém a trancou recentemente. No chão, há uma mancha escura que prefiro não examinar de perto.",
    background: "bg-stairs",
    character: { left: "clara", focus: "left" },
    location: "Segundo Andar — Escritório de Victor",
    onEnter: (state) => { state.foundVictorRoom = true; },
    clue: { title: "🚪 Escritório Trancado", text: "O escritório de Victor tem um cadeado novo. Há uma mancha escura no chão em frente à porta." },
    choices: [
      { text: "Ir ao quarto de Alice", target: "alice_bedroom" }
    ]
  },

  "alice_bedroom": {
    speaker: "Narrador",
    text: "O quarto de Alice permanece exatamente como ela deixou. Cada objeto em seu lugar, coberto de pó de cinco anos. Desenhos perturbadores de figuras sombrias estão colados nas paredes. No canto, uma velha vitrola e um gravador de rolo sobre a cômoda.",
    background: "bg-alice-bedroom",
    character: { left: "clara", focus: "none" },
    location: "Segundo Andar — Quarto de Alice",
    choices: [
      { text: "Examinar os desenhos perturbadores nas paredes", target: "examine_drawings" },
      { text: "Verificar o gravador de áudio", target: "examine_tape" },
      { text: "Tentar tocar o piano coberto por lençol", target: "examine_piano" },
      { 
        text: "Abrir a porta escondida atrás do armário", 
        target: "attic_hatch",
        condition: (state) => state.readDiary
      }
    ]
  },

  "examine_drawings": {
    speaker: "Clara",
    text: "Esses desenhos... a figura alta, sem rosto, com membros que se esticam além do normal, estendendo mãos negras em direção a uma garotinha de cabelos escuros. Alice desenhava isso compulsivamente nas semanas antes de desaparecer. Em alguns, a criaturinha sorri. Ela estava indo voluntariamente.",
    background: "bg-drawings-zoom",
    character: { left: "clara", focus: "left" },
    location: "Quarto de Alice — Desenhos",
    onEnter: (state) => { state.sawDrawings = true; },
    clue: { title: "🎨 Desenhos de Alice", text: "Figura alta sem rosto com membros alongados. A garotinha nos desenhos parece ir voluntariamente. Alice não fugia — seguia." },
    choices: [
      { text: "Voltar ao centro do quarto", target: "alice_bedroom" }
    ]
  },

  "examine_tape": {
    speaker: "Narrador",
    text: "Você aperta o botão 'Play' no gravador oxidado. O rolo gira lentamente com um chiado magnético. A voz trêmula e jovem de Alice preenche o quarto silencioso.",
    background: "bg-alice-bedroom",
    audio: "tape_voice",
    character: { left: "clara", focus: "none" },
    location: "Quarto de Alice — Gravador",
    onEnter: (state) => { state.hasTape = true; },
    choices: [
      { text: "Ouvir a gravação atentamente", target: "listen_tape" }
    ]
  },

  "listen_tape": {
    speaker: "Alice (Gravação)",
    text: "\"Clara... se você estiver ouvindo isso, significa que finalmente voltou para casa. Me desculpe por tudo. Eu não aguentava mais os gritos dele, a dor constante. Ele mora no sótão agora. Diz que é nosso verdadeiro pai — que o outro, Victor, nos roubou dele. Eu vou descer para encontrá-lo. Não me siga, por favor. Mas se foi papai que fez algo... a chave está na almofada da cadeira de balanço.\"",
    background: "bg-tape-zoom",
    effect: "glitch",
    textSpeed: 55,
    character: { left: "clara", right: "alice", focus: "right" },
    location: "Quarto de Alice — Gravação",
    onEnter: (state) => { state.heardTape = true; },
    clue: { title: "📼 Gravação de Alice", text: "Alice foi ao sótão voluntariamente. Menciona 'ele' como 'verdadeiro pai'. Escondeu uma chave na almofada da cadeira de balanço." },
    choices: [
      { text: "Examinar a cadeira de balanço", target: "rocking_chair_key" }
    ]
  },

  "rocking_chair_key": {
    speaker: "Narrador",
    text: "Você vasculha sob a almofada desgastada da cadeira de balanço de Alice. Seus dedos encontram algo frio. Uma pequena chave de latão com uma etiqueta de papel: 'Sótão'. A cadeira começa a balançar sozinha enquanto você a segura.",
    background: "bg-alice-bedroom",
    audio: "key_found",
    textSpeed: 45,
    character: { left: "clara", focus: "left" },
    location: "Quarto de Alice — Cadeira de Balanço",
    onEnter: (state) => { 
      state.hasAtticKey = true;
      state.sanity = Math.max(0, state.sanity - 10);
    },
    clue: { title: "🗝️ Chave do Sótão (Alice)", text: "Encontrada sob a almofada da cadeira de balanço. Pertencia a Alice. A cadeira balançou sozinha ao ser tomada." },
    choices: [
      { text: "Segurar a chave e sair do quarto depressa", target: "alice_bedroom_post_key" }
    ]
  },

  "alice_bedroom_post_key": {
    speaker: "Clara",
    text: "Tenho a chave do sótão. E tenho o diário, a fita... Sei mais do que a polícia nunca soube. Mas a verdade que estou montando na minha cabeça é muito pior do que o desaparecimento em si. Preciso continuar.",
    background: "bg-alice-bedroom",
    character: { left: "clara", focus: "left" },
    location: "Quarto de Alice",
    choices: [
      { text: "Explorar a passagem escondida atrás do armário", target: "attic_hatch" },
      { text: "Descer ao andar de baixo primeiro", target: "hallway_return" }
    ]
  },

  "examine_piano": {
    speaker: "Narrador",
    text: "Você puxa o lençol empoeirado, revelando o piano de armário de Alice. Ao pressionar uma única tecla, o som ecoa desordenado e melancólico pela casa. Uma nota solitária que não deveria soar tão... triste.",
    background: "bg-piano",
    audio: "piano_creepy_chord",
    character: { left: "clara", focus: "none" },
    location: "Quarto de Alice — Piano",
    choices: [
      { text: "Uma melodia sussurrada começa acima de você", target: "piano_scare" }
    ]
  },

  "piano_scare": {
    speaker: "Narrador",
    text: "Imediatamente após a nota soar, passos pesados se arrastam diretamente acima de você, no sótão. Um pó fino cai pelas frestas do teto. O piano toca sozinho uma segunda nota — em resposta.",
    background: "bg-alice-bedroom",
    effect: "shake",
    audio: "steps_ceiling",
    textSpeed: 45,
    character: { left: "clara", focus: "left" },
    onEnter: (state) => {
      state.sanity = Math.max(0, state.sanity - 15);
    },
    choices: [
      { text: "Afastar do piano e olhar para o teto", target: "alice_bedroom_post_key" }
    ]
  },

  // ===================================================================
  // CAPÍTULO 2 — O SÓTÃO (CAPÍTULO NOVO)
  // ===================================================================
  "attic_hatch": {
    speaker: "Narrador",
    text: "Atrás do armário de Alice há uma alçapão de madeira no teto, com uma corda suja pendurada. Você a alcança e puxa. A escada desce com um estrondo surdo. De lá de cima desce um vento fétido e escuro.",
    background: "bg-alice-bedroom",
    character: { left: "clara", focus: "left" },
    location: "Quarto de Alice — Alçapão do Sótão",
    choices: [
      { 
        text: "Subir com a lanterna acesa",
        target: "attic_entrance",
        condition: (state) => state.hasFlashlight
      },
      { text: "Subir na escuridão", target: "attic_entrance_dark" }
    ]
  },

  "attic_entrance_dark": {
    speaker: "Narrador",
    text: "Você sobe às cegas, sentindo a madeira úmida sob seus dedos. No topo, o sótão é um abismo. Algo respira no escuro. Algo que não é pequeno.",
    background: "bg-attic-dark",
    effect: "shake",
    audio: "jumpscare_short",
    textSpeed: 45,
    onEnter: (state) => { state.sanity = Math.max(0, state.sanity - 25); },
    location: "Sótão — Escuridão",
    choices: [
      { text: "Recuar e descer correndo", target: "alice_bedroom_post_key" },
      { text: "Entrar mesmo assim na escuridão total", target: "attic_dark_ending_path" }
    ]
  },

  "attic_dark_ending_path": {
    speaker: "Narrador",
    text: "Você avança às cegas. O chão range. Suas mãos tocam algo úmido, orgânico, que se move. Um riso gutural rasga o ar — próximo demais. Você cai para trás pela alçapão...",
    background: "bg-black",
    effect: "shake-heavy",
    audio: "jumpscare_scream",
    onEnter: (state) => { state.sanity = 0; },
    location: "Sótão — Escuridão Absoluta",
    choices: [
      { text: "A escuridão fecha seus olhos...", target: "ending_lost" }
    ]
  },

  "attic_entrance": {
    speaker: "Narrador",
    text: "O feixe da lanterna corta as sombras do sótão. Teto baixo com vigas cruzadas. Caixas de papelão empilhadas. Baús cobertos por lona. E no centro — um círculo de velas apagadas no chão, dispostas em padrão geométrico preciso ao redor de um espelho de corpo inteiro.",
    background: "bg-attic",
    audio: "drone_tense",
    character: { left: "clara", focus: "none" },
    location: "Sótão — Entrada",
    choices: [
      { text: "Examinar o círculo de velas no chão", target: "attic_candles" },
      { text: "Abrir o baú grande coberto por lona", target: "attic_trunk" },
      { text: "Se aproximar do espelho", target: "attic_mirror" }
    ]
  },

  "attic_candles": {
    speaker: "Clara",
    text: "As velas... extinguidas há tempo, mas a cera derramada ainda está levemente maleável. Horas, não dias. Alguém esteve aqui hoje. E o padrão... Reconheço do livro de ocultismo que encontrei no quarto de papai quando criança. Ele me bateu por tocar naquele livro.",
    background: "bg-attic",
    character: { left: "clara", focus: "left" },
    location: "Sótão — Círculo de Velas",
    onEnter: (state) => { 
      state.foundCandles = true;
      state.sanity = Math.max(0, state.sanity - 10);
    },
    clue: { title: "🕯️ Círculo Ritual", text: "Velas apagadas há poucas horas. Padrão geométrico de livro de ocultismo que Victor possuía. Alguém usou o sótão hoje." },
    choices: [
      { text: "Continuar explorando o sótão", target: "attic_entrance" }
    ]
  },

  "attic_trunk": {
    speaker: "Narrador",
    text: "Dentro do baú empoeirado, entre roupas antigas e documentos, você encontra uma pasta de papelão marrom com o carimbo: 'CONFIDENCIAL — Instituto Pinheiro — Paciente: Alice Vance'. Relatórios psiquiátricos. Seu pai havia internado Alice secretamente, duas semanas antes do desaparecimento.",
    background: "bg-attic",
    character: { left: "clara", focus: "left" },
    textSpeed: 45,
    location: "Sótão — Baú",
    onEnter: (state) => { 
      state.foundReports = true;
    },
    clue: { title: "📋 Relatórios Psiquiátricos", text: "Victor havia internado Alice secretamente no 'Instituto Pinheiro' duas semanas antes do desaparecimento. Alice escapou da internação." },
    choices: [
      { text: "Ler mais detalhes sobre os relatórios", target: "attic_trunk_details" }
    ]
  },

  "attic_trunk_details": {
    speaker: "Clara",
    text: "\"Paciente apresenta alucinações auditivas severas, delírios de entidades sobrenaturais e recusa alimentar. Diagnóstico provisório: esquizofrenia paranoide. Pai solicitou sigilo total da família. Irmã gêmea não foi informada.\" Papai nunca me disse. Ele internava Alice enquanto me dizia que ela estava 'visitando a avó'.",
    background: "bg-attic",
    character: { left: "clara", focus: "left" },
    textSpeed: 50,
    location: "Sótão — Documentos Médicos",
    onEnter: (state) => { state.sanity = Math.max(0, state.sanity - 15); },
    choices: [
      { text: "Fechar a pasta e explorar mais o sótão", target: "attic_entrance_explored" }
    ]
  },

  "attic_mirror": {
    speaker: "Narrador",
    text: "O espelho antigo de moldura dourada está intacto, mas sua superfície está coberta por inscrições riscadas na madeira da moldura. Palavras repetidas em espiral: 'VANCE VANCE VANCE'. E ao olhar seu reflexo — por um segundo horrível — o reflexo não imita seus movimentos.",
    background: "bg-attic",
    effect: "glitch",
    textSpeed: 45,
    character: { left: "clara", focus: "left" },
    onEnter: (state) => {
      state.sawMirror = true;
      state.sanity = Math.max(0, state.sanity - 20);
    },
    location: "Sótão — Espelho",
    clue: { title: "🪞 Espelho do Sótão", text: "Moldura coberta com 'VANCE' em espiral. O reflexo não imitou seus movimentos por um segundo." },
    choices: [
      { text: "Virar o espelho para a parede e afastar-se", target: "attic_entrance_explored" }
    ]
  },

  "attic_entrance_explored": {
    speaker: "Narrador",
    text: "Ao fundo do sótão, parcialmente escondida por estantes tombadas, há uma segunda porta — menor, com ferrolho. Atrás da porta, você ouve algo. Uma respiração longa e rítmica. E uma voz rouca que sussurra seu nome.",
    background: "bg-attic",
    audio: "heartbeat_fast",
    character: { left: "clara", focus: "left" },
    onEnter: (state) => { state.sanity = Math.max(0, state.sanity - 10); },
    location: "Sótão — Fundo",
    choices: [
      { text: "Abrir a porta do fundo", target: "victor_ghost_encounter" },
      { text: "Ignorar e descer ao porão pela escada principal", target: "basement_door" }
    ]
  },

  // ===================================================================
  // ENCONTRO COM VICTOR — O PAI FANTASMA
  // ===================================================================
  "victor_ghost_encounter": {
    speaker: "Narrador",
    text: "A porta se abre para um minúsculo cômodo — um escritório secreto. Sentado em uma cadeira de lona, de costas, há uma figura. Ombros largos. Cabelos brancos. Quando ela se vira, você reconhece os traços do seu pai, Victor Vance — mas translúcido, cinzento, os olhos cheios de uma culpa que parece eterna.",
    background: "bg-victor-room",
    effect: "glitch",
    audio: "drone_horror_climax",
    textSpeed: 50,
    character: { left: "clara", right: "victor", focus: "right" },
    onEnter: (state) => { state.sawVictor = true; state.sanity = Math.max(0, state.sanity - 20); },
    location: "Sótão — Escritório Secreto",
    choices: [
      { text: "Confrontá-lo: 'O que você fez com Alice?!'", target: "victor_confronted" },
      { text: "Recuar em pânico para longe dele", target: "victor_flee" }
    ]
  },

  "victor_flee": {
    speaker: "Narrador",
    text: "O terror paralisa suas pernas por um segundo — e então você corre. Desce a escada do sótão tropeçando, atravessa o corredor. A figura não a seguiu. Mas a voz rouca ainda ecoa: 'Você precisa saber a verdade, Clara.'",
    background: "bg-attic-corridor",
    effect: "shake",
    character: { left: "clara", focus: "left" },
    onEnter: (state) => { state.sanity = Math.max(0, state.sanity - 10); },
    location: "Corredor do Sótão",
    choices: [
      { text: "Reunir coragem e voltar ao escritório secreto", target: "victor_ghost_encounter" },
      { text: "Ir direto ao porão sem olhar para trás", target: "basement_door" }
    ]
  },

  "victor_confronted": {
    speaker: "Victor",
    text: "\"Eu sabia que você viria, Clara. Vim aqui esperar por isso. Por você. Fiz coisas terríveis com Alice. Internei-a. Menti para você. Mas não foi só loucura minha — havia algo real no sótão que eu vi. E tentei eliminar — destruindo Alice no processo. Isso me matou por dentro antes de me matar de vez.\"",
    background: "bg-victor-room",
    textSpeed: 55,
    character: { left: "clara", right: "victor", focus: "right" },
    location: "Sótão — Escritório Secreto",
    choices: [
      { text: "'Onde está Alice agora?'", target: "victor_truth" },
      { text: "'Você não merece meu perdão.' (virar as costas)", target: "victor_reject" }
    ]
  },

  "victor_truth": {
    speaker: "Victor",
    text: "\"Alice desceu ao porão por vontade própria. A entidade a seduziu com promessas. Mas a entidade é apenas... um espelho. Ela se alimenta de culpa, de arrependimento não resolvido. Se você a enfrentar sem ódio, sem medo — com amor — ela não tem poder. Ela é feita do que há de pior em nós.\" A figura de Victor começa a se dissolver em partículas cinzentas.",
    background: "bg-victor-room",
    audio: "ambient_peaceful",
    textSpeed: 55,
    character: { left: "clara", right: "victor", focus: "both" },
    onEnter: (state) => { state.heardVictorTruth = true; },
    location: "Sótão — Escritório Secreto",
    clue: { title: "👻 Verdade de Victor", text: "A entidade se alimenta de culpa e arrependimento. Enfrentá-la sem medo ou ódio — com amor — é a única forma de libertá-la." },
    choices: [
      { text: "Victor desaparece. Descer ao porão.", target: "basement_door" }
    ]
  },

  "victor_reject": {
    speaker: "Clara",
    text: "Você vira as costas para a figura do seu pai sem dizer mais uma palavra. Há uma raiva antiga e legítima queimando em você. Ele a escutaria dizer que o perdoa? Não hoje. Talvez nunca. Você sai do escritório secreto e fecha a porta.",
    background: "bg-victor-room",
    character: { left: "clara", focus: "left" },
    onEnter: (state) => { state.rejectedVictor = true; },
    location: "Sótão — Escritório Secreto",
    choices: [
      { text: "Ir ao porão", target: "basement_door" }
    ]
  },

  // ===================================================================
  // O EVENTO DE TENSÃO
  // ===================================================================
  "trigger_tension": {
    speaker: "Narrador",
    text: "De repente, um estrondo violento sacode a casa inteira. O som veio de baixo — do porão. A lâmpada do corredor pisca furiosamente e queima, deixando você na penumbra completa. Só a lanterna pode te salvar agora.",
    background: "bg-hallway-dark",
    effect: "glitch",
    audio: "jumpscare_bang",
    textSpeed: 45,
    character: { left: "clara", focus: "left" },
    onEnter: (state) => {
      state.sanity = Math.max(0, state.sanity - 15);
    },
    location: "Segundo Andar — Corredor Escuro",
    choices: [
      { text: "Seguir o barulho em direção ao porão", target: "basement_door" },
      { text: "Correr em pânico para fora da casa!", target: "flee_house" }
    ]
  },

  // ===================================================================
  // ROTA DE FUGA
  // ===================================================================
  "flee_house": {
    speaker: "Narrador",
    text: "O pânico toma conta. Você corre pelo corredor, desce as escadas tropeçando e empurra a porta da frente. A névoa noturna engole você enquanto corre em direção ao carro.",
    background: "bg-outside-fog-run",
    audio: "run_heartbeat",
    character: { left: "clara", focus: "left" },
    location: "Estrada — Fuga",
    choices: [
      { text: "Entrar no carro e dar partida", target: "car_escape" }
    ]
  },

  "car_escape": {
    speaker: "Narrador",
    text: "O motor ruge de volta à vida. Você acelera pela estrada lamacenta, os faróis cortando a névoa densa. A silhueta do casarão diminui no espelho retrovisor e você finalmente respira.",
    background: "bg-car-inside",
    character: { left: "clara", focus: "none" },
    audio: "car_engine",
    location: "Estrada — Carro em Fuga",
    choices: [
      { text: "Olhar pelo espelho retrovisor", target: "car_mirror" }
    ]
  },

  "car_mirror": {
    speaker: "Narrador",
    text: "Ao checar o espelho retrovisor, seu sangue gela. Sentada no banco traseiro, com cabelos encharcados e olhos completamente vazios, está Alice. Seus lábios cinzentos se curvam em um sorriso lento e sussurrante.",
    background: "bg-car-mirror-scare",
    effect: "shake-heavy",
    audio: "jumpscare_scream",
    textSpeed: 60,
    character: { left: "clara", right: "alice", focus: "right" },
    onEnter: (state) => {
      state.sanity = 0;
    },
    location: "Carro — Espelho Retrovisor",
    choices: [
      { text: "O carro perde o controle na curva...", target: "ending_coward" }
    ]
  },

  "ending_coward": {
    speaker: "FIM — Fuga Solitária",
    text: "Você sobreviveu ao acidente, mas a culpa e a sombra de Alice jamais a abandonaram. Cada noite, o sussurro. Cada espelho, aquele sorriso. Você nunca voltou àquela casa. Mas ela veio com você para sempre.",
    background: "bg-black",
    audio: "silence",
    location: "",
    onEnter: (state) => { state.unlockedEndings.push("ending_coward"); },
    choices: [
      { text: "Voltar ao Menu Principal", target: "main_menu_reset" }
    ]
  },

  // ===================================================================
  // O PORÃO — CONFRONTO FINAL
  // ===================================================================
  "basement_door": {
    speaker: "Narrador",
    text: "Você para diante da porta do porão. Ela está escancarada, revelando um abismo escuro de onde sopra um vento com cheiro de ferro velho e flores mortas. Lá de baixo, uma luz fraca e trêmula pulsa como um coração.",
    background: "bg-basement-door",
    audio: "heartbeat_fast",
    character: { left: "clara", focus: "left" },
    location: "Casarão Vance — Porta do Porão",
    choices: [
      { 
        text: "Acender a lanterna e descer com cuidado",
        target: "basement_descent_light",
        condition: (state) => state.hasFlashlight
      },
      { text: "Descer na escuridão total", target: "basement_descent_dark" }
    ]
  },

  "basement_descent_dark": {
    speaker: "Narrador",
    text: "Você apalpa as paredes frias e úmidas enquanto desce os degraus de concreto no escuro. Seus pés tocam o chão inundado. De repente, algo frio e úmido agarra seu tornozelo com força!",
    background: "bg-black",
    effect: "shake",
    audio: "jumpscare_short",
    onEnter: (state) => {
      state.sanity = Math.max(0, state.sanity - 30);
    },
    location: "Porão — Escuridão",
    choices: [
      { text: "Chutar e tentar correr", target: "basement_lost_dark" }
    ]
  },

  "basement_lost_dark": {
    speaker: "Narrador",
    text: "Você se debate em pânico, tropeça na escuridão e bate a cabeça contra uma coluna de concreto. Enquanto a consciência se esvai, você sente múltiplos dedos gelados arrastando-a para sob os assoalhos apodrecidos...",
    background: "bg-black",
    audio: "drag_sound",
    onEnter: (state) => { state.sanity = 0; },
    location: "Porão — Fim",
    choices: [
      { text: "A escuridão a consome por completo", target: "ending_lost" }
    ]
  },

  "ending_lost": {
    speaker: "FIM — Engolida pelo Silêncio",
    text: "Sem luz e sem respostas, você se tornou apenas mais um eco nos sussurros da casa. Ninguém sabe onde você está. Ninguém virá procurá-la. Você e Alice agora habitam o mesmo silêncio eterno.",
    background: "bg-black",
    audio: "silence",
    location: "",
    onEnter: (state) => { state.unlockedEndings.push("ending_lost"); },
    choices: [
      { text: "Voltar ao Menu Principal", target: "main_menu_reset" }
    ]
  },

  "basement_descent_light": {
    speaker: "Narrador",
    text: "O feixe da lanterna corta a névoa úmida do porão. Poças de água negra cobrem o chão de concreto rachado. No centro da sala, cercada por velas acesas e correntes enferrujadas que oscilam sozinhas, há uma figura de costas — parada como uma estátua.",
    background: "bg-basement-floor",
    audio: "heartbeat_fast",
    character: { left: "clara", focus: "left" },
    location: "Porão — Entrada",
    choices: [
      { text: "Chamar por Alice", target: "basement_confront" }
    ]
  },

  "basement_confront": {
    speaker: "Narrador",
    text: "A figura se vira com lentidão mecânica. O rosto é o seu próprio rosto — mas distorcido pela decomposição e por um sorriso que se abre além dos limites humanos. Seus olhos são órbitas vazias que transbordam um líquido escuro. Em um sussurro que vem de todas as direções: \"Você chegou tarde, irmã.\"",
    background: "bg-basement-entity",
    effect: "glitch-heavy",
    audio: "drone_horror_climax",
    textSpeed: 55,
    character: { left: "clara", right: "entity", focus: "right" },
    onEnter: (state) => {
      state.sanity = Math.max(0, state.sanity - 25);
    },
    location: "Porão — Confronto",
    choices: [
      { 
        text: "Mostrar o diário e tocar a fita gravada",
        target: "basement_resolution_good",
        condition: (state) => state.hasDiary && state.hasTape
      },
      {
        text: "'Eu sei quem você é, e sei o que você quer.' (requer verdade de Victor)",
        target: "basement_resolution_truth",
        condition: (state) => state.heardVictorTruth
      },
      { text: "Tentar fugir subindo as escadas!", target: "basement_escape_fail" }
    ]
  },

  "basement_escape_fail": {
    speaker: "Narrador",
    text: "Você se vira para correr, mas a porta do porão bate com um estrondo ensurdecedor, trancando-se por fora. A criatura estende os braços — que se alongam como sombras líquidas — e envolve seus ombros pelo pescoço.",
    background: "bg-basement-entity-scare",
    effect: "shake-heavy",
    audio: "jumpscare_scream",
    textSpeed: 50,
    character: { left: "clara", right: "entity", focus: "right" },
    onEnter: (state) => { state.sanity = 0; },
    location: "Porão — Armadilha",
    choices: [
      { text: "Lutar pelo seu último suspiro...", target: "ending_consumed" }
    ]
  },

  "ending_consumed": {
    speaker: "FIM — O Sacrifício das Sombras",
    text: "Você falhou em confrontar o passado. A entidade se alimentou de sua culpa não resolvida e tomou seu corpo como lar. Agora Clara caminha pelo mundo dos vivos, mas sua alma jaz trancada nas sombras do porão, ao lado de Alice, para sempre.",
    background: "bg-black",
    audio: "silence",
    location: "",
    onEnter: (state) => { state.unlockedEndings.push("ending_consumed"); },
    choices: [
      { text: "Voltar ao Menu Principal", target: "main_menu_reset" }
    ]
  },

  // ===================================================================
  // ROTA DO 5° FINAL — A VERDADE CRUEL
  // ===================================================================
  "basement_resolution_truth": {
    speaker: "Clara",
    text: "\"Eu sei o que você é. Você se alimenta de culpa. Da culpa de Victor. Da culpa que Alice sentia por machucar a família. E da minha própria culpa — por nunca ter acreditado nela.\" A entidade para. Seus olhos vazios se fixam em você. Pela primeira vez, ela parece... assustada.",
    background: "bg-basement-entity",
    textSpeed: 50,
    character: { left: "clara", right: "entity", focus: "left" },
    location: "Porão — Enfrentamento",
    choices: [
      { text: "\"Mas eu também sei algo que você não sabe.\"", target: "basement_truth_reveal" }
    ]
  },

  "basement_truth_reveal": {
    speaker: "Clara",
    text: "\"Alice não foi embora por você. Ela foi embora porque eu não a defendi quando precisava. Porque fui covarde. Então o peso dessa verdade é meu — não dela. E eu me recuso a carregar isso aqui dentro para sempre. Acabou.\" Você deixa o diário e a fita cair no chão encharcado e estende a mão para a criatura.",
    background: "bg-basement-embrace",
    textSpeed: 50,
    character: { left: "clara", right: "entity", focus: "both" },
    location: "Porão — Resolução",
    onEnter: (state) => { state.choseTruth = true; state.sanity = 100; },
    choices: [
      { text: "Encarar a verdade sem se afastar", target: "ending_truth" }
    ]
  },

  "ending_truth": {
    speaker: "FIM — A Verdade que Liberta",
    text: "A entidade se desfaz em ecos de sombra. Não há abraço. Não há Alice luminosa. Apenas silêncio — e a verdade nua: você falhou com sua irmã, e isso não pode ser desfeito. Mas aceitar isso sem fugir é o único caminho real. Clara sai do casarão antes do amanhecer. Carrega a culpa — mas não a deixa mais carregar ela.",
    background: "bg-outside-fog",
    audio: "ambient_peaceful",
    location: "",
    onEnter: (state) => { state.unlockedEndings.push("ending_truth"); },
    choices: [
      { text: "Voltar ao Menu Principal", target: "main_menu_reset" }
    ]
  },

  // ===================================================================
  // FIM BOM — REDENÇÃO
  // ===================================================================
  "basement_resolution_good": {
    speaker: "Clara",
    text: "\"Alice! Eu sei que é você! Eu ouvi a fita! Li seu diário! Eu sei o que papai fez — e o que eu fiz também. Deixei-te sozinha quando mais precisava de mim. Me perdoe, Alice. Por favor. Eu não vou te deixar aqui de novo!\"",
    background: "bg-basement-entity",
    effect: "flash-red",
    audio: "tape_voice_play",
    textSpeed: 50,
    character: { left: "clara", right: "entity", focus: "left" },
    location: "Porão — Apelo",
    choices: [
      { text: "Avançar e abraçar a criatura sombria", target: "basement_embrace" }
    ]
  },

  "basement_embrace": {
    speaker: "Narrador",
    text: "Você solta a lanterna e avança. Abraça a criatura gélida com toda a força que tem. A princípio, ela se debate convulsivamente, arranhando suas costas com garras de sombra, tentando empurrá-la. Mas você aperta mais ainda. E sussurra: 'Eu te ouço, Alice. Finalmente te ouço.'",
    background: "bg-basement-embrace",
    audio: "heartbeat_slow",
    character: { left: "clara", right: "entity", focus: "both" },
    onEnter: (state) => { state.sanity = 100; },
    location: "Porão — Abraço",
    choices: [
      { text: "A gravação de Alice sussurra ao fundo...", target: "basement_peace" }
    ]
  },

  "basement_peace": {
    speaker: "Narrador",
    text: "As sombras se dissipam lentamente. O frio extremo recua. Em seus braços, a criatura hedionda se transforma — primeiro em fumaça, depois em luz, e por fim na forma frágil e luminosa de sua irmã Alice, exatamente como era aos quinze anos. Com os olhos fechados. Em paz.",
    background: "bg-basement-alice-ghost",
    audio: "ambient_peaceful",
    character: { left: "clara", right: "alice", focus: "right" },
    location: "Porão — Paz",
    choices: [
      { text: "Alice abre os olhos pela última vez", target: "alice_final_words" }
    ]
  },

  "alice_final_words": {
    speaker: "Alice",
    text: "\"Obrigada, Clara... Você finalmente me ouviu. Levei tempo demais esperando por isso. Mas valeu cada segundo. Eu posso descansar agora.\" Ela sorri — o sorriso real de Alice, não distorcido. \"Viva por nós duas, irmã. Eu estarei aqui.\"",
    background: "bg-basement-alice-ghost",
    character: { left: "clara", right: "alice", focus: "both" },
    location: "Porão — Despedida",
    choices: [
      { text: "Alice desaparece em partículas de luz azul", target: "ending_good" }
    ]
  },

  "ending_good": {
    speaker: "FIM — A Luz do Amanhecer",
    text: "O sol da manhã rompe a névoa perpétua da montanha pela primeira vez em cinco anos, iluminando o porão úmido com raios dourados. Clara sobe as escadas devagar. O peso da culpa desapareceu — substituído por algo mais honesto: saudade. O casarão Vance é apenas madeira e memórias antigas. Alice está em paz. E Clara, finalmente, está livre.",
    background: "bg-outside-sunny",
    audio: "ambient_peaceful",
    location: "",
    onEnter: (state) => { state.unlockedEndings.push("ending_good"); },
    choices: [
      { text: "Voltar ao Menu Principal", target: "main_menu_reset" }
    ]
  }
};
