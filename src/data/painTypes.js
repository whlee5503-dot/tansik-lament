export const PAIN_TYPES = {
  ko: [
    {
      id: "body", icon: "🩺", label: "몸의 고통", sub: "질병·만성통증·노화",
      states: [
        { id: "helpless", text: "통증이 심해서 아무것도 못 하겠어요" },
        { id: "fear",     text: "두렵고 불안해요 (검사 결과, 수술 앞두고)" },
        { id: "why",      text: "왜 나만 이런가 싶어요" },
        { id: "numb",     text: "그냥 아무 생각도 하기 싫어요" },
        { id: "angry",    text: "하나님이 원망스러워요" },
      ],
    },
    {
      id: "loss", icon: "🕯️", label: "상실의 슬픔", sub: "죽음·이별·관계의 끝",
      states: [
        { id: "empty",  text: "가슴에 구멍이 뚫린 것 같아요" },
        { id: "miss",   text: "너무 보고 싶어요" },
        { id: "alone",  text: "혼자 남겨진 것 같아요" },
        { id: "unfair", text: "왜 이렇게 됐는지 모르겠어요" },
        { id: "numb",   text: "아무 감각이 없어요" },
      ],
    },
    {
      id: "injustice", icon: "⚖️", label: "억울함과 한", sub: "부당함·배신·오해",
      states: [
        { id: "betrayal",      text: "믿었던 사람에게 배신당했어요" },
        { id: "misunderstood", text: "아무도 내 말을 들어주지 않아요" },
        { id: "longterm",      text: "너무 오래 참아왔어요" },
        { id: "rage",          text: "분하고 억울해서 잠이 안 와요" },
        { id: "give_up",       text: "다 포기하고 싶어요" },
      ],
    },
    {
      id: "anxiety", icon: "🌬️", label: "두려움과 불안", sub: "미래·실패·흔들림",
      states: [
        { id: "future",   text: "앞날이 막막하고 무서워요" },
        { id: "failure",  text: "또 실패할까봐 두려워요" },
        { id: "control",  text: "아무것도 내 마음대로 안 돼요" },
        { id: "panic",    text: "갑자기 불안이 밀려와요" },
        { id: "unstable", text: "내가 흔들리는 것 같아요" },
      ],
    },
    {
      id: "silence", icon: "🌑", label: "하나님의 침묵", sub: "응답 없음·신앙의 의심",
      states: [
        { id: "no_answer", text: "기도해도 아무 응답이 없어요" },
        { id: "distant",   text: "하나님이 멀리 계신 것 같아요" },
        { id: "doubt",     text: "정말 하나님이 계신지 모르겠어요" },
        { id: "abandoned", text: "버림받은 것 같은 느낌이에요" },
        { id: "tired",     text: "믿는 게 너무 지쳐요" },
      ],
    },
    {
      id: "shame", icon: "🪞", label: "수치와 자책", sub: "실패·죄책감·자존감",
      states: [
        { id: "regret",    text: "그때 그러지 말았어야 했는데" },
        { id: "worthless", text: "나는 왜 이 모양일까요" },
        { id: "hide",      text: "누군가에게 들킬까봐 두려워요" },
        { id: "unworthy",  text: "용서받을 자격이 없는 것 같아요" },
        { id: "compare",   text: "다른 사람들은 다 잘 사는 것 같아요" },
      ],
    },
  ],
  en: [
    {
      id: "body", icon: "🩺", label: "Physical Pain", sub: "illness · chronic pain · aging",
      states: [
        { id: "helpless", text: "The pain is so bad I can't do anything" },
        { id: "fear",     text: "I'm scared — waiting for test results or surgery" },
        { id: "why",      text: "Why is this happening to me?" },
        { id: "numb",     text: "I don't want to think about anything" },
        { id: "angry",    text: "I'm angry at God" },
      ],
    },
    {
      id: "loss", icon: "🕯️", label: "Grief & Loss", sub: "death · separation · endings",
      states: [
        { id: "empty",  text: "There's a hole in my chest" },
        { id: "miss",   text: "I miss them so much" },
        { id: "alone",  text: "I feel completely alone" },
        { id: "unfair", text: "I don't understand why this happened" },
        { id: "numb",   text: "I feel nothing at all" },
      ],
    },
    {
      id: "injustice", icon: "⚖️", label: "Injustice & Bitterness", sub: "betrayal · unfairness · being misunderstood",
      states: [
        { id: "betrayal",      text: "Someone I trusted betrayed me" },
        { id: "misunderstood", text: "Nobody listens to me" },
        { id: "longterm",      text: "I've been holding this in for so long" },
        { id: "rage",          text: "I'm so bitter I can't sleep" },
        { id: "give_up",       text: "I want to give up on everything" },
      ],
    },
    {
      id: "anxiety", icon: "🌬️", label: "Fear & Anxiety", sub: "future · failure · instability",
      states: [
        { id: "future",   text: "The future feels dark and terrifying" },
        { id: "failure",  text: "I'm afraid of failing again" },
        { id: "control",  text: "Nothing is going the way I planned" },
        { id: "panic",    text: "Anxiety hits me out of nowhere" },
        { id: "unstable", text: "I feel like I'm falling apart" },
      ],
    },
    {
      id: "silence", icon: "🌑", label: "God's Silence", sub: "unanswered prayer · doubt",
      states: [
        { id: "no_answer", text: "I've prayed and prayed — nothing" },
        { id: "distant",   text: "God feels far away" },
        { id: "doubt",     text: "I'm not sure God is even real" },
        { id: "abandoned", text: "I feel abandoned by God" },
        { id: "tired",     text: "I'm exhausted from trying to believe" },
      ],
    },
    {
      id: "shame", icon: "🪞", label: "Shame & Guilt", sub: "failure · guilt · self-worth",
      states: [
        { id: "regret",    text: "I shouldn't have done what I did" },
        { id: "worthless", text: "Why am I like this?" },
        { id: "hide",      text: "I'm afraid someone will find out" },
        { id: "unworthy",  text: "I don't deserve forgiveness" },
        { id: "compare",   text: "Everyone else seems to have it together" },
      ],
    },
  ],
  id: [
    {
      id: "body", icon: "🩺", label: "Rasa Sakit Fisik", sub: "penyakit · nyeri kronis · penuaan",
      states: [
        { id: "helpless", text: "Sakitnya sangat parah sampai aku tidak bisa apa-apa" },
        { id: "fear",     text: "Aku takut — menunggu hasil pemeriksaan atau operasi" },
        { id: "why",      text: "Kenapa ini terjadi padaku?" },
        { id: "numb",     text: "Aku tidak mau memikirkan apa-apa" },
        { id: "angry",    text: "Aku marah kepada Tuhan" },
      ],
    },
    {
      id: "loss", icon: "🕯️", label: "Dukacita & Kehilangan", sub: "kematian · perpisahan · akhir hubungan",
      states: [
        { id: "empty",  text: "Rasanya ada lubang di dadaku" },
        { id: "miss",   text: "Aku sangat merindukannya" },
        { id: "alone",  text: "Aku merasa sendirian" },
        { id: "unfair", text: "Aku tidak mengerti kenapa ini terjadi" },
        { id: "numb",   text: "Aku tidak merasakan apa-apa" },
      ],
    },
    {
      id: "injustice", icon: "⚖️", label: "Ketidakadilan & Kepahitan", sub: "pengkhianatan · diskriminasi · disalahpahami",
      states: [
        { id: "betrayal",      text: "Seseorang yang kupercaya telah mengkhianatiku" },
        { id: "misunderstood", text: "Tidak ada yang mau mendengarku" },
        { id: "longterm",      text: "Aku sudah memendam ini terlalu lama" },
        { id: "rage",          text: "Aku sangat pahit sampai tidak bisa tidur" },
        { id: "give_up",       text: "Aku ingin menyerah saja" },
      ],
    },
    {
      id: "anxiety", icon: "🌬️", label: "Ketakutan & Kecemasan", sub: "masa depan · kegagalan · ketidakstabilan",
      states: [
        { id: "future",   text: "Masa depan terasa gelap dan menakutkan" },
        { id: "failure",  text: "Aku takut gagal lagi" },
        { id: "control",  text: "Tidak ada yang berjalan sesuai rencanaku" },
        { id: "panic",    text: "Kecemasan datang tiba-tiba" },
        { id: "unstable", text: "Rasanya aku sedang hancur" },
      ],
    },
    {
      id: "silence", icon: "🌑", label: "Keheningan Tuhan", sub: "doa tak terjawab · keraguan iman",
      states: [
        { id: "no_answer", text: "Sudah berdoa berkali-kali — tidak ada jawaban" },
        { id: "distant",   text: "Tuhan terasa jauh dariku" },
        { id: "doubt",     text: "Aku tidak yakin Tuhan itu nyata" },
        { id: "abandoned", text: "Aku merasa ditinggalkan Tuhan" },
        { id: "tired",     text: "Aku lelah berusaha untuk percaya" },
      ],
    },
    {
      id: "shame", icon: "🪞", label: "Malu & Rasa Bersalah", sub: "kegagalan · rasa bersalah · harga diri",
      states: [
        { id: "regret",    text: "Seharusnya aku tidak melakukan itu" },
        { id: "worthless", text: "Kenapa aku seperti ini?" },
        { id: "hide",      text: "Aku takut ada yang tahu" },
        { id: "unworthy",  text: "Aku tidak layak untuk diampuni" },
        { id: "compare",   text: "Semua orang tampak baik-baik saja kecuali aku" },
      ],
    },
  ],
};
