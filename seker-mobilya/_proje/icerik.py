"""Şeker Mobilya — nihai metinler ve fotoğraf envanteri (tek kaynak).

uret.py bu dosyadan siteyi, `--metin` ile modul-2-icerik-seo.md'nin 12. bölümünü üretir.
Kural: yalnız görülen / doğrulanan yazılır. Garanti, ücretsiz keşif, süre, fiyat, yıl yok.
"""

TARIH = "2026-10-20"
TARIH_OKUNUR = "20 Ekim 2026"
PUAN, YORUM = "4,9", 93

# ---------------------------------------------------------------- fotoğraflar
# dosya: (alt metin, tür, kapak yazısı var mı, "işe başladığımız gün" karesi mi)
# Kaynak: @sekermobilya Instagram paylaşımları (ekran kaydı, 348×428 px)
FOTO = {
    "tv-unitesi-mermer-panel-led-raf": ("Mermer görünümlü panelli TV duvarı; iki yanda raf altları ışıklı, çerçeveli kapaklı açık gri dolaplar", "tv", False, False),
    "tv-duvari-ceviz-gri-ust-dolap": ("Ceviz kaplama TV duvarı, üstte tavana kadar gri kapaklar, yanlarda ışıklı cam vitrin", "tv", False, False),
    "tv-unitesi-led-cerceve": ("Krem lake TV ünitesi; TV panelinin çevresinde ve tavan bandında sıcak ışık, yanlarda çıtalı panel", "tv", False, False),
    "duvar-unitesi-led-citali": ("Çıtalı panel duvar, altı ışıklı asma alt modül ve iki yanda füme cam vitrin", "tv", False, False),
    "tv-unitesi-salon-avize": ("Salonda ışık çerçeveli TV ünitesi ve çıtalı panel; Reels kapağı", "tv", True, False),
    "tv-unitesi-oncesi-bos-oda": ("Parke zemini sökülmüş, boş salon; TV ünitesi videosunun ilk karesi", "tv", True, True),
    "banyo-oval-led-ayna-boy-dolap": ("Arkası ışıklı oval ayna, açık raflar, gömme lavabolu tezgâh ve çıtalı boy dolap", "banyo", False, False),
    "banyo-boy-dolap-asma-klozet": ("Arkası ışıklı ayna, asma klozet, beyaz lavabo dolabı ve tavana kadar boy dolap", "banyo", False, False),
    "banyo-makine-ustu-boy-dolap": ("Çamaşır makinesinin üstünde ve yanında boy dolaplar, yanında siyah profilli duşakabin", "banyo", False, False),
    "banyo-lavabo-dolabi-kucuk": ("Küçük banyoda krem lavabo dolabı, yuvarlak ayna ve dalgalı desenli fayans", "banyo", False, False),
    "banyo-tezgah-ustu-lavabo-antrasit": ("Tezgâh üstü lavabo, antrasit kapaklı alt dolap ve aynalı üst dolap", "banyo", False, False),
    "banyo-asma-klozet-antrasit-dolap": ("Tezgâh üstü lavabolu antrasit dolap, aynalı üst dolap ve asma klozet", "banyo", False, False),
    "banyo-ceviz-dolap-aynali-dolap": ("Ceviz kapaklı lavabo dolabı, aynalı üst dolap ve yanında ceviz boy dolap", "banyo", False, False),
    "banyo-ceviz-lavabo-dolabi-dar": ("Dar banyoda ceviz kapaklı lavabo dolabı ve üst dolap", "banyo", False, False),
    "banyo-cekmeceli-lavabo-dolabi": ("Küçük banyo için çekmeceli lavabo dolabı, çekmece açık; Reels kapağı", "banyo", True, False),
    "banyo-makine-dolabi-dusakabin": ("Çamaşır makinesi yeri, boy dolap ve duşakabin; 'Baştan Sona Yepyeni Banyo' Reels kapağı", "banyo", True, False),
    "banyo-bitmis-hali": ("Boy dolaplar, köşe duşakabin ve beyaz lavabo dolabı; 'Bitmiş hali sonda' Reels kapağı", "banyo", True, False),
    "banyo-led-ayna-boy-dolap-2": ("Arkası ışıklı ayna, asma klozet ve beyaz boy dolap; Reels kapağı", "banyo", True, False),
    "banyo-fonksiyonel-tasarim": ("Oval ışıklı ayna ve açık gri banyo dolabı; '2026 Modern Fonksiyonel Banyo Tasarımı' Reels kapağı", "banyo", True, False),
    "banyo-inox-renk-kapak": ("İnox renk kapaklı banyo dolabı ve tezgâh üstü lavabo; Reels kapağı", "banyo", True, False),
    "banyo-oncesi-pvc-duvar": ("Duvarları sökülmüş eski banyo; 'PVC plastik duvar ve hazır dolap yeterli' yazılı video karesi", "banyo", True, True),
    "mutfak-cekmece-sistemi": ("Mutfakta açık çekmeceler, eviye dolabı ve boy dolaplar", "mutfak", False, False),
    "mutfak-tezgah-cam-kapak": ("Beyaz tezgâh, açık gri alt dolaplar ve füme cam kapaklı boy dolap", "mutfak", False, False),
    "mutfak-cekmeceler-acik": ("Tavana kadar dolaplı dar mutfakta yan yana açılmış çekmeceler", "mutfak", False, False),
    "mutfak-kiler-raf-boy-dolap": ("Boy dolabın içinde çekme raflı kiler", "mutfak", False, False),
    "mutfak-beyaz-tezgah-pencere": ("Pencere önünde uzun beyaz tezgâh ve gri dolaplar; 'Baştan sona yepyeni mutfak' Reels kapağı", "mutfak", True, False),
    "giyinme-odasi-cam-kapak-led": ("Köşeyi dönen, cam kapaklı ve içi ışıklı giyinme odası", "giyinme", False, False),
    "koridor-gomme-dolap": ("Koridorda tavana kadar düz kapaklı gömme dolap", "giyinme", False, False),
    "yatak-odasi-makyaj-masasi-dolap": ("Boy dolabın yanına yerleştirilmiş çekmeceli makyaj masası", "giyinme", False, False),
    "giyinme-odasi-duz-kapak": ("Kulpsuz görünümlü düz kapaklı giyinme odası; Reels kapağı", "giyinme", True, False),
    "genc-odasi-gardirop-calisma": ("Gri boy gardırop ve çalışma köşesi; 'Çok Renkli Kız Çocuk Odası' Reels kapağı", "genc", True, False),
    "genc-odasi-kemerli-nis": ("Kemerli, ışıklı nişli lake gardırop; 'Çok özel, lake genç kız odası' Reels kapağı", "genc", True, False),
    "genc-odasi-ranza-cekmece": ("Basamakları çekmeceli ranza; 'Bir kız bir erkek tek oda' Reels kapağı", "genc", True, False),
    "genc-odasi-lila-dolap": ("Lila lake dolap ve yatak; 'Yavru yataklı genç kız odası' Reels kapağı", "genc", True, False),
    "antre-ceviz-citali-duvar-ayna": ("Antrede ceviz çıtalı duvar, yarım ay ayna ve asma beyaz konsol", "antre", False, False),
    "antre-konsol-yarim-ay-ayna": ("Çift kanatlı kapının yanında yarım ay aynalı asma konsol", "antre", False, False),
    "antre-cift-kanat-kapi-konsol": ("Antrede çift kanatlı camlı kapı, yanında ayna ve asma konsol", "antre", False, False),
    "portmanto-yuvarlak-ayna-citali": ("Çıtalı panel önünde yuvarlak aynalı, çekmeceli portmanto", "antre", False, False),
    "portmanto-kemerli-ayna": ("Kemerli koridorda çıtalı panelli, yarım ay aynalı portmanto", "antre", False, False),
    "portmanto-kapi-lake-boya": ("Lake boyalı panel kapı ve yanında portmanto; 'After' etiketli Reels kapağı", "antre", True, False),
    "gomme-portmanto-kitaplik": ("Gömme alana yerleştirilmiş portmanto ve kitaplık; Reels kapağı", "antre", True, False),
    "antre-ceviz-citali-duvar": ("Ceviz çıtalı antre duvarı; 'Modern Antre Duvar Dekorasyonu' Reels kapağı", "antre", True, False),
    "portmanto-oncesi": ("Kapısı sökülmüş, molozlu antre; 'Beyaz bir portmanto yeterli' yazılı video karesi", "antre", True, True),
    "yatak-odasi-citali-duvar-led": ("Yatak odasında tavana kadar çıtalı duvar paneli, tavan bandında ışık, arkası ışıklı yuvarlak ayna ve asma komodin", "duvar", False, False),
    "lake-petek-kapama-beyaz": ("Beyaz lake petek kapama; Reels kapağı", "duvar", True, False),
    "lake-petek-kapama-duvar": ("Klima altında lake petek kapama ve duvar dekorasyonu; Reels kapağı", "duvar", True, False),
    "antre-konsol-dekoratif-duvar": ("Desenli duvar önünde siyah konsol; 'Modern Ev Dekorasyon' Reels kapağı", "duvar", True, False),
}
W, H = 348, 428

TURLER = [
    ("tv", "TV ünitesi"), ("banyo", "Banyo"), ("mutfak", "Mutfak"), ("giyinme", "Giyinme odası"),
    ("genc", "Genç odası"), ("antre", "Portmanto ve antre"), ("duvar", "Duvar ve petek"),
]

# Fotoğrafta görülen detaylar: (x %, y %, ad)
DETAY = {
    "yatak-odasi-citali-duvar-led": [(70, 30, "Tavana kadar çıtalı duvar paneli"), (60, 4, "Tavan bandında gizli ışık"), (14, 37, "Arkası ışıklı yuvarlak ayna"), (60, 63, "Duvara asılı komodin")],
    "tv-unitesi-mermer-panel-led-raf": [(52, 16, "Mermer görünümlü panel"), (12, 47, "Raf altı ışık"), (52, 54, "Çıtalı TV paneli"), (88, 66, "Çerçeveli lake kapak")],
    "banyo-oval-led-ayna-boy-dolap": [(49, 30, "Arkası ışıklı oval ayna"), (20, 40, "Açık raf kutuları"), (53, 71, "Gömme lavabolu tezgâh"), (76, 22, "Çıtalı boy dolap")],
    "giyinme-odasi-cam-kapak-led": [(30, 45, "Cam kapak"), (64, 35, "Dolap içi ışık"), (88, 55, "Köşeyi dönen modül")],
    "antre-ceviz-citali-duvar-ayna": [(70, 30, "Ceviz çıtalı duvar"), (22, 45, "Yarım ay ayna"), (62, 62, "Asma konsol")],
    "mutfak-cekmece-sistemi": [(60, 62, "Tam açılan çekmeceler"), (25, 48, "Eviye dolabı"), (15, 15, "Tavana kadar üst dolap")],
}

SAYFA_SIRASI = ["tv-unitesi", "banyo", "mutfak", "giyinme-odasi-gardirop", "portmanto", "duvar-paneli-petek-kapama"]

# ---------------------------------------------------------------- ana sayfa
ANA = {
    "title": "Şeker Mobilya | Bahçelievler Özel Ölçü Mobilya ve Dekorasyon",
    "meta": "Yenibosna'dan TV ünitesi, giyinme odası, portmanto, banyo ve mutfak dolabı; çıtalı duvar paneli, gizli LED ve lake boya. Odanın fotoğrafını gönderin.",
    "h1": "Ölçüye özel mobilya, duvar ve ışık: odanın son hâli tek ekipten.",
    "giris": "TV ünitesinden giyinme odasına, banyo dolabından petek kapamaya kadar; dolabı, çıtalı duvarı, gizli ışığı ve lake boyayı aynı ekip yapıyor. Bahçelievler Yenibosna'dayız.",
    "kapak": ["tv-unitesi-mermer-panel-led-raf", "banyo-oval-led-ayna-boy-dolap", "giyinme-odasi-cam-kapak-led"],
    "imza_h2": "Bir odada neleri birlikte yapıyoruz",
    "imza_p": "Instagram'daki işlerimize bakınca aynı şeyler tekrar ediyor: ölçüye oturan dolap, çıtalı panel, gizli ışık ve ayna. Hepsi birbirini tutsun diye aynı ekipten çıkıyor. Bu yatak odasında görülenler:",
    "imza_foto": "yatak-odasi-citali-duvar-led",
    "odalar_h2": "Hangi oda için yazıyorsunuz?",
    "baslangic_h2": "İşe başladığımız gün",
    "baslangic_p": "Videolarımızın çoğu boş odadan başlar: sökülmüş duvar, kapısı çıkarılmış antre, parkesi kalkmış salon. Bunlar o videoların ilk kareleri; bitmiş hâlleri Instagram'da.",
    "baslangic": ["banyo-oncesi-pvc-duvar", "tv-unitesi-oncesi-bos-oda", "portmanto-oncesi"],
    "surec_h2": "Fotoğraftan teslime",
    "surec": [
        ("Fotoğraf ve kaba ölçü", "Odanın birkaç fotoğrafını ve aklınızdaki işi WhatsApp'tan gönderin. Kaba ölçü yeterli; metre yoksa da yazın."),
        ("Ölçü", "Kesin ölçüyü yerinde alıyoruz; kolon, tesisat, petek ve priz yerleri o gün netleşir."),
        ("Renk ve malzeme", "Lake rengi, kaplama, kulp, ışığın yeri ve rengi birlikte seçilir."),
        ("İmalat", "Parçalar ölçünüze göre üretilir."),
        ("Montaj ve teslim", "Yerinde montaj yapılır, ışıklar bağlanır ve teslim edilir."),
    ],
    "yorum_p": "Google Haritalar'da {puan} puan · {yorum} değerlendirme ({tarih} itibarıyla). Yorumları kendiniz okuyun.",
}

# ---------------------------------------------------------------- hizmet sayfaları
SAYFA = {
    "tv-unitesi": {
        "ozet": "LED'li raflar, mermer görünümlü panel, ceviz kaplama; duvarın tamamı tek tasarım.",
        "ad": "TV ünitesi", "menu": "TV ünitesi", "tur": "tv", "mesaj": "TV ünitesi / duvar ünitesi",
        "title": "TV Ünitesi ve Duvar Ünitesi | Şeker Mobilya Bahçelievler",
        "meta": "Ölçüye özel TV ünitesi ve duvar ünitesi: LED'li raflar, mermer görünümlü panel, ceviz kaplama, çıtalı panel. Bahçelievler Yenibosna, Şeker Mobilya.",
        "h1": "TV ünitesi ve duvar ünitesi",
        "giris": "TV duvarı salonun yüzü. Rafları, kapakları, paneli ve ışığı duvarın ölçüsüne göre tek parça gibi kuruyoruz; kablo görünmesin, ışık doğrudan göze gelmesin.",
        "kapak": ["tv-unitesi-mermer-panel-led-raf", "tv-duvari-ceviz-gri-ust-dolap", "tv-unitesi-led-cerceve"],
        "detay_foto": "tv-unitesi-mermer-panel-led-raf",
        "bolumler": [
            ("Duvarın tamamı, tek tasarım", "Yalnız TV sehpası değil; iki yandaki raflar, üstteki kapaklar ve TV'nin arkasındaki panel birlikte tasarlanır. Böylece duvar baştan sona aynı çizgide biter. Tavana kadar çıkan üst kapaklar hem depolama hem de daha yüksek bir tavan hissi verir.", ["tv-duvari-ceviz-gri-ust-dolap", "duvar-unitesi-led-citali"]),
            ("Işık: raf altı, panel çevresi, tavan bandı", "Işık şeridini rafın altına, TV panelinin çevresine ya da tavan bandına gizliyoruz. Şerit görünmez, yalnız yüzeye vuran sıcak ışık görünür. Işığın rengi ve nereye bağlanacağı ölçü günü konuşulur.", ["tv-unitesi-led-cerceve"]),
            ("Yüzey seçenekleri", "İşlerimizde en çok açık gri ve krem lake, ceviz kaplama, mermer görünümlü panel ve çıtalı panel kullanıyoruz. Seçimi örnekleri görerek, odanın zemini ve ışığıyla birlikte yapıyoruz.", []),
        ],
        "sss": [
            ("TV ünitesi fiyatı ne kadar?", "Fiyat duvarın ölçüsüne, kapak ve panel yüzeyine, ışık miktarına göre değişir. Duvarın fotoğrafını ve kaba ölçüsünü WhatsApp'tan gönderin; ona göre konuşalım."),
            ("Kablolar görünür mü?", "TV paneli ve dolaplar kabloların geçeceği yer düşünülerek yapılır; prizlerin ve uydu/internet kablosunun yeri ölçü günü netleşir."),
            ("Sadece raflı bir TV ünitesi de yapıyor musunuz?", "Evet. Duvarın tamamı şart değil; tek bir alt modül ya da yalnız raf da yapılır. Ne istediğinizi yazmanız yeterli."),
        ],
        "ilgili": ["duvar-paneli-petek-kapama", "giyinme-odasi-gardirop"],
    },
    "banyo": {
        "ozet": "Lavabo dolabı, makine yerli boy dolap, ışıklı ayna; istenirse banyonun tamamı.",
        "ad": "Banyo dolabı ve banyo yenileme", "menu": "Banyo", "tur": "banyo", "mesaj": "Banyo dolabı / banyo yenileme",
        "title": "Banyo Dolabı ve Banyo Yenileme | Şeker Mobilya Bahçelievler",
        "meta": "Ölçüye özel banyo dolabı, boy dolap, çamaşır makinesi dolabı ve LED ayna; banyoyu baştan sona yeniliyoruz. Bahçelievler Yenibosna, Şeker Mobilya.",
        "h1": "Banyo dolabı ve banyoyu baştan yenileme",
        "giris": "Küçük bir lavabo dolabından makine yerli boy dolaba, ışıklı aynadan baştan sona yenilenen banyoya kadar. Banyonun her santimini ölçüsüne göre kullanıyoruz.",
        "kapak": ["banyo-oval-led-ayna-boy-dolap", "banyo-boy-dolap-asma-klozet", "banyo-ceviz-dolap-aynali-dolap"],
        "detay_foto": "banyo-oval-led-ayna-boy-dolap",
        "bolumler": [
            ("Çamaşır makinesi için boy dolap", "Makineyi dolabın içine ya da altına alıp üstünü ve yanını boy dolapla kapatıyoruz. Deterjan, havlu ve temizlik malzemesi kapağın arkasına girer; banyo derli toplu görünür.", ["banyo-makine-ustu-boy-dolap"]),
            ("Küçük banyoya çekmeceli dolap", "Dar banyoda kapak yerine çekmece çoğu zaman daha çok yer açar. Lavabo dolabını banyonun ölçüsüne göre daraltıp derinliğini ayarlıyoruz.", ["banyo-lavabo-dolabi-kucuk", "banyo-ceviz-lavabo-dolabi-dar"]),
            ("Işıklı ayna ve aynalı üst dolap", "Oval, yuvarlak ya da dikdörtgen; arkası ışıklı ayna veya içi raflı aynalı dolap. Tezgâh üstü lavabo ile antrasit, ceviz ya da açık gri kapak birlikte seçilir.", ["banyo-tezgah-ustu-lavabo-antrasit", "banyo-asma-klozet-antrasit-dolap"]),
            ("Baştan sona banyo yenileme", "Instagram'daki \"baştan sona yepyeni banyo\" videolarımız eski PVC duvar ve hazır dolapla başlar. Banyonun yenilenmesinde hangi işleri bizim yapacağımızı keşif sırasında açıkça konuşuyoruz.", ["banyo-oncesi-pvc-duvar"]),
        ],
        "sss": [
            ("Banyo dolabı nemden etkilenir mi?", "Banyo dolabında kullanılacak gövde ve kapak malzemesini banyonun havalandırmasına göre birlikte seçiyoruz. Malzeme seçeneklerini ölçü günü örnekleriyle gösteririz."),
            ("Mevcut lavaboyu kullanabilir miyiz?", "Çoğu zaman evet; dolabı mevcut lavabonun ölçüsüne göre yaparız. Lavabonun ve giderin fotoğrafını göndermeniz yeterli."),
            ("Banyo dolabı fiyatı ne kadar?", "Ölçüye, kapak yüzeyine, ayna ve ışığa göre değişir. Banyonun fotoğrafını ve genişliğini WhatsApp'tan gönderin."),
        ],
        "ilgili": ["mutfak", "duvar-paneli-petek-kapama"],
    },
    "mutfak": {
        "ozet": "Tam açılan çekmeceler, çekme raflı kiler, tavana kadar dolap.",
        "ad": "Mutfak dolabı", "menu": "Mutfak", "tur": "mutfak", "mesaj": "Mutfak dolabı",
        "title": "Mutfak Dolabı Özel Ölçü | Şeker Mobilya Bahçelievler",
        "meta": "Ölçüye özel mutfak dolabı: tam açılan çekmeceler, kiler boy dolap, tavana kadar üst dolap, cam kapak. Bahçelievler Yenibosna, Şeker Mobilya.",
        "h1": "Mutfak dolabı, ölçüye özel",
        "giris": "Mutfakta mesele görüntü kadar düzen: çekmecelerin nasıl açıldığı, kilerin nereye sığdığı, üst dolabın tavana kadar çıkıp çıkmadığı. Dolabı mutfağınızın ölçüsüne ve kullanımınıza göre kuruyoruz.",
        "kapak": ["mutfak-cekmece-sistemi", "mutfak-tezgah-cam-kapak", "mutfak-kiler-raf-boy-dolap"],
        "detay_foto": "mutfak-cekmece-sistemi",
        "bolumler": [
            ("Kapak yerine çekmece", "Alt dolaplarda çekmece, arkaya itilmiş tencereyi aramayı bitirir. Dar mutfakta bile yan yana tam açılan çekmeceler kuruyoruz.", ["mutfak-cekmeceler-acik"]),
            ("Kiler ve boy dolap", "Boy dolabın içine çekme raflı kiler koymak, mutfağın en çok yer kazandıran parçası. Buzdolabı ve fırın yeriyle birlikte ölçülür.", ["mutfak-kiler-raf-boy-dolap"]),
            ("Tezgâh ve cam kapak", "Beyaz tezgâh, açık gri kapaklar, füme cam kapaklı boy dolap; Instagram'daki mutfaklarımızda en çok bu dil var. Tezgâh malzemesini örneklerle birlikte seçiyoruz.", ["mutfak-tezgah-cam-kapak"]),
        ],
        "sss": [
            ("Mutfak dolabı fiyatı ne kadar?", "Fiyat duvar uzunluğuna, dolap sayısına, kapak ve tezgâh malzemesine göre değişir. Mutfağın fotoğrafını ve kaba ölçüsünü gönderin."),
            ("Eski mutfağı siz mi söküyorsunuz?", "Sökümün kapsamını ölçü günü konuşuyoruz; ne yapılacağını önceden netleştiririz."),
            ("Ankastre cihazlar sonra mı alınmalı?", "Cihazları önceden seçerseniz ölçüsünü dolaba göre ayarlarız; seçmediyseniz standart ölçüye göre yer bırakırız. Bunu ölçü günü birlikte karar veririz."),
        ],
        "ilgili": ["banyo", "giyinme-odasi-gardirop"],
    },
    "giyinme-odasi-gardirop": {
        "ozet": "Cam kapaklı ışıklı giyinme odası, gömme dolap, ranza ve genç odası.",
        "ad": "Giyinme odası, gardırop ve genç odası", "menu": "Giyinme odası", "tur": "giyinme", "mesaj": "Giyinme odası / gardırop",
        "title": "Giyinme Odası ve Gardırop | Şeker Mobilya Bahçelievler",
        "meta": "Cam kapaklı ışıklı giyinme odası, tavana kadar gömme dolap, gardırop ve genç odası; ölçüye özel. Bahçelievler Yenibosna, Şeker Mobilya.",
        "h1": "Giyinme odası, gardırop ve genç odası",
        "giris": "Cam kapaklı ve içi ışıklı giyinme odası, koridorda tavana kadar gömme dolap, makyaj masasıyla birleşen gardırop. Duvarın köşesine, kolonuna ve tavan yüksekliğine göre.",
        "kapak": ["giyinme-odasi-cam-kapak-led", "koridor-gomme-dolap", "yatak-odasi-makyaj-masasi-dolap"],
        "detay_foto": "giyinme-odasi-cam-kapak-led",
        "bolumler": [
            ("Cam kapak ve dolap içi ışık", "Giyinme odasında cam kapak ve içeriden gelen ışık, kıyafeti kapak açmadan gösterir; oda da bir vitrin gibi durur. Kapak açılınca yanan ya da sürekli yanan ışık seçilebilir.", []),
            ("Tavana kadar düz kapak", "Koridorda ya da yatak odasında tavana kadar çıkan, kulpsuz görünümlü düz kapaklar duvarla bir bütün olur. Gömme alanlar boşa gitmez.", ["koridor-gomme-dolap"]),
            ("Genç ve çocuk odası", "Ranza, çalışma köşesi, kemerli ışıklı niş ve çocuğun seçtiği lake renk birlikte tasarlanır. İki çocuğun paylaştığı odada basamakları çekmeceli ranza gibi çözümler kuruyoruz.", ["genc-odasi-kemerli-nis", "genc-odasi-ranza-cekmece"]),
        ],
        "sss": [
            ("Giyinme odası için ne kadar alan gerekir?", "Küçük bir oda, bir duvar boyu ya da bir köşe yeterli olabilir. Alanın fotoğrafını ve ölçüsünü gönderin, nasıl yerleşeceğini konuşalım."),
            ("Gardırop fiyatı ne kadar?", "Genişliğe, yüksekliğe, kapak türüne (düz, cam, aynalı) ve iç düzene göre değişir. Ölçüyü ve istediğiniz kapağı yazın."),
            ("Genç odasında renk seçebiliyor muyuz?", "Evet; lake kapaklarda renk seçilir. Instagram'daki lila genç odası ve pembe ışıklı nişli oda bunun örneği."),
        ],
        "ilgili": ["portmanto", "duvar-paneli-petek-kapama"],
    },
    "portmanto": {
        "ozet": "Gömme alana portmanto, çıtalı antre duvarı, ayna ve konsol.",
        "ad": "Portmanto ve antre", "menu": "Portmanto", "tur": "antre", "mesaj": "Portmanto / antre",
        "title": "Portmanto ve Antre Dekorasyonu | Şeker Mobilya Bahçelievler",
        "meta": "Ölçüye özel portmanto, gömme alan portmantosu, ceviz çıtalı antre duvarı, aynalı konsol. Bahçelievler Yenibosna, Şeker Mobilya.",
        "h1": "Portmanto ve antre duvarı",
        "giris": "Eve girince ilk görülen yer antre. Ayakkabı, mont ve anahtar için yeri olan bir portmanto; yanında çıtalı duvar, ayna ve ince bir konsol.",
        "kapak": ["antre-ceviz-citali-duvar-ayna", "portmanto-yuvarlak-ayna-citali", "antre-konsol-yarim-ay-ayna"],
        "detay_foto": "antre-ceviz-citali-duvar-ayna",
        "bolumler": [
            ("Gömme alana portmanto", "Antredeki girintiye ya da kapı arkasındaki boşluğa ölçüsünde portmanto yapıyoruz; gerekirse yanına kitaplık ekleniyor.", ["gomme-portmanto-kitaplik"]),
            ("Çıtalı duvar ve ayna", "Ceviz ya da açık renk çıtalı panel, yarım ay veya yuvarlak ayna ve duvara asılı konsol; küçük antreyi de karşılama alanına çevirir.", ["portmanto-kemerli-ayna", "antre-cift-kanat-kapi-konsol"]),
            ("Kapı lake boyama", "Antreyle birlikte kapıyı da lake boyayla yeniliyoruz; Instagram'daki \"After\" videosunda portmantonun yanındaki kapı böyle.", ["portmanto-kapi-lake-boya"]),
        ],
        "sss": [
            ("Portmanto fiyatı ne kadar?", "Genişliğe, ayna ve panel olup olmamasına göre değişir. Antrenin fotoğrafını ve ölçüsünü gönderin."),
            ("Dar bir antreye sığar mı?", "Derinliği antreye göre azaltılmış, duvara asılı modüllerle dar antrelere de portmanto yapıyoruz."),
            ("Çelik kapı veya iç kapı da boyanıyor mu?", "İç kapı lake boyamayı yapıyoruz; kapınızın türünü fotoğrafla gönderin, uygun olup olmadığını söyleyelim."),
        ],
        "ilgili": ["duvar-paneli-petek-kapama", "giyinme-odasi-gardirop"],
    },
    "duvar-paneli-petek-kapama": {
        "ozet": "Tavana kadar çıtalı panel, tavan bandında ışık, lake petek kapama.",
        "ad": "Çıtalı duvar paneli ve lake petek kapama", "menu": "Duvar ve petek", "tur": "duvar", "mesaj": "Duvar paneli / petek kapama",
        "title": "Çıtalı Duvar Paneli ve Lake Petek Kapama | Şeker Mobilya",
        "meta": "Çıtalı (yivli) duvar paneli, tavan bandında gizli LED, lake petek kapama ve duvar dekorasyonu. Bahçelievler Yenibosna, Şeker Mobilya.",
        "h1": "Çıtalı duvar paneli ve lake petek kapama",
        "giris": "Duvarı mobilyanın bir parçası gibi bitiriyoruz: yatak başında tavana kadar çıtalı panel, tavan bandında gizli ışık, pencere altında görüntüyü bozan peteğe lake bir kapama.",
        "kapak": ["yatak-odasi-citali-duvar-led", "lake-petek-kapama-beyaz", "duvar-unitesi-led-citali"],
        "detay_foto": "yatak-odasi-citali-duvar-led",
        "bolumler": [
            ("Çıtalı duvar paneli", "Dikey çıtalı panel duvara derinlik verir, yatak başı ya da TV duvarında odanın odak noktası olur. Paneli komodin, ayna ve ışıkla birlikte tasarlıyoruz.", []),
            ("Lake petek kapama", "Peteğin önüne, ısının geçeceği aralıklarla lake bir kapama yapıyoruz; üstü raf ya da konsol olarak kullanılabilir. Rengi duvara ya da dolaplara göre seçilir.", ["lake-petek-kapama-duvar"]),
            ("Duvar dekorasyonu", "Konsol, ayna ve desenli duvarla küçük bir köşeyi de tamamlıyoruz.", ["antre-konsol-dekoratif-duvar"]),
        ],
        "sss": [
            ("Petek kapama ısıyı engeller mi?", "Kapama, sıcak havanın geçeceği açıklıklarla yapılır; peteğin önü tamamen kapatılmaz. Ölçü günü peteğin tipine göre şekli belirlenir."),
            ("Petek kapama için petek sökülür mü?", "Genellikle sökülmez; kapama peteğin önüne ve çevresine ölçüsüne göre yapılır. Peteğin fotoğrafını gönderin."),
            ("Çıtalı panel hangi odalarda olur?", "İşlerimizde yatak başı duvarı, TV duvarı, antre ve banyo boy dolabının kenarında kullandık."),
        ],
        "ilgili": ["tv-unitesi", "portmanto"],
    },
}

ISLER = {
    "title": "İşlerimiz: Instagram'dan Gerçek Kareler | Şeker Mobilya",
    "meta": "TV ünitesi, banyo, mutfak, giyinme odası, genç odası, portmanto ve petek kapama: @sekermobilya Instagram'ında paylaştığımız işlerden 47 kare.",
    "h1": "İşlerimiz",
    "giris": "Buradaki tüm kareler Instagram'da (@sekermobilya) paylaştığımız işlerden alındı; temsili görsel yok. Yazılı olanlar Reels videolarının kapağı; videoların tamamı Instagram'da.",
}

MESAJ_TURLERI = [SAYFA[s]["mesaj"] for s in SAYFA_SIRASI] + ["Genç / çocuk odası", "Başka bir iş"]
