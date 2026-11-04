(() => {
  const panel=document.getElementById("buildex-assistant");
  const launcher=document.getElementById("assistant-launcher");
  const close=document.getElementById("assistant-close");
  const form=document.getElementById("assistant-form");
  const input=document.getElementById("assistant-input");
  const messages=document.getElementById("assistant-messages");
  const suggestions=document.querySelector(".assistant-suggestions");
  const contact="https://wa.me/525586771680?text=Hola%2C%20tengo%20una%20consulta%20sobre%20un%20material%20o%20proyecto.";
  function open(){panel.dataset.open="true";launcher.setAttribute("aria-expanded","true");input.focus()}
  function shut(){panel.dataset.open="false";launcher.setAttribute("aria-expanded","false");launcher.focus()}
  launcher.addEventListener("click",()=>panel.dataset.open==="true"?shut():open());
  close.addEventListener("click",shut);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&panel.dataset.open==="true")shut()});
  function bubble(text,who,contactLink=false){
    const el=document.createElement("div");el.className="assistant-message "+who;el.textContent=text;
    if(contactLink){const a=document.createElement("a");a.href=contact;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Contactar a Buildex por WhatsApp";el.append(document.createElement("br"),a)}
    messages.append(el);el.scrollIntoView({block:"nearest"});return el
  }
  async function ask(question){
    const q=question.trim();if(!q)return;
    suggestions.hidden=true;bubble(q,"user");input.value="";input.disabled=true;
    const pending=bubble("Estoy revisando la información de Buildex…","bot");
    form.querySelector("button").disabled=true;
    try{
      const response=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})});
      const data=await response.json();
      pending.remove();
      if(!response.ok){bubble(data.error||"No pude responder en este momento.","bot",true);return}
      bubble(data.answer||"No encontré información suficiente para responder con certeza.","bot",Boolean(data.contactUrl));
    }catch{
      pending.remove();bubble("No pude conectar con el asistente en este momento. Puedes contactar directamente a Buildex.","bot",true);
    }finally{input.disabled=false;form.querySelector("button").disabled=false;input.focus()}
  }
  form.addEventListener("submit",e=>{e.preventDefault();ask(input.value)});
  input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
  suggestions.addEventListener("click",e=>{const button=e.target.closest("button");if(button)ask(button.textContent)});
})();
