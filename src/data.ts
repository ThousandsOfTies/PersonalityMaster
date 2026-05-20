export type IdolType = 'Cute' | 'Cool' | 'Passion';
export type IdolProject = 'ミリシタ' | 'シャニソン';
export type IdolFilter =
  | '765AS'
  | 'Princess'
  | 'Fairy'
  | 'Angel'
  | 'illumination STARS'
  | "L'Antica"
  | '放課後クライマックスガールズ'
  | 'ALSTROEMERIA'
  | 'ストレイライト'
  | 'ノクチル'
  | 'SHHis'
  | 'CoMETIK';

export interface Idol {
  id: string;
  name: string;
  project: IdolProject;
  type: IdolType;
  filter: IdolFilter;
  age: number;
  height: number;
  vocal: number;
  dance: number;
  visual: number;
  image: string;
}

const placeholderImage = '/member_placeholder.svg';

const memberImages: Record<string, string> = {
  '天海春香': '/amami_haruka.png',
  'エミリー': '/emily.png',
  '春日未来': '/kasuga_mirai.png',
  '我那覇響': '/ganaha_hibiki.png',
  '菊地真': '/kikuchi_makoto.png',
  '佐竹美奈子': '/satake_minako.png',
  '田中琴葉': '/tanaka_kotoha.png',
  '萩原雪歩': '/hagiwara_yukiho.png',
  '秋月律子': '/akizuki_ritsuko.png',
  '如月千早': '/kisaragi_chihaya.png',
  '四条貴音': '/shijou_takane.png',
  '水瀬伊織': '/minase_iori.png',
  '天空橋朋花': '/tenkubashi_tomoka.png',
  '大神環': '/ogami_tamaki.png',
  '北上麗花': '/kitakami_reika.png',
  '篠宮可憐': '/shinomiya_karen.png',
  '高槻やよい': '/takatsuki_yayoi.png',
  '野々原茜': '/nonohara_akane.png',
  '双海亜美': '/futami_ami.png',
  '双海真美': '/futami_mami.png',
  '星井美希': '/hoshii_miki.png',
  '三浦あずさ': '/miura_azusa.png',
  '箱崎星梨花': '/hakosaki_serika.png',
  '望月杏奈': '/mochizuki_anna.png',
  '七尾百合子': '/nanao_yuriko.png',
  '真壁瑞希': '/makabe_mizuki.png',
  '北沢志保': '/kitazawa_shiho.png',
  '周防桃子': '/suou_momoko.png',
  '横山奈緒': '/yokoyama_nao.png',
  '永吉昴': '/nagayoshi_subaru.png',
  '高坂海美': '/kousaka_umi.png',
  '島原エレナ': '/shimabara_elena.png',
  '舞浜歩': '/maihama_ayumu.png',
  '矢吹可奈': '/yabuki_kana.png',
  '中谷育': '/nakatani_iku.png',
  'ロコ': '/roco.png',
  '徳川まつり': '/tokugawa_matsuri.png',
  '馬場このみ': '/baba_konomi.png',
  '百瀬莉緒': '/momose_rio.png',
  '二階堂千鶴': '/nikaido_chizuru.png',
  '木下ひなた': '/kinoshita_hinata.png',
  '福田のり子': '/fukuda_noriko.png',
  '高山紗代子': '/takayama_sayoko.png',
  '松田亜利沙': '/matsuda_arisa.png',
  '宮尾美也': '/miyao_miya.png',
  '桜守歌織': '/sakuramori_kaori.png',
  '最上静香': '/mogami_shizuka.png',
  '伊吹翼': '/ibuki_tsubasa.png',
  '白石紬': '/shiraishi_tsumugi.png',
  '所恵美': '/tokoro_megumi.png',
  'ジュリア': '/julia.png',
  '豊川風花': '/toyokawa_fuka.png',
  '七草にちか': '/nanakusa_nichika.png',
  '緋田美琴': '/aketa_mikoto.png',
  '黛冬優子': '/mayuzumi_fuyuko.png',
  '芹沢あさひ': '/serizawa_asahi.png',
  '和泉愛依': '/izumi_mei.png',
  '市川雛菜': '/ichikawa_hinana.png',
  '浅倉透': '/asakura_toru.png',
  '樋口円香': '/higuchi_madoka.png',
  '福丸小糸': '/fukumaru_koito.png',
  '杜野凛世': '/morino_rinze.png',
  '園田智代子': '/sonoda_chiyoko.png',
  '小宮果穂': '/komiya_kaho.png',
  '西城樹里': '/saijo_juri.png',
  '有栖川夏葉': '/arisuagawa_natsuha.png',
  '大崎甘奈': '/osaki_amana.png',
  '桑山千雪': '/kuwayama_chiyuki.png',
  '大崎甜花': '/osaki_tenka.png',
  '田中摩美々': '/tanaka_mamimi.png',
  '幽谷霧子': '/yukoku_kiriko.png',
  '月岡恋鐘': '/tsukioka_kogane.png',
  '三峰結華': '/mitsumine_yuika.png',
  '白瀬咲耶': '/shirase_sakuya.png',
  '鈴木羽那': '/suzuki_hana.png',
  '斑鳩ルカ': '/ikaruga_ruka.png',
  '郁田はるき': '/ikuta_haruki.png',
  '櫻木真乃': '/sakuragi_mano.png',
  '風野灯織': '/kazano_hiori.png',
  '八宮めぐる': '/hachimiya_meguru.png',
};

const millionLiveNames = [
  '天海春香',
  'エミリー',
  '春日未来',
  '我那覇響',
  '菊地真',
  '高坂海美',
  '佐竹美奈子',
  '高山紗代子',
  '田中琴葉',
  '徳川まつり',
  '中谷育',
  '七尾百合子',
  '萩原雪歩',
  '福田のり子',
  '松田亜利沙',
  '矢吹可奈',
  '横山奈緒',
  '秋月律子',
  '如月千早',
  '北沢志保',
  '四条貴音',
  'ジュリア',
  '白石紬',
  '周防桃子',
  '天空橋朋花',
  '所恵美',
  '永吉昴',
  '二階堂千鶴',
  '舞浜歩',
  '真壁瑞希',
  '水瀬伊織',
  '最上静香',
  '百瀬莉緒',
  'ロコ',
  '伊吹翼',
  '大神環',
  '北上麗花',
  '木下ひなた',
  '桜守歌織',
  '篠宮可憐',
  '島原エレナ',
  '高槻やよい',
  '野々原茜',
  '豊川風花',
  '箱崎星梨花',
  '馬場このみ',
  '双海亜美',
  '双海真美',
  '星井美希',
  '三浦あずさ',
  '宮尾美也',
  '望月杏奈',
] as const;

const shinyColorsNames = [
  '櫻木真乃',
  '風野灯織',
  '八宮めぐる',
  '田中摩美々',
  '幽谷霧子',
  '月岡恋鐘',
  '三峰結華',
  '白瀬咲耶',
  '小宮果穂',
  '園田智代子',
  '西城樹里',
  '杜野凛世',
  '有栖川夏葉',
  '大崎甘奈',
  '桑山千雪',
  '大崎甜花',
  '黛冬優子',
  '芹沢あさひ',
  '和泉愛依',
  '市川雛菜',
  '浅倉透',
  '樋口円香',
  '福丸小糸',
  '七草にちか',
  '緋田美琴',
  '斑鳩ルカ',
  '鈴木羽那',
  '郁田はるき',
] as const;

const typeCycle: IdolType[] = ['Cute', 'Cool', 'Passion'];

const allStars = new Set<string>([
  '天海春香',
  '我那覇響',
  '菊地真',
  '萩原雪歩',
  '秋月律子',
  '如月千早',
  '四条貴音',
  '水瀬伊織',
  '高槻やよい',
  '双海亜美',
  '双海真美',
  '星井美希',
  '三浦あずさ',
]);

const princess = new Set<string>(millionLiveNames.slice(0, 17));
const fairy = new Set<string>(millionLiveNames.slice(17, 34));
const angel = new Set<string>(millionLiveNames.slice(34));

const shinyUnitByName = new Map<string, IdolFilter>([
  ...shinyColorsNames.slice(0, 3).map(name => [name, 'illumination STARS'] as const),
  ...shinyColorsNames.slice(3, 8).map(name => [name, "L'Antica"] as const),
  ...shinyColorsNames.slice(8, 13).map(name => [name, '放課後クライマックスガールズ'] as const),
  ...shinyColorsNames.slice(13, 16).map(name => [name, 'ALSTROEMERIA'] as const),
  ...shinyColorsNames.slice(16, 19).map(name => [name, 'ストレイライト'] as const),
  ...shinyColorsNames.slice(19, 23).map(name => [name, 'ノクチル'] as const),
  ...shinyColorsNames.slice(23, 25).map(name => [name, 'SHHis'] as const),
  ...shinyColorsNames.slice(25).map(name => [name, 'CoMETIK'] as const),
]);

const getIdolFilter = (name: string, project: IdolProject): IdolFilter => {
  if (project === 'シャニソン') {
    return shinyUnitByName.get(name) ?? 'illumination STARS';
  }

  if (allStars.has(name)) return '765AS';
  if (princess.has(name)) return 'Princess';
  if (fairy.has(name)) return 'Fairy';
  if (angel.has(name)) return 'Angel';
  return 'Princess';
};

const buildIdols = (
  names: readonly string[],
  project: IdolProject,
  startIndex: number,
): Idol[] => names.map((name, index) => ({
  id: String(startIndex + index + 1),
  name,
  project,
  type: typeCycle[index % typeCycle.length],
  filter: getIdolFilter(name, project),
  age: 0,
  height: 0,
  vocal: 50,
  dance: 50,
  visual: 50,
  image: memberImages[name] ?? placeholderImage,
}));

export const idolGroups: { project: IdolProject; idols: Idol[] }[] = [
  {
    project: 'ミリシタ',
    idols: buildIdols(millionLiveNames, 'ミリシタ', 0),
  },
  {
    project: 'シャニソン',
    idols: buildIdols(shinyColorsNames, 'シャニソン', millionLiveNames.length),
  },
];

export const idols: Idol[] = idolGroups.flatMap((group) => group.idols);

export const idolFilters: IdolFilter[] = [
  '765AS',
  'Princess',
  'Fairy',
  'Angel',
  'illumination STARS',
  "L'Antica",
  '放課後クライマックスガールズ',
  'ALSTROEMERIA',
  'ストレイライト',
  'ノクチル',
  'SHHis',
  'CoMETIK',
];
