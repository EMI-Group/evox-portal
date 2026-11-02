// Adapted from the owner-supplied evox_evolution_ring_v2(1).html.
// Keep the source timing, deterministic population model, and stationary ring geometry.
/* EvoX evolution loop. Plain Canvas 2D + JavaScript; no network or library dependency.
   This is an illustrative, deterministic toy evolutionary algorithm, not EvoX benchmark data.
   18 candidates -> evaluate a synthetic objective -> retain 3 elites -> mutate offspring.
   The same selected individuals persist across generations. The ring itself does not rotate. */

  const TAU = Math.PI*2;
  const COUNT = 18, KEEP = 3;
  const DURATIONS = [2400,2000,2100,2100,2400];
  const STARTS = [0];
  DURATIONS.forEach(v=>STARTS.push(STARTS[STARTS.length-1]+v));
  const CYCLE = STARTS[5];
  const NAMES = ['Generate','Execute','Evaluate','Select','Improve'];
  const RED = [232,81,98], BRIGHT = [255,157,166], GREY = [181,181,190];
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
  const ease=t=>1-Math.pow(1-clamp(t),3);
  const color=(rgb,a=1)=>`rgba(${rgb.map(v=>Math.round(v)).join(',')},${clamp(a)})`;
  const blend=(a,b,t)=>a.map((v,i)=>mix(v,b[i],t));
  const polar=(r,a)=>({x:r*Math.cos(a),y:r*Math.sin(a)});
    function rng(seed) {let a=seed>>>0;return ()=>{a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296}}
  function shortAngle(a,b) {let d=(b-a+Math.PI)%TAU;if(d<0)d+=TAU;return d-Math.PI}
  function score(x,y) {return 1/(1+2*(.55*x*x+1.1*y*y+.07*(Math.sin(x*4)**2+Math.sin(y*4)**2)))}
  function target(slot) {return {a:-Math.PI/2+slot*TAU/COUNT,r:145+10*Math.sin(slot*2.39996323)}}
  function budPose(item) {const source=target(item.parent*6),rank=item.slot%6;return {a:source.a+(rank-3)*.043,r:source.r-10-Math.abs(rank-3)*2}}
  function moving(a,b,t,curve=0) {return {a:a.a+shortAngle(a.a,b.a)*t,r:mix(a.r,b.r,t)+Math.sin(Math.PI*t)*curve}}
  export class EvoXEvolution {
    constructor(root) {
      if(!root) throw new Error('An EvoX component root is required.');
      this.root=root;this.canvas=root.querySelector('canvas');
      this.ctx=this.canvas.getContext('2d',{alpha:false});
      if(!this.ctx) throw new Error('Canvas 2D is not supported in this browser.');
      this.steps=[...root.querySelectorAll('[data-stage]')];
      this.labels=this.steps.map(button=>button.querySelector('.evx-name').textContent.trim());
      this.playButton=root.querySelector('[data-action="play"]');
      this.resetButton=root.querySelector('[data-action="reset"]');
      this.status=root.querySelector('[data-status]');
      this.generations=[];this.time=0;this.playing=false;this.visible=false;this.destroyed=false;
      this.frameId=null;this.lastTime=null;this.lastStage=-1;this.lastGen=-1;
      this.abort=new AbortController();const signal=this.abort.signal;
      this.media=matchMedia('(prefers-reduced-motion: reduce)');
      this.motion=this.media.matches;
      this.loop=this.loop.bind(this);this.resize=this.resize.bind(this);
      this.playButton.addEventListener('click',()=>this.playing?this.pause():this.play(),{signal});
      this.resetButton.addEventListener('click',()=>{const play=this.playing;this.seek(0);if(play)this.play()},{signal});
      this.steps.forEach((b,i)=>b.addEventListener('click',()=>{
        const playing=this.playing;
        this.seek(Math.floor(this.time/CYCLE)*CYCLE+STARTS[i]+DURATIONS[i]*.52);
        if(playing)this.play();
      },{signal}));
      document.addEventListener('visibilitychange',()=>this.schedule(),{signal});
      this.media.addEventListener('change',e=>{this.motion=e.matches;if(e.matches)this.pause()},{signal});
      this.resizeObserver=new ResizeObserver(this.resize);this.resizeObserver.observe(this.canvas);
      this.intersectionObserver=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;this.schedule()},{threshold:0});
      this.intersectionObserver.observe(this.root);
      this.generation(0);this.resize();
      this.root.dataset.ready='true';
      this.root.querySelectorAll('button').forEach(button=>{button.disabled=false});
      window.addEventListener('pagehide',event=>{
        if(event.persisted){if(this.frameId!==null)cancelAnimationFrame(this.frameId);this.frameId=null;this.lastTime=null}
        else this.destroy();
      },{signal});
      window.addEventListener('pageshow',()=>this.schedule(),{signal});
      if(this.motion)this.seek(STARTS[3]+DURATIONS[3]*.75);else this.play();
    }
    generation(g) {
      if(this.generations[g])return this.generations[g];
      for(let k=this.generations.length;k<=g;k++) {
        const random=rng(24771+k*7013),items=[];
        if(k===0) {
          for(let i=0;i<COUNT;i++) {
            const x=random()*2-1,y=random()*2-1;
            items.push({id:`0:${i}`,slot:i,x,y,fitness:score(x,y),trait:random()*TAU,seed:random(),parent:-1,retained:false});
          }
        } else {
          const prev=this.generations[k-1],parents=prev.winners.map(i=>prev.items[i]);
          for(let i=0;i<COUNT;i++) {
            const pi=Math.floor(i/6),parent=parents[pi];
            if(i%6===0)items.push({...parent,slot:i,parent:pi,retained:true});
            else {
              const sigma=.31*Math.pow(.91,Math.min(k,8))+.055;
              const normal=()=>Math.sqrt(-2*Math.log(Math.max(random(),.00001)))*Math.cos(TAU*random());
              const x=clamp(parent.x+normal()*sigma,-1.2,1.2),y=clamp(parent.y+normal()*sigma,-1.2,1.2);
              items.push({id:`${k}:${i}`,slot:i,x,y,fitness:score(x,y),trait:parent.trait+(random()-.5)*.7,seed:random(),parent:pi,retained:false});
            }
          }
        }
        const winners=items.map((_,i)=>i).sort((a,b)=>items[b].fitness-items[a].fitness).slice(0,KEEP);
        this.generations.push({items,winners,best:items[winners[0]].fitness});
      }
      return this.generations[g];
    }
    resize() {
      if(this.destroyed)return;
      const r=this.canvas.getBoundingClientRect();this.w=r.width;this.h=r.height;
      if(!this.w||!this.h)return;
      this.dpr=Math.min(devicePixelRatio||1,2);
      this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);
      this.scale=Math.max(.01,Math.min((this.w-32)/470,(this.h-38)/470));
      this.render();
    }
    readTime() {
      const gen=Math.floor(this.time/CYCLE),inCycle=this.time-gen*CYCLE;
      let stage=4;for(let i=0;i<5;i++)if(inCycle<STARTS[i+1]){stage=i;break}
      return {gen,stage,p:clamp((inCycle-STARTS[stage])/DURATIONS[stage]),inCycle};
    }
    ring(r,a,b,stroke,width=1,alpha=1) {
      if(alpha<=0||b-a<.0001)return;
      const c=this.ctx;c.beginPath();c.arc(0,0,r,a,b);c.strokeStyle=typeof stroke==='string'?stroke:color(stroke,alpha);c.lineWidth=width;c.lineCap='round';c.stroke();
    }
    dot(x,y,r,fill,alpha=1) {
      if(r<=0||alpha<=0)return;
      const c=this.ctx;c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=typeof fill==='string'?fill:color(fill,alpha);c.fill();
    }
    halo(x,y,r,rgb,alpha) {
      if(alpha<=.001)return;
      const c=this.ctx,g=c.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,color(rgb,alpha));g.addColorStop(.25,color(rgb,alpha*.5));g.addColorStop(1,color(rgb,0));
      c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);
    }
    updateUi(state) {
      const {gen,stage,p}=state;
      if(stage!==this.lastStage||gen!==this.lastGen) {
        this.steps.forEach((b,i)=>{b.classList.toggle('is-active',i===stage);b.classList.toggle('is-complete',i<stage);b.setAttribute('aria-pressed',String(i===stage))});
        this.status.textContent=this.root.dataset.statusTemplate.replace('{generation}',String(gen+1)).replace('{stage}',this.labels[stage]);
        this.lastStage=stage;this.lastGen=gen;
      }
      this.steps.forEach((button,index)=>{
        if(index===stage)button.style.setProperty('--progress',String(p));
        else if(button.style.getPropertyValue('--progress')!==(index<stage?'1':'0'))button.style.setProperty('--progress',index<stage?'1':'0');
      });
    }
    drawFramework(state) {
      const {stage,p}=state,c=this.ctx;
      // Fixed geometry: five stationary waypoints, no mechanically rotating wheel.
      this.ring(216,0,TAU,[125,125,137],.7,.16);
      this.ring(198,0,TAU,[129,126,137],.7,.20);
      this.ring(165,0,TAU,[140,135,146],.6,.14);
      this.ring(123,0,TAU,[121,117,128],.7,.18);
      for(let i=0;i<60;i++) {
        const a=-Math.PI/2+i*TAU/60,isMajor=i%12===0;
        const t=polar(221,a),q=polar(isMajor?226:223,a);
        c.beginPath();c.moveTo(t.x,t.y);c.lineTo(q.x,q.y);c.lineWidth=.8;c.strokeStyle=color(GREY,isMajor?.3:.11);c.stroke();
      }
      const span=TAU/5;
      for(let i=0;i<5;i++) {
        const a=-Math.PI/2+i*span,gap=.056;
        this.ring(207,a+gap,a+span-gap,[144,140,151],1,.49);
        if(i<stage)this.ring(207,a+gap,a+span-gap,RED,1.35,.53);
        if(i===stage) {
          const end=a+gap+(span-gap*2)*smooth(p);
          this.ring(207,a+gap,end,RED,2,.94);
          const tip=polar(207,end);this.halo(tip.x,tip.y,14,RED,.28);this.dot(tip.x,tip.y,1.7,BRIGHT,.98);
          const sweepStart=Math.max(a+gap,end-.2);
          this.ring(207,sweepStart,end,BRIGHT,1.5,.8);
        }
        // Tiny directional chevrons, independent of node animation.
        const arrow=polar(207,a+span*.5),direction=a+span*.5+Math.PI/2;
        c.save();c.translate(arrow.x,arrow.y);c.rotate(direction);
        c.beginPath();c.moveTo(-2.5,-2.8);c.lineTo(.5,0);c.lineTo(-2.5,2.8);
        c.strokeStyle=color(i<=stage?RED:GREY,i===stage?.8:.28);c.lineWidth=1;c.stroke();c.restore();
        const at=polar(207,a),active=i===stage;
        if(active)this.halo(at.x,at.y,24,RED,.28+.06*Math.sin(p*Math.PI));
        this.dot(at.x,at.y,9.8,[6,6,7]);
        c.beginPath();c.arc(at.x,at.y,active?9.4:7,0,TAU);c.lineWidth=active?1.5:1;
        c.strokeStyle=color(active?BRIGHT:i<stage?RED:GREY,active?1:i<stage?.6:.46);c.stroke();
        this.dot(at.x,at.y,active?4.2:2.7,active?BRIGHT:i<stage?RED:GREY,active?1:.66);
      }
      // Empty center: no labels, counter, logo, or misleading 'capability' meter.
    }
    pose(item,state,pop) {
      const {gen,stage,p}=state,t=target(item.slot),winner=pop.winners.indexOf(item.slot);
      let pos=t,alpha=1,scale=1,red=item.retained?.72:0,scan=0,fitness=0;
      if(stage===0) {
        if(item.retained) {
          const settle=smooth(p/.85);
          red=mix(1,.72,settle);scale=mix(1.12,1,settle);
        } else {
          const group=gen===0?Math.floor(item.slot/6):item.parent;
          const source=gen===0?{...target(group*6),r:target(group*6).r-5}:budPose(item);
          const rank=item.slot%6;
          const progress=ease((p-.045-rank*.047)/.59);
          pos=moving(source,t,progress,-14);
          alpha=gen===0?smooth((p-.045-rank*.047)/.13):mix(.5,1,progress);
          scale=mix(.32,1,progress);
        }
      } else if(stage===1) {
        scan=(.16+.84*Math.sin(p*TAU*1.3+item.seed*TAU)**4)*Math.sin(Math.PI*p);
      } else if(stage===2) {
        const reveal=smooth((p-item.slot*.011)/.52);
        fitness=reveal;
        alpha=mix(1,.4+.6*item.fitness,reveal);
        scale=mix(1,.8+.35*item.fitness,reveal);
      } else if(stage===3) {
        const select=smooth((p-.06)/.63);
        fitness=1-select;
        const evaluatedAlpha=.4+.6*item.fitness,evaluatedScale=.8+.35*item.fitness;
        if(winner>=0){red=mix(red,1,select);alpha=mix(evaluatedAlpha,1,select);scale=mix(evaluatedScale,1.12,select);scan=.24*Math.sin(Math.PI*select)}
        else {alpha=(1-smooth((p-.06-item.slot*.009)/.62))*evaluatedAlpha;pos={a:t.a,r:t.r+12*select};scale=evaluatedScale*(1-.3*select)}
      } else {
        if(winner<0){alpha=0;scale=.5}
        else {
          red=1;scale=1.12;
          const arrive=smooth((p-.02)/.63);
          pos=moving(t,target(winner*6),arrive,-12);
        }
      }
      return {...pos,alpha,scale,red,scan,fitness,winner};
    }
    drawCandidate(item,pose,state,alphaOverride=null) {
      const c=this.ctx,{p,stage}=state;
      const {a,r,scale,red,scan,fitness}=pose;
      const alpha=alphaOverride===null?pose.alpha:alphaOverride;
      if(alpha<.002)return;
      const q=polar(r,a),rgb=blend(GREY,RED,red),core=blend([236,236,242],BRIGHT,red);
      if(red>.02)this.halo(q.x,q.y,20,RED,alpha*red*.40);
      if(scan>.01)this.halo(q.x,q.y,17,[225,221,229],alpha*scan*.45);
      c.save();c.translate(q.x,q.y);c.scale(scale,scale);
      // A tiny inherited two-bead signature makes parent/offspring resemblance visible.
      const trait=item.trait;
      for(let j=0;j<2;j++) {
        const aa=trait+j*(2.6+item.x*.14),rr=10.2+(j===0?item.y:item.x)*.8;
        const bead=polar(rr,aa);
        c.beginPath();c.moveTo(bead.x*.6,bead.y*.6);c.lineTo(bead.x*.89,bead.y*.89);
        c.strokeStyle=color(rgb,alpha*.32);c.lineWidth=.8;c.stroke();
        this.dot(bead.x,bead.y,1.35,rgb,alpha*.72);
      }
      c.beginPath();c.arc(0,0,6.0,0,TAU);c.fillStyle=color([12,11,15],alpha);c.fill();
      c.lineWidth=red>.7?1.3:1;c.strokeStyle=color(rgb,alpha*(.7+.3*scan));c.stroke();
      this.dot(-.35,-.45,3.0+scan*.7,core,alpha*(.88+.12*scan));
      if(stage===1) {
        const angle=item.trait+p*TAU*1.5;
        c.beginPath();c.arc(0,0,14.2,angle,angle+Math.PI*.72);c.lineWidth=1;
        c.strokeStyle=color(GREY,alpha*Math.sin(Math.PI*p)*.6);c.stroke();
      }
      if(fitness>.001) {
        c.beginPath();c.arc(0,0,15.2,-Math.PI/2,Math.PI*1.5);c.lineWidth=1.2;c.strokeStyle=color(GREY,alpha*fitness*.11);c.stroke();
        c.beginPath();c.arc(0,0,15.2,-Math.PI/2,-Math.PI/2+TAU*item.fitness*fitness);c.strokeStyle=color(red>.5?BRIGHT:GREY,alpha*fitness*.83);c.stroke();
      }
      c.restore();
    }
    drawTests(state) {
      const {stage,p}=state;if(stage!==1&&stage!==2)return;
      const fade=Math.sin(Math.PI*p),angle=-Math.PI/2+TAU*p;
      const q=polar(175,angle);
      for(let i=0;i<25;i++) {
        const a=angle-i*.007;
        this.ring(175,a-.005,a+.002,stage===1?GREY:RED,stage===1?1.4:1.1,fade*(1-i/25)*.55);
      }
      this.halo(q.x,q.y,12,stage===1?GREY:RED,fade*.17);
      this.dot(q.x,q.y,1.6,stage===1?GREY:BRIGHT,fade*.85);
    }
    drawInheritance(state,pop) {
      const {stage,p}=state;
      if(stage!==4&&stage!==0)return;
      for(let j=0;j<3;j++) {
        const t=target(j*6),q=polar(t.r,t.a);
        const strength=stage===4?smooth((p-.63)/.13):1-smooth(p/.30);
        if(strength>.001) {
          const ripple=stage===4?clamp((p-.64)/.36):clamp(p/.3);
          const c=this.ctx;c.beginPath();c.arc(q.x,q.y,12+16*ripple,0,TAU);c.lineWidth=.8;
          c.strokeStyle=color(RED,strength*(1-ripple)*.32);c.stroke();
        }
      }
      // Visible offspring buds at the end of Improve persist into the next Generate.
      // No connecting branches: just local reproduction and curved redistribution.
      if(stage===4) {
        const next=this.generation(state.gen+1),begin=smooth((p-.76)/.24);
        next.items.filter(v=>!v.retained).forEach(item=>{
          const pose={...budPose(item),alpha:begin*.5,scale:.32,red:0,scan:0,fitness:0};
          this.drawCandidate(item,pose,state);
        });
      }
    }
    render() {
      if(this.destroyed||!this.w||!this.h)return;
      const c=this.ctx,s=this.readTime(),pop=this.generation(s.gen);this.updateUi(s);
      c.setTransform(this.dpr,0,0,this.dpr,0,0);c.fillStyle='#060607';c.fillRect(0,0,this.w,this.h);
      c.save();c.translate(this.w/2,this.h/2+4);c.scale(this.scale,this.scale);
      // The faint halo belongs to the annulus. The center stays genuinely empty.
      const wash=c.createRadialGradient(0,0,98,0,0,230);
      wash.addColorStop(0,'rgba(116,30,45,0)');wash.addColorStop(.44,'rgba(116,30,45,.045)');wash.addColorStop(1,'rgba(116,30,45,0)');
      c.fillStyle=wash;c.fillRect(-235,-235,470,470);
      this.drawFramework(s);this.drawTests(s);
      // Tiny neutral pinpoints define the population band, not a starfield.
      for(let i=0;i<36;i++) {
        const a=-Math.PI/2+i*TAU/36,q=polar(109,a);
        this.dot(q.x,q.y,i%3===0?.8:.45,GREY,i%3===0?.17:.10);
      }
      this.drawInheritance(s,pop);
      for(const item of pop.items)this.drawCandidate(item,this.pose(item,s,pop),s);
      c.restore();
    }
    schedule() {
      if(this.frameId!==null){cancelAnimationFrame(this.frameId);this.frameId=null}
      this.lastTime=null;
      if(!this.destroyed&&this.playing&&this.visible&&!document.hidden)this.frameId=requestAnimationFrame(this.loop);
    }
    loop(now) {
      this.frameId=null;
      if(this.destroyed||!this.playing||!this.visible||document.hidden)return;
      if(this.lastTime!==null)this.time+=Math.min(now-this.lastTime,120);
      this.lastTime=now;this.render();this.frameId=requestAnimationFrame(this.loop);
    }
    updateButton() {
      this.root.dataset.playing=String(this.playing);
      const label=this.playing?this.root.dataset.pauseLabel:this.root.dataset.playLabel;this.playButton.setAttribute('aria-label',label);this.playButton.title=label;
      this.playButton.querySelector('svg').innerHTML=this.playing?'<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>':'<path d="M8 4.7L19 12 8 19.3z"/>';
    }
    play() {if(this.destroyed)return;this.playing=true;this.updateButton();this.schedule()}
    pause() {this.playing=false;this.updateButton();this.schedule()}
    seek(milliseconds) {
      if(!Number.isFinite(milliseconds)||milliseconds<0)throw new RangeError('seek() requires non-negative milliseconds.');
      this.pause();this.time=milliseconds;this.render();return this.getState();
    }
    getState() {
      const state=this.readTime(),pop=this.generation(state.gen);
      return {milliseconds:this.time,generation:state.gen+1,stage:NAMES[state.stage],stageIndex:state.stage,progress:state.p,playing:this.playing,
        population:pop.items.map(p=>({id:p.id,slot:p.slot,fitness:p.fitness,retained:p.retained})),
        selected:pop.winners.map(i=>pop.items[i].id),best:pop.best,cycleMilliseconds:CYCLE};
    }
    destroy() {this.pause();this.destroyed=true;this.abort.abort();this.resizeObserver.disconnect();this.intersectionObserver.disconnect()}
  }

export function mountEvolutionRings() {
  document.querySelectorAll('[data-evolution-ring]').forEach(root => {
    if(root.dataset.ready === 'true')return;
    if(!('ResizeObserver' in window) || !('IntersectionObserver' in window))return;
    new EvoXEvolution(root);
  });
}
