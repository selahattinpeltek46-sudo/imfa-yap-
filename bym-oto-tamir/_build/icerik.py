"""
BYM Automotive — site içerikleri (hizmetler, sorunlar, süreç, blog).

Metinler genel ve doğrulanabilir bilgiler içerir; firmaya özel iddia
(yıl, müşteri sayısı, garanti vb.) EKLENMEZ.
"""

# ---------------------------------------------------------------------------
# HİZMETLER
# ikon: assets/icons.svg içindeki sembol adı
# randevu: randevu sihirbazındaki hizmet kimliği (js/booking/catalog.js)
# ---------------------------------------------------------------------------
HIZMETLER = [
    {
        "slug": "periyodik-bakim",
        "ad": "Periyodik Bakım",
        "ikon": "i-wrench",
        "randevu": "periyodik-bakim",
        "ozet": "Üretici bakım takvimine uygun yağ, filtre ve genel kontroller.",
        "seo_baslik": "Göksun Araç Bakımı · Periyodik Bakım | BYM Automotive",
        "url": "oto-bakim/",
        "seo_aciklama": "Motor yağı, filtreler ve üretici bakım takvimine uygun kontrollerle periyodik araç bakımı. BYM Automotive'de randevunuzu online oluşturun.",
        "giris": "Periyodik bakım, aracınızın üretici tarafından belirlenen kilometre ve zaman aralıklarında yapılması gereken rutin işlemlerdir. Düzenli bakım; motorun ömrünü korur, yakıt tüketimini dengeler ve büyük arızaların önüne geçer.",
        "kapsam": [
            "Motor yağı ve yağ filtresinin değişimi",
            "Hava, polen ve yakıt filtresi kontrolü / değişimi",
            "Soğutma suyu, fren hidroliği ve diğer sıvı seviyelerinin kontrolü",
            "Fren balata ve disklerinin görsel kontrolü",
            "Lastik, akü ve aydınlatma kontrolleri",
            "Bakım sonrası servis kaydının güncellenmesi",
        ],
        "belirtiler": [
            "Gösterge panelinde bakım uyarısı çıktı",
            "Son bakımın üzerinden 1 yıl ya da üreticinin belirttiği kilometre geçti",
            "Motor yağı seviyesi düşük veya yağ koyulaşmış",
            "Aracı uzun yola hazırlamak istiyorsunuz",
        ],
        "sss": [
            ("Periyodik bakım ne sıklıkla yapılmalı?", "Aralık araca göre değişir. Çoğu binek araçta üretici; yılda bir veya 10.000–15.000 km'de bir bakım önerir. Doğru aralık için aracınızın bakım kitapçığı esas alınır."),
            ("Bakım ne kadar sürer?", "Standart bir periyodik bakım, araç ve yapılacak işlemlere göre genellikle birkaç saat içinde tamamlanır. Randevu ile geldiğinizde bekleme süresi azalır."),
            ("Hangi yağ kullanılacağına nasıl karar veriliyor?", "Aracınızın üreticisinin belirttiği viskozite ve onay standardı esas alınır. Kullanılacak ürün işlem öncesinde size bildirilir."),
        ],
    },
    {
        "slug": "ariza-tespiti",
        "ad": "Bilgisayarlı Arıza Tespiti",
        "ikon": "i-scan",
        "randevu": "ariza-tespiti",
        "ozet": "Arıza kodlarının okunması ve sorunun kaynağına yönelik kontroller.",
        "seo_baslik": "Göksun Bilgisayarlı Arıza Tespiti | BYM Automotive",
        "url": "ariza-tespiti/",
        "seo_aciklama": "Motor arıza lambası, performans kaybı ve elektronik sorunlar için bilgisayarlı arıza tespiti. Tahmin değil, kontrol ile teşhis.",
        "giris": "Günümüz araçlarında motor, şanzıman, fren ve konfor sistemleri elektronik kontrol üniteleri tarafından yönetilir. Bilgisayarlı arıza tespiti; bu ünitelerdeki hata kayıtlarını ve canlı verileri okuyarak sorunun hangi sistemde olduğunu ortaya koyar. Arıza kodu tek başına parça değişimi anlamına gelmez; kodun işaret ettiği sistem ayrıca kontrol edilir.",
        "kapsam": [
            "Kontrol ünitelerindeki hata kodlarının okunması",
            "Sensör ve motor verilerinin canlı olarak izlenmesi",
            "Kodun işaret ettiği sistemin mekanik ve elektriksel kontrolü",
            "Tespit edilen sorunun ve önerilen işlemlerin size aktarılması",
            "Onarım sonrası hata kayıtlarının tekrar kontrolü",
        ],
        "belirtiler": [
            "Motor arıza lambası yanıyor veya yanıp sönüyor",
            "Araç çekişten düştü ya da güvenli moda geçti",
            "Rölantide dalgalanma veya titreme var",
            "Yakıt tüketimi belirgin şekilde arttı",
        ],
        "sss": [
            ("Arıza kodu okunduğunda sorun kesin olarak bulunur mu?", "Arıza kodu, sorunun hangi sistemde olduğunu gösterir. Kesin teşhis için ilgili parçaların ve bağlantıların ayrıca kontrol edilmesi gerekir."),
            ("Arıza lambası söndü, yine de kontrol gerekir mi?", "Lamba sönse bile ünitede hata kaydı kalabilir. Tekrarlayan bir sorunun erken tespiti için kontrol ettirmeniz önerilir."),
            ("Arıza lambası yanıp sönüyorsa ne yapmalıyım?", "Yanıp sönen arıza lambası genellikle ciddi bir ateşleme sorununa işaret eder. Aracı zorlamadan kullanmayı bırakmanız ve en kısa sürede kontrol ettirmeniz önerilir."),
        ],
    },
    {
        "slug": "motor-mekanik",
        "ad": "Motor & Mekanik",
        "ikon": "i-engine",
        "randevu": "motor-mekanik",
        "ozet": "Motor, triger, soğutma ve mekanik aksam onarımları.",
        "seo_baslik": "Göksun Motor Tamiri · Motor & Mekanik | BYM Automotive",
        "url": "motor-mekanik/",
        "seo_aciklama": "Motor arızaları, triger seti, soğutma sistemi, yağ kaçakları ve mekanik onarımlar. İşlem öncesi bilgilendirme ve onay ile servis.",
        "giris": "Motor ve mekanik aksam; aracın güvenli ve verimli çalışmasının temelidir. Ses, titreşim, yağ kaçağı veya hararet gibi belirtiler erken fark edildiğinde daha küçük ve planlı onarımlarla çözülebilir.",
        "kapsam": [
            "Motor çalışma ve performans kontrolleri",
            "Triger kayışı / zinciri ve gergi kontrolü, değişimi",
            "Soğutma sistemi (radyatör, termostat, su pompası) kontrolleri",
            "Yağ ve sıvı kaçaklarının tespiti ve giderilmesi",
            "Conta, keçe ve motor takozu değişimleri",
        ],
        "belirtiler": [
            "Motordan tıkırtı, vuruntu veya alışılmadık ses geliyor",
            "Araç hararet yapıyor",
            "Park yerinde yağ lekesi oluşuyor",
            "Egzozdan yoğun duman çıkıyor",
        ],
        "sss": [
            ("Triger kayışı ne zaman değişmeli?", "Değişim aralığı araca göre farklıdır ve üretici tarafından kilometre / yıl olarak belirtilir. Aralık aşılmışsa, kopma riskine karşı değişim ertelenmemelidir."),
            ("Hararet yapan araçla yola devam edebilir miyim?", "Hayır. Hararet göstergesi yükseldiğinde aracı güvenli bir yerde durdurup motoru soğumaya bırakmanız, ardından kontrol ettirmeniz önerilir."),
        ],
    },
    {
        "slug": "oto-elektrik",
        "ad": "Oto Elektrik",
        "ikon": "i-bolt",
        "randevu": "oto-elektrik",
        "ozet": "Akü, marş, şarj sistemi ve elektrik arızaları.",
        "seo_baslik": "Göksun Oto Elektrik · Akü, Marş, Şarj | BYM Automotive",
        "url": "oto-elektrik/",
        "seo_aciklama": "Akü, marş motoru, şarj dinamosu, aydınlatma ve elektrik tesisatı arızaları için oto elektrik servisi.",
        "giris": "Aracın çalışmasından aydınlatmasına kadar birçok sistem elektrik tesisatına bağlıdır. Akü, marş ve şarj sistemindeki sorunlar çoğu zaman aracın geç çalışması veya hiç çalışmaması şeklinde kendini gösterir.",
        "kapsam": [
            "Akü sağlık ve şarj kontrolü",
            "Marş motoru ve şarj dinamosu kontrolleri",
            "Far, stop ve sinyal aydınlatma arızaları",
            "Sigorta, röle ve tesisat kontrolleri",
            "Cam, kilit ve konfor sistemleri elektrik arızaları",
        ],
        "belirtiler": [
            "Araç geç çalışıyor veya marş basmıyor",
            "Gösterge panelinde akü / şarj uyarısı var",
            "Farlar zayıf yanıyor ya da titriyor",
            "Elektrikli donanımlar zaman zaman çalışmıyor",
        ],
        "sss": [
            ("Akü ne kadar dayanır?", "Kullanım ve iklim koşullarına bağlı olarak değişir; soğuk havalar aküyü daha çok zorlar. Kış öncesi akü kontrolü yaptırmak sürpriz arızaları azaltır."),
            ("Araç geç çalışıyorsa sorun her zaman akü müdür?", "Hayır. Marş motoru, şarj sistemi, yakıt veya ateşleme sorunları da benzer belirtiler verebilir. Doğru teşhis için kontrol gerekir."),
        ],
    },
    {
        "slug": "fren-suspansiyon",
        "ad": "Fren & Süspansiyon",
        "ikon": "i-disc",
        "randevu": "fren-sistemi",
        "ozet": "Balata, disk, amortisör ve alt takım kontrolleri.",
        "seo_baslik": "Fren & Süspansiyon Servisi Göksun | BYM Automotive",
        "url": "fren-suspansiyon/",
        "seo_aciklama": "Fren balatası, disk, fren hidroliği, amortisör ve alt takım kontrol ve onarımları. Güvenliğiniz için planlı servis.",
        "giris": "Fren ve süspansiyon sistemleri doğrudan sürüş güvenliğini etkiler. Frenlerden gelen sesler, direksiyonda titreme veya aracın bir tarafa çekmesi ihmal edilmemesi gereken belirtilerdir.",
        "kapsam": [
            "Balata ve fren disklerinin ölçümü ve değişimi",
            "Fren hidroliği kontrolü ve değişimi",
            "Amortisör, helezon yay ve takozların kontrolü",
            "Rotil, rot başı ve salıncak kontrolleri",
            "Alt takım boşluk kontrolleri",
        ],
        "belirtiler": [
            "Frenlerden gıcırtı veya sürtünme sesi geliyor",
            "Fren pedalı yumuşak ya da derinde",
            "Frenlemede direksiyon titriyor",
            "Tümsek geçişlerinde vuruntu sesi var",
        ],
        "sss": [
            ("Frenlerden gelen ses her zaman balata anlamına mı gelir?", "Çoğunlukla balata aşınmasıyla ilgilidir ancak disk yüzeyi, kaliper veya toz birikimi de ses yapabilir. Kontrol ile kaynağı belirlenir."),
            ("Fren hidroliği neden değiştirilir?", "Fren hidroliği zamanla nem çeker ve kaynama noktası düşer. Bu durum yoğun frenlemede performans kaybına yol açabilir. Değişim aralığı üretici tarafından belirtilir."),
        ],
    },
    {
        "slug": "klima",
        "ad": "Klima",
        "ikon": "i-snow",
        "randevu": "klima",
        "ozet": "Klima performans kontrolü, gaz ve kaçak kontrolleri.",
        "seo_baslik": "Oto Klima Servisi Göksun | BYM Automotive",
        "url": "klima/",
        "seo_aciklama": "Soğutmayan klima, kötü koku ve klima kompresörü sorunları için kontrol ve bakım. Polen filtresi ve gaz kontrolü.",
        "giris": "Klima sistemi yalnızca konfor değil, camların buğusunu almak için de önemlidir. Soğutma performansının düşmesi çoğu zaman gaz eksikliği, kaçak veya filtre tıkanıklığı ile ilgilidir.",
        "kapsam": [
            "Klima soğutma performansı ölçümü",
            "Gaz basıncı ve kaçak kontrolleri",
            "Polen filtresi kontrolü ve değişimi",
            "Kompresör ve fan çalışma kontrolleri",
        ],
        "belirtiler": [
            "Klima soğutmuyor ya da geç soğutuyor",
            "Havalandırmadan kötü koku geliyor",
            "Klima açıldığında ses geliyor",
            "Camların buğusu geç gidiyor",
        ],
        "sss": [
            ("Klima gazı neden azalır?", "Sağlıklı bir sistemde gaz çok yavaş azalır. Belirgin bir azalma genellikle bir kaçağa işaret eder; bu nedenle gaz dolumu öncesinde kaçak kontrolü önemlidir."),
        ],
    },
    {
        "slug": "sanziman",
        "ad": "Şanzıman",
        "ikon": "i-gear",
        "randevu": "sanziman",
        "ozet": "Vites geçişi, debriyaj ve şanzıman kontrolleri.",
        "seo_baslik": "Şanzıman & Debriyaj Servisi Göksun | BYM Automotive",
        "url": "sanziman/",
        "seo_aciklama": "Vites geçiş sorunları, debriyaj kaçırma ve şanzıman kontrolleri. İşlem öncesi teşhis ve bilgilendirme.",
        "giris": "Manuel ve otomatik şanzımanlarda geç, sert ya da vuruntulu vites geçişleri; debriyaj, şanzıman yağı veya kontrol sistemiyle ilgili bir soruna işaret edebilir. Erken kontrol, maliyetli onarımların önüne geçebilir.",
        "kapsam": [
            "Vites geçiş ve yol testi kontrolleri",
            "Debriyaj seti kontrolü ve değişimi",
            "Şanzıman yağı seviye ve durum kontrolü",
            "Şanzıman kaynaklı ses ve kaçak kontrolleri",
        ],
        "belirtiler": [
            "Vitesler zor geçiyor veya vites atıyor",
            "Debriyaj kaçırıyor, devir yükseliyor ama araç hızlanmıyor",
            "Otomatik şanzımanda sert veya geç geçişler",
            "Vites değişiminde ses geliyor",
        ],
        "sss": [
            ("Otomatik şanzıman yağı değiştirilmeli mi?", "Bu, şanzıman tipine ve üreticinin önerisine bağlıdır. Bazı şanzımanlarda belirli aralıklarla değişim önerilir. Aracınıza özel bilgi için kontrol ettirmeniz uygundur."),
        ],
    },
    {
        "slug": "genel-arac-kontrolu",
        "ad": "Genel Araç Kontrolü",
        "ikon": "i-check",
        "randevu": "ariza-kontrolu",
        "ozet": "Yol öncesi, muayene öncesi ve alım öncesi genel kontroller.",
        "seo_baslik": "Genel Araç Kontrolü Göksun | BYM Automotive",
        "url": "genel-arac-kontrolu/",
        "seo_aciklama": "Uzun yol, muayene ve kış öncesi genel araç kontrolü. Aracınızın durumunu işlem öncesi öğrenin.",
        "giris": "Genel araç kontrolü; uzun yol, araç muayenesi veya kış öncesi aracınızın temel sistemlerinin gözden geçirilmesidir. Kontrol sonucunda gerekli görülen işlemler size aktarılır, onayınız olmadan işlem yapılmaz.",
        "kapsam": [
            "Fren, lastik ve alt takım kontrolleri",
            "Sıvı seviyeleri ve kaçak kontrolleri",
            "Akü, aydınlatma ve elektrik kontrolleri",
            "Arıza kayıtlarının okunması",
            "Tespitlerin ve önerilerin size aktarılması",
        ],
        "belirtiler": [
            "Uzun yola çıkmadan önce",
            "Araç muayenesi öncesinde",
            "Kış mevsimi öncesinde",
            "Belirgin bir sorun yok ama aracın durumunu bilmek istiyorsunuz",
        ],
        "sss": [
            ("Kontrol sonrasında işlem yapmak zorunda mıyım?", "Hayır. Kontrol sonucunda tespitler size aktarılır; hangi işlemin yapılacağına siz karar verirsiniz."),
        ],
    },
]

# ---------------------------------------------------------------------------
# "ARACINIZDA NE VAR?" — belirti rehberi
# Kesin teşhis içermez; "olası noktalar" olarak yazılır.
# hizmet: hizmet sayfası slug'ı · randevu: sihirbazdaki hizmet kimliği
# ---------------------------------------------------------------------------
SORUNLAR = [
    {
        "id": "ariza-lambasi",
        "baslik": "Motor arıza lambası yanıyor",
        "hizmet": "ariza-tespiti", "randevu": "ariza-tespiti",
        "aciklama": "Motor kontrol ünitesi, izlediği bir değerin normal aralığın dışına çıktığını algıladığında lambayı yakar ve bir arıza kaydı oluşturur. Lambanın sabit yanması ile yanıp sönmesi farklı aciliyetlere işaret edebilir.",
        "nedenler": ["Ateşleme sistemi (buji, bobin) kaynaklı tekleme", "Oksijen (lambda) veya hava akış sensörü değerleri", "Yakıt deposu kapağı veya buharlaşma sistemindeki kaçak", "Dizel araçlarda EGR veya partikül filtresi (DPF) kayıtları"],
        "kontroller": ["Kayıtlı arıza kodları ve arızanın oluştuğu andaki veriler", "Canlı sensör değerleri", "Kodun işaret ettiği sistemin bağlantıları ve parçaları"],
        "uyari": "Lamba yanıp sönüyorsa aracı zorlamadan kullanmayı bırakmanız önerilir.",
    },
    {
        "id": "titreme",
        "baslik": "Araç titriyor",
        "hizmet": "motor-mekanik", "randevu": "motor-mekanik",
        "aciklama": "Titreşimin ne zaman hissedildiği (rölantide, belirli bir hızda, frenlemede veya hızlanırken) kaynağı hakkında önemli bir ipucu verir. Randevu açıklamasına bunu yazmanız kontrolü kolaylaştırır.",
        "nedenler": ["Rölantide: ateşleme veya yakıt kaynaklı tekleme, motor takozları", "Belirli bir hızda: lastik, jant veya balans", "Frenlemede: fren disklerinde yüzey bozulması", "Hızlanırken: aks veya ön takım bileşenleri"],
        "kontroller": ["Arıza kayıtları ve motor çalışma verileri", "Motor ve şanzıman takozları", "Lastik, jant ve balans durumu", "Fren diskleri ve ön takım"],
        "uyari": "",
    },
    {
        "id": "fren-sesi",
        "baslik": "Frenlerden ses geliyor",
        "hizmet": "fren-suspansiyon", "randevu": "fren-sistemi",
        "aciklama": "Frenlerden gelen ses her zaman ciddi bir arıza anlamına gelmez; ancak fren sistemi doğrudan güvenliğinizi etkilediği için sesin kaynağının bilinmesi önemlidir.",
        "nedenler": ["Balata aşınma uyarı sacının diske sürtmesi (ince gıcırtı)", "Balatanın bitmesi, metalin diske sürtmesi (kalın, hırıltılı ses)", "Disk yüzeyinde bozulma veya pas", "Kaliper ya da kaliper pimlerinde boşluk"],
        "kontroller": ["Balata kalınlığı", "Disk yüzeyi ve ölçüsü", "Kaliper ve pimler", "Fren hidroliği seviyesi"],
        "uyari": "Metal sürtünme sesi duyuyor ya da fren pedalı yumuşamışsa kontrolü ertelemeyin.",
    },
    {
        "id": "gec-calisma",
        "baslik": "Araç geç çalışıyor",
        "hizmet": "oto-elektrik", "randevu": "oto-elektrik",
        "aciklama": "Marşın ağır basması ya da aracın birkaç denemede çalışması, özellikle soğuk havalarda sık görülür. Sorun her zaman aküde değildir.",
        "nedenler": ["Akü kapasitesinin düşmesi", "Şarj sisteminin (dinamo) aküyü yeterince şarj etmemesi", "Marş motoru", "Kutup başlarında zayıf temas", "Yakıt veya ateşleme sistemi"],
        "kontroller": ["Akü testi", "Şarj voltajı", "Marş motoru çalışması", "Park halindeki kaçak akım", "Arıza kayıtları"],
        "uyari": "",
    },
    {
        "id": "klima",
        "baslik": "Klima soğutmuyor",
        "hizmet": "klima", "randevu": "klima",
        "aciklama": "Soğutma performansının düşmesi çoğu zaman gaz eksikliği, bir kaçak veya hava akışını engelleyen bir tıkanıklıkla ilgilidir.",
        "nedenler": ["Klima gazı eksikliği veya sistemde kaçak", "Polen filtresinin tıkanması", "Kompresör veya kompresör kavraması", "Kondenser fanı", "Sensör veya kontrol arızası"],
        "kontroller": ["Havalandırma çıkış sıcaklığı", "Sistem basınçları", "Kaçak kontrolü", "Fan ve kompresör çalışması", "Polen filtresi"],
        "uyari": "",
    },
    {
        "id": "cekis",
        "baslik": "Araç çekişten düştü",
        "hizmet": "ariza-tespiti", "randevu": "ariza-tespiti",
        "aciklama": "Güç kaybı; aracın hava, yakıt, turbo veya egzoz sistemlerinden birinde değerlerin düşmesiyle ortaya çıkabilir. Bazı araçlar bir arıza algıladığında motoru korumak için güvenli moda geçer.",
        "nedenler": ["Hava filtresi veya emme hattında kaçak", "Turbo ve turbo hortumları", "Yakıt filtresi veya enjektörler", "Sensör hataları", "Dizel araçlarda EGR veya partikül filtresi (DPF)"],
        "kontroller": ["Arıza kayıtları", "Turbo basınç ve motor verileri", "Hava kaçakları", "Filtreler", "Yakıt sistemi"],
        "uyari": "",
    },
    {
        "id": "vites",
        "baslik": "Vites geçişlerinde sorun var",
        "hizmet": "sanziman", "randevu": "sanziman",
        "aciklama": "Vitesin zor geçmesi, vites atması ya da otomatik şanzımanda sert veya geç geçişler; debriyaj, bağlantı mekanizması, yağ veya kontrol sistemiyle ilgili olabilir.",
        "nedenler": ["Manuel: debriyaj aşınması veya ayarı", "Manuel: vites halatı ve bağlantı mekanizması", "Otomatik: şanzıman yağı seviyesi veya durumu", "Otomatik: kontrol ünitesi kayıtları ve adaptasyon"],
        "kontroller": ["Yol testi", "Debriyaj", "Vites halatı ve bağlantılar", "Şanzıman yağı", "Arıza kayıtları"],
        "uyari": "",
    },
    {
        "id": "yakit",
        "baslik": "Yakıt tüketimi arttı",
        "hizmet": "ariza-tespiti", "randevu": "ariza-tespiti",
        "aciklama": "Tüketimdeki artış; sürüş koşulları ve mevsim gibi normal etkenlerden de, aracın yanlış yakıt karışımıyla çalışmasına yol açan bir sorundan da kaynaklanabilir.",
        "nedenler": ["Düşük lastik basıncı", "Kirli hava filtresi", "Oksijen (lambda), hava akış veya motor sıcaklık sensörü", "Buji ve ateşleme sistemi", "Sürten fren"],
        "kontroller": ["Arıza kayıtları", "Sensör verileri", "Hava filtresi", "Lastik basınçları", "Frenlerin serbest dönmesi"],
        "uyari": "",
    },
]

# ---------------------------------------------------------------------------
# NEDEN BYM
# ---------------------------------------------------------------------------
NEDEN = [
    ("Doğru teşhis", "Arızanın kaynağını anlamaya yönelik sistematik kontrol ve teşhis süreci.", "i-scan"),
    ("Şeffaf süreç", "Yapılacak işlemler hakkında sizi süreç boyunca bilgilendiriyoruz.", "i-eye"),
    ("Onaylı işlem", "Müşteri onayı olmadan ek işlem yapılmaz.", "i-shield"),
    ("Kontrollü teslim", "İşlem sonrası gerekli kontroller tamamlanarak araç teslim sürecine alınır.", "i-key"),
]

# ---------------------------------------------------------------------------
# SERVİS SÜRECİ
# ---------------------------------------------------------------------------
SUREC = [
    ("Randevu", "Size uygun gün ve saati seçin."),
    ("Araç kabul", "Aracınız servis sürecine alınır."),
    ("Kontrol", "Gerekli kontroller ve teşhis gerçekleştirilir."),
    ("Bilgilendirme", "Tespit edilen işlemler size aktarılır."),
    ("Onay", "Onayınızdan sonra işleme başlanır."),
    ("Teslim", "Kontroller tamamlanır ve araç teslim edilir."),
]

GUVEN = ["Randevulu Servis", "Şeffaf İşlem", "Profesyonel Teşhis"]

# Güven bandı — BYM'nin gerçekten uyguladığı prensipler
GUVEN_BANDI = ["Müşteri Onayı", "Şeffaf Süreç", "İşlem Bilgilendirmesi", "Diagnostik Kontrol", "Servis Sonrası Kontrol", "Randevulu Servis"]

# Anasayfa SSS — yalnızca doğrulanmış bilgiler
SSS_GENEL = [
    ("Randevu nasıl alınır?", "Sitemizdeki randevu formundan hizmeti, aracınızı ve size uygun gün ile saati seçin. Talebiniz WhatsApp üzerinden ekibimize iletilir; uygunluk durumunu teyit etmek için sizinle iletişime geçilir. Telefonla da randevu alabilirsiniz."),
    ("Onayım olmadan aracıma işlem yapılır mı?", "Hayır. Kontrol sonucunda tespit edilen işlemler ve gerekli parçalar size aktarılır; onayınız olmadan ek işlem yapılmaz."),
    ("Çalışma saatleriniz nedir?", "Pazartesi–Cumartesi 08:00–19:00 arasında hizmet veriyoruz. Pazar günleri kapalıyız."),
    ("Servise gelmeden önce ne hazırlamalıyım?", "Aracınızda fark ettiğiniz belirtiyi (ne zaman, hangi koşulda ortaya çıktığını) not etmeniz kontrol sürecini hızlandırır. Varsa bakım kayıtlarınızı da getirebilirsiniz."),
]

# ---------------------------------------------------------------------------
# BLOG — BYM Otomotiv Bilgi Merkezi
# govde: HTML (h2/h3/p/ul). Genel, doğrulanabilir bilgiler.
# ---------------------------------------------------------------------------
BLOG = [
    {
        "slug": "motor-ariza-lambasi-neden-yanar",
        "baslik": "Motor arıza lambası neden yanar?",
        "ozet": "Motor arıza lambasının yanmasının en yaygın nedenleri, sabit yanması ile yanıp sönmesi arasındaki fark ve ne zaman beklemeden servise gitmeniz gerektiği.",
        "tarih": "2026-09-23",
        "okuma": 4,
        "hizmet": "ariza-tespiti",
        "govde": """
<p>Motor arıza lambası (genellikle turuncu renkli motor sembolü), aracın motor kontrol ünitesinin bir sorunu algıladığını gösterir. Lamba yandığında ünite bir <strong>arıza kodu</strong> kaydeder. Bu kod sorunun hangi sistemde olduğunu gösterir; ancak hangi parçanın arızalı olduğunu her zaman tek başına söylemez.</p>

<h2>Sabit yanıyor mu, yanıp sönüyor mu?</h2>
<p><strong>Sabit yanan</strong> lamba, çoğunlukla acil olmayan ama kontrol edilmesi gereken bir soruna işaret eder. Aracı kısa süre kullanmaya devam edebilirsiniz, ancak kontrolü ertelememek gerekir.</p>
<p><strong>Yanıp sönen</strong> lamba ise genellikle ciddi bir ateşleme sorunu (tekleme) olduğunu gösterir. Yanmamış yakıt egzoz sistemine ve katalitik konvertöre zarar verebilir. Bu durumda aracı zorlamadan kullanmayı bırakmanız ve en kısa sürede kontrol ettirmeniz önerilir.</p>

<h2>En yaygın nedenler</h2>
<ul>
<li><strong>Yakıt deposu kapağının iyi kapanmaması:</strong> Buharlaşma sistemi kaçak algılayabilir. Basit ama sık görülen bir nedendir.</li>
<li><strong>Oksijen (lambda) sensörü:</strong> Egzoz gazındaki oksijeni ölçer; arızalandığında yakıt tüketimi artabilir.</li>
<li><strong>Buji ve bobin arızaları:</strong> Teklemeye, titremeye ve güç kaybına neden olur.</li>
<li><strong>Hava akış (MAF) sensörü:</strong> Kirlenme veya arıza, motorun yanlış yakıt karışımıyla çalışmasına yol açabilir.</li>
<li><strong>Dizel araçlarda EGR ve partikül filtresi (DPF):</strong> Tıkanma, çekiş kaybı ve güvenli moda geçişle kendini gösterebilir.</li>
<li><strong>Katalitik konvertör verimsizliği:</strong> Genellikle başka bir sorunun uzun süre ihmal edilmesinin sonucudur.</li>
</ul>

<h2>Arıza kodu okutmak yeterli mi?</h2>
<p>Arıza kodu doğru teşhisin başlangıç noktasıdır. Örneğin "tekleme" kodu; buji, bobin, enjektör veya vakum kaçağından kaynaklanabilir. Bu yüzden kodun işaret ettiği sistem ayrıca kontrol edilmeli, gereksiz parça değişiminden kaçınılmalıdır.</p>

<h2>Ne yapmalısınız?</h2>
<ul>
<li>Önce yakıt deposu kapağının düzgün kapandığından emin olun.</li>
<li>Araçta titreme, güç kaybı veya yanıp sönen lamba varsa aracı zorlamayın.</li>
<li>Lamba sönse bile kayıtlı arıza kodu kalabilir; kontrol ettirmeniz tekrar eden sorunları erken yakalamanızı sağlar.</li>
</ul>
""",
    },
    {
        "slug": "periyodik-bakim-ne-zaman-yapilmali",
        "baslik": "Periyodik bakım ne zaman yapılmalı?",
        "ozet": "Bakım aralığı nasıl belirlenir, ağır kullanım koşulları neden bakımı öne çeker ve bakımda genellikle hangi işlemler yapılır?",
        "tarih": "2026-09-23",
        "okuma": 4,
        "hizmet": "periyodik-bakim",
        "govde": """
<p>Periyodik bakım aralığını aracın üreticisi belirler ve bu bilgi aracın bakım kitapçığında yer alır. Aralık genellikle iki ölçüte bağlıdır: <strong>kilometre</strong> ve <strong>zaman</strong>. Hangisi önce dolarsa bakım o zaman yapılır.</p>

<h2>Neden hem kilometre hem zaman?</h2>
<p>Az kullanılan bir araçta bile motor yağı zamanla özelliğini kaybeder; nem ve yakıt buharı yağa karışır. Bu yüzden yılda birkaç bin kilometre yapan bir araç için de yıllık bakım önemlidir.</p>

<h2>Ağır kullanım koşulları</h2>
<p>Üreticilerin çoğu, aşağıdaki durumlarda bakım aralığının kısaltılmasını önerir:</p>
<ul>
<li>Sık kısa mesafe kullanım (motorun çalışma sıcaklığına ulaşmadığı yolculuklar)</li>
<li>Tozlu, toprak yollarda kullanım</li>
<li>Çok soğuk iklim koşulları</li>
<li>Yük veya römork çekme</li>
<li>Uzun süre rölantide çalışma</li>
</ul>
<p>Göksun gibi kışları sert geçen bölgelerde soğuk çalıştırmalar motoru ve aküyü daha çok zorlar. Bu nedenle kış öncesi bakım ve kontrol ayrıca önem taşır.</p>

<h2>Bakımda genellikle neler yapılır?</h2>
<ul>
<li>Motor yağı ve yağ filtresi değişimi</li>
<li>Hava, polen ve (araca göre) yakıt filtresi değişimi</li>
<li>Soğutma suyu, fren hidroliği ve diğer sıvıların kontrolü</li>
<li>Fren, lastik, akü ve aydınlatma kontrolleri</li>
<li>Kilometreye bağlı işlemler: buji, triger seti, fren hidroliği değişimi gibi</li>
</ul>

<h2>Bakım kaydını saklayın</h2>
<p>Yapılan her bakımın tarih, kilometre ve işlem bilgileriyle kaydedilmesi; bir sonraki bakımın zamanını bilmenizi sağlar ve aracınızı satarken de değerini korumasına yardımcı olur.</p>
""",
    },
    {
        "slug": "frenlerden-ses-gelmesinin-nedenleri",
        "baslik": "Aracın frenlerinden ses gelmesinin nedenleri",
        "ozet": "Gıcırtı, sürtünme, tıkırtı: Fren seslerinin anlamı ve hangi seslerin acil kontrol gerektirdiği.",
        "tarih": "2026-09-23",
        "okuma": 3,
        "hizmet": "fren-suspansiyon",
        "govde": """
<p>Frenlerden gelen ses her zaman ciddi bir arıza anlamına gelmez; ancak fren sistemi doğrudan güvenliğinizi etkilediği için nedeninin bilinmesi önemlidir.</p>

<h2>Gıcırtı (ince, tiz ses)</h2>
<p>Birçok balatada, aşınma sınırına yaklaşıldığında diske sürtünerek ses çıkaran bir <strong>aşınma uyarı sacı</strong> bulunur. Tiz bir gıcırtı genellikle balataların değişim zamanının geldiğini gösterir. Nemli havalarda ilk birkaç frenlemede duyulan kısa süreli ses ise disk yüzeyindeki ince pastan kaynaklanabilir ve normaldir.</p>

<h2>Metal metale sürtünme (kalın, hırıltılı ses)</h2>
<p>Balata tamamen bittiğinde balatanın metal taşıyıcısı diske sürtünür. Bu durum hem fren performansını düşürür hem de diski hızla bozar. <strong>Bu sesi duyuyorsanız kontrolü ertelemeyin.</strong></p>

<h2>Tıkırtı veya vuruntu</h2>
<p>Gevşek bir kaliper, aşınmış kaliper pimleri veya balata yuvasındaki boşluklar frenlemede tıkırtıya yol açabilir.</p>

<h2>Frenlemede titreme</h2>
<p>Frenlemede direksiyon veya pedalda hissedilen titreme, genellikle disklerde yüzey bozulmasına (eğilme / düzensiz aşınma) işaret eder.</p>

<h2>Sesle birlikte dikkat edilmesi gerekenler</h2>
<ul>
<li>Fren pedalının yumuşaması veya derine gitmesi</li>
<li>Aracın frenlemede bir tarafa çekmesi</li>
<li>Gösterge panelinde fren uyarı lambası</li>
<li>Jant çevresinde belirgin yanık kokusu</li>
</ul>
<p>Bu belirtilerden biri varsa aracın en kısa sürede kontrol edilmesi gerekir.</p>
""",
    },
    {
        "slug": "aku-zayifladiginda-belirtiler",
        "baslik": "Akü zayıfladığında hangi belirtiler görülür?",
        "ozet": "Aracın geç çalışması, zayıf farlar ve uyarı lambaları: Akü zayıflamasının işaretleri ve soğuk havanın aküye etkisi.",
        "tarih": "2026-09-23",
        "okuma": 3,
        "hizmet": "oto-elektrik",
        "govde": """
<p>Akü, aracı çalıştırmak için gereken enerjiyi sağlar ve motor çalışmıyorken elektrikli donanımları besler. Aküler zamanla kapasite kaybeder; bu kayıp çoğu zaman aniden değil, belirtiler vererek ortaya çıkar.</p>

<h2>Yaygın belirtiler</h2>
<ul>
<li><strong>Marşın ağır basması:</strong> Motor her zamankinden yavaş dönüyor, araç geç çalışıyor.</li>
<li><strong>Soğuk sabahlarda çalışmama:</strong> Soğuk hava akünün verebileceği gücü düşürür.</li>
<li><strong>Zayıf veya titreyen farlar:</strong> Özellikle motor rölantideyken belirgindir.</li>
<li><strong>Gösterge panelinde uyarılar:</strong> Akü / şarj lambası veya rastgele elektronik uyarılar.</li>
<li><strong>Start-stop sisteminin devre dışı kalması:</strong> Birçok araç, akü zayıfladığında bu sistemi çalıştırmaz.</li>
</ul>

<h2>Sorun her zaman akü mü?</h2>
<p>Hayır. Şarj dinamosu aküyü yeterince şarj etmiyorsa veya araçta park halindeyken akım çeken bir arıza varsa, yeni bir akü de kısa sürede boşalır. Bu nedenle akü değişiminden önce <strong>şarj sisteminin ve kaçak akımın</strong> da kontrol edilmesi önemlidir.</p>

<h2>Soğuk iklimde akü</h2>
<p>Göksun gibi kışları soğuk geçen bölgelerde akü daha fazla zorlanır. Kış gelmeden yapılacak bir akü ve şarj kontrolü, soğuk bir sabah yolda kalma riskini azaltır.</p>

<h2>Akünün ömrünü uzatmak için</h2>
<ul>
<li>Sürekli çok kısa mesafe kullanımdan kaçının; akü tam şarj olamaz.</li>
<li>Motor çalışmıyorken farları ve elektrikli donanımları açık bırakmayın.</li>
<li>Kutup başlarının temiz ve sıkı olduğundan emin olun.</li>
</ul>
""",
    },
    {
        "slug": "bilgisayarli-ariza-tespiti-nedir",
        "baslik": "Bilgisayarlı arıza tespiti nedir?",
        "ozet": "Arıza tespit cihazı ne okur, arıza kodu ne anlama gelir ve neden kod okumak tek başına yeterli değildir?",
        "tarih": "2026-09-23",
        "okuma": 3,
        "hizmet": "ariza-tespiti",
        "govde": """
<p>Modern araçlarda motor, şanzıman, ABS, hava yastığı ve konfor sistemleri gibi birçok sistem elektronik kontrol üniteleri tarafından yönetilir. Bilgisayarlı arıza tespiti, bu ünitelere araçtaki <strong>teşhis soketi</strong> üzerinden bağlanarak bilgi okunmasıdır.</p>

<h2>Cihaz neleri okur?</h2>
<ul>
<li><strong>Arıza kodları:</strong> Ünitenin algıladığı ve kaydettiği hatalar.</li>
<li><strong>Canlı veriler:</strong> Motor sıcaklığı, devir, sensör değerleri, yakıt düzeltmeleri gibi anlık bilgiler.</li>
<li><strong>Donmuş çerçeve verileri:</strong> Arızanın oluştuğu andaki çalışma koşulları.</li>
<li>Bazı araçlarda <strong>test ve ayar fonksiyonları</strong> (ör. parça değişimi sonrası adaptasyonlar).</li>
</ul>

<h2>Arıza kodu = arızalı parça değildir</h2>
<p>Bir arıza kodu, sorunun <em>hangi sistemde</em> olduğunu gösterir. Örneğin bir sensör hatası; sensörün kendisinden, kablosundan, soketinden veya sensörün ölçtüğü sistemdeki gerçek bir sorundan kaynaklanabilir. Doğru teşhis, kodun ardından yapılan kontrollerle konur. Bu yaklaşım gereksiz parça değişimini önler.</p>

<h2>Ne zaman arıza tespiti yaptırmalısınız?</h2>
<ul>
<li>Gösterge panelinde herhangi bir uyarı lambası yandığında</li>
<li>Araç çekişten düştüğünde veya güvenli moda geçtiğinde</li>
<li>Yakıt tüketiminde belirgin artış olduğunda</li>
<li>İkinci el araç almadan önce</li>
</ul>
""",
    },
    {
        "slug": "yag-degisimi-neden-onemlidir",
        "baslik": "Yağ değişimi neden önemlidir?",
        "ozet": "Motor yağının görevleri, yağ değişimi geciktiğinde neler olur ve doğru yağ nasıl seçilir?",
        "tarih": "2026-09-23",
        "okuma": 3,
        "hizmet": "periyodik-bakim",
        "govde": """
<p>Motor yağı, motorun hareketli parçaları arasında ince bir film tabakası oluşturarak metal metale teması engeller. Ancak görevi yalnızca yağlamak değildir.</p>

<h2>Motor yağının görevleri</h2>
<ul>
<li><strong>Yağlama:</strong> Sürtünmeyi ve aşınmayı azaltır.</li>
<li><strong>Soğutma:</strong> Motorun iç parçalarındaki ısının bir bölümünü taşır.</li>
<li><strong>Temizleme:</strong> Yanma artıklarını ve kurumu askıda tutarak filtreye taşır.</li>
<li><strong>Koruma:</strong> Korozyona karşı koruma sağlar.</li>
</ul>

<h2>Yağ değişimi gecikirse ne olur?</h2>
<p>Yağ zamanla ısı, yakıt artıkları ve nem nedeniyle özelliğini kaybeder. Kullanım ömrü dolmuş yağ; motorda çamurlaşmaya, turbo gibi hassas parçalarda aşınmaya ve uzun vadede ciddi motor arızalarına yol açabilir.</p>

<h2>Doğru yağ nasıl seçilir?</h2>
<p>Doğru yağ; aracınızın üreticisinin belirttiği <strong>viskozite</strong> (ör. 5W-30) ve <strong>onay standardına</strong> göre seçilir. Özellikle partikül filtreli dizel araçlarda uygun standarttaki yağın kullanılması önemlidir.</p>

<h2>Yağ filtresi de değişmeli</h2>
<p>Yeni yağın eski ve dolmuş bir filtreyle kullanılması, yağın kısa sürede kirlenmesine neden olur. Bu nedenle yağ değişiminde yağ filtresi de değiştirilir.</p>

<h2>Kontrol etmeniz gerekenler</h2>
<ul>
<li>Yağ seviyesini düz zeminde, motor soğukken yağ çubuğu ile düzenli kontrol edin.</li>
<li>Gösterge panelinde yağ basıncı uyarısı yanarsa aracı güvenli şekilde durdurun.</li>
</ul>
""",
    },
]
