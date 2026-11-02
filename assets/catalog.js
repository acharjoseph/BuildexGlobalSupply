(() => {
  const products = window.BUILDEX_PRODUCTS || [];
  const grid = document.getElementById('catalog-grid');
  const search = document.getElementById('catalog-search');
  const filters = document.getElementById('catalog-filters');
  const count = document.getElementById('catalog-count');
  const dialog = document.getElementById('product-dialog');
  const dialogContent = document.getElementById('dialog-content');
  const phone = '525586771680';
  const preferredCategories = [
    'Pisos SPC', 'Piedra flexible', 'Paneles 3D WPC', 'Paneles WPC lisos',
    'Paneles acústicos', 'Paneles 3D', 'Pisos laminados', 'Paneles WPC',
    'Exterior', 'Paneles exteriores', 'Láminas PVC'
  ];
  let activeCategory = 'Todos';
  let selectedProduct = null;
  let selectedModel = null;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[char]);
  const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  const quoteUrl = (product, model) => {
    const message = `Hola, me interesa recibir información y una cotización del producto ${product.name}${model ? ` ${model}` : ''}.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };
  const categories = [
    ...preferredCategories.filter(category => products.some(product => product.category === category)),
    ...new Set(products.map(product => product.category).filter(category => !preferredCategories.includes(category)))
  ];

  filters.innerHTML = ['Todos', ...categories].map(category =>
    `<button class="catalog-filter" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === activeCategory}">${escapeHtml(category)}</button>`
  ).join('');

  function productSummary(product) {
    if (product.models?.length) return `${product.models.length} modelos documentados`;
    if (product.colors?.length) return `${product.colors.length} colores o acabados en catálogo`;
    return 'Consulta modelos y acabados';
  }

  function renderCatalog() {
    const query = normalize(search.value.trim());
    const shown = products.filter(product => {
      if (activeCategory !== 'Todos' && product.category !== activeCategory) return false;
      const values = [product.name, product.category, ...(product.colors || []), ...(product.models || []).flatMap(model => [model.model, ...(model.finishes || [])])];
      return normalize(values.join(' ')).includes(query);
    });
    count.textContent = `${shown.length} ${shown.length === 1 ? 'producto' : 'productos'}`;
    grid.innerHTML = shown.length ? shown.map((product, index) => `
      <article class="catalog-card">
        <img class="catalog-card-image" src="${escapeHtml(product.cardImage || product.image)}" alt="${escapeHtml(product.alt || product.name)}" loading="lazy">
        <div class="catalog-card-body">
          <p class="catalog-category">${escapeHtml(product.category)}</p>
          <h3>${escapeHtml(product.name)}</h3>
          <p class="catalog-card-meta">${escapeHtml(productSummary(product))}</p>
          <div class="catalog-actions">
            <button class="catalog-details" type="button" data-product-index="${products.indexOf(product)}">Ver detalles</button>
            <a class="catalog-quote" href="${quoteUrl(product, null)}" target="_blank" rel="noopener">Solicitar cotización</a>
          </div>
        </div>
      </article>`).join('') : '<p class="catalog-empty">No encontramos productos con esa búsqueda. Prueba otro nombre, modelo o color.</p>';
  }

  function specsMarkup(specs) {
    if (!specs?.length) return '';
    return `<h3 class="dialog-subtitle">Información del catálogo</h3><dl class="dialog-specs">${specs.map(([label, value]) =>
      `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`
    ).join('')}</dl>`;
  }

  function updateDialogModel(index) {
    const model = selectedProduct.models?.[index] || null;
    selectedModel = model;
    const image = dialogContent.querySelector('#dialog-image');
    image.src = model?.image || selectedProduct.image;
    image.alt = model?.alt || selectedProduct.alt || selectedProduct.name;
    dialogContent.querySelector('#dialog-model-name').textContent = model ? `Modelo ${model.model}` : '';
    const modelSpecs = model?.specs?.map(value => {
      if (Array.isArray(value)) return value;
      const [label, ...detail] = String(value).split(':');
      return [label, detail.join(':').trim()];
    }) || [];
    const allSpecs = [...(selectedProduct.specs || []), ...modelSpecs];
    dialogContent.querySelector('#dialog-specs').innerHTML = allSpecs.length ? specsMarkup(allSpecs) : '';
    const finishes = dialogContent.querySelector('#dialog-model-finishes');
    if (finishes) finishes.innerHTML = model?.finishes?.length
      ? `<h3 class="dialog-subtitle">Variantes del modelo en catálogo</h3><ul class="variant-tags">${model.finishes.map(code => `<li>${escapeHtml(code)}</li>`).join('')}</ul>` : '';
    dialogContent.querySelector('#dialog-quote').href = quoteUrl(selectedProduct, model?.model || null);
  }

  function openProduct(index) {
    selectedProduct = products[index];
    const models = selectedProduct.models || [];
    const initialModel = models[0] || null;
    selectedModel = initialModel;
    const image = initialModel?.image || selectedProduct.image;
    const sourceTitle = models.length ? 'Catálogo Unificado de Materiales 2026' : 'Catálogo General de Acabados 2026';
    const colors = selectedProduct.colors?.length ? `
      <h3 class="dialog-subtitle">Colores y acabados</h3>
      <ul class="variant-tags">${selectedProduct.colors.map(color => `<li>${escapeHtml(color)}</li>`).join('')}</ul>
      <p class="variant-note">Las muestras visuales se muestran en la página del catálogo.</p>` : '';
    const modelSelect = models.length ? `
      <label class="dialog-model" for="dialog-model-select">Modelo o perfil
        <select id="dialog-model-select">${models.map((model, i) => `<option value="${i}">${escapeHtml(model.model)}</option>`).join('')}</select>
      </label><p class="dialog-model-name" id="dialog-model-name">Modelo ${escapeHtml(initialModel.model)}</p><div id="dialog-model-finishes">${initialModel.finishes?.length ? `<h3 class="dialog-subtitle">Variantes del modelo en catálogo</h3><ul class="variant-tags">${initialModel.finishes.map(code => `<li>${escapeHtml(code)}</li>`).join('')}</ul>` : ''}</div>` : '';
    const initialSpecs = [...(selectedProduct.specs || []), ...(initialModel?.specs || []).map(value => {
      if (Array.isArray(value)) return value;
      const [label, ...detail] = String(value).split(':');
      return [label, detail.join(':').trim()];
    })];
    dialogContent.innerHTML = `
      <figure class="dialog-media"><img id="dialog-image" src="${escapeHtml(image)}" alt="${escapeHtml(initialModel?.alt || selectedProduct.alt || selectedProduct.name)}"><figcaption>${sourceTitle} · página de referencia con imágenes y datos del proveedor.</figcaption></figure>
      <section class="dialog-info">
        <div class="dialog-header"><p>${escapeHtml(selectedProduct.category)}</p><button class="dialog-close" type="button" aria-label="Cerrar ficha">×</button></div>
        <h2 class="dialog-title" id="dialog-title">${escapeHtml(selectedProduct.name)}</h2>
        ${modelSelect}
        <div id="dialog-specs">${specsMarkup(initialSpecs)}</div>
        ${colors}
        <a class="dialog-quote" id="dialog-quote" href="${quoteUrl(selectedProduct, initialModel?.model || null)}" target="_blank" rel="noopener">Solicitar cotización por WhatsApp</a>
      </section>`;
    dialog.showModal();
    dialogContent.querySelector('.dialog-close').focus();
    const modelSelectElement = dialogContent.querySelector('#dialog-model-select');
    modelSelectElement?.addEventListener('change', event => updateDialogModel(Number(event.target.value)));
    dialogContent.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  }

  search.addEventListener('input', renderCatalog);
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    activeCategory = button.dataset.category;
    filters.querySelectorAll('.catalog-filter').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    renderCatalog();
  });
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-product-index]');
    if (button) openProduct(Number(button.dataset.productIndex));
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  document.querySelectorAll('[data-category-link]').forEach(link => link.addEventListener('click', () => {
    const category = link.dataset.categoryLink;
    const filter = [...filters.querySelectorAll('[data-category]')].find(button => button.dataset.category === category);
    if (!filter) return;
    search.value = '';
    activeCategory = category;
    filters.querySelectorAll('.catalog-filter').forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
    renderCatalog();
  }));

  const form = document.getElementById('quote-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = [
      'Hola, me interesa recibir información y una cotización para mi proyecto.',
      '',
      `Material o modelo: ${data.get('material')}`,
      `Cantidad estimada: ${data.get('quantity')}`,
      `Destino: ${data.get('destination')}`,
      data.get('requirements') ? `Medidas, acabado o notas: ${data.get('requirements')}` : ''
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    status.textContent = 'WhatsApp se abrió con tu solicitud lista. Revísala y envíala cuando quieras.';
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  renderCatalog();
})();
