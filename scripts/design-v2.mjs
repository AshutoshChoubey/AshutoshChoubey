// Original vector compositions. Static variants share these exact drawing bodies.
export function advancedCompositions(c,{text:t,label:l,line,rect:r,dot,trace,sectionHeader}) {
  const card=(x,y,w,h)=>r(x,y+3,w,h,'#050D1C',14,'opacity=".2"')+r(x,y,w,h,'url(#card)',14,'stroke="#3D5878" stroke-opacity=".65"')+`<path d="M${x+15} ${y+1}H${x+w-15}" stroke="#D0E8FF" stroke-opacity=".12"/>`;
  const path=(d,color='#51799F',extra='')=>`<path d="${d}" fill="none" stroke="${color}" ${extra}/>`;
  const plane=(x,y,w=90)=>`<g transform="translate(${x} ${y})"><g class="assemble"><path d="M0 0l${w/2} -24L${w} 0 ${w/2} 24z" fill="#193453" stroke="#5E94C0"/><path d="M0 0v10l${w/2} 24v-10M${w} 0v10l-${w/2} 24" fill="#0F2038" stroke="#355D81"/></g></g>`;
  const atmosphere=(w,h)=>`<ellipse class="aurora" cx="${w*.65}" cy="${h*.4}" rx="${w*.35}" ry="${h*.6}" fill="url(#cyan-halo)"/><rect width="${w}" height="${h}" fill="url(#blueprint)" opacity=".16"/>`;
  const stream=d=>path(d,'#64DAFF','class="signal" stroke-width="2.4" stroke-linecap="round"');
  function hero(m) {
    const w=m?420:960,h=m?540:540,x=w/2,deck=m?350:390;
    let b=`<ellipse cx="${w*.8}" cy="170" rx="${m?170:300}" ry="230" fill="url(#paper-light)"/>`;
    b+=path(`M${m?24:40} 49H${m?115:290}M${w-(m?24:40)} 49H${w-(m?115:290)}`,'#DCE5F1');
    b+=l(x,53,'INTERFACES / SYSTEMS / INTELLIGENCE','#526179','text-anchor="middle"');
    b+=r(x-23,77,46,46,'#0B1225',12);
    b+=t(x,107,'AC',20,'#FFFFFF','font-weight="700" letter-spacing="-1" text-anchor="middle"');
    if(!m) {
      b+=`<g opacity=".22">${plane(42,222,104)}${plane(42,247,104)}${plane(42,272,104)}</g>`;
      b+=path('M814 177h49v49h49v70h-49v40','#B5C7DF');
      b+=dot(863,226,'#1E40AF',3)+dot(912,296,'#F59E0B',3);
    } else b+=path('M27 157v64h25M393 161v65h-25','#DCE5F1');
    b+=t(x,m?190:225,c.identity.givenName,m?65:112,'#0B1225','class="rise" font-weight="700" letter-spacing="-3" text-anchor="middle"');
    b+=t(x,m?247:312,c.identity.familyName,m?43:84,'url(#ink)','class="rise" font-weight="700" letter-spacing="-2.2" text-anchor="middle"');
    b+=t(x,m?296:355,c.identity.headline,m?21:25,'#334155','font-weight="500" letter-spacing=".3" text-anchor="middle"');
    b+=line(x-31,m?320:373,x+31,m?320:373,'#F59E0B','stroke-width="2"');
    b+=r(0,deck,w,h-deck,'#0B1225',0);
    b+=`<ellipse class="aurora" cx="${x}" cy="${h+70}" rx="${w*.55}" ry="200" fill="url(#cyan-halo)"/>`;
    b+=trace(`M0 ${deck}H${w}`);
    b+=stream(`M0 ${deck}H${w}`);
    if(m) {
      b+=t(x,391,'Frontend Architecture',22,'#FFFFFF','font-weight="600" text-anchor="middle"');
      b+=t(x,423,'System Design',22,'#FFFFFF','font-weight="600" text-anchor="middle"');
      b+=l(x,462,'EXPLORING INTELLIGENT SYSTEMS','#B7C9DE','text-anchor="middle"');
      b+=t(x,497,'Agentic AI · AI Orchestration',18,'#73DEFF','text-anchor="middle"');
    } else {
      b+=t(x,435,'Frontend Architecture · System Design',25,'#FFFFFF','font-weight="600" text-anchor="middle"');
      b+=l(x,470,'EXPLORING INTELLIGENT SYSTEMS','#B7C9DE','text-anchor="middle"');
      b+=t(x,505,'AI Architecture · Agentic AI · AI Orchestration',21,'#73DEFF','text-anchor="middle"');
    }
    return{w,h,b,light:true};
  }
  function expertise(m) {
    const w=m?420:960,h=m?794:528;
    let b=atmosphere(w,h)+sectionHeader('01','ENGINEERING SYSTEMS',w,m);
    if(m) {
      b+=l(28,80,'ESTABLISHED / FRONTEND ENGINEERING');
      b+=path('M43 119V430','#345170');
      c.capabilities.forEach((v,i)=>{
        const y=96+i*91;
        b+=card(66,y,326,73)+dot(43,y+35,i===0?'#F59E0B':'#73DEFF',4);
        b+=line(47,y+35,66,y+35,'#4E88BF');
        b+=t(83,y+30,v.title,v.title.length>23?21:23,'#FFFFFF','font-weight="600"');
        b+=t(83,y+55,v.detail,17,'#B7C9DE');
      });
      b+=trace('M43 131V404');
      b+=line(28,465,392,465,'#345170');
      b+=l(28,495,'EXPLORING / AI ENGINEERING','#73DEFF');
      c.engineeringDirection.forEach((v,i)=>{
        const y=518+i*72;
        b+=card(66,y,326,57)+dot(43,y+28,'#F59E0B',3);
        b+=t(83,y+25,v.title,23,'#FFFFFF','font-weight="600"');
        b+=t(83,y+46,v.detail,17,'#B7C9DE');
        if(i<2)b+=trace(`M43 ${y+28}V${y+100}`);
      });
      b+=t(28,757,'LLM Integration · MCP · Evaluations',17,'#C5D3E4');
      b+=t(28,780,'Human review · Reliable AI workflows',15,'#A8B7CC');
    } else {
      b+=l(42,81,'ESTABLISHED / FRONTEND ENGINEERING');
      b+=`<ellipse cx="480" cy="213" rx="150" ry="140" fill="url(#cyan-halo)"/>`;
      b+=`<g class="orbit" fill="none" stroke="#3F6C96" stroke-opacity=".6"><ellipse cx="480" cy="215" rx="98" ry="122" transform="rotate(35 480 215)"/><ellipse cx="480" cy="215" rx="122" ry="42" transform="rotate(-35 480 215)"/></g>`;
      b+=plane(436,177,88)+plane(436,206,88)+plane(436,235,88);
      b+=t(480,296,'Architecture',15,'#C5D3E4','text-anchor="middle"');
      [[42,100],[613,100],[42,228],[613,228]].forEach(([x,y],i)=>{
        const v=c.capabilities[i];
        b+=card(x,y,305,90);
        b+=l(x+18,y+23,`0${i+1}`,i===0?'#F8BF5C':'#73DEFF');
        b+=t(x+18,y+49,v.title,21,'#FFFFFF','font-weight="600"');
        b+=t(x+18,y+73,v.detail,16,'#B7C9DE');
        b+=trace(`M${i%2===0?347:613} ${y+45}H${i%2===0?405:555}V215`);
      });
      b+=line(42,345,918,345,'#345170');
      b+=l(42,375,'EXPLORING / AI ENGINEERING','#73DEFF');
      c.engineeringDirection.forEach((v,i)=>{
        const x=42+i*302;
        b+=card(x,400,272,73);
        b+=dot(x+19,423,'#F59E0B',3);
        b+=t(x+19,447,v.title,22,'#FFFFFF','font-weight="600"');
        if(i<2)b+=trace(`M${x+272} 436H${x+302}`);
      });
      b+=t(42,505,'LLM Integration · MCP · Evaluations · Human Review',18,'#C5D3E4');
    }
    return{w,h,b};
  }
  function ai(m) {
    const w=m?420:960,h=m?644:474;
    let b=atmosphere(w,h)+sectionHeader('03','AI ARCHITECTURE / RESEARCH',w,m);
    if(m) {
      b+=t(28,98,'AI architecture.',29,'#FFFFFF','font-weight="600"');
      b+=t(28,132,'Intelligent systems.',29,'#73DEFF','font-weight="600"');
      b+=l(28,162,'CONCEPTUAL / EXPLORING');
      b+=card(28,185,364,68)+t(48,214,'Intent & context',21,'#FFFFFF','font-weight="600"')+t(48,239,'Goals · retrieval · boundaries',15,'#B7C9DE');
      b+=trace('M210 253V284');
      b+=r(28,284,364,128,'url(#orchestrator)',14,'stroke="#5BB6E3"');
      b+=l(48,311,'AGENTIC AI','#A5E4FA');
      b+=t(48,345,'AI Orchestration',27,'#FFFFFF','font-weight="600"');
      b+=t(48,373,'Plan  →  Act  →  Reflect',18,'#D8EEFA');
      b+=t(48,397,'LLMs · tool contracts · workflow state',15,'#B7C9DE');
      b+=trace('M210 412V439');
      b+=card(28,439,364,66)+t(48,469,'Tools & knowledge',21,'#FFFFFF','font-weight="600"')+t(48,493,'MCP · APIs · grounded context',15,'#B7C9DE');
      b+=trace('M210 505V532');
      b+=card(28,532,364,66)+t(48,562,'Evaluate & review',21,'#FFFFFF','font-weight="600"')+t(48,586,'Quality · observability · human decisions',15,'#B7C9DE');
      b+=t(28,628,'Research direction · learning in progress',15,'#A8B7CC');
    } else {
      b+=t(42,104,'AI architecture. Intelligent systems.',34,'#FFFFFF','font-weight="600" letter-spacing="-.5"');
      b+=l(42,136,'CONCEPTUAL WORKFLOW / EXPLORING');
      b+=`<ellipse class="aurora" cx="480" cy="257" rx="205" ry="145" fill="url(#cyan-halo)"/>`;
      b+=card(42,174,236,79)+t(60,208,'Intent & context',21,'#FFFFFF','font-weight="600"')+t(60,234,'Goals · retrieval · boundaries',15,'#B7C9DE');
      b+=card(42,285,236,73)+t(60,316,'LLM Integration',21,'#FFFFFF','font-weight="600"')+t(60,339,'Typed model & tool contracts',15,'#B7C9DE');
      b+=r(327,174,306,184,'url(#orchestrator)',17,'stroke="#5BB6E3"');
      b+=l(350,205,'AGENTIC AI','#A5E4FA');
      b+=t(350,247,'AI Orchestration',27,'#FFFFFF','font-weight="600"');
      b+=line(350,265,610,265,'#4D7A9E');
      b+=t(350,298,'Plan  →  Act  →  Reflect',21,'#D8EEFA');
      b+=t(350,332,'State · coordination · tool use',16,'#B7C9DE');
      b+=card(682,174,236,79)+t(700,208,'Tools & knowledge',21,'#FFFFFF','font-weight="600"')+t(700,234,'MCP · APIs · grounded context',15,'#B7C9DE');
      b+=card(682,285,236,73)+t(700,316,'Evaluate & review',21,'#FFFFFF','font-weight="600"')+t(700,339,'Quality · human decisions',15,'#B7C9DE');
      ['M278 213H302V236H327','M278 321H302V294H327','M633 236H657V213H682','M633 294H657V321H682'].forEach(d=>{b+=trace(d);b+=stream(d);});
      b+=path('M800 358V393H160V358','#51799F','stroke-dasharray="4 6"');
      b+=r(360,381,240,24,'#11223A',4)+l(480,398,'HUMAN REVIEW & FEEDBACK','#B7C9DE','text-anchor="middle"');
      b+=t(42,447,'Exploring reliable, human-reviewed AI applications.',20,'#C5D3E4');
    }
    return{w,h,b};
  }
  return{hero,expertise,'ai-systems':ai};
}
