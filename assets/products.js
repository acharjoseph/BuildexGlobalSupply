window.BUILDEX_PRODUCTS = (() => {
  const page = (n) => `assets/catalog/casamia/page-${String(n).padStart(2, '0')}.webp`;
  const installation = (n) => `assets/catalog/casamia/applications/page-${String(n).padStart(2, '0')}.webp`;
  const unified = (n) => `assets/catalog/unificado/page-${String(n).padStart(2, '0')}.webp`;
  const item = (name, category, sourcePage, colors = [], specs = []) => ({
    name, category, image: page(sourcePage), cardImage: installation(sourcePage),
    alt: `${name}, página del Catálogo General de Acabados 2026`, colors, specs
  });

  const acousticPages = {
    4:['SAP004','SAP013','SAP014'], 5:['SAP007','SAP008','SAP009'],
    6:['SAP131','SAP132','SAP140','SAP141'], 7:['SAP135','SAP136','SAP142','SAP143'],
    8:['SAP137','SAP138','SAP144','SAP145'], 9:['SAP1XX'],
    10:['SAP072','SAP074','SAP073','SAP075'], 11:['SAP061','SAP062'],
    12:['SAP063','SAP064','SAP065','SAP066'],
    14:['SBP001','SBP002','SBP003','SBP004','SBP005'],
    15:['SAP031','SAP032','SAP033'], 16:['SAP034','SAP035','SAP036'],
    17:['SAP037','SAP038','SAP039'], 18:['SAP040','SAP041','SAP042'],
    19:['SAP043','SAP044','SAP045'], 20:['SAP046','SAP047','SAP048'],
    21:['SAP053','SAP054','SAP094'], 22:['SAP049','SAP050','SAP090'],
    23:['SAP051','SAP052','SAP096'], 24:['SAP055','SAP060','SAP059'],
    25:['SAP055','SAP067','SAP068'], 26:['SAP069','SAP071','SAP070'],
    27:['SAP091','SAP093','SAP092'], 28:['SAP146','SAP148','SAP147','SAP149'],
    29:['SAP150','SAP152','SAP151','SAP166'], 30:['SAP160','SAP167','SAP161','SAP168'],
    31:['SAP156','SAP158','SAP157','SAP159'], 32:['SAP153','SAP154','SAP155'],
    33:['SAP153','SAP163','SAP164'], 34:['SAP100','SAP101','SAP102','SAP103'],
    35:['SAP104','SAP105','SAP106','SAP107'], 36:['SAP108','SAP109','SAP110','SAP111'],
    37:['SAP112','SAP113','SAP114','SAP115'], 38:['SAP116','SAP117','SAP118','SAP119'],
    39:['SAP127','SAP128','SAP129','SAP130'], 40:['SAP123','SAP124','SAP125','SAP126']
  };
  const acousticModels = Object.entries(acousticPages).flatMap(([p, codes]) =>
    codes.map(code => {
      const distinction = p === '24' && code === 'SAP055' ? ' · 65.5 × 80 cm'
        : p === '25' && code === 'SAP055' ? ' · 61 × 61 cm'
        : p === '32' && code === 'SAP153' ? ' · 55.2 × 67.5 cm'
        : p === '33' && code === 'SAP153' ? ' · 53.8 × 81.8 cm' : '';
      return { model: `${code}${distinction}`, image: unified(Number(p)), alt: `Panel acústico MDF, modelo ${code}, Catálogo Unificado 2026` };
    })
  );

  const spcModels = ['B183','B184','B186','B189','B190','B191','B193','B194','B195','B196','B197','B198','B199','B201','B202','B291']
    .map((model, i) => ({ model, image: unified(52 + i), alt: `Piso SPC modelo ${model}, Catálogo Unificado 2026` }));
  const wpcModels = [
    ['HHGS1620K',75,['Ancho: 167 mm','Altura: 22 mm','Largo: 2.95 m','14 piezas por caja'],['GSV0029','GSV0030','GSV0025','GSV0028','GSV0026','GSV0027','GSV0032','GSV0031']],
    ['GS1620B',76,['Ancho: 167 mm','Altura: 24 mm','Largo: 2.95 m','12 piezas por caja'],[]],
    ['GS1310B',77,['Ancho: 126 mm','Altura: 12 mm','Largo: 2.95 m','14 piezas por caja'],['MJA0060','MJA0061','MJA0062','MJA0063','MJA0064','MJA0065','MJA0066','MJA0067','MJA0068']],
    ['GS1720A',78,['Ancho: 168 mm','Altura: 16 mm','Largo: 2.95 m','12 piezas por caja'],[]],
    ['GS1610B',79,['Ancho: 160 mm','Altura: 10 mm','Largo: 2.95 m','18 piezas por caja'],['MJA0069','MJA0070','MJA0071','MJA0072','MJA0073','MJA0074','MJA0075','MJA0076','MJA0077','MJA0078','MJA0079','MJA0080']],
    ['RZMGS15B',80,['Ancho: 150 mm','Altura: 18 mm','Largo: 2.95 m','12 piezas por caja'],['MJA0081','MJA0082','MJA0083','MJA0084','MJA0085','MJA0086','MJA0087','MJA0088','MJA0089','MJA0090','MJA0091','MJA0092']],
    ['RZMGS15C',81,['Ancho: 150 mm','Altura: 18 mm','Largo: 2.95 m','12 piezas por caja'],['MJA0093','MJA0094','MJA0095','MJA0096','MJA0097','MJA0098','MJA0099','MJA0100']],
    ['GS1620F',82,['Ancho: 160.5 mm','Altura: 15 mm','Largo: 2.95 m','12 piezas por caja'],[]]
  ].map(([model, p, specs, finishes]) => ({ model, image: unified(p), alt: `Panel WPC de muro, modelo ${model}, Catálogo Unificado 2026`, specs, finishes }));

  return [
    item('Piso Fiorano SPC','Pisos SPC',5,['Silky Grey','Castor Grey','Almond','Warm Sand','Simply Taupe','Macadamia','Fog','Walnut'],[
      ['Largo','1.235 m'],['Ancho','22.5 cm'],['Espesor','5 mm'],['Capa de desgaste','0.55 mm'],['Contenido','9 duelas por caja'],['Área','2.5 m² por caja']
    ]),
    item('Piso SPC granito y mármol','Pisos SPC',6,['Negro Basáltico','Caliza Beige','Caliza Gris/Oxford','Caliza Gris','Gris Rochelle','Nero Marquina','Gris Grafito','Blanco Carrara'],[
      ['Largo','120 cm'],['Ancho','60 cm'],['Espesor','7.5 mm'],['Contenido','2 duelas por caja'],['Área','1.51 m² por caja']
    ]),
    item('Piso Fiorano SPC Herringbone','Pisos SPC',7,['Cashewnut','Pinenut','Hazelnut','Walnut'],[
      ['Largo','61.5 cm'],['Ancho','12.3 cm'],['Espesor','5 mm'],['Capa de desgaste','0.5 mm'],['Contenido','32 duelas por caja'],['Área','2.421 m² por caja']
    ]),
    {name:'Piso SPC · serie B',category:'Pisos SPC',image:spcModels[0].image,cardImage:spcModels[0].image,alt:'Modelos de piso SPC del Catálogo Unificado 2026',models:spcModels,specs:[['Ancho','18.3 / 23 cm'],['Largo','122 / 153 cm'],['Altura','0.4–0.8 cm'],['Capa de desgaste','0.03–0.07 cm']]},
    item('Piso madera de ingeniería','Pisos laminados',4,['Ébano','Ombúes','Sequoia','Arrayán','Bamboo'],[
      ['Largo','1.92 m'],['Ancho','19.1 cm'],['Espesor','14 mm'],['Contenido','6 duelas por caja'],['Área','2.189 m² por caja']
    ]),
    item('Piso laminado WRL','Pisos laminados',8,['Olivo','Aspen','Tzalam','Acacia'],[
      ['Largo','1.835 m'],['Ancho','23.6 cm'],['Espesor','12 mm'],['Contenido','5 duelas por caja'],['Área','2.1653 m² por caja']
    ]),
    item('Piso laminado WRL Herringbone','Pisos laminados',9,['Olivo','Aspen','Tzalam','Acacia']),
    item('Piso WPC Deck','Exterior',10,['Dark Coffe','Teak','Black','Greysh'],[
      ['Largo','240 cm'],['Ancho','14.8 cm'],['Espesor','23 mm'],['Peso','8.41 kg']
    ]),
    item('Panel 3D grande','Paneles 3D',13,['Black and Almond','Black and Wood','Solid Dark Grey','Solid Black','Wood','Solid White','Light Grey','Grey','Almond'],[
      ['Altura','290 cm'],['Ancho','12.2 cm'],['Profundidad','2.21 cm'],['Contenido','14 piezas por caja'],['Área','4.872 m² por caja'],['Peso','25 kg por caja']
    ]),
    item('Panel 3D chico','Paneles 3D',14,['Black and Wood','Wood','Grey','Almond','Black and Almond'],[
      ['Altura','290 cm'],['Ancho','16 cm'],['Profundidad','1.2 cm'],['Contenido','16 piezas por caja'],['Área','7.424 m² por caja'],['Peso','35 kg por caja']
    ]),
    item('Panel 3D cóncavo chico','Paneles 3D',21,['Greysh','Warm Sand','Walnut'],[
      ['Altura','290 cm'],['Ancho','25 cm'],['Profundidad','12 mm'],['Contenido','6 piezas por caja'],['Área','4.35 m² por caja'],['Peso','23 kg por caja']
    ]),
    item('Panel 3D cóncavo grande','Paneles 3D',22,['Cloud Grey','Cloud Taupe','Cloud 9','Forest'],[
      ['Altura','290 cm'],['Ancho','7 cm'],['Profundidad','1.5 cm'],['Contenido','17 piezas por caja'],['Área','3.45 m² por caja'],['Peso','26.5 kg por caja']
    ]),
    item('Panel WPC 3D','Paneles 3D WPC',15,['Walnut','Greysh','Warm Sand','Sidney Oxford','San Francisco Taupe','San Francisco Oxford','Sidney Smoke Silver','Sidney Beige'],[
      ['Altura','290 cm'],['Ancho','16.6 cm'],['Profundidad','0.8 cm'],['Contenido','10 piezas por caja'],['Área','4.814 m² por caja'],['Peso','20 kg por caja']
    ]),
    item('Panel WPC liso','Paneles WPC lisos',16,['Walnut','Greysh','Warm Sand','Sidney Oxford','San Francisco Taupe','San Francisco Oxford','Sidney Smoke Silver','Sidney Beige']),
    {name:'Panel acústico MDF · modelos SAP y SBP',category:'Paneles acústicos',image:acousticModels[0].image,cardImage:acousticModels[0].image,alt:'Modelos de panel acústico MDF del Catálogo Unificado 2026',models:acousticModels},
    item('Panel 3D acústico','Paneles acústicos',20,['Roble Americano','Roble Natural','Gris Oxford','Gris','Negro'],[
      ['Altura','240 cm'],['Ancho','60 cm'],['Profundidad','1.65 cm'],['Material','Poliéster y MDF'],['Contenido','2 piezas por caja'],['Área','1.45 m² por caja'],['Peso','10 kg por caja']
    ]),
    {name:'Paneles WPC de muro · perfiles GS y RZM',category:'Paneles WPC',image:wpcModels[0].image,cardImage:wpcModels[0].image,alt:'Perfiles y muestras de paneles WPC del Catálogo Unificado 2026',models:wpcModels},
    item('Panel 3D exterior','Paneles exteriores',18,['Ivory White','Taupe','Brown Wood','Dark Walnut','Oxford Gray','Blue Steel','Black','Maple'],[
      ['Altura','290 cm'],['Ancho','21.9 cm'],['Profundidad','2.6 cm'],['Contenido','1 pieza por caja'],['Área','0.635 m² por pieza'],['Peso','2.86 kg por pieza'],['Material','Polietileno']
    ]),
    item('Lámina de PVC granito y mármol','Láminas PVC',23,['Travertino','Capella','Gris','Luna','Gris Orion','Andromeda','Aquila','Blanco Carrara','Crater','Maple','Tazmania','Marfil','Negro Marquina','Ojo de Gato','Caramel'],[
      ['Altura','244 cm'],['Ancho','122 cm'],['Espesor','3 mm'],['Acabado','Mate y brilloso'],['Composición','70% piedra, 30% PVC'],['Peso','20.5 kg']
    ]),
    item('Piedra flexible Murano','Piedra flexible',24,['Marbella Stone','Travertino Beige','Travertino White','Creta Off White','Atenea Cream','Atenea Taupe','Mykonos Sand'])
  ];
})();
