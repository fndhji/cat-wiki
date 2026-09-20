const badgeCatalog = {
  early: {name:'Early Supporter',icon:'assets/badge-icons/7060786766c9c840eb3019e725d2b358.png',price:'$600–$1,100',short:'Recognizable legacy collector badge.',desc:'Early Supporter can add meaningful collector value, but the final account value still depends on username quality, age, history and the rest of the badge stack.'},
  events: {name:'HypeSquad Events',icon:'assets/badge-icons/bf01d1073931f921909045f3a39fd264.png',price:'$5,000–$7,500',short:'Extremely scarce collector territory.',desc:'HypeSquad Events sits in a different collector tier from ordinary HypeSquad house badges. Scarcity can create a large premium while liquidity remains thinner.'},
  partner: {name:'Partnered Server Owner',icon:'assets/badge-icons/3f9748e53446a137a052f3454e2de41e.png',price:'Variable',short:'Legacy badge where combo quality matters heavily.',desc:'Partner value is highly profile-dependent. A strong short username, old creation date or additional rare badges can make the combination substantially more desirable.'},
  developer: {name:'Early Verified Bot Developer',icon:'assets/badge-icons/6df5892e0f35b051f8b61eace34f4967.png',price:'Variable',short:'Legacy developer badge with collector demand.',desc:'The badge can add collector appeal, but there is no reliable universal add-on. Treat it as a profile trait whose impact changes with the username and other badges.'},
  moderator: {name:'Certified Moderator',icon:'assets/badge-icons/fee1624003e2fee35cb398e125dc479b.png',price:'Variable',short:'Distinctive moderation badge with niche interest.',desc:'Its value is usually discussed case by case. Strong combinations matter more than trying to assign one fixed number to every profile carrying it.'},
  legacy: {name:'Legacy Username',icon:'assets/badge-icons/6de6d34650760ba5551a79732e98ed60.png',price:'Contextual',short:'Supporting collector trait.',desc:'Legacy Username can improve the look of a collector profile, especially with a memorable old tag, but it is rarely sensible to price it independently from the account.'},
  nitro: {name:'Nitro tenure',icon:'assets/badges/diamond.png',price:'Contextual',short:'Long tenure can strengthen a stacked profile.',desc:'Nitro tenure is best read as supporting account history. Very long tenure looks stronger when paired with old age, a desirable username or rare badges.'},
  booster: {name:'Server Booster',icon:'assets/badge-icons/51040c70d4f20a921ad6674ff86fc95c.png',price:'Contextual',short:'Secondary profile trait.',desc:'Server Booster can help overall presentation, especially with long tenure, but normally does not behave like a major standalone collector badge.'},
  bravery: {name:'HypeSquad Bravery',icon:'assets/badge-icons/8a88d63823d8a71cd5e390baa45efa02.png',price:'Low / contextual',short:'Common HypeSquad house badge.',desc:'Bravery is much more common than HypeSquad Events. It can make a profile look fuller but usually has limited standalone collector weight.'},
  brilliance: {name:'HypeSquad Brilliance',icon:'assets/badge-icons/011940fd013da3f7fb926e4a1cd2e618.png',price:'Low / contextual',short:'Common HypeSquad house badge.',desc:'Brilliance is generally a supporting badge rather than a core price driver. The rest of the account matters much more.'},
  balance: {name:'HypeSquad Balance',icon:'assets/badge-icons/3aa41de486fa12454c3761e8e223442e.png',price:'Low / contextual',short:'Common HypeSquad house badge.',desc:'Balance is primarily a visual/profile trait and should not be confused with the much rarer HypeSquad Events badge.'}
};

const entries = [
  {id:'3c',cat:'3C',user:'@q7x',range:'$220–$500',note:'3 characters · clean mixed short',desc:'Three total characters. Exact pattern quality, readability and memorability decide most of the price.',badges:['early','bravery'],factors:[['Pattern','Clean beats random'],['Readability','High impact'],['Liquidity','Medium / high']]},
  {id:'3l',cat:'3L',user:'@nuv',range:'$300–$900',note:'3 letters · clean alphabetic short',desc:'Three letters only. Pronounceable or aesthetically strong combinations usually sit above random consonant stacks.',badges:['developer','nitro'],factors:[['Pronounceable','Premium'],['Letter quality','Very high impact'],['Liquidity','High']]},
  {id:'3n',cat:'3N',user:'@404',range:'$900–$2,100',note:'3 digits · numeric collectible',desc:'Three-digit usernames are strongly pattern-driven. Repeats, references and memorable sequences can exceed the base window.',badges:['events','legacy'],factors:[['Repeating digits','Strong premium'],['Cultural value','Can dominate price'],['Liquidity','Collector-heavy']]},
  {id:'semi3n',cat:'Semi',user:'@8v8',range:'$300–$850',note:'semi 3N · symmetric mixed pattern',desc:'A semi borrows the appeal of a premium format without being perfectly pure. Symmetry and a tiny imperfection help.',badges:['balance','booster'],factors:[['Symmetry','Positive'],['Purity','Below full 3N'],['Exact combo','High impact']]},
  {id:'4c',cat:'4C',user:'@k4r7',range:'$35–$150',note:'4 characters · mixed entry format',desc:'Four total characters. Strong patterns and readable combinations separate quickly from random 4C inventory.',badges:['brilliance'],factors:[['Clean structure','Positive'],['Number placement','Contextual'],['Liquidity','Medium']]},
  {id:'4l',cat:'4L',user:'@kero',range:'$20–$180',note:'4 letters · alphabetic entry format',desc:'Four letters only. Random strings can be inexpensive, while pronounceable or word-like combinations can move much higher.',badges:['early'],factors:[['Pronounceable','Large premium'],['Vowel balance','Positive'],['Meaning-like','Large premium']]},
  {id:'meaning1',cat:'Meaning',user:'@velvet',range:'Variable',note:'English meaning · recognizable word',desc:'Meanings are real recognizable words or expressions. Word quality matters far more than raw length.',badges:['nitro','legacy'],factors:[['Word desirability','Primary factor'],['Exact spelling','Essential'],['Language reach','Major impact']]},
  {id:'meaning2',cat:'Meaning',user:'@orage',range:'Variable',note:'French meaning · recognizable word',desc:'French meanings can have strong niche demand. Common, clean and emotionally loaded words usually outperform obscure vocabulary.',badges:['moderator','bravery'],factors:[['Word frequency','Important'],['Aesthetic value','Important'],['Buyer pool','More niche']]},
  {id:'repeater',cat:'Repeater',user:'@7v7',range:'Variable',note:'repeater · mirrored short pattern',desc:'Repeater value comes from visible rhythm, symmetry and memorability. It should look intentional at first glance.',badges:['booster','legacy'],factors:[['Symmetry','Primary factor'],['Visual cleanliness','High impact'],['Rarity','Contextual']]},
  {id:'early',cat:'Badge',user:'@asteroid',range:'$600–$1,100',note:'Early Supporter · collector profile',desc:'Early Supporter can carry strong standalone collector value. Final account value still depends on the rest of the profile.',badges:['early','nitro'],factors:[['Badge authenticity','Essential'],['Account history','Important'],['Username combo','Can add premium']]},
  {id:'events',cat:'Badge',user:'@solace',range:'$5,000–$7,500',note:'HypeSquad Events · scarce collector badge',desc:'Extremely scarce collector territory with much lower liquidity than ordinary username categories.',badges:['events','partner'],factors:[['Scarcity','Extreme'],['Collector demand','Primary'],['Liquidity','Low / specialized']]},
  {id:'old15',cat:'Age',user:'@halcyon',range:'Premium',note:'2015 creation · old account premium',desc:'A 2015 creation date can strengthen a collector profile, especially when paired with a clean username or badge stack.',badges:['partner','early'],factors:[['Creation year','Positive premium'],['Profile cleanliness','Important'],['Combo value','Non-linear']]},
  {id:'old16',cat:'Age',user:'@cinder',range:'Premium',note:'2016 creation · old account premium',desc:'2016 accounts can receive a noticeable premium, but age by itself does not guarantee a high valuation.',badges:['developer','booster'],factors:[['Creation year','Positive'],['Username','Often more important'],['Badge stack','Can multiply demand']]},
  {id:'combo',cat:'Combo',user:'@lunar',range:'Case by case',note:'meaning + age + badge combination',desc:'Collector combos are valued as a whole. Scarcity and buyer overlap make simple addition unreliable.',badges:['early','moderator','legacy'],factors:[['Synergy','Can be strong'],['Buyer overlap','Controls liquidity'],['Standalone sums','Not reliable']]}
];

const filters=['All','3C','3L','3N','4C','4L','Semi','Meaning','Repeater','Badge','Age','Combo'];
let active='All', query='';
const list=document.querySelector('#marketList');
const filterEl=document.querySelector('#filters');
const countEl=document.querySelector('#resultCount');
const modal=document.querySelector('#detailModal');
const modalBody=document.querySelector('#modalBody');

function badgeImg(key, cls='profile-badge'){
  const b=badgeCatalog[key];
  return b?`<span class="badge-icon-wrap" title="${b.name}"><img class="${cls}" src="${b.icon}" alt="${b.name}" loading="lazy"></span>`:'';
}
function badgeChip(key){
  const b=badgeCatalog[key];
  return b?`<span class="trait-chip" title="${b.name}">${badgeImg(key)}<span>${b.name}</span></span>`:'';
}
function renderFilters(){
  filterEl.innerHTML=filters.map(f=>`<button class="filter ${f===active?'active':''}" type="button" data-filter="${f}">${f}</button>`).join('');
  filterEl.querySelectorAll('button').forEach(b=>b.onclick=()=>{active=b.dataset.filter;renderFilters();render()});
}
function match(item){
  const filterMatch=active==='All'||item.cat===active;
  const q=query.trim().toLowerCase();
  const badgeWords=item.badges.map(k=>badgeCatalog[k]?.name||'').join(' ');
  const blob=[item.cat,item.user,item.range,item.note,item.desc,badgeWords].join(' ').toLowerCase();
  return filterMatch&&(!q||blob.includes(q));
}
function render(){
  const shown=entries.filter(match);
  countEl.textContent=shown.length;
  list.innerHTML=shown.length?shown.map(item=>`
    <article class="market-card" tabindex="0" data-id="${item.id}">
      <div class="card-top">
        <span class="format-badge">${item.cat}</span>
        <div class="price-block"><strong>${item.range}</strong><small>reference</small></div>
      </div>
      <div class="example-name">${item.user}</div>
      <div class="card-note">${item.note}</div>
      <div class="card-footer">
        <div class="factor-preview">${item.factors[0][0]} · ${item.factors[0][1]}</div>
        <div class="trait-list">${item.badges.map(k=>badgeChip(k)).join('')}</div>
      </div>
    </article>`).join(''):`<div class="empty">No entry matches this search.</div>`;
  list.querySelectorAll('.market-card').forEach(card=>{
    const open=()=>openEntry(card.dataset.id);
    card.onclick=open;
    card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};
  });
}
function openEntry(id){
  const item=entries.find(x=>x.id===id); if(!item)return;
  modalBody.innerHTML=`
    <div class="modal-head">
      <span class="modal-kicker">${item.cat}</span>
      <h3>${item.user}</h3>
      <p>${item.note}</p>
      <div class="modal-badges">${item.badges.map(k=>badgeImg(k,'modal-badge-icon')).join('')}</div>
    </div>
    <div class="modal-range"><span>Reference value</span><strong>${item.range}</strong></div>
    <div class="modal-text">${item.desc}</div>
    <div class="factor-list">${item.factors.map(f=>`<div class="factor"><span>${f[0]}</span><span>${f[1]}</span></div>`).join('')}</div>`;
  if(typeof modal.showModal==='function')modal.showModal();else modal.setAttribute('open','');
}
function renderBadges(){
  const keys=['early','events','partner','developer','moderator','legacy','nitro','booster','bravery','brilliance','balance'];
  document.querySelector('#badgeList').innerHTML=keys.map(key=>{
    const b=badgeCatalog[key];
    return `<button class="badge-card ${key==='events'?'hero-badge':''}" type="button" data-badge-key="${key}">
      <span class="badge-art"><img src="${b.icon}" alt="${b.name}" loading="lazy"></span>
      <span class="badge-copy"><strong>${b.name}</strong><small>${b.short}</small></span>
      <span class="badge-value"><strong>${b.price}</strong><small>reference</small></span>
    </button>`;
  }).join('');
  document.querySelectorAll('[data-badge-key]').forEach(el=>el.onclick=()=>openBadge(el.dataset.badgeKey));
}
function openBadge(key){
  const b=badgeCatalog[key]; if(!b)return;
  modalBody.innerHTML=`
    <div class="modal-badge-hero">
      <span class="modal-badge-large"><img src="${b.icon}" alt="${b.name}"></span>
      <div class="modal-head"><span class="modal-kicker">Badge</span><h3>${b.name}</h3><p>${b.short}</p></div>
    </div>
    <div class="modal-range"><span>Reference</span><strong>${b.price}</strong></div>
    <div class="modal-text">${b.desc}</div>`;
  if(typeof modal.showModal==='function')modal.showModal();else modal.setAttribute('open','');
}

function setTab(name){
  document.querySelectorAll('.nav-item').forEach(t=>t.classList.toggle('active',t.dataset.tab===name));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===name));
  if(window.innerWidth<900)document.querySelector('.workspace').scrollIntoView({behavior:'smooth',block:'start'});
}
document.querySelectorAll('.nav-item').forEach(t=>t.onclick=()=>setTab(t.dataset.tab));
document.querySelectorAll('[data-jump-filter]').forEach(btn=>btn.onclick=()=>{
  setTab('market');
  active=btn.dataset.jumpFilter;
  renderFilters();
  render();
  document.querySelector('#search').value=''; query='';
  document.querySelector('.workspace').scrollIntoView({behavior:'smooth',block:'start'});
});

document.querySelector('#search').addEventListener('input',e=>{query=e.target.value;render()});
document.querySelector('#modalClose').onclick=()=>modal.close();
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});

const copyText=`Cat Wiki reference ranges\n3C: $220–$500\n3L: $300–$900\n3N: $900–$2,100\nSemi 3N: $300–$850\n4C: $35–$150\n4L: $20–$180\nEarly Supporter: $600–$1,100\nHypeSquad Events: $5,000–$7,500\nMeanings: variable by word quality`;
document.querySelector('#copySummary').onclick=async e=>{try{await navigator.clipboard.writeText(copyText);const old=e.currentTarget.textContent;e.currentTarget.textContent='Copied ✓';setTimeout(()=>e.currentTarget.textContent=old,1200)}catch{e.currentTarget.textContent='Unavailable'}};

const priceMap={
  '4l':[20,180,'Base 4L range before quality adjustments.'],
  '4c':[35,150,'Base 4C range before pattern adjustments.'],
  '3c':[220,500,'Base 3C range before exact-character quality.'],
  '3l':[300,900,'Base 3L range before pronounceability and letter quality.'],
  'semi3n':[300,850,'Semi 3N reference before pattern quality.'],
  '3n':[900,2100,'Base 3N range before repetition or cultural-number premiums.']
};
function money(n){return'$'+Math.round(n).toLocaleString('en-US')}
function calc(){
  let[lo,hi,note]=priceMap[document.querySelector('#calcBase').value];
  const trait=document.querySelector('#calcBadge').value;
  if(trait==='old'){lo*=1.12;hi*=1.30;note+=' Includes a modest age premium, not a fixed add-on.'}
  if(trait==='early'){lo+=600;hi+=1100;note+=' Early Supporter is shown as a rough additive reference only; real combo pricing is non-linear.'}
  document.querySelector('#calcValue').textContent=`${money(lo)}–${money(hi)}`;
  document.querySelector('#calcNote').textContent=note;
}
document.querySelector('#calcBase').onchange=calc;
document.querySelector('#calcBadge').onchange=calc;

async function loadDiscordWidget(){
  const meta=document.querySelector('#discordServerMeta');
  const name=document.querySelector('#discordServerName');
  const online=document.querySelector('#discordOnline');
  const visible=document.querySelector('#discordVisibleMembers');
  const presence=document.querySelector('#discordPresence');
  if(!meta)return;
  try{
    const res=await fetch('https://discord.com/api/guilds/1550254966889783326/widget.json',{cache:'no-store'});
    if(!res.ok)throw new Error('Widget unavailable');
    const data=await res.json();
    name.textContent=data.name||'Discord community';
    const count=Number(data.presence_count||0);
    const members=Array.isArray(data.members)?data.members.length:0;
    online.textContent=count.toLocaleString('en-US');
    visible.textContent=members.toLocaleString('en-US');
    presence.textContent=count?`${count} online`:'Live';
    meta.textContent=count?`${count.toLocaleString('en-US')} members online`:'Live server widget';
  }catch(err){
    meta.textContent='Live widget enabled';
    online.textContent='Live';
    visible.textContent='Widget';
  }
}

renderFilters();
render();
renderBadges();
calc();
loadDiscordWidget();
