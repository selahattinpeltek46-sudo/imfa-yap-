"""Şeker Mobilya — nihai metinler ve fotoğraf envanteri (tek kaynak).

uret.py bu dosyadan siteyi, `--metin` ile modul-2-icerik-seo.md'nin 12. bölümünü üretir.
Kural: yalnız görülen / doğrulanan yazılır. Garanti, ücretsiz keşif, süre, fiyat, yıl yok.
Revizyon 1 (Babacan düzeni): üstünde yazı olan Reels kapakları ve fotoğraf üstü işaretler kaldırıldı.
"""

TARIH = "2026-10-20"
TARIH_OKUNUR = "20 Ekim 2026"
PUAN, YORUM = "4,9", 93

# ---------------------------------------------------------------- fotoğraflar
# dosya: (alt metin, tür) — kaynak: @sekermobilya Instagram paylaşımları (ekran kaydı, 348×428 px).
# Yalnız üzerinde yazı olmayan kareler.
FOTO = {
    "tv-unitesi-mermer-panel-led-raf": ("Mermer görünümlü panelli TV duvarı; iki yanda raf altları ışıklı, çerçeveli kapaklı açık gri dolaplar", "tv"),
    "tv-duvari-ceviz-gri-ust-dolap": ("Ceviz kaplama TV duvarı, üstte tavana kadar gri kapaklar, yanlarda ışıklı cam vitrin", "tv"),
    "tv-unitesi-led-cerceve": ("Krem lake TV ünitesi; TV panelinin çevresinde ve tavan bandında sıcak ışık, yanlarda çıtalı panel", "tv"),
    "duvar-unitesi-led-citali": ("Çıtalı panel duvar, altı ışıklı asma alt modül ve iki yanda füme cam vitrin", "tv"),
    "banyo-oval-led-ayna-boy-dolap": ("Arkası ışıklı oval ayna, açık raflar, gömme lavabolu tezgâh ve çıtalı boy dolap", "banyo"),
    "banyo-boy-dolap-asma-klozet": ("Arkası ışıklı ayna, asma klozet, beyaz lavabo dolabı ve tavana kadar boy dolap", "banyo"),
    "banyo-makine-ustu-boy-dolap": ("Çamaşır makinesinin üstünde ve yanında boy dolaplar, yanında siyah profilli duşakabin", "banyo"),
    "banyo-ceviz-dolap-aynali-dolap": ("Ceviz kapaklı lavabo dolabı, aynalı üst dolap ve yanında ceviz boy dolap", "banyo"),
    "banyo-tezgah-ustu-lavabo-antrasit": ("Tezgâh üstü lavabo, antrasit kapaklı alt dolap ve aynalı üst dolap", "banyo"),
    "banyo-asma-klozet-antrasit-dolap": ("Tezgâh üstü lavabolu antrasit dolap, aynalı üst dolap ve asma klozet", "banyo"),
    "banyo-lavabo-dolabi-kucuk": ("Küçük banyoda krem lavabo dolabı, yuvarlak ayna ve dalgalı desenli fayans", "banyo"),
    "banyo-ceviz-lavabo-dolabi-dar": ("Dar banyoda ceviz kapaklı lavabo dolabı ve üst dolap", "banyo"),
    "mutfak-tezgah-cam-kapak": ("Beyaz tezgâh, açık gri alt dolaplar ve füme cam kapaklı boy dolap", "mutfak"),
    "mutfak-cekmece-sistemi": ("Mutfakta açık çekmeceler, eviye dolabı ve boy dolaplar", "mutfak"),
    "mutfak-cekmeceler-acik": ("Tavana kadar dolaplı dar mutfakta yan yana açılmış çekmeceler", "mutfak"),
    "mutfak-kiler-raf-boy-dolap": ("Boy dolabın içinde çekme raflı kiler", "mutfak"),
    "giyinme-odasi-cam-kapak-led": ("Köşeyi dönen, cam kapaklı ve içi ışıklı giyinme odası", "giyinme"),
    "koridor-gomme-dolap": ("Koridorda tavana kadar düz kapaklı gömme dolap", "giyinme"),
    "yatak-odasi-makyaj-masasi-dolap": ("Boy dolabın yanına yerleştirilmiş çekmeceli makyaj masası", "giyinme"),
    "antre-ceviz-citali-duvar-ayna": ("Antrede ceviz çıtalı duvar, yarım ay ayna ve asma beyaz konsol", "antre"),
    "portmanto-yuvarlak-ayna-citali": ("Çıtalı panel önünde yuvarlak aynalı, çekmeceli portmanto", "antre"),
    "portmanto-kemerli-ayna": ("Kemerli koridorda çıtalı panelli, yarım ay aynalı portmanto", "antre"),
    "antre-konsol-yarim-ay-ayna": ("Çift kanatlı kapının yanında yarım ay aynalı asma konsol", "antre"),
    "antre-cift-kanat-kapi-konsol": ("Antrede çift kanatlı camlı kapı, yanında ayna ve asma konsol", "antre"),
    "yatak-odasi-citali-duvar-led": ("Yatak odasında tavana kadar çıtalı duvar paneli, tavan bandında ışık, arkası ışıklı yuvarlak ayna ve asma komodin", "duvar"),
}
W, H = 348, 428

TURLER = [
    ("tv", "TV ünitesi"), ("banyo", "Banyo"), ("mutfak", "Mutfak"), ("giyinme", "Giyinme odası"),
    ("antre", "Portmanto ve antre"), ("duvar", "Duvar paneli"),
]

SAYFA_SIRASI = ["tv-unitesi", "banyo", "mutfak", "giyinme-odasi-gardirop", "portmanto", "duvar-paneli-petek-kapama"]

# ---------------------------------------------------------------- ana sayfa
ANA = {
    "title": "Şeker Mobilya | Bahçelievler Özel Ölçü Mobilya ve Dekorasyon",
    "meta": "Yenibosna'dan TV ünitesi, giyinme odası, portmanto, banyo ve mutfak dolabı; çıtalı duvar paneli, gizli LED ve lake boya. Odanın fotoğrafını gönderin.",
    "ust": "Bahçelievler · Yenibosna · Özel tasarım mobilya",
    "h1": "Odanın son hâli, ölçüsüne göre ve tek ekipten",
    "giris": "TV ünitesinden giyinme odasına, banyo dolabından petek kapamaya; dolabı, çıtalı paneli, gizli ışığı ve lake boyayı aynı ekip yapıyor. Arkadaki fotoğrafların hepsi bizim işlerimiz.",
    "not": "Odanızın fotoğrafını göndererek başlayabilirsiniz.",
    "duvar": ["tv-unitesi-mermer-panel-led-raf", "banyo-oval-led-ayna-boy-dolap", "giyinme-odasi-cam-kapak-led",
              "antre-ceviz-citali-duvar-ayna", "mutfak-tezgah-cam-kapak", "tv-unitesi-led-cerceve",
              "yatak-odasi-citali-duvar-led", "banyo-ceviz-dolap-aynali-dolap", "tv-duvari-ceviz-gri-ust-dolap",
              "portmanto-kemerli-ayna", "banyo-boy-dolap-asma-klozet", "duvar-unitesi-led-citali"],
    "guven": [
        ("olcu", "Ölçüye özel", "Duvar, kolon, petek ve tavan yüksekliğine göre."),
        ("ekip", "Tek ekip", "Dolap, çıtalı panel, ışık ve lake boya birlikte."),
        ("konum", "Yenibosna'da adres", "Ahmet Yesevi Cd. No:120, Bahçelievler."),
        ("yildiz", "Google'da 4,9", "{yorum} değerlendirme · yorumları biz seçmedik"),
    ],
    "ihtiyac_ust": "Size uygun başlangıç",
    "ihtiyac_h2": "Siz hangi ihtiyaçtasınız?",
    "ihtiyac": [
        ("Odayı baştan yaptırıyorum", "Salonun TV duvarı, yatak odasının paneli ya da giyinme odası; dolabı, ışığı ve duvarı birlikte planlayalım.", "Odanın tamamı için yazın", "", "odanın tamamı"),
        ("Banyoyu yenileyeceğim", "Lavabo dolabı, makine yerli boy dolap, ışıklı ayna; eski PVC duvar ve hazır dolap yerine.", "Banyo için yazın", "Banyo dolabı / banyo yenileme", "odanın tamamı"),
        ("Tek bir köşe için", "Portmanto, petek kapama, çamaşır makinesi dolabı ya da tek bir TV ünitesi. Küçük işler de fotoğraflarımızda var.", "Bir köşe için yazın", "", "tek parça"),
        ("Fiyat araştırıyorum", "Fiyat ölçüye, kapak yüzeyine ve ışığa göre değişir. Fotoğraf ve kaba ölçü gönderin, size göre konuşalım.", "Fiyat için yazın", "", "henüz bilmiyorum"),
    ],
    "cozum_ust": "Çözümlerimiz",
    "cozum_h2": "Odanıza göre, ölçüsüne göre.",
    "cozum_p": "Hazır mobilya köşeye, kolona, petek önüne oturmaz. Biz dolabı, paneli ve ışığı odanın ölçüsüne göre yapıyoruz.",
    "bant_ust": "Başlangıç noktası",
    "bant_h2": "Odanızı bize gösterin.",
    "bant_p": "Ne istediğinizi bir iki cümleyle yazın, odanın fotoğrafını ekleyin; birlikte değerlendirelim.",
    "surec_ust": "Şeker'de bir iş nasıl ilerler?",
    "surec_h2": "Siz anlatın, ölçüsünü biz alalım.",
    "surec_alt": "Fotoğraftan teslime beş adım.",
    "surec": [
        ("Bize yazarsınız", "Odanın birkaç fotoğrafını ve aklınızdaki işi WhatsApp'tan gönderirsiniz; Instagram'da beğendiğiniz bir iş varsa onu da eklersiniz."),
        ("Ölçü", "Kesin ölçüyü yerinde alıyoruz; kolon, tesisat, petek ve priz yerleri o gün netleşir."),
        ("Renk ve malzeme", "Lake rengi, kaplama, kulp, ışığın yeri ve rengi birlikte seçilir."),
        ("İmalat", "Parçalar ölçünüze göre üretilir."),
        ("Montaj", "Yerinde montaj yapılır, ışıklar bağlanır ve teslim edilir."),
    ],
    "iscilik_ust": "İşçilik",
    "iscilik_h2": "İşçilik detayda belli olur.",
    "iscilik_alt": "\"Kaliteliyiz\" demek yerine fotoğraflarda görüneni yazıyoruz.",
    "iscilik_foto": "yatak-odasi-citali-duvar-led",
    "ozellik": [
        ("Yüzey", "Mat lake (açık gri, krem, beyaz), ceviz kaplama, mermer görünümlü panel"),
        ("Panel", "Tavana kadar dikey çıtalı duvar paneli; yatak başı, TV duvarı, antre"),
        ("Aydınlatma", "Tavan bandı, raf altı, ayna arkası ve dolap içi gizli şerit ışık"),
        ("Ayna", "Oval, yuvarlak ve yarım ay; arkası ışıklı"),
    ],
    "detaylar": [
        ("giyinme-odasi-cam-kapak-led", "Cam kapak ve iç ışık", "Neden önemli? Kıyafet kapak açmadan görünür; giyinme odası akşam tek başına aydınlanır."),
        ("banyo-oval-led-ayna-boy-dolap", "Ayna arkası ışık", "Neden önemli? Işık aynanın arkasından yayıldığı için yüze daha eşit düşer."),
        ("tv-unitesi-mermer-panel-led-raf", "Raf altı ışık", "Neden önemli? Şerit görünmez, yalnız rafa vuran ışık görünür; salon akşam yumuşak bir ışıkla kalır."),
    ],
    "isler_ust": "Gerçek projeler",
    "isler_h2": "Yaptığımız işler konuşsun.",
    "isler_p": "Hepsi Instagram hesabımızda paylaştığımız işler. Kaydırarak diğerlerini görün.",
    "konum_ust": "Bahçelievler, Yenibosna Merkez",
    "konum_h2": "Ahmet Yesevi Caddesi, No:120.",
    "konum_p": "Şeker Mobilya, Yenibosna'da özel tasarım mobilya üreten bir mobilya imalatçısı. İşlerimizi bitirdikçe Instagram'da paylaşıyoruz.",
    "sss_ust": "S.S.S.",
    "sss_h2": "Merak edilenler.",
    "sss": [
        ("Bahçelievler dışına da geliyor musunuz?", "Semtinizi yazın; ölçü için gelip gelemeyeceğimizi hemen söyleyelim."),
        ("Fiyat nasıl belirleniyor?", "Fiyat ölçüye, kapak ve panel yüzeyine, ışık miktarına göre değişir. Fotoğraf ve kaba ölçü gönderirseniz ilk konuşmada daha net bir şey söyleyebiliriz."),
        ("Fotoğraf göndererek bilgi alabilir miyim?", "Evet. Odanın birkaç fotoğrafı ve kaba ölçüsüyle başlıyoruz; kesin ölçüyü yerinde alıyoruz."),
        ("Tek bir parça için de geliyor musunuz?", "Evet. Portmanto, petek kapama, lavabo dolabı ya da tek bir TV ünitesi de yapıyoruz."),
        ("Dolap dışında hangi işleri yapıyorsunuz?", "Çıtalı duvar paneli, gizli ışık, ışıklı ayna, lake petek kapama ve kapı lake boyama; Instagram'daki işlerimizde hepsinin örneği var."),
        ("Hangi yüzeyler var?", "İşlerimizde en çok mat lake (açık gri, krem, beyaz), ceviz kaplama ve mermer görünümlü panel kullanıyoruz. Seçimi örnekleri görerek yapıyoruz."),
        ("Işıklı raf ve LED ayna yapıyor musunuz?", "Evet. Raf altı, tavan bandı, dolap içi ve ayna arkası ışık işlerimizin çoğunda var; ışığın yeri ölçü günü konuşulur."),
    ],
    "kapanis_ust": "Son adım",
    "kapanis_h2": "Odanızı birlikte değerlendirelim.",
    "kapanis_p": "Aklınızdaki işi ve odanızı anlatın. Fotoğraf ve kaba ölçü gönderirseniz ilk konuşmada daha net bir şey söyleyebiliriz.",
}

# ---------------------------------------------------------------- hizmet sayfaları
SAYFA = {
    "tv-unitesi": {
        "ad": "TV ünitesi ve duvar ünitesi", "menu": "TV ünitesi", "tur": "tv", "mesaj": "TV ünitesi / duvar ünitesi",
        "ozet": "LED'li raflar, mermer görünümlü panel, ceviz kaplama; duvarın tamamı tek tasarım.",
        "title": "TV Ünitesi ve Duvar Ünitesi | Şeker Mobilya Bahçelievler",
        "meta": "Ölçüye özel TV ünitesi ve duvar ünitesi: LED'li raflar, mermer görünümlü panel, ceviz kaplama, çıtalı panel. Bahçelievler Yenibosna, Şeker Mobilya.",
        "ust": "TV ünitesi · Bahçelievler / Yenibosna",
        "h1": "TV ünitesi ve duvar ünitesi, duvarın ölçüsüne göre",
        "giris": "TV duvarı salonun yüzü. Rafları, kapakları, paneli ve ışığı duvarın ölçüsüne göre tek parça gibi kuruyoruz; kablo görünmesin, ışık doğrudan göze gelmesin.",
        "kapak": ["tv-unitesi-mermer-panel-led-raf", "tv-unitesi-led-cerceve"],
        "proje_h2": "Kurduğumuz TV duvarları",
        "bolumler": [
            ("Duvarın tamamı, tek tasarım", "Yalnız TV sehpası değil; iki yandaki raflar, üstteki kapaklar ve TV'nin arkasındaki panel birlikte tasarlanır. Böylece duvar baştan sona aynı çizgide biter. Tavana kadar çıkan üst kapaklar hem depolama hem de daha yüksek bir tavan hissi verir."),
            ("Işık: raf altı, panel çevresi, tavan bandı", "Işık şeridini rafın altına, TV panelinin çevresine ya da tavan bandına gizliyoruz. Şerit görünmez, yalnız yüzeye vuran sıcak ışık görünür. Işığın rengi ve nereye bağlanacağı ölçü günü konuşulur."),
            ("Yüzey seçenekleri", "İşlerimizde en çok açık gri ve krem lake, ceviz kaplama, mermer görünümlü panel ve çıtalı panel kullanıyoruz. Seçimi örnekleri görerek, odanın zemini ve ışığıyla birlikte yapıyoruz."),
        ],
        "hazirlik": ["TV'nin ekran ölçüsü (inç) ve duvara mı asılacağı", "Duvarın genişliği ve tavan yüksekliği (kaba ölçü yeterli)", "Priz, uydu ve internet kablosunun şu anki yeri", "Soundbar, konsol, modem gibi ünitede duracak cihazlar", "Duvarın karşıdan bir, yandan bir fotoğrafı"],
        "sss": [
            ("TV ünitesi fiyatı ne kadar?", "Fiyat duvarın ölçüsüne, kapak ve panel yüzeyine, ışık miktarına göre değişir. Duvarın fotoğrafını ve kaba ölçüsünü WhatsApp'tan gönderin; ona göre konuşalım."),
            ("Kablolar görünür mü?", "TV paneli ve dolaplar kabloların geçeceği yer düşünülerek yapılır; prizlerin ve uydu/internet kablosunun yeri ölçü günü netleşir."),
            ("Sadece raflı bir TV ünitesi de yapıyor musunuz?", "Evet. Duvarın tamamı şart değil; tek bir alt modül ya da yalnız raf da yapılır. Ne istediğinizi yazmanız yeterli."),
            ("Işığın rengini seçebilir miyim?", "Evet; işlerimizde çoğunlukla sıcak beyaz kullanıyoruz. Rengi ve nereden açılıp kapanacağını ölçü günü birlikte belirliyoruz."),
        ],
        "ilgili": ["duvar-paneli-petek-kapama", "giyinme-odasi-gardirop", "portmanto"],
    },
    "banyo": {
        "ad": "Banyo dolabı ve banyo yenileme", "menu": "Banyo", "tur": "banyo", "mesaj": "Banyo dolabı / banyo yenileme",
        "ozet": "Lavabo dolabı, makine yerli boy dolap, ışıklı ayna; istenirse banyonun tamamı.",
        "title": "Banyo Dolabı ve Banyo Yenileme | Şeker Mobilya Bahçelievler",
        "meta": "Ölçüye özel banyo dolabı, boy dolap, çamaşır makinesi dolabı ve LED ayna; banyoyu baştan sona yeniliyoruz. Bahçelievler Yenibosna, Şeker Mobilya.",
        "ust": "Banyo · Bahçelievler / Yenibosna",
        "h1": "Banyo dolabı, makine dolabı ve ışıklı ayna",
        "giris": "Küçük bir lavabo dolabından makine yerli boy dolaba, ışıklı aynadan baştan sona yenilenen banyoya kadar. Banyonun her santimini ölçüsüne göre kullanıyoruz.",
        "kapak": ["banyo-oval-led-ayna-boy-dolap", "banyo-makine-ustu-boy-dolap"],
        "proje_h2": "Kurduğumuz banyolar",
        "bolumler": [
            ("Çamaşır makinesi için boy dolap", "Makineyi dolabın içine ya da altına alıp üstünü ve yanını boy dolapla kapatıyoruz. Deterjan, havlu ve temizlik malzemesi kapağın arkasına girer; banyo derli toplu görünür."),
            ("Küçük banyoya çekmeceli dolap", "Dar banyoda kapak yerine çekmece çoğu zaman daha çok yer açar. Lavabo dolabını banyonun ölçüsüne göre daraltıp derinliğini ayarlıyoruz."),
            ("Işıklı ayna ve aynalı üst dolap", "Oval, yuvarlak ya da dikdörtgen; arkası ışıklı ayna veya içi raflı aynalı dolap. Tezgâh üstü lavabo ile antrasit, ceviz ya da açık gri kapak birlikte seçilir."),
            ("Baştan sona banyo yenileme", "Instagram'daki \"baştan sona yepyeni banyo\" videolarımız eski PVC duvar ve hazır dolapla başlar. Banyonun yenilenmesinde hangi işleri bizim yapacağımızı keşif sırasında açıkça konuşuyoruz."),
        ],
        "hazirlik": ["Lavabo duvarının genişliği ve tavan yüksekliği", "Makine dolabı istiyorsanız makinenin ölçüsü (genişlik × derinlik)", "Mevcut lavabo ve batarya kalacak mı, değişecek mi", "Gider, priz ve su vanalarının yeri (fotoğraf yeterli)", "Banyonun kapıdan çekilmiş bir fotoğrafı"],
        "sss": [
            ("Banyo dolabı nemden etkilenir mi?", "Banyo dolabında kullanılacak gövde ve kapak malzemesini banyonun havalandırmasına göre birlikte seçiyoruz. Malzeme seçeneklerini ölçü günü örnekleriyle gösteririz."),
            ("Mevcut lavaboyu kullanabilir miyiz?", "Çoğu zaman evet; dolabı mevcut lavabonun ölçüsüne göre yaparız. Lavabonun ve giderin fotoğrafını göndermeniz yeterli."),
            ("Banyo dolabı fiyatı ne kadar?", "Ölçüye, kapak yüzeyine, ayna ve ışığa göre değişir. Banyonun fotoğrafını ve genişliğini WhatsApp'tan gönderin."),
            ("Çamaşır makinesinin üstüne dolap olur mu?", "Evet; makinenin üstüne ve yanına boy dolap yapıyoruz. Makinenin ölçüsünü ve kapağının açılma yönünü yazın."),
        ],
        "ilgili": ["mutfak", "duvar-paneli-petek-kapama", "portmanto"],
    },
    "mutfak": {
        "ad": "Mutfak dolabı", "menu": "Mutfak", "tur": "mutfak", "mesaj": "Mutfak dolabı",
        "ozet": "Tam açılan çekmeceler, çekme raflı kiler, tavana kadar dolap.",
        "title": "Mutfak Dolabı Özel Ölçü | Şeker Mobilya Bahçelievler",
        "meta": "Ölçüye özel mutfak dolabı: tam açılan çekmeceler, kiler boy dolap, tavana kadar üst dolap, cam kapak. Bahçelievler Yenibosna, Şeker Mobilya.",
        "ust": "Mutfak · Bahçelievler / Yenibosna",
        "h1": "Mutfak dolabı, mutfağın ölçüsüne göre",
        "giris": "Mutfakta mesele görüntü kadar düzen: çekmecelerin nasıl açıldığı, kilerin nereye sığdığı, üst dolabın tavana kadar çıkıp çıkmadığı. Dolabı mutfağınızın ölçüsüne ve kullanımınıza göre kuruyoruz.",
        "kapak": ["mutfak-cekmece-sistemi", "mutfak-tezgah-cam-kapak"],
        "proje_h2": "Kurduğumuz mutfaklar",
        "bolumler": [
            ("Kapak yerine çekmece", "Alt dolaplarda çekmece, arkaya itilmiş tencereyi aramayı bitirir. Dar mutfakta bile yan yana tam açılan çekmeceler kuruyoruz."),
            ("Kiler ve boy dolap", "Boy dolabın içine çekme raflı kiler koymak, mutfağın en çok yer kazandıran parçası. Buzdolabı ve fırın yeriyle birlikte ölçülür."),
            ("Tezgâh ve cam kapak", "Beyaz tezgâh, açık gri kapaklar, füme cam kapaklı boy dolap; Instagram'daki mutfaklarımızda en çok bu dil var. Tezgâh malzemesini örneklerle birlikte seçiyoruz."),
        ],
        "hazirlik": ["Mutfak duvarlarının kaba uzunluğu ve tavan yüksekliği", "Buzdolabı, fırın, ocak ve bulaşık makinesinin ölçüsü ya da modeli", "Eviye, su ve doğalgaz bağlantılarının yeri", "Pencere ve kapının konumu (bir fotoğraf yeterli)", "Mutfağın kapıdan ve karşı köşeden fotoğrafı"],
        "sss": [
            ("Mutfak dolabı fiyatı ne kadar?", "Fiyat duvar uzunluğuna, dolap sayısına, kapak ve tezgâh malzemesine göre değişir. Mutfağın fotoğrafını ve kaba ölçüsünü gönderin."),
            ("Eski mutfağı siz mi söküyorsunuz?", "Sökümün kapsamını ölçü günü konuşuyoruz; ne yapılacağını önceden netleştiririz."),
            ("Ankastre cihazlar sonra mı alınmalı?", "Cihazları önceden seçerseniz ölçüsünü dolaba göre ayarlarız; seçmediyseniz standart ölçüye göre yer bırakırız. Bunu ölçü günü birlikte karar veririz."),
        ],
        "ilgili": ["banyo", "giyinme-odasi-gardirop", "tv-unitesi"],
    },
    "giyinme-odasi-gardirop": {
        "ad": "Giyinme odası ve gardırop", "menu": "Giyinme odası", "tur": "giyinme", "mesaj": "Giyinme odası / gardırop",
        "ozet": "Cam kapaklı ışıklı giyinme odası, gömme dolap, makyaj masası, genç odası.",
        "title": "Giyinme Odası ve Gardırop | Şeker Mobilya Bahçelievler",
        "meta": "Cam kapaklı ışıklı giyinme odası, tavana kadar gömme dolap, gardırop ve genç odası; ölçüye özel. Bahçelievler Yenibosna, Şeker Mobilya.",
        "ust": "Giyinme odası · Bahçelievler / Yenibosna",
        "h1": "Giyinme odası, gömme dolap ve gardırop",
        "giris": "Cam kapaklı ve içi ışıklı giyinme odası, koridorda tavana kadar gömme dolap, makyaj masasıyla birleşen gardırop. Duvarın köşesine, kolonuna ve tavan yüksekliğine göre.",
        "kapak": ["giyinme-odasi-cam-kapak-led", "koridor-gomme-dolap"],
        "proje_h2": "Kurduğumuz dolaplar",
        "bolumler": [
            ("Cam kapak ve dolap içi ışık", "Giyinme odasında cam kapak ve içeriden gelen ışık, kıyafeti kapak açmadan gösterir; oda da bir vitrin gibi durur. Kapak açılınca yanan ya da sürekli yanan ışık seçilebilir."),
            ("Tavana kadar düz kapak", "Koridorda ya da yatak odasında tavana kadar çıkan, kulpsuz görünümlü düz kapaklar duvarla bir bütün olur. Gömme alanlar boşa gitmez."),
            ("Genç ve çocuk odası", "Ranza, çalışma köşesi, kemerli ışıklı niş ve çocuğun seçtiği lake renk birlikte tasarlanır. İki çocuğun paylaştığı odada basamakları çekmeceli ranza gibi çözümler kuruyoruz; örnekleri Instagram'daki videolarımızda."),
        ],
        "hazirlik": ["Dolabın gireceği duvarın genişliği ve tavan yüksekliği", "Kolon, pencere, petek ve priz yerleri", "Askı, raf ve çekmece oranı: daha çok asılan mı, katlanan mı", "Kapak tercihi: düz, cam ya da aynalı", "Odanın kapıdan çekilmiş bir fotoğrafı"],
        "sss": [
            ("Giyinme odası için ne kadar alan gerekir?", "Küçük bir oda, bir duvar boyu ya da bir köşe yeterli olabilir. Alanın fotoğrafını ve ölçüsünü gönderin, nasıl yerleşeceğini konuşalım."),
            ("Gardırop fiyatı ne kadar?", "Genişliğe, yüksekliğe, kapak türüne (düz, cam, aynalı) ve iç düzene göre değişir. Ölçüyü ve istediğiniz kapağı yazın."),
            ("Genç odasında renk seçebiliyor muyuz?", "Evet; lake kapaklarda renk seçilir. Instagram'daki lila genç odası ve pembe ışıklı nişli oda bunun örneği."),
        ],
        "ilgili": ["portmanto", "duvar-paneli-petek-kapama", "tv-unitesi"],
    },
    "portmanto": {
        "ad": "Portmanto ve antre", "menu": "Portmanto", "tur": "antre", "mesaj": "Portmanto / antre",
        "ozet": "Gömme alana portmanto, çıtalı antre duvarı, ayna ve konsol.",
        "title": "Portmanto ve Antre Dekorasyonu | Şeker Mobilya Bahçelievler",
        "meta": "Ölçüye özel portmanto, gömme alan portmantosu, ceviz çıtalı antre duvarı, aynalı konsol. Bahçelievler Yenibosna, Şeker Mobilya.",
        "ust": "Portmanto · Bahçelievler / Yenibosna",
        "h1": "Portmanto ve antre duvarı",
        "giris": "Eve girince ilk görülen yer antre. Ayakkabı, mont ve anahtar için yeri olan bir portmanto; yanında çıtalı duvar, ayna ve ince bir konsol.",
        "kapak": ["antre-ceviz-citali-duvar-ayna", "portmanto-yuvarlak-ayna-citali"],
        "proje_h2": "Kurduğumuz antreler",
        "bolumler": [
            ("Gömme alana portmanto", "Antredeki girintiye ya da kapı arkasındaki boşluğa ölçüsünde portmanto yapıyoruz; gerekirse yanına kitaplık ekleniyor."),
            ("Çıtalı duvar ve ayna", "Ceviz ya da açık renk çıtalı panel, yarım ay veya yuvarlak ayna ve duvara asılı konsol; küçük antreyi de karşılama alanına çevirir."),
            ("Kapı lake boyama", "Antreyle birlikte iç kapıyı da lake boyayla yeniliyoruz; Instagram'daki \"After\" videosunda portmantonun yanındaki kapı böyle."),
        ],
        "hazirlik": ["Antre duvarının genişliği ve kapıya olan mesafe", "Kaç kişinin ayakkabısı ve montu duracak", "Oturma bankı, ayna ya da konsol isteyip istemediğiniz", "Petek, priz ve elektrik panosunun yeri", "Antrenin kapıdan ve içeriden fotoğrafı"],
        "sss": [
            ("Portmanto fiyatı ne kadar?", "Genişliğe, ayna ve panel olup olmamasına göre değişir. Antrenin fotoğrafını ve ölçüsünü gönderin."),
            ("Dar bir antreye sığar mı?", "Derinliği antreye göre azaltılmış, duvara asılı modüllerle dar antrelere de portmanto yapıyoruz."),
            ("İç kapı da boyanıyor mu?", "İç kapı lake boyamayı yapıyoruz; kapınızın türünü fotoğrafla gönderin, uygun olup olmadığını söyleyelim."),
        ],
        "ilgili": ["duvar-paneli-petek-kapama", "giyinme-odasi-gardirop", "tv-unitesi"],
    },
    "duvar-paneli-petek-kapama": {
        "ad": "Çıtalı duvar paneli ve petek kapama", "menu": "Duvar ve petek", "tur": "duvar", "mesaj": "Duvar paneli / petek kapama",
        "ozet": "Tavana kadar çıtalı panel, tavan bandında ışık, lake petek kapama.",
        "title": "Çıtalı Duvar Paneli ve Lake Petek Kapama | Şeker Mobilya",
        "meta": "Çıtalı (yivli) duvar paneli, tavan bandında gizli LED, lake petek kapama ve duvar dekorasyonu. Bahçelievler Yenibosna, Şeker Mobilya.",
        "ust": "Duvar paneli · Bahçelievler / Yenibosna",
        "h1": "Çıtalı duvar paneli ve lake petek kapama",
        "giris": "Duvarı mobilyanın bir parçası gibi bitiriyoruz: yatak başında tavana kadar çıtalı panel, tavan bandında gizli ışık, pencere altında görüntüyü bozan peteğe lake bir kapama.",
        "kapak": ["yatak-odasi-citali-duvar-led", "duvar-unitesi-led-citali"],
        "fotolar": ["yatak-odasi-citali-duvar-led", "duvar-unitesi-led-citali", "tv-unitesi-led-cerceve", "portmanto-yuvarlak-ayna-citali", "antre-ceviz-citali-duvar-ayna", "portmanto-kemerli-ayna"],
        "proje_h2": "Çıtalı panelli işlerimiz",
        "bolumler": [
            ("Çıtalı duvar paneli", "Dikey çıtalı panel duvara derinlik verir, yatak başı ya da TV duvarında odanın odak noktası olur. Paneli komodin, ayna ve ışıkla birlikte tasarlıyoruz; işlerimizde antrede ceviz, yatak odasında açık renk kullandık."),
            ("Lake petek kapama", "Peteğin önüne, ısının geçeceği aralıklarla lake bir kapama yapıyoruz; üstü raf ya da konsol olarak kullanılabilir. Rengi duvara ya da dolaplara göre seçilir. Petek kapama örneklerimiz Instagram'daki videolarımızda."),
            ("Duvar dekorasyonu", "Konsol, ayna ve panelle küçük bir köşeyi de tamamlıyoruz."),
        ],
        "hazirlik": ["Panel yapılacak duvarın genişliği ve tavan yüksekliği", "Duvardaki priz ve anahtarların yeri", "Petek kapama için peteğin genişliği, yüksekliği ve tipi (fotoğraf yeterli)", "Panelin rengi: duvarla aynı mı, ceviz gibi zıt mı", "Duvarın karşıdan bir fotoğrafı"],
        "sss": [
            ("Petek kapama ısıyı engeller mi?", "Kapama, sıcak havanın geçeceği açıklıklarla yapılır; peteğin önü tamamen kapatılmaz. Ölçü günü peteğin tipine göre şekli belirlenir."),
            ("Petek kapama için petek sökülür mü?", "Genellikle sökülmez; kapama peteğin önüne ve çevresine ölçüsüne göre yapılır. Peteğin fotoğrafını gönderin."),
            ("Çıtalı panel hangi odalarda olur?", "İşlerimizde yatak başı duvarı, TV duvarı, antre ve banyo boy dolabının kenarında kullandık."),
        ],
        "ilgili": ["tv-unitesi", "portmanto", "giyinme-odasi-gardirop"],
    },
}

ISLER = {
    "title": "İşlerimiz: Instagram'dan Gerçek Kareler | Şeker Mobilya",
    "meta": "TV ünitesi, banyo, mutfak, giyinme odası, portmanto ve çıtalı duvar paneli: @sekermobilya Instagram'ında paylaştığımız işlerden 25 kare.",
    "ust": "Gerçek projeler",
    "h1": "Yaptığımız işler",
    "giris": "Buradaki tüm kareler Instagram'da (@sekermobilya) paylaştığımız işlerden alındı; temsili görsel yok. Videoların tamamı Instagram'da.",
}

MESAJ_TURLERI = [SAYFA[s]["mesaj"] for s in SAYFA_SIRASI] + ["Genç / çocuk odası", "Başka bir iş"]
