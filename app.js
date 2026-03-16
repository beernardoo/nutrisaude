// ===================================================
//  NutriSaúde — app.js
// ===================================================

/* ── DADOS: Valores de referência de exames ─────── */
const REFERENCIAS = {
  glicemia_jejum:     { nome:'Glicemia em Jejum',   unidade:'mg/dL', min:70,   max:99,   ref:'70 – 99 mg/dL',        alerta:'≥ 100 pré-diabetes | ≥ 126 diabetes' },
  hba1c:              { nome:'Hemoglobina Glicada',  unidade:'%',     min:0,    max:5.6,  ref:'< 5,7%',               alerta:'5,7–6,4% pré-diabetes | ≥ 6,5% diabetes' },
  colesterol_total:   { nome:'Colesterol Total',     unidade:'mg/dL', min:0,    max:199,  ref:'< 200 mg/dL',          alerta:'200–239 limítrofe | ≥ 240 alto' },
  hdl:                { nome:'HDL (Colesterol Bom)', unidade:'mg/dL', min:60,   max:999,  ref:'> 60 mg/dL (ótimo)',   alerta:'< 40 (H) / < 50 (M) = risco cardiovascular' },
  ldl:                { nome:'LDL (Colesterol Ruim)',unidade:'mg/dL', min:0,    max:99,   ref:'< 100 mg/dL',          alerta:'130–159 limítrofe | ≥ 160 alto' },
  triglicerideos:     { nome:'Triglicerídeos',       unidade:'mg/dL', min:0,    max:149,  ref:'< 150 mg/dL',          alerta:'150–199 limítrofe | ≥ 200 alto' },
  creatinina:         { nome:'Creatinina',           unidade:'mg/dL', min:0.6,  max:1.2,  ref:'0,6 – 1,2 mg/dL',     alerta:'Varia por sexo e massa muscular' },
  ureia:              { nome:'Ureia',                unidade:'mg/dL', min:10,   max:50,   ref:'10 – 50 mg/dL',        alerta:'—' },
  acido_urico:        { nome:'Ácido Úrico',          unidade:'mg/dL', min:3.5,  max:7.2,  ref:'3,5 – 7,2 mg/dL',     alerta:'> 7 risco de gota' },
  tgo:                { nome:'TGO (AST)',             unidade:'U/L',   min:10,   max:40,   ref:'10 – 40 U/L',          alerta:'Elevado = possível dano hepático' },
  tgp:                { nome:'TGP (ALT)',             unidade:'U/L',   min:7,    max:56,   ref:'7 – 56 U/L',           alerta:'Elevado = possível dano hepático' },
  ggt:                { nome:'GGT',                  unidade:'U/L',   min:9,    max:48,   ref:'9 – 48 U/L',           alerta:'Elevado = álcool ou doença hepática' },
  hemoglobina:        { nome:'Hemoglobina',          unidade:'g/dL',  min:12,   max:17,   ref:'H: 13,5–17,5 | M: 12–15,5 g/dL', alerta:'Abaixo = anemia' },
  hematocrito:        { nome:'Hematócrito',          unidade:'%',     min:36,   max:52,   ref:'H: 41–53% | M: 36–46%', alerta:'Abaixo = possível anemia' },
  leucocitos:         { nome:'Leucócitos',           unidade:'/mm³',  min:4000, max:11000,ref:'4.000 – 11.000 /mm³',  alerta:'Fora da faixa = infecção ou imunidade comprometida' },
  plaquetas:          { nome:'Plaquetas',            unidade:'/mm³',  min:150000,max:400000,ref:'150.000 – 400.000 /mm³',alerta:'—' },
  tsh:                { nome:'TSH',                  unidade:'mUI/L', min:0.4,  max:4.0,  ref:'0,4 – 4,0 mUI/L',     alerta:'< 0,4 hipertireoidismo | > 4 hipotireoidismo' },
  t4l:                { nome:'T4 Livre',             unidade:'ng/dL', min:0.8,  max:1.8,  ref:'0,8 – 1,8 ng/dL',     alerta:'—' },
  vitamina_d:         { nome:'Vitamina D',           unidade:'ng/mL', min:30,   max:100,  ref:'30 – 100 ng/mL',       alerta:'< 20 deficiência | 20–29 insuficiência' },
  vitamina_b12:       { nome:'Vitamina B12',         unidade:'pg/mL', min:200,  max:900,  ref:'200 – 900 pg/mL',      alerta:'< 200 deficiência' },
  ferro:              { nome:'Ferro Sérico',         unidade:'µg/dL', min:60,   max:170,  ref:'60 – 170 µg/dL',       alerta:'—' },
  ferritina:          { nome:'Ferritina',            unidade:'ng/mL', min:12,   max:300,  ref:'H: 30–400 | M: 15–150 ng/mL', alerta:'Baixa = depleção de ferro' },
  pressao_sistolica:  { nome:'Pressão Sistólica',   unidade:'mmHg',  min:0,    max:119,  ref:'< 120 mmHg',            alerta:'120–129 elevada | ≥ 130 hipertensão' },
  pressao_diastolica: { nome:'Pressão Diastólica',  unidade:'mmHg',  min:0,    max:79,   ref:'< 80 mmHg',             alerta:'≥ 80 hipertensão' },
  // ── Novos exames ───────────────────────────────────────────────────────────
  // Glicemia / Metabolismo
  insulina:           { nome:'Insulina (Basal)',     unidade:'µU/mL', min:2.6,  max:24.9, ref:'2,6 – 24,9 µU/mL',    alerta:'> 25 resistência insulínica | > 50 patológico (Bittar)' },
  // Inflamação
  pcr:                { nome:'Proteína C Reativa',   unidade:'mg/L',  min:0,    max:4.9,  ref:'< 5,0 mg/L',           alerta:'> 5 processo inflamatório ativo' },
  // Função Pancreática
  amilase:            { nome:'Amilase',              unidade:'U/L',   min:28,   max:100,  ref:'28 – 100 U/L',         alerta:'Elevada = pancreatite aguda' },
  lipase:             { nome:'Lipase',               unidade:'U/L',   min:13,   max:60,   ref:'13 – 60 U/L',          alerta:'Elevada = pancreatite aguda (mais específica que amilase)' },
  fosfatase_alcalina: { nome:'Fosfatase Alcalina',   unidade:'U/L',   min:40,   max:129,  ref:'H: 40–129 | M: 35–104 U/L', alerta:'Elevada = doença hepática ou óssea' },
  // Bilirrubinas
  bilirrubina_total:  { nome:'Bilirrubina Total',    unidade:'mg/dL', min:0,    max:1.2,  ref:'< 1,2 mg/dL',          alerta:'> 1,2 = icterícia; investigar causa' },
  bilirrubina_direta: { nome:'Bilirrubina Direta',   unidade:'mg/dL', min:0,    max:0.3,  ref:'< 0,3 mg/dL',          alerta:'Elevada = hepatite, colestase' },
  // Colesterol Extra
  vldl:               { nome:'Colesterol VLDL',      unidade:'mg/dL', min:0,    max:30,   ref:'< 30 mg/dL',           alerta:'> 30 risco cardiovascular' },
  // Cardiovascular Avançado
  apolipo_a1:         { nome:'Apolipoproteína A1',   unidade:'mg/dL', min:100,  max:200,  ref:'100 – 200 mg/dL',      alerta:'< 100 risco cardiovascular aumentado' },
  apolipo_b:          { nome:'Apolipoproteína B',    unidade:'mg/dL', min:49,   max:130,  ref:'H: 49–173 | M: 53–182 mg/dL', alerta:'> 100 risco cardiovascular' },
  homocisteina:       { nome:'Homocisteína',         unidade:'µmol/L',min:5.46, max:15.0, ref:'H: 5,46–16,20 | M: 4,44–13,56 µmol/L', alerta:'> 15 risco cardiovascular e AVC' },
  // Micronutrientes
  magnesio:           { nome:'Magnésio',             unidade:'mg/dL', min:1.6,  max:2.6,  ref:'1,6 – 2,6 mg/dL',     alerta:'< 1,6 hipomagnesemia' },
  zinco:              { nome:'Zinco Sérico',         unidade:'µg/dL', min:70,   max:120,  ref:'70 – 120 µg/dL',       alerta:'< 70 deficiência' },
  vitamina_c:         { nome:'Vitamina C',           unidade:'mg/L',  min:4.6,  max:15.0, ref:'4,6 – 15,0 mg/L',     alerta:'< 4,6 deficiência | < 2 escorbuto' },
  selenio:            { nome:'Selênio Sérico',       unidade:'µg/L',  min:40,   max:141,  ref:'40 – 141 µg/L',        alerta:'< 40 deficiência' },
  // Hormônios Tireoidianos
  t3l:                { nome:'T3 Livre',             unidade:'ng/dL', min:0.20, max:0.44, ref:'0,20 – 0,44 ng/dL',   alerta:'< 0,20 hipotireoidismo | > 0,44 hipertireoidismo' },
  t3r:                { nome:'T3 Reverso',           unidade:'ng/mL', min:0.04, max:0.31, ref:'0,04 – 0,31 ng/mL',   alerta:'> 0,31 = estresse crônico / hipotireoidismo funcional' },
  // Hormônios Sexuais
  testosterona_total: { nome:'Testosterona Total',   unidade:'ng/dL', min:240,  max:870,  ref:'H: 240–870 | M: 15–70 ng/dL', alerta:'< 240 (H) hipogonadismo masculino' },
  testosterona_livre: { nome:'Testosterona Livre',   unidade:'ng/dL', min:3.4,  max:24.6, ref:'H 17-40a: 3,4–24,6 ng/dL', alerta:'—' },
  estradiol:          { nome:'Estradiol',            unidade:'pg/mL', min:11.3, max:43.2, ref:'H: 11,3–43,2 pg/mL',  alerta:'< 11,3 (H) deficiência | > 43,2 (H) elevado' },
  shbg:               { nome:'SHBG',                unidade:'nmol/L',min:11.2, max:78.1, ref:'H: 11,2–78,1 | M: 11,7–137,2 nmol/L', alerta:'Baixo = mais testosterona livre' },
  prolactina:         { nome:'Prolactina',          unidade:'ng/mL', min:2.0,  max:18.0, ref:'H: 2–18 | M: 3–30 ng/mL', alerta:'> 25 (H) hiperprolactinemia' },
  // ── Hemograma completo (parâmetros adicionais) ─────────────────────────────
  eritrocitos:        { nome:'Eritrócitos',          unidade:'M/mm³', min:4.3,  max:6.0,  ref:'H: 4,5–6,0 | M: 4,3–5,5 M/mm³', alerta:'Abaixo = possível anemia' },
  vcm:                { nome:'VCM (Volume Corpuscular Médio)', unidade:'fL', min:80, max:100, ref:'80 – 100 fL', alerta:'< 80 anemia microcítica | > 100 macrocítica' },
  hcm:                { nome:'HCM (Hemoglobina Corp. Média)', unidade:'pg', min:27, max:33,  ref:'27 – 33 pg',  alerta:'< 27 hipocrômica' },
  chcm:               { nome:'CHCM (Concentração HCM)',       unidade:'%',  min:32, max:36,  ref:'32 – 36%',    alerta:'< 32 hipocrômica' },
  // ── Função Renal / Eletrólitos ─────────────────────────────────────────────
  sodio:              { nome:'Sódio',                unidade:'mEq/L', min:136,  max:145,  ref:'136 – 145 mEq/L',  alerta:'< 136 hiponatremia | > 145 hipernatremia' },
  potassio:           { nome:'Potássio',             unidade:'mEq/L', min:3.5,  max:5.0,  ref:'3,5 – 5,0 mEq/L', alerta:'< 3,5 hipocalemia | > 5,5 hipercalemia' },
  calcio:             { nome:'Cálcio Total',         unidade:'mg/dL', min:8.5,  max:10.5, ref:'8,5 – 10,5 mg/dL', alerta:'< 8,5 hipocalcemia' },
  fosforo:            { nome:'Fósforo',              unidade:'mg/dL', min:2.5,  max:4.5,  ref:'2,5 – 4,5 mg/dL',  alerta:'< 2,5 hipofosfatemia' },
};

/* ── DADOS: Tabela de Alimentos ─────────────────── */
// Valores por 100g | kcal, carb(g), prot(g), gord(g)
/* ── Imagens dos alimentos (TheMealDB ingredient CDN — sem chave de API) ── */
const _W = 'https://commons.wikimedia.org/wiki/Special:FilePath/';
const _M = 'https://www.themealdb.com/images/ingredients/';
const FOOD_IMAGES = {
  // Carboidratos
  'Arroz branco cozido'   : _M + 'Rice.png',
  'Arroz integral cozido' : _M + 'Rice.png',
  'Pão francês'           : _M + 'Bread.png',
  'Pão integral'          : _M + 'Bread.png',
  'Macarrão cozido'       : _M + 'Spaghetti.png',
  'Batata inglesa cozida' : _M + 'Potatoes.png',
  'Batata-doce cozida'    : _M + 'Sweet%20Potatoes.png',
  'Aveia em flocos'       : _M + 'Oats.png',
  'Quinoa cozida'         : _M + 'Quinoa.png',
  'Milho cozido'          : _M + 'Sweetcorn.png',
  'Feijão carioca cozido' : _M + 'Black%20Beans.png',
  'Lentilha cozida'       : _M + 'Lentils.png',
  'Grão-de-bico cozido'   : _M + 'Chickpeas.png',
  'Mandioca cozida'       : _W + 'Cassava.jpg',
  // Proteínas
  'Frango grelhado (peito)': _M + 'Chicken%20Breast.png',
  'Carne bovina magra'    : _M + 'Beef.png',
  'Ovo inteiro cozido'    : _M + 'Eggs.png',
  'Atum em água'          : _M + 'Tuna.png',
  'Salmão grelhado'       : _M + 'Salmon.png',
  'Sardinha em conserva'  : _M + 'Anchovies.png',
  'Camarão cozido'        : _M + 'Prawns.png',
  'Whey Protein (pó)'     : _W + 'Protein_shake.jpg',
  'Carne suína magra'     : _M + 'Pork.png',
  'Tofu'                  : _M + 'Tofu.png',
  // Gorduras boas
  'Abacate'               : _M + 'Avocado.png',
  'Azeite de oliva'       : _M + 'Olive%20Oil.png',
  'Amêndoas'              : _M + 'Almonds.png',
  'Castanha-do-pará'      : _W + 'Brazil_nuts.jpg',
  'Nozes'                 : _M + 'Walnuts.png',
  'Amendoim torrado'      : _M + 'Peanuts.png',
  'Pasta de amendoim'     : _M + 'Peanut%20Butter.png',
  'Óleo de coco'          : _M + 'Coconut%20Cream.png',
  'Semente de chia'       : _W + 'Chia_seeds.jpg',
  'Linhaça'               : _W + 'Linum_usitatissimum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-088.jpg',
  'Coco ralado s/ açúcar' : _M + 'Desiccated%20Coconut.png',
  // Vegetais
  'Brócolis cozido'       : _M + 'Broccoli.png',
  'Espinafre cru'         : _M + 'Spinach.png',
  'Couve-flor cozida'     : _W + 'Cauliflower.jpg',
  'Cenoura crua'          : _M + 'Carrots.png',
  'Tomate cru'            : _M + 'Tomatoes.png',
  'Alface'                : _M + 'Lettuce.png',
  'Pepino cru'            : _M + 'Cucumber.png',
  'Abobrinha cozida'      : _M + 'Courgette.png',
  'Beterraba cozida'      : _M + 'Beetroot.png',
  'Berinjela cozida'      : _M + 'Aubergine.png',
  // Frutas
  'Banana'                : _M + 'Banana.png',
  'Maçã'                  : _M + 'Apple.png',
  'Laranja'               : _M + 'Orange.png',
  'Manga'                 : _W + 'Mangos.jpg',
  'Morango'               : _M + 'Strawberries.png',
  'Uva'                   : _W + 'Grapes.jpg',
  'Mamão'                 : _M + 'Papaya.png',
  'Melancia'              : _W + 'Watermelon_2.jpg',
  'Abacaxi'               : _M + 'Pineapple.png',
  'Kiwi'                  : _M + 'Kiwi.png',
  // Laticínios
  'Leite integral'        : _M + 'Milk.png',
  'Leite desnatado'       : _M + 'Milk.png',
  'Iogurte natural integral': _M + 'Natural%20Yoghurt.png',
  'Iogurte grego'         : _M + 'Greek%20Yogurt.png',
  'Queijo cottage'        : _M + 'Cream%20Cheese.png',
  'Queijo mussarela'      : _M + 'Mozzarella.png',
  'Queijo parmesão'       : _M + 'Parmesan.png',
  'Requeijão light'       : _M + 'Cream%20Cheese.png',
};

const ALIMENTOS = [
  // CARBOIDRATOS
  { nome:'Arroz branco cozido',    emoji:'🍚', cat:'carboidrato', kcal:130, carb:28.1, prot:2.5, gord:0.3 },
  { nome:'Arroz integral cozido',  emoji:'🍚', cat:'carboidrato', kcal:124, carb:25.8, prot:2.6, gord:1.0 },
  { nome:'Pão francês',            emoji:'🥖', cat:'carboidrato', kcal:300, carb:58.6, prot:8.0, gord:3.1 },
  { nome:'Macarrão cozido',        emoji:'🍝', cat:'carboidrato', kcal:131, carb:26.8, prot:4.4, gord:0.6 },
  { nome:'Batata inglesa cozida',  emoji:'🥔', cat:'carboidrato', kcal:82,  carb:18.5, prot:1.8, gord:0.1 },
  { nome:'Batata-doce cozida',     emoji:'🍠', cat:'carboidrato', kcal:77,  carb:18.0, prot:1.2, gord:0.1 },
  { nome:'Mandioca cozida',        emoji:'🫚', cat:'carboidrato', kcal:125, carb:30.1, prot:0.6, gord:0.3 },
  { nome:'Aveia em flocos',        emoji:'🥣', cat:'carboidrato', kcal:394, carb:67.5, prot:13.9,gord:8.5 },
  { nome:'Pão integral',           emoji:'🍞', cat:'carboidrato', kcal:253, carb:45.0, prot:9.0, gord:3.5 },
  { nome:'Quinoa cozida',          emoji:'🌾', cat:'carboidrato', kcal:120, carb:21.3, prot:4.4, gord:1.9 },
  { nome:'Milho cozido',           emoji:'🌽', cat:'carboidrato', kcal:86,  carb:18.7, prot:3.2, gord:1.2 },
  { nome:'Feijão carioca cozido',  emoji:'🫘', cat:'carboidrato', kcal:76,  carb:13.6, prot:4.8, gord:0.5 },
  { nome:'Lentilha cozida',        emoji:'🫘', cat:'carboidrato', kcal:116, carb:20.1, prot:9.0, gord:0.4 },
  { nome:'Grão-de-bico cozido',    emoji:'🫘', cat:'carboidrato', kcal:164, carb:27.4, prot:8.9, gord:2.6 },

  // PROTEÍNAS
  { nome:'Frango grelhado (peito)',emoji:'🍗', cat:'proteina',    kcal:159, carb:0,    prot:32.0,gord:3.2 },
  { nome:'Carne bovina magra',     emoji:'🥩', cat:'proteina',    kcal:219, carb:0,    prot:26.4,gord:12.5},
  { nome:'Ovo inteiro cozido',     emoji:'🥚', cat:'proteina',    kcal:146, carb:1.1,  prot:13.3,gord:9.5 },
  { nome:'Atum em água',           emoji:'🐟', cat:'proteina',    kcal:108, carb:0,    prot:24.1,gord:1.0 },
  { nome:'Salmão grelhado',        emoji:'🐟', cat:'proteina',    kcal:208, carb:0,    prot:20.4,gord:13.4},
  { nome:'Sardinha em conserva',   emoji:'🐟', cat:'proteina',    kcal:208, carb:0,    prot:24.6,gord:11.5},
  { nome:'Camarão cozido',         emoji:'🦐', cat:'proteina',    kcal:99,  carb:0.9,  prot:20.9,gord:1.1 },
  { nome:'Whey Protein (pó)',      emoji:'💪', cat:'proteina',    kcal:370, carb:6.0,  prot:75.0,gord:5.0 },
  { nome:'Carne suína magra',      emoji:'🥩', cat:'proteina',    kcal:215, carb:0,    prot:21.0,gord:14.0},
  { nome:'Tofu',                   emoji:'🧈', cat:'proteina',    kcal:76,  carb:1.9,  prot:8.1, gord:4.2 },

  // GORDURAS BOAS
  { nome:'Abacate',                emoji:'🥑', cat:'gordura_boa', kcal:160, carb:9.0,  prot:2.0, gord:14.7},
  { nome:'Azeite de oliva',        emoji:'🫙', cat:'gordura_boa', kcal:884, carb:0,    prot:0,   gord:100 },
  { nome:'Amêndoas',               emoji:'🌰', cat:'gordura_boa', kcal:579, carb:21.6, prot:21.2,gord:49.9},
  { nome:'Castanha-do-pará',       emoji:'🌰', cat:'gordura_boa', kcal:656, carb:12.3, prot:14.3,gord:66.4},
  { nome:'Nozes',                  emoji:'🥜', cat:'gordura_boa', kcal:654, carb:13.7, prot:15.2,gord:65.2},
  { nome:'Amendoim torrado',       emoji:'🥜', cat:'gordura_boa', kcal:567, carb:16.1, prot:25.8,gord:49.2},
  { nome:'Pasta de amendoim',      emoji:'🥜', cat:'gordura_boa', kcal:588, carb:20.0, prot:25.1,gord:50.4},
  { nome:'Óleo de coco',           emoji:'🫙', cat:'gordura_boa', kcal:892, carb:0,    prot:0,   gord:100 },
  { nome:'Semente de chia',        emoji:'🌱', cat:'gordura_boa', kcal:486, carb:42.1, prot:16.5,gord:30.7},
  { nome:'Linhaça',                emoji:'🌱', cat:'gordura_boa', kcal:534, carb:28.9, prot:18.3,gord:42.2},
  { nome:'Coco ralado s/ açúcar',  emoji:'🥥', cat:'gordura_boa', kcal:354, carb:15.2, prot:3.3, gord:33.5},

  // VEGETAIS
  { nome:'Brócolis cozido',        emoji:'🥦', cat:'vegetal',     kcal:35,  carb:7.2,  prot:2.4, gord:0.4 },
  { nome:'Espinafre cru',          emoji:'🥬', cat:'vegetal',     kcal:23,  carb:3.6,  prot:2.9, gord:0.4 },
  { nome:'Couve-flor cozida',      emoji:'🌾', cat:'vegetal',     kcal:23,  carb:4.1,  prot:1.8, gord:0.3 },
  { nome:'Cenoura crua',           emoji:'🥕', cat:'vegetal',     kcal:41,  carb:9.6,  prot:0.9, gord:0.2 },
  { nome:'Tomate cru',             emoji:'🍅', cat:'vegetal',     kcal:18,  carb:3.9,  prot:0.9, gord:0.2 },
  { nome:'Alface',                 emoji:'🥬', cat:'vegetal',     kcal:14,  carb:2.3,  prot:1.4, gord:0.2 },
  { nome:'Pepino cru',             emoji:'🥒', cat:'vegetal',     kcal:16,  carb:3.6,  prot:0.7, gord:0.1 },
  { nome:'Abobrinha cozida',       emoji:'🥬', cat:'vegetal',     kcal:17,  carb:3.4,  prot:1.1, gord:0.3 },
  { nome:'Beterraba cozida',       emoji:'🫛', cat:'vegetal',     kcal:44,  carb:9.9,  prot:1.7, gord:0.2 },
  { nome:'Berinjela cozida',       emoji:'🍆', cat:'vegetal',     kcal:33,  carb:8.7,  prot:0.8, gord:0.2 },

  // FRUTAS
  { nome:'Banana',                 emoji:'🍌', cat:'fruta',       kcal:89,  carb:23.0, prot:1.1, gord:0.3 },
  { nome:'Maçã',                   emoji:'🍎', cat:'fruta',       kcal:52,  carb:14.0, prot:0.3, gord:0.2 },
  { nome:'Laranja',                emoji:'🍊', cat:'fruta',       kcal:47,  carb:11.8, prot:0.9, gord:0.1 },
  { nome:'Manga',                  emoji:'🥭', cat:'fruta',       kcal:60,  carb:15.0, prot:0.8, gord:0.4 },
  { nome:'Morango',                emoji:'🍓', cat:'fruta',       kcal:32,  carb:7.7,  prot:0.7, gord:0.3 },
  { nome:'Uva',                    emoji:'🍇', cat:'fruta',       kcal:69,  carb:18.1, prot:0.7, gord:0.2 },
  { nome:'Mamão',                  emoji:'🍑', cat:'fruta',       kcal:43,  carb:10.8, prot:0.5, gord:0.3 },
  { nome:'Melancia',               emoji:'🍉', cat:'fruta',       kcal:30,  carb:7.6,  prot:0.6, gord:0.2 },
  { nome:'Abacaxi',                emoji:'🍍', cat:'fruta',       kcal:50,  carb:13.1, prot:0.5, gord:0.1 },
  { nome:'Kiwi',                   emoji:'🥝', cat:'fruta',       kcal:61,  carb:14.7, prot:1.1, gord:0.5 },

  // LATICÍNIOS
  { nome:'Leite integral',         emoji:'🥛', cat:'laticinio',   kcal:61,  carb:4.8,  prot:3.2, gord:3.3 },
  { nome:'Leite desnatado',        emoji:'🥛', cat:'laticinio',   kcal:35,  carb:4.9,  prot:3.4, gord:0.1 },
  { nome:'Iogurte natural integral',emoji:'🫙',cat:'laticinio',   kcal:61,  carb:4.7,  prot:3.5, gord:3.3 },
  { nome:'Iogurte grego',          emoji:'🫙', cat:'laticinio',   kcal:97,  carb:3.8,  prot:9.0, gord:5.0 },
  { nome:'Queijo cottage',         emoji:'🧀', cat:'laticinio',   kcal:98,  carb:3.4,  prot:11.1,gord:4.3 },
  { nome:'Queijo mussarela',       emoji:'🧀', cat:'laticinio',   kcal:280, carb:3.1,  prot:28.0,gord:17.1},
  { nome:'Queijo parmesão',        emoji:'🧀', cat:'laticinio',   kcal:431, carb:4.1,  prot:38.5,gord:29.0},
  { nome:'Requeijão light',        emoji:'🧈', cat:'laticinio',   kcal:140, carb:4.0,  prot:9.0, gord:9.0 },
];

/* ── Unidades inteligentes por alimento ─────────── */
const FOOD_UNITS = {
  // CARBOIDRATOS
  'Arroz branco cozido':     { u:'col.sopa',  p:25  }, // 1 col.sopa cheia ≈ 25g
  'Arroz integral cozido':   { u:'col.sopa',  p:25  },
  'Pão francês':             { u:'unid.',     p:50  },
  'Pão integral':            { u:'fatia',     p:25  },
  'Macarrão cozido':         { u:'col.sopa',  p:30  },
  'Batata inglesa cozida':   { u:'unid. méd', p:130 },
  'Batata-doce cozida':      { u:'unid. méd', p:130 },
  'Mandioca cozida':         { u:'pedaço',    p:100 },
  'Aveia em flocos':         { u:'col.sopa',  p:20  },
  'Quinoa cozida':           { u:'col.sopa',  p:25  },
  'Milho cozido':            { u:'col.sopa',  p:30  },
  'Feijão carioca cozido':   { u:'col.sopa',  p:25  },
  'Lentilha cozida':         { u:'col.sopa',  p:25  },
  'Grão-de-bico cozido':     { u:'col.sopa',  p:25  },
  // PROTEÍNAS
  'Ovo inteiro cozido':      { u:'unid.',     p:50  },
  'Atum em água':            { u:'col.sopa',  p:30  },
  'Sardinha em conserva':    { u:'unid.',     p:30  },
  'Whey Protein (pó)':       { u:'dose',      p:30  },
  'Tofu':                    { u:'fatia',     p:100 },
  // GORDURAS BOAS
  'Abacate':                 { u:'col.sopa',  p:30  },
  'Azeite de oliva':         { u:'col.sopa',  p:10  },
  'Amêndoas':                { u:'unid.',     p:1.2 },
  'Castanha-do-pará':        { u:'unid.',     p:5   },
  'Nozes':                   { u:'unid.',     p:7   },
  'Amendoim torrado':        { u:'col.sopa',  p:20  },
  'Pasta de amendoim':       { u:'col.sopa',  p:30  },
  'Óleo de coco':            { u:'col.chá',   p:5   },
  'Semente de chia':         { u:'col.sopa',  p:15  },
  'Linhaça':                 { u:'col.sopa',  p:10  },
  'Coco ralado s/ açúcar':   { u:'col.sopa',  p:15  },
  // VEGETAIS
  'Cenoura crua':            { u:'unid. méd', p:80  },
  'Tomate cru':              { u:'unid. méd', p:100 },
  'Alface':                  { u:'folha',     p:10  },
  'Pepino cru':              { u:'fatia',     p:20  },
  'Beterraba cozida':        { u:'fatia',     p:30  },
  // FRUTAS
  'Banana':                  { u:'unid.',     p:100 },
  'Maçã':                    { u:'unid.',     p:120 },
  'Laranja':                 { u:'unid.',     p:130 },
  'Manga':                   { u:'fatia',     p:100 },
  'Morango':                 { u:'unid.',     p:15  },
  'Uva':                     { u:'unid.',     p:5   },
  'Mamão':                   { u:'fatia',     p:130 },
  'Melancia':                { u:'fatia',     p:200 },
  'Abacaxi':                 { u:'fatia',     p:100 },
  'Kiwi':                    { u:'unid.',     p:80  },
  // LATICÍNIOS
  'Leite integral':          { u:'ml',        p:1   },
  'Leite desnatado':         { u:'ml',        p:1   },
  'Iogurte natural integral':{ u:'pote',      p:170 },
  'Iogurte grego':           { u:'pote',      p:130 },
  'Queijo cottage':          { u:'col.sopa',  p:30  },
  'Queijo mussarela':        { u:'fatia',     p:20  },
  'Queijo parmesão':         { u:'col.sopa',  p:10  },
  'Requeijão light':         { u:'col.sopa',  p:15  },
};
function _getUnit(nome) { return FOOD_UNITS[nome] || { u:'g', p:1 }; }
function _sanitizeId(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]/g,'_'); }

/* ── ESTADO DA APLICAÇÃO ────────────────────────── */
// Arrays/objetos mutáveis — populados por db.js (carregarDados()) após login
let medicamentos   = [];
let exames         = [];
let plano          = JSON.parse(localStorage.getItem('ns_plano_paciente') || '{}'); // cache local
let planoMedico    = JSON.parse(localStorage.getItem('ns_plano_medico') || '{}');
let modoPlano      = localStorage.getItem('ns_modo_plano') || 'medico'; // 'medico' | 'paciente'
let perfil         = JSON.parse(localStorage.getItem('ns_perfil') || '{}'); // cache local — sobrescrito pelo Supabase após login
let usoMeds        = (perfil.usoMeds || []);   // restaura uso de medicamentos do cache
let categoriaAtiva = 'todos';

/* ── ABAS ───────────────────────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'suplementacao') setTimeout(gerarAnaliseSuple, 50);
    if (btn.dataset.tab === 'dashboard')     setTimeout(atualizarDashboard, 50);
    if (btn.dataset.tab === 'downloads')     setTimeout(atualizarInfoDownloads, 50);
  });
});

function irParaAba(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');
  const panel = document.getElementById('tab-' + tabId);
  if (panel) panel.classList.add('active');
  if (tabId === 'suplementacao') setTimeout(gerarAnaliseSuple, 50);
  if (tabId === 'dashboard')     setTimeout(atualizarDashboard, 50);
}

/* ══════════════════════════════════════════════════
   MÓDULO: MEDICAMENTOS
══════════════════════════════════════════════════ */
function adicionarMedicamento() {
  const nome      = document.getElementById('med-nome').value.trim();
  const dosagem   = document.getElementById('med-dosagem').value.trim();
  const freq      = document.getElementById('med-frequencia').value;
  const inicio    = document.getElementById('med-inicio').value;
  const obs       = document.getElementById('med-obs').value.trim();
  const regPor    = document.getElementById('med-registrado').value;

  if (!nome) { alert('Informe o nome do medicamento.'); return; }

  const novoId = crypto.randomUUID();
  medicamentos.push({ id: novoId, nome, dosagem, freq, inicio, obs, regPor });
  renderMedicamentos();
  dbInserirMedicamento({ nome, dosagem, freq, inicio, obs, regPor }).then(uuid => {
    // Atualiza o ID local para o UUID real do Supabase
    if (uuid) { const m = medicamentos.find(m => m.id === novoId); if (m) m.id = uuid; }
  });
  limparForm(['med-nome','med-dosagem','med-obs']);
  document.getElementById('med-frequencia').value = '';
}

function removerMedicamento(id) {
  medicamentos = medicamentos.filter(m => m.id !== id);
  renderMedicamentos();
  dbRemoverMedicamento(id);
}

function renderMedicamentos() {
  const lista = document.getElementById('lista-medicamentos');
  if (!medicamentos.length) {
    lista.innerHTML = '<div class="empty-state">Nenhum medicamento cadastrado ainda.</div>';
    return;
  }
  lista.innerHTML = medicamentos.map(m => `
    <div class="med-item">
      <div class="med-item-info">
        <div class="med-nome">💊 ${esc(m.nome)}</div>
        ${m.dosagem ? `<span class="med-badge">${esc(m.dosagem)}</span>` : ''}
        ${m.freq    ? `<span class="med-badge freq">🕐 ${esc(m.freq)}</span>` : ''}
        ${m.inicio  ? `<span class="med-badge data">📅 Início: ${formatData(m.inicio)}</span>` : ''}
        <span class="med-badge reg">👤 ${esc(m.regPor)}</span>
        ${m.obs ? `<div class="med-obs-text">"${esc(m.obs)}"</div>` : ''}
      </div>
      <button class="btn btn-danger" onclick="removerMedicamento(${m.id})">🗑</button>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════
   MÓDULO: EXAMES
══════════════════════════════════════════════════ */
function preencherReferencia() {
  const tipo = document.getElementById('exame-tipo').value;
  const ref  = REFERENCIAS[tipo];
  if (ref) {
    document.getElementById('exame-unidade').value    = ref.unidade;
    document.getElementById('exame-referencia').value = ref.ref + ' | Atenção: ' + ref.alerta;
  } else {
    document.getElementById('exame-unidade').value    = '';
    document.getElementById('exame-referencia').value = '';
  }
}

function avaliarExame(tipo, valor) {
  const ref = REFERENCIAS[tipo];
  if (!ref) return 'normal';
  if (valor >= ref.min && valor <= ref.max) return 'normal';
  // Limítrofe: 10% acima ou abaixo
  const margem = (ref.max - ref.min) * 0.15 + ref.max * 0.1;
  if (Math.abs(valor - ref.max) <= margem || Math.abs(valor - ref.min) <= margem) return 'atencao';
  return 'alto';
}

function adicionarExame() {
  const tipo    = document.getElementById('exame-tipo').value;
  const res     = parseFloat(document.getElementById('exame-resultado').value);
  const data    = document.getElementById('exame-data').value;

  if (!tipo)        { alert('Selecione o tipo de exame.'); return; }
  if (isNaN(res))   { alert('Informe o resultado do exame.'); return; }

  const ref    = REFERENCIAS[tipo];
  const status = avaliarExame(tipo, res);

  const novoExameId = crypto.randomUUID();
  const novoExame = { id: novoExameId, tipo, nome: ref.nome, resultado: res, unidade: ref.unidade, referencia: ref.ref, status, data };
  exames.push(novoExame);
  renderExames();
  dbInserirExame(novoExame).then(uuid => {
    if (uuid) { const e = exames.find(e => e.id === novoExameId); if (e) e.id = uuid; }
  });
  document.getElementById('exame-tipo').value      = '';
  document.getElementById('exame-resultado').value = '';
  document.getElementById('exame-data').value      = '';
  document.getElementById('exame-unidade').value   = '';
  document.getElementById('exame-referencia').value= '';
}

function removerExame(id) {
  exames = exames.filter(e => e.id !== id);
  renderExames();
  dbRemoverExame(id);
}

const STATUS_LABEL = { normal:'Normal ✅', atencao:'Atenção ⚠️', alto:'Fora da Faixa 🔴' };

function renderExames() {
  const lista = document.getElementById('lista-exames');
  if (!exames.length) {
    lista.innerHTML = '<div class="empty-state">Nenhum exame registrado ainda.</div>';
    return;
  }
  lista.innerHTML = '<div class="exames-grid">' + exames.map(e => `
    <div class="exame-item ${e.status}">
      <div class="exame-nome">${esc(e.nome)}</div>
      <div class="exame-val ${e.status}">${e.resultado} <small style="font-size:.7em">${esc(e.unidade)}</small></div>
      <div class="exame-info">Ref: ${esc(e.referencia)}${e.data ? ' · ' + formatData(e.data) : ''}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:6px">
        <span class="status-badge ${e.status}">${STATUS_LABEL[e.status]}</span>
        <button class="btn btn-danger" style="padding:3px 8px;font-size:.75rem" onclick="removerExame(${e.id})">🗑</button>
      </div>
    </div>
  `).join('') + '</div>';
}

/* ══════════════════════════════════════════════════
   MÓDULO: ALIMENTOS
══════════════════════════════════════════════════ */
const CAT_NAMES = {
  carboidrato:'Carboidrato', proteina:'Proteína',
  gordura_boa:'Gordura Boa', vegetal:'Vegetal',
  fruta:'Fruta', laticinio:'Laticínio'
};

function filtrarCategoria(cat, el) {
  categoriaAtiva = cat;
  document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderAlimentos();
}

function filtrarAlimentos() { renderAlimentos(); }

function renderAlimentos() {
  const busca = document.getElementById('busca-alimento').value.toLowerCase();
  const grid  = document.getElementById('food-grid');

  let lista = ALIMENTOS;
  if (categoriaAtiva !== 'todos') lista = lista.filter(a => a.cat === categoriaAtiva);
  if (busca) lista = lista.filter(a => a.nome.toLowerCase().includes(busca));

  if (!lista.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">Nenhum alimento encontrado.</div>';
    return;
  }

  grid.innerHTML = lista.map(a => {
    const imgUrl = FOOD_IMAGES[a.nome];
    const imgHtml = imgUrl
      ? `<img src="${imgUrl}" alt="${esc(a.nome)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';
    return `
    <div class="food-card" onclick="selecionarAlimentoPlano('${esc(a.nome)}')">
      <div class="food-img-wrapper">
        ${imgHtml}
        <div class="food-img-emoji" style="${imgUrl ? 'display:none' : ''}">${a.emoji}</div>
      </div>
      <div class="food-card-body">
        <div class="food-name">${esc(a.nome)}</div>
        <div class="food-kcal">${a.kcal} <small style="font-size:.6em;font-weight:500">kcal</small></div>
        <div class="food-macros">
          <div class="food-macro carb">${a.carb}g<span>Carb</span></div>
          <div class="food-macro prot">${a.prot}g<span>Prot</span></div>
          <div class="food-macro gord">${a.gord}g<span>Gord</span></div>
        </div>
        <span class="food-cat-tag cat-${a.cat}">${CAT_NAMES[a.cat]}</span>
      </div>
    </div>`;
  }).join('');
}

function selecionarAlimentoPlano(nome) {
  // Muda para aba plano e pré-seleciona o alimento
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-tab="plano"]').classList.add('active');
  document.getElementById('tab-plano').classList.add('active');

  const sel = document.getElementById('plano-alimento');
  for (let i = 0; i < sel.options.length; i++) {
    if (sel.options[i].text === nome) { sel.value = sel.options[i].value; break; }
  }
}

/* ══════════════════════════════════════════════════
   MÓDULO: PLANO ALIMENTAR
══════════════════════════════════════════════════ */
/* ── Calcula total de kcal de um dia em um plano ─── */
function calcularKcalDia(planoObj, dia) {
  if (!planoObj || !planoObj[dia]) return 0;
  let total = 0;
  Object.values(planoObj[dia]).forEach(itens => itens.forEach(item => { total += item.kcal || 0; }));
  return total;
}

/* ── Atualiza resumo calórico diário ───────────── */
function atualizarResumoDiario() {
  const diaEl  = document.getElementById('resumo-dia-sel');
  const dia    = diaEl ? diaEl.value : 'Segunda';
  const meta   = parseFloat(document.getElementById('meta-kcal')?.value) || 2000;
  const total  = calcularKcalDia(planoMedico, dia) + calcularKcalDia(plano, dia);
  const rest   = Math.max(0, meta - total);
  const exc    = Math.max(0, total - meta);
  const pct    = Math.min(100, (total / meta) * 100);

  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('resumo-meta-val', meta.toFixed(0) + ' kcal');
  set('resumo-cons-val', total.toFixed(0) + ' kcal');
  set('resumo-rest-val', rest.toFixed(0) + ' kcal');
  set('resumo-exc-val',  exc.toFixed(0)  + ' kcal');
  set('plano-progress-pct', pct.toFixed(0) + '% da meta');

  const excCard = document.getElementById('resumo-excesso-card');
  if (excCard) excCard.style.display = exc > 0 ? 'flex' : 'none';

  const fill = document.getElementById('plano-progress-fill');
  if (fill) {
    fill.style.width      = pct + '%';
    fill.style.background = exc > 0 ? '#ef4444' : pct >= 90 ? '#22c55e' : 'var(--primary)';
  }

  const trophy = document.getElementById('plano-trophy');
  if (trophy) trophy.style.display = (total > 0 && total >= meta) ? 'inline-flex' : 'none';
}

function calcularMetas() {
  const kcal     = parseFloat(document.getElementById('meta-kcal').value)     || 2000;
  const carbPct  = parseFloat(document.getElementById('meta-carb-pct').value) || 50;
  const protPct  = parseFloat(document.getElementById('meta-prot-pct').value) || 25;
  const gordPct  = parseFloat(document.getElementById('meta-gord-pct').value) || 25;

  const carbG = ((kcal * carbPct / 100) / 4).toFixed(0);
  const protG = ((kcal * protPct / 100) / 4).toFixed(0);
  const gordG = ((kcal * gordPct / 100) / 9).toFixed(0);

  document.getElementById('macro-bars').innerHTML = `
    <div class="macro-bar-item">
      <div class="macro-bar-label">🍞 Carboidratos</div>
      <div class="macro-bar-value carb">${carbG}g (${carbPct}%)</div>
      <div class="macro-bar-track"><div class="macro-bar-fill carb" style="width:${carbPct}%"></div></div>
    </div>
    <div class="macro-bar-item">
      <div class="macro-bar-label">🥩 Proteínas</div>
      <div class="macro-bar-value prot">${protG}g (${protPct}%)</div>
      <div class="macro-bar-track"><div class="macro-bar-fill prot" style="width:${protPct}%"></div></div>
    </div>
    <div class="macro-bar-item">
      <div class="macro-bar-label">🥑 Gorduras</div>
      <div class="macro-bar-value gord">${gordG}g (${gordPct}%)</div>
      <div class="macro-bar-track"><div class="macro-bar-fill gord" style="width:${gordPct}%"></div></div>
    </div>
  `;
  atualizarResumoDiario();
}

function popularSelectAlimentos() {
  const sel = document.getElementById('plano-alimento');
  sel.innerHTML = '<option value="">Selecione...</option>';
  ALIMENTOS.forEach((a, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.text  = a.nome;
    sel.appendChild(opt);
  });
}

/* ── Modo do plano: médico ou paciente ─────────── */
function setModoPlano(modo) {
  modoPlano = modo;
  localStorage.setItem('ns_modo_plano', modo);
  const lblEl = document.getElementById('plano-modo-label');
  const descEl = document.getElementById('plano-modo-desc');
  const addCard = document.getElementById('plano-add-card');
  if (lblEl) lblEl.textContent = modo === 'medico' ? 'Médico' : 'Paciente';
  if (descEl) descEl.innerHTML = modo === 'medico'
    ? '👨‍⚕️ <strong>Modo Médico</strong> — Editando plano prescrito para o paciente'
    : '👤 <strong>Modo Paciente</strong> — Visualizando prescrição + adicionando itens pessoais';
  if (addCard) addCard.style.display = 'block';
  document.querySelectorAll('.btn-modo-plano').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-modo-' + modo)?.classList.add('active');
  renderPlano();
}

function adicionarAoPlano() {
  const dia      = document.getElementById('plano-dia').value;
  const ref      = document.getElementById('plano-refeicao').value;
  const idx      = document.getElementById('plano-alimento').value;
  const qtd      = parseFloat(document.getElementById('plano-qtd').value);

  if (idx === '' || isNaN(qtd) || qtd <= 0) { alert('Selecione um alimento e informe a quantidade.'); return; }

  const alimento = ALIMENTOS[parseInt(idx)];
  const fator    = qtd / 100;

  const item = {
    id:     Date.now(),
    nome:   alimento.nome,
    emoji:  alimento.emoji,
    qtd,
    kcal:   +(alimento.kcal * fator).toFixed(1),
    carb:   +(alimento.carb * fator).toFixed(1),
    prot:   +(alimento.prot * fator).toFixed(1),
    gord:   +(alimento.gord * fator).toFixed(1),
  };

  if (modoPlano === 'medico') {
    if (!planoMedico[dia]) planoMedico[dia] = {};
    if (!planoMedico[dia][ref]) planoMedico[dia][ref] = [];
    planoMedico[dia][ref].push(item);
    localStorage.setItem('ns_plano_medico', JSON.stringify(planoMedico));
  } else {
    if (!plano[dia]) plano[dia] = {};
    if (!plano[dia][ref]) plano[dia][ref] = [];
    plano[dia][ref].push(item);
    dbSalvarPlano(plano);
  }

  renderPlano();
  atualizarResumoDiario();
}

function removerItemPlano(dia, ref, id, tipo) {
  const alvo = tipo === 'medico' ? planoMedico : plano;
  alvo[dia][ref] = alvo[dia][ref].filter(i => i.id !== id);
  if (!alvo[dia][ref].length) delete alvo[dia][ref];
  if (!Object.keys(alvo[dia]).length) delete alvo[dia];
  if (tipo === 'medico') localStorage.setItem('ns_plano_medico', JSON.stringify(planoMedico));
  else dbSalvarPlano(plano);
  renderPlano();
  atualizarResumoDiario();
}

const DIAS_ORDEM = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
const REFEICAO_ORDEM = ['Café da manhã','Lanche da manhã','Almoço','Lanche da tarde','Jantar','Ceia'];

/* ── Funções de interação inline por refeição ────── */
function toggleAddForm(formId) {
  const el = document.getElementById(formId);
  if (!el) return;
  const visible = el.style.display !== 'none';
  el.style.display = visible ? 'none' : 'flex';
  if (!visible) el.querySelector('select')?.focus();
}

function onFoodSelChange(formId) {
  const idx    = document.getElementById('fsel_' + formId)?.value;
  const qtyEl  = document.getElementById('fqty_' + formId);
  const unitEl = document.getElementById('funit_' + formId);
  const kcalEl = document.getElementById('fkcal_' + formId);
  if (!idx || idx === '') { if (kcalEl) kcalEl.textContent = '— kcal'; return; }
  const a = ALIMENTOS[parseInt(idx)];
  const { u, p } = _getUnit(a.nome);
  if (unitEl) unitEl.textContent = u;
  // Quantidade padrão inteligente: 100g/ml ou 1 unidade
  const isGramsOrMl = u === 'g' || u === 'ml';
  if (qtyEl) { qtyEl.value = isGramsOrMl ? 100 : 1; qtyEl.step = isGramsOrMl ? '10' : '1'; }
  const qty  = parseFloat(qtyEl?.value) || 0;
  const qtdG = isGramsOrMl ? qty : qty * p;
  if (kcalEl) kcalEl.textContent = qty > 0 ? (a.kcal * qtdG / 100).toFixed(0) + ' kcal' : '— kcal';
}

function onFoodQtyChange(formId) {
  const idx    = document.getElementById('fsel_' + formId)?.value;
  const qty    = parseFloat(document.getElementById('fqty_' + formId)?.value) || 0;
  const kcalEl = document.getElementById('fkcal_' + formId);
  if (!idx || !kcalEl) return;
  const a = ALIMENTOS[parseInt(idx)];
  const { u, p } = _getUnit(a.nome);
  const qtdG = (u === 'g' || u === 'ml') ? qty : qty * p;
  kcalEl.textContent = qty > 0 ? (a.kcal * qtdG / 100).toFixed(0) + ' kcal' : '— kcal';
}

function confirmarAddAlimentoInline(dia, ref, tipo, formId) {
  const idx  = document.getElementById('fsel_' + formId)?.value;
  const qty  = parseFloat(document.getElementById('fqty_' + formId)?.value);
  if (!idx || idx === '' || isNaN(qty) || qty <= 0) return;
  const alimento = ALIMENTOS[parseInt(idx)];
  const { u, p } = _getUnit(alimento.nome);
  const qtdG  = (u === 'g' || u === 'ml') ? qty : qty * p;
  const fator = qtdG / 100;
  const item  = {
    id: Date.now(), nome: alimento.nome, emoji: alimento.emoji,
    qtd: qtdG, qtdReal: qty, unit: u,           // armazena qtd real + unidade
    kcal: +(alimento.kcal * fator).toFixed(1), carb: +(alimento.carb * fator).toFixed(1),
    prot: +(alimento.prot * fator).toFixed(1), gord: +(alimento.gord * fator).toFixed(1),
  };
  if (tipo === 'medico') {
    if (!planoMedico[dia])      planoMedico[dia] = {};
    if (!planoMedico[dia][ref]) planoMedico[dia][ref] = [];
    planoMedico[dia][ref].push(item);
    localStorage.setItem('ns_plano_medico', JSON.stringify(planoMedico));
  } else {
    if (!plano[dia])      plano[dia] = {};
    if (!plano[dia][ref]) plano[dia][ref] = [];
    plano[dia][ref].push(item);
    dbSalvarPlano(plano);
  }
  // Fecha form e reseta para próxima adição
  const formEl = document.getElementById(formId);
  if (formEl) {
    const sel = formEl.querySelector('select');
    const qty = formEl.querySelector('input[type="number"]');
    if (sel) sel.value = '';
    if (qty) { qty.value = 100; qty.step = '10'; }
    const kcalEl = document.getElementById('fkcal_' + formId);
    const unitEl = document.getElementById('funit_' + formId);
    if (kcalEl) kcalEl.textContent = '— kcal';
    if (unitEl) unitEl.textContent = 'g';
    formEl.style.display = 'none';
  }
  renderPlano(); atualizarResumoDiario();
}

function atualizarQtdPlano(dia, ref, id, tipo, novaQtdStr) {
  const novaQtd = parseFloat(novaQtdStr);
  if (isNaN(novaQtd) || novaQtd <= 0) return;
  const alvo = tipo === 'medico' ? planoMedico : plano;
  if (!alvo[dia]?.[ref]) return;
  const idx = alvo[dia][ref].findIndex(i => i.id === id);
  if (idx === -1) return;
  const alimento = ALIMENTOS.find(a => a.nome === alvo[dia][ref][idx].nome);
  if (!alimento) return;
  const { u, p } = _getUnit(alimento.nome);
  const qtdG  = (u === 'g' || u === 'ml') ? novaQtd : novaQtd * p;
  const fator = qtdG / 100;
  alvo[dia][ref][idx] = { ...alvo[dia][ref][idx], qtd: qtdG, qtdReal: novaQtd, unit: u,
    kcal: +(alimento.kcal * fator).toFixed(1), carb: +(alimento.carb * fator).toFixed(1),
    prot: +(alimento.prot * fator).toFixed(1), gord: +(alimento.gord * fator).toFixed(1),
  };
  if (tipo === 'medico') localStorage.setItem('ns_plano_medico', JSON.stringify(planoMedico));
  else dbSalvarPlano(alvo);
  renderPlano(); atualizarResumoDiario();
}

const EMOJI_REF = { 'Café da manhã':'☀️','Lanche da manhã':'🍎','Almoço':'🍽️','Lanche da tarde':'🥗','Jantar':'🌙','Ceia':'🌛' };

function _renderDiaCard(dia, diaData, tipo) {
  let totalKcal = 0, totalCarb = 0, totalProt = 0, totalGord = 0;
  const badge = tipo === 'medico'
    ? '<span class="plano-badge medico">👨‍⚕️ Prescrito</span>'
    : '<span class="plano-badge paciente">👤 Pessoal</span>';

  const refeicoes = REFEICAO_ORDEM.map(ref => {
    const itens  = diaData[ref] || [];
    let refKcal  = 0;
    const formId = _sanitizeId(`f_${tipo}_${dia}_${ref}`);

    const chips = itens.map(item => {
      refKcal += item.kcal; totalKcal += item.kcal;
      totalCarb += item.carb; totalProt += item.prot; totalGord += item.gord;
      const imgUrl = typeof FOOD_IMAGES !== 'undefined' && FOOD_IMAGES[item.nome];
      const media  = imgUrl
        ? `<img src="${imgUrl}" class="food-chip-img" onerror="this.style.display='none'">`
        : `<span class="food-chip-emoji">${item.emoji}</span>`;
      // Unidade e quantidade para exibição no chip
      const { u: uFU } = _getUnit(item.nome);
      const chipUnit = item.unit || uFU;                                 // usa unidade salva ou detecta
      const isGramsOrMl = chipUnit === 'g' || chipUnit === 'ml';
      const chipQty  = (!isGramsOrMl && item.qtdReal != null) ? item.qtdReal : item.qtd;
      return `<div class="food-chip">
        ${media}
        <div class="food-chip-body">
          <span class="food-chip-nome">${esc(item.nome)}</span>
          <div class="food-chip-meta">
            <input type="number" class="food-chip-qty-input" value="${chipQty}" min="0.1" step="any"
              onchange="atualizarQtdPlano('${dia}','${esc(ref)}',${item.id},'${tipo}',this.value)"
              title="Quantidade em ${chipUnit}">
            <span class="food-chip-unit">${chipUnit}</span>
            <span class="food-chip-kcal">${item.kcal.toFixed(0)} kcal</span>
          </div>
        </div>
        <button class="food-chip-del" onclick="removerItemPlano('${dia}','${esc(ref)}',${item.id},'${tipo}')" title="Remover">×</button>
      </div>`;
    }).join('');

    const optsAlimentos = ALIMENTOS.map((a,i) => `<option value="${i}">${a.nome}</option>`).join('');

    return `<div class="plano-refeicao-grupo">
      <div class="plano-refeicao-titulo">
        <span>${EMOJI_REF[ref] || ''} ${ref}</span>
        ${refKcal > 0 ? `<span class="plano-ref-kcal-total">${refKcal.toFixed(0)} kcal</span>` : ''}
      </div>
      <div class="food-chips-area">
        ${chips}
        <button class="food-chip-add-btn" onclick="toggleAddForm('${formId}')">+ Adicionar</button>
      </div>
      <div id="${formId}" class="meal-inline-form" style="display:none">
        <select id="fsel_${formId}" onchange="onFoodSelChange('${formId}')">
          <option value="">Alimento...</option>${optsAlimentos}
        </select>
        <input type="number" id="fqty_${formId}" value="100" min="1" class="meal-form-qty"
          oninput="onFoodQtyChange('${formId}')">
        <span id="funit_${formId}" class="meal-form-unit">g</span>
        <span id="fkcal_${formId}" class="meal-form-kcal">— kcal</span>
        <button class="btn btn-primary btn-sm" style="padding:4px 10px"
          onclick="confirmarAddAlimentoInline('${dia}','${esc(ref)}','${tipo}','${formId}')">✓</button>
        <button class="btn btn-sm" style="padding:4px 10px"
          onclick="toggleAddForm('${formId}')">✕</button>
      </div>
    </div>`;
  }).join('');

  return `<div class="plano-dia-card">
    <div class="plano-dia-header">
      <span>📅 ${dia}</span>${badge}
    </div>
    <div class="plano-dia-body">
      ${refeicoes}
      ${totalKcal > 0 ? `<div class="plano-total">
        <span>Total do dia</span>
        <div style="text-align:right">
          <span class="plano-total-kcal">${totalKcal.toFixed(0)} kcal</span>
          <div style="font-size:.75rem;font-weight:500;color:#64748b;margin-top:2px">
            Carb: ${totalCarb.toFixed(1)}g &nbsp; Prot: ${totalProt.toFixed(1)}g &nbsp; Gord: ${totalGord.toFixed(1)}g
          </div>
        </div>
      </div>` : ''}
    </div>
  </div>`;
}

function renderPlano() {
  const container = document.getElementById('plano-semanal');

  // Sempre renderiza os 7 dias do modo ATIVO (com ou sem dados)
  // O outro modo só aparece nos dias em que já tem dados
  container.innerHTML = DIAS_ORDEM.map(dia => {
    let html = '';
    if (modoPlano === 'medico'   || planoMedico[dia]) {
      html += _renderDiaCard(dia, planoMedico[dia] || {}, 'medico');
    }
    if (modoPlano === 'paciente' || plano[dia]) {
      html += _renderDiaCard(dia, plano[dia] || {}, 'paciente');
    }
    return html;
  }).join('');

  atualizarResumoDiario();
}

/* ── UTILITÁRIOS ─────────────────────────────────── */
// salvar() foi substituído por funções async em db.js (dbInserirMedicamento, dbInserirExame, dbSalvarPlano, dbSalvarPerfil)

/* ── Toast de notificação (substitui alert para não bloquear render mobile) ── */
function mostrarToast(msg, tipo = 'sucesso') {
  const old = document.getElementById('ns-toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.id = 'ns-toast';
  t.className = 'ns-toast ns-toast-' + tipo;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('ns-toast-show'), 10);
  setTimeout(() => { t.classList.remove('ns-toast-show'); setTimeout(() => t.remove(), 300); }, 3000);
}

function limparForm(ids) { ids.forEach(id => { document.getElementById(id).value = ''; }); }

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function formatData(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

/* ══════════════════════════════════════════════════
   MÓDULO: PERFIL DO PACIENTE — MEDICAMENTOS EM USO
══════════════════════════════════════════════════ */

/* ── Medicamentos em Uso Atual ───────────────────── */
function renderLinhasUsoMed() {
  const lista = document.getElementById('uso-med-lista');
  if (!lista) return;
  if (!usoMeds.length) {
    lista.innerHTML = '<p class="campo-hint" style="margin:6px 0 0">Clique em "+ Adicionar" para registrar um medicamento em uso.</p>';
    return;
  }
  lista.innerHTML = usoMeds.map((m, i) => `
    <div class="uso-med-linha">
      <input type="text" value="${esc(m.nome)}" placeholder="Nome do medicamento" class="uso-inp-nome"
        oninput="usoMeds[${i}].nome=this.value" />
      <input type="text" value="${esc(m.dosagem)}" placeholder="Dosagem (ex: 500mg)" class="uso-inp-dose"
        oninput="usoMeds[${i}].dosagem=this.value" />
      <input type="text" value="${esc(m.freq)}" placeholder="Freq. (ex: 2x ao dia)" class="uso-inp-freq"
        oninput="usoMeds[${i}].freq=this.value" />
      <button class="btn-remove-uso" onclick="removerUsoMed(${i})" title="Remover">✕</button>
    </div>
  `).join('');
}

function adicionarLinhaUsoMed() {
  usoMeds.push({ nome: '', dosagem: '', freq: '' });
  renderLinhasUsoMed();
  // Foco no último campo de nome
  setTimeout(() => {
    const inputs = document.querySelectorAll('.uso-inp-nome');
    if (inputs.length) inputs[inputs.length - 1].focus();
  }, 50);
}

function removerUsoMed(i) {
  usoMeds.splice(i, 1);
  renderLinhasUsoMed();
}

/* ── GLP-1 / Análogos ────────────────────────────── */
const GLP1_VITAMINAS = [
  {
    nome: 'Vitamina B12',
    prioridade: 'alta',
    motivo: 'A redução do ácido gástrico e menor ingestão de carnes/laticínios aumentam o risco de deficiência. Pode causar anemia e neuropatia periférica.',
    dose_sugerida: '500–1.000 mcg/dia (oral) ou conforme exame laboratorial',
    exame: 'vitamina_b12',
    referencias: 'Müller et al., 2021; ASMBS Clinical Guidelines 2020',
  },
  {
    nome: 'Vitamina D3',
    prioridade: 'alta',
    motivo: 'Alta prevalência de hipovitaminose D em pacientes com obesidade. Perda de peso rápida pode mobilizar vitamina D armazenada, mas a reposição é essencial para saúde óssea e imunidade.',
    dose_sugerida: '1.500–3.000 UI/dia (ajustar pelo exame de 25-OH Vitamina D)',
    exame: 'vitamina_d',
    referencias: 'Dobbins et al., 2023; Gletsu-Miller & Wright, 2013',
  },
  {
    nome: 'Cálcio',
    prioridade: 'media',
    motivo: 'A deficiência de Vitamina D compromete absorção de cálcio. Perda de peso rápida aumenta risco de desmineralização óssea e osteopenia a longo prazo.',
    dose_sugerida: '1.000–1.500 mg/dia em doses divididas (citrato de cálcio preferencialmente)',
    exame: null,
    referencias: 'ASMBS/ISSFAL Guidelines 2022; Sheu et al., 2021',
  },
  {
    nome: 'Ferro (Bisglicinato Ferroso)',
    prioridade: 'media',
    motivo: 'Redução da ingestão alimentar e menor acidez gástrica comprometem absorção de ferro. Risco aumentado em mulheres em idade fértil.',
    dose_sugerida: '18–60 mg de ferro elementar/dia (conforme ferritina e ferro sérico)',
    exame: 'ferritina',
    referencias: 'Aasheim et al., 2008; Stein et al., 2019',
  },
  {
    nome: 'Zinco',
    prioridade: 'media',
    motivo: 'Sensível à restrição proteica. Deficiência pode causar queda de cabelo, prejuízo imunológico e cicatrização lenta — queixa frequente em usuários de GLP-1.',
    dose_sugerida: '8–11 mg/dia (RDA) — até 25 mg/dia em deficiência confirmada',
    exame: null,
    referencias: 'Nicoletti et al., 2013; Sheikhi et al., 2021',
  },
  {
    nome: 'Magnésio',
    prioridade: 'media',
    motivo: 'Náusea e vômitos frequentes no início do tratamento podem reduzir absorção. Deficiência associa-se a câimbras, fadiga e insulino-resistência.',
    dose_sugerida: '300–400 mg/dia (glicinato ou citrato — melhor tolerância gástrica)',
    exame: null,
    referencias: 'de Baaij et al., 2015; Gommers et al., 2016',
  },
  {
    nome: 'Vitamina B1 (Tiamina)',
    prioridade: 'media',
    motivo: 'Vômitos persistentes no início da terapia podem causar depleção de tiamina. Deficiência grave leva à encefalopatia de Wernicke — condição grave mas prevenível.',
    dose_sugerida: '100 mg/dia durante períodos de vômitos frequentes',
    exame: null,
    referencias: 'Singh & Kumar, 2007; Sola et al., 2020',
  },
  {
    nome: 'Ácido Fólico (Vitamina B9)',
    prioridade: 'media',
    motivo: 'A redução no consumo de folhas verdes e grãos (por náusea e anorexia) pode reduzir aporte de folato, essencial para síntese de DNA e saúde cardiovascular.',
    dose_sugerida: '400–800 mcg/dia',
    exame: null,
    referencias: 'Moizé et al., 2011; Poitou Bernert et al., 2003',
  },
  {
    nome: 'Vitamina A',
    prioridade: 'baixa',
    motivo: 'Vitamina lipossolúvel — pode ser mobilizada com perda de tecido adiposo. Monitorar em dietas muito restritivas.',
    dose_sugerida: '5.000–10.000 UI/dia (beta-caroteno ou retinol — conforme avaliação)',
    exame: null,
    referencias: 'Mechanick et al., 2020; ASMBS Nutritional Guidelines',
  },
  {
    nome: 'Vitamina E',
    prioridade: 'baixa',
    motivo: 'Vitamina lipossolúvel com função antioxidante. Redução de gorduras na dieta pode comprometer ingestão adequada.',
    dose_sugerida: '15 mg/dia (RDA) — conforme avaliação dietética',
    exame: null,
    referencias: 'Mechanick et al., 2020',
  },
  {
    nome: 'Selênio',
    prioridade: 'baixa',
    motivo: 'Mineral antioxidante essencial para função tireoidiana e imunidade. Dietas restritivas prolongadas podem reduzir a ingestão.',
    dose_sugerida: '55–200 mcg/dia',
    exame: null,
    referencias: 'Combs, 2015; Scientific Opinion EFSA 2014',
  },
  {
    nome: 'Proteínas (Aminoácidos Essenciais)',
    prioridade: 'alta',
    motivo: 'Perda de peso rápida implica risco de perda de massa muscular (sarcopenia). Ingestão proteica adequada é fundamental para preservar músculo.',
    dose_sugerida: '≥ 1,2–1,5 g proteína/kg de peso ideal/dia — suplementar com Whey, caseína ou proteína vegetal se necessário',
    exame: null,
    referencias: 'Bauer et al., 2013; Katsanos et al., 2006',
  },
];

function toggleGlp1() {
  const ativo = document.getElementById('glp1-ativo').checked;
  document.getElementById('glp1-detalhe').style.display = ativo ? 'block' : 'none';
  if (ativo) atualizarAlertaGlp1();
}

function atualizarAlertaGlp1() {
  const box = document.getElementById('glp1-vitaminas-grid');
  if (!box) return;
  box.innerHTML = GLP1_VITAMINAS.map(v => {
    const cor   = v.prioridade === 'alta' ? 'vit-alta' : v.prioridade === 'media' ? 'vit-media' : 'vit-baixa';
    const label = v.prioridade === 'alta' ? '🔴 Prioridade Alta' : v.prioridade === 'media' ? '🟡 Atenção' : '🟢 Monitorar';
    return `
      <div class="glp1-vit-card ${cor}">
        <div class="glp1-vit-header">
          <strong>${esc(v.nome)}</strong>
          <span class="glp1-vit-badge">${label}</span>
        </div>
        <p class="glp1-vit-motivo">${esc(v.motivo)}</p>
        <div class="glp1-vit-dose">💊 <strong>Sugestão:</strong> ${esc(v.dose_sugerida)}</div>
        <div class="glp1-vit-ref">📚 <em>${esc(v.referencias)}</em></div>
      </div>`;
  }).join('');
}

/* ── Salvar / Carregar Perfil ────────────────────── */
function salvarPerfil() {
  perfil.nome       = document.getElementById('paciente-nome').value.trim();
  perfil.nascimento = document.getElementById('paciente-nascimento').value;
  perfil.medico     = document.getElementById('paciente-medico').value.trim();
  perfil.crm        = document.getElementById('paciente-crm').value.trim();
  // Dados biométricos
  perfil.sexo      = (document.getElementById('paciente-sexo')?.value       || '');
  perfil.peso      = parseFloat(document.getElementById('paciente-peso')?.value)   || null;
  perfil.altura    = parseFloat(document.getElementById('paciente-altura')?.value) || null;
  perfil.atividade = document.getElementById('paciente-atividade')?.value   || '';
  perfil.objetivo  = document.getElementById('paciente-objetivo')?.value    || '';
  perfil.cintura   = parseFloat(document.getElementById('paciente-cintura')?.value) || null;
  perfil.glp1Ativo  = document.getElementById('glp1-ativo').checked;
  if (perfil.glp1Ativo) {
    perfil.glp1Tipo   = document.getElementById('glp1-tipo').value;
    perfil.glp1Dose   = document.getElementById('glp1-dose').value;
    perfil.glp1Freq   = document.getElementById('glp1-freq').value;
    perfil.glp1Inicio = document.getElementById('glp1-inicio').value;
  }
  // Captura os dados digitados nas linhas de uso
  document.querySelectorAll('.uso-med-linha').forEach((row, i) => {
    const inp = row.querySelectorAll('input');
    if (usoMeds[i]) {
      usoMeds[i].nome    = inp[0].value.trim();
      usoMeds[i].dosagem = inp[1].value.trim();
      usoMeds[i].freq    = inp[2].value.trim();
    }
  });
  usoMeds = usoMeds.filter(m => m.nome);
  renderLinhasUsoMed();
  registrarEvolucao();
  dbSalvarPerfil({ ...perfil, usoMeds }).then(() => {
    mostrarToast('✅ Dados do paciente salvos com sucesso!');
  });
}

function limparPerfil() {
  if (!confirm('Limpar todos os dados do paciente?')) return;
  Object.keys(perfil).forEach(k => delete perfil[k]);
  usoMeds.length = 0;
  dbSalvarPerfil({ usoMeds: [] });
  ['paciente-nome','paciente-nascimento','paciente-medico','paciente-crm'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('glp1-ativo').checked = false;
  document.getElementById('glp1-detalhe').style.display = 'none';
  renderLinhasUsoMed();
}

function carregarPerfil() {
  if (perfil.nome)       document.getElementById('paciente-nome').value       = perfil.nome;
  if (perfil.nascimento) document.getElementById('paciente-nascimento').value = perfil.nascimento;
  if (perfil.medico)     document.getElementById('paciente-medico').value     = perfil.medico;
  if (perfil.crm)        document.getElementById('paciente-crm').value        = perfil.crm;
  if (perfil.peso)       { const el = document.getElementById('paciente-peso');    if (el) el.value = perfil.peso; }
  if (perfil.altura)     { const el = document.getElementById('paciente-altura');  if (el) el.value = perfil.altura; }
  if (perfil.sexo)       { const el = document.getElementById('paciente-sexo');    if (el) el.value = perfil.sexo; }
  if (perfil.cintura)    { const el = document.getElementById('paciente-cintura'); if (el) el.value = perfil.cintura; }
  if (perfil.atividade)  { const el = document.getElementById('paciente-atividade'); if (el) el.value = perfil.atividade; }
  if (perfil.objetivo)   { const el = document.getElementById('paciente-objetivo');  if (el) el.value = perfil.objetivo; }
  calcularIMC();
  if (perfil.glp1Ativo) {
    document.getElementById('glp1-ativo').checked = true;
    document.getElementById('glp1-detalhe').style.display = 'block';
    if (perfil.glp1Tipo)   document.getElementById('glp1-tipo').value    = perfil.glp1Tipo;
    if (perfil.glp1Dose)   document.getElementById('glp1-dose').value    = perfil.glp1Dose;
    if (perfil.glp1Freq)   document.getElementById('glp1-freq').value    = perfil.glp1Freq;
    if (perfil.glp1Inicio) document.getElementById('glp1-inicio').value  = perfil.glp1Inicio;
    atualizarAlertaGlp1();
  }
  renderLinhasUsoMed();
}

/* ══════════════════════════════════════════════════
   MÓDULO: SUPLEMENTAÇÃO — ANÁLISE POR EXAMES
══════════════════════════════════════════════════ */
const SUPLE_MAP = {
  vitamina_d: {
    nome:'Vitamina D', icone:'☀️',
    quando_baixo: {
      urgencia:'alta',
      titulo:'Suplementação de Vitamina D3 indicada',
      recomendacao:'Vitamina D3 (colecalciferol): 1.500–4.000 UI/dia em caso de insuficiência. Em deficiência grave (< 20 ng/mL) pode ser necessária dose de ataque prescrita pelo médico.',
      alimentos:'Salmão, sardinha, gema de ovo, cogumelos, leite e derivados fortificados',
      observacao:'Absorção melhora com refeições contendo gordura. Sempre dosar 25-OH Vitamina D antes e durante a suplementação.',
    },
    quando_alto: {
      urgencia:'atencao',
      titulo:'Vitamina D acima do recomendado',
      recomendacao:'Evitar suplementação adicional. Valores > 150 ng/mL podem causar hipercalcemia. Reavalie com o médico.',
      alimentos:'Sem restrição alimentar específica.',
      observacao:'Hipervitaminose D é causada principalmente por suplementação excessiva, não por alimentos.',
    },
  },
  vitamina_b12: {
    nome:'Vitamina B12', icone:'🔴',
    quando_baixo: {
      urgencia:'alta',
      titulo:'Suplementação de Vitamina B12 indicada',
      recomendacao:'Cianocobalamina ou metilcobalamina: 500–1.000 mcg/dia (oral) ou conforme orientação médica. Em deficiência grave, pode ser necessária administração intramuscular.',
      alimentos:'Carnes vermelhas, fígado, frango, peixes, ovos, laticínios',
      observacao:'Essencial em idosos, vegetarianos, pacientes em uso de metformina ou análogos GLP-1. Solicite também avaliação de folato.',
    },
    quando_alto: null,
  },
  ferro: {
    nome:'Ferro Sérico', icone:'🟤',
    quando_baixo: {
      urgencia:'alta',
      titulo:'Ferro sérico baixo — investigar anemia ferropriva',
      recomendacao:'Ferro quelado (bisglicinato ferroso): 30–60 mg de ferro elementar/dia, de preferência em jejum ou com vitamina C para melhor absorção.',
      alimentos:'Carnes vermelhas, fígado, feijão, lentilha, espinafre + vitamina C para potencializar absorção',
      observacao:'Evitar tomar ferro junto com cálcio, chá preto e café. Repor por 3–6 meses após normalização.',
    },
    quando_alto: {
      urgencia:'atencao',
      titulo:'Ferro sérico elevado',
      recomendacao:'Não suplementar ferro. Investigar hemocromatose ou outras causas. Encaminhar ao médico.',
      alimentos:'Reduzir consumo de carnes vermelhas.',
      observacao:'Sobrecarga de ferro é prejudicial. Não suplementar sem indicação médica.',
    },
  },
  ferritina: {
    nome:'Ferritina', icone:'🟤',
    quando_baixo: {
      urgencia:'alta',
      titulo:'Ferritina baixa — reservas de ferro depletadas',
      recomendacao:'Ferro quelado (bisglicinato ferroso): 30–60 mg/dia. Ferritina baixa precede a anemia e deve ser corrigida precocemente.',
      alimentos:'Carnes, leguminosas, vegetais verde-escuros + vitamina C na mesma refeição',
      observacao:'Mulheres em idade fértil têm maior risco. Em pacientes com GLP-1, a redução alimentar agrava o quadro.',
    },
    quando_alto: {
      urgencia:'atencao',
      titulo:'Ferritina elevada',
      recomendacao:'Ferritina alta pode indicar inflamação, hemocromatose ou doença hepática — não suplementar ferro. Investigar com PCR e avaliação médica.',
      alimentos:'Sem alteração específica.',
      observacao:'Não confundir ferritina alta com excesso de ferro — é também um marcador inflamatório.',
    },
  },
  hemoglobina: {
    nome:'Hemoglobina', icone:'🩸',
    quando_baixo: {
      urgencia:'critica',
      titulo:'Anemia — investigar causa e suplementar',
      recomendacao:'Investigar tipo de anemia: ferropriva (repor ferro), megaloblástica (repor B12/folato), mista. A abordagem depende da causa.',
      alimentos:'Varia conforme o tipo: carnes e leguminosas (ferro), ovos e laticínios (B12), folhas verdes (folato)',
      observacao:'Não iniciar suplementação cega — identificar a causa. Encaminhar ao médico para avaliação urgente.',
    },
    quando_alto: null,
  },
  hematocrito: {
    nome:'Hematócrito', icone:'🩸',
    quando_baixo: {
      urgencia:'alta',
      titulo:'Hematócrito baixo — possível anemia',
      recomendacao:'Complementar com hemoglobina, ferritina e B12 para identificar a causa. Repor conforme etiologia.',
      alimentos:'Ferro heme (carnes), vitamina B12 (ovos, laticínios), ácido fólico (vegetais folhosos)',
      observacao:'Avaliar em conjunto com hemoglobina e hemograma completo.',
    },
    quando_alto: null,
  },
  tsh: {
    nome:'TSH (Tireóide)', icone:'🦋',
    quando_baixo: {
      urgencia:'atencao',
      titulo:'TSH baixo — possível hipertireoidismo',
      recomendacao:'Evitar suplementação de iodo e algas marinhas (kelp). Encaminhar ao endocrinologista. Monitorar T3 e T4.',
      alimentos:'Evitar excesso de iodo: algas, suplementos de iodo, sal iodado em excesso',
      observacao:'Não suplementar selênio em doses altas sem avaliação. Foco no acompanhamento médico.',
    },
    quando_alto: {
      urgencia:'alta',
      titulo:'TSH elevado — possível hipotireoidismo',
      recomendacao:'Selênio (100–200 mcg/dia) pode auxiliar a função tireoidiana. Avaliar deficiência de iodo e Vitamina D. O tratamento principal é médico (levotiroxina).',
      alimentos:'Castanha-do-pará (1–2 unidades/dia ≈ 100mcg selênio), peixes, frutos do mar',
      observacao:'O tratamento do hipotireoidismo é principalmente medicamentoso. Suplementos são coadjuvantes.',
    },
  },
  t4l: {
    nome:'T4 Livre', icone:'🦋',
    quando_baixo: {
      urgencia:'alta',
      titulo:'T4 Livre baixo — hipotireoidismo',
      recomendacao:'Tratamento médico primário (levotiroxina). Suporte: selênio 100–200 mcg/dia e Vitamina D. Evitar goitrogênios crus em excesso.',
      alimentos:'Castanha-do-pará (selênio), peixes, frutos do mar (iodo)',
      observacao:'Suplementação é adjuvante ao tratamento médico principal.',
    },
    quando_alto: null,
  },
  glicemia_jejum: {
    nome:'Glicemia em Jejum', icone:'🍬',
    quando_baixo: null,
    quando_alto: {
      urgencia:'atencao',
      titulo:'Glicemia elevada — suporte nutricional ao controle glicêmico',
      recomendacao:'Magnésio (300–400 mg/dia), Cromo (200–400 mcg/dia) e Vitamina D podem auxiliar no controle glicêmico como adjuvantes.',
      alimentos:'Canela, vinagre de maçã, vegetais de baixo IG, fibras solúveis (aveia, chia, linhaça)',
      observacao:'Suplementos são coadjuvantes. O controle glicêmico principal vem de dieta, exercício e medicação.',
    },
  },
  hba1c: {
    nome:'Hemoglobina Glicada (HbA1c)', icone:'🍬',
    quando_baixo: null,
    quando_alto: {
      urgencia:'alta',
      titulo:'HbA1c elevada — risco de diabetes',
      recomendacao:'Avaliar suplementação de Magnésio, Cromo e Vitamina D como adjuvantes. Priorizar intervenção médica e dietética.',
      alimentos:'Dieta de baixo IG, fibras, canela, vegetais e proteínas magras',
      observacao:'HbA1c ≥ 6,5% configura diagnóstico de diabetes — encaminhar ao endocrinologista.',
    },
  },
  colesterol_total: {
    nome:'Colesterol Total', icone:'💛',
    quando_baixo: null,
    quando_alto: {
      urgencia:'atencao',
      titulo:'Colesterol total elevado',
      recomendacao:'Ômega-3 (EPA+DHA 1–4 g/dia), Niacina (B3) e fibras solúveis (psyllium) podem auxiliar. Avaliar com médico.',
      alimentos:'Salmão, atum, sardinha, nozes, azeite, aveia, abacate, chia, linhaça',
      observacao:'Sempre associar à mudança de dieta e estilo de vida. Evitar gorduras trans e saturadas em excesso.',
    },
  },
  ldl: {
    nome:'LDL', icone:'🔴',
    quando_baixo: null,
    quando_alto: {
      urgencia:'alta',
      titulo:'LDL elevado — risco cardiovascular',
      recomendacao:'Ômega-3 (2–4 g/dia EPA+DHA), Berberina (500 mg 2–3x/dia), Psyllium (5–10 g antes das refeições) e fitoesteróis são adjuvantes eficazes.',
      alimentos:'Peixes gordurosos, nozes, azeite extra virgem, abacate, fibras solúveis (aveia, maçã, feijão)',
      observacao:'LDL > 160 mg/dL geralmente requer intervenção medicamentosa (estatinas). Discutir com médico.',
    },
  },
  hdl: {
    nome:'HDL (Colesterol Bom)', icone:'💚',
    quando_baixo: {
      urgencia:'alta',
      titulo:'HDL baixo — risco cardiovascular aumentado',
      recomendacao:'Ômega-3 (2–4 g/dia), Niacina (B3) supervisionada e exercício aeróbico são as melhores intervenções. Evitar gorduras trans.',
      alimentos:'Azeite extra virgem, abacate, nozes, salmão, ovo (com moderação)',
      observacao:'HDL < 40 (homens) ou < 50 (mulheres) é fator de risco independente para doenças cardíacas.',
    },
    quando_alto: null,
  },
  triglicerideos: {
    nome:'Triglicerídeos', icone:'🟠',
    quando_baixo: null,
    quando_alto: {
      urgencia:'alta',
      titulo:'Triglicerídeos elevados',
      recomendacao:'Ômega-3 de alta dose (3–4 g/dia EPA+DHA) tem maior evidência para redução de triglicerídeos. Eliminar açúcares simples e álcool.',
      alimentos:'Peixes gordurosos 3–4x/semana, nozes, linhaça, vegetais folhosos. Reduzir carboidratos refinados, sucos e bebidas açucaradas.',
      observacao:'Triglicerídeos > 500 mg/dL: risco de pancreatite aguda — encaminhar ao médico imediatamente.',
    },
  },
  tgo: {
    nome:'TGO (AST)', icone:'🟣',
    quando_baixo: null,
    quando_alto: {
      urgencia:'atencao',
      titulo:'TGO elevado — possível dano hepático',
      recomendacao:'Silimarina (extrato de cardo mariano) 200–400 mg/dia pode apoiar a função hepática. Evitar álcool e suplementos hepatotóxicos.',
      alimentos:'Brócolis, beterraba, alho, curcuma, alcachofra. Reduzir álcool, frituras e ultraprocessados.',
      observacao:'TGO > 3x o limite superior requer investigação médica urgente.',
    },
  },
  tgp: {
    nome:'TGP (ALT)', icone:'🟣',
    quando_baixo: null,
    quando_alto: {
      urgencia:'atencao',
      titulo:'TGP elevado — alerta hepático',
      recomendacao:'Silimarina 200–400 mg/dia, Vitamina E (400–800 UI/dia em NASH), N-acetilcisteína. Evitar álcool e hepatotóxicos.',
      alimentos:'Alimentos anti-inflamatórios: brócolis, curcuma, azeite, frutas vermelhas. Eliminar álcool e ultraprocessados.',
      observacao:'TGP > 3x o limite superior = encaminhar ao hepatologista.',
    },
  },
  acido_urico: {
    nome:'Ácido Úrico', icone:'🦴',
    quando_baixo: null,
    quando_alto: {
      urgencia:'atencao',
      titulo:'Ácido úrico elevado — risco de gota',
      recomendacao:'Vitamina C (500–1.000 mg/dia) pode reduzir o ácido úrico. Hidratação intensa (2,5–3L de água/dia). Extrato de cereja azeda tem evidências preliminares.',
      alimentos:'Água, cerejas, frutas cítricas, vegetais. Reduzir: carnes vermelhas, vísceras, frutos do mar, cerveja, refrigerantes com frutose',
      observacao:'Evitar dieta cetogênica muito restritiva — pode elevar o ácido úrico. Tratar gota aguda com médico.',
    },
  },
  creatinina: {
    nome:'Creatinina', icone:'💧',
    quando_baixo: null,
    quando_alto: {
      urgencia:'critica',
      titulo:'Creatinina elevada — função renal comprometida',
      recomendacao:'Encaminhar ao nefrologista. Restringir proteínas (0,6–0,8 g/kg/dia). Evitar suplementos que sobrecarreguem os rins: creatina, proteínas em excesso, AINEs.',
      alimentos:'Vegetais, frutas, grãos com baixo potássio. Evitar processados com fósforo e potássio elevados.',
      observacao:'Não suplementar potássio, fósforo ou proteínas sem avaliação nefrológica.',
    },
  },
  leucocitos: {
    nome:'Leucócitos', icone:'⚪',
    quando_baixo: {
      urgencia:'alta',
      titulo:'Leucócitos baixos — imunidade reduzida',
      recomendacao:'Zinco (15–25 mg/dia), Vitamina C (500–1.000 mg/dia), Vitamina D e probióticos podem apoiar a função imunológica. Investigar a causa com médico.',
      alimentos:'Proteínas magras, frutas cítricas, castanhas, alho, gengibre, iogurte natural',
      observacao:'Leucocitopenia pode indicar infecção viral, quimioterapia, aplasia medular — diagnóstico médico essencial.',
    },
    quando_alto: {
      urgencia:'atencao',
      titulo:'Leucócitos elevados — processo inflamatório ou infecção',
      recomendacao:'Não é indicação de suplementação imediata. Identificar e tratar a causa. Vitamina C e Zinco podem ser coadjuvantes.',
      alimentos:'Anti-inflamatórios naturais: curcuma, gengibre, frutas vermelhas, ômega-3',
      observacao:'Leucocitose marcada requer diagnóstico médico — pode indicar infecção bacteriana, leucemia ou outra condição.',
    },
  },
  // ── Novos exames ───────────────────────────────────────────────────────
  insulina: {
    nome:'Insulina (Basal)', icone:'🍬',
    quando_baixo: null,
    quando_alto: {
      urgencia:'alta',
      titulo:'Insulina elevada — provável resistência insulínica',
      recomendacao:'Magnésio (300–400 mg/dia), Cromo (200–400 mcg/dia), Berberina (500 mg 2–3x/dia) e Vitamina D são adjuvantes para melhora da sensibilidade à insulina. O tratamento principal é dietético e médico.',
      alimentos:'Dieta de baixo índice glicêmico, fibras solúveis (aveia, chia, psyllium), canela, vinagre de maçã. Reduzir carboidratos refinados e açúcar.',
      observacao:'Insulina em jejum > 25 µU/mL sugere resistência insulínica. Solicitar HOMA-IR para confirmação. > 50 µU/mL é considerado patológico por alguns autores (Bittar). Encaminhar ao endocrinologista.',
    },
  },
  pcr: {
    nome:'Proteína C Reativa', icone:'🔥',
    quando_baixo: null,
    quando_alto: {
      urgencia:'alta',
      titulo:'PCR elevada — inflamação sistêmica ativa',
      recomendacao:'Ômega-3 (2–4 g/dia EPA+DHA), Curcumina/Açafrão-da-terra (500–1.000 mg/dia com piperina), Vitamina D e resveratrol têm ação anti-inflamatória. Identificar e eliminar a causa da inflamação.',
      alimentos:'Frutas vermelhas, azeite extra virgem, curcuma, gengibre, peixe gordo, nozes, vegetais coloridos. Reduzir ultraprocessados, açúcar e gordura trans.',
      observacao:'PCR é um marcador inflamatório inespecífico. Pode indicar infecção, doença autoimune, síndrome metabólica ou inflamação crônica de baixo grau. Investigar causa com médico.',
    },
  },
  magnesio: {
    nome:'Magnésio', icone:'🟩',
    quando_baixo: {
      urgencia:'alta',
      titulo:'Magnésio baixo — hipomagnesemia',
      recomendacao:'Magnésio glicinato ou citrato: 300–400 mg/dia. Formas queladas têm melhor absorção e menos efeitos laxativos. O óxido de magnésio tem baixa biodisponibilidade.',
      alimentos:'Folhas verdes escuras (espinafre, couve), castanhas e sementes, leguminosas, abacate, banana, cacau 70%+',
      observacao:'Hipomagnesemia associa-se a câimbras, ansiedade, insônia, arritmias e piora do controle glicêmico. Muito prevalente em usuários de diuréticos, IBPs e GLP-1.',
    },
    quando_alto: {
      urgencia:'atencao',
      titulo:'Magnésio elevado',
      recomendacao:'Evitar suplementação. Investigar causa (insuficiência renal é a mais comum). Encaminhar ao médico.',
      alimentos:'Sem restrição alimentar específica.',
      observacao:'Hipermagnesemia grave é rara em pessoas com rins funcionais. A maioria é assintomática.',
    },
  },
  zinco: {
    nome:'Zinco Sérico', icone:'🔵',
    quando_baixo: {
      urgencia:'alta',
      titulo:'Zinco baixo — deficiência confirmada',
      recomendacao:'Zinco quelado (bisglicinato ou gluconato): 15–25 mg/dia. Evitar tomar junto com cálcio ou ferro — competem pela absorção. Não ultrapassar 40 mg/dia cronicamente.',
      alimentos:'Ostras (maior fonte), carnes vermelhas, frutos do mar, sementes de abóbora, castanhas, grãos integrais',
      observacao:'Deficiência de zinco causa queda de cabelo, baixa imunidade, cicatrização lenta, hipogeusia (perda do paladar) e hiposmia. Comum em vegetarianos e usuários de GLP-1.',
    },
    quando_alto: {
      urgencia:'atencao',
      titulo:'Zinco elevado',
      recomendacao:'Parar suplementação de zinco. Zinco em excesso inibe absorção de cobre — solicitar dosagem de cobre sérico.',
      alimentos:'Sem restrição alimentar específica.',
      observacao:'Hiperzincemia crônica pode causar deficiência de cobre e anemia. Geralmente por suplementação excessiva.',
    },
  },
  vitamina_c: {
    nome:'Vitamina C', icone:'🍊',
    quando_baixo: {
      urgencia:'alta',
      titulo:'Vitamina C baixa — possível hipovitaminose C',
      recomendacao:'Ácido ascórbico: 500–1.000 mg/dia (oral, dose dividida para melhor absorção). Formas tamponadas (ascorbato de cálcio/sódio) são mais toleradas gastrointestinalmente.',
      alimentos:'Acerola, caju, goiaba, kiwi, laranja, limão, morango, pimentão cru, brócolis, espinafre cru',
      observacao:'Vitamina C é essencial para síntese de colágeno, imunidade e absorção de ferro não-heme. Calor destrói a vitamina C — preferir alimentos crus ou levemente cozidos.',
    },
    quando_alto: null,
  },
  selenio: {
    nome:'Selênio Sérico', icone:'🟡',
    quando_baixo: {
      urgencia:'alta',
      titulo:'Selênio baixo — deficiência confirmada',
      recomendacao:'Selenometionina ou selenito de sódio: 100–200 mcg/dia. Não ultrapassar 400 mcg/dia — margem entre dose terapêutica e tóxica é estreita.',
      alimentos:'Castanha-do-pará (1–2 unidades/dia ≈ 70–100 mcg), peixes, frutos do mar, carnes, ovos',
      observacao:'Selênio é essencial para função tireoidiana (conversão T4→T3), ação antioxidante e imunidade. Deficiência associada ao hipotireoidismo e maior risco de doenças autoimunes da tireoide.',
    },
    quando_alto: {
      urgencia:'atencao',
      titulo:'Selênio elevado — risco de selenose',
      recomendacao:'Parar qualquer suplementação de selênio. Evitar consumo excessivo de castanha-do-pará.',
      alimentos:'Limitar castanha-do-pará a no máximo 1–2 por semana.',
      observacao:'Selênio acima de 400 µg/L pode causar selenose: queda de cabelo, unhas quebradiças, alho no hálito, fadiga. Raro, geralmente por suplementação excessiva.',
    },
  },
  t3l: {
    nome:'T3 Livre', icone:'🦋',
    quando_baixo: {
      urgencia:'alta',
      titulo:'T3 Livre baixo — possível hipotireoidismo ou T3 baixo funcional',
      recomendacao:'Selênio (100–200 mcg/dia) apoia a conversão de T4 em T3. Zinco e Vitamina D também são cofatores. O tratamento principal é médico (pode ser necessário T3 ou associação T4+T3).',
      alimentos:'Castanha-do-pará (selênio), peixes (iodo), ovos',
      observacao:'T3 baixo com TSH normal pode indicar síndrome do T3 baixo (associada a estresse crônico, dieta hipocalórica ou doença sistêmica). Não é necessariamente hipotireoidismo clássico.',
    },
    quando_alto: {
      urgencia:'atencao',
      titulo:'T3 Livre elevado — possível hipertireoidismo',
      recomendacao:'Evitar suplementação de iodo, algas, kelp e selênio em altas doses. Encaminhar ao endocrinologista.',
      alimentos:'Evitar excesso de iodo.',
      observacao:'T3 elevado com TSH supresso = hipertireoidismo. Requer avaliação médica urgente.',
    },
  },
  t3r: {
    nome:'T3 Reverso', icone:'🦋',
    quando_baixo: null,
    quando_alto: {
      urgencia:'atencao',
      titulo:'T3 Reverso elevado — possível hipotireoidismo funcional',
      recomendacao:'Identificar e tratar as causas: estresse crônico (cortisol elevado), dietas muito restritivas, inflamação crônica (PCR elevada), deficiência de selênio e zinco. Suporte: Selênio 100–200 mcg/dia.',
      alimentos:'Dieta equilibrada com calorias adequadas, proteínas, castanha-do-pará, peixes',
      observacao:'T3R elevado indica conversão preferencial de T4 em T3 inativo. É comum em dietas muito restritivas, jejum prolongado e uso crônico de corticoides. Avaliar com endocrinologista.',
    },
  },
  testosterona_total: {
    nome:'Testosterona Total', icone:'💪',
    quando_baixo: {
      urgencia:'alta',
      titulo:'Testosterona Total baixa — hipogonadismo',
      recomendacao:'Zinco (15–25 mg/dia), Vitamina D (2.000–4.000 UI/dia), Magnésio, Ashwagandha (300–600 mg/dia) e DHEA (sob supervisão médica) podem apoiar a produção hormonal. O tratamento definitivo é médico (TRT).',
      alimentos:'Ovos, carnes vermelhas, ostras, brócolis, nozes, azeite, abacate. Reduzir álcool e ultraprocessados.',
      observacao:'Testosterona < 300 ng/dL em homens = hipogonadismo. Pode causar fadiga, redução de libido, depressão, ganho de gordura e perda muscular. Encaminhar ao urologista ou endocrinologista.',
    },
    quando_alto: {
      urgencia:'atencao',
      titulo:'Testosterona Total elevada',
      recomendacao:'Evitar suplementos que elevem testosterona (DHEA, Tribulus, Ashwagandha). Investigar causa.',
      alimentos:'Sem restrição específica.',
      observacao:'Em homens, testosterona muito elevada pode indicar uso de anabolizantes ou tumor adrenal. Em mulheres, pode indicar SOP (síndrome dos ovários policísticos). Avaliar com médico.',
    },
  },
  estradiol: {
    nome:'Estradiol', icone:'🌸',
    quando_baixo: {
      urgencia:'atencao',
      titulo:'Estradiol baixo em homens — investigar',
      recomendacao:'Zinco (15 mg/dia) pode ajudar a regular a aromatização. O tratamento é médico. Em homens, estradiol abaixo de 11 pg/mL associa-se a perda óssea e de libido.',
      alimentos:'Sem suplementação alimentar específica para elevar estradiol.',
      observacao:'Em homens, estradiol é produzido pela conversão (aromatização) de testosterona. Equilíbrio testosterona/estradiol é essencial. Avaliação médica obrigatória.',
    },
    quando_alto: {
      urgencia:'atencao',
      titulo:'Estradiol elevado em homens — hiperestrogenismo',
      recomendacao:'DIM (diindolilmetano — extrato de brócolis): 100–200 mg/dia pode apoiar o metabolismo do estrogênio. Reduzir gordura visceral (principal local de aromatização). Tratamento médico se necessário.',
      alimentos:'Brócolis, couve-de-bruxelas, couve-flor, repolho (contêm DIM natural). Evitar álcool e xenoestrógenos (plásticos BPA).',
      observacao:'Estradiol elevado em homens associa-se à obesidade, uso de anabolizantes e disfunção hepática. Causa ginecomastia, redução de libido e infertilidade.',
    },
  },
  shbg: {
    nome:'SHBG', icone:'🔗',
    quando_baixo: {
      urgencia:'atencao',
      titulo:'SHBG baixa — maior testosterona livre biodisponível',
      recomendacao:'SHBG baixa com testosterona total normal = testosterona livre elevada. Investigar causa: insulina elevada é a principal causa de SHBG baixa. Tratar resistência insulínica.',
      alimentos:'Dieta de baixo IG, fibras, reduzir açúcar e carboidratos refinados que elevam insulina.',
      observacao:'SHBG muito baixa associa-se a síndrome metabólica, resistência insulínica e risco cardiovascular. É um marcador importante de saúde metabólica.',
    },
    quando_alto: {
      urgencia:'atencao',
      titulo:'SHBG elevada — menor testosterona biodisponível',
      recomendacao:'SHBG elevada "sequestra" testosterona, deixando menos hormônio livre ativo. Investigar hipotireoidismo e anorexia (causas comuns). Tratar causa subjacente.',
      alimentos:'Proteínas animais (ajudam a reduzir levemente SHBG), zinco.',
      observacao:'SHBG elevada pode causar sintomas de baixa testosterona mesmo com testosterona total "normal". Sempre avaliar testosterona livre em conjunto.',
    },
  },
  homocisteina: {
    nome:'Homocisteína', icone:'❤️',
    quando_baixo: null,
    quando_alto: {
      urgencia:'alta',
      titulo:'Homocisteína elevada — risco cardiovascular e neurológico',
      recomendacao:'Vitamina B12 (500–1.000 mcg/dia), Ácido Fólico (800–1.000 mcg/dia) e Vitamina B6 (50 mg/dia) são os principais redutores de homocisteína. Associar Betaína (trimetilglicina — TMG) nos casos resistentes.',
      alimentos:'Vegetais folhosos verdes (folato), ovos e carnes (B12), leguminosas (folato), beterraba (betaína)',
      observacao:'Homocisteína > 15 µmol/L associa-se a aterosclerose acelerada, AVC, infarto e demência. O tratamento com vitaminas do complexo B é muito eficaz na maioria dos casos.',
    },
  },
  apolipo_a1: {
    nome:'Apolipoproteína A1', icone:'💚',
    quando_baixo: {
      urgencia:'alta',
      titulo:'ApoA1 baixa — risco cardiovascular elevado',
      recomendacao:'ApoA1 é o principal componente do HDL. As mesmas estratégias para elevar HDL se aplicam: Ômega-3 (2–4 g/dia), Niacina (B3 supervisionada), exercício aeróbico regular.',
      alimentos:'Azeite extra virgem, abacate, nozes, peixes gordurosos, ovos',
      observacao:'ApoA1 < 100 mg/dL é preditor independente de risco cardiovascular, mesmo com HDL aparentemente normal. É um marcador mais preciso que o HDL em alguns contextos.',
    },
    quando_alto: null,
  },
  apolipo_b: {
    nome:'Apolipoproteína B', icone:'🔴',
    quando_baixo: null,
    quando_alto: {
      urgencia:'alta',
      titulo:'ApoB elevada — alta carga de partículas aterogênicas',
      recomendacao:'Ômega-3 (3–4 g/dia EPA+DHA), Berberina (500 mg 2–3x/dia) e fitoesteróis reduzem ApoB. ApoB elevado é considerado por muitos cardiologistas um marcador mais preciso de risco que o LDL.',
      alimentos:'Peixes gordurosos, nozes, azeite, fibras solúveis (aveia, psyllium). Reduzir gorduras saturadas, trans e carboidratos refinados.',
      observacao:'ApoB representa a quantidade total de partículas aterogênicas (LDL, VLDL, IDL). É considerado o melhor preditor de risco cardiovascular residual. ApoB > 100 mg/dL = alto risco.',
    },
  },
  fosfatase_alcalina: {
    nome:'Fosfatase Alcalina', icone:'🟣',
    quando_baixo: null,
    quando_alto: {
      urgencia:'atencao',
      titulo:'Fosfatase Alcalina elevada',
      recomendacao:'Depende da origem (hepática ou óssea). Se hepática: Silimarina 200–400 mg/dia, evitar álcool e hepatotóxicos. Se óssea: Vitamina D e Cálcio. Investigar causa com médico.',
      alimentos:'Anti-inflamatórios hepáticos: curcuma, brócolis, alho. Evitar álcool e frituras.',
      observacao:'Fosfatase alcalina tem origem hepática e óssea. Em crianças e adolescentes, valores altos são normais (crescimento ósseo). Em adultos, investigar doença hepática, óssea (doença de Paget, metástase) ou hipertireoidismo.',
    },
  },
  amilase: {
    nome:'Amilase', icone:'🔵',
    quando_baixo: null,
    quando_alto: {
      urgencia:'alta',
      titulo:'Amilase elevada — alerta pancreático',
      recomendacao:'Não há suplementação específica. Prioridade é investigação médica urgente. Período de repouso pancreático (jejum ou dieta líquida) conforme orientação médica.',
      alimentos:'Evitar gorduras e álcool. Dieta líquida ou semi-líquida até avaliação médica.',
      observacao:'Amilase > 3x o valor normal = pancreatite aguda até prova em contrário. Encaminhar URGENTE ao médico. Elevações leves podem ser de origem salivar ou ovário.',
    },
  },
  lipase: {
    nome:'Lipase', icone:'🔵',
    quando_baixo: null,
    quando_alto: {
      urgencia:'alta',
      titulo:'Lipase elevada — suspeita de pancreatite',
      recomendacao:'Investigação médica urgente. Lipase é mais específica para pancreatite do que amilase. Não iniciar suplementação.',
      alimentos:'Jejum ou dieta sem gorduras até avaliação médica.',
      observacao:'Lipase > 3x o valor normal com dor abdominal = diagnóstico provável de pancreatite aguda. Encaminhar URGENTE. Pode ser desencadeada por cálculos biliares, álcool ou triglicerídeos muito elevados.',
    },
  },
  bilirrubina_total: {
    nome:'Bilirrubina Total', icone:'💛',
    quando_baixo: null,
    quando_alto: {
      urgencia:'atencao',
      titulo:'Bilirrubina Total elevada',
      recomendacao:'Silimarina (200–400 mg/dia) para suporte hepático. Investigar causa: hepatite, obstrução biliar, anemia hemolítica ou Síndrome de Gilbert (benigna e hereditária).',
      alimentos:'Evitar álcool. Aumentar hidratação. Curcuma e alcachofra apoiam a função biliar.',
      observacao:'Icterícia clínica (amarelamento da pele/olhos) aparece com bilirrubina > 3 mg/dL. Síndrome de Gilbert (bilirrubina levemente elevada isolada) é benigna, afeta 5–10% da população.',
    },
  },
  bilirrubina_direta: {
    nome:'Bilirrubina Direta', icone:'💛',
    quando_baixo: null,
    quando_alto: {
      urgencia:'atencao',
      titulo:'Bilirrubina Direta elevada — colestase ou doença hepática',
      recomendacao:'Silimarina 200–400 mg/dia. Evitar medicamentos hepatotóxicos e álcool. Investigar obstrução biliar, hepatite viral, colangite.',
      alimentos:'Dieta pobre em gorduras, abundante em frutas e vegetais.',
      observacao:'Bilirrubina direta (conjugada) elevada sugere problema na excreção biliar. Encaminhar ao hepatologista ou gastroenterologista.',
    },
  },
  vldl: {
    nome:'Colesterol VLDL', icone:'🟠',
    quando_baixo: null,
    quando_alto: {
      urgencia:'atencao',
      titulo:'VLDL elevado — relacionado a triglicerídeos altos',
      recomendacao:'Ômega-3 em alta dose (3–4 g/dia EPA+DHA). VLDL é calculado a partir dos triglicerídeos (TG/5), então o tratamento é o mesmo do hipertrigliceridemia.',
      alimentos:'Reduzir açúcares, álcool, carboidratos refinados. Aumentar fibras, peixes gordurosos, nozes.',
      observacao:'VLDL transporta triglicerídeos. Sua elevação é praticamente sempre paralela à dos triglicerídeos. Tratamento: mesmo protocolo de hipertrigliceridemia.',
    },
  },
  prolactina: {
    nome:'Prolactina', icone:'🌸',
    quando_baixo: null,
    quando_alto: {
      urgencia:'alta',
      titulo:'Prolactina elevada — hiperprolactinemia',
      recomendacao:'Vitamina B6 (piridoxal-5-fosfato: 50–100 mg/dia) pode ajudar a modular prolactina em casos leves. O tratamento principal é médico (cabergolina ou bromocriptina). Investigar adenoma hipofisário.',
      alimentos:'Evitar alimentos que mimetizam estrogênio em excesso. Reduzir estresse.',
      observacao:'Prolactina > 25 ng/mL em homens ou > 30 fora da gestação em mulheres = hiperprolactinemia. Causa principal: adenoma hipofisário (prolactinoma). Pode causar infertilidade, disfunção erétil e galactorreia. Requer RM de crânio.',
    },
  },
};

function gerarAnaliseSuple() {
  const grid     = document.getElementById('suple-cards-grid');
  const semEl    = document.getElementById('suple-sem-exames');
  const resumoEl = document.getElementById('suple-resumo-exames');
  if (!grid) return;

  if (!exames || !exames.length) {
    semEl.style.display = 'block';
    resumoEl.innerHTML = '';
    grid.innerHTML = '';
    return;
  }
  semEl.style.display = 'none';

  // Pegar o exame mais recente de cada tipo
  const mapaExames = {};
  exames.forEach(e => {
    if (!mapaExames[e.tipo] || e.data > mapaExames[e.tipo].data) mapaExames[e.tipo] = e;
  });

  let totalCadastrados = Object.keys(mapaExames).length;
  let comAlerta = 0;
  const cards = [];

  for (const [chave, analise] of Object.entries(SUPLE_MAP)) {
    const exame = mapaExames[chave];
    const ref   = REFERENCIAS[chave];
    if (!exame) { cards.push({ status:'sem-exame', chave, analise }); continue; }

    const valor  = parseFloat(exame.resultado ?? exame.valor);
    const abaixo = valor < ref.min;
    const acima  = valor > ref.max;

    if (!abaixo && !acima) {
      cards.push({ status:'normal', chave, analise, exame, ref, valor });
      continue;
    }
    comAlerta++;
    const recInfo = abaixo ? analise.quando_baixo : analise.quando_alto;
    if (recInfo) cards.push({ status: recInfo.urgencia, chave, analise, exame, ref, valor, abaixo, acima, recInfo });
  }

  // Ordenar por criticidade
  const ordem = { critica:0, alta:1, atencao:2, normal:3, 'sem-exame':4 };
  cards.sort((a, b) => (ordem[a.status]??5) - (ordem[b.status]??5));

  const total = Object.keys(SUPLE_MAP).length;
  const pendentes = total - totalCadastrados;
  const dataStr = Object.values(mapaExames)[0]?.data || '';

  resumoEl.innerHTML = `
    <div class="suple-resumo-row">
      <div class="suple-stat ${comAlerta>0?'stat-alerta':'stat-ok'}">
        <span class="stat-num">${comAlerta}</span>
        <span class="stat-label">Exame${comAlerta!==1?'s':''} com alerta</span>
      </div>
      <div class="suple-stat">
        <span class="stat-num">${totalCadastrados}</span>
        <span class="stat-label">Exame${totalCadastrados!==1?'s':''} cadastrado${totalCadastrados!==1?'s':''}</span>
      </div>
      <div class="suple-stat">
        <span class="stat-num">${pendentes}</span>
        <span class="stat-label">Pendente${pendentes!==1?'s':''} de cadastro</span>
      </div>
      <div class="suple-stat">
        <span class="stat-num" style="font-size:1rem">${dataStr ? formatData(dataStr) : '—'}</span>
        <span class="stat-label">Última atualização</span>
      </div>
    </div>`;

  grid.innerHTML = cards.map(c => renderCardSuple(c)).join('');

  // Painel GLP-1
  const pGlp1  = document.getElementById('suple-glp1-panel');
  const pLoc   = JSON.parse(localStorage.getItem('ns_perfil') || '{}');
  if (pLoc.glp1Ativo) {
    pGlp1.style.display = 'block';
    document.getElementById('suple-glp1-intro').innerHTML =
      `Paciente em uso de <strong>${esc(pLoc.glp1Tipo || 'análogo GLP-1')}</strong>` +
      (pLoc.glp1Dose ? ` — dose: <strong>${esc(pLoc.glp1Dose)}</strong>` : '') +
      `. Vitaminas e minerais com maior risco de deficiência neste perfil:`;
    document.getElementById('suple-glp1-lista').innerHTML = GLP1_VITAMINAS.map(v => {
      const eStatus = v.exame && mapaExames[v.exame]
        ? (parseFloat(mapaExames[v.exame].valor) < REFERENCIAS[v.exame].min ? 'baixo'
          : parseFloat(mapaExames[v.exame].valor) > REFERENCIAS[v.exame].max ? 'alto' : 'normal')
        : 'sem_exame';
      const badge = v.exame
        ? eStatus === 'normal' ? '<span class="badge-mini ok">✓ Exame normal</span>'
          : eStatus === 'sem_exame' ? '<span class="badge-mini pendente">⊘ Sem exame</span>'
          : '<span class="badge-mini alerta">⚠ Exame alterado</span>'
        : '<span class="badge-mini pendente">Exame não disponível</span>';
      const cor = v.prioridade==='alta'?'vit-alta':v.prioridade==='media'?'vit-media':'vit-baixa';
      return `
        <div class="suple-glp1-item ${cor}">
          <div class="suple-glp1-item-header">
            <strong>${esc(v.nome)}</strong>${badge}
          </div>
          <p class="suple-glp1-item-motivo">${esc(v.motivo)}</p>
          <div class="suple-glp1-item-dose">💊 ${esc(v.dose_sugerida)}</div>
        </div>`;
    }).join('');
  } else {
    pGlp1.style.display = 'none';
  }
}

function renderCardSuple(c) {
  if (c.status === 'sem-exame') {
    return `<div class="suple-card suple-sem-exame">
      <div class="suple-card-header">
        <span class="suple-icone">${c.analise.icone}</span>
        <div><div class="suple-card-titulo">${esc(c.analise.nome)}</div>
        <span class="badge-suple sem-exame">SEM EXAME</span></div>
      </div>
      <p class="suple-card-msg">Exame não cadastrado. Solicite ao médico para análise completa.</p>
      <button class="btn btn-sm btn-outline" onclick="irParaAba('exames')">Cadastrar Exame →</button>
    </div>`;
  }
  if (c.status === 'normal') {
    return `<div class="suple-card suple-normal">
      <div class="suple-card-header">
        <span class="suple-icone">${c.analise.icone}</span>
        <div><div class="suple-card-titulo">${esc(c.analise.nome)}</div>
        <span class="badge-suple normal">ADEQUADO</span></div>
        <div class="suple-valor-box normal">
          <span class="suple-valor-num">${c.valor}</span>
          <span class="suple-valor-un">${REFERENCIAS[c.chave].unidade}</span>
        </div>
      </div>
      <p class="suple-card-msg suple-ok-msg">✅ Dentro da faixa de referência (${esc(REFERENCIAS[c.chave].ref)}). Manter hábitos alimentares adequados.</p>
    </div>`;
  }
  const urgClasse = { critica:'suple-critica', alta:'suple-alta', atencao:'suple-atencao' };
  const urgLabel  = { critica:'DEFICIENTE', alta:'DEFICIENTE', atencao:'INSUFICIENTE' };
  const badgeCls  = { critica:'critico', alta:'critico', atencao:'baixo' };
  return `<div class="suple-card ${urgClasse[c.status]||'suple-atencao'}">
    <div class="suple-card-header">
      <span class="suple-icone">${c.analise.icone}</span>
      <div><div class="suple-card-titulo">${esc(c.analise.nome)}</div>
      <span class="badge-suple ${badgeCls[c.status]||'baixo'}">${urgLabel[c.status]||'ATENÇÃO'}</span></div>
      <div class="suple-valor-box ${c.abaixo?'baixo':'alto'}">
        <span class="suple-valor-num">${c.valor}</span>
        <span class="suple-valor-un">${REFERENCIAS[c.chave].unidade}</span>
        <span class="suple-valor-ref">ref: ${esc(REFERENCIAS[c.chave].ref)}</span>
      </div>
    </div>
    <div class="suple-card-body">
      <div class="suple-section">
        <div class="suple-section-titulo">💊 Recomendação de Suplementação</div>
        <p>${esc(c.recInfo.recomendacao)}</p>
      </div>
      <div class="suple-section">
        <div class="suple-section-titulo">🥗 Fontes Alimentares</div>
        <p>${esc(c.recInfo.alimentos)}</p>
      </div>
      ${c.recInfo.observacao ? `<div class="suple-section suple-obs">
        <div class="suple-section-titulo">⚕️ Observação Clínica</div>
        <p>${esc(c.recInfo.observacao)}</p>
      </div>` : ''}
    </div>
  </div>`;
}

/* ── INIT ───────────────────────────────────────── */
function init() {
  // Renderiza telas em branco enquanto auth.js carrega os dados do Supabase
  renderMedicamentos();
  renderExames();
  renderAlimentos();
  popularSelectAlimentos();
  calcularMetas();
  renderPlano();

  // Data padrão = hoje
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('med-inicio').value  = hoje;
  document.getElementById('exame-data').value  = hoje;
}

// init() é chamado automaticamente por carregarDados() (db.js) após autenticação.
// Chamamos aqui apenas para popular selects e datas sem depender de auth.
/* ══════════════════════════════════════════════════
   MODO DE VISUALIZAÇÃO — Resumido / Completo
══════════════════════════════════════════════════ */
let modoView = localStorage.getItem('ns_modo_view') || 'resumido';

function toggleModoView() {
  modoView = modoView === 'resumido' ? 'completo' : 'resumido';
  localStorage.setItem('ns_modo_view', modoView);
  aplicarModoView();
}

function aplicarModoView() {
  const btn = document.getElementById('btn-view-toggle');
  if (modoView === 'resumido') {
    document.body.classList.add('modo-resumido');
    document.body.classList.remove('modo-completo');
    if (btn) { btn.innerHTML = '📋 Ver tudo'; btn.classList.remove('ativo'); }
  } else {
    document.body.classList.remove('modo-resumido');
    document.body.classList.add('modo-completo');
    if (btn) { btn.innerHTML = '✂️ Resumido'; btn.classList.add('ativo'); }
  }
}

/* ══════════════════════════════════════════════════
   MÓDULO: CENTRAL DE DOWNLOADS
══════════════════════════════════════════════════ */

// Fotos bioimpedância — persistência local
let fotosBio = JSON.parse(localStorage.getItem('ns_fotos_bio') || '[]');

/* ── Info dos cards ──────────────────────────────── */
function atualizarInfoDownloads() {
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

  const qEx  = (exames        || []).length;
  const qMed = (medicamentos  || []).length;
  let   qPla = 0;
  [planoMedico, plano].forEach(p => {
    Object.values(p).forEach(dia => Object.values(dia).forEach(ref => { qPla += ref.length; }));
  });

  set('dl-exames-info', qEx  ? `${qEx} exame${qEx>1?'s':''} registrado${qEx>1?'s':''}`         : 'Nenhum exame registrado');
  set('dl-meds-info',   qMed ? `${qMed} medicamento${qMed>1?'s':''} registrado${qMed>1?'s':''}` : 'Nenhum medicamento registrado');
  set('dl-plano-info',  qPla ? `${qPla} item${qPla>1?'s':''} no plano`                          : 'Plano vazio');
  set('dl-fotos-info',  fotosBio.length ? `${fotosBio.length} foto${fotosBio.length>1?'s':''}` : 'Nenhuma foto adicionada');

  renderFotosBio();
  const bBtn = document.getElementById('dl-fotos-btns');
  if (bBtn) bBtn.style.display = fotosBio.length ? 'flex' : 'none';
}

/* ── Fotos Bioimpedância ─────────────────────────── */
function uploadFotosBio(files) {
  const promises = [...files].map(file => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve({ id: Date.now() + Math.random(), nome: file.name, data: new Date().toLocaleDateString('pt-BR'), dataUrl: e.target.result });
    reader.readAsDataURL(file);
  }));
  Promise.all(promises).then(novas => {
    fotosBio = [...fotosBio, ...novas];
    try { localStorage.setItem('ns_fotos_bio', JSON.stringify(fotosBio)); }
    catch { mostrarToast('Armazenamento cheio — fotos apenas nesta sessão', 'erro'); }
    atualizarInfoDownloads();
    document.getElementById('bio-foto-input').value = '';
    mostrarToast(`${novas.length} foto${novas.length>1?'s adicionadas':' adicionada'} ✅`);
  });
}

function removerFotoBio(id) {
  fotosBio = fotosBio.filter(f => String(f.id) !== String(id));
  localStorage.setItem('ns_fotos_bio', JSON.stringify(fotosBio));
  atualizarInfoDownloads();
}

function renderFotosBio() {
  const grid = document.getElementById('bio-fotos-grid');
  if (!grid) return;
  grid.innerHTML = fotosBio.map(f => `
    <div class="bio-foto-item">
      <img src="${f.dataUrl}" alt="${f.nome}" loading="lazy" />
      <div class="bio-foto-overlay">
        <button class="bio-foto-btn" onclick="_dlFotoBioById('${f.id}')">⬇ Baixar</button>
        <button class="bio-foto-btn bio-foto-del" onclick="removerFotoBio('${f.id}')">✕</button>
      </div>
      <div class="bio-foto-data">${f.data}</div>
    </div>
  `).join('');
}

function _dlFotoBioById(id) {
  const f = fotosBio.find(x => String(x.id) === String(id));
  if (!f) return;
  const a = document.createElement('a');
  a.href = f.dataUrl; a.download = f.nome || 'foto_bio.jpg'; a.click();
}

async function dlFotosBioZIP() {
  if (!fotosBio.length) { mostrarToast('Nenhuma foto para baixar', 'erro'); return; }
  if (!window.JSZip)   { mostrarToast('Biblioteca ZIP não carregada', 'erro'); return; }
  mostrarToast('Gerando ZIP...');
  const zip    = new JSZip();
  const folder = zip.folder('fotos_bioimpedancia');
  fotosBio.forEach((f, i) => {
    const ext  = (f.dataUrl.split(';')[0].split('/')[1] || 'jpg').replace('jpeg','jpg');
    folder.file(f.nome || `foto_${i+1}.${ext}`, f.dataUrl.split(',')[1], { base64: true });
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  _dlBlob(blob, `fotos_bio_${_dlHoje()}.zip`);
  mostrarToast('ZIP de fotos gerado ✅');
}

/* ── Utilitários ─────────────────────────────────── */
function _dlBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function _dlHoje()     { return new Date().toISOString().slice(0, 10); }
function _dlPaciente() { return (perfil.nome || 'paciente').replace(/\s+/g,'_').toLowerCase().replace(/[^a-z0-9_]/g,'') || 'paciente'; }
function _csvStr(rows) {
  return rows.map(r => r.map(c => {
    const s = String(c ?? '').replace(/"/g, '""');
    return /[;,\n"]/.test(s) ? `"${s}"` : s;
  }).join(';')).join('\n');
}
function _dlCSV(rows, filename) {
  _dlBlob(new Blob(['\uFEFF' + _csvStr(rows)], { type: 'text/csv;charset=utf-8' }), filename);
}
function _dlXLS(rows, sheetName, filename) {
  if (!window.XLSX) { mostrarToast('Biblioteca XLS não carregada', 'erro'); return; }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}
function _pdfHeader(doc, titulo) {
  const W = doc.internal.pageSize.width;
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, W, 16, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(11); doc.setFont(undefined, 'bold');
  doc.text('NutriSaúde — ' + titulo, 14, 11);
  doc.text(_dlHoje(), W - 14, 11, { align: 'right' });
  doc.setTextColor(30, 41, 59);
}
function _checkPDF() {
  if (!window.jspdf) { mostrarToast('Biblioteca PDF não carregada — recarregue a página', 'erro'); return false; }
  return true;
}

/* ── Exames ──────────────────────────────────────── */
function _examesRows() {
  return [
    ['Data', 'Exame', 'Resultado', 'Unidade', 'Referência', 'Status'],
    ...(exames || []).map(e => [e.data || '—', e.nome || e.tipo, e.resultado, e.unidade, e.referencia || '—', e.status])
  ];
}
function dlExamesCSV() {
  if (!exames.length) { mostrarToast('Nenhum exame registrado', 'erro'); return; }
  _dlCSV(_examesRows(), `exames_${_dlPaciente()}_${_dlHoje()}.csv`);
}
function dlExamesXLS() {
  if (!exames.length) { mostrarToast('Nenhum exame registrado', 'erro'); return; }
  _dlXLS(_examesRows(), 'Exames', `exames_${_dlPaciente()}_${_dlHoje()}.xlsx`);
}
function dlExamesPDF() {
  if (!exames.length) { mostrarToast('Nenhum exame registrado', 'erro'); return; }
  if (!_checkPDF()) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape' });
  _pdfHeader(doc, 'Exames Laboratoriais');
  doc.autoTable({
    startY: 22,
    head: [['Data', 'Exame', 'Resultado', 'Unidade', 'Referência', 'Status']],
    body: (exames || []).map(e => [e.data || '—', e.nome || e.tipo, e.resultado, e.unidade, e.referencia || '—', e.status]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 1: { cellWidth: 55 }, 4: { cellWidth: 50 } }
  });
  doc.save(`exames_${_dlPaciente()}_${_dlHoje()}.pdf`);
}

/* ── Medicamentos ────────────────────────────────── */
function _medsRows() {
  return [
    ['Nome', 'Dosagem', 'Frequência', 'Início', 'Observações', 'Registrado por'],
    ...(medicamentos || []).map(m => [m.nome, m.dosagem || '—', m.freq || '—', m.inicio || '—', m.obs || '—', m.regPor || '—'])
  ];
}
function dlMedsCSV() {
  if (!medicamentos.length) { mostrarToast('Nenhum medicamento registrado', 'erro'); return; }
  _dlCSV(_medsRows(), `medicamentos_${_dlPaciente()}_${_dlHoje()}.csv`);
}
function dlMedsXLS() {
  if (!medicamentos.length) { mostrarToast('Nenhum medicamento registrado', 'erro'); return; }
  _dlXLS(_medsRows(), 'Medicamentos', `medicamentos_${_dlPaciente()}_${_dlHoje()}.xlsx`);
}
function dlMedsPDF() {
  if (!medicamentos.length) { mostrarToast('Nenhum medicamento registrado', 'erro'); return; }
  if (!_checkPDF()) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  _pdfHeader(doc, 'Medicamentos');
  doc.autoTable({
    startY: 22,
    head: [['Nome', 'Dosagem', 'Frequência', 'Início', 'Observações']],
    body: (medicamentos || []).map(m => [m.nome, m.dosagem || '—', m.freq || '—', m.inicio || '—', m.obs || '—']),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });
  doc.save(`medicamentos_${_dlPaciente()}_${_dlHoje()}.pdf`);
}

/* ── Plano Alimentar ─────────────────────────────── */
function _planoRows() {
  const header = ['Tipo', 'Dia', 'Refeição', 'Alimento', 'Qtd', 'Unid.', 'Kcal', 'Carb (g)', 'Prot (g)', 'Gord (g)'];
  const rows = [];
  [['Prescrito', planoMedico], ['Pessoal', plano]].forEach(([tipo, p]) => {
    DIAS_ORDEM.forEach(dia => {
      if (!p[dia]) return;
      Object.entries(p[dia]).forEach(([ref, itens]) => {
        itens.forEach(item => {
          rows.push([tipo, dia, ref, item.nome,
            item.qtdReal ?? item.qtd, item.unit || 'g',
            +(item.kcal || 0).toFixed(1), +(item.carb || 0).toFixed(1),
            +(item.prot || 0).toFixed(1), +(item.gord || 0).toFixed(1)]);
        });
      });
    });
  });
  return [header, ...rows];
}
function dlPlanoCSV() {
  const rows = _planoRows();
  if (rows.length <= 1) { mostrarToast('Plano alimentar vazio', 'erro'); return; }
  _dlCSV(rows, `plano_alimentar_${_dlPaciente()}_${_dlHoje()}.csv`);
}
function dlPlanoXLS() {
  const rows = _planoRows();
  if (rows.length <= 1) { mostrarToast('Plano alimentar vazio', 'erro'); return; }
  _dlXLS(rows, 'Plano Alimentar', `plano_alimentar_${_dlPaciente()}_${_dlHoje()}.xlsx`);
}
function dlPlanoPDF() {
  const rows = _planoRows();
  if (rows.length <= 1) { mostrarToast('Plano alimentar vazio', 'erro'); return; }
  if (!_checkPDF()) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape' });
  _pdfHeader(doc, 'Plano Alimentar');
  doc.autoTable({
    startY: 22,
    head: [rows[0]],
    body: rows.slice(1),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 253, 250] }
  });
  doc.save(`plano_alimentar_${_dlPaciente()}_${_dlHoje()}.pdf`);
}

/* ── Relatório Completo ──────────────────────────── */
function _criarRelatorioPDF() {
  if (!window.jspdf) return null;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 22;

  _pdfHeader(doc, 'Relatório do Paciente');

  // Dados pessoais
  doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.text('Dados do Paciente', 14, y); y += 6;
  doc.setFontSize(9); doc.setFont(undefined, 'normal');
  const linhas = [
    `Nome: ${perfil.nome || '—'}    Sexo: ${perfil.sexo || '—'}`,
    `Peso: ${perfil.peso ? perfil.peso + ' kg' : '—'}    Altura: ${perfil.altura ? perfil.altura + ' m' : '—'}    IMC: ${perfil.imc || '—'}`,
    `Cintura: ${perfil.cintura ? perfil.cintura + ' cm' : '—'}    Atividade: ${perfil.atividade || '—'}    Objetivo: ${perfil.objetivo || '—'}`
  ];
  linhas.forEach(l => { doc.text(l, 14, y); y += 5.5; });
  y += 3;

  // Medicamentos
  if ((medicamentos || []).length) {
    doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.text('Medicamentos', 14, y); y += 1;
    doc.autoTable({
      startY: y, margin: { left: 14, right: 14 },
      head: [['Nome', 'Dosagem', 'Frequência', 'Início']],
      body: medicamentos.map(m => [m.nome, m.dosagem || '—', m.freq || '—', m.inicio || '—']),
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [99, 102, 241], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  // Exames
  if ((exames || []).length) {
    if (y > 235) { doc.addPage(); y = 20; }
    doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.text('Exames Laboratoriais', 14, y); y += 1;
    doc.autoTable({
      startY: y, margin: { left: 14, right: 14 },
      head: [['Data', 'Exame', 'Resultado', 'Unidade', 'Status']],
      body: exames.map(e => [e.data || '—', e.nome || e.tipo, e.resultado, e.unidade, e.status]),
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [16, 185, 129], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 253, 250] }
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  // Plano Alimentar
  const planoR = _planoRows();
  if (planoR.length > 1) {
    if (y > 220) { doc.addPage(); y = 20; }
    doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.text('Plano Alimentar', 14, y); y += 1;
    doc.autoTable({
      startY: y, margin: { left: 14, right: 14 },
      head: [['Dia', 'Refeição', 'Alimento', 'Qtd', 'Kcal']],
      body: planoR.slice(1).map(r => [r[1], r[2], r[3], r[4] + ' ' + (r[5] || 'g'), r[6]]),
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [245, 158, 11], textColor: 255 },
      alternateRowStyles: { fillColor: [255, 251, 235] }
    });
  }

  // Rodapé
  const totalPags = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPags; i++) {
    doc.setPage(i);
    doc.setFontSize(7); doc.setTextColor(148, 163, 184);
    doc.text(`NutriSaúde — ${_dlHoje()} — Página ${i}/${totalPags}`, 14, doc.internal.pageSize.height - 8);
  }

  return doc;
}

function dlRelatorioPDF() {
  if (!_checkPDF()) return;
  const doc = _criarRelatorioPDF();
  if (!doc) return;
  doc.save(`relatorio_${_dlPaciente()}_${_dlHoje()}.pdf`);
}

/* ── ZIP Geral ───────────────────────────────────── */
async function dlTudoZIP() {
  if (!window.JSZip) { mostrarToast('Biblioteca ZIP não carregada', 'erro'); return; }
  mostrarToast('Gerando ZIP...');
  const zip  = new JSZip();
  const nome = _dlPaciente();
  const hoje = _dlHoje();

  // CSVs
  if ((exames        || []).length) zip.file(`exames_${nome}_${hoje}.csv`,          '\uFEFF' + _csvStr(_examesRows()));
  if ((medicamentos  || []).length) zip.file(`medicamentos_${nome}_${hoje}.csv`,     '\uFEFF' + _csvStr(_medsRows()));
  const planoR = _planoRows();
  if (planoR.length > 1)            zip.file(`plano_alimentar_${nome}_${hoje}.csv`, '\uFEFF' + _csvStr(planoR));

  // XLS (plano)
  if (window.XLSX && planoR.length > 1) {
    const wb = XLSX.utils.book_new();
    ['Exames','Medicamentos','Plano'].forEach((s, i) => {
      const data = [_examesRows(), _medsRows(), planoR][i];
      if (data.length > 1) XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data), s);
    });
    const xlsBytes = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    zip.file(`dados_${nome}_${hoje}.xlsx`, xlsBytes);
  }

  // PDF relatório
  if (window.jspdf) {
    const doc = _criarRelatorioPDF();
    if (doc) zip.file(`relatorio_${nome}_${hoje}.pdf`, doc.output('arraybuffer'));
  }

  // Fotos bioimpedância
  if (fotosBio.length) {
    const pasta = zip.folder('fotos_bioimpedancia');
    fotosBio.forEach((f, i) => {
      const ext = (f.dataUrl.split(';')[0].split('/')[1] || 'jpg').replace('jpeg', 'jpg');
      pasta.file(f.nome || `foto_${i + 1}.${ext}`, f.dataUrl.split(',')[1], { base64: true });
    });
  }

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  _dlBlob(blob, `nutrisaude_${nome}_${hoje}.zip`);
  mostrarToast('ZIP gerado ✅');
}

/* ══════════════════════════════════════════════════
   MÓDULO: ANÁLISE DE REFEIÇÃO POR FOTO (IA)
══════════════════════════════════════════════════ */
let _fotoBase64  = null;
let _fotoMime    = null;
let _fotoItensIA = [];   // alimentos retornados pela IA
// Chave Gemini gerenciada via Supabase Edge Function (secret server-side)

function abrirModalFoto() {
  document.getElementById('modal-foto').style.display = 'flex';
  const temChave = true; // chave gerenciada server-side
  mostrarFotoStep(temChave ? 'upload' : 'key');
  // Pré-seleciona dia de hoje
  const DIAS_PT = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  const hoje    = DIAS_PT[new Date().getDay()];
  const selDia  = document.getElementById('foto-sel-dia');
  if (selDia) selDia.value = hoje;
}

function fecharModalFoto() {
  document.getElementById('modal-foto').style.display = 'none';
  _fotoBase64 = null; _fotoMime = null; _fotoItensIA = [];
  const fi = document.getElementById('foto-file-input');
  if (fi) fi.value = '';
  const prev = document.getElementById('foto-preview');
  if (prev) { prev.style.display = 'none'; prev.src = ''; }
  const btn = document.getElementById('btn-analisar-foto');
  if (btn) btn.style.display = 'none';
  const dz = document.getElementById('foto-dropzone');
  if (dz) dz.style.display = 'block';
  mostrarFotoStep('upload');
}

function mostrarFotoStep(step) {
  ['key', 'upload', 'loading', 'resultado'].forEach(s => {
    const el = document.getElementById('foto-step-' + s);
    if (el) el.style.display = (s === step ? 'block' : 'none');
  });
}

function salvarChaveAPI() {
  const key = document.getElementById('foto-api-key-input').value.trim();
  if (!key) { mostrarToast('Insira a chave da API', 'erro'); return; }
  localStorage.setItem('ns_gemini_key', key);
  document.getElementById('foto-api-key-input').value = '';
  mostrarFotoStep('upload');
  mostrarToast('Chave salva ✅');
}

function handleFotoUpload(file) {
  if (!file) return;
  _fotoMime = file.type || 'image/jpeg';
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    _fotoBase64   = dataUrl.split(',')[1];
    const prev = document.getElementById('foto-preview');
    if (prev) { prev.src = dataUrl; prev.style.display = 'block'; }
    const dz = document.getElementById('foto-dropzone');
    if (dz) dz.style.display = 'none';
    const btn = document.getElementById('btn-analisar-foto');
    if (btn) btn.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

async function analisarFotoComIA() {
  if (!_fotoBase64) { mostrarToast('Selecione uma foto primeiro', 'erro'); return; }

  mostrarFotoStep('loading');

  try {
    // Obter JWT do usuário logado para autenticar na Edge Function
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Sessão expirada — faça login novamente');
    }

    const resp = await fetch(
      'https://thsaxtvyubebtsgnntns.supabase.co/functions/v1/analisar-foto',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ mimeType: _fotoMime, imageBase64: _fotoBase64 })
      }
    );

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ' + resp.status);
    }

    const data    = await resp.json();
    let   jsonStr = (data.text || '').trim();
    // Remove markdown code fences if present
    jsonStr = jsonStr.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');

    const resultado    = JSON.parse(jsonStr);
    _fotoItensIA = resultado.alimentos || [];

    // Normaliza valores por 100g para reajuste de quantidade
    _fotoItensIA.forEach(al => {
      const base = al.qtd_g > 0 ? (100 / al.qtd_g) : 1;
      al._kcal100 = +(al.kcal   * base).toFixed(2);
      al._carb100 = +(al.carb_g * base).toFixed(2);
      al._prot100 = +(al.prot_g * base).toFixed(2);
      al._gord100 = +(al.gord_g * base).toFixed(2);
      al._removido = false;
    });

    _renderResultadoFoto(resultado.descricao, _fotoItensIA);
    mostrarFotoStep('resultado');

  } catch (err) {
    voltarFotoUpload();
    mostrarToast('Erro: ' + err.message, 'erro');
  }
}

function _calcTotalFoto() {
  return _fotoItensIA.filter(a => !a._removido).reduce((s, a) => s + (a.kcal || 0), 0);
}

function _atualizarTotalFoto() {
  const el = document.getElementById('foto-total-kcal');
  if (el) el.textContent = _calcTotalFoto().toFixed(0) + ' kcal';
}

function _renderResultadoFoto(descricao, alimentos) {
  const descEl = document.getElementById('foto-descricao');
  if (descEl) descEl.textContent = descricao || '';

  const total = alimentos.reduce((s, a) => s + (a.kcal || 0), 0);

  const lista = document.getElementById('foto-alimentos-lista');
  lista.innerHTML = alimentos.map((al, i) => `
    <div class="foto-alimento-item" id="foto-al-${i}">
      <div class="foto-alimento-info">
        <div class="foto-alimento-nome">${al.nome}${al.porcao ? `<span class="foto-porcao-badge">${al.porcao}</span>` : ''}</div>
        <div class="foto-alimento-macros" id="foto-macros-${i}">
          ~<span id="foto-qtd-txt-${i}">${(al.qtd_g||0).toFixed(0)}</span>g &nbsp;·&nbsp;
          C: ${(al.carb_g||0).toFixed(1)}g &nbsp;·&nbsp;
          P: ${(al.prot_g||0).toFixed(1)}g &nbsp;·&nbsp;
          G: ${(al.gord_g||0).toFixed(1)}g
        </div>
      </div>
      <div class="foto-alimento-qtd-wrap">
        <input class="foto-alimento-qtd" type="number" min="1" step="5" value="${al.qtd_g||100}"
          onchange="recalcFotoItem(${i}, this.value)" title="Quantidade em gramas" />
        <span class="foto-alimento-unit">g</span>
      </div>
      <span class="foto-alimento-kcal" id="foto-kcal-${i}">${(al.kcal||0).toFixed(0)} kcal</span>
      <button class="foto-alimento-remove" onclick="removerFotoItem(${i})" title="Remover">✕</button>
    </div>
  `).join('') + `
    <div class="foto-total-row">
      <span>Total estimado da refeição</span>
      <span id="foto-total-kcal">${total.toFixed(0)} kcal</span>
    </div>`;
}

function recalcFotoItem(i, novaQtdStr) {
  const novaQtd = parseFloat(novaQtdStr) || 0;
  const al = _fotoItensIA[i];
  if (!al) return;
  const f     = novaQtd / 100;
  al.qtd_g    = novaQtd;
  al.kcal     = +((al._kcal100 || 0) * f).toFixed(1);
  al.carb_g   = +((al._carb100 || 0) * f).toFixed(1);
  al.prot_g   = +((al._prot100 || 0) * f).toFixed(1);
  al.gord_g   = +((al._gord100 || 0) * f).toFixed(1);
  const kcalEl  = document.getElementById('foto-kcal-'  + i);
  const macroEl = document.getElementById('foto-macros-' + i);
  const qtdEl   = document.getElementById('foto-qtd-txt-' + i);
  if (kcalEl)  kcalEl.textContent = al.kcal.toFixed(0) + ' kcal';
  if (qtdEl)   qtdEl.textContent  = novaQtd.toFixed(0);
  if (macroEl) macroEl.innerHTML  =
    `~<span id="foto-qtd-txt-${i}">${novaQtd.toFixed(0)}</span>g &nbsp;·&nbsp; C: ${al.carb_g.toFixed(1)}g &nbsp;·&nbsp; P: ${al.prot_g.toFixed(1)}g &nbsp;·&nbsp; G: ${al.gord_g.toFixed(1)}g`;
  _atualizarTotalFoto();
}

function removerFotoItem(i) {
  const al = _fotoItensIA[i];
  if (al) al._removido = true;
  const el = document.getElementById('foto-al-' + i);
  if (el) el.style.display = 'none';
  _atualizarTotalFoto();
}

function voltarFotoUpload() {
  _fotoBase64 = null; _fotoMime = null;
  const fi = document.getElementById('foto-file-input');
  if (fi) fi.value = '';
  const prev = document.getElementById('foto-preview');
  if (prev) { prev.style.display = 'none'; prev.src = ''; }
  const btn = document.getElementById('btn-analisar-foto');
  if (btn) btn.style.display = 'none';
  const dz = document.getElementById('foto-dropzone');
  if (dz) dz.style.display = 'block';
  mostrarFotoStep('upload');
}

function confirmarAlimentosFoto() {
  const dia   = document.getElementById('foto-sel-dia').value;
  const ref   = document.getElementById('foto-sel-refeicao').value;
  const tipo  = modoPlano;
  const ativos = _fotoItensIA.filter(al => al && !al._removido);
  if (!ativos.length) { mostrarToast('Nenhum alimento selecionado', 'erro'); return; }

  const alvo = tipo === 'medico' ? planoMedico : plano;
  if (!alvo[dia])      alvo[dia]      = {};
  if (!alvo[dia][ref]) alvo[dia][ref] = [];

  ativos.forEach(al => {
    alvo[dia][ref].push({
      id:      Date.now() + Math.random(),
      nome:    al.nome,
      emoji:   '📸',
      qtd:     al.qtd_g,
      qtdReal: al.qtd_g,
      unit:    'g',
      kcal:    al.kcal,
      carb:    al.carb_g,
      prot:    al.prot_g,
      gord:    al.gord_g
    });
  });

  if (tipo === 'medico') localStorage.setItem('ns_plano_medico', JSON.stringify(planoMedico));
  else dbSalvarPlano(plano);

  renderPlano();
  fecharModalFoto();
  mostrarToast(`${ativos.length} alimento${ativos.length > 1 ? 's adicionados' : ' adicionado'} ao plano ✅`);
}

document.addEventListener('DOMContentLoaded', () => {
  aplicarModoView(); // aplica o modo salvo antes de qualquer render
  renderAlimentos();
  popularSelectAlimentos();
  calcularMetas();
  const hoje = new Date().toISOString().split('T')[0];
  const medInicio = document.getElementById('med-inicio');
  const exData    = document.getElementById('exame-data');
  if (medInicio) medInicio.value = hoje;
  if (exData)    exData.value    = hoje;

  // IMC: recalcula em tempo real ao digitar; salva ao sair do campo
  ['paciente-peso', 'paciente-altura'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input',  calcularIMC);  // atualiza tela em tempo real
      el.addEventListener('change', autoSalvarBio); // salva no banco ao perder foco
    }
  });

  // Pré-seleciona o dia de hoje no resumo calórico
  const DIAS_PT = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  const diaHoje = DIAS_PT[new Date().getDay()];
  const selDia  = document.getElementById('resumo-dia-sel');
  if (selDia && diaHoje !== 'Domingo') selDia.value = diaHoje;
  atualizarResumoDiario();
});

/* ══════════════════════════════════════════════════
   MÓDULO: IMPORTAÇÃO DE ARQUIVOS (CSV / XLSX / PDF)
══════════════════════════════════════════════════ */

// Configurar worker do PDF.js (CDN)
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

/* ── Mapeamento de nomes de exames em português ──── */
// Chave: variações de nome em minúsculas → valor: chave de REFERENCIAS
const NOME_MAP = {
  // Glicemia
  'glicose': 'glicemia_jejum',
  'glicemia': 'glicemia_jejum',
  'glicemia em jejum': 'glicemia_jejum',
  'glicemia de jejum': 'glicemia_jejum',
  'glicemia jejum': 'glicemia_jejum',
  'glucose': 'glicemia_jejum',
  'glicemia capilar': 'glicemia_jejum',
  // HbA1c
  'hemoglobina glicada': 'hba1c',
  'hba1c': 'hba1c',
  'hba 1c': 'hba1c',
  'a1c': 'hba1c',
  'glicohemoglobina': 'hba1c',
  'hemoglobina a1c': 'hba1c',
  // Colesterol
  'colesterol total': 'colesterol_total',
  'colesterol': 'colesterol_total',
  'cholesterol total': 'colesterol_total',
  // HDL
  'hdl': 'hdl',
  'hdl colesterol': 'hdl',
  'hdl-colesterol': 'hdl',
  'colesterol hdl': 'hdl',
  'hdl-c': 'hdl',
  // LDL
  'ldl': 'ldl',
  'ldl colesterol': 'ldl',
  'ldl-colesterol': 'ldl',
  'colesterol ldl': 'ldl',
  'ldl-c': 'ldl',
  'ldl calculado': 'ldl',
  'ldl direto': 'ldl',
  // Triglicerídeos
  'triglicerideos': 'triglicerideos',
  'triglicerídeos': 'triglicerideos',
  'triglicerides': 'triglicerideos',
  'triglicérides': 'triglicerideos',
  'triglicérideos': 'triglicerideos',
  'triglycerides': 'triglicerideos',
  'tg': 'triglicerideos',
  // Creatinina
  'creatinina': 'creatinina',
  'creatinine': 'creatinina',
  'creat': 'creatinina',
  // Ureia
  'ureia': 'ureia',
  'uréia': 'ureia',
  'urea': 'ureia',
  'nitrogenio ureico': 'ureia',
  'bun': 'ureia',
  // Ácido Úrico
  'acido urico': 'acido_urico',
  'ácido úrico': 'acido_urico',
  'uric acid': 'acido_urico',
  'au': 'acido_urico',
  // TGO/AST
  'tgo': 'tgo',
  'ast': 'tgo',
  'tgo ast': 'tgo',
  'aspartato aminotransferase': 'tgo',
  'aspartato': 'tgo',
  // TGP/ALT
  'tgp': 'tgp',
  'alt': 'tgp',
  'tgp alt': 'tgp',
  'alanina aminotransferase': 'tgp',
  'alanina': 'tgp',
  // GGT
  'ggt': 'ggt',
  'gama gt': 'ggt',
  'gama-gt': 'ggt',
  'gamaglutamiltransferase': 'ggt',
  'gamaglutamil transferase': 'ggt',
  'gamma gt': 'ggt',
  // Hemoglobina
  'hemoglobina': 'hemoglobina',
  'hb': 'hemoglobina',
  'hgb': 'hemoglobina',
  // Hematócrito
  'hematocrito': 'hematocrito',
  'hematócrito': 'hematocrito',
  'ht': 'hematocrito',
  'htc': 'hematocrito',
  // Leucócitos
  'leucocitos': 'leucocitos',
  'leucócitos': 'leucocitos',
  'globulos brancos': 'leucocitos',
  'glóbulos brancos': 'leucocitos',
  'wbc': 'leucocitos',
  'leucometria': 'leucocitos',
  // Plaquetas
  'plaquetas': 'plaquetas',
  'plaquetometria': 'plaquetas',
  'plt': 'plaquetas',
  // TSH
  'tsh': 'tsh',
  'tirotropina': 'tsh',
  'hormonio tireoestimulante': 'tsh',
  'hormônio tireoestimulante': 'tsh',
  // T4 Livre
  't4 livre': 't4l',
  't4l': 't4l',
  't4 free': 't4l',
  'tiroxina livre': 't4l',
  'free t4': 't4l',
  // Vitamina D
  'vitamina d': 'vitamina_d',
  'vitamina d3': 'vitamina_d',
  'vitamina d 25': 'vitamina_d',
  '25-oh vitamina d': 'vitamina_d',
  '25 oh vitamina d': 'vitamina_d',
  '25(oh)d': 'vitamina_d',
  '25-hidroxivitamina d': 'vitamina_d',
  '25 hidroxivitamina d': 'vitamina_d',
  // Vitamina B12
  'vitamina b12': 'vitamina_b12',
  'cobalamina': 'vitamina_b12',
  'b12': 'vitamina_b12',
  'cianocobalamina': 'vitamina_b12',
  // Ferro
  'ferro': 'ferro',
  'ferro serico': 'ferro',
  'ferro sérico': 'ferro',
  'iron': 'ferro',
  // Ferritina
  'ferritina': 'ferritina',
  'ferritin': 'ferritina',
  // Pressão
  'pressao sistolica': 'pressao_sistolica',
  'pressão sistólica': 'pressao_sistolica',
  'sistolica': 'pressao_sistolica',
  'sistólica': 'pressao_sistolica',
  'pas': 'pressao_sistolica',
  'pressao diastolica': 'pressao_diastolica',
  'pressão diastólica': 'pressao_diastolica',
  'diastolica': 'pressao_diastolica',
  'diastólica': 'pressao_diastolica',
  'pad': 'pressao_diastolica',
  // Insulina
  'insulina': 'insulina',
  'insulina basal': 'insulina',
  'insulina jejum': 'insulina',
  'insulin': 'insulina',
  // PCR
  'proteina c reativa': 'pcr',
  'proteína c reativa': 'pcr',
  'pcr': 'pcr',
  'crp': 'pcr',
  'proteina c-reativa': 'pcr',
  'proteína c-reativa': 'pcr',
  // Amilase
  'amilase': 'amilase',
  'amylase': 'amilase',
  // Lipase
  'lipase': 'lipase',
  // Fosfatase Alcalina
  'fosfatase alcalina': 'fosfatase_alcalina',
  'fosfatase': 'fosfatase_alcalina',
  'alkaline phosphatase': 'fosfatase_alcalina',
  'alp': 'fosfatase_alcalina',
  // Bilirrubinas
  'bilirrubina total': 'bilirrubina_total',
  'bilirrubina total e fracoes': 'bilirrubina_total',
  'bilirrubina total e frações': 'bilirrubina_total',
  'bilirrubina direta': 'bilirrubina_direta',
  'bilirrubina indireta': 'bilirrubina_total',
  // VLDL
  'colesterol vldl': 'vldl',
  'vldl': 'vldl',
  'vldl colesterol': 'vldl',
  // Apolipoproteínas
  'apolipoproteina a1': 'apolipo_a1',
  'apolipoproteína a1': 'apolipo_a1',
  'apoa1': 'apolipo_a1',
  'apo a1': 'apolipo_a1',
  'apolipoproteina b': 'apolipo_b',
  'apolipoproteína b': 'apolipo_b',
  'apob': 'apolipo_b',
  'apo b': 'apolipo_b',
  // Homocisteína
  'homocisteina': 'homocisteina',
  'homocisteína': 'homocisteina',
  'homocysteine': 'homocisteina',
  'hcy': 'homocisteina',
  // Magnésio
  'magnesio': 'magnesio',
  'magnésio': 'magnesio',
  'magnesium': 'magnesio',
  'mg': 'magnesio',
  // Zinco
  'zinco': 'zinco',
  'zinco serico': 'zinco',
  'zinco sérico': 'zinco',
  'zinco serico colorimetria': 'zinco',
  'zinc': 'zinco',
  'zn': 'zinco',
  // Vitamina C
  'vitamina c': 'vitamina_c',
  'acido ascorbico': 'vitamina_c',
  'ácido ascórbico': 'vitamina_c',
  'ascorbic acid': 'vitamina_c',
  // Selênio
  'selenio': 'selenio',
  'selênio': 'selenio',
  'selenio serico': 'selenio',
  'selênio sérico': 'selenio',
  'selenium': 'selenio',
  'se': 'selenio',
  // T3
  't3 livre': 't3l',
  't3l': 't3l',
  'triiodotironina livre': 't3l',
  'free t3': 't3l',
  't3 free': 't3l',
  't3 reverso': 't3r',
  't3r': 't3r',
  'triiodotironina reverso': 't3r',
  'reverse t3': 't3r',
  'rt3': 't3r',
  // Testosterona
  'testosterona total': 'testosterona_total',
  'testosterona': 'testosterona_total',
  'testosterone total': 'testosterona_total',
  'testosterona livre': 'testosterona_livre',
  'testosterone livre': 'testosterona_livre',
  'free testosterone': 'testosterona_livre',
  // Estradiol
  'estradiol': 'estradiol',
  'e2': 'estradiol',
  'estrogen': 'estradiol',
  // SHBG
  'shbg': 'shbg',
  'globulina ligadora de hormonios sexuais': 'shbg',
  'globulina ligadora de hormônios sexuais': 'shbg',
  'sex hormone binding globulin': 'shbg',
  // Prolactina
  'prolactina': 'prolactina',
  'prolactin': 'prolactina',
  'prl': 'prolactina',

  // ── Aliases específicos Unimed Campo Grande ──────────
  // TGP — aparece como "ALANINA AMINO TRANSFERASE - TGP"
  'alanina amino transferase':         'tgp',
  'alanina amino transferase tgp':     'tgp',
  'alanina aminotransferase tgp':      'tgp',
  'alt tgp':                           'tgp',
  // TGO — aparece como "ASPARTATO AMINO TRANSFERASE - TGO"
  'aspartato amino transferase':       'tgo',
  'aspartato amino transferase tgo':   'tgo',
  'aspartato aminotransferase tgo':    'tgo',
  'ast tgo':                           'tgo',
  // GGT — variação Unimed
  'gama glutamiltransferase':          'ggt',
  'gama glutamil transferase':         'ggt',
  'glutamiltransferase':               'ggt',
  'gamma glutamil transferase':        'ggt',
  // Ácido Úrico — Unimed usa "ACIDO URICO" sem acento
  'acido urico':                       'acido_urico',
  // Bilirrubinas — seção genérica
  'bilirrubinas':                      'bilirrubina_total',
  'bilirrubina':                       'bilirrubina_total',
  // Vitamina D — variações de nome completo
  '25 oh vitamina d3':                 'vitamina_d',
  '25 hidroxivitamina d3':             'vitamina_d',
  'calcifediol':                       'vitamina_d',
  'colecalciferol':                    'vitamina_d',
  // Vitamina B12 — Unimed pode abreviar
  'vitamina b 12':                     'vitamina_b12',
  'cobalamin':                         'vitamina_b12',
  // Hemograma — sub-itens inline
  'eritrocitos':                       'hemoglobina',   // usado apenas para linha inline; valor ignorado
  'hemoglobina':                       'hemoglobina',
  'hematocrito':                       'hematocrito',
  'leucocitos':                        'leucocitos',
  'plaquetas':                         'plaquetas',
  // Lipídios — "LIPIDOGRAMA" é seção, sub-itens inline
  'colesterol total':                  'colesterol_total',
  'hdl colesterol':                    'hdl',
  'ldl colesterol':                    'ldl',
  'ldl calculado':                     'ldl',
  'vldl colesterol':                   'vldl',
  'triglicerideos':                    'triglicerideos',
  // Tireoide — Unimed usa nomes por extenso
  'tirotropina tsh':                   'tsh',
  'tiroxina livre t4l':                't4l',
  'triiodotironina livre t3l':         't3l',
  't3 livre tri iodotironina livre':   't3l',
  // PCR — variações
  'proteina c reativa ultrassensivel': 'pcr',
  'pcr ultrassensivel':                'pcr',
  'pcr alta sensibilidade':            'pcr',
  'proteina c reativa hs':             'pcr',

  // ── Hemograma — parâmetros do eritrograma (Unimed) ────────────────────
  'eritrocitos':                       'eritrocitos',
  'eritrocitos hemacias':              'eritrocitos',
  'hemacias':                          'eritrocitos',
  'rbc':                               'eritrocitos',
  'vcm':                               'vcm',
  'v c m':                             'vcm',
  'volume corpuscular medio':          'vcm',
  'volume corpuscular médio':          'vcm',
  'mcv':                               'vcm',
  'hcm':                               'hcm',
  'h c m':                             'hcm',
  'hemoglobina corpuscular media':     'hcm',
  'hemoglobina corpuscular média':     'hcm',
  'mch':                               'hcm',
  'chcm':                              'chcm',
  'c h c m':                           'chcm',
  'concentracao de hemoglobina corpuscular media': 'chcm',
  'mchc':                              'chcm',
  // ── Eletrólitos (comuns em laudos) ────────────────────────────────────
  'sodio':                             'sodio',
  'sódio':                             'sodio',
  'sodium':                            'sodio',
  'na':                                'sodio',
  'potassio':                          'potassio',
  'potássio':                          'potassio',
  'potassium':                         'potassio',
  'k serico':                          'potassio',
  'calcio total':                      'calcio',
  'cálcio total':                      'calcio',
  'calcio':                            'calcio',
  'calcium':                           'calcio',
  'fosforo':                           'fosforo',
  'fósforo':                           'fosforo',
  'fosforo serico':                    'fosforo',
  'phosphorus':                        'fosforo',
  // ── Aliases OCR — variações de grafia que o Tesseract pode gerar ──────
  // (caracteres próximos, acentos perdidos, espaços extras)
  'hemogloblna':                       'hemoglobina',  // OCR confunde i/l
  'hematocnto':                        'hematocrito',
  'leucocitos':                        'leucocitos',
  'plaquetas':                         'plaquetas',
  'glicose em jejum':                  'glicemia_jejum',
  'glicemia em jeium':                 'glicemia_jejum',
  'colesterol hdl':                    'hdl',
  'colesterol ldl':                    'ldl',
  'ldl colest':                        'ldl',
  'triglicerideos':                    'triglicerideos',
  'triglicerfdeos':                    'triglicerideos',  // OCR í→f
  'alanina amino transferase tgp':     'tgp',
  'alanina aminotransferase':          'tgp',
  'aspartato amino transferase tgo':   'tgo',
  'aspartato aminotransferase':        'tgo',
  'gama gt':                           'ggt',
  'gama glutamil transferase':         'ggt',
  'proteina c reativa':                'pcr',
  'vitamina d 25 oh':                  'vitamina_d',
  '25 oh vitamina d total':            'vitamina_d',
  'ureia sanguinea':                   'ureia',
  'creatinina serica':                 'creatinina',
  'acido urico serico':                'acido_urico',
  'ferritina serica':                  'ferritina',
  'hormonio estimulante da tireoide':  'tsh',
  'tsh ultrassensivel':                'tsh',
};

/** Normaliza string para matching (minúsculas, sem acentos, sem pontuação extra) */
function normalizar(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // remove acentos
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tenta encontrar a chave de REFERENCIAS para um nome de exame */
function resolverNome(nome) {
  const n = normalizar(nome);
  // 1. Tentativa exata
  if (NOME_MAP[n]) return NOME_MAP[n];
  // 2. Partial match: chaves mais longas primeiro para evitar que
  //    'hemoglobina' (curta) sobrescreva 'hcm hemoglobina corp media' (longa)
  const chavesPorTamanho = Object.keys(NOME_MAP).sort((a, b) => b.length - a.length);
  for (const k of chavesPorTamanho) {
    if (k.length >= 4 && (n.includes(k) || k.includes(n))) return NOME_MAP[k];
  }
  return null;
}

/* ── Drag & Drop ──────────────────────────────────── */
(function configurarDragDrop() {
  const area = document.getElementById('upload-area');
  if (!area) return;
  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag-over'); });
  area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) processarArquivo(file);
  });
  area.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') document.getElementById('file-input').click();
  });
})();

/* ── Dispatcher principal ─────────────────────────── */
function processarArquivo(file) {
  if (!file) return;
  mostrarStatus('info', `📂 Processando: ${file.name} (${(file.size/1024).toFixed(1)} KB)…`);

  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'csv') {
    lerCSV(file);
  } else if (ext === 'xlsx' || ext === 'xls') {
    lerXLSX(file);
  } else if (ext === 'pdf') {
    lerPDF(file);
  } else {
    mostrarStatus('err', '❌ Formato não suportado. Use CSV, XLSX, XLS ou PDF.');
  }
  // Limpa o input para permitir reenvio do mesmo arquivo
  document.getElementById('file-input').value = '';
}

/* ── Parser CSV ───────────────────────────────────── */
function lerCSV(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const linhas = e.target.result
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0);

      if (linhas.length < 2) { mostrarStatus('err', '❌ CSV vazio ou sem dados.'); return; }

      // Detectar separador (vírgula ou ponto-e-vírgula)
      const sep = linhas[0].includes(';') ? ';' : ',';
      const cabecalho = linhas[0].split(sep).map(c => normalizar(c));

      // Identificar índices de colunas
      const iExame     = cabecalho.findIndex(c => ['exame','nome','exame_nome','test'].includes(c));
      const iResultado = cabecalho.findIndex(c => ['resultado','result','valor','value','resultado_valor'].includes(c));
      const iData      = cabecalho.findIndex(c => ['data','date','data_exame','data_coleta'].includes(c));

      if (iExame < 0 || iResultado < 0) {
        mostrarStatus('err', '❌ Colunas obrigatórias não encontradas. Use o template CSV como modelo.');
        return;
      }

      const itens = [];
      for (let i = 1; i < linhas.length; i++) {
        const cols = linhas[i].split(sep);
        const nomeRaw = (cols[iExame] || '').trim().replace(/^"|"$/g, '');
        const valRaw  = (cols[iResultado] || '').trim().replace(/^"|"$/g, '').replace(',', '.');
        const dataRaw = iData >= 0 ? (cols[iData] || '').trim().replace(/^"|"$/g, '') : '';
        const val = parseFloat(valRaw);
        if (!nomeRaw || isNaN(val)) continue;
        itens.push({ nomeRaw, val, dataRaw });
      }

      if (!itens.length) { mostrarStatus('err', '❌ Nenhum dado válido encontrado no CSV.'); return; }
      abrirModalPreview(itens, `CSV: ${file.name}`);
    } catch(err) {
      mostrarStatus('err', '❌ Erro ao ler CSV: ' + err.message);
    }
  };
  reader.readAsText(file, 'UTF-8');
}

/* ── Parser XLSX / XLS ─────────────────────────────── */
function lerXLSX(file) {
  if (typeof XLSX === 'undefined') {
    mostrarStatus('err', '❌ Biblioteca XLSX não carregada. Verifique a conexão com a internet.');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const wb   = XLSX.read(e.target.result, { type: 'array', cellDates: true });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

      if (!rows.length) { mostrarStatus('err', '❌ Planilha vazia.'); return; }

      // Normaliza chaves das colunas
      const itens = [];
      rows.forEach(row => {
        // Mapeia chave normalizada → valor original
        const norm = {};
        Object.keys(row).forEach(k => { norm[normalizar(k)] = row[k]; });

        const nomeRaw = String(norm['exame'] || norm['nome'] || norm['exame_nome'] || norm['test'] || '').trim();
        const valBruto = norm['resultado'] || norm['result'] || norm['valor'] || norm['value'] || '';
        const dataRaw  = norm['data'] || norm['date'] || norm['data_exame'] || '';
        const val = parseFloat(String(valBruto).replace(',', '.'));

        if (!nomeRaw || isNaN(val)) return;
        itens.push({ nomeRaw, val, dataRaw: dataRaw ? String(dataRaw) : '' });
      });

      if (!itens.length) { mostrarStatus('err', '❌ Nenhum dado válido. Verifique as colunas da planilha.'); return; }
      abrirModalPreview(itens, `Excel: ${file.name}`);
    } catch(err) {
      mostrarStatus('err', '❌ Erro ao ler Excel: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

/* ── Parser PDF — Unimed / ABNT layout ─────────────────────────────────
   Tenta extração de texto nativa (PDF digital).
   Se o PDF for baseado em imagem (0 itens de texto), ativa OCR via Tesseract.js.
   ──────────────────────────────────────────────────────────────────────── */
async function lerPDF(file) {
  if (typeof pdfjsLib === 'undefined') {
    mostrarStatus('err', '❌ Biblioteca PDF.js não carregada. Verifique a conexão com a internet.');
    return;
  }
  try {
    const buffer = await file.arrayBuffer();
    const pdf    = await pdfjsLib.getDocument({ data: buffer }).promise;

    mostrarStatus('info', `📖 Lendo PDF (${pdf.numPages} páginas)…`);

    // ── Tentativa 1: extração de texto nativa ─────────────────────────────
    const todasLinhas = [];
    let totalItens    = 0;

    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const cont = await page.getTextContent();
      totalItens += cont.items.length;

      const porY = {};
      cont.items.forEach(item => {
        const y = Math.round(item.transform[5]);
        if (!porY[y]) porY[y] = [];
        porY[y].push({ str: item.str, x: item.transform[4] });
      });
      Object.keys(porY)
        .sort((a, b) => Number(b) - Number(a))
        .forEach(y => {
          const linha = porY[y].sort((a, b) => a.x - b.x).map(i => i.str).join(' ').trim();
          if (linha.length > 1) todasLinhas.push(linha);
        });
    }

    // ── Tentativa 2: OCR — ativa quando o PDF é baseado em imagem ─────────
    if (totalItens === 0) {
      await lerPDFcomOCR(pdf, file.name);
      return;
    }

    const itens = extrairExamesDoPDF(todasLinhas);
    if (!itens.length) {
      mostrarStatus('err', '❌ Nenhum exame reconhecido. Use o template CSV ou tente outro laudo.');
      return;
    }
    abrirModalPreview(itens, `PDF: ${file.name} (${pdf.numPages} página${pdf.numPages > 1 ? 's' : ''})`);
  } catch(err) {
    mostrarStatus('err', '❌ Erro ao ler PDF: ' + err.message);
  }
}

/* ── OCR — processa PDFs baseados em imagem (laudos escaneados) ─────────── */
async function lerPDFcomOCR(pdf, nomeArquivo) {
  if (typeof Tesseract === 'undefined') {
    mostrarStatus('err',
      '❌ PDF de imagem detectado e biblioteca OCR não carregada. Verifique a internet e recarregue a página, ou use o template CSV.');
    return;
  }

  mostrarStatus('info', '🔍 PDF de imagem detectado — iniciando OCR em português… (pode levar 1-3 min para laudos grandes)');

  try {
    // Cria worker Tesseract com português
    const worker = await Tesseract.createWorker({
      logger: m => {
        if (m.status === 'recognizing text') {
          const pct = Math.round((m.progress || 0) * 100);
          mostrarStatus('info', `🔍 OCR em andamento… ${pct}%`);
        }
      }
    });

    await worker.loadLanguage('por');
    await worker.initialize('por');
    // Configurações para laudos de laboratório (texto em bloco, escala 2×)
    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ0123456789.,;:/%-<>+() ',
    });

    const todasLinhas = [];

    for (let p = 1; p <= pdf.numPages; p++) {
      mostrarStatus('info', `🔍 OCR — página ${p} de ${pdf.numPages}…`);

      // Renderiza a página em canvas com resolução 2× para melhor precisão
      const page     = await pdf.getPage(p);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas   = document.createElement('canvas');
      canvas.width   = viewport.width;
      canvas.height  = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

      // OCR na imagem renderizada
      const { data: { text } } = await worker.recognize(canvas.toDataURL('image/png'));

      // Filtra linhas com conteúdo útil (ignora cabeçalhos de página e linhas vazias)
      const linhasPagina = text
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 2 && !/^(nome|cpf|d\.n\.|dr\s|convenio|origem|codigo|impresso|qtd\.|laboratorio|unimed)/i.test(l));

      todasLinhas.push(...linhasPagina);
    }

    await worker.terminate();

    mostrarStatus('info', `✅ OCR concluído — processando ${todasLinhas.length} linhas…`);

    const itens = extrairExamesDoPDF(todasLinhas);
    if (!itens.length) {
      mostrarStatus('err',
        '❌ OCR concluído mas nenhum exame foi reconhecido. O laudo pode estar em formato não suportado. Use o template CSV.');
      return;
    }
    abrirModalPreview(itens, `PDF+OCR: ${nomeArquivo} (${pdf.numPages} páginas)`);

  } catch(err) {
    mostrarStatus('err', '❌ Erro no OCR: ' + err.message);
  }
}

/** Converte string numérica do laudo (br) para float */
function pdfParseNum(str) {
  if (!str) return NaN;
  let s = String(str).trim().replace(/\s/g, '');
  // Milhar sem vírgula: "264.000" → 264000
  if (/^\d{1,3}(\.\d{3})+$/.test(s)) return parseFloat(s.replace(/\./g, ''));
  // Decimal brasileiro: "16,2" ou "504,00"
  return parseFloat(s.replace(',', '.'));
}

/**
 * Máquina de estados para extrair exames do PDF Unimed Campo Grande.
 *
 * Padrão A — exame simples (uma seção por página):
 *   FERRITINA                     ← header em CAPS
 *   Material: ...  Coleta: DD/MM/YYYY
 *   Resultado:   504,00  ng/mL    ← valor aqui
 *
 * Padrão B — sub-itens inline (Hemograma, Lipidograma):
 *   Hemoglobina:    16,2  g/dL    13,5 a 17,8 g/dL
 *   Plaquetas:   264.000  /mm³    140.000 a 400.000 / mm³
 */
function extrairExamesDoPDF(linhas) {
  const itens  = [];
  const visto  = new Set();

  let headerAtual = '';
  let dataAtual   = '';

  const reColeta    = /Coleta[\s.]*:\s*(\d{2}\/\d{2}\/\d{4})/i;
  const reResultado = /^resultado\s*:/i;
  const reValResult = /resultado\s*:\s*[<>≤≥]?\s*([0-9][0-9.,]*)/i;
  // Inline: "Hemoglobina:   16,2  g/dL ..." — nome com letra minúscula possível
  const reInline = /^([A-Za-záàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ][A-Za-záàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ\s.\-\/]{2,45}):\s+([0-9][0-9.,]*(?:\.[0-9]{3})?)/;

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();
    if (!linha) continue;
    const lNorm = normalizar(linha);

    // 1. Captura data de coleta ──────────────────────────────────────────
    const mData = linha.match(reColeta);
    if (mData) { dataAtual = normalizarData(mData[1]); continue; }

    // 2. Linha "Resultado: VALUE" (Padrão A) ────────────────────────────
    if (reResultado.test(lNorm) && headerAtual) {
      const refKey = resolverNome(headerAtual);
      if (refKey) {
        const mVal = linha.match(reValResult);
        if (mVal) {
          const val = pdfParseNum(mVal[1]);
          // Dedup por refKey: apenas 1 resultado por tipo de exame (evita duplicatas do OCR)
          if (!isNaN(val) && val > 0 && !visto.has(refKey)) {
            visto.add(refKey);
            itens.push({ nomeRaw: REFERENCIAS[refKey].nome, val, dataRaw: dataAtual });
          }
        }
      }
      headerAtual = '';
      continue;
    }

    // 3. Header de seção em CAPS (Padrão A) — linha que bate no NOME_MAP ─
    const lSemPontuacao = lNorm.replace(/[-–()/]/g, ' ').replace(/\s+/g, ' ').trim();
    const rk = resolverNome(lNorm) || resolverNome(lSemPontuacao);
    const totalLetras   = (linha.match(/[A-Za-z]/g) || []).length;
    const letrasCapital = (linha.match(/[A-Z]/g) || []).length;
    const isMostlyCaps  = totalLetras > 3 && (letrasCapital / totalLetras) > 0.5;
    if (rk && isMostlyCaps) { headerAtual = lSemPontuacao; continue; }

    // 4. Sub-item inline (Padrão B — Hemograma, Lipidograma) ─────────────
    const mInline = linha.match(reInline);
    if (mInline) {
      const nomeComp = normalizar(mInline[1].trim());
      const refKeyIn = resolverNome(nomeComp);
      if (refKeyIn) {
        const val = pdfParseNum(mInline[2]);
        // Dedup por refKey: apenas 1 resultado por tipo de exame
        if (!isNaN(val) && val > 0 && !visto.has(refKeyIn)) {
          visto.add(refKeyIn);
          itens.push({ nomeRaw: REFERENCIAS[refKeyIn].nome, val, dataRaw: dataAtual });
        }
      }
    }
  }
  return itens;
}

/* ── Modal de Preview ─────────────────────────────── */
let _itemsParaImportar = [];

function abrirModalPreview(itens, fonte) {
  _itemsParaImportar = itens.map((item, i) => ({
    ...item,
    idx:    i,
    refKey: resolverNome(item.nomeRaw),
  }));

  const total     = _itemsParaImportar.length;
  const matched   = _itemsParaImportar.filter(i => i.refKey).length;
  const semMatch  = total - matched;

  document.getElementById('modal-fonte').textContent =
    `Fonte: ${fonte} — ${total} linha${total !== 1 ? 's' : ''} detectada${total !== 1 ? 's' : ''}.`;

  document.getElementById('modal-resumo').innerHTML =
    `<span style="color:var(--success)">✅ ${matched} reconhecido${matched !== 1 ? 's' : ''}</span>` +
    (semMatch ? `  <span style="color:var(--warning)">  ⚠️ ${semMatch} sem correspondência</span>` : '');

  const linhas = _itemsParaImportar.map(item => {
    const ref   = item.refKey ? REFERENCIAS[item.refKey] : null;
    const nomeMostrado = ref ? ref.nome : item.nomeRaw;
    const unidade      = ref ? ref.unidade : '—';
    const refVal       = ref ? ref.ref : '—';
    const matchOk      = !!item.refKey;

    return `
      <tr class="${matchOk ? '' : 'sem-match'}">
        <td><input type="checkbox" data-idx="${item.idx}" ${matchOk ? 'checked' : ''} ${matchOk ? '' : 'disabled'} /></td>
        <td>${esc(item.nomeRaw)}</td>
        <td><strong>${esc(nomeMostrado)}</strong></td>
        <td>${item.val}</td>
        <td>${unidade}</td>
        <td>${refVal}</td>
        <td>${item.dataRaw || '—'}</td>
        <td><span class="match-tag ${matchOk ? 'ok' : 'err'}">${matchOk ? '✅ OK' : '⚠️ Não reconhecido'}</span></td>
      </tr>
    `;
  }).join('');

  document.getElementById('modal-preview').innerHTML = `
    <div style="overflow-x:auto">
      <table class="preview-table">
        <thead>
          <tr>
            <th>✓</th>
            <th>Nome no arquivo</th>
            <th>Exame identificado</th>
            <th>Resultado</th>
            <th>Unidade</th>
            <th>Referência</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${linhas}</tbody>
      </table>
    </div>
  `;

  document.getElementById('import-modal').style.display = 'flex';
  mostrarStatus('info', `🔍 ${matched} exame${matched !== 1 ? 's' : ''} reconhecido${matched !== 1 ? 's' : ''}. Revise e confirme a importação.`);
}

function fecharModal(e) {
  // Fecha somente se clicou no overlay (fundo)
  if (e && e.target !== document.getElementById('import-modal')) return;
  document.getElementById('import-modal').style.display = 'none';
}
function fecharModalBtn() {
  document.getElementById('import-modal').style.display = 'none';
}

async function confirmarImportacao() {
  const checkboxes = document.querySelectorAll('#modal-preview input[type=checkbox]:checked');
  if (!checkboxes.length) { alert('Selecione ao menos um exame para importar.'); return; }

  // Helper: rejeita após N ms com mensagem clara
  const comTimeout = (promise, ms, msg) =>
    Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms))]);

  // Mostra mensagem DENTRO do modal (visível ao usuário) e no console
  const msgModal = (tipo, texto) => {
    console.log('[Import]', tipo, texto);
    const el = document.getElementById('modal-resumo');
    if (!el) return;
    el.style.display = 'block';
    el.innerHTML = `<span style="color:var(--${tipo === 'err' ? 'danger' : 'success'})">${texto}</span>`;
  };

  const btnImportar = document.querySelector('#import-modal .btn-primary');
  const textoOriginal = btnImportar ? btnImportar.innerHTML : '✅ Importar Selecionados';
  const restaurarBtn = () => {
    if (btnImportar) { btnImportar.disabled = false; btnImportar.innerHTML = textoOriginal; }
  };
  if (btnImportar) { btnImportar.disabled = true; btnImportar.innerHTML = '⏳ Salvando…'; }

  try {
    // ── 1. Busca UID via getSession (localStorage, não faz chamada de rede) ───
    const uid = await (async () => {
      try {
        const { data: { session } } = await _supabase.auth.getSession();
        return session?.user?.id ?? null;
      } catch(e) { console.error('[Import] getSession erro:', e); return null; }
    })();

    if (!uid) {
      msgModal('err', '❌ Sessão expirada ou inválida. Faça login novamente e tente de novo.');
      restaurarBtn();
      return;
    }

    console.log('[Import] uid ok:', uid);

    // ── 2. Monta lista de exames válidos ──────────────────────────────────────
    const hoje = new Date().toISOString().split('T')[0];
    const novosExames = [];

    checkboxes.forEach(cb => {
      const idx  = parseInt(cb.dataset.idx);
      const item = _itemsParaImportar[idx];
      if (!item || !item.refKey) return;
      const ref = REFERENCIAS[item.refKey];
      if (!ref) return;
      const val = Number(item.val);
      if (isNaN(val) || val <= 0) return;
      const dataFinal = item.dataRaw ? normalizarData(item.dataRaw) : hoje;
      novosExames.push({
        tipo:       item.refKey,
        nome:       ref.nome,
        resultado:  val,
        unidade:    ref.unidade    || null,
        referencia: ref.ref        || null,
        status:     avaliarExame(item.refKey, val),
        data:       dataFinal      || hoje,
      });
    });

    if (!novosExames.length) {
      msgModal('err', '❌ Nenhum exame válido encontrado na seleção.');
      restaurarBtn();
      return;
    }

    console.log('[Import] exames a salvar:', novosExames.length);
    msgModal('ok', `⏳ Salvando ${novosExames.length} exame(s) no banco…`);

    // ── 3. BULK INSERT com timeout de 15 s ────────────────────────────────────
    const linhas = novosExames.map(e => ({
      user_id:    uid,
      tipo:       e.tipo,
      nome:       e.nome,
      resultado:  e.resultado,
      unidade:    e.unidade    || null,
      referencia: e.referencia || null,
      status:     e.status     || 'normal',
      data:       e.data       || null,
    }));

    const { data: inseridos, error: erroBulk } = await comTimeout(
      _supabase.from('exames').insert(linhas).select(),
      15000,
      'Timeout ao salvar no banco (15s). Tente novamente.'
    );

    if (erroBulk) {
      console.error('[Import] erro bulk insert:', erroBulk);
      msgModal('err', `❌ Erro ao salvar: ${erroBulk.message}. Tente novamente.`);
      restaurarBtn();
      return;
    }

    if (!inseridos?.length) {
      console.warn('[Import] insert sem retorno de linhas');
      msgModal('err', '❌ Banco não retornou dados. Verifique as permissões (RLS) e tente novamente.');
      restaurarBtn();
      return;
    }

    console.log('[Import] salvos com sucesso:', inseridos.length);

    // ── 4. Atualiza array local e UI ──────────────────────────────────────────
    inseridos.forEach(row => {
      exames.push({
        id: row.id, tipo: row.tipo, nome: row.nome,
        resultado: row.resultado, unidade: row.unidade,
        referencia: row.referencia, status: row.status, data: row.data,
      });
    });

    renderExames();
    fecharModalBtn();
    mostrarStatus('ok', `✅ ${inseridos.length} exame${inseridos.length !== 1 ? 's' : ''} importado${inseridos.length !== 1 ? 's' : ''} com sucesso!`);

  } catch(err) {
    console.error('[Import] exceção capturada:', err);
    msgModal('err', '❌ ' + (err.message || 'Erro desconhecido. Verifique o console.'));
    restaurarBtn();
  }
}

/** Tenta converter vários formatos de data para YYYY-MM-DD */
function normalizarData(str) {
  if (!str) return '';
  const s = String(str).trim();
  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split('/');
    return `${y}-${m}-${d}`;
  }
  // DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
    const [d, m, y] = s.split('-');
    return `${y}-${m}-${d}`;
  }
  // YYYY-MM-DD (já no formato certo)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // Excel converte datas para número serial — tenta parse genérico
  const dt = new Date(s);
  if (!isNaN(dt)) return dt.toISOString().split('T')[0];
  return '';
}

/* ── Status de upload ─────────────────────────────── */
function mostrarStatus(tipo, msg) {
  const el = document.getElementById('upload-status');
  el.className = 'upload-status ' + tipo;
  el.textContent = msg;
  el.style.display = 'block';
}

/* ══════════════════════════════════════════════════
   MÓDULO: IMPORTAÇÃO DE RECEITAS MÉDICAS
══════════════════════════════════════════════════ */

/* ── Drag & Drop da receita ──────────────────────── */
(function configurarDragDropReceita() {
  // Executa após o DOM estar pronto (init() já foi chamado)
  const area = document.getElementById('upload-area-receita');
  if (!area) return;
  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag-over'); });
  area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) processarArquivoReceita(file);
  });
  area.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') document.getElementById('file-input-receita').click();
  });
})();

/* ── Mapeamento de frequências em texto livre ──────── */
const FREQ_MAP = [
  { regex: /\b(uma\s+vez\s+ao\s+dia|1x\s*[\\/]?\s*dia|1\s*x\s*ao\s*dia|omeprazol|dose\s+única)\b/i, valor: '1x ao dia' },
  { regex: /\b(duas\s+vezes\s*ao\s*dia|2x\s*[\\/]?\s*dia|2\s*x\s*ao\s*dia)\b/i,                      valor: '2x ao dia' },
  { regex: /\b(três\s+vezes|3x\s*[\\/]?\s*dia|3\s*x\s*ao\s*dia)\b/i,                                  valor: '3x ao dia' },
  { regex: /\b(6\s*[\\/]\s*6\s*h|6em6|6\s*em\s*6|a\s+cada\s+6\s*h)\b/i,                              valor: 'A cada 6h' },
  { regex: /\b(8\s*[\\/]\s*8\s*h|8em8|8\s*em\s*8|a\s+cada\s+8\s*h)\b/i,                              valor: 'A cada 8h' },
  { regex: /\b(12\s*[\\/]\s*12\s*h|12em12|12\s*em\s*12|a\s+cada\s+12\s*h)\b/i,                       valor: 'A cada 12h' },
  { regex: /\b(jejum|em\s+jejum)\b/i,                                                                   valor: 'Em jejum' },
  { regex: /\b(após\s+refei[cç][aã]o|depois\s+d[ae]\s+refei[cç][aã]o|pós.?refei[cç][aã]o)\b/i,       valor: 'Após as refeições' },
  { regex: /\b(ao\s+deitar|antes\s+de\s+dormir|dorm)\b/i,                                              valor: 'Antes de dormir' },
];

function detectarFrequencia(texto) {
  for (const { regex, valor } of FREQ_MAP) {
    if (regex.test(texto)) return valor;
  }
  // Fallback: se tiver "x ao dia" captura
  const m = texto.match(/(\d)\s*x\s*ao\s*dia/i);
  if (m) return `${m[1]}x ao dia`;
  return '';
}

/* ── Dispatcher de receita ───────────────────────── */
function processarArquivoReceita(file) {
  if (!file) return;
  mostrarStatusReceita('info', `📂 Processando: ${file.name} (${(file.size/1024).toFixed(1)} KB)…`);

  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'csv') {
    lerCSVReceita(file);
  } else if (ext === 'xlsx' || ext === 'xls') {
    lerXLSXReceita(file);
  } else if (ext === 'pdf') {
    lerPDFReceita(file);
  } else {
    mostrarStatusReceita('err', '❌ Formato não suportado. Use CSV, XLSX, XLS ou PDF.');
  }
  document.getElementById('file-input-receita').value = '';
}

/* ── Parser CSV de receita ───────────────────────── */
function lerCSVReceita(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const linhas = e.target.result
        .split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

      if (linhas.length < 2) { mostrarStatusReceita('err', '❌ CSV vazio ou sem dados.'); return; }

      const sep      = linhas[0].includes(';') ? ';' : ',';
      const cabecalho = linhas[0].split(sep).map(c => normalizar(c));

      const iNome  = cabecalho.findIndex(c => ['medicamento','nome','remedio','remedios','med','drug'].includes(c));
      const iDos   = cabecalho.findIndex(c => ['dosagem','dose','doseagem','posologia','quantidade'].includes(c));
      const iFreq  = cabecalho.findIndex(c => ['frequencia','freq','horario','intervalo','schedule'].includes(c));
      const iObs   = cabecalho.findIndex(c => ['observacoes','obs','instrucoes','notes','instrução'].includes(c));
      const iData  = cabecalho.findIndex(c => ['data','data_inicio','inicio','date','start'].includes(c));

      if (iNome < 0) {
        mostrarStatusReceita('err', '❌ Coluna "medicamento" não encontrada. Use o template CSV como modelo.');
        return;
      }

      const itens = [];
      for (let i = 1; i < linhas.length; i++) {
        const cols   = linhas[i].split(sep);
        const get    = idx => idx >= 0 ? (cols[idx] || '').trim().replace(/^"|"$/g, '') : '';
        const nome   = get(iNome);
        if (!nome) continue;
        itens.push({
          nome,
          dosagem:    get(iDos),
          frequencia: get(iFreq),
          obs:        get(iObs),
          dataRaw:    get(iData),
        });
      }

      if (!itens.length) { mostrarStatusReceita('err', '❌ Nenhum dado válido no CSV.'); return; }
      abrirModalPreviewReceita(itens, `CSV: ${file.name}`);
    } catch(err) {
      mostrarStatusReceita('err', '❌ Erro ao ler CSV: ' + err.message);
    }
  };
  reader.readAsText(file, 'UTF-8');
}

/* ── Parser XLSX de receita ──────────────────────── */
function lerXLSXReceita(file) {
  if (typeof XLSX === 'undefined') {
    mostrarStatusReceita('err', '❌ Biblioteca XLSX não carregada. Verifique a conexão com a internet.');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const wb   = XLSX.read(e.target.result, { type: 'array', cellDates: true });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

      if (!rows.length) { mostrarStatusReceita('err', '❌ Planilha vazia.'); return; }

      const itens = [];
      rows.forEach(row => {
        const norm = {};
        Object.keys(row).forEach(k => { norm[normalizar(k)] = row[k]; });

        const nome = String(
          norm['medicamento'] || norm['nome'] || norm['remedio'] || norm['med'] || norm['drug'] || ''
        ).trim();
        if (!nome) return;

        const dosagem    = String(norm['dosagem'] || norm['dose'] || norm['posologia'] || '').trim();
        const frequencia = String(norm['frequencia'] || norm['freq'] || norm['horario'] || '').trim();
        const obs        = String(norm['observacoes'] || norm['obs'] || norm['instrucoes'] || norm['notes'] || '').trim();
        const dataRaw    = String(norm['data'] || norm['data_inicio'] || norm['inicio'] || '').trim();

        itens.push({ nome, dosagem, frequencia, obs, dataRaw });
      });

      if (!itens.length) { mostrarStatusReceita('err', '❌ Nenhum dado válido. Verifique as colunas da planilha.'); return; }
      abrirModalPreviewReceita(itens, `Excel: ${file.name}`);
    } catch(err) {
      mostrarStatusReceita('err', '❌ Erro ao ler Excel: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

/* ── Parser PDF de receita ───────────────────────── */
async function lerPDFReceita(file) {
  if (typeof pdfjsLib === 'undefined') {
    mostrarStatusReceita('err', '❌ Biblioteca PDF.js não carregada. Verifique a conexão com a internet.');
    return;
  }
  try {
    const buffer = await file.arrayBuffer();
    const pdf    = await pdfjsLib.getDocument({ data: buffer }).promise;

    let textoCompleto = '';
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const cont = await page.getTextContent();
      // Agrupa tokens por linha usando coordenada Y
      const porY = {};
      cont.items.forEach(item => {
        const y = Math.round(item.transform[5]);
        if (!porY[y]) porY[y] = [];
        porY[y].push(item.str);
      });
      Object.keys(porY).sort((a,b) => b - a).forEach(y => {
        textoCompleto += porY[y].join(' ') + '\n';
      });
    }

    const itens = extrairMedicamentosDoPDF(textoCompleto);
    if (!itens.length) {
      mostrarStatusReceita('err', '❌ Nenhum medicamento reconhecido no PDF. Tente o formato CSV para melhores resultados.');
      return;
    }
    abrirModalPreviewReceita(itens, `PDF: ${file.name} (${pdf.numPages} página${pdf.numPages > 1 ? 's' : ''})`);
  } catch(err) {
    mostrarStatusReceita('err', '❌ Erro ao ler PDF: ' + err.message);
  }
}

/**
 * Extrai medicamentos do texto de uma receita PDF.
 * Procura linhas com padrão de dosagem (mg, mcg, g, UI, ml, cp, comp).
 */
function extrairMedicamentosDoPDF(texto) {
  // Regex para detectar dosagem: número seguido de unidade farmacêutica
  const regexDosagem = /\b(\d+[\s.,]?\d*)\s*(mg|mcg|µg|g\b|ui\b|ul\b|ml\b|cp\b|comp\b|comprimidos?\b|capsula|cápsula|gotas?|unidade)/i;
  // Regex para frequência em texto livre
  const regexFreq = /(\d\s*[x×\/]\s*(?:ao\s*dia|dia|\d+\s*h)|uma\s+vez|duas\s+vezes|três\s+vezes|\d+em\d+|\d+\/\d+\s*h|jejum|após.{0,15}refei[cç]|antes\s+de\s+dormir|ao\s+deitar)/i;

  const linhas = texto.split(/\n/).map(l => l.trim()).filter(l => l.length > 3);
  const itens  = [];
  const visto  = new Set();

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    const mDos  = regexDosagem.exec(linha);
    if (!mDos) continue;

    // Tudo antes da dosagem = nome do medicamento
    const antesIdx = mDos.index;
    let nomeCandiato = linha.substring(0, antesIdx + mDos[0].length).trim();

    // Remove numeração inicial (ex: "1.", "1-", "•")
    nomeCandiato = nomeCandiato.replace(/^[\d\.\-–•\*\s]+/, '').trim();
    if (nomeCandiato.length < 2) continue;

    // Dosagem encontrada
    const dosagem = mDos[0].trim();

    // Frequência: tenta na mesma linha e nas próximas 2 linhas
    let frequenciaTexto = linha + ' ' + (linhas[i+1] || '') + ' ' + (linhas[i+2] || '');
    const mFreq = regexFreq.exec(frequenciaTexto);
    const frequencia = mFreq ? detectarFrequencia(mFreq[0]) : detectarFrequencia(linha);

    // Observação: texto após a dosagem na mesma linha
    const aposIdx  = mDos.index + mDos[0].length;
    let obs        = linha.substring(aposIdx).trim().replace(/^[-–:,.\s]+/, '');
    // Se a observação for só a frequência detectada, esvazia
    if (obs && mFreq && normalizar(obs).includes(normalizar(mFreq[0]))) obs = '';

    const uid = normalizar(nomeCandiato) + '|' + dosagem;
    if (visto.has(uid)) continue;
    visto.add(uid);

    itens.push({ nome: nomeCandiato, dosagem, frequencia, obs, dataRaw: '' });
  }
  return itens;
}

/* ── Modal de preview de receita ─────────────────── */
let _medsParaImportar = [];

function abrirModalPreviewReceita(itens, fonte) {
  _medsParaImportar = itens.map((item, i) => ({ ...item, idx: i }));

  document.getElementById('receita-modal-fonte').textContent =
    `Fonte: ${fonte} — ${itens.length} medicamento${itens.length !== 1 ? 's' : ''} detectado${itens.length !== 1 ? 's' : ''}.`;

  document.getElementById('receita-modal-resumo').textContent =
    `${itens.length} item${itens.length !== 1 ? 's' : ''} pronto${itens.length !== 1 ? 's' : ''} para importar`;

  const linhas = _medsParaImportar.map(item => `
    <tr>
      <td><input type="checkbox" data-idx="${item.idx}" checked /></td>
      <td><strong>${esc(item.nome)}</strong></td>
      <td>${esc(item.dosagem) || '<span style="color:#94a3b8">—</span>'}</td>
      <td>${esc(item.frequencia) || '<span style="color:#94a3b8">—</span>'}</td>
      <td>${esc(item.obs) || '<span style="color:#94a3b8">—</span>'}</td>
      <td>${item.dataRaw || '<span style="color:#94a3b8">—</span>'}</td>
    </tr>
  `).join('');

  document.getElementById('receita-modal-preview').innerHTML = `
    <div style="overflow-x:auto">
      <table class="preview-table">
        <thead>
          <tr>
            <th>✓</th>
            <th>Medicamento</th>
            <th>Dosagem</th>
            <th>Frequência</th>
            <th>Observações</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>${linhas}</tbody>
      </table>
    </div>
    <p style="font-size:.78rem;color:var(--muted);margin-top:10px">
      💡 Dados incompletos podem ser editados manualmente após a importação.
    </p>
  `;

  document.getElementById('receita-modal').style.display = 'flex';
  mostrarStatusReceita('info', `🔍 ${itens.length} medicamento${itens.length !== 1 ? 's' : ''} detectado${itens.length !== 1 ? 's' : ''}. Revise e confirme.`);
}

function fecharModalReceita(e) {
  if (e && e.target !== document.getElementById('receita-modal')) return;
  document.getElementById('receita-modal').style.display = 'none';
}
function fecharModalReceitaBtn() {
  document.getElementById('receita-modal').style.display = 'none';
}

async function confirmarImportacaoReceita() {
  const checkboxes = document.querySelectorAll('#receita-modal-preview input[type=checkbox]:checked');
  if (!checkboxes.length) { alert('Selecione ao menos um medicamento para importar.'); return; }

  const msgModal = (tipo, texto) => {
    const el = document.getElementById('receita-modal-resumo');
    if (el) el.innerHTML = `<span style="color:var(--${tipo === 'err' ? 'danger' : 'success'})">${texto}</span>`;
  };

  const btnImportar = document.querySelector('#receita-modal .btn-primary');
  const textoOriginal = btnImportar ? btnImportar.innerHTML : '';
  if (btnImportar) { btnImportar.disabled = true; btnImportar.innerHTML = '⏳ Salvando…'; }

  try {
    // Verifica autenticação
    const uid = await (async () => { try { const { data: { user } } = await _supabase.auth.getUser(); return user?.id ?? null; } catch(e) { return null; } })();
    if (!uid) {
      msgModal('err', '❌ Sessão expirada. Feche e faça login novamente.');
      if (btnImportar) { btnImportar.disabled = false; btnImportar.innerHTML = textoOriginal; }
      return;
    }

    const hoje = new Date().toISOString().split('T')[0];

    // Monta lista de medicamentos a inserir
    const novosMeds = Array.from(checkboxes).map(cb => {
      const item = _medsParaImportar[parseInt(cb.dataset.idx)];
      if (!item) return null;
      return {
        nome:   item.nome,
        dosagem:item.dosagem,
        freq:   item.frequencia,
        inicio: item.dataRaw ? normalizarData(item.dataRaw) : hoje,
        obs:    item.obs,
        regPor: 'Médico',
      };
    }).filter(Boolean);

    msgModal('ok', `⏳ Salvando ${novosMeds.length} medicamento(s)…`);

    // Insere TODOS em paralelo passando UID pré-buscado (sem N auth calls)
    const resultados = await Promise.all(novosMeds.map(m => dbInserirMedicamento(m, uid)));

    let importados = 0;
    const erros = [];
    resultados.forEach((uuid, i) => {
      if (uuid) {
        medicamentos.push({ ...novosMeds[i], id: uuid });
        importados++;
      } else {
        erros.push(novosMeds[i].nome);
      }
    });

    renderMedicamentos();

    if (importados === 0) {
      msgModal('err', '❌ Falha ao salvar. Verifique conexão e tente novamente.');
      if (btnImportar) { btnImportar.disabled = false; btnImportar.innerHTML = textoOriginal; }
    } else {
      fecharModalReceitaBtn();
      mostrarStatusReceita('ok', `✅ ${importados} medicamento${importados !== 1 ? 's' : ''} importado${importados !== 1 ? 's' : ''} com sucesso!`);
    }
  } catch(err) {
    console.error('[ImportReceita] exceção:', err);
    msgModal('err', '❌ Erro: ' + err.message);
    if (btnImportar) { btnImportar.disabled = false; btnImportar.innerHTML = textoOriginal; }
  }
}

/* ── Status de upload (receita) ──────────────────── */
function mostrarStatusReceita(tipo, msg) {
  const el = document.getElementById('upload-status-receita');
  el.className = 'upload-status ' + tipo;
  el.textContent = msg;
  el.style.display = 'block';
}

/* ── Download do Template CSV (receita) ──────────── */
function baixarTemplateCSVReceita() {
  const cabecalho = 'medicamento;dosagem;frequencia;observacoes;data_inicio';
  const hoje = new Date().toLocaleDateString('pt-BR');
  const exemplos = [
    `Metformina;500mg;2x ao dia;Tomar após as refeições;${hoje}`,
    `Losartana;50mg;1x ao dia;Em jejum pela manhã;${hoje}`,
    `Atorvastatina;20mg;1x ao dia;Antes de dormir;${hoje}`,
    `Omeprazol;20mg;1x ao dia;Em jejum 30 min antes do café;${hoje}`,
    `Levotiroxina;50mcg;1x ao dia;Em jejum - aguardar 30 min;${hoje}`,
    `AAS;100mg;1x ao dia;Após o almoço;${hoje}`,
    `Vitamina D3;2000UI;1x ao dia;Com alimentação;${hoje}`,
    `Losartana + Hidroclorotiazida;50/12.5mg;1x ao dia;Pela manhã;${hoje}`,
  ];
  const csv  = [cabecalho, ...exemplos].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'template_receita_nutrisaude.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Download do Template CSV ─────────────────────── */
function baixarTemplateCSV() {
  const cabecalho = 'exame;resultado;data';
  const exemplos = [
    'Glicemia em Jejum;95;' + new Date().toLocaleDateString('pt-BR'),
    'Colesterol Total;187;' + new Date().toLocaleDateString('pt-BR'),
    'HDL;62;' + new Date().toLocaleDateString('pt-BR'),
    'LDL;110;' + new Date().toLocaleDateString('pt-BR'),
    'Triglicerideos;140;' + new Date().toLocaleDateString('pt-BR'),
    'Hemoglobina Glicada;5.4;' + new Date().toLocaleDateString('pt-BR'),
    'TSH;2.1;' + new Date().toLocaleDateString('pt-BR'),
    'Vitamina D;35;' + new Date().toLocaleDateString('pt-BR'),
    'Ferritina;80;' + new Date().toLocaleDateString('pt-BR'),
    'Creatinina;0.9;' + new Date().toLocaleDateString('pt-BR'),
  ];
  const csv = [cabecalho, ...exemplos].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'template_exames_nutrisaude.csv';
  a.click();
  URL.revokeObjectURL(url);
}



/* ═══════════════════════════════════════════════════════════════
   NOVOS MÓDULOS — Dashboard, Peso, IMC, TDEE, Gráficos
   ═══════════════════════════════════════════════════════════════ */

/* ── Utilitário: obter dados biométricos do perfil ───────────── */
function getDadosBio() {
  const peso    = parseFloat(document.getElementById('paciente-peso')?.value)   || null;
  const altura  = parseFloat(document.getElementById('paciente-altura')?.value) || null;
  const sexo    = document.getElementById('paciente-sexo')?.value               || null;
  const nasc    = document.getElementById('paciente-nascimento')?.value         || null;
  const ativ    = parseFloat(document.getElementById('paciente-atividade')?.value) || null;
  let idade     = null;
  if (nasc) {
    const d = new Date(nasc);
    const hoje = new Date();
    idade = Math.floor((hoje - d) / (365.25 * 24 * 3600 * 1000));
  }
  return { peso, altura, sexo, idade, ativ };
}

/* ── Calcular IMC e exibir no card ───────────────────────────── */
function calcularIMC() {
  const { peso, altura } = getDadosBio();
  const inputEl = document.getElementById('imc-resultado');
  const labelEl = document.getElementById('imc-valor');

  if (!peso || !altura) {
    if (inputEl) inputEl.value = '';
    if (labelEl) { labelEl.textContent = ''; labelEl.style.color = ''; }
    perfil.imc = null;
    return;
  }

  const altM = altura / 100;
  const imc  = peso / (altM * altM);
  let classe = '', cor = '';
  if      (imc < 18.5) { classe = 'Abaixo do peso';   cor = '#1976d2'; }
  else if (imc < 25)   { classe = 'Peso normal';       cor = '#43a047'; }
  else if (imc < 30)   { classe = 'Sobrepeso';         cor = '#fb8c00'; }
  else if (imc < 35)   { classe = 'Obesidade Grau I';  cor = '#e53935'; }
  else if (imc < 40)   { classe = 'Obesidade Grau II'; cor = '#b71c1c'; }
  else                 { classe = 'Obesidade Grau III'; cor = '#7f0000'; }

  if (inputEl) inputEl.value = imc.toFixed(1) + ' kg/m²';
  if (labelEl) { labelEl.textContent = classe; labelEl.style.color = cor; }

  // Mantém IMC atualizado no objeto perfil em memória
  perfil.imc    = parseFloat(imc.toFixed(1));
  perfil.peso   = peso;
  perfil.altura = altura;

  atualizarDashboard();
}

/* ── Auto-salva bio ao sair do campo peso/altura ─────────────── */
function autoSalvarBio() {
  const peso   = parseFloat(document.getElementById('paciente-peso')?.value)   || null;
  const altura = parseFloat(document.getElementById('paciente-altura')?.value) || null;
  if (!peso || !altura) return; // só salva quando ambos preenchidos

  // Atualiza perfil com todos os campos bio atuais
  perfil.peso     = peso;
  perfil.altura   = altura;
  perfil.sexo     = document.getElementById('paciente-sexo')?.value     || perfil.sexo     || '';
  perfil.cintura  = parseFloat(document.getElementById('paciente-cintura')?.value)  || perfil.cintura  || null;
  perfil.atividade= document.getElementById('paciente-atividade')?.value || perfil.atividade|| '';
  perfil.objetivo = document.getElementById('paciente-objetivo')?.value  || perfil.objetivo || '';

  dbSalvarPerfil({ ...perfil, usoMeds }); // salva silenciosamente (sem toast)
}

/* ── Calculadora TMB / TDEE (Mifflin-St Jeor) ───────────────── */
function calcularTDEE() {
  const { peso, altura, sexo, idade, ativ } = getDadosBio();
  const avisoEl = document.getElementById('tdee-aviso');
  const resultEl = document.getElementById('tdee-resultado');
  if (!peso || !altura || !sexo || !idade) {
    if (avisoEl) { avisoEl.style.display = 'block'; }
    if (resultEl) { resultEl.style.display = 'none'; }
    return;
  }
  if (avisoEl) avisoEl.style.display = 'none';
  // Mifflin-St Jeor
  let tmb = sexo === 'M'
    ? 10 * peso + 6.25 * altura - 5 * idade + 5
    : 10 * peso + 6.25 * altura - 5 * idade - 161;
  const fator = ativ || 1.375;
  const tdee  = Math.round(tmb * fator);
  const mant  = tdee;
  const emag  = Math.round(tdee * 0.8);
  const massa = Math.round(tdee * 1.1);
  if (resultEl) {
    resultEl.style.display = 'block';
    resultEl.innerHTML = [
      '<div class="tdee-linha"><span class="tdee-linha-label">🔥 TMB (Metabolismo Basal)</span><span class="tdee-linha-valor">' + Math.round(tmb) + ' kcal/dia</span></div>',
      '<div class="tdee-linha"><span class="tdee-linha-label">⚡ TDEE (Gasto Total Diário)</span><span class="tdee-linha-valor">' + tdee + ' kcal/dia</span></div>',
      '<div class="tdee-linha"><span class="tdee-linha-label">📉 Para Emagrecer (–20%)</span><span class="tdee-linha-valor">' + emag + ' kcal/dia</span></div>',
      '<div class="tdee-linha"><span class="tdee-linha-label">💪 Para Ganhar Massa (+10%)</span><span class="tdee-linha-valor">' + massa + ' kcal/dia</span></div>',
    ].join('');
  }
  // Aplicar nas metas do plano
  const metaKcal = document.getElementById('meta-kcal');
  if (metaKcal) { metaKcal.value = mant; calcularMetas && calcularMetas(); }
  atualizarDashboard();
}

/* ── Dashboard: atualizar todos os cards ────────────────────── */
function atualizarDashboard() {
  // Total de exames
  const totalEx = document.getElementById('dash-total-exames');
  if (totalEx) totalEx.textContent = exames ? exames.length : '—';

  // Exames com alerta
  const alertas = exames ? exames.filter(e => e.status && e.status !== 'normal' && e.status !== 'sem-exame') : [];
  const alertaEl = document.getElementById('dash-exames-alerta');
  if (alertaEl) alertaEl.textContent = alertas.length;

  // Peso atual
  const pesoEl = document.getElementById('dash-peso-atual');
  const pesoVal = parseFloat(document.getElementById('paciente-peso')?.value);
  if (pesoEl) pesoEl.textContent = pesoVal ? pesoVal.toFixed(1) : '—';

  // IMC
  const imcEl = document.getElementById('dash-imc');
  const alturaVal = parseFloat(document.getElementById('paciente-altura')?.value);
  if (imcEl && pesoVal && alturaVal) {
    const imc = pesoVal / ((alturaVal/100) ** 2);
    imcEl.textContent = imc.toFixed(1);
  } else if (imcEl) { imcEl.textContent = '—'; }

  // TDEE
  const tdeeEl = document.getElementById('dash-tdee');
  const { peso, altura, sexo, idade, ativ } = getDadosBio();
  if (tdeeEl && peso && altura && sexo && idade) {
    const tmb = sexo === 'M' ? 10*peso + 6.25*altura - 5*idade + 5 : 10*peso + 6.25*altura - 5*idade - 161;
    tdeeEl.textContent = Math.round(tmb * (ativ || 1.375));
  } else if (tdeeEl) { tdeeEl.textContent = '—'; }

  // Medicamentos
  const medsEl = document.getElementById('dash-total-meds');
  if (medsEl) medsEl.textContent = (typeof medicamentos !== 'undefined' ? medicamentos.length : 0);

  // Lista de exames com alerta
  const listaAlertaEl = document.getElementById('dash-exames-alerta-lista');
  if (listaAlertaEl) {
    if (!alertas.length) {
      listaAlertaEl.innerHTML = '<p class="campo-hint">Nenhum exame fora da faixa normal. ✅</p>';
    } else {
      listaAlertaEl.innerHTML = alertas.map(e => {
        const badgeClass = e.status === 'alto' || e.status === 'elevado' ? 'elevado' : e.status === 'baixo' ? 'baixo' : 'atencao';
        const badgeLabel = e.status === 'alto' || e.status === 'elevado' ? '🔴 ELEVADO' : e.status === 'baixo' ? '🔴 BAIXO' : '⚠️ ATENÇÃO';
        return '<div class="dash-exame-alerta"><span style="flex:1;font-size:0.9rem"><strong>' + (e.nome || e.tipo) + '</strong>: ' + e.resultado + ' ' + (e.unidade || '') + '</span><span class="dash-badge-alerta ' + badgeClass + '">' + badgeLabel + '</span></div>';
      }).join('');
    }
  }

  // Popular select de exame para gráfico
  const sel = document.getElementById('select-exame-grafico');
  if (sel && exames && exames.length) {
    const tipos = [...new Set(exames.map(e => e.tipo))].sort();
    const optsHtml = '<option value="">Selecione um exame...</option>' + tipos.map(t => {
      const ref = REFERENCIAS[t];
      return '<option value="' + t + '">' + (ref ? ref.nome : t) + '</option>';
    }).join('');
    if (sel.innerHTML !== optsHtml) sel.innerHTML = optsHtml;
  }

  // Nome do paciente
  const nomeEl = document.getElementById('dash-nome-paciente');
  if (nomeEl) nomeEl.textContent = perfil?.nome || '—';

  // Último registro de evolução
  const ultRegEl = document.getElementById('dash-ultimo-registro');
  if (ultRegEl) {
    if (_registrosEvolucao.length) {
      const ult = _registrosEvolucao[_registrosEvolucao.length - 1];
      ultRegEl.textContent = new Date(ult.data + 'T12:00:00').toLocaleDateString('pt-BR');
    } else { ultRegEl.textContent = '—'; }
  }

  // Cintura atual
  const cinturaEl = document.getElementById('dash-cintura-atual');
  const cinturaVal = parseFloat(document.getElementById('paciente-cintura')?.value);
  if (cinturaEl) cinturaEl.textContent = cinturaVal ? cinturaVal.toFixed(0) : '—';

  // Atividade e objetivo
  const atEl = document.getElementById('dash-atividade');
  const atMap = { '1.2':'Sedentário', '1.375':'Leve', '1.55':'Moderado', '1.725':'Intenso', '1.9':'Muito intenso' };
  const atv = document.getElementById('paciente-atividade')?.value;
  if (atEl) atEl.textContent = atMap[atv] || '—';

  const objEl = document.getElementById('dash-objetivo');
  const objMap = { 'emagrecer':'Emagrecer', 'manter':'Manter', 'massa':'Ganhar massa' };
  const obj = document.getElementById('paciente-objetivo')?.value;
  if (objEl) objEl.textContent = objMap[obj] || '—';

  // Gráficos de evolução
  renderGraficoEvolucao('imc',    'grafico-imc',    'IMC',         '#8e24aa', 'kg/m²');
  renderGraficoEvolucao('cintura','grafico-cintura', 'Cintura (cm)','#fb8c00', 'cm');

  // Tabela de histórico de evolução
  const tabelaEl = document.getElementById('tabela-evolucao-body');
  if (tabelaEl) {
    if (!_registrosEvolucao.length) {
      tabelaEl.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#aaa;padding:1rem">Nenhum registro ainda. Salve o perfil do paciente para registrar.</td></tr>';
    } else {
      const atMapT = { '1.2':'Sedentário', '1.375':'Leve', '1.55':'Moderado', '1.725':'Intenso', '1.9':'Muito intenso' };
      const objMapT = { 'emagrecer':'Emagrecer', 'manter':'Manter', 'massa':'Ganhar massa' };
      tabelaEl.innerHTML = [..._registrosEvolucao].reverse().map(r => {
        const d = new Date(r.data + 'T12:00:00').toLocaleDateString('pt-BR');
        const imcCor = !r.imc ? '#666' : r.imc < 18.5 ? '#1976d2' : r.imc < 25 ? '#43a047' : r.imc < 30 ? '#fb8c00' : '#e53935';
        return `<tr>
          <td>${d}</td>
          <td>${r.peso != null ? r.peso.toFixed(1) + ' kg' : '—'}</td>
          <td style="color:${imcCor};font-weight:600">${r.imc != null ? r.imc : '—'}</td>
          <td>${r.cintura != null ? r.cintura + ' cm' : '—'}</td>
          <td>${atMapT[r.atividade] || r.atividade || '—'}</td>
          <td>${objMapT[r.objetivo] || r.objetivo || '—'}</td>
        </tr>`;
      }).join('');
    }
  }

  // Peso mais recente no histórico
  atualizarHistoricoPeso();
}

/* ── Gráfico de evolução de exame ────────────────────────────── */
let _graficoExame = null;
function renderGraficoExame() {
  const tipo = document.getElementById('select-exame-grafico')?.value;
  const canvas = document.getElementById('grafico-exame');
  if (!canvas || typeof Chart === 'undefined') return;
  if (_graficoExame) { _graficoExame.destroy(); _graficoExame = null; }
  if (!tipo || !exames || !exames.length) return;
  const dados = exames
    .filter(e => e.tipo === tipo && e.data && e.resultado != null)
    .sort((a, b) => a.data.localeCompare(b.data));
  if (!dados.length) return;
  const ref = REFERENCIAS[tipo];
  const labels = dados.map(e => {
    const d = new Date(e.data + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'2-digit' });
  });
  const valores = dados.map(e => e.resultado);
  _graficoExame = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: ref ? ref.nome : tipo,
        data: valores,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25,118,210,0.08)',
        borderWidth: 2.5,
        pointRadius: 5,
        pointBackgroundColor: '#1976d2',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ctx.parsed.y + (ref ? ' ' + ref.unidade : '') } }
      },
      scales: {
        y: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { color: '#555' },
          title: { display: true, text: ref ? ref.unidade : '', color: '#888', font: { size: 11 } }
        },
        x: { ticks: { color: '#555' } }
      }
    }
  });
}

/* ── Rastreamento de Peso ─────────────────────────────────────── */
let _registrosPeso    = JSON.parse(localStorage.getItem('nutrisaude_peso')    || '[]');
let _registrosEvolucao = JSON.parse(localStorage.getItem('nutrisaude_evolucao') || '[]');
let _graficoPeso      = null;
const _graficosEvolucao = {};

/* Salva snapshot biométrico ao salvar perfil */
function registrarEvolucao() {
  const peso    = parseFloat(document.getElementById('paciente-peso')?.value)    || null;
  const altura  = parseFloat(document.getElementById('paciente-altura')?.value)  || null;
  const cintura = parseFloat(document.getElementById('paciente-cintura')?.value) || null;
  const atividade = document.getElementById('paciente-atividade')?.value || '';
  const objetivo  = document.getElementById('paciente-objetivo')?.value  || '';
  if (!peso && !cintura) return;
  const imc  = (peso && altura) ? +(peso / ((altura / 100) ** 2)).toFixed(1) : null;
  const data = new Date().toISOString().split('T')[0];
  const snap = { data, peso, imc, cintura, atividade, objetivo };
  const idx  = _registrosEvolucao.findIndex(r => r.data === data);
  if (idx >= 0) _registrosEvolucao[idx] = snap;
  else { _registrosEvolucao.push(snap); _registrosEvolucao.sort((a, b) => a.data.localeCompare(b.data)); }
  localStorage.setItem('nutrisaude_evolucao', JSON.stringify(_registrosEvolucao));
}

/* Gráfico genérico de evolução (IMC, cintura etc.) */
function renderGraficoEvolucao(campo, canvasId, label, cor, unidade) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  if (_graficosEvolucao[canvasId]) { _graficosEvolucao[canvasId].destroy(); delete _graficosEvolucao[canvasId]; }
  const dados = _registrosEvolucao.filter(r => r[campo] != null);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (dados.length < 2) {
    ctx.fillStyle = '#bbb'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Salve ao menos 2 perfis para ver o gráfico', canvas.width / 2, 60);
    return;
  }
  const labels = dados.map(r => {
    const d = new Date(r.data + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  });
  _graficosEvolucao[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{ label, data: dados.map(r => r[campo]),
        borderColor: cor, backgroundColor: cor + '18',
        borderWidth: 2.5, pointRadius: 5, pointBackgroundColor: cor, tension: 0.4, fill: true }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#555' },
             title: { display: true, text: unidade, color: '#888' } },
        x: { ticks: { color: '#555' } }
      }
    }
  });
}

function abrirModalPeso() {
  const modal = document.getElementById('modal-peso');
  if (!modal) return;
  document.getElementById('peso-data-input').value = new Date().toISOString().split('T')[0];
  document.getElementById('peso-input').value = '';
  document.getElementById('peso-obs-input').value = '';
  document.getElementById('peso-status').textContent = '';
  modal.style.display = 'flex';
}

function salvarPeso() {
  const pesoVal  = parseFloat(document.getElementById('peso-input')?.value);
  const dataVal  = document.getElementById('peso-data-input')?.value;
  const obsVal   = document.getElementById('peso-obs-input')?.value || '';
  const statusEl = document.getElementById('peso-status');
  if (!pesoVal || pesoVal < 20 || pesoVal > 300) {
    if (statusEl) statusEl.innerHTML = '<span style="color:#e53935">⚠️ Informe um peso válido (20–300 kg).</span>';
    return;
  }
  if (!dataVal) {
    if (statusEl) statusEl.innerHTML = '<span style="color:#e53935">⚠️ Informe a data.</span>';
    return;
  }
  _registrosPeso.push({ peso: pesoVal, data: dataVal, obs: obsVal });
  _registrosPeso.sort((a, b) => a.data.localeCompare(b.data));
  localStorage.setItem('nutrisaude_peso', JSON.stringify(_registrosPeso));
  document.getElementById('modal-peso').style.display = 'none';
  atualizarHistoricoPeso();
  atualizarDashboard();
}

function removerPeso(idx) {
  _registrosPeso.splice(idx, 1);
  localStorage.setItem('nutrisaude_peso', JSON.stringify(_registrosPeso));
  atualizarHistoricoPeso();
  atualizarDashboard();
}

function atualizarHistoricoPeso() {
  const canvas = document.getElementById('grafico-peso');
  const lista  = document.getElementById('historico-peso-lista');
  if (!canvas || !lista) return;

  // Atualizar peso atual no campo do perfil se tiver registro
  if (_registrosPeso.length > 0) {
    const ultimo = _registrosPeso[_registrosPeso.length - 1];
    const campoEl = document.getElementById('paciente-peso');
    if (campoEl && !campoEl.value) campoEl.value = ultimo.peso;
    const pesoEl = document.getElementById('dash-peso-atual');
    if (pesoEl) pesoEl.textContent = ultimo.peso.toFixed(1);
  }

  // Gráfico
  if (typeof Chart !== 'undefined') {
    if (_graficoPeso) { _graficoPeso.destroy(); _graficoPeso = null; }
    if (_registrosPeso.length >= 2) {
      const labels = _registrosPeso.map(r => {
        const d = new Date(r.data + 'T12:00:00');
        return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short' });
      });
      const vals = _registrosPeso.map(r => r.peso);
      _graficoPeso = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Peso (kg)',
            data: vals,
            borderColor: '#43a047',
            backgroundColor: 'rgba(67,160,71,0.08)',
            borderWidth: 2.5,
            pointRadius: 5,
            pointBackgroundColor: '#43a047',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#555' }, title: { display: true, text: 'kg', color: '#888' } },
            x: { ticks: { color: '#555' } }
          }
        }
      });
    } else {
      // Mostrar mensagem
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#aaa';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Registre ao menos 2 pesagens para ver o gráfico', canvas.width/2, 60);
    }
  }

  // Lista
  if (!_registrosPeso.length) {
    lista.innerHTML = '<p class="campo-hint">Nenhum peso registrado ainda.</p>';
    return;
  }
  lista.innerHTML = [..._registrosPeso].reverse().slice(0, 10).map((r, i) => {
    const idxReal = _registrosPeso.length - 1 - i;
    const d = new Date(r.data + 'T12:00:00');
    const dateStr = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'2-digit' });
    return '<div class="peso-lista-item"><span><strong>' + r.peso.toFixed(1) + ' kg</strong> — ' + dateStr + (r.obs ? ' <span style="color:#aaa;font-size:0.8rem">(' + r.obs + ')</span>' : '') + '</span><button class="peso-del-btn" onclick="removerPeso(' + idxReal + ')" title="Remover">🗑</button></div>';
  }).join('');
}

/* ── Inicializar Dashboard quando a aba é ativada ────────────── */
// (irParaAba já suporta 'dashboard' — override removido)

/* ── CSS das novas features injetado dinamicamente ───────────── */
(function injetarCSS() {
  if (document.getElementById('nutrisaude-extra-css')) return;
  const s = document.createElement('style');
  s.id = 'nutrisaude-extra-css';
  s.textContent = `
    .dashboard-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:0.5rem; }
    .dash-card { display:flex; align-items:center; gap:0.8rem; padding:1rem 1.2rem; border-radius:12px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.07); }
    .dash-card-icon { font-size:2rem; line-height:1; }
    .dash-card-label { font-size:0.71rem; color:#888; text-transform:uppercase; letter-spacing:0.04em; }
    .dash-card-value { font-size:1.55rem; font-weight:700; color:#1a237e; line-height:1.2; }
    .dash-card-azul   { border-left:4px solid #1976d2; }
    .dash-card-vermelho { border-left:4px solid #e53935; }
    .dash-card-verde  { border-left:4px solid #43a047; }
    .dash-card-roxo   { border-left:4px solid #8e24aa; }
    .dash-card-laranja { border-left:4px solid #fb8c00; }
    .dash-card-cinza  { border-left:4px solid #78909c; }
    .imc-card { background:linear-gradient(135deg,#e3f2fd,#fff); border-radius:10px; padding:0.8rem 1.2rem; border-left:4px solid #1976d2; font-size:0.9rem; color:#1a237e; margin-top:0.8rem; }
    .imc-valor { font-size:1.4rem; font-weight:700; }
    .tdee-resultado-box { background:linear-gradient(135deg,#e8f5e9,#fff); border-radius:10px; padding:1rem 1.2rem; border-left:4px solid #43a047; }
    .tdee-linha { display:flex; justify-content:space-between; align-items:center; padding:0.3rem 0; border-bottom:1px solid rgba(0,0,0,0.05); }
    .tdee-linha:last-child { border:none; }
    .tdee-linha-label { color:#555; font-size:0.85rem; }
    .tdee-linha-valor { font-weight:700; color:#2e7d32; }
    .dash-exame-alerta { display:flex; align-items:center; gap:0.8rem; padding:0.6rem 0; border-bottom:1px solid #f0f0f0; }
    .dash-exame-alerta:last-child { border:none; }
    .dash-badge-alerta { padding:0.2rem 0.6rem; border-radius:20px; font-size:0.7rem; font-weight:700; }
    .dash-badge-alerta.elevado { background:#fff3e0; color:#e65100; }
    .dash-badge-alerta.baixo { background:#fce4ec; color:#c62828; }
    .dash-badge-alerta.atencao { background:#fff8e1; color:#f57f17; }
    .peso-lista-item { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid #f0f0f0; font-size:0.9rem; }
    .peso-lista-item:last-child { border:none; }
    .peso-del-btn { background:none; border:none; color:#e57373; cursor:pointer; font-size:1rem; padding:0.2rem 0.5rem; }
    .peso-del-btn:hover { color:#c62828; }
  `;
  document.head.appendChild(s);
})();
