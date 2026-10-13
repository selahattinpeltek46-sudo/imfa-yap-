// Üçel katalog ortak stil (katalog8): A4 sayfa + telefon görünümü. Fotoğraflar inline --foto değişkeniyle verilir.
export const STIL = `
@page { size:A4; margin:0; }
:root { --ink:#1B1B1D; --altin:#C9A66E; --altin-k:#8a6a3c; --krem:#F6F3EE; --cer:#F1EDE6; --cizgi:#E4DED3; --gri:#5c5850; --wa:#13843F;
  --kenar:16mm; }
* { box-sizing:border-box; } html { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
body { margin:0; font:400 10pt/1.5 Inter,sans-serif; color:var(--ink); background:#d9d4ca; }
img { display:block; max-width:100%; } p,h1,h2,h3,ul,figure { margin:0; } a { color:inherit; text-decoration:none; }
h1,h2,h3 { font-family:Oswald,sans-serif; font-weight:600; line-height:1.1; }
.et { font:700 8pt/1 Inter; letter-spacing:.24em; text-transform:uppercase; color:var(--altin-k); }
.page { width:210mm; height:297mm; overflow:hidden; position:relative; background:#fff; margin:0 auto; break-after:page; }
@media screen and (min-width:601px) { body { padding:10mm 0; } .page { margin-bottom:10mm; box-shadow:0 2mm 8mm rgba(0,0,0,.15); } }
.ik { width:5mm; height:5mm; color:var(--altin-k); flex:none; }
.k-marka b { display:block; font:700 30pt/1 Oswald; letter-spacing:.28em; margin:6mm 0 0 .28em; } .k-marka span { display:block; font:600 9pt/1 Inter; letter-spacing:.42em; color:var(--altin); margin:3mm 0 0 .42em; }

/* sistem parçaları */
.sekme { position:absolute; right:0; top:calc(30mm + var(--sira) * 46mm); width:9mm; height:42mm; background:var(--altin); border-radius:2mm 0 0 2mm; display:grid; place-items:center; z-index:3; }
.sekme span { writing-mode:vertical-rl; white-space:nowrap; font:700 7.5pt/1 Inter; letter-spacing:.2em; text-transform:uppercase; color:var(--ink); }
.sno { position:absolute; right:var(--kenar); bottom:6mm; width:11mm; height:11mm; z-index:3; } .sno .disli { width:100%; height:100%; }
.dcizgi { display:flex; align-items:center; gap:3mm; } .dcizgi span { flex:1; height:2mm; background:linear-gradient(var(--altin),var(--altin)) center/100% .35mm no-repeat, repeating-linear-gradient(90deg,var(--altin) 0 .8mm,transparent .8mm 2.4mm) center/100% 1.6mm no-repeat; opacity:.8; } .dcizgi img { width:8mm; height:8mm; }
.dcizgi.ince { margin:0 var(--kenar); }
.qrc { width:24mm; height:24mm; background:#fff; padding:1.8mm; border-radius:1.5mm; outline:.5mm solid var(--altin); outline-offset:.8mm; } .qrc svg { width:100%; height:100%; }

/* 1 · KAPAK */
.kapak { background:var(--ink); color:#fff; display:flex; flex-direction:column; }
.k-ust { padding:22mm 18mm 0; text-align:center; } .k-logo { width:34mm; height:34mm; margin:0 auto; }
.k-cizgi { display:flex; align-items:center; gap:3mm; width:60mm; margin:8mm auto; } .k-cizgi span { flex:1; height:.4mm; background:var(--altin); } .k-cizgi i { width:2.2mm; height:2.2mm; background:var(--altin); transform:rotate(45deg); }
.kapak .et, .ara .et, .arka .et { color:var(--altin); } .kapak h1 { font-size:34pt; margin:5mm 0 4mm; } .k-alt { color:#cfccc6; font-size:11pt; max-width:140mm; margin:0 auto; }
.k-foto { flex:1; margin-top:8mm; background:var(--foto) center 45%/cover; position:relative; }
.k-foto:before, .k-foto:after { content:''; position:absolute; left:0; right:0; height:35%; } .k-foto:before { top:0; background:linear-gradient(var(--ink),transparent); } .k-foto:after { bottom:0; background:linear-gradient(transparent,var(--ink)); }
.k-dip { display:grid; grid-template-columns:1fr 1fr 50mm; gap:8mm; padding:2mm 18mm 16mm; align-items:start; position:relative; z-index:1; } .k-tel { align-self:end; }
.k-grup .et { padding-bottom:2.5mm; border-bottom:.4mm solid var(--altin); margin-bottom:1mm; } .k-sat { font:600 11.5pt Oswald; padding:1.6mm 0; border-bottom:.2mm solid #34343a; } .k-sat span { color:var(--altin); margin-right:3mm; }
.k-tel { text-align:right; } .k-tel b { display:block; font:700 18pt Oswald; letter-spacing:.03em; } .k-tel span { font-size:8.5pt; color:#b9b5ad; }

/* 2 · ARA KAPAK */
.ara { background:var(--ink); color:#fff; }
.a-foto { position:absolute; inset:0 0 auto 0; height:150mm; background:var(--foto) center 40%/cover; }
.a-foto:after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,rgba(27,27,29,.25),rgba(27,27,29,.55) 55%,var(--ink)); }
.a-ic { position:absolute; left:var(--kenar); right:calc(var(--kenar) + 6mm); top:118mm; }
.ara h2 { font-size:44pt; margin:4mm 0 6mm; } .ara .dcizgi { margin-bottom:6mm; } .a-yazi { font-size:12pt; color:#d6d2cb; max-width:150mm; margin-bottom:10mm; } .a-yazi b { color:#fff; }
.a-liste { display:grid; gap:4mm; }
.a-urun { display:grid; grid-template-columns:30mm 12mm 1fr auto; gap:4mm; align-items:center; background:#242427; border:.25mm solid #333337; border-radius:2.5mm; padding:2.5mm; }
.a-th { height:21mm; background:var(--cer); border-radius:1.5mm; overflow:hidden; } .a-th img { width:100%; height:100%; object-fit:contain; padding:1.5mm; mix-blend-mode:multiply; }
.a-urun .n { font:700 18pt Oswald; color:var(--altin); } .a-urun b { font:600 16pt Oswald; } .a-urun .s { font-size:8.5pt; color:#a9a59d; padding-right:3mm; }
.ara .sno .disli { filter:none; }

/* 3 · ÜRÜN — sabit iskelet */
.urun { display:flex; flex-direction:column; }
.u-ust { display:grid; grid-template-columns:24mm 1fr; gap:4mm; align-items:start; padding:14mm calc(var(--kenar) + 8mm) 5mm var(--kenar); height:44mm; }
.no { font:700 42pt/0.9 Oswald; color:var(--altin); } .u-ust h2 { font-size:30pt; margin:2.5mm 0 1.5mm; } .fayda { font-size:11pt; color:var(--gri); }
.u-foto { position:relative; margin:5mm calc(var(--kenar) + 8mm) 0 var(--kenar); height:88mm; background:var(--cer); border-radius:3mm; padding:6mm 8mm 9mm; }
.u-foto:after { content:''; position:absolute; left:18%; right:18%; bottom:6.5mm; height:5mm; background:radial-gradient(ellipse at center,rgba(40,35,28,.32),transparent 70%); }
.u-foto img { position:relative; z-index:1; width:100%; height:100%; object-fit:contain; mix-blend-mode:multiply; }
.u-bilgi { display:grid; grid-template-columns:1.1fr 1fr; gap:8mm; margin:6mm calc(var(--kenar) + 8mm) 0 var(--kenar); height:84mm; }
.u-bilgi h3 { font-size:12pt; margin-bottom:2mm; }
.u-tablo table { width:100%; border-collapse:collapse; font-size:8.6pt; } .u-tablo th, .u-tablo td { text-align:left; padding:1.55mm 0; border-top:.25mm solid var(--cizgi); vertical-align:top; } .u-tablo tr:last-child th, .u-tablo tr:last-child td { border-bottom:.25mm solid var(--cizgi); }
.u-tablo th { font-weight:600; width:55%; padding-right:3mm; } .bekle { color:#a09a90; font-style:italic; }
.u-tablo .ara-sat th { font:700 6.8pt Inter; letter-spacing:.18em; text-transform:uppercase; color:var(--altin-k); padding-top:2.5mm; border-top:.4mm solid var(--altin); }
.u-yan { border-left:.25mm solid var(--cizgi); padding-left:7mm; } .hk { font-size:9.5pt; color:#3a3a3d; padding-bottom:4mm; margin-bottom:4mm; border-bottom:.25mm solid var(--cizgi); }
.ikonlar { display:grid; grid-template-columns:repeat(3,1fr); gap:2mm; margin-bottom:5mm; } .ikonlar div { background:var(--krem); border-radius:2mm; padding:3mm 1.5mm 2.5mm; text-align:center; font-size:8pt; font-weight:600; } .ikonlar .ik { width:8mm; height:8mm; margin:0 auto 1.5mm; display:block; }
.sec { list-style:none; padding:0; display:grid; gap:2mm; } .sec li { display:flex; align-items:center; gap:2.5mm; font-size:9pt; font-weight:600; }
.u-sahadan { display:grid; grid-template-columns:20mm 1fr 1fr; gap:4mm; align-items:start; margin:4mm calc(var(--kenar) + 8mm) 0 var(--kenar); }
.u-sahadan .et { padding-top:2mm; line-height:1.4; } .u-sahadan img { height:24mm; width:100%; object-fit:cover; border-radius:2mm; } .u-sahadan figcaption { font-size:7.2pt; color:var(--gri); margin-top:1mm; }
.u-bant { position:absolute; left:0; right:0; bottom:0; height:34mm; background:var(--ink); color:#fff; display:grid; grid-template-columns:auto 1fr auto; gap:6mm; align-items:center; padding:0 calc(var(--kenar) + 16mm) 0 var(--kenar); }
.u-cta b { display:block; font:600 14pt Oswald; } .u-cta span { font-size:8.5pt; color:#b9b5ad; } .u-wa { display:none; }
.u-tel { text-align:right; } .u-tel b { display:block; font:700 17pt Oswald; color:var(--altin); letter-spacing:.03em; } .u-tel span { font-size:7.5pt; color:#b9b5ad; }
.urun .sno { bottom:11.5mm; }

/* 4 · ARKA KAPAK */
.arka { background:var(--ink); color:#fff; display:flex; flex-direction:column; align-items:center; text-align:center; padding:26mm var(--kenar) 0; }
.b-logo { width:26mm; height:26mm; margin:0 auto; } .arka .dcizgi { width:120mm; margin:8mm auto; }
.b-tel { display:block; font:700 40pt/1 Oswald; color:var(--altin); letter-spacing:.03em; margin:5mm 0 3mm; } .b-alt { color:#b9b5ad; font-size:10pt; }
.b-qrlar { display:grid; grid-template-columns:repeat(3,1fr); gap:8mm; width:100%; margin-top:16mm; }
.b-qr { background:#242427; border:.25mm solid #333337; border-radius:3mm; padding:7mm 4mm 6mm; } .b-qr .qrc { width:30mm; height:30mm; margin:0 auto 5mm; } .b-qr .ik { color:var(--altin); width:6mm; height:6mm; margin:0 auto 1.5mm; display:block; } .b-qr b { display:block; font:600 13pt Oswald; } .b-qr span { font-size:8.5pt; color:#a9a59d; }
.b-hiz { margin-top:14mm; } .b-hiz p:last-child { font:600 14pt Oswald; margin-top:3mm; } .b-hiz i { display:inline-block; width:1.8mm; height:1.8mm; background:var(--altin); transform:rotate(45deg); margin:0 4mm; vertical-align:middle; }
.b-adres { margin-top:auto; width:calc(100% + 2 * var(--kenar)); display:flex; gap:4mm; align-items:center; justify-content:center; padding:7mm; border-top:.25mm solid #333337; font-size:9.5pt; color:#b9b5ad; } .b-adres b { color:#fff; margin-right:3mm; } .b-adres .ik { color:var(--altin); }

/* TELEFON */
@media screen and (max-width:600px) {
  body { background:#fff; font-size:16px; }
  .page { width:auto; height:auto; overflow:visible; } .sekme, .sno { display:none; }
  .ik { width:20px; height:20px; }
  .k-ust { padding:40px 16px 0; } .k-logo { width:96px; height:96px; } .k-marka b { font-size:34px; } .k-marka span { font-size:11px; }
  .k-cizgi { width:180px; margin:24px auto; } .et { font-size:12px; } .kapak h1 { font-size:38px; margin:16px 0 12px; } .k-alt { font-size:16px; }
  .k-foto { flex:none; height:260px; margin-top:24px; }
  .k-dip { grid-template-columns:1fr; padding:0 16px 32px; gap:24px; } .k-sat { font-size:19px; padding:9px 0; } .k-tel { text-align:center; } .k-tel b { font-size:28px; }
  .ara { padding-bottom:32px; } .a-foto { position:relative; height:240px; } .a-ic { position:relative; left:auto; right:auto; top:auto; padding:0 16px; margin-top:-40px; }
  .ara h2 { font-size:40px; margin:12px 0 18px; } .ara .dcizgi { margin-bottom:18px; } .dcizgi span { height:8px; } .dcizgi img { width:28px; height:28px; } .a-yazi { font-size:16px; margin-bottom:24px; }
  .a-urun { grid-template-columns:96px 1fr; gap:4px 14px; padding:10px; border-radius:12px; } .a-th { height:72px; border-radius:8px; } .a-urun .n { font-size:18px; display:none; } .a-urun b { font-size:21px; } .a-urun .s { display:none; }
  .u-ust { grid-template-columns:auto 1fr; padding:32px 16px 16px; height:auto; gap:14px; } .no { font-size:48px; } .u-ust h2 { font-size:36px; } .fayda { font-size:17px; }
  .dcizgi.ince { margin:0 16px; }
  .u-foto { margin:16px 16px 0; height:auto; aspect-ratio:4/3; padding:14px 16px 24px; } .u-foto:after { bottom:16px; height:16px; }
  .u-bilgi { grid-template-columns:1fr; margin:24px 16px 0; height:auto; gap:28px; } .u-bilgi h3 { font-size:22px; margin-bottom:12px; }
  .u-tablo table { font-size:15px; } .u-tablo th, .u-tablo td { padding:10px 0; } .u-tablo .ara-sat th { font-size:11px; padding-top:14px; }
  .u-yan { border:0; padding:0; } .hk { font-size:16px; padding-bottom:16px; margin-bottom:20px; } .ikonlar { gap:8px; margin-bottom:24px; } .ikonlar div { font-size:13.5px; padding:14px 6px 12px; border-radius:10px; } .ikonlar .ik { width:30px; height:30px; margin-bottom:6px; } .sec li { font-size:16px; gap:10px; } .sec { gap:10px; }
  .u-sahadan { grid-template-columns:1fr 1fr; margin:28px 16px 0; gap:10px; } .u-sahadan .et { grid-column:span 2; } .u-sahadan img { height:auto; aspect-ratio:4/3; border-radius:8px; } .u-sahadan figcaption { font-size:12.5px; }
  .u-bant { position:static; height:auto; grid-template-columns:1fr; margin-top:28px; padding:24px 16px; gap:14px; } .u-bant .qrc, .u-cta { display:none; }
  .u-wa { display:flex; align-items:center; justify-content:center; gap:8px; min-height:54px; border-radius:10px; background:var(--wa); font:700 17px Inter; } .u-wa .ik { color:#fff; width:22px; height:22px; }
  .u-tel { text-align:center; } .u-tel b { font-size:28px; } .u-tel span { font-size:13px; }
  .arka { padding:40px 16px 0; } .b-logo { width:72px; height:72px; } .arka .dcizgi { width:100%; margin:20px 0; } .b-tel { font-size:42px; } .b-alt { font-size:14px; }
  .b-qrlar { grid-template-columns:1fr; gap:10px; margin-top:28px; } .b-qr { display:grid; grid-template-columns:auto 1fr; text-align:left; align-items:center; gap:2px 12px; padding:14px 16px; border-radius:12px; } .b-qr .qrc { display:none; } .b-qr .ik { grid-row:span 2; width:28px; height:28px; margin:0; } .b-qr b { font-size:20px; } .b-qr span { font-size:14px; }
  .b-hiz { margin-top:32px; } .b-hiz p:last-child { font-size:18px; line-height:1.9; } .b-hiz i { margin:0 8px; width:6px; height:6px; }
  .b-adres { margin-top:32px; width:calc(100% + 32px); padding:20px 16px; font-size:14px; flex-direction:column; } .b-adres b { display:block; margin:0 0 4px; }
}`;
