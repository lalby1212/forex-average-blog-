/* ── DATA G10 — Mise à jour 28 Avril 2026 ── */
let CURR = [
  {
    code:'USD', flag:'🇺🇸', name:'Dollar US', bank:'Federal Reserve',
    rate:'3.50-3.75%', score:-1.0,
    bias:'LÉG. BAISSIER', biasCls:'bt-ldov',
    keyData:[['PCE/Core','2.7%'],['Fed','3.50-3.75%'],['FOMC','28-29 Avr. · Hold · Ton hawkish']],
    pillars:{
      monetary:  {score:-0.5, wt:'40%'},
      inflation: {score:-0.5, wt:'20%'},
      growth:    {score:0.5,  wt:'15%'},
      employment:{score:0.0,  wt:'15%'},
      risk:      {score:-3.0, wt:'10%'},
    },
    detail:{
      monetary:{rows:[{k:'Taux actuel',v:'3.50–3.75% (inchangé depuis janv.)'},{k:'Prévision Fed',v:'1 seul cut signalé en 2026',c:'neutral'},{k:'FOMC Avril',v:'Décision 29 Avr. · Hold quasi-certain',c:'neutral'},{k:'Marché vs Fed',v:'Price légèrement plus de cuts que Fed',c:'bear'},{k:'PCE/Core PCE',v:'2.7% · Au-dessus cible',c:'bear'}],pr:'Fed en mode attentiste : tient les taux à 3.50-3.75% et ne signale qu\'un seul cut pour 2026. Inflation PCE à 2.7% au-dessus de la cible = pas d\'urgence à couper. FOMC du 29 Avril devrait confirmer le hold.'},
      inflation:{rows:[{k:'PCE 2026 (prévision)',v:'2.7% · Révisé à la hausse',c:'bear'},{k:'Core PCE',v:'2.7% · Au-dessus cible 2%',c:'bear'},{k:'Driver',v:'Énergie + tarifs douaniers',c:'bear'},{k:'Impact Fed',v:'Empêche les cuts agressifs',c:'neutral'}],pr:'Inflation plus haute qu\'attendu en 2026 (PCE révisé de 2.4% à 2.7%). Les tarifs douaniers et l\'énergie alimentent la pression inflationniste. La Fed ne peut pas couper agressivement.'},
      growth:{rows:[{k:'GDP 2026 (prévision)',v:'2.4% · Révisé à la hausse',c:'bull'},{k:'GDP 2027',v:'2.3% · Révisé à la hausse',c:'bull'},{k:'Tarifs douaniers',v:'Incertitude élevée sur commerce',c:'bear'},{k:'Consommateur',v:'Sous pression énergie + tarifs',c:'bear'}],pr:'GDP révisé à la hausse (2.4% vs 2.3% préc.) = signal positif. Mais les tarifs douaniers créent une incertitude élevée. La croissance tient mais les risques sont à la baisse.'},
      employment:{rows:[{k:'Chômage prévu',v:'4.4% · Stable',c:'neutral'},{k:'Marché emploi',v:'Toujours solide mais se normalise',c:'neutral'},{k:'Salaires',v:'Refroidissement graduel',c:'neutral'}],pr:'Emploi toujours solide (4.4%) mais en légère détente. Pas de signal d\'alarme mais plus le moteur de 2024. Facteur neutre.'},
      risk:{rows:[{k:'Tarifs douaniers',v:'Risque stagflationniste',c:'bear'},{k:'Dédollarisation',v:'Achats BC Or · Flux hors USD',c:'bear'},{k:'FOMC 29 Avr.',v:'Hold attendu · Pas de catalyseur',c:'neutral'},{k:'GDP 2.4%',v:'Solide · Atténue le bearish',c:'bull'}],pr:'USD sans catalyseur fort : Fed dovish marginal, tarifs créent de l\'incertitude, dédollarisation continue. GDP révisé à la hausse atténue le bearish mais ne l\'inverse pas.'},
    },
    pricing:'FOMC 28-29 Avr. → hold 94% prob. · Ton hawkish attendu (pétrole $96 · inflation upside). DXY ~98.5 (rebond). Cuts 2026 repoussés · 1 seul cut possible CT.',
    concl:'USD NEUTRE/LÉG. HAUSSIER CT : FOMC 28-29 Avr. hold + pétrole $96 = inflation upside = ton hawkish. DXY ~98.5 · rebond partiel. Dédollarisation = frein LT. Neutre CT, surveiller FOMC statement.',
  },
  {
    code:'EUR', flag:'🇪🇺', name:'Euro', bank:'BCE',
    rate:'2.00%', score:0.5,
    bias:'LÉG. HAUSSIER', biasCls:'bt-lhawk',
    keyData:[['HICP 2026','2.6%'],['ECB','2.00%'],['GDP 2026','0.9%']],
    pillars:{monetary:{score:1.5,wt:'40%'},inflation:{score:-0.5,wt:'20%'},growth:{score:-1.5,wt:'15%'},employment:{score:0.0,wt:'15%'},risk:{score:1.5,wt:'10%'}},
    detail:{
      monetary:{rows:[{k:'Taux actuel',v:'2.00% dépôt · 2.15% refi (hold mars)',c:'bull'},{k:'ECB vs Fed',v:'ECB stable → différentiel favorable EUR',c:'bull'},{k:'Guidance',v:'Pause prolongée · Pas de cut CT',c:'bull'},{k:'Prochain meeting',v:'30 Avril · Status quo attendu',c:'neutral'}],pr:'ECB tient à 2.00% (dépôt) en pause pendant que la Fed est sous pression de couper. Le différentiel se resserre en faveur de l\'EUR. Pas de cut immédiat en vue.'},
      inflation:{rows:[{k:'HICP 2026 (prévision)',v:'2.6% · Révisé à la hausse',c:'bear'},{k:'HICP 2027',v:'2.0% · Retour cible',c:'bull'},{k:'Driver',v:'Conflit Moyen-Orient → énergie',c:'bear'},{k:'Risques',v:'Upside inflation · Downside growth',c:'bear'}],pr:'Inflation eurozone révisée à 2.6% pour 2026 (retour à 2% en 2027). La guerre au Moyen-Orient est le principal driver via l\'énergie. Argument pour que l\'ECB reste en pause.'},
      growth:{rows:[{k:'GDP 2026 (prévision)',v:'0.9% · Coupé significativement',c:'bear'},{k:'GDP 2027',v:'1.3%',c:'neutral'},{k:'Driver négatif',v:'Choc pétrolier + confiance + commerce',c:'bear'},{k:'Q1',v:'Légèrement meilleur qu\'attendu',c:'bull'}],pr:'GDP coupé à 0.9% pour 2026 — impact du conflit Moyen-Orient sur revenus réels, confiance et commerce. C\'est le principal point faible de l\'EUR CT.'},
      employment:{rows:[{k:'Chômage Zone €',v:'Stable · ~6%',c:'neutral'},{k:'Signal',v:'Pas de détérioration visible',c:'neutral'}],pr:'Emploi stable dans la zone €. Pas d\'alerte. Facteur neutre.'},
      risk:{rows:[{k:'Rotation hors USD',v:'EUR bénéficiaire principal',c:'bull'},{k:'EUR/USD',v:'~1.178 · Direction haussière',c:'bull'},{k:'GDP 0.9%',v:'Frein fondamental à l\'upside',c:'bear'},{k:'ECB vs Fed',v:'ECB stable = avantage yield relatif',c:'bull'}],pr:'Rotation hors USD continue à favoriser l\'EUR. ECB stable + incertitude Fed = EUR soutenu. Frein : GDP 2026 à seulement 0.9% limite l\'upside CT.'},
    },
    pricing:'EUR/USD ~1.171 · ECB 2.00% en pause · Pétrole $108 = pression inflation zone €. FOMC 28-29 Avr. = direction EUR/USD. GDP 0.9% frein persistant.',
    concl:'EUR NEUTRE/LÉG. HAUSSIER : EUR/USD 1.171 · ECB stable. FOMC hawkish = pression EUR CT. GDP 0.9% + pétrole $108 = freins. Range 1.150-1.185 CT.',
  },
  {
    code:'GBP', flag:'🇬🇧', name:'Livre Sterling', bank:'Banque d\'Angleterre',
    rate:'3.75%', score:0.0,
    bias:'NEUTRE', biasCls:'bt-neu',
    keyData:[['BoE','3.75%'],['CPI','3.0-3.5%'],['GDP 2026','0.7%']],
    pillars:{monetary:{score:1.0,wt:'40%'},inflation:{score:-0.5,wt:'20%'},growth:{score:-1.5,wt:'15%'},employment:{score:0.0,wt:'15%'},risk:{score:0.5,wt:'10%'}},
    detail:{
      monetary:{rows:[{k:'Taux actuel',v:'3.75% (hold unanime mars)',c:'bull'},{k:'Prochain vote',v:'30 Avr. · 90% prob. hold',c:'neutral'},{k:'Signal BoE',v:'CPI 3.0-3.5% empêche cuts immédiats',c:'bull'},{k:'Risque',v:'5/50 analystes cherchent un hike 30 Avr.',c:'neutral'}],pr:'BoE à 3.75% maintenu à l\'unanimité en mars. 90% des analystes voient un hold le 30 Avril. CPI 3.0-3.5% empêche tout pivot dovish immédiat. Le taux élevé soutient le GBP mais la croissance est le problème.'},
      inflation:{rows:[{k:'CPI UK fév.',v:'3.0% · Inchangé vs janv.',c:'bear'},{k:'Prévision BoE',v:'3.0-3.5% en T2-T3 2026',c:'bear'},{k:'Driver',v:'Énergie (Moyen-Orient) + services',c:'bear'},{k:'Signal',v:'CPI élevé repousse les cuts',c:'bull'}],pr:'CPI à 3.0% en fév., BoE anticipe 3.0-3.5% en T2-T3 2026. L\'énergie est le driver principal. Inflation élevée = BoE ne peut pas couper → paradoxalement supportif GBP.'},
      growth:{rows:[{k:'GDP 2026 (OCDE)',v:'0.7% · Pire impact G20 avancé',c:'bear'},{k:'Révision',v:'1.2% initial → 0.7% actuel',c:'bear'},{k:'Driver',v:'Plus forte exposition conflit Moyen-Orient',c:'bear'},{k:'Consommateur',v:'Sous pression énergie + inflation',c:'bear'}],pr:'UK = pays le PLUS impacté du G20 avancé par le conflit Moyen-Orient selon l\'OCDE. GDP 2026 coupé à 0.7%. C\'est le frein fondamental principal du GBP.'},
      employment:{rows:[{k:'Chômage LFS',v:'~5.2% · Légère hausse',c:'neutral'},{k:'Salaires',v:'Refroidissement graduel',c:'neutral'}],pr:'Marché du travail se normalise. Pas d\'alarme mais pas de support non plus. Facteur neutre.'},
      risk:{rows:[{k:'Régime',v:'Risk-on · GBP bénéficie',c:'bull'},{k:'GBP/USD',v:'~1.320 · USD faible aide',c:'bull'},{k:'GDP 0.7%',v:'Pire G20 avancé = plafond fondamental',c:'bear'},{k:'BoE 30 Avr.',v:'5/50 pro-hike → volatilité possible',c:'neutral'}],pr:'GBP tiraillé : taux élevés + USD faible = support · Mais GDP 0.7% + plus forte exposition UK au conflit = frein. NEUTRE avec légère incertitude autour du BoE 30 Avr.'},
    },
    pricing:'GBP/USD ~1.341 · BoE 3.75% hold prévu 30 Avr. · CPI 3.0-3.5% · GDP 2026 0.7% (pire G20 avancé). GBP fort malgré Brent $108 (UK importateur).',
    concl:'GBP NEUTRE/LÉG. HAUSSIER CT : GBP/USD 1.341 · taux BoE 3.75% + USD léger rebond = compétition. BoE 30 Avr. = catalyseur. GDP 0.7% = frein. Pétrole $108 = pression UK.',
  },
  {
    code:'JPY', flag:'🇯🇵', name:'Yen Japonais', bank:'Banque du Japon',
    rate:'0.75%', score:0.0,
    bias:'NEUTRE', biasCls:'bt-neu',
    keyData:[['BoJ','0.75% HOLD · 3/9 dissenters pro-hike'],['USD/JPY','~158.0'],['Hike Juil.','Scénario CT post-BoJ hawkish']],
    pillars:{monetary:{score:1.0,wt:'40%'},inflation:{score:0.5,wt:'20%'},growth:{score:1.0,wt:'15%'},employment:{score:1.0,wt:'15%'},risk:{score:-3.0,wt:'10%'}},
    detail:{
      monetary:{rows:[{k:'Taux actuel',v:'0.75% (max depuis 1995)',c:'bull'},{k:'Réunion BoJ',v:'27-28 Avril 2026 · Décision imminente',c:'neutral'},{k:'Prob. hike Avr.',v:'~10% · Très peu probable',c:'bear'},{k:'Ueda',v:'Signaux prudents · Pèse Iran/géopo',c:'bear'},{k:'Juillet',v:'Hike juillet = scénario central post-Avr.',c:'bull'}],pr:'BoJ à 0.75% (max 30 ans). Mais le hike d\'avril est devenu très improbable (~10%) suite aux signaux prudents d\'Ueda face aux tensions géopolitiques. Le report à juillet semble désormais le scénario central.'},
      inflation:{rows:[{k:'Core CPI mars',v:'1.8% · Légèrement en baisse',c:'neutral'},{k:'Tokyo gauge',v:'1.7% · Refroidissement léger',c:'neutral'},{k:'Target BoJ',v:'2% · Pas encore atteint',c:'neutral'},{k:'Perspective',v:'Pression à la hausse via pétrole',c:'bull'}],pr:'CPI core à 1.8%, légèrement sous la cible de 2%. Refroidissement marginal du CPI Tokyo à 1.7%. La pression pétrolière via le Moyen-Orient devrait remonter l\'inflation en T2-T3.'},
      growth:{rows:[{k:'GDP Japon',v:'Au-dessus du potentiel',c:'bull'},{k:'Shunto 2026',v:'+5.2% salaires · Record historique',c:'bull'},{k:'Tankan Q1',v:'Prudent · Moyen-Orient = incertitude',c:'neutral'},{k:'Exportations',v:'JPY faible booste compétitivité',c:'bull'}],pr:'Fondamentaux japonais toujours solides. Shunto +5.2% = cercle vertueux. Mais le Moyen-Orient crée de l\'incertitude sur le Tankan. Croissance reste au-dessus du potentiel.'},
      employment:{rows:[{k:'Chômage',v:'2.4% · Quasi-plein emploi',c:'bull'},{k:'Salaires',v:'+5.2% YoY · Record 2026',c:'bull'},{k:'Marché emploi',v:'Ultra-serré',c:'bull'}],pr:'Plein emploi + salaires records = conditions idéales pour normalisation. L\'argument dovish sur l\'emploi n\'existe plus. Le seul frein est géopolitique.'},
      risk:{rows:[{k:'Carry trade',v:'USD/JPY 160 · Carry actif',c:'bear'},{k:'Hike Avr.',v:'~10% prob. → catalyseur immédiat faible',c:'bear'},{k:'Hike Juillet',v:'Scénario central · Catalyseur à MT',c:'bull'},{k:'Géopolitique',v:'Iran = argument pour reporter',c:'bear'}],pr:'USD/JPY à 160 = carry trade très tendu. Avec hike avril peu probable (~10%), le catalyseur immédiat disparaît. Hike juillet = scénario central. JPY NEUTRE à CT, haussier à MT.'},
    },
    pricing:'USD/JPY ~158.0 · BoJ HOLD 28 Avr. (6-3 · 3 pro-hike) · Inflation révisée 2.8% · Growth coupé 0.5%. JPY légèrement fort post-décision. Hike juillet renforcé (3 dissenters).',
    concl:'JPY NEUTRE/LÉG. HAUSSIER : BoJ HOLD mais 3 dissenters = signal hawkish MT. USD/JPY 158.0 (JPY légèrement fort). Inflation 2.8% BoJ = argument prochain hike juil. Longs JPY vs USD.',
  },
  {
    code:'CHF', flag:'🇨🇭', name:'Franc Suisse', bank:'BNS / SNB',
    rate:'0.00%', score:1.5,
    bias:'HAUSSIER', biasCls:'bt-hawk',
    keyData:[['USD/CHF','0.792'],['EUR/CHF','0.927'],['SNB','0.00%']],
    pillars:{monetary:{score:-2.0,wt:'40%'},inflation:{score:-1.0,wt:'20%'},growth:{score:0.0,wt:'15%'},employment:{score:0.5,wt:'15%'},risk:{score:5.0,wt:'10%'}},
    detail:{
      monetary:{rows:[{k:'Taux actuel',v:'0.00% · SNB = plancher effectif',c:'bear'},{k:'Biais SNB',v:'Dovish · Interventionniste',c:'bear'},{k:'Outlook 2026',v:'Aucun changement attendu',c:'bear'},{k:'Intervention',v:'SNB prêt à vendre CHF · Impuissant',c:'neutral'}],pr:'SNB à 0.00% — plancher effectif. Aucun changement attendu en 2026, premier hike reporté à 2027. SNB prêt à intervenir pour limiter l\'appréciation du CHF mais les flux sont trop massifs.'},
      inflation:{rows:[{k:'Inflation CH 2026',v:'0.5% · La plus basse du G10',c:'bear'},{k:'Forecast SNB',v:'0.5% en 2026-2027',c:'bear'},{k:'CHF fort',v:'Importe la désinflation',c:'neutral'},{k:'Conséquence',v:'SNB sans argument pour monter',c:'bear'}],pr:'Inflation suisse à 0.5% — la plus basse du G10. Le CHF fort est lui-même déflationniste. La SNB n\'a aucune raison de monter les taux. Paradoxe : taux 0% mais CHF très fort.'},
      growth:{rows:[{k:'Croissance CH',v:'Modeste mais résiliente',c:'neutral'},{k:'Secteur financier',v:'Bénéficie des flux de capitaux',c:'bull'},{k:'CHF fort',v:'Pénalise exports légèrement',c:'bear'}],pr:'Économie suisse résiliente malgré le CHF fort. Secteur financier = bouclier. SNB impuissant face aux flux massifs.'},
      employment:{rows:[{k:'Chômage CH',v:'~2.5% · Structurellement bas',c:'bull'}],pr:'Plein emploi structurel. Facteur positif mais non driver FX.'},
      risk:{rows:[{k:'Safe haven',v:'CHF = destination principale géopo',c:'bull'},{k:'USD/CHF',v:'0.782 · Niveau extrême bas',c:'bull'},{k:'EUR/CHF',v:'0.920 · CHF fort vs EUR aussi',c:'bull'},{k:'Rotation USD',v:'Flux massifs hors USD → CHF',c:'bull'}],pr:'CHF fort même en risk-on = signal exceptionnel. La géopolitique (Moyen-Orient) + rotation hors USD = double catalyseur. USD/CHF à 0.782 = CHF au plus fort depuis des années. SNB débordé.'},
    },
    pricing:'USD/CHF 0.782 · EUR/CHF 0.920 · SNB 0.00% · Inflation 0.5% (plus basse G10). CHF structurellement fort : safe haven + rotation hors USD dominent.',
    concl:'CHF HAUSSIER : SNB à 0.00% mais CHF reste très fort. Flux géopolitiques + rotation hors USD = invincibles. USD/CHF 0.782, cible 0.75-0.76. Long CHF = position de conviction.',
  },
  {
    code:'AUD', flag:'🇦🇺', name:'Dollar Australien', bank:'RBA',
    rate:'4.10%', score:1.5,
    bias:'HAUSSIER', biasCls:'bt-hawk',
    keyData:[['RBA','4.10%'],['AUD/USD','0.700'],['Pic prévu','4.85%']],
    pillars:{monetary:{score:2.0,wt:'40%'},inflation:{score:1.5,wt:'20%'},growth:{score:0.5,wt:'15%'},employment:{score:1.0,wt:'15%'},risk:{score:-1.5,wt:'10%'}},
    detail:{
      monetary:{rows:[{k:'Taux actuel',v:'4.10% · 2e hausse consécutive mars',c:'bull'},{k:'RBA fév.',v:'1er hike depuis nov. 2023 → 3.85%',c:'bull'},{k:'RBA mars',v:'2e hike → 4.10%',c:'bull'},{k:'Pic attendu',v:'4.85% selon Westpac · Hikes à venir',c:'bull'},{k:'Biais',v:'Hawkish actif · Inflation trop forte',c:'bull'}],pr:'RBA en mode hawkish actif : a relevé 2 fois de suite pour la première fois depuis 2023. Taux à 4.10% et Westpac anticipe un pic à 4.85%. Différentiel de taux parmi les plus attractifs du G10.'},
      inflation:{rows:[{k:'CPI Australie',v:'Au-dessus cible 2-3% · Persistant',c:'bear'},{k:'Outlook RBA',v:'Restera au-dessus jusqu\'à mi-2027',c:'bear'},{k:'Signal',v:'Trop forte = justifie les hikes',c:'bull'},{k:'Énergie',v:'Pression supplémentaire via Moyen-Orient',c:'bear'}],pr:'Inflation persistante au-dessus de la cible RBA (2-3%) + pression énergétique = RBA continue de monter. Positif AUD via différentiel de taux croissant.'},
      growth:{rows:[{k:'Balance commerciale',v:'Surplus solide',c:'bull'},{k:'Emploi',v:'Fort · Moteur de la demande',c:'bull'},{k:'Chine',v:'AUD corrélé demande chinoise',c:'neutral'},{k:'Commodités',v:'Or, minerai, charbon supportifs',c:'bull'}],pr:'Économie australienne résiliente : emploi solide + surplus commercial + commodités. Corrélation Chine = facteur de volatilité mais globalement supportif.'},
      employment:{rows:[{k:'Emploi',v:'Solide · Plein emploi quasi-atteint',c:'bull'},{k:'Signal RBA',v:'Emploi fort = hikes justifiés',c:'bull'}],pr:'Marché du travail australien solide = argument principal pour les hikes RBA. Renforce l\'approche hawkish.'},
      risk:{rows:[{k:'AUD/USD',v:'0.700 · Plus haut 16 mois',c:'bull'},{k:'Risk-on',v:'AUD = risk currency → bénéficie',c:'bull'},{k:'RBA hawkish',v:'4.10% → 4.85% prévu',c:'bull'},{k:'Chine risque',v:'Demande Chine = facteur de volatilité',c:'bear'}],pr:'AUD/USD à 0.700 = plus haut 16 mois. Risk-on + RBA hawkish + emploi fort = triple support. Risque : ralentissement de la Chine. Momentum haussier très clair.'},
    },
    pricing:'AUD/USD 0.700 (plus haut 16M) · RBA 4.10% → pic 4.85% · Inflation au-dessus cible · Emploi solide. Momentum haussier fort.',
    concl:'AUD HAUSSIER : RBA hawkish actif (4.10% → 4.85% prévu) + AUD/USD à 0.700 (16 mois le plus haut) + emploi solide. Parmi les plus forts du G10 actuellement. Acheter les replis vers 0.685-0.690.',
  },
  {
    code:'NZD', flag:'🇳🇿', name:'Dollar NZ', bank:'RBNZ',
    rate:'2.25%', score:-0.5,
    bias:'LÉG. BAISSIER', biasCls:'bt-ldov',
    keyData:[['RBNZ','2.25%'],['CPI','3.1%'],['Inflation T2','~4.2%']],
    pillars:{monetary:{score:-0.5,wt:'40%'},inflation:{score:-1.0,wt:'20%'},growth:{score:-1.0,wt:'15%'},employment:{score:-0.5,wt:'15%'},risk:{score:-1.0,wt:'10%'}},
    detail:{
      monetary:{rows:[{k:'Taux actuel',v:'2.25% (hold 8 Avr.)',c:'neutral'},{k:'Cycle précédent',v:'−325bp en 2025 = plus grand cut G10',c:'bear'},{k:'Prochain mouvement',v:'Hike si inflation dépasse 4.2%',c:'bear'},{k:'RBNZ signal',v:'Ouvre la porte à des hausses',c:'bear'}],pr:'RBNZ a coupé 325bp en 2025 (plus grand cycle G10) et se retrouve à 2.25% avec une inflation qui repart à la hausse. Le prochain mouvement sera probablement un hike, pas une baisse.'},
      inflation:{rows:[{k:'CPI actuel',v:'3.1% · Au-dessus cible 1-3%',c:'bear'},{k:'Forecast T2 2026',v:'4.2% · Alerte RBNZ',c:'bear'},{k:'Non-tradeable',v:'3.5% · Persistant',c:'bear'},{k:'Driver',v:'Crise carburant 2026 + Moyen-Orient',c:'bear'}],pr:'Inflation à 3.1%, déjà au-dessus de la cible (1-3%). RBNZ projette 4.2% au T2 2026 — si confirmé, force un hike. Inflation non-tradeable à 3.5% = composante persistante.'},
      growth:{rows:[{k:'Économie NZ',v:'Record bas · Fragile',c:'bear'},{k:'Chômage',v:'Élevé · En hausse',c:'bear'},{k:'Jet Fuel Crisis 2026',v:'Choc sectoriel supplémentaire',c:'bear'}],pr:'Économie NZ en difficulté : croissance à un record bas, chômage en hausse, et la Jet Fuel Crisis 2026 amplifie les pressions. Environnement stagflationnaire.'},
      employment:{rows:[{k:'Chômage NZ',v:'Élevé · En hausse',c:'bear'},{k:'Signal',v:'RBNZ ne peut utiliser ça comme excuse',c:'neutral'}],pr:'Marché du travail fragile. Mais avec inflation à 3.1%, le RBNZ ne peut pas rester dovish uniquement sur l\'emploi.'},
      risk:{rows:[{k:'Stagflation',v:'Inflation ↑ + growth faible = NZD coincé',c:'bear'},{k:'NZD vs AUD',v:'Sous-performe nettement',c:'bear'},{k:'RBNZ contraint',v:'Doit potentiellement monter malgré GDP faible',c:'bear'},{k:'Incertitude',v:'Volatilité élevée autour des annonces',c:'bear'}],pr:'NZD dans la situation la plus délicate du G10 : inflation qui repart + croissance faible = stagflation. RBNZ contraint. NZD sous-performe l\'AUD clairement.'},
    },
    pricing:'RBNZ 2.25% · CPI 3.1% (au-dessus cible) · Prévision T2 : ~4.2% · Chômage élevé · GDP record bas. Stagflation légère.',
    concl:'NZD LÉG. BAISSIER : stagflation légère (inflation 3.1-4.2% + growth faible) · RBNZ contraint entre hike et protection croissance. Préférer l\'AUD. Short NZD/AUD = trade de conviction.',
  },
  {
    code:'CAD', flag:'🇨🇦', name:'Dollar Canadien', bank:'Banque du Canada',
    rate:'2.25%', score:-1.0,
    bias:'BAISSIER', biasCls:'bt-dov',
    keyData:[['BOC','2.25%'],['CPI','1.8%'],['Chômage','6.7%']],
    pillars:{monetary:{score:-1.0,wt:'40%'},inflation:{score:0.0,wt:'20%'},growth:{score:-1.0,wt:'15%'},employment:{score:-1.0,wt:'15%'},risk:{score:-0.5,wt:'10%'}},
    detail:{
      monetary:{rows:[{k:'Taux actuel',v:'2.25% (hold mars · fin du cycle cuts)',c:'neutral'},{k:'Prochain',v:'29 Avr. · MPR + décision · Event clé',c:'neutral'},{k:'BOC vs Fed',v:'2.25% vs 3.50-3.75% = écart défavorable',c:'bear'},{k:'Tarifs US',v:'Incertitude élevée → pression baissière CAD',c:'bear'}],pr:'BOC a maintenu 2.25% en mars (fin du cycle de cuts). L\'écart de taux défavorable vs Fed (2.25% vs 3.50-3.75%) pèse sur le CAD. Prochain rendez-vous le 29 Avr. avec le MPR.'},
      inflation:{rows:[{k:'CPI fév. 2026',v:'1.8% · En désinflation',c:'bull'},{k:'Tendance',v:'Core measures proches 2%',c:'neutral'},{k:'Énergie',v:'Pression à la hausse via pétrole',c:'bear'},{k:'Signal BOC',v:'Allows pause · Pas d\'urgence',c:'neutral'}],pr:'CPI à 1.8% = BOC peut rester en pause mais sans urgence à monter. Risque à la hausse via énergie. Facteur relativement neutre.'},
      growth:{rows:[{k:'Croissance',v:'Plus faible qu\'attendue · Déçoit',c:'bear'},{k:'Tarifs US',v:'Incertitude élevée · Commerce pénalisé',c:'bear'},{k:'Risques',v:'Orientés à la baisse selon BOC',c:'bear'},{k:'Exports',v:'Données récentes = faiblesse',c:'bear'}],pr:'La croissance canadienne déçoit : les tarifs US créent une incertitude majeure sur les exportations. Le BOC lui-même signale que la croissance sera plus faible qu\'attendu. Bearish CAD.'},
      employment:{rows:[{k:'Chômage CA',v:'6.7% · En hausse',c:'bear'},{k:'Signal',v:'Marché du travail qui se détend',c:'bear'},{k:'Tendance',v:'Faiblesse continue selon données récentes',c:'bear'}],pr:'Chômage à 6.7% et en hausse = signal négatif. Marché du travail qui se détend clairement. Confirme la faiblesse de l\'économie canadienne.'},
      risk:{rows:[{k:'Tarifs US',v:'Menace principale pour le CAD',c:'bear'},{k:'Pétrole',v:'Partiellement compensateur',c:'neutral'},{k:'USD faible',v:'Aide marginalement le CAD',c:'neutral'},{k:'MPR 29 Avr.',v:'Event clé · Guidance BOC à surveiller',c:'neutral'}],pr:'Tarifs US = menace principale. Pétrole élevé compense partiellement. USD faible aide un peu. Mais globalement, les vents contraires dominent pour le CAD.'},
    },
    pricing:'BOC 2.25% · CPI 1.8% · Chômage 6.7% · Tarifs US = frein principal · Croissance décevante. Prochain MPR 29 Avr.',
    concl:'CAD BAISSIER : tarifs US + chômage 6.7% + croissance décevante + écart taux défavorable vs Fed = vents contraires multiples. Préférer les cross CAD vs AUD ou NZD côté short CAD.',
  },
  {
    code:'NOK', flag:'🇳🇴', name:'Couronne Norvégienne', bank:'Norges Bank',
    rate:'4.00%', score:1.5,
    bias:'HAUSSIER', biasCls:'bt-hawk',
    keyData:[['NB','4.00%'],['Hike','Juin signalé'],['Pétrole','Élevé']],
    pillars:{monetary:{score:1.5,wt:'40%'},inflation:{score:1.0,wt:'20%'},growth:{score:2.0,wt:'15%'},employment:{score:0.5,wt:'15%'},risk:{score:-0.5,wt:'10%'}},
    detail:{
      monetary:{rows:[{k:'Taux actuel',v:'4.00% (hold 25 mars)',c:'bull'},{k:'Tournant hawkish',v:'Hike signalé pour juin 2026',c:'bull'},{k:'Changement',v:'Guidance révisée à la hausse',c:'bull'},{k:'Position G10',v:'Taux parmi les + élevés du G10',c:'bull'}],pr:'Retournement hawkish de Norges Bank : le 25 mars, la banque a maintenu 4.00% ET signalé un hike pour juin 2026. Révision haussière de la trajectoire des taux. Très positif NOK.'},
      inflation:{rows:[{k:'Inflation NO',v:'Au-dessus cible · Persistante',c:'bear'},{k:'Tendance',v:'Plus haute que précédemment projeté',c:'bear'},{k:'Signal NB',v:'Inflation + haute = argument hike',c:'bull'},{k:'Énergie',v:'Pétrole élevé = pression supplémentaire',c:'bear'}],pr:'Inflation plus haute que prévu = argument principal pour que Norges Bank monte en juin. Le conflit Moyen-Orient + pétrole élevé amplifient les pressions inflationnistes.'},
      growth:{rows:[{k:'Pétrole',v:'Élevé via Moyen-Orient · MASSIF pour NOK',c:'bull'},{k:'Norvège',v:'Exportateur pétrolier majeur',c:'bull'},{k:'Terms of trade',v:'Fortement améliorés',c:'bull'},{k:'NOK',v:'Appréciation notable récente',c:'bull'}],pr:'Le pétrole élevé est LE driver clé de la NOK. Norvège = exportateur majeur = bénéficiaire direct. Terms of trade améliorés. NOK s\'est appréciée significativement.'},
      employment:{rows:[{k:'Chômage NO',v:'Très bas · Solide',c:'bull'},{k:'Signal',v:'Plein emploi → argument hawkish',c:'bull'}],pr:'Marché du travail solide, soutenu par le boom pétrolier. Facteur supportif supplémentaire pour le hike de juin.'},
      risk:{rows:[{k:'NOK = commodity FX',v:'Bénéficiaire direct du pétrole élevé',c:'bull'},{k:'NB hawkish',v:'Hike juin = différentiel de taux ↑',c:'bull'},{k:'NOK appréciée',v:'Norges Bank le mentionne · Déjà pricé?',c:'neutral'},{k:'vs SEK',v:'NOK/SEK = arbitrage clair',c:'bull'}],pr:'Environnement idéal pour NOK : Norges Bank hawkish + hike juin signalé + pétrole élevé + plein emploi. NOK/SEK = trade thématique de conviction.'},
    },
    pricing:'NB 4.00% · Hike juin signalé (hawkish turn) · Pétrole élevé · Inflation au-dessus cible · NOK appréciée récemment.',
    concl:'NOK HAUSSIER : triple catalyseur — Norges Bank hawkish (hike juin signalé) + pétrole élevé + plein emploi. NOK/SEK = meilleure expression du différentiel énergie. Position de conviction haussière NOK.',
  },
  {
    code:'SEK', flag:'🇸🇪', name:'Couronne Suédoise', bank:'Riksbank',
    rate:'1.75%', score:-0.5,
    bias:'LÉG. BAISSIER', biasCls:'bt-ldov',
    keyData:[['Riksbank','1.75%'],['CPIF ex-E','1.1%'],['GDP 2026','2.9%']],
    pillars:{monetary:{score:-1.0,wt:'40%'},inflation:{score:0.5,wt:'20%'},growth:{score:1.0,wt:'15%'},employment:{score:0.0,wt:'15%'},risk:{score:-1.5,wt:'10%'}},
    detail:{
      monetary:{rows:[{k:'Taux actuel',v:'1.75% (4e hold consécutif mars)',c:'neutral'},{k:'Biais Riksbank',v:'Pause prolongée · Neutre/dovish',c:'neutral'},{k:'Prochain mouvement',v:'Plus probable baisse que hausse',c:'bear'},{k:'Marché',v:'Aucun hike attendu en 2026',c:'neutral'}],pr:'Riksbank en pause prolongée à 1.75% — 4e hold consécutif en mars. Le taux le plus bas des grandes BC nordiques. Aucun hike attendu, légèrement plus probable une baisse si l\'inflation core reste basse.'},
      inflation:{rows:[{k:'CPIF ex-énergie mars',v:'1.1% · Plus bas depuis juil. 2021',c:'bull'},{k:'Tendance CPIF',v:'0.9% prévu pour 2026',c:'bull'},{k:'Signal',v:'Inflation très basse → espace pour couper',c:'bear'},{k:'Risque haussier',v:'Énergie via Moyen-Orient',c:'neutral'}],pr:'Inflation suédoise extrêmement basse : CPIF ex-énergie à 1.1% (plus bas depuis 2021). Prévision 0.9% pour 2026. Donne à la Riksbank l\'espace pour baisser les taux si nécessaire.'},
      growth:{rows:[{k:'GDP 2026 (Riksbank)',v:'2.9% · Révisé à la hausse',c:'bull'},{k:'Conso ménages',v:'En hausse · Résistante',c:'bull'},{k:'T4 2025',v:'Plus fort qu\'attendu',c:'bull'},{k:'Incertitude',v:'Moyen-Orient = facteur externe',c:'neutral'}],pr:'Surprise positive : Riksbank a révisé le GDP 2026 à 2.9%, porté par une consommation des ménages plus forte. Contre-intuitif mais vrai : la croissance suédoise accélère.'},
      employment:{rows:[{k:'Marché emploi',v:'Amélioration graduelle',c:'neutral'},{k:'Signal',v:'Ni supportif fort ni alarmant',c:'neutral'}],pr:'Marché du travail qui s\'améliore graduellement. Facteur neutre.'},
      risk:{rows:[{k:'Riksbank 1.75%',v:'Taux le plus bas des Nordiques',c:'bear'},{k:'vs NOK',v:'NOK/SEK = trade directionnel clair',c:'bear'},{k:'GDP 2.9%',v:'Surprise positive · Limite le downside',c:'bull'},{k:'SEK = risk asset',v:'Reste exposée aux chocs externes',c:'bear'}],pr:'SEK toujours exposée malgré la bonne croissance. Différentiel de taux vs NOK (1.75% vs 4.00%) = frein majeur. GDP 2.9% = positive surprise mais insuffisant pour inverser le biais relatif.'},
    },
    pricing:'Riksbank 1.75% · CPIF ex-énergie 1.1% (très bas) · GDP 2.9% (surprise positive) · Taux vs NOK défavorable.',
    concl:'SEK LÉG. BAISSIER : taux 1.75% (le plus bas des nordiques) + inflation core très basse (1.1%) = Riksbank dovish. GDP 2.9% est une surprise positive mais ne suffit pas vs NOK. Short SEK via NOK/SEK = meilleur trade.',
  },
];

let OPPS = [
  {rank:'01',top:true,pair:'AUD/USD',dir:'BUY',dirCls:'dir-buy',logic:'<strong>RBA hawkish actif (4.10% → 4.85% prévu).</strong> AUD/USD à 0.700 (plus haut 16 mois) · RBA a monté 2 fois d\'affilée · Inflation au-dessus cible · Emploi solide. USD LÉG. BAISSIER. Momentum haussier clair. Cible 0.72-0.73.',spread:'Score diff : <span>AUD +1.5 vs USD −1.0 = 2.5 pts</span> · Cible : <span>0.72-0.73</span>'},
  {rank:'02',top:true,pair:'USD/CHF',dir:'SELL',dirCls:'dir-sell',logic:'<strong>CHF = safe haven + rotation hors USD.</strong> USD/CHF 0.782 · SNB 0.00% mais CHF structurellement fort via géopolitique + rotation hors USD. SNB impuissant. Cible 0.75-0.76.',spread:'Score diff : <span>CHF +1.5 vs USD −1.0 = 2.5 pts</span> · Cible : <span>0.75-0.76</span>'},
  {rank:'03',top:true,pair:'NOK/SEK',dir:'BUY',dirCls:'dir-buy',logic:'<strong>Arbitrage nordique : Norges Bank hawkish vs Riksbank dovish.</strong> NB signale hike juin (4.00% → +) vs Riksbank à 1.75% (inflation core 1.1%). Pétrole élevé avantage NOK. Trade de conviction.',spread:'Score diff : <span>NOK +1.5 vs SEK −0.5 = 2.0 pts</span> · Meilleur trade Scandi'},
  {rank:'04',top:false,pair:'AUD/CAD',dir:'BUY',dirCls:'dir-buy',logic:'<strong>RBA hawkish vs BOC dovish · Divergence croissante.</strong> RBA 4.10% → 4.85% prévu vs BOC 2.25% · Chômage CA 6.7% · Tarifs US pèsent sur CAD · AUD emploi solide. Divergence de politique monétaire maximale.',spread:'Score diff : <span>AUD +1.5 vs CAD −1.0 = 2.5 pts</span> · Trade de divergence'},
  {rank:'05',top:false,pair:'EUR/USD',dir:'BUY',dirCls:'dir-buy',logic:'<strong>ECB stable + rotation hors USD.</strong> EUR/USD ~1.178 · ECB 2.00% tient · Market price plus de cuts Fed que Fed ne signale. GDP eurozone faible (0.9%) = frein mais USD LÉG. BAISSIER. Cible 1.20.',spread:'Score diff : <span>EUR +0.5 vs USD −1.0 = 1.5 pts</span> · Cible : <span>1.20</span>'},
  {rank:'06',top:false,pair:'NZD/AUD',dir:'SELL NZD',dirCls:'dir-sell',logic:'<strong>Stagflation NZ vs RBA hawkish.</strong> NZD : CPI 3.1% → 4.2% projeté + GDP faible + RBNZ contraint. AUD : RBA hawkish actif + emploi solide. Divergence fondamentale nette. Short NZD/AUD.',spread:'Score diff : <span>AUD +1.5 vs NZD −0.5 = 2.0 pts</span> · Trade commodity divergence'},
];

/* ── HELPERS ── */
function dotLeft(s) {
  // Score -5 to +5 → left% de 0 à 100
  return ((Math.max(-5, Math.min(5, s)) + 5) / 10 * 100) + '%';
}
function sStr(s) { return (s > 0 ? '+' : '') + s.toFixed(1); }
function sCls(s) { return s > 0.5 ? 'bull' : s < -0.5 ? 'bear' : 'neu'; }
function pChipCls(s) { return s > 0.5 ? 'pc-bull' : s < -0.5 ? 'pc-bear' : 'pc-neu'; }
function scoreColor(s) { return s > 0.5 ? 'var(--green)' : s < -0.5 ? 'var(--red)' : 'var(--amber)'; }

/* ── RENDER GRID ── */
const PKEYS = ['monetary','inflation','growth','employment','risk'];
const PLBLS = ['Mon.','Infl.','Crois.','Empl.','Risk'];

function renderGrid() {
  const grid = document.getElementById('cGrid');
  CURR.forEach((c, i) => {
    const sc = sCls(c.score);
    const color = scoreColor(c.score);

    const pillarsHtml = PKEYS.map((k, pi) => {
      const ps = c.pillars[k].score;
      return `<div class="p-mini-col">
        <div class="p-mini-bar">
          <div class="p-mini-fill" style="left:0;width:${dotLeft(ps)};background:${scoreColor(ps)};opacity:0.7;"></div>
        </div>
        <div class="p-mini-lbl">${PLBLS[pi]}</div>
      </div>`;
    }).join('');

    const el = document.createElement('div');
    el.className = 'c-card';
    el.dataset.idx = i;
    el.onclick = () => showDetail(i);
    el.innerHTML = `
      <div class="c-head">
        <div class="c-flag-name">
          <div class="c-flag">${c.flag}</div>
          <div><div class="c-code">${c.code}</div><div class="c-bank">${c.bank}</div></div>
        </div>
        <div class="c-right">
          <div class="c-score-val sv-${sc}">${sStr(c.score)}</div>
          <span class="c-bias-tag ${c.biasCls}">${c.bias}</span>
        </div>
      </div>
      <div class="sbar-wrap">
        <div class="sbar-min">-5</div>
        <div class="sbar-track">
          <div class="sbar-dot" style="left:${dotLeft(c.score)};"></div>
        </div>
        <div class="sbar-max">+5</div>
      </div>
      <div class="p-mini-row">${pillarsHtml}</div>
      <div class="c-data">${c.keyData.map(([k,v]) => `<div class="c-chip">${k} <strong>${v}</strong></div>`).join('')}</div>
    `;
    grid.appendChild(el);
  });
}

/* ── DETAIL PANEL ── */
const PDEF = [
  {key:'monetary',   icon:'🏦', label:'Politique Monétaire'},
  {key:'inflation',  icon:'📈', label:'Inflation (CPI)'},
  {key:'growth',     icon:'📊', label:'Croissance (PMI / GDP)'},
  {key:'employment', icon:'👷', label:'Marché du Travail'},
  {key:'risk',       icon:'🌍', label:'Risk Sentiment'},
];

function showDetail(idx) {
  const c = CURR[idx];
  document.querySelectorAll('.c-card').forEach((el, i) => el.classList.toggle('active', i === idx));

  const sc = sCls(c.score);
  const color = scoreColor(c.score);

  let pillarsHtml = '';
  PDEF.forEach(def => {
    const ps  = c.pillars[def.key].score;
    const d   = c.detail[def.key];
    const rowsHtml = (d.rows || []).map(r =>
      `<div class="d-row"><div class="d-key">${r.k}</div><div class="d-val ${r.c||''}">${r.v}</div></div>`
    ).join('');
    pillarsHtml += `
      <div class="p-sec">
        <div class="p-hdr">
          <div class="p-name">${def.icon} ${def.label} <span class="p-wt">${c.pillars[def.key].wt}</span></div>
          <div class="p-chip ${pChipCls(ps)}">${sStr(ps)}</div>
        </div>
        <div class="p-sbar-track"><div class="p-sbar-dot" style="left:${dotLeft(ps)};"></div></div>
        ${rowsHtml}
        <div class="pr-box"><div class="pr-title">💡 Market Pricing</div><div class="pr-text">${d.pr}</div></div>
      </div>`;
  });

  document.getElementById('rightPanel').innerHTML = `
    <div class="d-header">
      <div class="d-flag-row">
        <div class="d-flag">${c.flag}</div>
        <div><div class="d-cname">${c.code} — ${c.name}</div><div class="d-bank">${c.bank} · Taux : ${c.rate}</div></div>
      </div>
      <div class="d-score-row">
        <div class="d-score-val sv-${sc}">${sStr(c.score)}</div>
        <div style="flex:1;">
          <div class="d-sbar-track" style="margin-bottom:0.35rem;">
            <div class="d-sbar-dot" style="left:${dotLeft(c.score)};"></div>
          </div>
          <div class="d-score-sub"><strong>${c.bias}</strong>${c.pricing}</div>
        </div>
      </div>
    </div>
    <div class="d-body">
      ${pillarsHtml}
      <div class="concl-box">
        <div class="concl-title">🎯 Conclusion Trading</div>
        <div class="concl-text">${c.concl}</div>
      </div>
    </div>
  `;

  if (window.innerWidth <= 960) {
    document.getElementById('rightPanel').scrollIntoView({behavior:'smooth',block:'start'});
  }
}

/* ── FX OPPORTUNITIES ── */
function renderOpps() {
  const g = document.getElementById('oppGrid');
  if (!g) return;
  g.innerHTML = '';
  OPPS.forEach(o => {
    const el = document.createElement('div');
    el.className = `opp-card${o.top ? ' top' : ''}`;
    el.innerHTML = `
      <div class="opp-rank">${o.rank}</div>
      <div>
        <div class="opp-pair">${o.pair}</div>
        <div class="opp-dir ${o.dirCls}">${o.dir}</div>
        <div class="opp-logic">${o.logic}</div>
        <div class="opp-spread">${o.spread}</div>
      </div>`;
    g.appendChild(el);
  });
}

/* ═══════════════════════════════════════════
   MÉTAUX PRÉCIEUX
═══════════════════════════════════════════ */
const METALS_PKEYS = ['supply','demand','usd','rates','risk'];
const METALS_PLBLS = ['Offre','Demande','USD','Taux','Risk'];
const METALS_PDEF  = [
  {key:'supply',   icon:'⛏️',  label:'Offre / Production'},
  {key:'demand',   icon:'🏛️',  label:'Demande (ETF / BC / Indus.)'},
  {key:'usd',      icon:'💵',  label:'Corrélation USD (inverse)'},
  {key:'rates',    icon:'📉',  label:'Taux Réels (clé pour l\'Or)'},
  {key:'risk',     icon:'🛡️',  label:'Risk Sentiment / Safe Haven'},
];

let METALS = [
  {
    code:'GOLD', flag:'🥇', name:'Or', bank:'OANDA:XAUUSD',
    rate:'~$4,683', score:4.0,
    bias:'TRÈS HAUSSIER', biasCls:'bt-hawk',
    keyData:[['Prix','$4,683'],['ATH','$4,830 (2 Avr.)'],['YTD 2026','+9%']],
    pillars:{supply:{score:0.5,wt:'15%'},demand:{score:4.0,wt:'30%'},usd:{score:3.5,wt:'20%'},rates:{score:3.5,wt:'25%'},risk:{score:2.5,wt:'10%'}},
    detail:{
      supply:{rows:[{k:'Production mine',v:'~3,800T · Stable',c:'neutral'},{k:'Coût marginal',v:'~$1,400/oz · Bien loin du spot',c:'bull'},{k:'Recyclage',v:'Hausse modeste',c:'neutral'}],pr:'Offre mine stable. Coût de production bien en dessous du prix spot à $4,830. Aucune pression vendeuse côté offre.'},
      demand:{rows:[{k:'Banques centrales',v:'Achats records 2026 · Dédollarisation',c:'bull'},{k:'ETF SPDR',v:'AUM record · Flux massifs',c:'bull'},{k:'Joaillerie Asie',v:'Chine + Inde · Forte demande',c:'bull'},{k:'Institutionnel',v:'Or = hedge USD · Conviction élevée',c:'bull'}],pr:'Demande exceptionnelle : BC records (dédollarisation) + ETF institutionnels massifs + joaillerie asiatique. Toutes les sources de demande convergent.'},
      usd:{rows:[{k:'DXY',v:'Très faible · EUR/USD 1.178',c:'bull'},{k:'Corrélation inverse',v:'USD faible = Or haussier direct',c:'bull'},{k:'Dédollarisation',v:'BC vendent USD, achètent Or',c:'bull'},{k:'USD/CHF',v:'0.781 · Rotation hors USD globale',c:'bull'}],pr:'USD au plus bas (EUR/USD 1.178) = Or bénéficiaire direct. La rotation hors USD est structurelle et profite massivement à l\'Or.'},
      rates:{rows:[{k:'Taux réels US',v:'En baisse attendue · Cuts Fed',c:'bull'},{k:'Fed 3.50-3.75%',v:'Prochain mouvement = baisse',c:'bull'},{k:'Taux réels ↓',v:'Historiquement = Or ↑↑↑',c:'bull'},{k:'Signal',v:'Fed dovish = Or structurellement haussier',c:'bull'}],pr:'Anticipation de cuts Fed = taux réels en baisse = Or structurellement haussier. Ce driver seul est suffisant. Additionné au USD faible = confluence maximale.'},
      risk:{rows:[{k:'Iran · Négociations ceasefire',v:'Détente partielle · Moins de prime géopo.',c:'neutral'},{k:'Régime',v:'Reflation + safe haven toujours actif',c:'bull'},{k:'Or vs SPX',v:'Tous deux en ATH = reflation trade',c:'bull'},{k:'Risque',v:'Ceasefire total + USD rally = correction',c:'bear'}],pr:'Or à nouveau ATH malgré la détente Iran. Preuve que les drivers structurels (dédollarisation, taux réels) dominent le geopolitique. Ceasefire complet = risque de correction de $100-150 mais pas plus.'},
    },
    pricing:'Or $4,683 · Repli depuis ATH $4,830 (2 Avr.) · USD léger rebond (DXY ~98.5) + talks Iran stagnent = prise de bénéfices. Drivers structurels intacts : dédollarisation + taux réels bas. FOMC 29 Avr. = event clé.',
    concl:'Or TRÈS HAUSSIER : repli $4,683 depuis ATH $4,830 = opportunité d\'achat. Talks Iran stagnent = prime géopo. partielle revenue. Acheter replis $4,600-$4,650. Cible MT $5,000. Stop $4,350.',
  },
  {
    code:'SILVER', flag:'🥈', name:'Argent', bank:'OANDA:XAGUSD',
    rate:'~$75.28', score:3.0,
    bias:'TRÈS HAUSSIER', biasCls:'bt-hawk',
    keyData:[['Prix','$75.28'],['Ratio Or/Ag','~62x'],['ATH','ATH zone (repli -5% depuis ATH)']],
    pillars:{supply:{score:-0.5,wt:'15%'},demand:{score:2.0,wt:'30%'},usd:{score:2.0,wt:'20%'},rates:{score:1.5,wt:'25%'},risk:{score:1.0,wt:'10%'}},
    detail:{
      supply:{rows:[{k:'Production minière',v:'+4% 2026 · Excédent partiel',c:'bear'},{k:'Mexique / Pérou',v:'Principaux producteurs · Stables',c:'neutral'},{k:'Signal',v:'Offre légèrement en hausse',c:'bear'}],pr:'Production minière en légère hausse = facteur négatif marginal. Excédent partiel pèse sur le prix vs Or.'},
      demand:{rows:[{k:'Demande industrielle',v:'~55% de la demande totale',c:'bull'},{k:'Panneaux solaires',v:'Boom solaire · +18% YoY',c:'bull'},{k:'Électronique / EV',v:'Forte croissance',c:'bull'},{k:'ETF Argent',v:'Flux positifs mais < Or',c:'neutral'}],pr:'Demande industrielle = force unique de l\'argent vs Or. Transition énergétique (solaire, EV) = driver structurel de très long terme.'},
      usd:{rows:[{k:'Corrélation DXY',v:'Inverse · Similaire à l\'Or',c:'bull'},{k:'Impact',v:'USD faible → Argent haussier',c:'bull'}],pr:'Même corrélation inverse avec USD que l\'Or. USD en légère faiblesse = supportif.'},
      rates:{rows:[{k:'Taux réels',v:'Même dynamique que l\'Or',c:'bull'},{k:'Baisse attendue Fed',v:'Haussier pour Argent',c:'bull'}],pr:'Bénéficie de la même dynamique que l\'Or via les anticipations de baisses Fed 2026.'},
      risk:{rows:[{k:'Régime',v:'RISK-ON · Bénéfique Argent',c:'bull'},{k:'Ratio Or/Ag',v:'~60x · Médiane historique 65-75x',c:'neutral'},{k:'Argent vs Or',v:'Légèrement riche vs médianehistorique',c:'neutral'},{k:'Risk-on',v:'Argent surperforme en risk-on',c:'bull'}],pr:'Ratio Or/Argent à 60x = argent légèrement cher vs or par rapport à la médiane historique. Mais en absolu, $79 = ATH + risk-on = momentum très fort.'},
    },
    pricing:'Argent $75.28 · Repli depuis ATH avec Or · Ratio Or/Ag 62x. USD léger rebond (DXY 98.5) · Transition énergétique + Hormuz = volatilité. Driver industriel solaire intact.',
    concl:'Argent TRÈS HAUSSIER : repli $75.28 = zone d\'achat. Triple driver intacts : USD, transition énergétique, risk-on. Acheter $73-75. Cible $90-$100. Stop $68.',
  },
  {
    code:'COPPER', flag:'🟫', name:'Cuivre', bank:'COMEX:HG1!',
    rate:'~$6.03/lb', score:2.5,
    bias:'HAUSSIER', biasCls:'bt-hawk',
    keyData:[['Prix','$6.03/lb (~$13,295/MT)'],['YTD','↑ +24.17%'],['Chine','Restocking Labour Day (1-5 Mai)']],
    pillars:{supply:{score:-0.5,wt:'20%'},demand:{score:3.0,wt:'35%'},usd:{score:2.5,wt:'15%'},rates:{score:1.5,wt:'20%'},risk:{score:2.0,wt:'10%'}},
    detail:{
      supply:{rows:[{k:'Stocks LME',v:'En baisse · Marché physique tendu',c:'bull'},{k:'Production Chili',v:'Codelco · Production sous pression',c:'neutral'},{k:'Disruptions',v:'Grèves minières · Offre contrainte',c:'bull'}],pr:'Stocks LME en baisse dans un contexte de demande forte. Disruptions minières au Chili limitent l\'offre. Marché physique tendu = support prix structurel.'},
      demand:{rows:[{k:'PMI Chine Mfg',v:'>50 · Forte expansion · Stimulus actif',c:'bull'},{k:'Infra Chine',v:'Commandes record · Réseau électrique',c:'bull'},{k:'Transition énergétique',v:'EV, solaire, réseaux · +$1.3T investissement global',c:'bull'},{k:'Risk-on global',v:'REFLATION = boom demande industrielle',c:'bull'},{k:'Prix IMF avril 26',v:'$12,987/MT (+30% vs jan 26)',c:'bull'}],pr:'Explosion de la demande : Chine stimulus massif + transition énergétique accélérée (solaire, EV) + reflation globale. Hausse de +30% sur l\'année reflète un rééquilibrage fondamental du marché.'},
      usd:{rows:[{k:'Corrélation USD',v:'Inverse (commodity)',c:'bull'},{k:'USD faible',v:'EUR/USD 1.178 · Fort supportif cuivre',c:'bull'},{k:'DXY ↓',v:'Boost mécanique des commodités USD',c:'bull'}],pr:'USD au plus bas (EUR/USD 1.178) = boost mécanique majeur pour le cuivre libellé en USD. Driver CT fort.'},
      rates:{rows:[{k:'Fed en cycle baisse',v:'3.50-3.75% → coupures attendues',c:'bull'},{k:'Chine assouplissement',v:'PBOC accommodant · Infrastructure financée',c:'bull'},{k:'Crédit facile',v:'Stimule les grands projets cuivro-intensifs',c:'bull'}],pr:'Double assouplissement Fed + PBOC = financement bon marché pour les grands projets d\'infrastructure et d\'énergie. Driver clé de la demande.'},
      risk:{rows:[{k:'Régime',v:'REFLATION · RISK-ON',c:'bull'},{k:'Cuivre = "Dr. Copper"',v:'+30% valide thèse croissance globale',c:'bull'},{k:'Signal CT',v:'Breakout majeur · $5.89/lb nouveau range',c:'bull'},{k:'Risque',v:'Récession Chine ou recul demande EV',c:'bear'}],pr:'Cuivre = proxy de la croissance mondiale. La hausse à $5.89/lb (+30% YTD) est le signal le plus clair du régime REFLATION actuel. "Dr. Copper" crie la croissance.'},
    },
    pricing:'Cuivre $6.03/lb (~$13,295/MT) · +24% YoY · Restocking pré-Labour Day Chine (1-5 Mai). Production record Chine 1.33M T mars. USD léger rebond mais drivers structurels intacts. Range $5.80-$6.80 REFLATION.',
    concl:'Cuivre HAUSSIER : $6.03 · +24% YoY · Record production Chine + restocking Labour Day. Momentum solide. Acheter replis $5.80-5.90. Cible $6.80-7.00 MT. Stop $5.50.',
  },
  {
    code:'PLATINUM', flag:'⬜', name:'Platine', bank:'TVC:PLATINUM',
    rate:'~$1,959/oz', score:0.5,
    bias:'LÉG. HAUSSIER', biasCls:'bt-lhawk',
    keyData:[['Prix','$1,959/oz'],['Ratio Pt/Au','0.42x'],['$2,100','Résistance clé (ex-support)']],
    pillars:{supply:{score:1.0,wt:'20%'},demand:{score:1.5,wt:'35%'},usd:{score:1.5,wt:'15%'},rates:{score:0.5,wt:'20%'},risk:{score:-0.5,wt:'10%'}},
    detail:{
      supply:{rows:[{k:'Afrique du Sud',v:'~75% production mondiale',c:'neutral'},{k:'Disruptions',v:'Grèves / coupures électriques',c:'bull'},{k:'Offre 2026',v:'~8.0M oz · Contrainte mais pas suffisant',c:'neutral'}],pr:'Production sud-africaine sous contrainte (coupures, grèves) = offre limitée. Facteur positif mais insuffisant pour compenser la faiblesse de la demande CT.'},
      demand:{rows:[{k:'Autocatalyseurs',v:'35% demande · Hybrides ↑ mais lent',c:'neutral'},{k:'Hydrogène',v:'Électrolyse PEM · Driver LT encore marginal',c:'neutral'},{k:'Substitution Or',v:'À $2,093, platine encore accessible vs Or $4,830',c:'bull'},{k:'Déficit 2026',v:'~120,000 oz · Non encore intégré au prix',c:'bull'}],pr:'Déficit structurel existe mais le marché ne l\'intègre pas encore. La demande hydrogène reste un driver de long terme. Substitution bijouterie vs Or = potentiel CT si Or continue ATH.'},
      usd:{rows:[{k:'Corrélation USD',v:'Inverse (commodity)',c:'bull'},{k:'USD faible',v:'EUR/USD 1.178 · Supportif',c:'bull'}],pr:'USD faible = supportif pour le platine. Légèrement positif mais pas le driver principal.'},
      rates:{rows:[{k:'Taux réels ↓',v:'Bénéfique pour métaux pécieux',c:'bull'},{k:'Impact',v:'Moins puissant que sur Or ou Argent',c:'neutral'}],pr:'Bénéficie marginalement de la dynamique des taux. Moins impacté que l\'Or/Argent par les taux réels.'},
      risk:{rows:[{k:'Régime',v:'RISK-ON mais Or dominant en safe haven',c:'neutral'},{k:'$2,300 résistance',v:'Breakout raté · Retour $2,093 = signal technique négatif',c:'bear'},{k:'Ratio Pt/Au',v:'0.43x (hist. ~0.8x) · Très sous-valorisé LT',c:'bull'}],pr:'Le platine a raté son breakout au-dessus de $2,300 et est revenu à $2,093. Techniquement négatif CT. Mais ratio Pt/Au à 0.43x (hist. 0.8x) = sous-valorisation extrême = opportunité LT.'},
    },
    pricing:'Platine $1,959 · Repli depuis $2,093. Support $1,950 testé. Ratio Pt/Au 0.42x (hist. 0.8x = sous-valorisé de 47%). Déficit 120K oz LT non intégré. Résistance $2,100.',
    concl:'Platine neutre/légèrement haussier : support $1,950 testé · sous-valorisation extrême LT (Pt/Au 0.42x). Accumuler sous $1,950 pour pari LT. Déficit structurel 120K oz toujours non intégré.',
  },
];

let METALS_OPPS = [
  {rank:'01',top:true,pair:'GOLD (Long / Repli = opportunité)',dir:'BUY',dirCls:'dir-buy',logic:'<strong>Or $4,683 · Repli depuis ATH $4,830 (2 Avr.) · FOMC 28-29 Avr. + Talks Iran stagnent = prise de bénéfices.</strong> Drivers structurels intacts : dédollarisation + achats BC records + taux réels bas. Acheter replis $4,600-$4,650.',spread:'Score : <span>+4.0</span> · Cible MT : <span>$5,000-$5,200</span> · Stop : <span>$4,350</span>'},
  {rank:'02',top:true,pair:'COPPER (Long)',dir:'BUY',dirCls:'dir-buy',logic:'<strong>Cuivre $6.03/lb · +24% YoY · Record production Chine 1.33M T mars · Restocking Labour Day 1-5 Mai.</strong> Transition EV/solaire + stimulus Chine. Momentum solide.',spread:'Score : <span>+2.5</span> · Cible MT : <span>$6.80-7.00</span> · Stop : <span>$5.50</span>'},
  {rank:'03',top:false,pair:'SILVER (Long / Repli)',dir:'BUY',dirCls:'dir-buy',logic:'<strong>Argent $75.28 · Repli depuis ATH · Ratio Or/Ag 62x.</strong> Zone d\'achat : triple driver intact (USD, solaire, risk-on). Acheter $73-75.',spread:'Score : <span>+3.0</span> · Cible : <span>$90-$100</span> · Stop : <span>$68</span>'},
  {rank:'04',top:false,pair:'PLATINUM (Accumulation LT)',dir:'BUY (différé)',dirCls:'dir-buy',logic:'<strong>Platine $2,093 · Breakout $2,300 raté mais sous-valorisation extrême.</strong> Ratio Pt/Au à 0.43x (historique ~0.8x = sous-valorisé de 46%). Déficit structurel 120K oz + hydrogène LT. Accumuler sous $2,000 pour pari long terme.',spread:'Score : <span>+1.0</span> · Ratio Pt/Au : <span>0.43x</span> · Cible LT : <span>$2,500-$3,000</span>'},
];

/* ═══════════════════════════════════════════
   ÉNERGIE
═══════════════════════════════════════════ */
const ENERGY_PKEYS = ['opec','inventories','demand','usd','seasonal'];
const ENERGY_PLBLS = ['OPEC','Stock','Dem.','USD','Saison'];
const ENERGY_PDEF  = [
  {key:'opec',       icon:'🛢️', label:'OPEC+ / Géopolitique'},
  {key:'inventories',icon:'🏗️', label:'Inventaires (EIA / API)'},
  {key:'demand',     icon:'🌍', label:'Demande mondiale'},
  {key:'usd',        icon:'💵', label:'Corrélation USD'},
  {key:'seasonal',   icon:'📅', label:'Saisonnalité / Raffinage'},
];

let ENERGY = [
  {
    code:'WTI', flag:'🛢️', name:'Pétrole WTI', bank:'TVC:USOIL',
    rate:'~$96.4', score:2.5,
    bias:'HAUSSIER', biasCls:'bt-hawk',
    keyData:[['Prix','$96.4'],['Hormuz','Toujours fermé · Talks échoués'],['OPEC+','Cuts maintenus · Plancher $80']],
    pillars:{opec:{score:1.5,wt:'35%'},inventories:{score:0.5,wt:'20%'},demand:{score:1.5,wt:'20%'},usd:{score:1.5,wt:'15%'},seasonal:{score:1.0,wt:'10%'}},
    detail:{
      opec:{rows:[{k:'Hormuz toujours fermé',v:'Iran doubles down · Talks avec US échoués · 9e semaine',c:'bear'},{k:'OPEC+ cuts',v:'3.6 Mb/j · Plancher $80 défendu',c:'bull'},{k:'IEA outlook',v:'Peak Q2 $115/b · Supply shock record mondial',c:'bear'},{k:'Iran statement',v:'Ormuz "ne reviendra jamais" à l\'état précédent',c:'bear'},{k:'Citi scenario',v:'$150 si Hormuz fermé jusqu\'en juin',c:'bear'}],pr:'CHOC PÉTROLIER MAJEUR : Ormuz toujours fermé (9e semaine). Iran double la mise. Brent pic $128 le 2 Avril. EIA anticipe pic Q2 à $115. Citi: $150 si fermeture jusqu\'en juin.'},
      inventories:{rows:[{k:'Stocks EIA (US)',v:'Normalisés · Iran logistique reprend',c:'neutral'},{k:'Cushing (hub)',v:'Légèrement sous 5Y avg',c:'neutral'},{k:'IEA global',v:'Moins tendu qu\'avant ceasefire',c:'neutral'}],pr:'Stocks US se normalisent avec la reprise logistique du Moyen-Orient. Moins de tension physique qu\'en période d\'Ormuz bloqué. Facteur neutre CT.'},
      demand:{rows:[{k:'Demand IEA 2026',v:'103.8 Mb/j (+1.1% YoY)',c:'bull'},{k:'Chine',v:'Reprise REFLATION · +4.2% demande pétro.',c:'bull'},{k:'US',v:'Driving season approche (mai-août)',c:'bull'},{k:'USD faible',v:'Pétrole plus accessible pays émergents',c:'bull'}],pr:'Demande mondiale toujours solide. USD très faible → pétrole accessible pour importateurs. Driving season US approche = soutien saisonnier CT.'},
      usd:{rows:[{k:'Pétrole / USD',v:'Libellé en USD → corrélation inverse',c:'bull'},{k:'EUR/USD 1.178',v:'USD très faible = boost pétrole',c:'bull'},{k:'DXY ↓↓',v:'Driver positif structurel',c:'bull'}],pr:'USD très faible (EUR/USD 1.178) = boost mécanique pour le pétrole. Seul driver haussier vraiment fort maintenant que la prime géopo. s\'efface.'},
      seasonal:{rows:[{k:'Driving season approche',v:'Mai-août · Demande essence montante',c:'bull'},{k:'Raffinage',v:'Marges stables',c:'neutral'}],pr:'Driving season US qui approche = soutien saisonnier. Facteur positif CT mais moins puissant que la prime géopolitique qui disparaît.'},
    },
    pricing:'WTI $96.4 · Hormuz toujours fermé (9e semaine) · Talks US-Iran échoués · Iran doubles down · OPEC+ plancher $80 + USD ~98.5 · EIA peak $115 Q2. Range probable $92-105.',
    concl:'WTI HAUSSIER : Hormuz toujours fermé + Iran doubles down = prime de risque maximale. EIA peak $115 Q2. OPEC+ plancher $80. Acheter replis $92-94. Stop $85.',
  },
  {
    code:'BRENT', flag:'🛢️', name:'Pétrole Brent', bank:'TVC:UKOIL',
    rate:'~$107.6', score:3.5,
    bias:'TRÈS HAUSSIER', biasCls:'bt-hawk',
    keyData:[['Prix','$107.6 · Brent pic $128 (2 Avr.)'],['Spread vs WTI','+$11.2 · Élargi · Hormuz prime'],['Hormuz','Toujours fermé · Talks échoués · 9e sem.']],
    pillars:{opec:{score:2.5,wt:'35%'},inventories:{score:1.0,wt:'20%'},demand:{score:1.5,wt:'20%'},usd:{score:1.5,wt:'15%'},seasonal:{score:1.0,wt:'10%'}},
    detail:{
      opec:{rows:[{k:'Hormuz toujours fermé',v:'Iran doubles down · Talks US échoués · 9e semaine',c:'bear'},{k:'Brent = référence internationale',v:'Prime géopolitique Brent > WTI · Spread $11.2',c:'bull'},{k:'Spread Brent/WTI',v:'+$11.2 · Pic géopolitique · Ormuz prime maximale',c:'bull'},{k:'OPEC+',v:'Cuts maintenus · Plancher $80',c:'bull'}],pr:'Brent $107.6 = prime géopolitique max. Spread Brent/WTI à $11.2 (vs $6.62 précédemment). Hormuz toujours fermé = marché pétrolier le plus tendu depuis 2022. Brent peak $128 le 2 Avril.'},
      inventories:{rows:[{k:'Europe / ARA stocks',v:'Légèrement en dessous avg',c:'neutral'},{k:'Flottant iranien',v:'Reprise progressive · Moins de tension',c:'neutral'}],pr:'Stocks européens se normalisent avec la reprise partielle des flux iraniens. Marché international moins tendu qu\'avant le ceasefire.'},
      demand:{rows:[{k:'Europe',v:'Demande stable · Transition vers été',c:'neutral'},{k:'Asie (Chine/Inde)',v:'Importateurs actifs · Routes alternatives',c:'bull'},{k:'USD faible',v:'Rend Brent cher en USD mais attractif en local',c:'bull'}],pr:'Asie toujours active sur le marché physique. Demande mondiale robuste malgré détente geopolitique.'},
      usd:{rows:[{k:'USD / Brent',v:'Corrélation inverse classique',c:'bull'},{k:'EUR/USD 1.178',v:'USD très faible = fort supportif',c:'bull'}],pr:'USD très faible (EUR/USD 1.178) = support fort pour Brent libellé en USD. Compense partiellement la perte de prime géopolitique.'},
      seasonal:{rows:[{k:'Maintenance raffineries',v:'Europe printemps → tension',c:'bull'},{k:'Driving season',v:'Mai-août · Demande globale croissante',c:'bull'}],pr:'Maintenance printanière européenne + approaching driving season = demande crude soutenue. Timing saisonnier toujours positif.'},
    },
    pricing:'Brent $107.6 · Hormuz toujours fermé (9e sem.) · Iran doubles down · Pic $128 le 2 Avr. EIA peak $115 Q2 · Citi $150 si fermé juin. Spread Brent/WTI $11.2.',
    concl:'Brent TRÈS HAUSSIER : $107.6 · Hormuz fermé + Iran doubles down + EIA $115 Q2. Spread Brent/WTI $11.2 (prime géopo. maximale). Acheter les replis $103-105. Stop $95. Citi scénario extrême $150.',
  },
  {
    code:'NATGAS', flag:'🔥', name:'Gaz Naturel', bank:'TVC:NGAS',
    rate:'~$2.58', score:-1.5,
    bias:'LÉG. BAISSIER', biasCls:'bt-ldov',
    keyData:[['Prix (Henry Hub)','$2.58'],['Stocks EIA','+8% vs avg (en normalisation)'],['Saison','Creuse (Avr.) · EQT réduit production']],
    pillars:{opec:{score:0.5,wt:'20%'},inventories:{score:-1.0,wt:'25%'},demand:{score:0.5,wt:'25%'},usd:{score:0.5,wt:'15%'},seasonal:{score:-2.0,wt:'15%'}},
    detail:{
      opec:{rows:[{k:'Pipeline russe Europe',v:'Quasi-stoppé · LNG US demandé',c:'bull'},{k:'Ormuz sem. 8',v:'GNL alternatif toujours recherché',c:'bull'},{k:'OPEC Gaz',v:'Pas de cartel équivalent',c:'neutral'}],pr:'L\'Europe cherche alternatives au gaz russe → LNG US = support structurel. Ormuz bloqué = GNL encore plus demandé. Facteur positif MT.'},
      inventories:{rows:[{k:'Stocks EIA US',v:'+12% vs 5Y average · EXCÉDENT',c:'bear'},{k:'Hiver doux 2025-26',v:'Stocks accumulés · Non consommés',c:'bear'},{k:'Injection printemps',v:'Saison d\'injection · Stocks montent',c:'bear'}],pr:'RETOURNEMENT : stocks US maintenant en EXCÉDENT (+12% vs 5Y avg) suite à hiver doux. Saison d\'injection = stocks continuent à monter = pression baissière CT.'},
      demand:{rows:[{k:'LNG Exports US',v:'Solides mais stables',c:'neutral'},{k:'Data Centers / AI',v:'Croissance lente à se matérialiser sur les prix',c:'neutral'},{k:'Demande chauffage',v:'Hiver terminé → forte baisse',c:'bear'}],pr:'Demande chauffage disparaît avec le printemps. LNG exports stables. Data centers = driver LT mais pas CT. Demande nettement sous les niveaux hivernaux.'},
      usd:{rows:[{k:'Impact USD',v:'Marginal pour le gaz domestique',c:'neutral'}],pr:'Le gaz Henry Hub est principalement un marché domestique US = faible sensibilité au DXY.'},
      seasonal:{rows:[{k:'Avril = saison creuse',v:'Ni chauffe ni clim · Creux annuel',c:'bear'},{k:'Mai-juin injection',v:'Stocks montent → prix bas',c:'bear'},{k:'Été (juillet-août)',v:'Demande clim = rebond possible',c:'neutral'}],pr:'Pire moment saisonnier : après hiver, avant été. Stocks excédentaires + saison creuse = double pression baissière. Attendre l\'été pour le rebond.'},
    },
    pricing:'Henry Hub $2.58 · Stocks encore +8% vs avg (en normalisation). Production en baisse (-4.1 bcfd EQT coupe output). Saison creuse maintient pression. Support $2.40. Rebond $3.00+ avec chaleur estivale.',
    concl:'Gaz Naturel légèrement baissier CT : stocks excédentaires + saison creuse printanière. Attendre fin juin / chaleur estivale pour rebond. Achat CT non recommandé avant $2.40.',
  },
];

let ENERGY_OPPS = [
  {rank:'01',top:true,pair:'BRENT (Long / Hormuz fermé)',dir:'BUY',dirCls:'dir-buy',logic:'<strong>Brent $107.6 · Hormuz toujours fermé (9e sem.) · Iran doubles down · Talks échoués.</strong> EIA peak $115 Q2 · Citi $150 si juin fermé. Spread Brent/WTI $11.2 (prime géopo. max). Acheter replis $103-105.',spread:'Score : <span>+3.5</span> · Range : <span>$100-120</span> · Stop : <span>$95</span>'},
  {rank:'02',top:true,pair:'WTI (Long)',dir:'BUY',dirCls:'dir-buy',logic:'<strong>WTI $96.4 · Hormuz fermé + OPEC+ plancher $80 + Driving season US (mai-août).</strong> IEA demand 103.8 Mb/j · Chine +4.2%. Acheter replis $92-94.',spread:'Score : <span>+2.5</span> · Range : <span>$92-105</span> · Stop : <span>$85</span>'},
  {rank:'03',top:false,pair:'NAT GAS (Éviter CT)',dir:'SELL / ÉVITER',dirCls:'dir-sell',logic:'<strong>Stocks EIA +8% vs avg · Saison creuse printanière · Production EQT en baisse (-4.1 bcfd).</strong> Floor possible CT. Attendre $2.40 ou chaleur estivale pour rebond.',spread:'Score : <span>−1.5</span> · Support : <span>$2.40</span> · Rebond été : <span>$3.00-3.20</span>'},
];

/* ═══════════════════════════════════════════
   INDICES
═══════════════════════════════════════════ */
const INDICES_PKEYS = ['policy','macro','earnings','flows','risk'];
const INDICES_PLBLS = ['BC','Macro','EPS','Flux','Risk'];
const INDICES_PDEF  = [
  {key:'policy',   icon:'🏦', label:'Banque Centrale / Taux'},
  {key:'macro',    icon:'📊', label:'Macro (PMI / GDP / Emploi)'},
  {key:'earnings', icon:'💰', label:'Résultats & Valorisations (P/E)'},
  {key:'flows',    icon:'📥', label:'Flux Institutionnels / Positioning'},
  {key:'risk',     icon:'⚠️',  label:'Risk Sentiment / VIX'},
];

let INDICES = [
  {
    code:'S&P 500', flag:'🇺🇸', name:'S&P 500', bank:'FOREXCOM:SPXUSD',
    rate:'~7,174', score:2.0,
    bias:'HAUSSIER', biasCls:'bt-hawk',
    keyData:[['Niveau','7,174 ATH'],['P/E fwd','~25x'],['FOMC','28-29 Avr. · Hold 94% prob.']],
    pillars:{policy:{score:2.0,wt:'25%'},macro:{score:1.5,wt:'25%'},earnings:{score:1.0,wt:'20%'},flows:{score:2.0,wt:'15%'},risk:{score:1.5,wt:'15%'}},
    detail:{
      policy:{rows:[{k:'Fed Funds',v:'3.50-3.75% · Cycle baissier amorcé',c:'bull'},{k:'Cuts Fed 2026',v:'Plusieurs cuts effectués · Liquidité ↑',c:'bull'},{k:'Fed pivot',v:'USD faible + taux réels bas = supportif',c:'bull'}],pr:'Fed en cycle de baisse (3.50-3.75%) = taux réels en baisse = valorisations soutenues. USD faible = pas de pression sur les bénéfices des multinationales. Régime monétaire accommodant.'},
      macro:{rows:[{k:'GDP US 2026',v:'Solide · Régime REFLATION',c:'bull'},{k:'Emploi',v:'Solide · Consommation robuste',c:'bull'},{k:'PMI Services',v:'En expansion',c:'bull'},{k:'Retail Sales',v:'Consommation solide',c:'bull'}],pr:'Macro US solide : croissance réelle + emploi + consommation. Régime REFLATION = activité économique forte sans récession. Contexte idéal pour les actions.'},
      earnings:{rows:[{k:'P/E Forward S&P',v:'~25x · Élevé mais soutenu par cuts',c:'neutral'},{k:'EPS Q1 2026',v:'Saison solide · Beats > misses',c:'bull'},{k:'Marges',v:'MAG7 · Résultats IA forts',c:'bull'},{k:'Guidance',v:'Optimiste · Reflation = pricing power',c:'bull'}],pr:'Saison EPS solide. Marges soutenues par le pricing power en contexte REFLATION. MAG7 continue de livrer sur l\'IA. Valorisations élevées mais justifiées par les cuts Fed.'},
      flows:{rows:[{k:'ETF SPY flows',v:'Flux entrants records · Risk-on',c:'bull'},{k:'Institutionnels',v:'Net long S&P · Consensus haussier',c:'bull'},{k:'Buybacks',v:'Records · MAG7 rachète massif',c:'bull'}],pr:'Positionnement institutionnel net long. Buybacks records des MAG7. Flux entrants ETF = soutien mécanique continu.'},
      risk:{rows:[{k:'VIX',v:'~15 · Risk-on · Complacency',c:'bull'},{k:'Régime',v:'REFLATION · RISK-ON',c:'bull'},{k:'Risque correction',v:'P/E 25x = vulnérable à surprise hawkish',c:'bear'},{k:'Iran ceasefire',v:'Pétrole $88.8 · Pression marges réduite',c:'bull'}],pr:'VIX bas = confiance du marché. Détente Iran → pétrole en baisse = marges améliorées. Risque : Fed hawkish surprise. Tant que le régime REFLATION tient et pétrole < $95, biais haussier.'},
    },
    pricing:'S&P 7,174 ATH · REFLATION intact + EPS saison solide + FOMC 28-29 Avr. hold attendu. Pétrole $96 = légère pression marges. VIX bas = risk-on. Support 7,000. Cible CT 7,300-7,500.',
    concl:'S&P 500 HAUSSIER : ATH 7,174 · REFLATION + EPS forts + FOMC hold 28-29 Avr. Pétrole $96 surveiller (marges). Acheter replis 7,000-7,050. Stop 6,750.',
  },
  {
    code:'NASDAQ', flag:'🇺🇸', name:'Nasdaq 100', bank:'FOREXCOM:NSXUSD',
    rate:'~24,887', score:2.5,
    bias:'TRÈS HAUSSIER', biasCls:'bt-hawk',
    keyData:[['Niveau','24,887 ATH'],['P/E fwd','~30x'],['MAG7','Saison EPS en cours']],
    pillars:{policy:{score:2.5,wt:'25%'},macro:{score:1.5,wt:'20%'},earnings:{score:2.0,wt:'25%'},flows:{score:2.0,wt:'15%'},risk:{score:1.5,wt:'15%'}},
    detail:{
      policy:{rows:[{k:'Fed dovish',v:'Cuts amorcés = support massif tech',c:'bull'},{k:'Taux réels ↓',v:'Discount cash-flows futurs = re-rating',c:'bull'},{k:'USD faible',v:'Tech = revenus mondiaux · USD faible boost',c:'bull'}],pr:'Triple soutien tech : Fed dovish + taux réels en baisse + USD faible. Environnement idéal pour la tech à high-multiple. Re-rating de toute la catégorie.'},
      macro:{rows:[{k:'PMI Services',v:'En expansion',c:'bull'},{k:'Capex AI',v:'Investissements records MAG7 (+40% YoY)',c:'bull'},{k:'Cloud / SaaS',v:'Croissance acceleree',c:'bull'}],pr:'L\'IA = supercycle d\'investissement. Capex records des hyperscalers. Croissance SaaS revenue robuste. Macro technologique au pic.'},
      earnings:{rows:[{k:'P/E forward NQ100',v:'~30x · Élevé mais livraison EPS forte',c:'neutral'},{k:'MAG7 EPS',v:'Beats records · IA révèle la monétisation',c:'bull'},{k:'Croissance EPS tech 2026',v:'+18-22% · Accélération',c:'bull'},{k:'AI monetization',v:'Revenus IA concrets = re-rating',c:'bull'}],pr:'L\'IA commence à se monétiser concrètement. Beats sur les EPS + révisions à la hausse = momentum puissant. 30x se justifie avec 20%+ croissance EPS.'},
      flows:{rows:[{k:'ETF QQQ flows',v:'Flux entrants massifs',c:'bull'},{k:'Institutionnels tech',v:'Réallocation vers croissance',c:'bull'}],pr:'Flux massifs vers tech = momentum de momentum. Réallocation globale vers la croissance en régime REFLATION.'},
      risk:{rows:[{k:'Bêta vs S&P',v:'1.35 · Amplifie la hausse',c:'bull'},{k:'VIX / VXN',v:'VXN bas · Confiance tech',c:'bull'},{k:'Risque valorisation',v:'30x = sensible à surprise hawkish',c:'bear'}],pr:'En RISK-ON, le beta élevé de 1.35 est un avantage. Amplifie la hausse du S&P. Risque = valorisation extrême si Fed hawkish surprise.'},
    },
    pricing:'NQ 24,887 ATH · Monétisation IA + FOMC hold 29 Avr. + EPS MAG7 saison. Pétrole $96 impact marginal tech. Support 24,000. Cible MT 26,500-27,500.',
    concl:'Nasdaq TRÈS HAUSSIER : ATH 24,887 · Supercycle IA + FOMC hold + EPS MAG7 saison. Plus fort momentum marché. Acheter replis 24,000-24,400. Stop 23,200.',
  },
  {
    code:'DAX 40', flag:'🇩🇪', name:'DAX 40', bank:'FOREXCOM:DEU40',
    rate:'~24,100', score:1.5,
    bias:'HAUSSIER', biasCls:'bt-hawk',
    keyData:[['Niveau','24,100'],['P/E fwd','~15x'],['ECB','2.00% accommodant · Zeitenwende']],
    pillars:{policy:{score:2.5,wt:'25%'},macro:{score:0.5,wt:'25%'},earnings:{score:1.0,wt:'20%'},flows:{score:2.0,wt:'15%'},risk:{score:1.0,wt:'15%'}},
    detail:{
      policy:{rows:[{k:'BCE',v:'2.00% · Accommodant · Cycle baissier',c:'bull'},{k:'EUR/USD 1.178',v:'EUR fort = pouvoir d\'achat import',c:'neutral'},{k:'Stimulus fiscal DE',v:'Zeitenwende · Infrastructure · Défense',c:'bull'}],pr:'BCE à 2.00% (accommodant) + stimulus fiscal massif allemand (Zeitenwende 2026 = 100Mrd€ défense + infrastructure) = soutien monétaire ET fiscal. Régime de politique idéal.'},
      macro:{rows:[{k:'GDP Allemagne 2026',v:'Rebond grâce au stimulus fiscal',c:'bull'},{k:'Mfg PMI Allemagne',v:'Récupération · Commandes défense',c:'neutral'},{k:'Défense / Infra',v:'Boom commandes · Rheinmetall, Siemens',c:'bull'},{k:'EUR fort',v:'Léger frein exportations',c:'bear'}],pr:'Stimulus fiscal de guerre (défense 2% PIB+) = commandes massives pour l\'industrie allemande. Rheinmetall, Leonardo = gagnants clairs. EUR fort = légère friction exportations mais compensé par le stimulus.'},
      earnings:{rows:[{k:'P/E fwd DAX',v:'~15x · Attractif vs US',c:'bull'},{k:'Secteur Défense',v:'Rheinmetall, MTU +80% YTD',c:'bull'},{k:'EPS DAX',v:'Révisions en hausse · Stimulus impact',c:'bull'},{k:'Auto sector',v:'En transition · Plus une pression',c:'neutral'}],pr:'Secteur défense = driver massif inattendu. EPS en révision à la hausse. Valorisations encore attractives vs US malgré l\'ATH.'},
      flows:{rows:[{k:'Flux étrangers vers DAX',v:'Rotation hors US vers Europe',c:'bull'},{k:'USD faible',v:'EUR/USD 1.178 = Europe attractif $ terms',c:'bull'}],pr:'Rotation globale hors USD vers Europe. DAX bénéficie doublement : rotation Europe + stimulus fiscal. Flux forts.'},
      risk:{rows:[{k:'Régime',v:'RISK-ON · Favorable',c:'bull'},{k:'Iran pétrole',v:'WTI $95 · Pression marges industrie',c:'bear'},{k:'EUR fort',v:'Légère contrainte exportateurs',c:'neutral'}],pr:'RISK-ON = favorable DAX. Risque principal : EUR trop fort ou Iran bloque les chaînes logistiques. Mais stimulus compense largement.'},
    },
    pricing:'DAX 24,100 · Léger repli depuis ATH. Pétrole $96-$108 = coûts industrie allemande sous pression. BCE 2.00% + Zeitenwende = soutien. EUR/USD 1.171. Support 23,500. Cible 25,000-26,000.',
    concl:'DAX HAUSSIER : 24,100 · BCE 2.00% + Zeitenwende + défense = soutien. Risque : Brent $108 pèse industrie. Secteur défense (Rheinmetall) = driver offsetting. Acheter replis 23,500-23,700.',
  },
  {
    code:'NIKKEI', flag:'🇯🇵', name:'Nikkei 225', bank:'FOREXCOM:JPN225',
    rate:'~60,537', score:3.0,
    bias:'TRÈS HAUSSIER', biasCls:'bt-hawk',
    keyData:[['Niveau','60,537 ATH'],['BoJ','Hold 0.75% · 3/9 membres pro-hike'],['USD/JPY','~158.0 · JPY légèrement fort']],
    pillars:{policy:{score:3.0,wt:'25%'},macro:{score:2.5,wt:'25%'},earnings:{score:2.5,wt:'20%'},flows:{score:2.0,wt:'15%'},risk:{score:2.0,wt:'15%'}},
    detail:{
      policy:{rows:[{k:'BoJ 28 Avr.',v:'HOLD 0.75% confirmé MAIS 3/9 membres pro-hike (Nakagawa, Takata, Tamura)',c:'neutral'},{k:'Inflation BoJ',v:'Core CPI révisé 2.8% (vs 1.9%) · Upside Iran war',c:'bear'},{k:'USD/JPY',v:'~158.0 · JPY légèrement plus fort post-BoJ',c:'neutral'},{k:'Croissance BoJ',v:'GDP FY2026 coupé à 0.5% (vs 1%)',c:'bear'}],pr:'BoJ HOLD confirmé (6-3) mais signal hawkish : 3 membres dissidents pro-hike. Inflation révisée à 2.8%. USD/JPY retombe vers 158 (JPY légèrement fort). Growth coupé à 0.5% = argument contre hike immédiat.'},
      macro:{rows:[{k:'GDP Japon 2026',v:'Meilleur en 30 ans · Reflation',c:'bull'},{k:'Shunto 2026',v:'+5.8% hausse salariale · Record',c:'bull'},{k:'PMI Mfg',v:'En expansion · Commandes export',c:'bull'},{k:'CPI Japon',v:'>2% · Sortie déflation = historique',c:'bull'}],pr:'Japon en train de sortir de 30 ans de déflation. Hausse salariale record Shunto 2026 (+5.8%) = spirale vertueuse prix-salaires pour la première fois. Événement macro majeur.'},
      earnings:{rows:[{k:'EPS exportateurs',v:'USD/JPY 159 = profits records Toyota, Sony',c:'bull'},{k:'P/E fwd Nikkei',v:'~18x · Raisonnable vs US',c:'bull'},{k:'Révisions EPS',v:'En forte hausse · Shunto + FX',c:'bull'},{k:'Corporate governance',v:'TSE reform · ROE improvement',c:'bull'}],pr:'USD/JPY 159 = exportateurs japonais au pic de profitabilité. EPS en forte révision à la hausse. Corporate governance reform (TSE) = re-rating structurel. Valorisation encore raisonnable.'},
      flows:{rows:[{k:'Flux étrangers',v:'Acheteurs nets massifs',c:'bull'},{k:'Berkshire Hathaway',v:'Augmente position Japon 2026',c:'bull'},{k:'Réforme TSE',v:'Buybacks records + dividendes',c:'bull'}],pr:'Flux étrangers très forts. Berkshire Hathaway continue d\'augmenter ses positions. TSE reform = flood de buybacks + dividendes = support mécanique.'},
      risk:{rows:[{k:'Régime',v:'RISK-ON global · Parfait pour Nikkei',c:'bull'},{k:'BoJ dovish 27-28 Avr.',v:'10% prob. hike (était 44%) = JPY reste faible',c:'bull'},{k:'ATH zone',v:'59,000+ · Consolidation avant nouveau leg',c:'neutral'}],pr:'RISK-ON + BoJ dovish = scénario parfait pour le Nikkei. La chute de 44% à 10% de probabilité de hike BoJ = JPY reste faible = exportateurs profitables plus longtemps. Risque résiduel : si géopolitique JPY safe-haven se réveille.'},
    },
    pricing:'Nikkei 60,537 ATH · BoJ HOLD 0.75% (3/9 pro-hike) · USD/JPY 158 · Shunto +5.8% · TSE reform · RISK-ON = ATH confirmé. Support 59,000. Cible 62,000-65,000.',
    concl:'Nikkei TRÈS HAUSSIER : ATH 60,537 · BoJ HOLD confirmé (3 dissenters = futur signal hike MT) · USD/JPY 158 · EPS exportateurs records. Achat conviction. Stop 58,500.',
  },
  {
    code:'CAC 40', flag:'🇫🇷', name:'CAC 40', bank:'FOREXCOM:FRA40',
    rate:'~8,139', score:0.5,
    bias:'LÉG. HAUSSIER', biasCls:'bt-lhawk',
    keyData:[['Niveau','8,139'],['P/E fwd','~14x'],['LVMH','Chine reprend · Pétrole $108 pèse']],
    pillars:{policy:{score:2.0,wt:'25%'},macro:{score:0.5,wt:'25%'},earnings:{score:0.5,wt:'20%'},flows:{score:1.0,wt:'15%'},risk:{score:0.5,wt:'15%'}},
    detail:{
      policy:{rows:[{k:'BCE 2.00%',v:'Accommodant · Cycle baissier amorcé',c:'bull'},{k:'EUR/USD 1.178',v:'EUR fort · Mixte',c:'neutral'}],pr:'BCE à 2.00% = accommodant = support valorisations. EUR fort = légère pression compétitivité exportateurs mais signe de confiance en zone euro.'},
      macro:{rows:[{k:'GDP France 2026',v:'+1.2% · Amélioration',c:'bull'},{k:'Consommation',v:'Stimulus fiscal Macron · Rebond',c:'neutral'},{k:'EUR fort',v:'France = importatrice nette énergétique',c:'bull'}],pr:'EUR fort = facture énergétique plus légère pour la France (importatrice). Croissance en légère amélioration vs 2025. Stimulus fiscal présent.'},
      earnings:{rows:[{k:'P/E fwd CAC',v:'~14x · Attractif vs US',c:'bull'},{k:'LVMH (15% indice)',v:'Chine REFLATION = luxe en reprise',c:'bull'},{k:'Secteur financier',v:'BNP/SG · BCE dovish = marges NIM',c:'neutral'}],pr:'LVMH = baromètre Chine. Régime REFLATION global = consommation luxe Chine en rebond. LVMH surperforme après des mois de pression. Positive surprise potentielle.'},
      flows:{rows:[{k:'Rotation hors USD',v:'EUR/USD 1.178 = Europe attractif',c:'bull'},{k:'Value vs Growth',v:'CAC = value · Bénéficie de la rotation',c:'bull'}],pr:'Rotation globale vers l\'Europe (USD faible) = flux entrants CAC. Valorisations attractives vs US attirent les réallocations.'},
      risk:{rows:[{k:'Régime',v:'RISK-ON · Favorable',c:'bull'},{k:'EUR trop fort',v:'Si 1.20+ → pression exportateurs',c:'neutral'},{k:'WTI $95',v:'France importatrice net pétrole · Neutre',c:'neutral'}],pr:'RISK-ON = support général. EUR fort à surveiller si 1.20+. Pétrole $95 = léger frein mais compensé par EUR fort pour les importations.'},
    },
    pricing:'CAC 8,139 · BCE 2.00% + LVMH Chine rebond · MAIS Brent $108 pèse France (importatrice nette). Support 7,900-8,000. Cible 8,500-8,700 si pétrole cède.',
    concl:'CAC légèrement haussier : 8,139 · BCE 2.00% + LVMH rebond. MAIS Brent $108 = vent de face France importatrice. Acheter replis 7,900-8,000. Surveiller pétrole.',
  },
  {
    code:'FTSE 100', flag:'🇬🇧', name:'FTSE 100', bank:'FOREXCOM:UK100',
    rate:'~10,334', score:1.0,
    bias:'HAUSSIER', biasCls:'bt-hawk',
    keyData:[['Niveau','10,334'],['Div. Yield','3.5%'],['Shell/BP','WTI $96.4 = profits ↑ · Or $4,683 Rio/BHP ↑']],
    pillars:{policy:{score:1.5,wt:'25%'},macro:{score:1.0,wt:'25%'},earnings:{score:2.0,wt:'20%'},flows:{score:1.5,wt:'15%'},risk:{score:1.5,wt:'15%'}},
    detail:{
      policy:{rows:[{k:'BoE',v:'3.75% · Cycle baissier',c:'bull'},{k:'GBP/USD 1.32',v:'GBP fort · Revenus étrangers en £ = atténués',c:'neutral'},{k:'BoE dovish',v:'Cuts = support indirect valorisations',c:'bull'}],pr:'BoE en cycle baissier (3.75%) = valorisations soutenues. GBP fort (1.32) = légère pression sur la traduction des revenus étrangers. Mais BoE dovish = support net positif.'},
      macro:{rows:[{k:'UK GDP 2026',v:'+1.4% · Amélioration',c:'bull'},{k:'Composition FTSE',v:'40% énergie/mines/financières',c:'bull'},{k:'GBP/USD 1.32',v:'Signe de force macroéconomique UK',c:'bull'}],pr:'FTSE bénéficie de sa composition défensive : 40% en énergie, mines, financières. Moins tech = moins volatil. GDP UK en amélioration.'},
      earnings:{rows:[{k:'P/E fwd FTSE',v:'~13x · Très attractif vs monde',c:'bull'},{k:'Dividend yield',v:'3.5% · Attractif',c:'bull'},{k:'Shell/BP',v:'WTI $88.8 · Légèrement réduit vs $95',c:'neutral'},{k:'Rio Tinto/BHP',v:'Or $4,830 ATH + Cuivre $5.89/lb · Profits record',c:'bull'}],pr:'Composition mixte : Shell/BP légèrement affectés par la baisse du WTI ($88.8 vs $95) mais Rio/BHP bénéficient de Or ATH $4,830 et Cuivre +30% ($5.89/lb). P/E 13x + 3.5% yield = meilleur rapport qualité/prix des marchés développés.'},
      flows:{rows:[{k:'Flux value',v:'FTSE = value pur · Réallocation globale',c:'bull'},{k:'Dividend hunters',v:'3.5% + GBP/USD 1.32 = attractif',c:'bull'}],pr:'Double attractivité : yield élevé + potentiel hausse. GBP fort = rendement en EUR/USD encore plus attractif pour étrangers.'},
      risk:{rows:[{k:'Régime',v:'RISK-ON · Bénéfique',c:'bull'},{k:'GBP fort',v:'1.32 · Léger frein revenus étrangers',c:'neutral'},{k:'Defensif',v:'Énergie/banques/mines = stables',c:'bull'}],pr:'RISK-ON = favorable FTSE (composition cyclique via énergie). GBP fort = léger headwind mais compensé par commodités très fortes.'},
    },
    pricing:'FTSE 10,334 · Léger repli · Shell/BP profitent de WTI $96 · Rio/BHP = Or $4,683 + Cuivre $6.03. Composition énergétique favorable en choc pétrolier. P/E 13x + yield 3.5% = attractif. Support 10,100. Cible 10,700-11,200.',
    concl:'FTSE LÉG. HAUSSIER : 10,334 · Shell/BP profitent du WTI $96 · Rio/BHP = Or $4,683 + Cuivre $6.03. Composition FTSE (énergie + mines) = hedge naturel choc pétrolier. P/E 13x + yield 3.5%. Acheter replis 10,100.',
  },
];

let INDICES_OPPS = [
  {rank:'01',top:true,pair:'NIKKEI (Long)',dir:'BUY',dirCls:'dir-buy',logic:'<strong>ATH 60,537 · BoJ HOLD confirmé (3/9 pro-hike = futur signal hawkish MT).</strong> USD/JPY 158 · Shunto +5.8% · TSE reform · EPS exportateurs records. Meilleur indice DM.',spread:'Score : <span>+3.0</span> · Niveau : <span>60,537 ATH</span> · Cible : <span>62,000-65,000</span>'},
  {rank:'02',top:true,pair:'NASDAQ (Long)',dir:'BUY',dirCls:'dir-buy',logic:'<strong>ATH 24,887 · Monétisation IA concrète · FOMC hold + EPS MAG7 saison.</strong> MAG7 beats records. 30x P/E justifié +20% EPS. Beta 1.35 = amplificateur RISK-ON.',spread:'Score : <span>+2.5</span> · Niveau : <span>24,887 ATH</span> · Cible : <span>26,500-27,500</span>'},
  {rank:'03',top:false,pair:'FTSE (Long)',dir:'BUY',dirCls:'dir-buy',logic:'<strong>ATH 10,609 · Super-cycle Or/Cuivre.</strong> Rio/BHP = Or $4,830 ATH + Cuivre $5.89/lb (+30%). Shell/BP légèrement freiné (WTI $88.8). Net positif. P/E 13x + yield 3.5% = moins cher + mieux rémunéré.',spread:'Score : <span>+1.5</span> · Niveau : <span>10,609 ATH</span> · Yield : <span>3.5%</span>'},
  {rank:'04',top:false,pair:'DAX (Long) / NASDAQ (Spread)',dir:'BUY DAX / Relatif',dirCls:'dir-buy',logic:'<strong>24,100 · Zeitenwende fiscal + BCE 2.00% · Pétrole $108 = pression mais secteur défense offsette.</strong> Pair trade : long DAX (15x) / short NQ (30x) si valorisation US fatigue.',spread:'Score : <span>+1.5</span> · P/E spread : <span>15x DAX vs 30x NQ</span>'},
];

/* ═══════════════════════════════════════════
   CRYPTO
═══════════════════════════════════════════ */
const CRYPTO_PKEYS = ['macro','onchain','adoption','supply','sentiment'];
const CRYPTO_PLBLS = ['Macro','Chain','Adopt.','Supply','Sent.'];
const CRYPTO_PDEF  = [
  {key:'macro',     icon:'📊', label:'Corrélation Macro (Fed / Risk)'},
  {key:'onchain',   icon:'⛓️', label:'On-Chain (Hash Rate / Activité réseau)'},
  {key:'adoption',  icon:'🏛️', label:'Adoption (ETF Spot / Institutionnel)'},
  {key:'supply',    icon:'₿',  label:'Dynamique de l\'offre (Halving / Burns)'},
  {key:'sentiment', icon:'😨', label:'Sentiment (Funding / Fear & Greed)'},
];

let CRYPTO = [
  {
    code:'BTC', flag:'₿', name:'Bitcoin', bank:'BINANCE:BTCUSDT',
    rate:'~$78,263', score:-0.5,
    bias:'LÉG. BAISSIER', biasCls:'bt-ldov',
    keyData:[['Prix','~$78,263'],['Dominance','58.2%'],['vs ATH','−39% depuis $128K']],
    pillars:{
      macro:     {score:-1.5, wt:'20%'},
      onchain:   {score:1.0,  wt:'25%'},
      adoption:  {score:1.5,  wt:'25%'},
      supply:    {score:2.0,  wt:'20%'},
      sentiment: {score:-2.5, wt:'10%'},
    },
    detail:{
      macro:{rows:[{k:'Rebond $79K',v:'Récupération depuis $74K · Correction ralentit',c:'neutral'},{k:'Décorrélation SPX',v:'BTC −38% ATH / S&P +ATH = paradoxe partiel',c:'neutral'},{k:'Régime crypto',v:'BTC en correction mid-cycle · Potentielle base',c:'neutral'},{k:'USD très faible',v:'EUR/USD 1.178 · Devrait soutenir BTC = timide rebond',c:'bull'},{k:'Or digital vs Or',v:'Or $4,830 ATH / BTC rebond = narratif rattrapant',c:'neutral'}],pr:'BTC rebondit vers $79K depuis le bas de $74K. La correction mid-cycle ralentit. USD très faible + Or ATH = environnement favorable qui commence à soutenir BTC. Correction typique de milieu de cycle post-halving : -38% depuis le pic, potentiellement proche du fond.'},
      onchain:{rows:[{k:'Hash Rate',v:'ATH · Réseau sécurisé',c:'bull'},{k:'Active Addresses',v:'En légère baisse vs pic',c:'neutral'},{k:'Exchange Outflows',v:'Accumulation smart money continue',c:'bull'},{k:'HODL Waves',v:'>68% supply non bougée > 1 an',c:'bull'},{k:'Long-term holders',v:'Accumulation record',c:'bull'}],pr:'On-chain fondamentaux solides : Hash Rate ATH + accumulation long terme continue. Les holders forts achètent la faiblesse. Signal positif MT malgré la correction CT.'},
      adoption:{rows:[{k:'ETF BTC Spot US (iShares)',v:'AUM $52Bn · Flows nets positifs',c:'bull'},{k:'MicroStrategy',v:'>680,000 BTC · Continue d\'acheter',c:'bull'},{k:'Fortune 500',v:'23 entreprises trésorerie BTC',c:'bull'},{k:'Nations souveraines',v:'El Salvador + 3 nouveaux pays',c:'neutral'}],pr:'Adoption institutionnelle continue malgré la correction. ETF flows nets positifs = achat institutionnel dans la faiblesse. Trésoreries d\'entreprises en hausse.'},
      supply:{rows:[{k:'Halving Avr. 2024',v:'Récompense : 3.125 BTC/bloc',c:'bull'},{k:'Émission annuelle',v:'~165,000 BTC/an · −50% vs avant',c:'bull'},{k:'Correction mid-cycle',v:'Typique : −30-50% avant nouveau leg',c:'neutral'},{k:'Prochain halving',v:'2028 → supply encore réduite',c:'bull'}],pr:'Correction -42% = normale en cycle post-halving (chaque cycle a 1-2 corrections -40-50% avant ATH final). Supply compressée + demande ETF = thèse LT intacte.'},
      sentiment:{rows:[{k:'Fear & Greed Index',v:'28 / 100 → EXTREME FEAR',c:'bear'},{k:'Funding Rates',v:'Très négatifs · Shorts massifs',c:'bear'},{k:'Dominance BTC',v:'58.2% → flight to quality crypto',c:'neutral'},{k:'Contrarian signal',v:'Extreme fear = zone d\'accumulation historique',c:'bull'},{k:'Retail',v:'Capitulation partielle',c:'neutral'}],pr:'EXTREME FEAR (28) = zone de capitulation = historiquement zone d\'achat LT. Funding ultra-négatif = squeeze violent possible. Contrarian positif pour les accumulateurs patients.'},
    },
    pricing:'BTC ~$78,263 · Rebond depuis $74K · Correction mid-cycle -39% depuis ATH. Zone d\'accumulation $74-80K = smart money active. FOMC 28-29 Avr. = catalyseur potentiel. Cible 18-24M : $150-200K.',
    concl:'BTC légèrement baissier CT mais signal de rebond : $79K (+6% depuis le bas) + USD faible + Or ATH = environnement favorable. DCA aggressif $74-80K. Cible 18-24M : $150-200K. Accumulation stratégique.',
  },
  {
    code:'ETH', flag:'Ξ', name:'Ethereum', bank:'BINANCE:ETHUSDT',
    rate:'~$2,282', score:-1.5,
    bias:'BAISSIER', biasCls:'bt-dov',
    keyData:[['Prix','$2,282'],['ETH/BTC','0.0291'],['vs ATH','−70% depuis $7,500']],
    pillars:{
      macro:     {score:-2.0, wt:'20%'},
      onchain:   {score:0.5,  wt:'25%'},
      adoption:  {score:-0.5, wt:'25%'},
      supply:    {score:0.5,  wt:'20%'},
      sentiment: {score:-3.0, wt:'10%'},
    },
    detail:{
      macro:{rows:[{k:'Décorrélation sévère',v:'ETH −68% ATH vs S&P ATH',c:'bear'},{k:'ETH/BTC ratio',v:'0.0313 · Niveau historiquement bas',c:'bear'},{k:'Sous-performance',v:'ETH sous-performe BTC systématiquement 2026',c:'bear'},{k:'Narratif défaillant',v:'"Ultrasound money" ne suffit plus',c:'bear'}],pr:'ETH souffre d\'un problème de narratif en 2026. BTC = "Or digital" (simple, efficace). ETH = plateforme complexe sans catalyseur institutionnel fort. L2 cannibalise les frais ETH.'},
      onchain:{rows:[{k:'DeFi TVL',v:'~$165Bn · En légère baisse',c:'neutral'},{k:'L2 Activity',v:'Arbitrum, Base · TVL en hausse mais fees ETH ↓',c:'neutral'},{k:'Gas Fees',v:'Ultra-bas · EIP-4844 réduit revenus',c:'bear'},{k:'Staking Rate',v:'28% supply stakée · Solide',c:'bull'}],pr:'L2 croissance cannibalise les fees ETH. Gas quasi-nuls = bonne UX mais moins de burns EIP-1559. Staking haut = supply effective réduite.'},
      adoption:{rows:[{k:'ETF ETH Spot US',v:'AUM $8Bn · Très en dessous BTC',c:'bear'},{k:'Institutionnels',v:'Positionnement minimal vs BTC',c:'bear'},{k:'RWA tokenisation',v:'Ethereum = standard mais lent à croître',c:'neutral'},{k:'Pectra upgrade',v:'Effectif · Amélioration UX validators',c:'bull'}],pr:'ETF ETH massively under BTC en termes d\'AUM. Manque de narratif simple. RWA croît mais lentement. Pectra = amélioration technique sans catalyseur prix immédiat.'},
      supply:{rows:[{k:'EIP-1559 Burn',v:'Réduit · Gas très bas',c:'neutral'},{k:'Inflation nette',v:'Légèrement positive en bas gas',c:'bear'},{k:'Staking lock',v:'28% supply immobilisée',c:'bull'}],pr:'Avec gas ultra-bas, les burns sont réduits. ETH légèrement inflationnaire en ce moment = moins attractif vs BTC (déflationnaire post-halving).'},
      sentiment:{rows:[{k:'Fear & Greed',v:'22 / 100 · EXTREME FEAR',c:'bear'},{k:'ETH/BTC Ratio',v:'0.0313 · Quasi-ATB (All Time Low)',c:'bear'},{k:'Funding ETH',v:'Ultra-négatifs · Record shorts',c:'bear'},{k:'Capitulation',v:'Signal contrarian extrême MT',c:'neutral'}],pr:'Sentiment catastrophique. ETH/BTC à quasi-ATB. Capitulation = signal contrarian MT. Mais CT : aucun catalyst clair pour renverser la tendance.'},
    },
    pricing:'ETH $2,324 · Sous-performance structurelle vs BTC. ETH/BTC 0.0313 (quasi-ATB). Support $2,000. Rebond possible si rotation altcoin ou Ethereum ETF inflows accélèrent.',
    concl:'ETH baissier CT/MT : perd la compétition narrative vs BTC + L2 cannibalise fees + ETH/BTC ATB. Attendre retournement ratio ETH/BTC pour conviction. CT : pas de position.',
  },
  {
    code:'SOL', flag:'◎', name:'Solana', bank:'BINANCE:SOLUSDT',
    rate:'~$84', score:-1.5,
    bias:'BAISSIER', biasCls:'bt-dov',
    keyData:[['Prix','$84'],['vs ATH','−58% depuis $200'],['FTX sells','Pression continue']],
    pillars:{
      macro:     {score:-2.0, wt:'20%'},
      onchain:   {score:1.5,  wt:'25%'},
      adoption:  {score:-1.0, wt:'25%'},
      supply:    {score:-1.5, wt:'20%'},
      sentiment: {score:-3.0, wt:'10%'},
    },
    detail:{
      macro:{rows:[{k:'Correction sévère',v:'SOL −57% · Plus que BTC −42%',c:'bear'},{k:'Beta crypto',v:'β ≈ 1.8 vs BTC · Amplifié à la baisse',c:'bear'},{k:'Risk-on paradoxe',v:'S&P ATH mais SOL en correction',c:'bear'},{k:'Décorrélation',v:'Crypto en cycle propre indépendant macro',c:'neutral'}],pr:'SOL amplifie la correction BTC (beta 1.8x). −57% alors que S&P est en ATH = crypto en cycle indépendant. Pas de soutien macro malgré RISK-ON.'},
      onchain:{rows:[{k:'DEX Volume',v:'Jupiter/Raydium · Solide',c:'bull'},{k:'Active Wallets',v:'>900K/jour · En légère baisse',c:'neutral'},{k:'DeFi TVL',v:'~$9Bn · En baisse vs pic',c:'neutral'},{k:'Meme ecosystem',v:'Actif mais moins que pic',c:'neutral'}],pr:'Activité on-chain encore solide malgré la correction de prix. Usage réel de l\'ecosystem Solana continue. Signe positif MT mais insuffisant CT.'},
      adoption:{rows:[{k:'ETF SOL Spot US',v:'En attente SEC · Incertain 2026',c:'bear'},{k:'Visa PayFi',v:'Partenariats actifs',c:'neutral'},{k:'Institutional',v:'Très faible',c:'bear'},{k:'Retail',v:'Capitulation partielle',c:'bear'}],pr:'Pas d\'ETF SOL en 2026. Adoption institutionnelle quasi-nulle. Retail en sortie partielle. Pas de catalyseur d\'adoption CT.'},
      supply:{rows:[{k:'Inflation SOL',v:'~5% annuel · Toujours élevée',c:'bear'},{k:'FTX estate',v:'Ventes continues · ~15M SOL restants',c:'bear'},{k:'Unlocks tokens',v:'Pression structurelle',c:'bear'},{k:'Staking',v:'~65% supply stakée',c:'neutral'}],pr:'Double pression : inflation 5% + FTX estate qui vend encore. Ces vendeurs structurels limitent tout rebond significatif. Résolution attendue fin 2026.'},
      sentiment:{rows:[{k:'Fear & Greed Crypto',v:'22 · EXTREME FEAR',c:'bear'},{k:'Funding SOL',v:'Ultra-négatifs · Records shorts',c:'bear'},{k:'Retail momentum',v:'Capitulation · Sortie de positions',c:'bear'},{k:'Contrarian',v:'Setup rebond violent possible si risk-on crypto',c:'neutral'}],pr:'Sentiment en capitulation. Setup potentiel de short squeeze violent si catalyseur positif (ETF approbation, FTX termine ventes). Mais CT : aucun signal de retournement.'},
    },
    pricing:'SOL $86 · En correction -57% depuis ATH. FTX sells + inflation 5% = double pression. Support $75-80. Rebond potentiel +40-60% si ETF approuvé ou FTX termine.',
    concl:'SOL baissier : FTX vendeur structurel + inflation 5% + pas d\'ETF. MAIS setup contrarian extrême : beta élevé = rebond violent possible. Attendre fin ventes FTX.',
  },
  {
    code:'XRP', flag:'✕', name:'XRP / Ripple', bank:'BINANCE:XRPUSDT',
    rate:'~$1.38', score:-0.5,
    bias:'LÉG. BAISSIER', biasCls:'bt-ldov',
    keyData:[['Prix','$1.38'],['vs ATH','−59% depuis $3.40'],['ODL Volume','Stable']],
    pillars:{
      macro:     {score:-1.5, wt:'20%'},
      onchain:   {score:0.5,  wt:'25%'},
      adoption:  {score:1.5,  wt:'25%'},
      supply:    {score:-1.0, wt:'20%'},
      sentiment: {score:-1.5, wt:'10%'},
    },
    detail:{
      macro:{rows:[{k:'Correction',v:'XRP −59% depuis ATH $3.40',c:'bear'},{k:'Corrélation BTC',v:'β ≈ 0.8 · Suit BTC à la baisse',c:'bear'},{k:'USD faible',v:'Neutre pour XRP (paiements, pas commodity)',c:'neutral'}],pr:'XRP suit la correction générale crypto. Beta modéré mais −59% témoigne de la faiblesse du sentiment altcoin. USD faible = neutre pour XRP (usage paiements, pas commodity USD).'},
      onchain:{rows:[{k:'Transaction Volume',v:'ODL stable',c:'neutral'},{k:'XRPL DEX',v:'AMM actif',c:'bull'},{k:'Active Addresses',v:'~600K/semaine',c:'neutral'}],pr:'Usage réel via ODL stable. XRPL DEX = activité continue. Volume stable confirme utilisation réelle malgré correction prix.'},
      adoption:{rows:[{k:'Victoire SEC (2024)',v:'Clarté légale = floor fondamental',c:'bull'},{k:'Ripple ODL',v:'Partenariats bancaires actifs',c:'bull'},{k:'ETF XRP',v:'Probabilité 2026 en hausse (SEC change)',c:'bull'},{k:'CBDC pilotes',v:'Projets en cours',c:'neutral'}],pr:'Clarté légale = plancher fondamental. ETF XRP plus probable en 2026 avec nouveau SEC sous Trump. Catalyseur potentiel fort mais timing incertain.'},
      supply:{rows:[{k:'Unlocks Ripple',v:'1 Bn XRP/mois · Pression structurelle',c:'bear'},{k:'Supply totale',v:'100 Bn pré-miné',c:'bear'},{k:'Burns',v:'Infimes',c:'neutral'}],pr:'1 milliard de XRP relâché chaque mois = pression de vente mécanique. Principal frein au prix malgré les fondamentaux positifs.'},
      sentiment:{rows:[{k:'XRP Army',v:'Fidèle mais découragée',c:'neutral'},{k:'Funding',v:'Légèrement négatif',c:'bear'},{k:'Catalyseur ETF',v:'Si approuvé = squeeze massif',c:'bull'}],pr:'Communauté fidèle mais découragée par la correction -59%. ETF XRP = catalyseur binaire : si approuvé → squeeze massif. Si rejeté → correction supplémentaire.'},
    },
    pricing:'XRP $1.38 · Correction -59% mais floor fondamental via clarté légale. Support $1.20. Catalyseur binaire : ETF XRP → $3.50-5.00 si approuvé.',
    concl:'XRP légèrement baissier CT : unlocks mensuels + correction générale. Mais catalyseur binaire puissant : ETF XRP en 2026. Accumuler sous $1.30 pour pari ETF. Stop $0.90.',
  },
  {
    code:'BNB', flag:'⬡', name:'BNB', bank:'BINANCE:BNBUSDT',
    rate:'~$623', score:0.0,
    bias:'NEUTRE', biasCls:'bt-neu',
    keyData:[['Prix','$623'],['BSC TVL','$8.8Bn'],['Burn Trim.','$130M']],
    pillars:{
      macro:     {score:-1.0, wt:'20%'},
      onchain:   {score:1.0,  wt:'25%'},
      adoption:  {score:-0.5, wt:'25%'},
      supply:    {score:1.0,  wt:'20%'},
      sentiment: {score:-0.5, wt:'10%'},
    },
    detail:{
      macro:{rows:[{k:'Régime crypto',v:'Correction générale · BNB résistant',c:'neutral'},{k:'vs ATH',v:'BNB −38% vs pic · Moins que ETH/SOL',c:'neutral'},{k:'Volumes Binance',v:'Stables en correction',c:'neutral'}],pr:'BNB surperforme ETH/SOL en relative value pendant la correction. Binance maintient ses volumes. Moins volatile que les altcoins purs.'},
      onchain:{rows:[{k:'BSC TVL',v:'$8.8Bn · 3e blockchain DeFi',c:'bull'},{k:'BNB Chain Activity',v:'Volumes stables',c:'neutral'},{k:'GameFi / NFT',v:'Ecosystem actif',c:'neutral'}],pr:'BSC reste solide. TVL légèrement en baisse mais dans le contexte général. Usage retail robuste.'},
      adoption:{rows:[{k:'Binance Exchange',v:'N°1 volumes mais réglements',c:'neutral'},{k:'Institutionnel',v:'Toujours faible (risque réglementaire)',c:'bear'},{k:'Risque CZ/DOJ',v:'Risque résiduel post-règlement',c:'bear'}],pr:'Risque réglementaire toujours présent. Institutions évitent BNB. Mais retail très actif sur BSC.'},
      supply:{rows:[{k:'Burn trimestriel',v:'~$130M brûlé Q1 2026',c:'bull'},{k:'Supply target',v:'100M BNB (vs 200M initial)',c:'bull'},{k:'Progression',v:'~148M actuellement',c:'bull'}],pr:'Burn déflationnaire accéléré. Programme bien avancé vers 100M BNB cible. Positif LT pour le prix.'},
      sentiment:{rows:[{k:'Funding',v:'Neutre',c:'neutral'},{k:'Réglementation',v:'Incertitude résiduelle',c:'bear'},{k:'Communauté',v:'Stable · Binance loyauté',c:'neutral'}],pr:'Sentiment neutre. BNB ne souffre pas autant que SOL/ETH en termes de sentiment négatif. Burn programme = support psychologique.'},
    },
    pricing:'BNB $635 · Résistance relative vs altcoins (+1.3% vs données précédentes). Burns déflationnaires = floor progressif. Support $590. Résistance $680-700. Risque réglementaire = plafond upside.',
    concl:'BNB neutre : résistance relative dans la correction altcoin + burns déflationnaires + léger rebond $635. Ni short ni long fort. Position neutre. Watch : risque réglementaire Binance = event risk.',
  },
];

let CRYPTO_OPPS = [
  {rank:'01',top:true,pair:'BTC (DCA Aggressif)',dir:'BUY (DCA)',dirCls:'dir-buy',logic:'<strong>Rebond $78.3K depuis $74K · Correction mid-cycle −39% · EXTREME FEAR.</strong> Zone d\'accumulation historique. ETF flows positifs = institutionnels achètent la faiblesse. USD faible + Or ATH = environnement favorable. DCA $74-82K. Halving cycle cible $150-200K.',spread:'Score MT : <span>HAUSSIER</span> · Niveau actuel : <span>~$78,263</span> · Cible 18-24M : <span>$150-200K</span>'},
  {rank:'02',top:true,pair:'BTC/ETH (Long Ratio)',dir:'BUY BTC / SELL ETH',dirCls:'dir-buy',logic:'<strong>ETH/BTC à 0.0313 · Quasi-ATB.</strong> ETH perd la guerre narrative vs BTC. L2 cannibalise fees ETH. ETF BTC 6x > ETF ETH. Ratio peut aller à 0.025 dans ce cycle.',spread:'Ratio ETH/BTC : <span>0.0313</span> · Cible : <span>0.025-0.028</span> · Driver : <span>narratif BTC > ETH</span>'},
  {rank:'03',top:false,pair:'XRP (Pari ETF)',dir:'BUY (spéculatif)',dirCls:'dir-buy',logic:'<strong>ETF XRP 2026 = catalyseur binaire.</strong> Clarté légale SEC Win + nouveau régime réglementaire Trump. Si ETF approuvé → $3.50-5.00 (+150%). Accumuler sous $1.30 pour asymétrie.',spread:'Score : <span>−0.5</span> · Catalyseur : <span>ETF XRP 2026</span> · Cible si approuvé : <span>$3.50-5.00</span>'},
  {rank:'04',top:false,pair:'SOL (Rebond différé)',dir:'BUY (différé)',dirCls:'dir-buy',logic:'<strong>Beta 1.8x = rebond violent possible.</strong> Attendre : (1) FTX estate termine les ventes ET (2) Fear&Greed > 50 ET (3) BTC > $85K. Si tous réunis → SOL cible $120-140.',spread:'Score CT : <span>−1.5</span> · Rebond potentiel : <span>+40-60%</span> · Déclencheurs : <span>FTX + BTC $85K</span>'},
];

/* ═══════════════════════════════════════════
   RENDER GÉNÉRIQUE (COMMUN À TOUTES CATÉGORIES)
═══════════════════════════════════════════ */

let _activeData = null;
let _activePdef = null;

function renderCatGrid(data, gridId, pkeys, plbls, pdef) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach((item, i) => {
    const sc    = sCls(item.score);
    const color = scoreColor(item.score);

    const pillarsHtml = pkeys.map((k, pi) => {
      const ps = item.pillars[k]?.score ?? 0;
      return `<div class="p-mini-col">
        <div class="p-mini-bar">
          <div class="p-mini-fill" style="left:0;width:${dotLeft(ps)};background:${scoreColor(ps)};opacity:0.7;"></div>
        </div>
        <div class="p-mini-lbl">${plbls[pi]}</div>
      </div>`;
    }).join('');

    const el = document.createElement('div');
    el.className = 'c-card';
    el.dataset.idx = i;
    el.onclick = () => showCatDetail(data, i, pdef);
    el.innerHTML = `
      <div class="c-head">
        <div class="c-flag-name">
          <div class="c-flag">${item.flag}</div>
          <div><div class="c-code">${item.code}</div><div class="c-bank">${item.bank}</div></div>
        </div>
        <div class="c-right">
          <div class="c-score-val sv-${sc}">${sStr(item.score)}</div>
          <span class="c-bias-tag ${item.biasCls}">${item.bias}</span>
        </div>
      </div>
      <div class="sbar-wrap">
        <div class="sbar-min">-5</div>
        <div class="sbar-track"><div class="sbar-dot" style="left:${dotLeft(item.score)};"></div></div>
        <div class="sbar-max">+5</div>
      </div>
      <div class="p-mini-row">${pillarsHtml}</div>
      <div class="c-data">${item.keyData.map(([k,v]) => `<div class="c-chip">${k} <strong>${v}</strong></div>`).join('')}</div>
    `;
    grid.appendChild(el);
  });
}

function renderCatOpps(opps, gridId) {
  const g = document.getElementById(gridId);
  if (!g) return;
  g.innerHTML = '';
  opps.forEach(o => {
    const el = document.createElement('div');
    el.className = `opp-card${o.top ? ' top' : ''}`;
    el.innerHTML = `
      <div class="opp-rank">${o.rank}</div>
      <div>
        <div class="opp-pair">${o.pair}</div>
        <div class="opp-dir ${o.dirCls}">${o.dir}</div>
        <div class="opp-logic">${o.logic}</div>
        <div class="opp-spread">${o.spread}</div>
      </div>`;
    g.appendChild(el);
  });
}

function showCatDetail(data, idx, pdef) {
  const c     = data[idx];
  const sc    = sCls(c.score);
  const color = scoreColor(c.score);

  // Highlight active card across all grids (only the current category section)
  document.querySelectorAll('.c-card').forEach(el => {
    el.classList.toggle('active', el.dataset.idx == idx &&
      el.parentElement.closest('.cat-section.active'));
  });

  let pillarsHtml = '';
  pdef.forEach(def => {
    const ps  = c.pillars[def.key]?.score ?? 0;
    const d   = c.detail[def.key];
    if (!d) return;
    const rowsHtml = (d.rows || []).map(r =>
      `<div class="d-row"><div class="d-key">${r.k}</div><div class="d-val ${r.c||''}">${r.v}</div></div>`
    ).join('');
    pillarsHtml += `
      <div class="p-sec">
        <div class="p-hdr">
          <div class="p-name">${def.icon} ${def.label} <span class="p-wt">${c.pillars[def.key]?.wt||''}</span></div>
          <div class="p-chip ${pChipCls(ps)}">${sStr(ps)}</div>
        </div>
        <div class="p-sbar-track"><div class="p-sbar-dot" style="left:${dotLeft(ps)};"></div></div>
        ${rowsHtml}
        <div class="pr-box"><div class="pr-title">💡 Market Pricing</div><div class="pr-text">${d.pr}</div></div>
      </div>`;
  });

  document.getElementById('rightPanel').innerHTML = `
    <div class="d-header">
      <div class="d-flag-row">
        <div class="d-flag">${c.flag}</div>
        <div><div class="d-cname">${c.code} — ${c.name}</div><div class="d-bank">${c.bank} · Réf : ${c.rate}</div></div>
      </div>
      <div class="d-score-row">
        <div class="d-score-val sv-${sc}">${sStr(c.score)}</div>
        <div style="flex:1;">
          <div class="d-sbar-track" style="margin-bottom:0.35rem;">
            <div class="d-sbar-dot" style="left:${dotLeft(c.score)};"></div>
          </div>
          <div class="d-score-sub"><strong>${c.bias}</strong>${c.pricing}</div>
        </div>
      </div>
    </div>
    <div class="d-body">
      ${pillarsHtml}
      <div class="concl-box">
        <div class="concl-title">🎯 Conclusion Trading</div>
        <div class="concl-text">${c.concl}</div>
      </div>
    </div>
  `;
  if (window.innerWidth <= 960) {
    document.getElementById('rightPanel').scrollIntoView({behavior:'smooth',block:'start'});
  }
}

/* ── COMPARATEUR A/B ── */
const ALL_ASSETS = [];

function buildRegistry() {
  ALL_ASSETS.length = 0;
  const cats = [
    { label:'Devises G10',       data: CURR,    pkeys: PKEYS,          plbls: PLBLS,          pdef: PDEF },
    { label:'Métaux Précieux',   data: METALS,  pkeys: METALS_PKEYS,   plbls: METALS_PLBLS,   pdef: METALS_PDEF },
    { label:'Énergie',           data: ENERGY,  pkeys: ENERGY_PKEYS,   plbls: ENERGY_PLBLS,   pdef: ENERGY_PDEF },
    { label:'Indices',           data: INDICES, pkeys: INDICES_PKEYS,  plbls: INDICES_PLBLS,  pdef: INDICES_PDEF },
    { label:'Crypto',            data: CRYPTO,  pkeys: CRYPTO_PKEYS,   plbls: CRYPTO_PLBLS,   pdef: CRYPTO_PDEF },
  ];
  cats.forEach(cat => {
    cat.data.forEach(item => {
      ALL_ASSETS.push({ ...item, _catLabel: cat.label, _pkeys: cat.pkeys, _plbls: cat.plbls, _pdef: cat.pdef });
    });
  });
}

function populateCompareSelects() {
  const selA = document.getElementById('cmpSelectA');
  const selB = document.getElementById('cmpSelectB');
  if (!selA || !selB) return;

  const grouped = {};
  ALL_ASSETS.forEach(a => {
    if (!grouped[a._catLabel]) grouped[a._catLabel] = [];
    grouped[a._catLabel].push(a);
  });

  [selA, selB].forEach(sel => {
    sel.innerHTML = '<option value="">— Choisir un actif —</option>';
    Object.entries(grouped).forEach(([cat, assets]) => {
      const grp = document.createElement('optgroup');
      grp.label = cat;
      assets.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.code;
        opt.textContent = `${a.flag} ${a.code} — ${a.name}`;
        grp.appendChild(opt);
      });
      sel.appendChild(grp);
    });
  });
}

function runCompare() {
  const codeA = document.getElementById('cmpSelectA').value;
  const codeB = document.getElementById('cmpSelectB').value;
  const res   = document.getElementById('cmpResult');
  if (!res) return;

  if (!codeA || !codeB) {
    res.innerHTML = '<div class="cmp-empty">Sélectionne deux actifs pour lancer la comparaison</div>';
    return;
  }
  if (codeA === codeB) {
    res.innerHTML = '<div class="cmp-empty">Sélectionne deux actifs différents</div>';
    return;
  }

  const a = ALL_ASSETS.find(x => x.code === codeA);
  const b = ALL_ASSETS.find(x => x.code === codeB);
  if (!a || !b) return;

  const scA = sCls(a.score), scB = sCls(b.score);

  // Build pillar comparison rows using each asset's own pdef
  const pillarHtml = generatePillarComparison(a, b);

  // Key data chips
  const kA = a.keyData.map(([k,v]) => `<div class="c-chip">${k} <strong>${v}</strong></div>`).join('');
  const kB = b.keyData.map(([k,v]) => `<div class="c-chip">${k} <strong>${v}</strong></div>`).join('');

  // Winner logic
  const diff = a.score - b.score;
  let winnerHtml = '';
  if (Math.abs(diff) < 0.5) {
    winnerHtml = `<div class="cmp-verdict cmp-verdict-neutral">⚖️ Actifs quasi-équivalents — score différentiel ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}</div>`;
  } else if (diff > 0) {
    winnerHtml = `<div class="cmp-verdict cmp-verdict-a">🏆 <strong>${a.code}</strong> domine — avantage fondamental <strong>+${diff.toFixed(1)} pts</strong> vs ${b.code}</div>`;
  } else {
    winnerHtml = `<div class="cmp-verdict cmp-verdict-b">🏆 <strong>${b.code}</strong> domine — avantage fondamental <strong>+${Math.abs(diff).toFixed(1)} pts</strong> vs ${a.code}</div>`;
  }

  res.innerHTML = `
    <div class="cmp-header-bar">
      <div class="cmp-asset-header">
        <div class="d-flag">${a.flag}</div>
        <div>
          <div class="cmp-ah-code sv-${scA}">${a.code}</div>
          <div class="cmp-ah-name">${a.name}</div>
          <div class="cmp-ah-cat">${a._catLabel}</div>
        </div>
        <div class="cmp-ah-score sv-${scA}">${sStr(a.score)}</div>
      </div>
      <div class="cmp-vs-badge">VS</div>
      <div class="cmp-asset-header">
        <div class="d-flag">${b.flag}</div>
        <div>
          <div class="cmp-ah-code sv-${scB}">${b.code}</div>
          <div class="cmp-ah-name">${b.name}</div>
          <div class="cmp-ah-cat">${b._catLabel}</div>
        </div>
        <div class="cmp-ah-score sv-${scB}">${sStr(b.score)}</div>
      </div>
    </div>

    <div class="cmp-pillars-wrap">${pillarHtml}</div>

    <div class="cmp-data-grid">
      <div>
        <div style="font-size:0.7rem;color:var(--gold);margin-bottom:0.4rem;font-weight:600;">${a.code} · Données clés</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">${kA}</div>
      </div>
      <div>
        <div style="font-size:0.7rem;color:var(--gold);margin-bottom:0.4rem;font-weight:600;">${b.code} · Données clés</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">${kB}</div>
      </div>
    </div>

    ${winnerHtml}

    <div class="cmp-concl-grid">
      <div class="concl-box" style="margin:0;">
        <div class="concl-title">🎯 ${a.code} — Conclusion</div>
        <div class="concl-text">${a.concl}</div>
      </div>
      <div class="concl-box" style="margin:0;">
        <div class="concl-title">🎯 ${b.code} — Conclusion</div>
        <div class="concl-text">${b.concl}</div>
      </div>
    </div>
  `;
}

function generatePillarComparison(a, b) {
  // Build a unified label map from both assets' pdef
  const labelMap = {};
  [...(a._pdef || []), ...(b._pdef || [])].forEach(d => { labelMap[d.key] = { icon: d.icon, label: d.label }; });

  // Collect all unique pillar keys (preserve order: a first, then any extras from b)
  const keys = [];
  (a._pkeys || []).forEach(k => { if (!keys.includes(k)) keys.push(k); });
  (b._pkeys || []).forEach(k => { if (!keys.includes(k)) keys.push(k); });

  return keys.map(k => {
    const psA = a.pillars[k]?.score;
    const psB = b.pillars[k]?.score;
    const meta = labelMap[k] || { icon: '📌', label: k };
    const hasA = psA !== undefined;
    const hasB = psB !== undefined;

    const barA = hasA ? `<div class="cmp-p-bar"><div class="cmp-p-fill" style="left:0;width:${dotLeft(psA)};background:${scoreColor(psA)};"></div></div><span class="cmp-p-score sv-${sCls(psA)}">${sStr(psA)}</span>` : `<span class="cmp-p-score" style="color:#555;">N/A</span>`;
    const barB = hasB ? `<div class="cmp-p-bar"><div class="cmp-p-fill" style="left:0;width:${dotLeft(psB)};background:${scoreColor(psB)};"></div></div><span class="cmp-p-score sv-${sCls(psB)}">${sStr(psB)}</span>` : `<span class="cmp-p-score" style="color:#555;">N/A</span>`;

    return `
      <div class="cmp-pillar-row">
        <div class="cmp-pr-side">${barA}</div>
        <div class="cmp-pr-label">${meta.icon} <span>${meta.label}</span></div>
        <div class="cmp-pr-side cmp-pr-side-r">${barB}</div>
      </div>`;
  }).join('');
}

/* ── TABS SWITCHING ── */
document.getElementById('catTabs').addEventListener('click', function(e) {
  const btn = e.target.closest('.cat-tab');
  if (!btn) return;
  const cat = btn.dataset.cat;
  document.querySelectorAll('.cat-tab').forEach(b => b.classList.toggle('active', b===btn));
  document.querySelectorAll('.cat-section').forEach(s => s.classList.toggle('active', s.id === 'cat-'+cat));
  // Reset right panel
  document.getElementById('rightPanel').innerHTML = `
    <div class="r-placeholder">
      <div class="r-placeholder-icon">📊</div>
      <p>Sélectionne un actif<br/>pour voir l'analyse complète<br/><br/>
      <span style="font-size:0.65rem;color:rgba(255,215,0,0.4);">5 piliers · Market pricing · Conclusion trading</span></p>
    </div>`;
});

/* ── DATE ── */
document.getElementById('update-date').textContent = '28 Avril 2026';

/* ── INIT ── */
function renderAll(){
  renderGrid();
  renderOpps();
  renderCatGrid(METALS,  'metalsGrid',  METALS_PKEYS,  METALS_PLBLS,  METALS_PDEF);
  renderCatGrid(ENERGY,  'energyGrid',  ENERGY_PKEYS,  ENERGY_PLBLS,  ENERGY_PDEF);
  renderCatGrid(INDICES, 'indicesGrid', INDICES_PKEYS, INDICES_PLBLS, INDICES_PDEF);
  renderCatOpps(METALS_OPPS,  'metalsOppGrid');
  renderCatOpps(ENERGY_OPPS,  'energyOppGrid');
  renderCatOpps(INDICES_OPPS, 'indicesOppGrid');
  renderCatGrid(CRYPTO, 'cryptoGrid', CRYPTO_PKEYS, CRYPTO_PLBLS, CRYPTO_PDEF);
  renderCatOpps(CRYPTO_OPPS, 'cryptoOppGrid');
  buildRegistry();
  populateCompareSelects();
}
renderAll(); /* rendu immédiat avec les valeurs de secours */

/* ── Chargement depuis Supabase (table fundamentals) -> re-render ──
   Alimenté par admin-fondamentaux.html. Si indispo, on garde le secours. */
(async function(){
  try{
    var SB='https://bpfpghlpdzevzyhalxov.supabase.co';
    var KEY='sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ';
    var r=await fetch(SB+'/rest/v1/fundamentals?select=*&order=position.asc',{headers:{'apikey':KEY,'Accept':'application/json'}});
    if(!r.ok) return;
    var rows=await r.json();
    if(!Array.isArray(rows)||!rows.length) return;
    function conv(x){ return {code:x.code,flag:x.flag,name:x.name,bank:x.bank,rate:x.rate,
      score:(x.score==null?0:Number(x.score)),bias:x.bias,biasCls:x.bias_cls,
      keyData:x.key_data||[],pillars:x.pillars||{},detail:x.detail||{},pricing:x.pricing||'',concl:x.concl||''}; }
    var by={currency:[],metal:[],energy:[],indice:[],crypto:[]}, latest=null;
    rows.forEach(function(x){ if(by[x.category]) by[x.category].push(conv(x)); if(x.updated_at&&(!latest||x.updated_at>latest)) latest=x.updated_at; });
    if(by.currency.length) CURR=by.currency;
    if(by.metal.length)    METALS=by.metal;
    if(by.energy.length)   ENERGY=by.energy;
    if(by.indice.length)   INDICES=by.indice;
    if(by.crypto.length)   CRYPTO=by.crypto;
    renderAll();
    if(latest){ var el=document.getElementById('update-date'); if(el) el.textContent=new Date(latest).toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}); }
  }catch(e){}
})();


/* ── Chargement des OPPORTUNITÉS depuis Supabase (table opportunities) ──
   Alimenté par l'IA (api/generate-opportunities.js). Si vide, on garde
   les opportunités de secours codées ci-dessus. */
(async function(){
  try{
    var SB='https://bpfpghlpdzevzyhalxov.supabase.co';
    var KEY='sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ';
    var r=await fetch(SB+'/rest/v1/opportunities?select=*&order=position.asc',{headers:{'apikey':KEY,'Accept':'application/json'}});
    if(!r.ok) return;
    var rows=await r.json();
    if(!Array.isArray(rows)||!rows.length) return;
    function card(x){ return {rank:x.rank||'', top:!!x.top, pair:x.pair||'', dir:x.dir||'',
      dirCls:(x.dir_cls==='dir-sell'?'dir-sell':'dir-buy'), logic:x.logic||'', spread:x.spread||''}; }
    var by={currency:[],metal:[],energy:[],indice:[],crypto:[]};
    rows.forEach(function(x){ if(by[x.category]) by[x.category].push(card(x)); });
    if(by.currency.length) OPPS=by.currency;
    if(by.metal.length)    METALS_OPPS=by.metal;
    if(by.energy.length)   ENERGY_OPPS=by.energy;
    if(by.indice.length)   INDICES_OPPS=by.indice;
    if(by.crypto.length)   CRYPTO_OPPS=by.crypto;
    renderAll();
  }catch(e){}
})();
