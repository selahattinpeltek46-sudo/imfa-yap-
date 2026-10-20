"""Osmanoğlu Mobilya — nihai metinler ve fotoğraf envanteri (tek kaynak), v2 (editoryal tasarım).

uret.py bu dosyadan siteyi, `--metin` ile modul-2-icerik-seo.md'nin 12. bölümünü üretir.
Kural: yalnız görülen / doğrulanan yazılır. Garanti, ücretsiz keşif, süre, fiyat, kuruluş yılı yok.
"""

TARIH = "2026-10-20"
TARIH_OKUNUR = "20 Ekim 2026"
PUAN, YORUM_SAYISI = "4,9", 26

# ---------------------------------------------------------------- fotoğraflar
# Kaynak: kullanıcının gönderdiği "Film 1 — 30 Haziran 2021" slayt gösterisi kaydı (802×842 / 804×812).
# dosya: (alt metin, genişlik, yükseklik)  — bu beşinin 1,8× "-buyuk" sürümü var (BUYUK)
FOTO = {
    "mutfak-pencere-l-tezgah": ("Pencere önünden dönen L mutfak: tahta kaplama kulpsuz çekmeceler, koyu tezgâh, siyah damarlı tezgâh arası ve siyah, yansıtan üst dolaplar", 796, 836),
    "mutfak-eviye-cekmeceler": ("Yakın plan: alttan montajlı inox eviye, bakır damarlı koyu tezgâh ve aynı hizada sıralanan tahta kaplama çekmeceler", 798, 806),
    "antre-aynali-citali-vestiyer": ("Antrede tavana kadar ahşap üst dolaplar, altta boy ayna ve dört askılı çıtalı panel vestiyer", 796, 597),
    "mutfak-tezgah-kose": ("Tezgâhın köşe dönüşü ve kalın kenarı; arkada çekmece sırası ve eviye", 798, 806),
    "mutfak-gun-isigi": ("Aynı L mutfak öğle ışığında: pencere yanındaki çekmece kolonu ve üst dolapların yansıması", 796, 836),
}

# Detay kırpımları: aynı karelerden, kendi çözünürlüğünde (büyütülmeden) kesildi. "-buyuk" sürümleri yok.
FOTO.update({
    "detay-kulpsuz-cekmece": ("Yakın plan: tahta kaplama çekmeceler ve aralarındaki siyah yatay tutamak kanalları", 440, 322),
    "detay-eviye-batarya": ("Siyah tezgâh arası önünde inox eviye ve batarya", 372, 340),
    "detay-ust-dolap-yansima": ("Siyah, yansıtan üst dolap kapakları ve yanda tahta kaplama dolap", 442, 360),
    "detay-pencere-kose": ("Pencere önünden dönen koyu tezgâh ve pencere yanındaki üst dolap", 460, 580),
    "detay-damarli-tezgah": ("Bakır renkli damarlı koyu tezgâhın köşesi ve kalın kenarı", 520, 532),
    "detay-cekmece-sirasi": ("Aynı hizada sıralanan tahta kaplama çekmeceler ve üstte koyu tezgâh", 424, 460),
    "detay-alttan-eviye": ("Tezgâhın altından montajlı inox eviye", 460, 360),
    "detay-cita-aski": ("Dikey ahşap çıtalı panel ve üzerindeki dört askı", 332, 440),
    "detay-antre-ust-dolap": ("Antrede tavana kadar ahşap üst dolaplar ve altında çıtalı panel", 542, 380),
})
BUYUK = {"mutfak-pencere-l-tezgah", "mutfak-eviye-cekmeceler", "antre-aynali-citali-vestiyer", "mutfak-tezgah-kose", "mutfak-gun-isigi"}

# Hero mozaiği: gerçek kareler kendi boyutlarında, yavaşça kayan 3 sütun. (dosya, kısa etiket)
KARO = {
    "mutfak-pencere-l-tezgah": "Pencere önü L mutfak",
    "mutfak-eviye-cekmeceler": "Eviye hattı",
    "mutfak-tezgah-kose": "Tezgâhın köşe dönüşü",
    "mutfak-gun-isigi": "Öğle ışığında",
    "antre-aynali-citali-vestiyer": "Aynalı, çıtalı antre",
    "detay-kulpsuz-cekmece": "Kulpsuz çekmece",
    "detay-eviye-batarya": "Siyah tezgâh arası",
    "detay-ust-dolap-yansima": "Yansıtan üst kapaklar",
    "detay-pencere-kose": "Pencere önü dönüş",
    "detay-damarli-tezgah": "Bakır damarlı tezgâh",
    "detay-cekmece-sirasi": "Aynı hizada kapaklar",
    "detay-alttan-eviye": "Alttan montajlı eviye",
    "detay-cita-aski": "Çıtalı panel, dört askı",
    "detay-antre-ust-dolap": "Tavana kadar üst dolap",
}

# Instagram profil ekran kaydından (20.10.2026) kesilen paylaşımlar: 351 px genişlik, büyütülmeden kullanılır.
# Hariç tutulanlar: düğün davetiyesi (kişisel), yazı bindirilmiş kolajlar, yemek takımı ve belirsiz kareler.
IG = {
    # dosya: (alt metin, kategori, kısa etiket)
    "ig-mutfak-bej-uzun": ("Uzun duvar boyunca bej parlak kapaklı mutfak, tavana kadar üst dolaplar ve davlumbaz", "mutfak", "Bej parlak mutfak"),
    "ig-mutfak-beyaz-kucuk": ("Küçük beyaz mutfak, siyah tezgâh ve tavana kadar boy dolap", "mutfak", "Küçük beyaz mutfak"),
    "ig-mutfak-cicekli-tezgah-arasi": ("Beyaz kapaklı köşe mutfak, siyah tezgâh ve ışıklı desenli tezgâh arası", "mutfak", "Işıklı tezgâh arası"),
    "ig-mutfak-beyaz-klasik": ("Beyaz çerçeveli kapaklar, siyah kulplar ve açık renk tezgâhlı mutfak", "mutfak", "Beyaz klasik mutfak"),
    "ig-mutfak-camli-ust-dolap": ("Camlı üst dolaplı beyaz mutfak", "mutfak", "Camlı üst dolaplar"),
    "ig-mutfak-beyaz-parlak": ("Beyaz parlak mutfak, ankastre fırın ve manzara desenli tezgâh arası", "mutfak", "Beyaz parlak mutfak"),
    "ig-mutfak-boy-dolap": ("Beyaz kapaklı boy dolaplar ve ankastre beyaz eşya yerleri", "mutfak", "Boy dolaplar"),
    "ig-mutfak-klasik-ankastre": ("Krem klasik boy dolap ve içine yerleştirilmiş iki ankastre fırın", "mutfak", "Klasik ankastre dolap"),
    "ig-ust-dolap-camli-gri": ("Gri çerçeveli, buzlu camlı üst dolap ve siyah kulplar", "mutfak", "Gri camlı üst dolap"),
    "ig-vestiyer-beyaz-gomme": ("Koridor boyunca beyaz gömme dolaplar ve askılı vestiyer bölmesi", "dolap", "Beyaz gömme dolap"),
    "ig-gardirop-klasik-beyaz": ("Beyaz klasik çerçeveli kapaklı gardırop", "dolap", "Klasik gardırop"),
    "ig-gardirop-siyah-beyaz": ("Siyah ve beyaz parlak kapaklı dolap ve yanında açık raflı niş", "dolap", "Siyah-beyaz dolap"),
    "ig-dolap-kapak-desenli": ("Oval desen oyma beyaz kapaklar", "dolap", "Desenli kapaklar"),
    "ig-tv-unitesi-led": ("Çıtalı panel önünde ışıklı TV ünitesi ve alçak konsol", "tv", "Işıklı TV ünitesi"),
    "ig-tv-unitesi-klasik": ("Krem klasik TV ünitesi, iki yanda camlı vitrin dolaplar", "tv", "Klasik TV ünitesi"),
    "ig-vitrin-tv-unitesi": ("Beyaz alt dolaplı, raflı vitrin ve TV duvarı", "tv", "Vitrin ve raflar"),
    "ig-konsol-dalga-kapak": ("Dalga desenli beyaz kapaklı, halka kulplu konsol ve oval ayna", "tv", "Dalga kapaklı konsol"),
    "ig-sifonyer-ceviz-beyaz": ("Ceviz ve beyaz çekmeceli şifonyer", "tv", "Ceviz-beyaz şifonyer"),
    "ig-makyaj-sifonyer": ("Yuvarlak aynalı, ahşap çekmeceli şifonyer", "tv", "Aynalı şifonyer"),
    "ig-banyo-dolabi-yesil": ("Yeşil kapaklı banyo dolabı, beyaz tezgâh ve desenli fayans", "banyo", "Yeşil banyo dolabı"),
    "ig-banyo-altin-ayna": ("Altın çerçeveli yuvarlak aynalar ve tezgâh üstü lavabolu banyo", "banyo", "Altın aynalı banyo"),
    "ig-karavan-iki": ("Römork üzerinde iki ahşap kaplamalı küçük ev / karavan", "karavan", "İki karavan"),
    "ig-karavan-ic-led": ("Karavan içi: mavi ışıklı tavan, oturma köşesi ve dolaplar", "karavan", "Karavan içi, ışıklı"),
    "ig-karavan-ic-ahsap": ("Karavan içi: ahşap kaplama duvarlar, asma kata çıkan merdiven ve masa", "karavan", "Karavan içi, ahşap"),
    "ig-karavan-turuncu": ("Turuncu yatay ahşap kaplamalı, siyah çerçeveli pencereli karavan", "karavan", "Turuncu karavan"),
    "ig-kamelya-ahsap": ("Ahşap kamelya: korkuluklu, çatılı bahçe yapısı", "ahsap", "Ahşap kamelya"),
    "ig-veranda-pergola": ("Ev önünde ahşap direkli veranda / pergola", "ahsap", "Ahşap veranda"),
    "ig-merdiven-beyaz": ("Beyaz korkuluklu, ahşap basamaklı iç merdiven", "ahsap", "İç merdiven"),
    "ig-merdiven-ahsap-ayna": ("3D tasarım görseli: ahşap döner merdiven ve aynalı duvar paneli", "ahsap", "3D tasarım: merdiven"),
    "ig-koridor-duvar-paneli": ("Koridorda çerçeveli duvar panelleri ve mor ışık", "ahsap", "Duvar paneli"),
    "ig-duvar-paneli-ayna-led": ("Aynalı duvar paneli ve tavanda gizli ışık", "ahsap", "Aynalı duvar paneli"),
    "ig-sedir-pencere-onu": ("Pencere önünde kırmızı minderli ahşap sedir", "ahsap", "Pencere önü sedir"),
}
IG_KATEGORI = [("mutfak", "Mutfak"), ("dolap", "Gardırop & dolap"), ("tv", "TV ünitesi & konsol"), ("banyo", "Banyo"),
               ("karavan", "Karavan"), ("ahsap", "Merdiven, panel & ahşap yapılar")]
for _d, (_alt, _kat, _et) in IG.items():
    FOTO[_d] = (_alt, 351, 348 if _d == "ig-karavan-iki" else 430)
    KARO[_d] = _et

_MUTFAK = [["ig-mutfak-bej-uzun", "mutfak-pencere-l-tezgah", "ig-mutfak-beyaz-parlak", "detay-kulpsuz-cekmece"],
           ["ig-mutfak-cicekli-tezgah-arasi", "detay-damarli-tezgah", "ig-mutfak-klasik-ankastre", "ig-mutfak-beyaz-kucuk"],
           ["ig-mutfak-beyaz-klasik", "mutfak-eviye-cekmeceler", "ig-mutfak-camli-ust-dolap", "ig-ust-dolap-camli-gri"]]
_ANTRE = [["antre-aynali-citali-vestiyer", "ig-gardirop-klasik-beyaz", "ig-tv-unitesi-led", "ig-konsol-dalga-kapak"],
          ["ig-vestiyer-beyaz-gomme", "detay-cita-aski", "ig-vitrin-tv-unitesi", "ig-sifonyer-ceviz-beyaz"],
          ["ig-gardirop-siyah-beyaz", "ig-tv-unitesi-klasik", "ig-dolap-kapak-desenli", "ig-makyaj-sifonyer"]]
MOZAIK = {
    "": [["ig-mutfak-bej-uzun", "ig-karavan-turuncu", "mutfak-pencere-l-tezgah", "ig-banyo-altin-ayna", "ig-gardirop-klasik-beyaz"],
         ["ig-tv-unitesi-led", "detay-cita-aski", "ig-mutfak-cicekli-tezgah-arasi", "ig-kamelya-ahsap", "ig-karavan-ic-ahsap"],
         ["ig-mutfak-beyaz-klasik", "ig-tv-unitesi-klasik", "detay-damarli-tezgah", "ig-vestiyer-beyaz-gomme", "ig-banyo-dolabi-yesil"]],
    "mutfak-dolabi/": _MUTFAK,
    "projeler/pencere-onu-l-mutfak/": _MUTFAK,
    "vestiyer-gomme-dolap/": _ANTRE,
    "projeler/aynali-citali-antre/": _ANTRE,
    "karavan-mobilyasi/": [["ig-karavan-turuncu", "ig-kamelya-ahsap", "ig-karavan-ic-led"],
                           ["ig-karavan-ic-ahsap", "ig-karavan-iki", "ig-veranda-pergola"],
                           ["ig-karavan-iki", "ig-karavan-ic-led", "ig-sedir-pencere-onu"]],
}

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
# tur: "hizmet" | "proje" | "makale" | "liste" | "bilgi"
SAYFA_SIRASI = ["", "mutfak-dolabi/", "vestiyer-gomme-dolap/", "karavan-mobilyasi/", "projeler/",
                "projeler/pencere-onu-l-mutfak/", "projeler/aynali-citali-antre/", "nasil-calisiyoruz/",
                "bilgi-merkezi/", "bilgi-merkezi/mutfak-dolabi-yaptirmadan-once/", "bilgi-merkezi/kaba-olcu-nasil-alinir/",
                "iletisim/"]

SAYFA = {
    "": {
        "menu": "Ana Sayfa",
        "title": "Osmanoğlu Mobilya | Sincan, Ankara Özel Ölçü Mobilya",
        "meta": "Sincan Sanayi Sitesi'ndeki atölyemizde Ankara için özel ölçü mutfak dolabı, vestiyer, gardırop ve gömme dolap. Ustayla doğrudan konuşun: 0532 177 06 19.",
        "ust": "Sincan · Ankara — Özel ölçü mobilya",
        "h1": "Ölçüye yapılır,", "h1_em": "yerine oturur.",
        "giris": "Mutfak dolabı, vestiyer, gardırop ve gömme dolap; Sincan Sanayi Sitesi'ndeki atölyemizde, sizin duvarınızın ölçüsüyle.",
        "wa": "Merhaba, özel ölçü mobilya için bilgi almak istiyorum.",
    },
    "mutfak-dolabi/": {
        "menu": "Mutfak Dolabı",
        "title": "Mutfak Dolabı Sincan, Ankara | Osmanoğlu Mobilya",
        "meta": "Ankara'da özel ölçü mutfak dolabı: kulpsuz çekmece, tavana kadar dolap, pencere önü L tezgâh. Sincan'daki atölyemize mutfağınızın fotoğrafını gönderin.",
        "ust": "Mutfak dolabı · Ankara",
        "h1": "Mutfak,", "h1_em": "duvarın ölçüsüyle başlar.",
        "giris": "Hazır modül köşeye, pencereye, kolona takılır. Biz mutfağı sizin duvarınıza göre çizer, Sincan'daki atölyemizde yapar, yerine takarız.",
        "wa": "Merhaba, mutfak dolabı için bilgi almak istiyorum.",
        "tur": "Mutfak dolabı",
    },
    "vestiyer-gomme-dolap/": {
        "menu": "Vestiyer & Gömme Dolap",
        "title": "Vestiyer ve Gömme Dolap Ankara | Osmanoğlu Mobilya",
        "meta": "Ankara'da özel ölçü vestiyer, gardırop, gömme dolap ve TV ünitesi. Tavana kadar dolap, boy ayna, çıtalı panel. Alanın fotoğrafını WhatsApp'tan gönderin.",
        "ust": "Vestiyer · Gardırop · Gömme dolap",
        "h1": "Kapıdan girince", "h1_em": "ilk gördüğünüz yer.",
        "giris": "Antre, koridor ve yatak odası çoğu evde en dar, en dağınık alandır. Tavana kadar dolap, boy ayna ve askı panelini aynı ölçüde düşünürüz.",
        "wa": "Merhaba, vestiyer / dolap için bilgi almak istiyorum.",
        "tur": "Vestiyer / antre",
    },
    "karavan-mobilyasi/": {
        "menu": "Karavan",
        "title": "Ahşap Karavan ve Karavan Mobilyası | Osmanoğlu",
        "meta": "Ankara Sincan'da ahşap karavan ve karavan iç mobilyası. Müşterimizin yorumu: ayous ağacından, iki yıldır sağlam. Fikrinizi ve ölçülerinizi gönderin.",
        "ust": "Karavan · Sincan atölyesi",
        "h1": "Karavanınız da", "h1_em": "bir mobilya işidir.",
        "giris": "Hafif olmalı, sarsıntıya dayanmalı, her santimi kullanılmalı. Ahşap karavanı ve karavan iç mobilyasını atölyemizde, ölçünüze göre yapıyoruz.",
        "wa": "Merhaba, karavan için bir fikrim var, konuşmak istiyorum.",
        "tur": "Karavan",
    },
    "projeler/": {
        "menu": "Projeler",
        "title": "Projeler: Mutfak, Antre, Karavan | Osmanoğlu Mobilya",
        "meta": "Osmanoğlu Mobilya'nın Ankara'da yaptığı işler: pencere önü L mutfak, aynalı ve çıtalı antre, ahşap karavan. Fotoğraftan okunan detaylarıyla.",
        "ust": "Gerçek projeler",
        "h1": "Yaptığımız işler", "h1_em": "konuşsun.",
        "giris": "Her işin fotoğrafını, ne gördüğünüzü yazarak paylaşıyoruz. Sıfat değil, detay.",
        "wa": "Merhaba, projelerinizi gördüm, benzer bir iş için bilgi almak istiyorum.",
    },
    "projeler/pencere-onu-l-mutfak/": {
        "menu": "Pencere Önü L Mutfak",
        "title": "Pencere Önü L Mutfak Projesi | Osmanoğlu Mobilya",
        "meta": "Tahta kaplama kulpsuz çekmeceler, siyah yansıtan üst dolaplar, bakır damarlı koyu tezgâh ve alttan montajlı eviye: pencere önünden dönen L mutfak.",
        "ust": "Proje · Mutfak dolabı",
        "h1": "Pencere önü", "h1_em": "L mutfak.",
        "giris": "Pencerenin altından başlayıp köşeyi dönen bir mutfak. Tahta kaplama, siyah ve koyu taş aynı çizgide.",
        "wa": "Merhaba, pencere önü L mutfak projenizi gördüm, benzerini konuşmak istiyorum.",
        "tur": "Mutfak dolabı",
    },
    "projeler/aynali-citali-antre/": {
        "menu": "Aynalı ve Çıtalı Antre",
        "title": "Aynalı ve Çıtalı Antre Projesi | Osmanoğlu Mobilya",
        "meta": "Tavana kadar ahşap üst dolaplar, boy ayna ve dört askılı çıtalı panel: girişi tek parça gibi planlanan antre vestiyer projesi.",
        "ust": "Proje · Vestiyer",
        "h1": "Aynalı ve", "h1_em": "çıtalı antre.",
        "giris": "Kapının üstündeki boşluk dolaba, yan duvar aynaya ve askıya dönüştü.",
        "wa": "Merhaba, aynalı çıtalı antre projenizi gördüm, benzerini konuşmak istiyorum.",
        "tur": "Vestiyer / antre",
    },
    "nasil-calisiyoruz/": {
        "menu": "Nasıl Çalışıyoruz?",
        "title": "Nasıl Çalışıyoruz? Ölçüden Montaja | Osmanoğlu Mobilya",
        "meta": "Fotoğraf ve kaba ölçüyle başlar, görüşme, yerinde ölçü ve seçimle sürer, atölyede üretim ve evde montajla biter. Osmanoğlu Mobilya'da iş adımları.",
        "ust": "Süreç",
        "h1": "Siz anlatın,", "h1_em": "biz birlikte planlayalım.",
        "giris": "\"Sipariş verirsem ne olacak?\" sorusunun cevabı. Adım adım, kimin ne yaptığıyla.",
        "wa": "Merhaba, süreci okudum; işime başlamak için bilgi almak istiyorum.",
    },
    "bilgi-merkezi/": {
        "menu": "Bilgi Merkezi",
        "title": "Bilgi Merkezi: Mutfak ve Dolap Rehberi | Osmanoğlu",
        "meta": "Mutfak dolabı yaptırmadan önce sorulacak sorular ve kaba ölçünün nasıl alınacağı: Osmanoğlu Mobilya'dan kısa, uygulanabilir rehberler.",
        "ust": "Bilgi merkezi",
        "h1": "Yaptırmadan önce", "h1_em": "bilinmesi gerekenler.",
        "giris": "Teklif karşılaştırırken ve ustayla konuşurken işinize yarayacak kısa rehberler.",
        "wa": "Merhaba, bilgi merkezini okudum, bir sorum var.",
    },
    "bilgi-merkezi/mutfak-dolabi-yaptirmadan-once/": {
        "menu": "Mutfak Dolabı Yaptırmadan Önce 8 Soru",
        "title": "Mutfak Dolabı Yaptırmadan Önce Sorulacak 8 Soru",
        "meta": "Ölçü, gövde ve kapak, tezgâh, eviye, kulp, köşe dolabı, ankastre ölçüleri ve teslim: mutfak dolabı teklifini karşılaştırırken sormanız gereken 8 soru.",
        "ust": "Rehber · Mutfak",
        "h1": "Mutfak dolabı yaptırmadan önce", "h1_em": "sorulacak 8 soru.",
        "giris": "Fiyatlar ancak aynı şeyi kapsıyorsa karşılaştırılabilir. Bu sorular teklifleri aynı dile çevirir.",
        "wa": "Merhaba, mutfak dolabı rehberinizi okudum, mutfağım için konuşmak istiyorum.",
        "tur": "Mutfak dolabı",
    },
    "bilgi-merkezi/kaba-olcu-nasil-alinir/": {
        "menu": "Kaba Ölçü Nasıl Alınır?",
        "title": "Mutfak ve Dolap İçin Kaba Ölçü Nasıl Alınır?",
        "meta": "Bir şerit metre ve telefonla: duvar boyu, tavan yüksekliği, pencere, kolon ve tesisat yerleri. Teklif istemeden önce kaba ölçü almanın adımları.",
        "ust": "Rehber · Ölçü",
        "h1": "Kaba ölçü", "h1_em": "nasıl alınır?",
        "giris": "Net ölçüyü usta yerinde alır. Ama doğru bir kaba ölçü ve birkaç fotoğraf, ilk konuşmayı çok daha verimli yapar.",
        "wa": "Merhaba, kaba ölçüleri aldım, gönderiyorum.",
    },
    "iletisim/": {
        "menu": "İletişim",
        "title": "İletişim: Sincan Sanayi Sitesi | Osmanoğlu Mobilya",
        "meta": "Osmanoğlu Mobilya, Ahi Evran Mahallesi, Sincan Sanayi Sitesi, Sincan/Ankara. Telefon ve WhatsApp: 0532 177 06 19. Yol tarifi ve mesaj hazırlayıcı.",
        "ust": "İletişim",
        "h1": "Atölyemiz", "h1_em": "Sincan Sanayi Sitesi'nde.",
        "giris": "Telefonla arayın, WhatsApp'tan fotoğraf gönderin ya da atölyeye gelin. Gelmeden önce aramanızı rica ederiz; usta montajda olabilir.",
        "wa": "Merhaba, atölyenize gelmek istiyorum. Ne zaman uygunsunuz?",
    },
}

# ---------------------------------------------------------------- ana sayfa
GUVEN = [
    ("atolye", "Sincan Sanayi Sitesi", "Atölyemiz Ahi Evran Mahallesi'nde; gelip görebilirsiniz."),
    ("olcu", "30 yıllık tecrübe", "Kendi sözümüzle: kalite asla tesadüf değildir."),
    ("usta", "Ustayla doğrudan", "Aradığınızda işi yapacak kişiyle konuşursunuz."),
    ("yildiz", f"Google'da {PUAN} · {YORUM_SAYISI} yorum", f"{TARIH_OKUNUR} itibarıyla Haritalar'daki puan."),
]

IHTIYAC = [
    ("Yeni ev yapıyorum", "Taşınmadan önce mutfak, dolap ve antreyi birlikte planlayalım.", "Evim için konuşalım", "Merhaba, yeni evim için mutfak ve dolap konuşmak istiyorum."),
    ("Mutfağımı yeniliyorum", "Eski mutfağın fotoğrafını gönderin; neyin kalıp neyin değişeceğine birlikte bakalım.", "Mutfağımı göndereyim", "Merhaba, mutfağımı yenilemek istiyorum. Fotoğraflarını gönderiyorum."),
    ("Antre ve dolap", "Dar giriş, boş kalan niş, koridor: tavana kadar dolap ve vestiyer.", "Alanımı göndereyim", "Merhaba, antre / dolap için bilgi almak istiyorum."),
    ("Farklı bir fikrim var", "Karavan, merdiven altı, özel bir köşe… Önce fikrinizi anlatın.", "Fikrimi anlatayım", "Merhaba, aklımda özel bir iş var, anlatmak istiyorum."),
]

ILKELER_BASLIK = ("Ölçü önce,", "mobilya sonra.")
ILKELER_ALT = "Osmanoğlu Mobilya'da işe katalogdan değil, duvardan başlarız."
ILKELER = [
    ("Önce dinleriz.", "Mutfağı kim, nasıl kullanıyor; antrede neyin yeri olmalı? Çizim bundan sonra gelir."),
    ("Duvarı ölçeriz, kataloğu değil.", "Pencere, kolon, kombi, priz: hazır modülün takıldığı her şey ölçünün içine girer."),
    ("Seçimleri birlikte yaparız.", "Kapak, renk, tutamak, tezgâh. Fiyat ve teslim tarihi bu seçimlerle netleşir."),
    ("Sorularınızı baştan sorun.", "Fiyatın neyi kapsadığı, teslim tarihi, montaj: hepsini işe başlamadan konuşuruz."),
]

COZUMLER = [
    {"sayfa": "mutfak-dolabi/", "foto": "mutfak-gun-isigi", "no": "01", "baslik": "Mutfak Dolabı",
     "metin": "Pencere önü, kolon, kombi köşesi: mutfağın en zor yerleri ölçüyle çözülür.", "cta": "Mutfağım için konuşalım"},
    {"sayfa": "vestiyer-gomme-dolap/", "foto": "antre-aynali-citali-vestiyer", "no": "02", "baslik": "Vestiyer & Gömme Dolap",
     "metin": "Antrede ayna ve askı, koridorda tavana kadar dolap, yatak odasında gardırop.", "cta": "Alanım için konuşalım"},
    {"sayfa": "karavan-mobilyasi/", "foto": "ig-karavan-turuncu", "no": "03", "baslik": "Karavan & Ahşap İşler",
     "metin": "Ahşap kaplamalı karavan, içi ve dışıyla; kamelya ve veranda gibi ahşap yapılar.", "cta": "Fikrimi anlatayım"},
]
COZUM_EK = "Gardırop, TV ünitesi, konsol, banyo dolabı, merdiven, duvar paneli, sedir ve ahşap kamelya da yaptığımız işler arasında."

DETAY_BASLIK = ("İşçilik", "detayda belli olur.")
DETAY_ALT = "\"Kaliteliyiz\" demek yerine fotoğrafta görüleni yazıyoruz."
DETAY_TABLO = [
    ("Yerleşim", "L; pencere önünden dönen tezgâh"),
    ("Kapak", "Tahta kaplama görünümlü, kulpsuz çekmeceler"),
    ("Tutamak", "Çekmeceler arasında yatay kanal"),
    ("Üst dolap", "Siyah, yansıtan kapaklar"),
    ("Tezgâh", "Koyu zemin, bakır renkli damar"),
    ("Eviye", "Tezgâh altından montajlı, inox"),
]
DETAY_KARELER = [
    ("mutfak-tezgah-kose", "Köşe dönüşü", "Neden önemli? L mutfakta en çok yük alan yer tezgâhın döndüğü köşedir."),
    ("mutfak-gun-isigi", "Kapak hizası", "Neden önemli? Çekmece araları baştan sona aynıysa gövde ve menteşe yerindedir."),
    ("antre-aynali-citali-vestiyer", "Tavana kadar", "Neden önemli? Kapının üstündeki boşluk, mevsimlik eşya için en kolay kazanılan yerdir."),
]

ADIMLAR = [
    ("Bize ulaşırsınız", "WhatsApp'tan alanın fotoğrafını ve aklınızdaki kaba ölçüyü gönderirsiniz ya da ararsınız.", "Siz"),
    ("İhtiyacı konuşuruz", "Telefonda ya da Sincan'daki atölyemizde: ne istiyorsunuz, nasıl kullanacaksınız?", "Birlikte"),
    ("Ölçü ve seçim", "Yerinde net ölçü alınır; kapak, renk ve tezgâh birlikte seçilir. Fiyat ve teslim tarihi bu seçimlerle netleşir.", "Birlikte"),
    ("Atölyede üretim", "İş, Sincan Sanayi Sitesi'ndeki atölyemizde hazırlanır.", "Biz"),
    ("Montaj ve teslim", "Evinizde yerine takılır; kapak ayarları yapılır.", "Biz"),
]

SSS = {
    "": [
        ("Hangi işleri yapıyorsunuz?", "Mutfak dolabı, vestiyer, gardırop, gömme dolap, TV ünitesi ve konsol gibi özel ölçü mobilya. Karavan gibi alışılmadık işleri de konuşuyoruz."),
        ("Nerede hizmet veriyorsunuz?", "Atölyemiz Sincan Sanayi Sitesi'nde. Ankara içindeki işler için yazın; Sincan, Etimesgut ve Eryaman bize en yakın bölgeler."),
        ("Fiyat nasıl belirleniyor?", "Ölçü, kapak ve gövde malzemesi, tezgâh ve aksesuarlara göre. Fotoğraf ve kaba ölçüyle konuşmaya başlarız; net fiyatı ölçü ve seçimlerden sonra veririz."),
        ("Fotoğraf göndererek bilgi alabilir miyim?", "Evet, en kolay başlangıç bu. Alanı karşıdan ve köşelerden çekin, kaba ölçüyü yazın; kaba ölçünün nasıl alınacağını bilgi merkezinde anlattık."),
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
        ("Ayna ve askı paneli birlikte mi yapılıyor?", "Projelerdeki antrede üst dolap, boy ayna ve çıtalı askı paneli tek parça gibi planlandı. Sizin girişinize göre bu düzen değişebilir."),
        ("TV ünitesi de yapıyor musunuz?", "Evet. Müşterilerimizin Haritalar'da paylaştığı işler arasında TV ünitesi ve konsol da var."),
    ],
    "karavan-mobilyasi/": [
        ("Karavanın tamamını mı yapıyorsunuz, yalnız iç mobilyayı mı?", "Instagram'da paylaştığımız karavanlarda dış ahşap kaplama ve iç düzen birlikte yapıldı. Sizin aracınızda ne yapılabileceğini fikrinizi ve ölçüleri görünce konuşalım."),
        ("Ayous ağacı neden?", "Ayous (obeche) düşük yoğunluklu, hafif bir Afrika ağacıdır; karavanda her kilo önemlidir. Malzemeyi işinize göre birlikte seçeriz."),
        ("Ruhsat ve muayene işini siz mi yapıyorsunuz?", "Hayır, bu konuda söz vermiyoruz. Karavanın trafiğe çıkışı için gereken belge ve onayları yaptırmadan önce ayrıca araştırmanızı öneririz."),
    ],
    "nasil-calisiyoruz/": [
        ("Ölçü nasıl alınıyor?", "Önce sizin gönderdiğiniz fotoğraf ve kaba ölçüyle konuşuruz. Net ölçü, iş netleşince yerinde alınır."),
        ("Montaj dahil mi?", "Montajın kapsamını, fiyatı konuşurken açıkça yazarız; söküm, tezgâh ve beyaz eşya yerleşimi gibi kalemleri birlikte netleştiririz."),
        ("Teslim süresi ne kadar?", "Ölçü, malzeme ve iş yoğunluğuna göre değişir; seçimler netleşince tarih veririz."),
    ],
    "iletisim/": [
        ("Çalışma saatleriniz nedir?", f"Haftalık saatlerimizi henüz burada yayınlamadık. {TARIH_OKUNUR} Salı günü Haritalar'da kapanış 18:30 görünüyordu; gelmeden önce arayın."),
        ("WhatsApp'tan mı aramalıyım, telefonla mı?", "Fotoğraf göndereceksiniz WhatsApp daha pratik; hızlı bir soru için arayın."),
    ],
}

# ---------------------------------------------------------------- hizmet sayfaları
MUTFAK = {
    "giris_baslik": ("Hazır modül", "köşeye takılır."),
    "giris_metin": [
        "Mutfak, evin en çok ölçü sorunu olan odasıdır: pencere tezgâhın tam ortasına denk gelir, kolon dolabı böler, kombi bir köşeyi kaplar.",
        "Biz mutfağı bu engellerle birlikte çizeriz. Çekmece sırası, tezgâh hattı ve üst dolaplar aynı çizgiye oturur; boşta kalan bir \"dolgu parçası\" olmaz.",
    ],
    "secim_baslik": ("Birlikte karar", "verdiğimiz şeyler."),
    "secimler": [
        ("Yerleşim", "Düz, L ya da U; pencere, kolon ve kombi nerede. Ölçü bu kararın üstüne kurulur."),
        ("Kapak", "Renk, yüzey ve tutamak: kulp mu, kulpsuz kanal mı. Projedeki mutfakta tahta kaplama görünümlü kulpsuz çekmeceler var."),
        ("Üst dolap", "Tavana kadar mı, açık raf mı, camlı mı. Projedeki mutfakta üst dolaplar siyah ve yansıtan kapaklı."),
        ("Tezgâh ve tezgâh arası", "Rengi, damarı ve eviye tipi kapaklarla birlikte seçilir."),
        ("İç düzen", "Çekmece sayısı, kiler, çöp ve deterjan yeri, köşe çözümü."),
        ("Ankastre", "Fırın, ocak, bulaşık makinesi ve buzdolabının ölçüleri baştan bilinmeli."),
    ],
    "ilce_baslik": ("Ankara'nın", "neresindeyiz?"),
    "ilceler": "Atölyemiz Sincan Sanayi Sitesi'nde. Sincan, Etimesgut, Eryaman ve Yenimahalle'ye yakınız; Ankara içindeki diğer ilçeler için de yazın, işin kapsamına göre konuşalım.",
    "ilce_liste": ["Sincan", "Etimesgut", "Eryaman", "Yenimahalle", "Ankara geneli"],
}

VESTIYER = {
    "giris_baslik": ("Evin en dar yeri,", "en çok iş gören yeri."),
    "giris_metin": [
        "Mont, çanta, ayakkabı, anahtar: girişte her gün bırakılan şeylerin yeri yoksa koridora yayılır.",
        "Antreyi, koridoru ve yatak odasını tavandan zemine düşünürüz. Kapının üstü dolap olur, yan duvar ayna ve askı olur.",
    ],
    "detay": [
        ("Tavana kadar üst dolap", "Kapının üstündeki boşluk boşa gitmiyor; mevsimlik eşya yukarıda."),
        ("Boy ayna", "Dar koridoru geniş gösterir; çıkarken son bakış."),
        ("Çıtalı panel ve askılar", "Dikey ahşap çıtalar, dört askı. Mont ve çanta kapının yanında kalır."),
    ],
    "turler": [
        ("Vestiyer & antre", "Ayna, askı paneli, ayakkabılık ve üst dolap tek düzen içinde."),
        ("Gömme dolap", "Nişe ya da duvar boyuna oturan, tavana kadar dolap."),
        ("Gardırop", "Yatak odası için düz ya da köşeyi dönen gardırop."),
        ("TV ünitesi & konsol", "Salon duvarı için ünite, raf ve konsol."),
    ],
    "diger_baslik": ("Müşterilerimizin", "paylaştığı işler."),
    "diger_giris": "Aşağıdaki işlerin fotoğraflarını müşterilerimiz Google Haritalar yorumlarında paylaştı. Fotoğraflar onlara ait olduğu için burada göstermiyoruz; Haritalar'da görebilirsiniz.",
    "diger": [
        "Koridor boyunca beyaz, tavana kadar gömme dolap",
        "Köşeyi dönen iki renkli gardırop",
        "Beyaz boy dolaplar ve TV ünitesi",
        "Çıtalı ön yüzlü konsol",
    ],
}

KARAVAN = {
    "yorum_baslik": ("Bu sayfayı", "bir yorum yüzünden açtık."),
    "bilinen_baslik": ("O karavan hakkında", "bildiklerimiz."),
    "bilinen": [
        ("Malzeme", "Ayous ağacı. Hafif bir ağaç; karavanda taşınan her kilo yakıta ve çekişe yansır."),
        ("Yapı", "Müşterimizin kendi ifadesiyle: demir karkas olmadan yapıldı."),
        ("Kullanım", "Yorum yazıldığında iki yıldır kullanılıyordu."),
    ],
    "getir_baslik": ("Konuşmaya", "gelirken."),
    "getir": [
        "Çekecek aracınız ve çekme kapasitesi",
        "Aklınızdaki dış ölçü, kaç kişi kalacağı",
        "İçeride olmazsa olmazlar: yatak, mutfak köşesi, dolap",
        "Beğendiğiniz karavan fotoğrafları",
    ],
    "ig_baslik": ("Instagram'da paylaştığımız", "karavanlar."),
    "ig_metin": "Römork üzerinde, dışı yatay ahşap kaplamalı, siyah çerçeveli pencereli karavanlar. İçeride ahşap kaplama duvarlar, asma kata çıkan merdiven, ışıklı oturma köşesi ve dolaplar.",
}

# ---------------------------------------------------------------- projeler
PROJELER = {
    "projeler/pencere-onu-l-mutfak/": {
        "kapak": "mutfak-pencere-l-tezgah", "kategori": "Mutfak dolabı", "konum": "Ankara",
        "ozet": "Pencere önünden dönen, kulpsuz çekmeceli L mutfak.",
        "kareler": ["mutfak-pencere-l-tezgah", "mutfak-eviye-cekmeceler", "mutfak-tezgah-kose", "mutfak-gun-isigi"],
        "tablo": DETAY_TABLO,
        "metin": [
            "Bu mutfakta tezgâh pencerenin önünden başlayıp köşeyi dönüyor. Pencerenin altı boş bırakılmamış; çekmece sırası pencere hizasında da devam ediyor.",
            "Alt dolapların hepsi çekmece. Kulp yok: her çekmecenin üstünde yatay bir tutamak kanalı var ve kanallar baştan sona aynı çizgide ilerliyor.",
            "Üst dolaplar siyah ve yansıtan kapaklı; tezgâh arası siyah, damarlı bir yüzey. Tahta kaplamanın sıcaklığı, siyahla dengelenmiş.",
        ],
    },
    "projeler/aynali-citali-antre/": {
        "kapak": "antre-aynali-citali-vestiyer", "kategori": "Vestiyer & antre", "konum": "Ankara",
        "ozet": "Tavana kadar üst dolap, boy ayna ve çıtalı askı paneli.",
        "kareler": ["antre-aynali-citali-vestiyer"],
        "tablo": [
            ("Üst dolap", "Tavana kadar, ahşap kaplama, ince siyah tutamaklı"),
            ("Ayna", "Zeminden üst dolaba kadar boy ayna"),
            ("Askı paneli", "Dikey ahşap çıtalar, dört askı"),
            ("Yerleşim", "Kapı ve koridor geçişinin çevresi tek düzen"),
        ],
        "metin": [
            "Girişte üç iş tek düzende çözülmüş: yukarıda depolama, ortada ayna, yanda askı.",
            "Üst dolaplar tavana kadar çıkıyor ve geçişin üstünü boydan boya kaplıyor. Aynanın yansıması dar koridoru olduğundan geniş gösteriyor.",
            "Askı paneli dikey çıtalarla yapılmış; askılar çıtaların arasına yerleşiyor. Aynı ahşap tonu üst dolapla paneli birbirine bağlıyor.",
        ],
    },
}

# ---------------------------------------------------------------- nasıl çalışıyoruz
HAZIRLIK = [
    ("Fotoğraflar", "Alanı karşıdan, iki köşeden ve tavanla birlikte çekin. Pencere, kolon, kombi ve prizler görünsün."),
    ("Kaba ölçü", "Duvar boyları ve tavan yüksekliği. Nasıl alınacağını adım adım anlattık."),
    ("Beğendikleriniz", "Kaydettiğiniz fotoğraflar, renkler, kapak örnekleri."),
    ("Ankastre ve eşya", "Mutfakta fırın, ocak, buzdolabı; dolapta neyin duracağı."),
]

# ---------------------------------------------------------------- bilgi merkezi
MAKALELER = {
    "bilgi-merkezi/mutfak-dolabi-yaptirmadan-once/": {
        "ozet": "Teklifleri aynı dile çeviren sorular: ölçü, malzeme, tezgâh, eviye, kulp, köşe, ankastre, teslim.",
        "okuma": "4 dk",
        "bolumler": [
            ("1. Ölçüyü kim, ne zaman alacak?", "Fiyat kaba ölçüyle verilir, iş net ölçüyle yapılır. Net ölçünün yerinde alınıp alınmayacağını ve fiyatın net ölçüden sonra değişip değişmeyeceğini sorun."),
            ("2. Gövde ve kapak hangi malzemeden?", "Gövde ile kapak çoğu zaman farklı malzemedir. Teklifte ikisinin ayrı ayrı yazılmasını isteyin; \"MDF\" ya da \"lake\" tek başına yeterli bir tarif değildir, kalınlığı ve yüzeyi de sorun."),
            ("3. Tezgâhı kim getirecek, kim takacak?", "Tezgâh çoğu zaman ayrı bir kalemdir. Fiyata dahil mi, ölçüsünü kim alacak, takılırken eviye ve ocak deliklerini kim açacak?"),
            ("4. Eviye tezgâhın altına mı, üstüne mi?", "Alttan montajlı eviye temiz görünür, silmesi kolaydır ama her tezgâha uymaz. Eviye tipini tezgâhla birlikte seçin."),
            ("5. Kulp mu, kulpsuz mu?", "Kulpsuz kapak (tutamak kanalı ya da bas-aç) sade görünür; kulp tutması kolaydır. Mutfağı kimin, nasıl kullandığı bu kararı belirler."),
            ("6. Köşe dolabı nasıl kullanılacak?", "L ve U mutfakta köşe en zor yerdir. Döner raf, derin çekmece ya da kör köşe: hangisinin yapılacağını çizimde görün."),
            ("7. Ankastre ölçüleri belli mi?", "Fırın, ocak, bulaşık makinesi ve buzdolabının modeli baştan bilinmezse dolap ölçüsü sonradan değişebilir. Alacağınız cihazları ya da ölçülerini önceden paylaşın."),
            ("8. Söküm, montaj ve teslim tarihi yazılı mı?", "Eski mutfağın sökümü, montaj, son temizlik ve teslim tarihi: hangisinin fiyata dahil olduğunu konuşup yazıya geçirin."),
        ],
        "son": "Bu soruları bize de sorun. Fotoğraf ve kaba ölçüyle başlayalım; cevapları seçimlerinizle birlikte netleştirelim.",
    },
    "bilgi-merkezi/kaba-olcu-nasil-alinir/": {
        "ozet": "Bir şerit metre ve telefonla, on beş dakikada: duvar boyu, tavan, pencere, kolon ve tesisat.",
        "okuma": "3 dk",
        "bolumler": [
            ("Gerekenler", "Şerit metre (en az 5 m), kâğıt-kalem ya da telefonun not uygulaması. Bir kişi daha olursa ölçü kolaylaşır."),
            ("1. Duvar boylarını ölçün", "Her duvarı köşeden köşeye, zemine yakın bir yükseklikte ölçün. L ya da U mutfakta her duvarı ayrı yazın ve köşeleri işaretleyin."),
            ("2. Tavan yüksekliğini ölçün", "Zeminden tavana, en az iki yerden. Tavana kadar dolap düşünüyorsanız bu ölçü önemlidir; tavan her yerde aynı olmayabilir."),
            ("3. Pencere ve kapıları işaretleyin", "Köşeden pencereye mesafe, pencerenin genişliği, pencere altının zeminden yüksekliği. Kapı için de aynısı."),
            ("4. Engelleri yazın", "Kolon, kombi, doğalgaz borusu, su ve gider çıkışları, prizler. Köşeden uzaklıklarını ve yerden yüksekliklerini not edin."),
            ("5. Fotoğrafları çekin", "Karşıdan geniş bir kare, iki köşeden birer kare, engellerin yakın planı. Metreyi duvara tutup çekmek ölçüyü fotoğrafta da gösterir."),
            ("Unutmayın", "Bu bir kaba ölçüdür; konuşmayı başlatmak içindir. Üretimden önce net ölçü yerinde alınır."),
        ],
        "son": "Ölçüleri ve fotoğrafları WhatsApp'tan gönderin; birlikte bakalım.",
    },
}

ILETISIM_TABLO = [
    ("Telefon", "0532 177 06 19", "tel"),
    ("WhatsApp", "0532 177 06 19", "wa"),
    ("Adres", "Ahi Evran Mahallesi, Sincan Sanayi Sitesi, 06000 Sincan / Ankara", ""),
    ("Çalışma saatleri", "Gelmeden önce arayın", ""),
]
