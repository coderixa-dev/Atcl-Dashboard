/* Progressive enhancement only: every initial page, form and record lives in HTML. */
'use strict';
const toast = message => {
  const node = document.querySelector('.toast-message');
  node.textContent = message; node.hidden = false;
  clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; }, 4500);
};
document.querySelectorAll('[data-sidebar]').forEach(button => button.addEventListener('click', () => {
  const mobile = matchMedia('(max-width:800px)').matches;
  document.body.classList.toggle(mobile ? 'sidebar-open' : 'sidebar-collapsed');
  document.querySelectorAll('[data-sidebar]').forEach(b => b.setAttribute('aria-expanded', String(document.body.classList.contains(mobile ? 'sidebar-open' : 'sidebar-collapsed'))));
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {document.body.classList.remove('sidebar-open'); document.querySelector('.notification-panel').hidden = true;document.querySelectorAll('[aria-expanded]').forEach(b=>b.setAttribute('aria-expanded','false'));}
});
document.querySelector('[data-notifications]')?.addEventListener('click', event => {
  const panel = document.querySelector('.notification-panel'); panel.hidden = !panel.hidden;
  event.currentTarget.setAttribute('aria-expanded',String(!panel.hidden));
});
document.querySelectorAll('[data-table-module]').forEach(module => {
  const tbody = module.querySelector('tbody');
  const rows = [...tbody.rows];
  const search = module.querySelector('[data-search]');
  const filters = [...module.querySelectorAll('[data-filter]')];
  const size = module.querySelector('[data-page-size]');
  const master = module.querySelector('[data-select-all]');
  const chips = module.querySelector('.filter-chips');
  let page = 1, sortIndex = -1, direction = 1, matching = rows;
  rows.forEach(row => row.classList.toggle('unread', row.dataset.status === 'Unread'));
  function selection() {
    const visible = rows.filter(row => !row.hidden);
    const count = rows.filter(row => row.querySelector('[data-select-row]').checked).length;
    module.querySelector('[data-selected]').textContent = `${count} selected`;
    master.checked = visible.length > 0 && visible.every(row => row.querySelector('[data-select-row]').checked);
    master.indeterminate = !master.checked && visible.some(row => row.querySelector('[data-select-row]').checked);
  }
  function updateChips() {
    chips.replaceChildren();
    const values = [{node:search,label:'Search'},...filters.map(node => ({node,label:node.closest('label').childNodes[0].textContent.trim()}))];
    values.filter(({node}) => node.value).forEach(({node,label}) => {
      const chip = document.createElement('button'); chip.type = 'button';
      chip.textContent = `${label}: ${node.value} ×`;chip.setAttribute('aria-label',`Remove ${label} filter`);
      chip.addEventListener('click',() => {node.value='';page=1;render();});chips.append(chip);
    });
    if(chips.children.length){const clear=document.createElement('button');clear.type='button';clear.textContent='Clear All';clear.addEventListener('click',reset);chips.append(clear);}
  }
  function render() {
    const query = search.value.toLocaleLowerCase().trim();
    matching = rows.filter(row => row.textContent.toLocaleLowerCase().includes(query) && filters.every(f => !f.value || row.dataset[f.dataset.filter] === f.value));
    if (sortIndex >= 0) matching.sort((a,b) => a.cells[sortIndex].textContent.trim().localeCompare(b.cells[sortIndex].textContent.trim(),undefined,{numeric:true,sensitivity:'base'}) * direction);
    const pageSize = Number(size.value), totalPages = Math.max(1, Math.ceil(matching.length/pageSize));
    page = Math.max(1, Math.min(page,totalPages));
    rows.forEach(row => {row.hidden = true;});
    // Move existing nodes; never reconstruct a record or its markup.
    matching.forEach(row => tbody.append(row));
    matching.slice((page-1)*pageSize,page*pageSize).forEach(row => {row.hidden = false;});
    module.querySelector('[data-result-count]').textContent = matching.length ? `Showing ${(page-1)*pageSize+1}–${Math.min(page*pageSize,matching.length)} of ${matching.length}` : 'Showing 0 of 0';
    module.querySelector('.empty-state').hidden = matching.length > 0;
    module.querySelector('[data-prev]').disabled = page === 1;
    module.querySelector('[data-next]').disabled = page === totalPages;
    const pages = module.querySelector('[data-pages]');pages.replaceChildren();
    for(let n=1;n<=totalPages;n++){const button=document.createElement('button');button.type='button';button.textContent=String(n);button.classList.toggle('active',n===page);button.setAttribute('aria-label',`Page ${n}`);if(n===page)button.setAttribute('aria-current','page');button.addEventListener('click',()=>{page=n;render();});pages.append(button);}
    updateChips();selection();
  }
  function reset(){search.value='';filters.forEach(f=>{f.value='';});page=1;render();}
  search.addEventListener('input',()=>{page=1;render();});
  filters.forEach(f=>f.addEventListener('change',()=>{page=1;render();}));
  module.querySelector('[data-reset]').addEventListener('click',reset);
  size.addEventListener('change',()=>{page=1;render();});
  module.querySelector('[data-prev]').addEventListener('click',()=>{page--;render();});
  module.querySelector('[data-next]').addEventListener('click',()=>{page++;render();});
  module.querySelectorAll('[data-sort]').forEach(button=>button.addEventListener('click',()=>{
    const next=Number(button.dataset.sort);direction=sortIndex===next?-direction:1;sortIndex=next;
    module.querySelectorAll('th[aria-sort]').forEach(th=>th.setAttribute('aria-sort','none'));
    button.closest('th').setAttribute('aria-sort',direction===1?'ascending':'descending');render();
  }));
  master.addEventListener('change',()=>{rows.filter(r=>!r.hidden).forEach(r=>{r.querySelector('[data-select-row]').checked=master.checked;});selection();});
  rows.forEach(row=>row.querySelector('[data-select-row]').addEventListener('change',selection));
  module.querySelector('[data-apply-bulk]').addEventListener('click',()=>{
    const count=rows.filter(row=>row.querySelector('[data-select-row]').checked).length;
    const action=module.querySelector('[data-bulk]').value;
    toast(!count?'Select at least one record.':!action?'Choose a bulk action.':`Preview: “${action}” requested for ${count} records. No records were changed.`);
  });
  render();
});
document.querySelectorAll('[data-delete]').forEach(button=>button.addEventListener('click',()=>toast('Static preview: this record has not been deleted.')));
document.querySelectorAll('form[data-preview-form]').forEach(form=>{
  form.addEventListener('submit',event=>{event.preventDefault();toast('Validation passed. Static preview only — your changes have not been saved.');});
  form.querySelector('[data-save-draft]')?.addEventListener('click',()=>toast('Draft preview complete. No data has been saved.'));
});
document.querySelectorAll('[data-image-input]').forEach(input=>input.addEventListener('change',()=>{
  const file=input.files[0];if(!file)return;
  if(!file.type.startsWith('image/')){toast('Choose an image file.');input.value='';return;}
  const preview=input.closest('.card-panel').querySelector('[data-image-preview]');
  if(preview){if(preview.dataset.objectUrl)URL.revokeObjectURL(preview.dataset.objectUrl);const url=URL.createObjectURL(file);preview.src=url;preview.dataset.objectUrl=url;preview.hidden=false;}
}));
document.querySelectorAll('[data-dependent]').forEach(select=>{
  const parent=document.getElementById(select.dataset.dependent);if(!parent)return;
  const update=()=>{[...select.options].forEach(option=>{const invalid=!!option.dataset.parent && !!parent.value && option.dataset.parent!==parent.value;option.hidden=invalid;option.disabled=invalid;});if(select.selectedOptions[0]?.disabled)select.value='';select.dispatchEvent(new Event('change'));};parent.addEventListener('change',update);update();
});
document.querySelectorAll('[data-set-status]').forEach(button=>button.addEventListener('click',()=>{
  const status=button.dataset.setStatus;const badge=document.querySelector('[data-current-status]');badge.textContent=status;badge.className='badge-status status-'+status.toLowerCase().replaceAll(' ','-');toast(`Status preview: ${status}. This change is not saved.`);
}));
document.querySelectorAll('[data-preview-action]').forEach(button=>button.addEventListener('click',()=>toast(button.dataset.previewAction)));
