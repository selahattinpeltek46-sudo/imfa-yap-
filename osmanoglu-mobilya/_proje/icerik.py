"""Osmanoğlu Mobilya — nihai metinler ve fotoğraf envanteri (tek kaynak).

uret.py bu dosyadan siteyi, `--metin` ile modul-2-icerik-seo.md'nin 12. bölümünü üretir.
Kural: yalnız görülen / doğrulanan yazılır. Garanti, ücretsiz keşif, süre, fiyat, kuruluş yılı yok.
Metin içinde <a>, <strong> gibi kısa HTML kullanılabilir; {k} sayfa köküne göre göreli yol olur.
"""

TARIH = "2026-10-20"
TARIH_OKUNUR = "20 Ekim 2026"
PUAN, YORUM_SAYISI = "4,9", 26

# ---------------------------------------------------------------- fotoğraflar
# Kaynak: kullanıcının gönderdiği "Film 1 — 30 Haziran 2021" slayt gösterisi kaydı (802×842 / 804×812).
# dosya: (alt metin, genişlik, yükseklik, büyük sürüm var mı)
FOTO = {
    "mutfak-pencere-l-tezgah": ("Pencere önünden dönen L mutfak: tahta kaplama kulpsuz çekmeceler, koyu tezgâh, siyah damarlı tezgâh arası ve siyah, yansıtan üst dolaplar", 796, 836, True),
    "mutfak-eviye-cekmeceler": ("Yakın plan: alttan montajlı inox eviye, bakır damarlı koyu tezgâh ve aynı hizada sıralanan tahta kaplama çekmeceler", 798, 806, True),
    "antre-aynali-citali-vestiyer": ("Antrede tavana kadar ahşap üst dolaplar, altta boy ayna ve dört askılı çıtalı panel vestiyer", 796, 597, True),
    "mutfak-tezgah-kose": ("Tezgâhın köşe dönüşü ve kalın kenarı; arkada çekmece sırası ve eviye", 798, 806, False),
    "mutfak-gun-isigi": ("Aynı L mutfak öğle ışığında: pencere yanındaki çekmece kolonu ve üst dolapların yansıması", 796, 836, False),
}

# Hero slaytları: (dosya, kısa başlık, [(x%, y%, yön, etiket)])  yön: "sag" = etiket noktanın sağında
HERO = [
    ("mutfak-pencere-l-tezgah", "L mutfak, pencere önü", [
        (28, 78, "sag", "Kulpsuz çekmece: tutamak yerine yatay kanal"),
        (74, 22, "sol", "Siyah, yansıtan üst kapaklar"),
        (10, 67, "sag", "Pencere önünden dönen tezgâh"),
    ]),
    ("mutfak-eviye-cekmeceler", "Eviye ve çekmece sırası", [
        (18, 30, "sag", "Alttan montajlı inox eviye"),
        (14, 74, "sag", "Bakır damarlı koyu tezgâh"),
        (70, 52, "sol", "Kapak araları aynı hizada"),
    ]),
    ("antre-aynali-citali-vestiyer", "Antre: ayna ve çıtalı vestiyer", [
        (40, 20, "sag", "Tavana kadar üst dolap"),
        (24, 64, "sag", "Boy ayna"),
        (85, 42, "sol", "Çıtalı panel, dört askı"),
    ]),
]

# ---------------------------------------------------------------- yorumlar
# Google Haritalar, kullanıcının ekran görüntüsünden. Kelimeler aynen; yalnız noktalama eklendi ve iki yazım
# düzeltildi ("ramen"→"rağmen", "ayos"→"ayous"). "…" = Haritalar'da "Diğer" ile kısaltılmış devamı.
YORUMLAR = [
    {"kisi": "Murat T.", "zaman": "10 ay önce", "konu": "Koridor dolabı",
     "metin": "Mobilya konusunda gideceğiniz tek adres. Murat ustanın ustalığı 10 numara. Kullandığı malzeme kalitesi 10 numara, rahatlıkla bütün mobilya işlerinizi yaptırabilirsiniz. Ustam ellerine sağlık."},
    {"kisi": "Emre K.", "zaman": "4 yıl önce", "konu": "Gardırop, TV ünitesi, konsol",
     "metin": "Sanat ve tecrübede çıtanın üstünde bir işletme, kaliteden ve müşteri memnuniyetinden ödün vermeyip geniş çaplı üretim kapasitesi ile mobilya ve aksesuara dair her işi itinalı temizlikte zamanında teslim etmesi en iyi yanı. Ayrıca güler yüzlülüğü için özellikle Murat ustaya çok teşekkür ederim…"},
    {"kisi": "Kamil C.", "zaman": "3 yıl önce", "konu": "Ahşap karavan",
     "metin": "Ben karavan yaptırdım. Hiç bir tane demirden karkas olmamasına rağmen iki yıldır kullanıyorum, inanılmaz sağlamlıkta. Çok özel bir ağaçtan yaptı; dünyanın en hafif ağacı olan ayous ağacı kullandı. Emeğine sağlık, süper bir ustalık ve kişilik sahibi bir abimdir. Çok ama çok teşekkür ederim…"},
]

MESAJ_TURLERI = ["Mutfak dolabı", "Vestiyer / antre", "Gardırop / gömme dolap", "TV ünitesi", "Karavan", "Başka bir iş"]

# ---------------------------------------------------------------- sayfalar
SAYFA_SIRASI = ["", "mutfak-dolabi/", "vestiyer-gomme-dolap/", "karavan-mobilyasi/"]

SAYFA = {
    "": {
        "menu": "Ana sayfa",
        "title": "Osmanoğlu Mobilya | Sincan, Ankara Özel Ölçü Mobilya",
        "meta": "Sincan Sanayi Sitesi'ndeki atölyemizde Ankara için özel ölçü mutfak dolabı, vestiyer, gardırop ve gömme dolap. Ustayla doğrudan konuşun: 0532 177 06 19.",
        "h1_ust": "Sincan / Ankara · özel ölçü mobilya",
        "h1": "Ölçüye yapılır, yerine oturur.",
        "giris": "Mutfak dolabı, vestiyer, gardırop ve gömme dolap; Sincan Sanayi Sitesi'ndeki atölyemizde, sizin duvarınızın ölçüsüyle. Ustayla doğrudan konuşursunuz.",
        "wa": "Merhaba, özel ölçü mobilya için bilgi almak istiyorum.",
    },
    "mutfak-dolabi/": {
        "menu": "Mutfak dolabı",
        "title": "Mutfak Dolabı Sincan, Ankara | Osmanoğlu Mobilya",
        "meta": "Ankara'da özel ölçü mutfak dolabı: kulpsuz çekmece, tavana kadar dolap, pencere önü L tezgâh. Sincan'daki atölyemize mutfağınızın fotoğrafını gönderin.",
        "h1_ust": "Mutfak dolabı · Ankara",
        "h1": "Mutfak, duvarın ölçüsüyle başlar.",
        "giris": "Hazır modül köşeye, pencereye, kolona takılır. Biz mutfağı sizin duvarınıza göre çizer, Sincan'daki atölyemizde yapar, yerine takarız.",
        "wa": "Merhaba, mutfak dolabı için bilgi almak istiyorum.",
        "tur": "Mutfak dolabı",
    },
    "vestiyer-gomme-dolap/": {
        "menu": "Vestiyer ve dolap",
        "title": "Vestiyer ve Gömme Dolap Ankara | Osmanoğlu Mobilya",
        "meta": "Ankara'da özel ölçü vestiyer, gardırop, gömme dolap ve TV ünitesi. Tavana kadar dolap, boy ayna, çıtalı panel. Alanın fotoğrafını WhatsApp'tan gönderin.",
        "h1_ust": "Vestiyer · gardırop · gömme dolap",
        "h1": "Kapıdan girince ilk gördüğünüz yer.",
        "giris": "Antre, koridor ve yatak odası çoğu evde en dar, en dağınık alandır. Tavana kadar dolap, boy ayna ve askı panelini aynı ölçüde düşünürüz.",
        "wa": "Merhaba, vestiyer / dolap için bilgi almak istiyorum.",
        "tur": "Vestiyer / antre",
    },
    "karavan-mobilyasi/": {
        "menu": "Karavan",
        "title": "Ahşap Karavan ve Karavan Mobilyası | Osmanoğlu",
        "meta": "Ankara Sincan'da ahşap karavan ve karavan iç mobilyası. Müşterimizin yorumu: ayous ağacından, iki yıldır sağlam. Fikrinizi ve ölçülerinizi gönderin.",
        "h1_ust": "Karavan · Sincan atölyesi",
        "h1": "Karavanınız da bir mobilya işidir.",
        "giris": "Hafif olmalı, sarsıntıya dayanmalı, her santimi kullanılmalı. Ahşap karavanı ve karavan iç mobilyasını atölyemizde, ölçünüze göre yapıyoruz.",
        "wa": "Merhaba, karavan için bir fikrim var, konuşmak istiyorum.",
        "tur": "Karavan",
    },
}

# ---------------------------------------------------------------- ana sayfa bölümleri
ISLER = [
    {"sayfa": "mutfak-dolabi/", "foto": "mutfak-gun-isigi", "baslik": "Mutfak dolabı",
     "metin": "Pencere önü, kolon, kombi köşesi: mutfağın en zor yerleri ölçüyle çözülür. Çekmece sırası, tezgâh hattı ve üst dolaplar aynı çizgide.",
     "baglanti": "Mutfak dolabı sayfası"},
    {"sayfa": "vestiyer-gomme-dolap/", "foto": "antre-aynali-citali-vestiyer", "baslik": "Vestiyer, gardırop, gömme dolap",
     "metin": "Antrede ayna ve askı, koridorda tavana kadar dolap, yatak odasında köşe gardırop. TV ünitesi ve konsol da bu işlerin içinde.",
     "baglanti": "Vestiyer ve dolap sayfası"},
    {"sayfa": "karavan-mobilyasi/", "foto": None, "baslik": "Karavan ve özel işler",
     "metin": "Bir müşterimiz için ayous ağacından karavan yaptık; iki yıl sonra yorumunu yazdı. Alışılmadık bir fikriniz varsa önce konuşalım.",
     "baglanti": "Karavan sayfası"},
]

DETAY_BASLIK = "Bir mutfağa yakından bakınca"
DETAY_GIRIS = "Fotoğraftaki mutfak bizim işimiz. Mutfak dolabı yaptıracak herkese, teklif karşılaştırırken bu noktalara bakmasını öneriyoruz."
DETAY = [
    ("Kapak araları", "Çekmeceler arasındaki boşluk baştan sona aynı mı? Bozulan hiza, gövdenin ya da menteşenin oynadığını gösterir."),
    ("Eviye ile tezgâh birleşimi", "Fotoğraftaki eviye tezgâhın altından takılı; kenarında su tutacak bir çıta yok. Hangi eviye tipinin tezgâhınıza uyduğunu baştan konuşun."),
    ("Tutamak", "Bu mutfakta kulp yok; çekmeceler yatay bir kanaldan tutularak açılıyor. Kulpsuz kapak temiz görünür, çocuklu evde kulpla karşılaştırarak seçin."),
    ("Köşe ve dönüşler", "L mutfakta tezgâhın döndüğü köşe en çok yük alan yerdir. Köşe dolabının nasıl kullanılacağını (döner raf, derin çekmece) çizimde görün."),
]

ADIMLAR = [
    ("Fotoğraf ve kaba ölçü", "Alanın birkaç fotoğrafını ve aklınızdaki ölçüyü WhatsApp'tan gönderin. Ölçü yoksa da yazın; konuşarak başlarız."),
    ("Konuşalım", "Telefonda ya da Sincan Sanayi Sitesi'ndeki atölyemizde; ne istediğinizi, nasıl kullanacağınızı anlatın."),
    ("Ölçü ve seçim", "Yerinde net ölçü alınır; kapak, renk ve tezgâh birlikte seçilir. Fiyat ve teslim tarihi bu seçimlere göre netleşir."),
    ("Üretim ve montaj", "İş atölyede hazırlanır, evinizde yerine takılır."),
]

# ---------------------------------------------------------------- SSS (sayfa başına)
SSS = {
    "": [
        ("Hangi işleri yapıyorsunuz?", "Mutfak dolabı, vestiyer, gardırop, gömme dolap, TV ünitesi ve konsol gibi özel ölçü mobilya. Karavan gibi alışılmadık işleri de konuşuyoruz."),
        ("Nerede hizmet veriyorsunuz?", "Atölyemiz Sincan Sanayi Sitesi'nde. Ankara içindeki işler için yazın; Sincan, Etimesgut ve Eryaman bize en yakın bölgeler."),
        ("Fiyat nasıl belirleniyor?", "Ölçü, kapak ve gövde malzemesi, tezgâh ve aksesuarlara göre. Fotoğraf ve kaba ölçüyle konuşmaya başlarız; net fiyatı ölçü ve seçimlerden sonra veririz."),
        ("Atölyeye gelebilir miyim?", "Evet. Adres: Ahi Evran Mahallesi, Sincan Sanayi Sitesi. Gelmeden önce 0532 177 06 19'u arayın; usta işte ya da montajda olabilir."),
    ],
    "mutfak-dolabi/": [
        ("Mutfak dolabı ne kadar sürede biter?", "Ölçüye, malzemeye ve o dönemki iş yoğunluğuna göre değişir. Teslim tarihini ölçü ve seçimler netleşince birlikte konuşuruz."),
        ("Eski mutfağı söküp yenisini takıyor musunuz?", "Söküm ve montajın nasıl yapılacağını ilk görüşmede konuşalım; fotoğraflarda mevcut durumu görmek işimizi kolaylaştırır."),
        ("Tezgâhı da siz mi seçiyorsunuz?", "Tezgâh dolaplarla birlikte düşünülmeli. Hangi tezgâhın kullanılacağını ve kimin takacağını görüşmede netleştiririz."),
        ("Kulpsuz kapak mı, kulplu kapak mı?", "Kulpsuz kapak sade görünür; kulp tutması kolaydır. Mutfağı kimin, nasıl kullandığına göre birlikte karar verelim."),
    ],
    "vestiyer-gomme-dolap/": [
        ("Küçük bir antre için de geliyor musunuz?", "Evet; küçük alanlar ölçüyle yapılan işin en çok fark ettiği yerlerdir. Fotoğrafı gönderin, konuşalım."),
        ("Gömme dolap için duvarda değişiklik gerekir mi?", "Çoğu zaman mevcut nişe ya da duvar boyuna göre yapılır. Fotoğraf ve ölçüyle birlikte bakalım."),
        ("Ayna ve askı paneli birlikte mi yapılıyor?", "Fotoğraftaki antrede üst dolap, boy ayna ve çıtalı askı paneli tek parça gibi planlandı. Sizin girişinize göre bu düzen değişebilir."),
    ],
    "karavan-mobilyasi/": [
        ("Karavanın tamamını mı yapıyorsunuz, yalnız iç mobilyayı mı?", "Kamil Bey'in karavanında ahşap gövde ve iç düzen birlikte yapıldı. Sizin aracınızda ne yapılabileceğini fikrinizi ve ölçüleri görünce konuşalım."),
        ("Ayous ağacı neden?", "Ayous (obeche) düşük yoğunluklu, hafif bir Afrika ağacıdır; karavanda her kilo önemlidir. Malzemeyi işinize göre birlikte seçeriz."),
        ("Ruhsat ve muayene işini siz mi yapıyorsunuz?", "Hayır, bu konuda söz vermiyoruz. Karavanın trafiğe çıkışı için gereken belge ve onayları yaptırmadan önce ayrıca araştırmanızı öneririz."),
    ],
}

# ---------------------------------------------------------------- alt sayfa gövde metinleri
MUTFAK = {
    "galeri_baslik": "Fotoğraftaki mutfak",
    "galeri_giris": "Pencere önünden dönen bir L mutfak. Aynı işin üç karesi: genel görünüm, eviye hattı ve tezgâhın köşe dönüşü.",
    "secim_baslik": "Birlikte karar verdiğimiz şeyler",
    "secimler": [
        ("Yerleşim", "Düz, L ya da U; pencere, kolon ve kombi nerede. Ölçü bu kararın üstüne kurulur."),
        ("Kapak", "Renk, yüzey ve tutamak: kulp mu, kulpsuz kanal mı. Fotoğraftaki mutfakta tahta kaplama görünümlü kulpsuz çekmeceler var."),
        ("Üst dolap", "Tavana kadar mı, açık raf mı, camlı mı. Bu mutfakta üst dolaplar siyah ve yansıtan kapaklı."),
        ("Tezgâh ve tezgâh arası", "Rengi, damarı ve eviye tipi kapaklarla birlikte seçilir."),
        ("İç düzen", "Çekmece sayısı, kiler, çöp ve deterjan yeri, köşe çözümü."),
    ],
    "ilceler_baslik": "Ankara'nın neresindeyiz?",
    "ilceler": "Atölyemiz Sincan Sanayi Sitesi'nde. Sincan, Etimesgut, Eryaman ve Yenimahalle'ye yakınız; Ankara içindeki diğer ilçeler için de yazın, işin kapsamına göre konuşalım.",
}

VESTIYER = {
    "detay_baslik": "Bu antrede ne var?",
    "detay": [
        ("Tavana kadar üst dolap", "Kapının üstündeki boşluk boşa gitmiyor; mevsimlik eşya yukarıda."),
        ("Boy ayna", "Dar koridoru geniş gösterir; çıkarken son bakış."),
        ("Çıtalı panel ve askılar", "Dikey ahşap çıtalar, dört askı. Mont ve çanta kapının yanında kalır."),
    ],
    "diger_baslik": "Müşterilerimizin Haritalar'da paylaştığı işler",
    "diger_giris": "Aşağıdaki işlerin fotoğraflarını müşterilerimiz Google Haritalar yorumlarında paylaştı. Fotoğraflar onlara ait olduğu için burada göstermiyoruz; Haritalar'da görebilirsiniz.",
    "diger": [
        "Koridor boyunca beyaz, tavana kadar gömme dolap",
        "Köşeyi dönen iki renkli gardırop",
        "Beyaz boy dolaplar ve TV ünitesi",
        "Çıtalı ön yüzlü konsol",
    ],
}

KARAVAN = {
    "yorum_giris": "Bu sayfayı bir müşterimizin yorumu yüzünden açtık.",
    "bilinen_baslik": "O karavan hakkında bildiklerimiz",
    "bilinen": [
        ("Malzeme", "Ayous ağacı. Hafif bir ağaç; karavanda taşınan her kilo yakıta ve çekişe yansır."),
        ("Yapı", "Müşterimizin kendi ifadesiyle: demir karkas olmadan yapıldı."),
        ("Kullanım", "Yorum yazıldığında iki yıldır kullanılıyordu."),
    ],
    "getir_baslik": "Konuşmaya gelirken",
    "getir": [
        "Çekecek aracınız ve çekme kapasitesi",
        "Aklınızdaki dış ölçü, kaç kişi kalacağı",
        "İçeride olmazsa olmazlar: yatak, mutfak köşesi, dolap",
        "Beğendiğiniz karavan fotoğrafları",
    ],
    "cizim_notu": "Temsili çizim; Kamil Bey'in karavanının fotoğrafı Google Haritalar yorumunda.",
}
