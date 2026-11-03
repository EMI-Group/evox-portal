/* Illustrative evolutionary experiments, not measured model, robotics or CFD results.
   Each population retains its elite unchanged and mutates its inherited parameters. */
export type EvolutionKind = "generative" | "physical" | "science";
export type SceneKind = EvolutionKind | "agentic";
type Candidate = { genes: number[]; score: number; id: string; parent: string | null };
export type Population = { candidates: Candidate[]; winner: number };
type Point = { x: number; y: number };
const TAU = Math.PI * 2;
const RED = "#e65361", BRIGHT = "#ff9da6", INK = "#d5d3dc", MUTED = "#777580";
const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const smooth = (p: number) => { p = clamp(p); return p * p * (3 - 2 * p); };
function rng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const targets: Record<EvolutionKind, number[]> = {
  generative: Array.from({length:16}, (_, i) => .2 + ((i * 7 + 3) % 11) / 18),
  physical: [.72, .68, .35, .8],
  science: [.38, .58, .32],
};
export function nextPopulation(kind: EvolutionKind, previous: Population | undefined, generation: number): Population {
  const random = rng(8217 + generation * 7013 + kind.length * 123);
  const count = 3;
  const parent = previous?.candidates[previous.winner];
  const candidates = Array.from({length:count}, (_, i): Candidate => {
    if (parent && i === 0) return {...parent, genes:[...parent.genes], parent:parent.id};
    const spread = .22 * Math.pow(.91, Math.min(generation, 10)) + .055;
    let genes = targets[kind].map((_, j) => parent ? clamp(parent.genes[j] + (random() - .5) * spread * 2) : .12 + random() * .78);
    if(kind === "physical" && !parent) genes = [[.2,.18,.8,.15],[.45,.45,.5,.5],[.64,.6,.45,.64]][i];
    const error = genes.reduce((sum, v, j) => sum + (v - targets[kind][j]) ** 2, 0) / genes.length;
    return {genes, score:clamp(1 - Math.sqrt(error) * 1.7, .08, .99), id:`${kind}-${generation}-${i}`, parent:parent?.id ?? null};
  });
  const winner = candidates.reduce((best, candidate, i) => candidate.score > candidates[best].score ? i : best, 0);
  return {candidates, winner};
}

class EvolutionScene {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  kind: SceneKind;
  population: Population;
  previousPopulation?: Population;
  generation = 0;
  time = 0;
  frame = 0;
  last = 0;
  visible = false;
  paused = false;
  ratio = 1;
  scale = 1;
  button: HTMLButtonElement;
  media = matchMedia("(prefers-reduced-motion: reduce)");
  // Unequal phases leave room for testing before selection and reproduction.
  durations = [2200, 4200, 1800, 1900, 2600];
  starts = [0, 2200, 6400, 8200, 10100, 12700];
  constructor(root: HTMLElement) {
    this.root = root; this.kind = root.dataset.kind as SceneKind;
    this.canvas = root.querySelector("canvas")!; this.ctx = this.canvas.getContext("2d")!;
    this.population = this.kind === "agentic" ? {candidates:[],winner:0} : nextPopulation(this.kind, undefined, 0);
    this.button = root.querySelector('[data-action="pause"]')!;
    this.paused = this.media.matches;
    if (this.paused) this.time = 9450;
    this.button.addEventListener("click", () => { this.paused = !this.paused; this.sync(); });
    root.querySelector('[data-action="restart"]')!.addEventListener("click", () => {
      this.time = this.media.matches ? 9450 : 0; this.generation = 0; this.previousPopulation = undefined;
      this.population = this.kind === "agentic" ? {candidates:[],winner:0} : nextPopulation(this.kind, undefined, 0); this.render(); this.sync();
    });
    this.media.addEventListener("change", () => { this.paused = this.media.matches; if (this.paused) this.time = 9450; this.render(); this.sync(); });
    document.addEventListener("visibilitychange", () => this.sync());
    new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; this.sync(); }).observe(root);
    new ResizeObserver(() => this.resize()).observe(root);
    this.resize(); root.dataset.ready = ""; this.sync();
  }
  resize() {
    const box = this.root.getBoundingClientRect();
    this.ratio = Math.min(devicePixelRatio || 1, 2); this.scale = box.width / 480;
    this.canvas.width = Math.round(box.width * this.ratio); this.canvas.height = Math.round(box.height * this.ratio);
    this.render();
  }
  sync() {
    cancelAnimationFrame(this.frame); this.last = 0;
    this.root.toggleAttribute("data-user-paused", this.paused);
    this.button.setAttribute("aria-pressed", String(this.paused));
    this.button.setAttribute("aria-label", (this.paused ? this.button.dataset.play : this.button.dataset.pause)!);
    if (!this.paused && this.visible && !document.hidden) this.frame = requestAnimationFrame(this.tick);
  }
  tick = (now: number) => {
    if (this.last) this.time += Math.min(now - this.last, 80);
    this.last = now;
    if (this.time >= 12700) {
      this.time -= 12700; this.previousPopulation = this.population; this.generation++;
      if(this.kind !== "agentic") this.population = nextPopulation(this.kind, this.population, this.generation);
    }
    this.render(); this.frame = requestAnimationFrame(this.tick);
  };
  line(points: Point[], color = MUTED, alpha = 1, width = .8) {
    if (!points.length || alpha <= 0) return;
    const c = this.ctx; c.save(); c.globalAlpha = alpha; c.strokeStyle = color; c.lineWidth = width;
    c.beginPath(); points.forEach((p,i) => i ? c.lineTo(p.x,p.y) : c.moveTo(p.x,p.y)); c.stroke(); c.restore();
  }
  dot(x: number, y: number, radius: number, color = INK, alpha = 1) {
    const c = this.ctx; c.save(); c.globalAlpha = clamp(alpha); c.fillStyle = color; c.beginPath(); c.arc(x,y,radius,0,TAU); c.fill(); c.restore();
  }
  halo(x: number, y: number, radius: number, strength = .2) {
    const c = this.ctx; const gradient = c.createRadialGradient(x,y,0,x,y,radius);
    gradient.addColorStop(0,`rgba(230,83,97,${strength})`); gradient.addColorStop(1,"rgba(230,83,97,0)");
    c.fillStyle = gradient; c.fillRect(x-radius,y-radius,radius*2,radius*2);
  }
  circle(x: number, y: number, radius: number, progress: number, color = RED, alpha = 1, width = 1) {
    const c = this.ctx; c.save(); c.globalAlpha = clamp(alpha); c.strokeStyle = color; c.lineWidth = width;
    c.beginPath(); c.arc(x,y,radius,-Math.PI/2,-Math.PI/2+TAU*clamp(progress)); c.stroke(); c.restore();
  }
  route(a: Point, b: Point, bend: number, color = MUTED, alpha = .3, progress?: number) {
    const c = this.ctx;
    c.save(); c.globalAlpha = alpha; c.strokeStyle = color; c.lineWidth = .75;
    c.beginPath(); c.moveTo(a.x,a.y); c.bezierCurveTo(a.x+bend,a.y,b.x-bend,b.y,b.x,b.y); c.stroke(); c.restore();
    if (progress !== undefined) {
      const t = clamp(progress), u = 1-t;
      const x = u*u*u*a.x+3*u*u*t*(a.x+bend)+3*u*t*t*(b.x-bend)+t*t*t*b.x;
      const y = u*u*u*a.y+3*u*u*t*a.y+3*u*t*t*b.y+t*t*t*b.y;
      this.halo(x,y,10,.18); this.dot(x,y,1.6,BRIGHT);
    }
  }
  frameBox(x: number,y: number,w: number,h: number,alpha = .6,accent = false) {
    const c = this.ctx; c.save(); c.globalAlpha = clamp(alpha);
    const fill = c.createLinearGradient(x,y,x+w,y+h); fill.addColorStop(0,"#17141c"); fill.addColorStop(1,"#0a090e");
    c.fillStyle=fill;c.strokeStyle=accent?RED:"#514854";c.lineWidth=accent?1.1:.7;
    c.beginPath();c.roundRect(x,y,w,h,5);c.fill();c.stroke();c.restore();
  }
  matrix(x: number, y: number, size: number, genes: number[], alpha = 1, accent = false, scan = -1) {
    this.frameBox(x-size/2-6,y-size/2-6,size+12,size+12,alpha,accent);
    const pitch=size/4, cell=pitch*.72;
    genes.slice(0,16).forEach((g,i)=>{
      const col=i%4,row=Math.floor(i/4);const px=x-size/2+col*pitch,py=y-size/2+row*pitch;
      const c=this.ctx;c.save();c.globalAlpha=alpha*(.22+g*.78);c.fillStyle=accent&&g>.48?RED:INK;
      if(scan>=row&&scan<row+1){c.fillStyle=BRIGHT;c.shadowColor=RED;c.shadowBlur=5;}
      c.beginPath();c.roundRect(px,py,cell,cell,.8);c.fill();c.restore();
    });
  }
  generative(stage: number,p: number) {
    const pop=this.population,champ=pop.candidates[pop.winner];
    const prior=this.previousPopulation?.candidates[this.previousPopulation.winner]??pop.candidates[0];
    const target={x:344,y:145};
    pop.candidates.forEach((candidate,i)=>{
      const at={x:102,y:76+i*68},winner=i===pop.winner;
      const enter=stage===0?smooth((p-i*.09)/.65):1;
      const selected=stage>=3&&winner;
      const alpha=stage===3&&!winner?mix(1,.17,smooth(p)):stage===4&&!winner?.17:1;
      this.route({x:at.x+28,y:at.y},{x:target.x-56,y:target.y},65,selected?RED:MUTED,selected?.65:.23,stage===3&&winner?p:undefined);
      const x=stage===0&&this.previousPopulation?mix(target.x,at.x,enter):at.x;
      const y=stage===0&&this.previousPopulation?mix(target.y,at.y,enter):at.y;
      if(selected)this.halo(x,y,45,.17);
      this.matrix(x,y,38,candidate.genes,alpha*enter,selected,stage===1?(p*6+i*.4)%4:-1);
      if(stage===2){const scan=smooth((p-i*.12)/.6);this.line([{x:at.x-22,y:at.y+31},{x:at.x-22+44*scan,y:at.y+31}],INK,.6,.9);}
    });
    const blend=stage===3?smooth((p-.15)/.7):stage===4?1:0;
    const genes=prior.genes.map((v,i)=>mix(v,champ.genes[i],blend));
    this.halo(target.x,target.y,85,.07+.13*blend);
    this.matrix(target.x,target.y,88,genes,.4+.6*blend,stage>=3);
    if(stage===4){
      // A few inherited weights seed the next variants without a separate loop diagram.
      for(let i=0;i<3;i++){const t=smooth((p-.6-i*.045)/.3);if(t>0){const y=76+i*68;this.dot(mix(304,130,t),mix(145,y,t),1.6,BRIGHT,Math.sin(t*Math.PI));}}
    }
  }
  robot(x: number, floor: number, genes: number[], phase: number, quality: number, alpha: number, selected: boolean, failed: number) {
    const c=this.ctx;const bob=Math.sin(phase*2)*mix(4,.8,quality);
    const tilt=Math.sin(phase)*mix(.18,.025,quality)-failed*.75;
    const bodyY=floor-34+bob+failed*22;
    const body=(dx:number,dy:number):Point=>({x:x+dx*Math.cos(tilt)-dy*Math.sin(tilt),y:bodyY+dx*Math.sin(tilt)+dy*Math.cos(tilt)});
    const color=selected?BRIGHT:INK;
    c.save();c.globalAlpha=alpha;
    if(selected)this.halo(x,bodyY,35,.2);
    for(let leg=0;leg<4;leg++){
      const side=leg<2?-1:1,offset=(leg%2)*Math.PI;
      const a=phase+offset+(leg<2?Math.PI:0), cycle=((a/TAU)%1+1)%1;
      const hip=body(side*17,4);
      const stride=12+genes[0]*8;
      const dx=cycle<.6?stride*(.5-cycle/.6):stride*(-.5+(cycle-.6)/.4);
      const lift=cycle<.6?0:Math.sin((cycle-.6)/.4*Math.PI)*(7+genes[1]*7)*(1-failed);
      const foot={x:x+side*18+dx*(1-failed),y:floor-lift};
      const vx=foot.x-hip.x,vy=foot.y-hip.y,dist=Math.hypot(vx,vy)||1;
      const bend=Math.sqrt(Math.max(0,22*22-dist*dist/4));
      const knee={x:(hip.x+foot.x)/2+side*bend*vy/dist,y:(hip.y+foot.y)/2-side*bend*vx/dist};
      this.line([hip,knee,foot],color,alpha*(leg%2?.85:.3),leg%2?1.2:.8);
      this.dot(knee.x,knee.y,1.3,color,alpha*.6);
    }
    const vertices=[[-24,-5],[-19,-9],[19,-9],[24,-5],[24,5],[19,9],[-19,9],[-24,5]].map(([a,b])=>body(a,b));
    c.fillStyle=selected?"#201018":"#111017";c.strokeStyle=color;c.lineWidth=1;
    c.beginPath();vertices.forEach((v,i)=>i?c.lineTo(v.x,v.y):c.moveTo(v.x,v.y));c.closePath();c.fill();c.stroke();
    const sensor=body(15,-2);this.dot(sensor.x,sensor.y,1.8,selected?BRIGHT:MUTED,.8);
    c.restore();
  }
  physical(stage: number,p: number) {
    const pop=this.population;
    const run=stage===0?0:stage===1?smooth(p):1;
    pop.candidates.forEach((candidate,i)=>{
      const floor=91+i*65, winner=i===pop.winner;
      const alpha=stage===3&&!winner?mix(1,.15,smooth(p)):stage===4&&!winner?.15:1;
      const selected=stage>=3&&winner;
      this.line([{x:73,y:floor},{x:435,y:floor}],MUTED,.22,.65);
      for(let tick=0;tick<13;tick++)this.line([{x:90+tick*27,y:floor},{x:90+tick*27,y:floor+3}],MUTED,.17,.6);
      const distance=140+candidate.score*155;
        const failed=candidate.score<.55?smooth((run-.4)/.25):0;
      const x=105+distance*(candidate.score<.55?Math.min(run,.52):run);
      this.line([{x:99,y:floor+5},{x:x,y:floor+5}],selected?RED:MUTED,.3*alpha,1);
      const policy=Array.from({length:16},(_,j)=>candidate.genes[j%4]);
      this.matrix(46,floor-22,21,policy,alpha*.7,selected);
      this.route({x:63,y:floor-22},{x:x-26,y:floor-22},22,selected?RED:MUTED,.17*alpha,stage===0?p:undefined);
      this.robot(x,floor,candidate.genes,run*TAU*(2+candidate.genes[0]*2),candidate.score,alpha,selected,failed);
      if(selected)this.halo(x,floor-20,40,.13);
    });
    if(stage===4){
      for(let i=0;i<3;i++){const a=smooth((p-.5-i*.08)/.4);this.halo(46,69+i*65,22,.16*a);}
    }
  }

  foil(genes: number[], x: number,y: number,length: number):Point[] {
    const thickness=.065+genes[1]*.12,camber=(genes[0]-.2)*.09,location=.2+genes[2]*.45;
    const surface=(u:number,sign:number)=>{
      const yt=5*thickness*(.2969*Math.sqrt(u)-.126*u-.3516*u*u+.2843*u*u*u-.1036*u*u*u*u);
      const yc=u<location?camber/(location*location)*(2*location*u-u*u):camber/((1-location)**2)*(1-2*location+2*location*u-u*u);
      return {x:x+u*length,y:y+(-yc+sign*yt)*length};
    };
    return [...Array.from({length:41},(_,i)=>surface(i/40,-1)),...Array.from({length:40},(_,i)=>surface((39-i)/40,1))];
  }
  drawFoil(genes:number[],x:number,y:number,length:number,color:string,alpha:number,filled=true) {
    const pts=this.foil(genes,x,y,length),c=this.ctx;
    c.save();c.globalAlpha=alpha;c.strokeStyle=color;c.lineWidth=length>150?1.1:.85;
    c.beginPath();pts.forEach((v,i)=>i?c.lineTo(v.x,v.y):c.moveTo(v.x,v.y));c.closePath();
    if(filled){const g=c.createLinearGradient(x,y-30,x,y+20);g.addColorStop(0,"#211620");g.addColorStop(1,"#0c0b10");c.fillStyle=g;c.fill();}c.stroke();c.restore();
  }
  science(stage: number,p: number) {
    const pop=this.population;
    const tested=stage===0?0:stage===1?Math.min(2,Math.floor(p*3)):pop.winner;
    const sample=pop.candidates[tested],winner=pop.candidates[pop.winner];
    const testP=stage===1?(p*3)%1:0;
    // Analytic contour traces are a visual test metaphor, not a computed flow solver.
    this.frameBox(158,52,292,163,.4);
    this.line([{x:170,y:140},{x:437,y:140}],MUTED,.14,.7);
    for(let l=0;l<11;l++){
      if(l===5)continue;
      const base=65+l*13.7;
      const pts=Array.from({length:65},(_,j)=>{
        const u=j/64,x=168+u*271;
        const influence=Math.exp(-(((x-285)/78)**2))*(base<140?-1:1)*(6+sample.genes[1]*8)*(1-Math.abs(base-140)/110);
        return {x,y:base+influence};
      });
      this.line(pts,l===4?RED:MUTED,l===4?.45:.14,.65);
      if(stage===1){const v=((testP*1.5+l*.137)%1)*64,i=Math.floor(v),at=pts[i];this.dot(at.x,at.y,l===4?1.7:1,l===4?BRIGHT:INK,.65*Math.sin(Math.PI*testP));}
    }
    pop.candidates.forEach((candidate,i)=>{
      const y=80+i*61,selected=stage>=3&&i===pop.winner;
      const alpha=stage===0?smooth((p-i*.13)/.6):stage>=3&&!selected?.16:.7;
      this.drawFoil(candidate.genes,31,y,94,selected?BRIGHT:INK,alpha);
      this.route({x:128,y},{x:183,y:139},24,selected||tested===i?RED:MUTED,selected||tested===i?.6:.12,stage===1&&tested===i?testP:undefined);

      if(selected){this.halo(78,y,40,.12);this.drawFoil(candidate.genes,31,y,94,BRIGHT,.95);}
    });
    const selected=stage>=3;
    if(selected)this.halo(296,138,80,.14);
    // Ghost outlines make the design change visible while preserving the selected geometry.
    if(stage>=2)pop.candidates.filter((_,i)=>i!==pop.winner).forEach(item=>this.drawFoil(item.genes,187,146,232,MUTED,.16,false));
    const shape=stage===1&&tested>0?sample.genes.map((g,i)=>mix(pop.candidates[tested-1].genes[i],g,smooth(testP/.22))):(selected?winner:sample).genes;
    this.drawFoil(shape,187,146,232,selected?BRIGHT:INK,.95);
    if(stage===1){const x=187+testP*232;this.line([{x,y:88},{x,y:192}],BRIGHT,Math.sin(testP*Math.PI)*.22,.7);}
    if(stage===4&&p>.6){const reveal=smooth((p-.6)/.4);pop.candidates.forEach((item,i)=>{if(i!==pop.winner)this.drawFoil(item.genes.map((v,j)=>mix(v,winner.genes[j],reveal*.6)),31,80+i*61,94,MUTED,reveal*.4);});}
  }
  text(value:string,x:number,y:number,color=INK,alpha=1,size=10) {
    const c=this.ctx;c.save();c.globalAlpha=alpha;c.fillStyle=color;c.font=`${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;c.fillText(value,x,y);c.restore();
  }
  check(x:number,y:number,success:boolean,alpha=1) {
    if(success)this.line([{x:x-3,y},{x:x-1,y:y+2},{x:x+4,y:y-4}],BRIGHT,alpha,1.2);
    else {this.line([{x:x-3,y:y-3},{x:x+3,y:y+3}],RED,alpha,1.1);this.line([{x:x-3,y:y+3},{x:x+3,y:y-3}],RED,alpha,1.1);}
  }
  agentic(t:number) {
    const writing=smooth((t-.12)/.27),testing=clamp((t-.4)/.16),repair=smooth((t-.6)/.16),complete=smooth((t-.78)/.12);
    const fade=1-smooth((t-.96)/.04);
    // A task branches into concrete source files; tests expose a defect, then the code is revised.
    this.frameBox(27,105,70,76,.8);
    this.text("task.md",35,122,MUTED,.9,10.5);
    for(let i=0;i<3;i++){this.circle(39,138+i*12,2,1,i===2?RED:MUTED,.6,.7);this.line([{x:47,y:138+i*12},{x:79-i*5,y:138+i*12}],MUTED,.65,1);}
    for(let i=0;i<2;i++){
      const x=146,y=65+i*100;
      const reveal=.2+.8*smooth((t-i*.035)/.15);
      this.route({x:97,y:143},{x,y:y+38},26,RED,.2+.4*reveal,t<.2?clamp((t-i*.03)/.16):undefined);
      this.frameBox(x,y,126,77,reveal,repair>0&&repair<1&&i===0);
      this.text(i===0?"core.py":"api.py",x+12,y+17,INK,reveal,11.5);
      this.line([{x:x+8,y:y+25},{x:x+118,y:y+25}],MUTED,.18,.6);
      const lines=i===0?["def solve(x):","  data = parse(x)","  return compute(data)"]:["def run(task):","  data = load(task)","  return solve(data)"];
      lines.forEach((value,row)=>{
        const a=smooth((writing-row*.12-i*.1)/.3)*fade;
        if(i===0&&row===1&&repair>0){this.ctx.save();this.ctx.fillStyle=`rgba(230,83,97,${.08*repair})`;this.ctx.fillRect(x+8,y+42,110,11);this.ctx.restore();this.text("  data = normalize(x)",x+12,y+51,BRIGHT,a,7.7);}
        else this.text(value,x+12,y+39+row*12,row===0?"#c68c9c":MUTED,a,7.7);
      });
      this.route({x:x+126,y:y+38},{x:318,y:140},22,complete>0?RED:MUTED,.22,testing>0&&testing<1?clamp(testing-i*.1):undefined);
    }
    this.frameBox(318,81,135,126,.78,complete>.1);
    this.text("tests/",330,100,INK,.9,11.5);
    this.line([{x:326,y:108},{x:445,y:108}],MUTED,.2,.6);
    ["test_core","test_api","test_flow"].forEach((name,i)=>{
      const y=125+i*23;this.text(name,330,y,MUTED,.75,10);
      const reached=testing>(i+1)/3;
      if(reached){const passed=i!==0||complete>.15;this.check(436,y-3,passed,fade);}
      else if(testing>i/3){this.circle(436,y-3,4,(testing*3)%1,RED,.8,.9);}
      else this.dot(436,y-3,1.5,MUTED,.3);
    });
    if(t>.56&&t<.8){
      const a=Math.sin(clamp((t-.56)/.24)*Math.PI);
      this.route({x:318,y:122},{x:272,y:107},-20,RED,a*.7,clamp((t-.56)/.16));
      this.halo(202,107,48,a*.11);
    }
    if(complete>0){this.halo(385,143,65,complete*.13*fade);this.text("app/",337,229,INK,complete*fade,10);this.check(426,226,true,complete*fade);this.line([{x:385,y:207},{x:385,y:218}],RED,complete*.5*fade,.8);}
  }
  render() {
    if(!this.scale)return;
    const c=this.ctx;
    c.setTransform(this.ratio*this.scale,0,0,this.ratio*this.scale,0,0);
    c.clearRect(0,0,480,280);c.lineCap="round";c.lineJoin="round";
    const stage=Math.min(4,this.starts.findIndex((v,i)=>i>0&&this.time<v)-1);
    const current=Math.max(0,stage),p=clamp((this.time-this.starts[current])/this.durations[current]);
    this.root.dataset.phase=String(current);this.root.dataset.generation=String(this.generation);
    // Sparse measuring marks and broad, restrained halo match the parent evolution diagram.
    const wash=c.createRadialGradient(260,140,20,260,140,170);wash.addColorStop(0,"#e6536109");wash.addColorStop(1,"#e6536100");c.fillStyle=wash;c.fillRect(10,40,460,200);
    for(let i=0;i<22;i++)this.dot(20+i*21,42,.55,MUTED,.2);
    if(this.kind==="generative")this.generative(current,p);
    else if(this.kind==="physical")this.physical(current,p);
    else if(this.kind==="science") this.science(current,p);
    else this.agentic(this.time/12700);
  }
}
export function mountEvolutionScenes() {
  document.querySelectorAll<HTMLElement>(".evolution-scene:not([data-ready])").forEach(root=>new EvolutionScene(root));
}
