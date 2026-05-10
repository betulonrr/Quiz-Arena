# Quiz Arena 

Quiz Arena

Tarayıcı tabanlı, çok kategorili bilgi yarışması oyunudur.
HTML5 · CSS3 · Vanilla JavaScript · Web Audio API · Canvas API


 Önizleme
Oyun; menü ekranı, canlı quiz ekranı ve animasyonlu sonuç ekranından oluşur.
Tek oyunculu rekor modu ve aynı cihazda 2 oyunculu düello modu desteklenmektedir.

  Özellikler

 8 Kategori — Karışık, Bilim, Tarih, Genel Kültür, Spor, Coğrafya, Teknoloji, Matematik
 3 Zorluk Seviyesi — Kolay (20sn/+10p) · Orta (15sn/+20p) · Zor (10sn/+30p)
 2 Oyuncu Modu — Aynı cihazda sıralı düello, canlı puan dengesi çubuğu
 Seri Sistemi — 3+ arka arkaya doğruda animasyonlu ateş serisi
 Otomatik Seviye Atlama — Her 5 soruda zorluk bir kademe artar
 Ses Sistemi — Web Audio API ile algoritmik ses efektleri ve arka plan müziği (harici dosya yok)
 Canvas Zamanlayıcı — Renk geçişli (yeşil→sarı→kırmızı) dairesel geri sayım
 Canvas Grafik — Oyun sonunda her sorunun cevap süresi bar chart olarak gösterilir
 Canvas Konfeti — Kazanma anında 60 parçacıklı fizik tabanlı konfeti animasyonu localStorage Skor Tablosu — Puanlar kalıcı olarak kaydedilir,  kategori/zorluk filtrelemesi var
 TR / EN Dil Desteği — Anlık dil değiştirme, sayfa yenilemesi gerekmez
 Tam Responsive — Mobil, tablet, masaüstü ve yatay mod desteği (5 breakpoint)


 Dosya Yapısı
quiz-arena/
├── index.html          # Tüm ekranlar, SVG ikonlar, semantik HTML
├── css/
│   └── style.css       # Glassmorphism tasarım, animasyonlar, responsive
└── js/
    ├── game.js         # Ana oyun motoru (lokalizasyon, Canvas, skor tablosu)
    ├── questions.js    # Kategori bazlı soru bankası
    └── sound.js        # Web Audio API ses sistemi

 Kullanılan Teknolojiler
TeknolojiKullanım AmacıHTML5 CanvasZamanlayıcı, skor grafiği, konfeti animasyonuCSS Custom PropertiesMerkezi renk/gölge/boyut tema sistemiCSS Keyframe Animasyonlar12+ geçiş ve etkileşim animasyonuCSS Grid & FlexboxResponsive düzen sistemiWeb Audio APIAlgoritmik ses efektleri ve müzik döngüsülocalStorageKalıcı skor tablosu verisiES6+ (Vanilla JS)Tüm oyun mantığı, DOM yönetimi, lokalizasyon

Harici kütüphane veya framework kullanılmamıştır.


 Nasıl Oynanır

Oyuncu adını gir, mod seç (Tek / 2 Oyuncu)
Kategori, zorluk ve soru sayısını belirle
Başla butonuna bas
Her soruda 4 seçenek arasından doğruyu bul, süre dolmadan cevapla
Oyun sonunda istatistiklerini ve cevap süresi grafiğini incele
Rekoru kırmak için tekrar oyna!


 Notlar

Kodlar bölüm başlıklarıyla ayrılmış ve yorum satırlarıyla açıklanmıştır
Tüm ekranlar tek index.html içinde yönetilmekte, JS ile görünürlük toggle edilmektedir
Ses sistemi tarayıcı otomatik ses engelini aşmak için lazy initialization kullanır
