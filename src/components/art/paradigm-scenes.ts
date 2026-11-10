import { diagramAlpha, readDiagramPalette } from "./diagram-theme";
import { AnimationLifetime } from "./animation-lifetime";
import { MAIN_MERGE, agentEpisode, commitId, type Agent } from "./recursive-agents";
/* Illustrative evolutionary experiments, not measured model, robotics or CFD results.
   Each population retains its elite unchanged and mutates its inherited parameters. */
export type PopulationKind = "generative" | "physical" | "science";
export type ParadigmKind = PopulationKind | "agentic";
type Candidate = { genes: number[]; score: number; id: string; parent: string | null };
export type Population = { candidates: Candidate[]; winner: number };
type Point = { x: number; y: number };
const TAU = Math.PI * 2;
const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const smooth = (p: number) => { p = clamp(p); return p * p * (3 - 2 * p); };
function rng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
// Recursive agents in an oblique projection: time runs left to right over AGENT_SPAN ms, each recursion
// depth is a floor (LEVELS gives floor heights), and siblings recede along z with RECEDE per unit.
const AGENT_SPAN = 12000, MAIN_Y = 46, LEVELS = [96, 164, 232], FLOOR_Z = 44;
const RECEDE = { x: .5, y: -.55 };
const targets: Record<PopulationKind, number[]> = {
  generative: Array.from({length:16}, (_, i) => .2 + ((i * 7 + 3) % 11) / 18),
  physical: [.72, .68, .35, .8],
  science: [.38, .58, .32],
};
export function nextPopulation(kind: PopulationKind, previous: Population | undefined, generation: number): Population {
  const random = rng(8217 + generation * 7013 + kind.length * 123);
  const count = 3;
  const parent = previous?.candidates[previous.winner];
  const candidates = Array.from({length:count}, (_, i): Candidate => {
    if (parent && i === 0) return {...parent, genes:[...parent.genes], parent:parent.id};
    const spread = .22 * Math.pow(.91, Math.min(generation, 10)) + .055;
    let genes = targets[kind].map((_, j) => parent ? clamp(parent.genes[j] + (random() - .5) * spread * 2) : .12 + random() * .78);
    // Generative offspring inherit all weights except three localized mutations.
    if (kind === "generative" && parent) {
      genes = [...parent.genes];
      const first = Math.floor(random() * genes.length);
      for (let change = 0; change < 3; change++) {
        const index = (first + change * 5) % genes.length;
        genes[index] = clamp(genes[index] + (random() < .5 ? -1 : 1) * spread * (.6 + random() * .4));
      }
    }
    // Policy and wing offspring change one parameter and inherit the rest.
    if ((kind === "physical" || kind === "science") && parent) {
      genes = [...parent.genes];
      const index = (generation + i - (kind === "science" ? 2 : 1)) % genes.length;
      const delta = spread * (.5 + random() * .5) * (random() < .5 ? -1 : 1);
      genes[index] = clamp(genes[index] + delta);
      if (genes[index] === parent.genes[index]) genes[index] = clamp(genes[index] - delta);
    }
    if(kind === "physical" && !parent) genes = [[.2,.18,.8,.15],[.45,.45,.5,.5],[.64,.6,.45,.64]][i];
    const error = genes.reduce((sum, v, j) => sum + (v - targets[kind][j]) ** 2, 0) / genes.length;
    return {genes, score:clamp(1 - Math.sqrt(error) * 1.7, .08, .99), id:`${kind}-${generation}-${i}`, parent:parent?.id ?? null};
  });
  const winner = candidates.reduce((best, candidate, i) => candidate.score > candidates[best].score ? i : best, 0);
  return {candidates, winner};
}

class ParadigmScene {
  lifetime = new AnimationLifetime();
  palette = readDiagramPalette();
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  kind: ParadigmKind;
  population: Population;
  previousPopulation?: Population;
  offspring?: Population;
  generation = 0;
  time = 0;
  frame = 0;
  last = 0;
  visible = false;
  paused = false;
  ratio = 1;
  scale = 1;
  button: HTMLButtonElement;
  caption: HTMLElement;
  lastCaption = -1;
  media = matchMedia("(prefers-reduced-motion: reduce)");
  // Unequal phases leave room for testing before selection and reproduction.
  durations = [2200, 4200, 1800, 2200, 4200];
  starts = [0, 2200, 6400, 8200, 10400, 14600];
  constructor(root: HTMLElement) {
    this.root = root; this.kind = root.dataset.kind as ParadigmKind;
    this.canvas = root.querySelector("canvas")!; this.ctx = this.canvas.getContext("2d")!;
    this.population = this.kind === "agentic" ? {candidates:[],winner:0} : nextPopulation(this.kind, undefined, 0);
    this.button = root.querySelector('[data-action="pause"]')!;
    this.caption = root.querySelector(".scene-caption")!;
    this.paused = this.media.matches;
    const { lifetime } = this, { signal } = lifetime;
    if (this.paused) this.time = this.rest;
    this.button.addEventListener("click", () => { this.paused = !this.paused; this.sync(); }, { signal });
    root.querySelector('[data-action="restart"]')!.addEventListener("click", () => {
      this.time = this.media.matches ? this.rest : 0; this.generation = 0; this.previousPopulation = undefined; this.offspring = undefined;
      this.population = this.kind === "agentic" ? {candidates:[],winner:0} : nextPopulation(this.kind, undefined, 0); this.render(); this.sync();
    }, { signal });
    this.media.addEventListener("change", () => { this.paused = this.media.matches; if (this.paused) this.time = this.rest; this.render(); this.sync(); }, { signal });
    document.addEventListener("visibilitychange", () => this.sync(), { signal });
    lifetime.observe(new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; this.sync(); })).observe(root);
    lifetime.observe(new ResizeObserver(() => this.resize())).observe(root);
    lifetime.observe(new MutationObserver(() => { this.palette = readDiagramPalette(); this.render(); })).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    lifetime.add(() => cancelAnimationFrame(this.frame));
    this.resize(); root.dataset.ready = ""; this.sync();
  }
  // Reduced motion shows a resolved population, or the finished commit graph of one agent episode.
  get rest() { return this.kind === "agentic" ? 12000 : 13700; }
  resize() {
    const box = this.canvas.getBoundingClientRect();
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
    if (this.last && now - this.last < 1000 / 30 - 1) { this.frame = requestAnimationFrame(this.tick); return; }
    if (this.last) this.time += Math.min(now - this.last, 80);
    this.last = now;
    const cycle = this.starts[5];
    if (this.time >= cycle) {
      this.time -= cycle; this.previousPopulation = this.population; this.generation++;
      if(this.kind !== "agentic") this.population = this.offspring ?? nextPopulation(this.kind, this.population, this.generation);
      this.offspring = undefined;
    }
    this.render(); this.frame = requestAnimationFrame(this.tick);
  };
  line(points: Point[], color = this.palette.muted, alpha = 1, width = .8) {
    if (!points.length || alpha <= 0) return;
    const c = this.ctx; c.save(); c.globalAlpha = alpha; c.strokeStyle = color; c.lineWidth = width;
    c.beginPath(); points.forEach((p,i) => i ? c.lineTo(p.x,p.y) : c.moveTo(p.x,p.y)); c.stroke(); c.restore();
  }
  dot(x: number, y: number, radius: number, color = this.palette.ink, alpha = 1) {
    const c = this.ctx; c.save(); c.globalAlpha = clamp(alpha); c.fillStyle = color; c.beginPath(); c.arc(x,y,radius,0,TAU); c.fill(); c.restore();
  }
  halo(x: number, y: number, radius: number, strength = .2) {
    const c = this.ctx; const gradient = c.createRadialGradient(x,y,0,x,y,radius);
    gradient.addColorStop(0,diagramAlpha(this.palette.red,strength)); gradient.addColorStop(1,diagramAlpha(this.palette.red,0));
    c.fillStyle = gradient; c.fillRect(x-radius,y-radius,radius*2,radius*2);
  }
  circle(x: number, y: number, radius: number, progress: number, color = this.palette.red, alpha = 1, width = 1) {
    const c = this.ctx; c.save(); c.globalAlpha = clamp(alpha); c.strokeStyle = color; c.lineWidth = width;
    c.beginPath(); c.arc(x,y,radius,-Math.PI/2,-Math.PI/2+TAU*clamp(progress)); c.stroke(); c.restore();
  }
  route(a: Point, b: Point, bend: number, color = this.palette.muted, alpha = .3, progress?: number) {
    const c = this.ctx;
    c.save(); c.globalAlpha = alpha; c.strokeStyle = color; c.lineWidth = .75;
    c.beginPath(); c.moveTo(a.x,a.y); c.bezierCurveTo(a.x+bend,a.y,b.x-bend,b.y,b.x,b.y); c.stroke(); c.restore();
    if (progress !== undefined) {
      const t = clamp(progress), u = 1-t;
      const x = u*u*u*a.x+3*u*u*t*(a.x+bend)+3*u*t*t*(b.x-bend)+t*t*t*b.x;
      const y = u*u*u*a.y+3*u*u*t*a.y+3*u*t*t*b.y+t*t*t*b.y;
      this.halo(x,y,10,.18); this.dot(x,y,1.6,this.palette.bright);
    }
  }
  frameBox(x: number,y: number,w: number,h: number,alpha = .6,accent = false) {
    const c = this.ctx; c.save(); c.globalAlpha = clamp(alpha);
    c.fillStyle=this.palette.fill;c.strokeStyle=accent?this.palette.red:this.palette.line;c.lineWidth=accent?1.1:.7;
    c.beginPath();c.roundRect(x,y,w,h,5);c.fill();c.stroke();c.restore();
  }
  matrix(x: number, y: number, size: number, genes: number[], alpha = 1, accent = false, scan = -1) {
    this.frameBox(x-size/2-6,y-size/2-6,size+12,size+12,alpha,accent);
    const pitch=size/4, cell=pitch*.72;
    genes.slice(0,16).forEach((g,i)=>{
      const col=i%4,row=Math.floor(i/4);const px=x-size/2+col*pitch,py=y-size/2+row*pitch;
      const c=this.ctx;c.save();c.globalAlpha=alpha*(.22+g*.78);c.fillStyle=accent&&g>.48?this.palette.red:this.palette.ink;
      if(scan>=row&&scan<row+1){c.fillStyle=this.palette.bright;c.shadowColor=this.palette.red;c.shadowBlur=5;}
      c.beginPath();c.roundRect(px,py,cell,cell,.8);c.fill();c.restore();
    });
  }
  generative(stage: number,p: number) {
    const pop=this.population,champ=pop.candidates[pop.winner];
    const parent=this.previousPopulation?.candidates[this.previousPopulation.winner];
    const tested=Math.min(2,Math.floor(p*3)),testP=(p*3)%1;
    const rows=[88,150,212], left=78, center={x:244,y:150}, right=405;
    const label=this.root.dataset.generationLabel??"";
    this.text(label.replace("{n}",String(this.generation+1)),40,50,this.palette.muted,1,10);
    this.text(this.root.dataset.retainedLabel??"",211,84,this.palette.muted,1,10);
    this.text(label.replace("{n}",String(this.generation+2)),367,50,this.palette.muted,stage===4?1:.35,10);
    pop.candidates.forEach((candidate,i)=>{
      const selected=stage>=3&&i===pop.winner,active=stage===1&&i===tested;
      const enter=smooth(p);
      const x=stage===0&&parent?mix(right,left,enter):left;
      const y=rows[i];
      const alpha=stage>=3&&!selected?.3:1;
      this.route({x:left+26,y},{x:center.x-39,y:center.y},42,selected?this.palette.red:this.palette.muted,selected?.65:.2,active?testP:undefined);
      this.matrix(x,y,34,candidate.genes,stage===0&&!parent?smooth(p*2-i*.2):alpha,false,active?testP*4:-1);
      this.text(String.fromCharCode(65+i),x-41,y+3,this.palette.muted,.8,9);
      const evaluated=stage>1||stage===1&&i<tested?1:active?smooth(testP):0;
      this.line([{x:x-22,y:y+27},{x:x+22,y:y+27}],this.palette.muted,.2,2);
      this.line([{x:x-22,y:y+27},{x:x-22+44*candidate.score*evaluated,y:y+27}],selected?this.palette.red:this.palette.ink,.85,2);
      if(selected)this.check(left+37,y,true,.9);
      if(stage===3&&selected&&p<.8){
        const t=smooth(p/.8);
        this.matrix(mix(left,center.x,t),mix(y,center.y,t),mix(34,60,t),champ.genes,Math.sin(Math.PI*t),false);
      }
    });
    // Keep the accepted parent in view while its descendants are evaluated.
    const promotion=stage===3?smooth(p/.8):stage===4?1:0;
    const accepted=parent?parent.genes.map((v,i)=>mix(v,champ.genes[i],promotion)):champ.genes;
    const acceptedAlpha=parent?1:stage>=3?promotion:.12;
    this.matrix(center.x,center.y,60,accepted,acceptedAlpha,false);
    if(parent||stage>=3)this.check(center.x,204,true,acceptedAlpha);
    if(stage===4){
      this.offspring??=nextPopulation("generative",pop,this.generation+1);
      this.offspring.candidates.forEach((child,i)=>{
        const copy=smooth((p-i*.075)/.38),mutate=smooth((p-.58-i*.035)/.2);
        const x=mix(center.x,right,copy),y=mix(center.y,rows[i],copy),size=mix(60,34,copy);
        this.route({x:center.x+39,y:center.y},{x:right-26,y:rows[i]},36,this.palette.muted,.3*copy);
        const genes=champ.genes.map((value,j)=>mix(value,child.genes[j],mutate));
        this.matrix(x,y,size,genes,copy,false);
        // Only changed weights turn red; inherited cells remain neutral.
        if(mutate>0){
          const pitch=size/4,cell=pitch*.72,c=this.ctx;
          child.genes.forEach((value,j)=>{
            if(Math.abs(value-champ.genes[j])<.00001)return;
            c.save();c.fillStyle=this.palette.red;c.globalAlpha=.85*mutate;
            c.fillRect(x-size/2+j%4*pitch,y-size/2+Math.floor(j/4)*pitch,cell,cell);c.restore();
          });
        }
        if(i===0&&copy>.95)this.check(right+36,rows[i],true,.85);
      });
    }else{
      rows.forEach(y=>this.frameBox(right-23,y-23,46,46,.12));
    }
  }
  robot(x: number, floor: number, genes: number[], phase: number, quality: number, alpha: number, selected: boolean, failed: number) {
    const c=this.ctx;const bob=Math.sin(phase*2)*mix(4,.8,quality);
    const tilt=Math.sin(phase)*(.025+Math.abs(genes[2]-.35)*.35)-failed*.75;
    const bodyY=floor-34+bob+failed*22;
    const body=(dx:number,dy:number):Point=>({x:x+dx*Math.cos(tilt)-dy*Math.sin(tilt),y:bodyY+dx*Math.sin(tilt)+dy*Math.cos(tilt)});
    const color=selected?this.palette.bright:this.palette.ink;
    c.save();c.globalAlpha=alpha;
    if(selected)this.halo(x,bodyY,35,.2);
    for(let leg=0;leg<4;leg++){
      const side=leg<2?-1:1,offset=(leg%2)*Math.PI;
      const a=phase+offset+(leg<2?Math.PI:0)+(leg%2)*(genes[3]-.8)*1.5, cycle=((a/TAU)%1+1)%1;
      const hip=body(side*17,4);
      const stride=12+genes[0]*8;
      const dx=cycle<.6?stride*(.5-cycle/.6):stride*(-.5+(cycle-.6)/.4);
      const lift=cycle<.6?0:Math.sin((cycle-.6)/.4*Math.PI)*(7+genes[1]*7)*(1-failed);
      const foot={x:x+side*18+dx*(1-failed),y:floor-lift};
      const vx=foot.x-hip.x,vy=foot.y-hip.y,dist=Math.hypot(vx,vy)||1;
      const bend=Math.sqrt(Math.max(0,22*22-dist*dist/4));
      const knee={x:(hip.x+foot.x)/2+side*bend*vy/dist,y:(hip.y+foot.y)/2-side*bend*vx/dist};
      this.line([hip,knee,foot],color,alpha*(leg%2?.85:.45),leg%2?1.2:.8);
      this.dot(knee.x,knee.y,1.3,color,alpha*.6);
    }
    const vertices=[[-24,-5],[-19,-9],[19,-9],[24,-5],[24,5],[19,9],[-19,9],[-24,5]].map(([a,b])=>body(a,b));
    c.fillStyle=selected?this.palette.soft:this.palette.fill;c.strokeStyle=color;c.lineWidth=1;
    c.beginPath();vertices.forEach((v,i)=>i?c.lineTo(v.x,v.y):c.moveTo(v.x,v.y));c.closePath();c.fill();c.stroke();
    const sensor=body(15,-2);this.dot(sensor.x,sensor.y,1.8,selected?this.palette.bright:this.palette.muted,.8);
    c.restore();
  }
  policy(x:number,y:number,genes:number[],alpha=1,changed:number[] = [],accent=false) {
    this.frameBox(x-24,y-25,48,50,alpha,accent);
    genes.forEach((value,i)=>{
      const row=y-16+i*11,edited=changed.includes(i);
      this.line([{x:x-15,y:row},{x:x+15,y:row}],this.palette.muted,.2*alpha,1.3);
      this.line([{x:x-15,y:row},{x:x-15+value*30,y:row}],edited?this.palette.red:this.palette.ink,.75*alpha,2);
      this.dot(x-15+value*30,row,2,edited?this.palette.red:this.palette.ink,alpha);
    });
  }
  physical(stage: number,p: number) {
    const pop=this.population,champ=pop.candidates[pop.winner];
    const rows=[82,150,218],left=45,right=411,center={x:244,y:150};
    const label=this.root.dataset.generationLabel??"";
    this.text(label.replace("{n}",String(this.generation+1)),20,46,this.palette.muted,1,10);
    this.text(label.replace("{n}",String(this.generation+2)),363,46,this.palette.muted,stage===4?1:.35,10);
    const run=stage===0?0:stage===1?smooth(p):1;
    const trialAlpha=stage<3?1:stage===3?1-smooth(p/.4):0;
    pop.candidates.forEach((candidate,i)=>{
      const floor=rows[i]+24,winner=i===pop.winner,selected=stage>=3&&winner;
      const enter=smooth(p),xPolicy=stage===0&&this.generation>0?mix(right,left,enter):left;
      const alpha=stage>=3&&!winner?.3:1;
      this.policy(xPolicy,rows[i],candidate.genes,alpha,[],selected);
      this.text(String.fromCharCode(65+i),xPolicy-4,rows[i]+40,this.palette.muted,alpha*.8,9);
      if(trialAlpha>0){
        this.line([{x:87,y:floor},{x:335,y:floor}],this.palette.muted,.35*trialAlpha,.8);
        this.line([{x:327,y:floor-45},{x:327,y:floor}],this.palette.muted,.3*trialAlpha,.8);
        const failed=candidate.score<.55?smooth((run-.4)/.25):0;
        const distance=90+candidate.score*110;
        const x=115+distance*(candidate.score<.55?Math.min(run,.52):run);
        this.route({x:left+24,y:rows[i]},{x:x-27,y:floor-25},20,this.palette.muted,.25*trialAlpha,stage===0?p:undefined);
        for(let step=0;step<7;step++){
          const footX=116+step*27;
          if(footX<x-24)this.line([{x:footX,y:floor-1},{x:footX+4,y:floor-1}],this.palette.muted,.25*trialAlpha,2);
        }
        this.robot(x,floor,candidate.genes,run*TAU*(2+candidate.genes[0]*2),candidate.score,trialAlpha,false,failed);
        if(stage>=2){
          this.line([{x:100,y:floor+8},{x:100+candidate.score*220,y:floor+8}],winner?this.palette.red:this.palette.muted,.6*trialAlpha,2);
          if(failed>.5)this.check(341,rows[i],false,trialAlpha*.6);
        }
      }
      if(stage>=3){
        this.route({x:left+24,y:rows[i]},{x:center.x-24,y:center.y},45,selected?this.palette.red:this.palette.muted,selected?.65:.15);
        if(selected)this.check(left+36,rows[i],true,.9);
        if(selected&&stage===3&&p<.8){
          const t=smooth((p-.1)/.7);
          this.policy(mix(left,center.x,t),mix(rows[i],center.y,t),champ.genes,Math.sin(Math.PI*t));
        }
      }
    });
    if(stage>=3){
      const reveal=stage===3?smooth((p-.35)/.45):1;
      this.text(this.root.dataset.retainedLabel??"",205,108,this.palette.muted,reveal,10);
      this.policy(center.x,center.y,champ.genes,reveal);
      this.check(center.x,188,true,reveal);
      // The retained controller still drives the same body, not a new robot design.
      this.line([{x:206,y:249},{x:282,y:249}],this.palette.muted,.3*reveal,.8);
      this.robot(244,249,champ.genes,.4,champ.score,.6*reveal,false,0);
    }
    if(stage===4){
      this.offspring??=nextPopulation("physical",pop,this.generation+1);
      this.offspring.candidates.forEach((child,i)=>{
        const copy=smooth((p-i*.07)/.4),mutation=smooth((p-.6-i*.025)/.18);
        const genes=champ.genes.map((value,j)=>mix(value,child.genes[j],mutation));
        const changed=mutation>0?child.genes.flatMap((value,j)=>value!==champ.genes[j]?[j]:[]):[];
        this.route({x:center.x+24,y:center.y},{x:right-24,y:rows[i]},40,this.palette.muted,.3*copy);
        this.policy(mix(center.x,right,copy),mix(center.y,rows[i],copy),genes,copy,changed);
        if(i===0&&copy>.95)this.check(right+36,rows[i],true,.85);
      });
    }else rows.forEach(y=>this.frameBox(right-24,y-25,48,50,.1));
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
    if(filled){const g=c.createLinearGradient(x,y-30,x,y+20);g.addColorStop(0,this.palette.soft);g.addColorStop(1,this.palette.fill);c.fillStyle=g;c.fill();}c.stroke();c.restore();
  }
  science(stage: number,p: number) {
    const pop=this.population,champ=pop.candidates[pop.winner];
    // The centre shares the middle row's height so both middle routes are straight.
    const rows=[86,150,214],left=24,right=365,center={x:166,y:150},length=136;
    const label=this.root.dataset.generationLabel??"";
    this.text(label.replace("{n}",String(this.generation+1)),24,48,this.palette.muted,1,10);
    this.text(label.replace("{n}",String(this.generation+2)),365,48,this.palette.muted,stage===4?1:.35,10);
    const tested=stage===0?0:stage===1?Math.min(2,Math.floor(p*3)):2;
    const testP=stage===1?(p*3)%1:0;
    const selected=stage>=3;
    const previous=pop.candidates[Math.max(0,tested-1)];
    const testedGenes=stage===1?previous.genes.map((v,i)=>mix(v,pop.candidates[tested].genes[i],smooth(testP/.25))):pop.candidates[tested].genes;
    const shape=stage===3?pop.candidates[2].genes.map((v,i)=>mix(v,champ.genes[i],smooth(p/.8))):stage===4?champ.genes:testedGenes;
    // Identical analytic inflow traces illustrate testing, not CFD or measured lift.
    this.frameBox(144,73,190,148,.5);
    for(let lane=0;lane<10;lane++){
      const base=83+lane*14.3;
      const points=Array.from({length:51},(_,j)=>{
        const x=152+j*3.48;
        const displacement=Math.exp(-(((x-228)/48)**2))*(base<150?-1:1)*(6+shape[1]*8)*(1-Math.abs(base-150)/90);
        return {x,y:base+displacement};
      });
      this.line(points,this.palette.muted,.24,.65);
      if(stage===1||stage===2)for(let packet=0;packet<2;packet++){
        const u=(this.time/2000+lane*.13+packet/2)%1,at=points[Math.floor(u*50)];
        this.dot(at.x,at.y,1,this.palette.ink,.55*Math.sin(Math.PI*u));
      }
    }
    pop.candidates.forEach((candidate,i)=>{
      const winner=i===pop.winner,active=stage===1&&tested===i;
      const enter=smooth(p),x=stage===0&&this.generation>0?mix(right,left,enter):left;
      const alpha=selected&&!winner?.3:stage===0&&this.generation===0?smooth(p*2-i*.2):1;
      this.text(String.fromCharCode(65+i),x,rows[i]-18,this.palette.muted,alpha*.8,9);
      this.drawFoil(candidate.genes,x,rows[i],92,selected&&winner?this.palette.red:this.palette.ink,alpha);
      this.route({x:left+95,y:rows[i]},{x:center.x,y:center.y},20,selected&&winner||active?this.palette.red:this.palette.muted,selected&&winner||active?.65:.2,active?testP:undefined);
      const evaluated=stage>1||stage===1&&i<tested?1:active?smooth(testP):0;
      this.line([{x:x+4,y:rows[i]+16},{x:x+88,y:rows[i]+16}],this.palette.muted,.2,2);
      this.line([{x:x+4,y:rows[i]+16},{x:x+4+84*candidate.score*evaluated,y:rows[i]+16}],selected&&winner?this.palette.red:this.palette.ink,.7,2);
      if(selected&&winner)this.check(left+102,rows[i],true,.9);
    });
    this.drawFoil(shape,center.x,center.y,length,selected?this.palette.red:this.palette.ink,1);
    if(selected){
      this.ctx.save();this.ctx.textAlign="center";
      this.text(this.root.dataset.retainedLabel??"",239,65,this.palette.muted,stage===3?smooth(p):1,10);
      this.ctx.restore();this.check(239,235,true,stage===3?smooth(p):1);
    }
    if(stage===4){
      this.offspring??=nextPopulation("science",pop,this.generation+1);
      this.offspring.candidates.forEach((child,i)=>{
        const copy=smooth((p-i*.075)/.4),mutation=smooth((p-.6-i*.025)/.18);
        const x=mix(center.x,right,copy),y=mix(center.y,rows[i],copy),size=mix(length,92,copy);
        this.route({x:center.x+length+4,y:center.y},{x:right-4,y:rows[i]},22,this.palette.muted,.3*copy);
        const genes=champ.genes.map((v,j)=>mix(v,child.genes[j],mutation));
        this.drawFoil(genes,x,y,size,this.palette.ink,copy);
        if(i>0&&mutation>0){
          const parentPoints=this.foil(champ.genes,x,y,size),childPoints=this.foil(genes,x,y,size);
          // Keep the parent's full outline in grey; mark only displaced contour segments red.
          this.ctx.save();this.ctx.setLineDash([2,2]);
          this.drawFoil(champ.genes,x,y,size,this.palette.muted,.55*copy,false);this.ctx.restore();
          for(let j=1;j<childPoints.length;j++){
            if(Math.hypot(childPoints[j].x-parentPoints[j].x,childPoints[j].y-parentPoints[j].y)>.05)
              this.line([childPoints[j-1],childPoints[j]],this.palette.red,copy*mutation,1.1);
          }
        }
        if(i===0&&copy>.95)this.check(453,rows[i]+19,true,.85);
      });
    }else rows.forEach(y=>this.drawFoil(champ.genes,right,y,92,this.palette.muted,.12,false));
  }
  text(value:string,x:number,y:number,color=this.palette.ink,alpha=1,size=10) {
    const c=this.ctx;c.save();c.globalAlpha=alpha;c.fillStyle=color;c.font=`${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;c.fillText(value,x,y);c.restore();
  }
  check(x:number,y:number,success:boolean,alpha=1) {
    if(success)this.line([{x:x-3,y},{x:x-1,y:y+2},{x:x+4,y:y-4}],this.palette.ink,alpha,1.2);
    else {this.line([{x:x-3,y:y-3},{x:x+3,y:y+3}],this.palette.red,alpha,1.1);this.line([{x:x-3,y:y+3},{x:x+3,y:y-3}],this.palette.red,alpha,1.1);}
  }
  // Recursive agents as a 3D git graph: floors are recursion depths, time runs left to right. Lines
  // grow with time; nodes appear only once their moment arrives. Returns the caption index.
  agentic():number {
    const c=this.ctx,P=this.palette,T=this.time,e=this.generation,d=this.root.dataset;
    const u=T/AGENT_SPAN,F=1-smooth((T-14000)/500);
    const pt=(t:number,y:number,z=0):Point=>({x:52+t*372+z*RECEDE.x,y:y+z*RECEDE.y});
    const lane=(a:Agent,t:number)=>pt(t,LEVELS[a.level],a.z);
    const arrive=(t:number)=>u<t?0:smooth((u-t)/.02);
    const label=(s:string,x:number,y:number,color:string,alpha:number,align:CanvasTextAlign="left",size=8,mono=true)=>{
      if(alpha<=.01)return;
      c.save();c.globalAlpha=alpha;c.fillStyle=color;c.textAlign=align;
      c.font=mono?`${size}px ui-monospace, SFMono-Regular, Consolas, monospace`:`${size}px "Instrument Sans", ui-sans-serif, system-ui, sans-serif`;
      c.fillText(s,x,y);c.restore();
    };
    const stroke=(pts:Point[],color:string,alpha:number,width=.8,dash?:number[])=>{
      // Dashes are anchored to the canvas, so they stay still while a line grows or is swept.
      if(alpha<=.01)return;c.save();if(dash){c.setLineDash(dash);c.lineDashOffset=pts[0].x;}this.line(pts,color,alpha,width);c.restore();
    };
    // Dispatch and merge share one hand-off: a dashed guide grows from a to b behind a red dot,
    // the target node appears as the dot arrives, then the guide fades away.
    const HAND=.03,FADE=.04;
    const guide=(a:Point,b:Point,t0:number)=>{
      if(u<t0||u>t0+HAND+FADE)return;
      const k=smooth((u-t0)/HAND),tip={x:mix(a.x,b.x,k),y:mix(a.y,b.y,k)};
      stroke([a,tip],P.muted,.75*F*(1-smooth((u-t0-HAND)/FADE)),.8,[2,2.5]);
      if(k<1){this.halo(tip.x,tip.y,7,.2*F);this.dot(tip.x,tip.y,2.2,P.red,F);}
    };
    const nodes:(()=>void)[]=[];
    // Every node is a commit: filled on main, hollow on agent branches.
    // Final commits and merges are full size; earlier commits on a branch are smaller and unlabelled.
    const commitNode=(p:Point,color:string,t:number,r=3,alpha=1)=>nodes.push(()=>{
      const g=arrive(t);if(g<=0||alpha<=.01)return;
      this.halo(p.x,p.y,r*3.3,.25*Math.sin(Math.PI*clamp((u-t)/.05))*F*alpha);
      c.save();c.globalAlpha=F*alpha;c.fillStyle=P.fill;c.strokeStyle=color;c.lineWidth=r<3?.9:1.1;
      c.beginPath();c.arc(p.x,p.y,r*mix(1.7,1,g),0,TAU);c.fill();c.stroke();c.restore();
    });
    const poly=(q:Point[])=>{c.beginPath();q.forEach((p,j)=>j?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();};
    // Floors: one translucent plane per recursion depth, laid down only as far as the present.
    const floorNames=[d.level0,d.level1,d.level2],reach=clamp(u,0,1);
    LEVELS.forEach((y,i)=>{
      const q=[pt(-.02,y,-FLOOR_Z),pt(reach,y,-FLOOR_Z),pt(reach,y,FLOOR_Z),pt(-.02,y,FLOOR_Z)];
      const glass=c.createLinearGradient(0,q[2].y,0,q[0].y);
      glass.addColorStop(0,diagramAlpha(P.fill,.85));glass.addColorStop(1,diagramAlpha(P.fill,.4));
      c.save();c.globalAlpha=F;c.fillStyle=glass;c.strokeStyle=P.line;c.lineWidth=.8;poly(q);c.fill();c.stroke();c.restore();
    });
    // The present is one vertical time plane through every floor; nothing exists to its right yet.
    const present=F*(1-smooth((u-.96)/.04));
    if(present>.01){
      // It spans the floors only; on main the present is a tick, keeping the sheet clear of the controls.
      const top=LEVELS[0],bottom=LEVELS[2];
      const sheet=[pt(reach,top,-FLOOR_Z),pt(reach,top,FLOOR_Z),pt(reach,bottom,FLOOR_Z),pt(reach,bottom,-FLOOR_Z)];
      const shade=c.createLinearGradient(sheet[0].x,0,sheet[1].x,0);
      shade.addColorStop(0,diagramAlpha(P.ink,.06));shade.addColorStop(1,diagramAlpha(P.ink,.015));
      c.save();c.globalAlpha=present;c.fillStyle=shade;poly(sheet);c.fill();c.restore();
      stroke([sheet[3],sheet[0]],P.muted,.45*present,.8);
      stroke([sheet[0],sheet[1],sheet[2]],P.muted,.2*present,.8);
      LEVELS.forEach(y=>stroke([pt(reach,y,-FLOOR_Z),pt(reach,y,FLOOR_Z)],P.muted,.5*present,.8));
      stroke([pt(reach,MAIN_Y-6),pt(reach,MAIN_Y+6)],P.muted,.6*present,.8);
    }
    LEVELS.forEach((y,i)=>{const at=pt(-.02,y,-FLOOR_Z);label(floorNames[i]??"",at.x,at.y+11,P.muted,1,"left",9,false);});
    // A branch runs through nodes at the given times. Between nodes it is dashed (red while the agent
    // works, muted while it waits) until the next node lands: that stretch then sweeps solid from left
    // to right, and the node appears as the sweep arrives.
    const SWEEP=.03;
    const branch=(at:(t:number)=>Point,stops:number[],live:(t:number)=>boolean,breaks:number[]=[],fossil=0)=>{
      c.save();c.lineCap="butt";
      for(let k=1;k<stops.length;k++){
        const s0=stops[k-1],s1=stops[k];if(u<=s0)break;
        const tip=Math.min(u,mix(s0,s1,smooth((u-s1+SWEEP)/SWEEP)));
        if(tip>s0){stroke([at(s0),at(tip)],P.ink,.8*F*(1-fossil),1.2);stroke([at(s0),at(tip)],P.muted,.8*F*fossil,1.2);}
        const cuts=[tip,...breaks.filter(b=>b>tip&&b<s1),s1];
        for(let j=1;j<cuts.length&&u>cuts[j-1];j++){
          const on=live(cuts[j-1]);
          stroke([at(cuts[j-1]),at(Math.min(u,cuts[j]))],on?P.red:P.muted,(on?.8:.55)*F,on?1.2:.8,[2,2.5]);
        }
      }
      c.restore();
    };
    // Text that starts at a lane is revealed by the time plane as it passes.
    const reveal=(z:number,draw:()=>void)=>{c.save();c.beginPath();c.rect(0,0,pt(u,0,z).x,280);c.clip();draw();c.restore();};
    // Main history: the previous episode's merge is this episode's base commit. Main is always drawn in
    // full; only the present tick on it moves with the time plane.
    stroke([pt(-.02,MAIN_Y),pt(1,MAIN_Y)],P.muted,.55,1);
    label("main",pt(-.02,MAIN_Y).x-4,MAIN_Y+3,P.ink,.8,"right",9);
    // The base sits right above the root's first node, the same commit. At the end of the episode the
    // new commit slides back to become the next episode's base.
    const agents=agentEpisode(e),baseAt=pt(agents[0].spawn+HAND,MAIN_Y),slide=smooth((T-14000)/600);
    this.dot(baseAt.x,baseAt.y,3.4,P.ink,1-slide);label(commitId(`${e-1}-0`),baseAt.x,MAIN_Y-8,P.muted,1-slide,"center");
    agents.forEach((a,i)=>{
      if(u<a.spawn)return;
      const parent=a.parent<0?null:agents[a.parent],start=a.spawn+HAND,head=lane(a,start);
      const fork=parent?lane(parent,a.spawn):baseAt;
      guide(fork,head,a.spawn);
      if(u<start)return;
      // A rejected branch stops at its ×, then fades into a muted fossil that stays in the history.
      const fossil=a.rejected?smooth((u-a.commit-.05)/FADE):0;
      reveal(a.z,()=>label(a.name,head.x+4,head.y-4,P.ink,.75*F*(1-.5*fossil)));
      const stops=[start,...(a.dispatch===null?[]:[a.dispatch]),...a.commits,a.commit].sort((p,q)=>p-q);
      const live=(t:number)=>a.dispatch===null||t<a.dispatch||a.work.some(([w0,w1])=>t>=w0&&t<w1);
      branch(t=>lane(a,t),stops,live,a.work.flat(),fossil);
      commitNode(head,P.ink,start,2.2,1-fossil);commitNode(head,P.muted,start,2.2,fossil);
      if(a.dispatch!==null)commitNode(lane(a,a.dispatch),P.ink,a.dispatch,2.2);
      a.commits.forEach(t=>{const at=lane(a,t);commitNode(at,P.ink,t,2.2,1-fossil);commitNode(at,P.muted,t,2.2,fossil);});
      if(u<a.commit)return;
      const at=lane(a,a.commit),id=commitId(`${e}-${i}`),g=arrive(a.commit);
      if(a.rejected){
        nodes.push(()=>[[P.red,1-fossil],[P.muted,fossil]].forEach(([color,k])=>{
          const alpha=+k*F*g;if(alpha<=.01)return;
          c.save();c.globalAlpha=alpha;c.fillStyle=P.fill;c.strokeStyle=color as string;c.lineWidth=1.1;
          c.beginPath();c.arc(at.x,at.y,3*mix(1.7,1,g),0,TAU);c.fill();c.stroke();c.restore();
          label(id,at.x-5,at.y-4,color as string,.85*alpha,"right");
          stroke([{x:at.x-40,y:at.y-6.5},{x:at.x-5,y:at.y-6.5}],color as string,.85*alpha,.8);
          stroke([{x:at.x+6,y:at.y-2.5},{x:at.x+11,y:at.y+2.5}],color as string,alpha,1);
          stroke([{x:at.x+6,y:at.y+2.5},{x:at.x+11,y:at.y-2.5}],color as string,alpha,1);
        }));
        return;
      }
      commitNode(at,P.ink,a.commit);
      label(id,at.x-5,at.y-4,P.ink,.75*F*g,"right");
      // Surviving subagents hand their commits up together, arriving as the parent's own sweep reaches its
      // merge commit.
      // Main does not get a new commit: its ref rises straight up to the root's merge commit.
      if(!parent){guide(at,pt(a.commit,MAIN_Y),MAIN_MERGE-HAND);return;}
      guide(at,lane(parent,parent.commit),parent.commit-HAND);
    });
    nodes.forEach(draw=>draw());
    // Main fast-forwards to the root's merge commit, drawn at that commit's time with its id.
    const g=arrive(MAIN_MERGE);
    if(g>0){
      const end=pt(agents[0].commit,MAIN_Y),at={x:mix(end.x,baseAt.x,slide),y:MAIN_Y},id=commitId(`${e}-0`);
      this.halo(at.x,at.y,11,.25*Math.sin(Math.PI*clamp((u-MAIN_MERGE)/.05)));
      this.dot(at.x,at.y,3.4*mix(1.7,1,g),P.ink,1);
      // Left of the node, clear of the playback controls; centred above it once it is the base.
      c.font="8px ui-monospace, SFMono-Regular, Consolas, monospace";
      const w=c.measureText(id).width,lx=mix(end.x-6-w/2,baseAt.x,slide),ly=mix(MAIN_Y-6,MAIN_Y-8,slide);
      label(id,lx,ly,P.ink,.75*g*(1-slide),"center");label(id,lx,ly,P.muted,slide,"center");
    }
    const dispatched=Math.max(...agents.map(a=>a.dispatch??0))+HAND;
    return u<agents[0].dispatch!?0:u<dispatched?1:u<agents[0].commit?2:3;
  }
  render() {
    if(!this.scale)return;
    const c=this.ctx;
    c.setTransform(this.ratio*this.scale,0,0,this.ratio*this.scale,0,0);
    c.clearRect(0,0,480,280);c.lineCap="round";c.lineJoin="round";
    const stage=Math.min(4,this.starts.findIndex((v,i)=>i>0&&this.time<v)-1);
    const current=Math.max(0,stage),p=clamp((this.time-this.starts[current])/this.durations[current]);
    if(this.root.dataset.phase!==String(current))this.root.dataset.phase=String(current);
    if(this.root.dataset.generation!==String(this.generation))this.root.dataset.generation=String(this.generation);
    let caption=current===4?3:current===0?0:current<3?1:2;
    if(this.kind==="agentic")caption=this.agentic();
    else{
      // Keep the stage neutral; local halos identify active candidates only.
      for(let i=0;i<22;i++)this.dot(20+i*21,42,.55,this.palette.muted,.2);
      if(this.kind==="generative")this.generative(current,p);
      else if(this.kind==="physical")this.physical(current,p);
      else this.science(current,p);
    }
    if(caption!==this.lastCaption){
      this.caption.textContent=this.root.dataset[`caption${caption}`]??"";
      this.lastCaption=caption;
    }
  }
}
export function mountParadigmScenes() {
  document.querySelectorAll<HTMLElement>(".paradigm-scene:not([data-ready])").forEach(root=>new ParadigmScene(root));
}
