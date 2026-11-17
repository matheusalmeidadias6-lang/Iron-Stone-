"""Gera os wireframes (SVG) da loja IRON STONE. Cinza = estrutura; vermelho = ação principal."""
def esc(s): return s.replace("&","&amp;").replace("<","&lt;")
class S:
    def __init__(s,w,h): s.w,s.h,s.o=w,h,[]
    def r(s,x,y,w,h,f="#fff",st="#555",sw=1.5,dash=False): s.o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{f}" stroke="{st}" stroke-width="{sw}"{" stroke-dasharray=\"5 4\"" if dash else ""}/>')
    def t(s,x,y,txt,sz=12,b=False,c="#222",a="start"): s.o.append(f'<text x="{x}" y="{y}" font-size="{sz}" font-weight="{700 if b else 400}" fill="{c}" text-anchor="{a}" font-family="Arial,Helvetica,sans-serif">{esc(txt)}</text>')
    def photo(s,x,y,w,h,lab="FOTO"):
        s.r(x,y,w,h,"#E4E4E4","#888"); s.o.append(f'<path d="M{x} {y}L{x+w} {y+h}M{x+w} {y}L{x} {y+h}" stroke="#B5B5B5" stroke-width="1"/>'); s.t(x+w/2,y+h/2+4,lab,11,False,"#666","middle")
    def bars(s,x,y,w,n,gap=9,c="#C8C8C8"):
        for i in range(n): s.o.append(f'<rect x="{x}" y="{y+i*gap}" width="{w*(0.6 if i==n-1 and n>1 else 1)}" height="4" fill="{c}"/>')
    def btn(s,x,y,w,h,lab,main=False): s.r(x,y,w,h,"#A63C32" if main else "#fff","#A63C32" if main else "#555"); s.t(x+w/2,y+h/2+4,lab,10,True,"#fff" if main else "#222","middle")
    def note(s,x,y,n,txt):
        s.o.append(f'<circle cx="{x}" cy="{y}" r="11" fill="#222"/>'); s.t(x,y+4,str(n),11,True,"#fff","middle")
        for i,l in enumerate(txt.split("|")): s.t(x+20,y+4+i*15,l,11,False,"#333")
    def svg(s): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{s.w}" height="{s.h}" viewBox="0 0 {s.w} {s.h}"><rect width="{s.w}" height="{s.h}" fill="#fff"/>'+"".join(s.o)+'</svg>'

# ================= DESKTOP =================
d=S(1260,2400); X=20; W=860
d.t(X,16,"WIREFRAME DESKTOP (1280 px) — IRON STONE",13,True)
y=30
d.r(X,y,W,24,"#222","#222"); d.t(X+W/2,y+16,"FRETE GRÁTIS NAS COMPRAS ACIMA DE R$ 199",10,True,"#fff","middle"); d.note(920,y+12,1,"Faixa de anúncio")
y=54; d.r(X,y,W,52,"#F5F4F0"); d.t(X+14,y+31,"IRON STONE",15,True)
for i,n in enumerate(["Início","Produtos","Camisetas","Moletons","Calças","Acessórios","Novidades","Contato"]): d.t(X+150+i*68,y+31,n,9.5)
d.t(X+700,y+31,"🔍",12); d.r(X+722,y+17,18,18); d.t(X+731,y+30,"0",8,True,"#222","middle"); d.r(X+752,y+14,60,24); d.t(X+782,y+30,"Acessib.",8,False,"#222","middle"); d.r(X+816,y+14,38,24); d.t(X+835,y+30,"Entrar",8,False,"#222","middle")
d.note(920,y+26,2,"Cabeçalho fixo (sticky): logo, menu por categoria,|pesquisa, sacola com contador, acessibilidade, login")
y=106; d.r(X,y,W,300,"#2B2B2B","#222"); d.r(X+24,y+70,310,18,"#555","#555"); d.r(X+24,y+96,250,18,"#555","#555"); d.r(X+24,y+130,290,4,"#777","#777"); d.r(X+24,y+140,230,4,"#777","#777"); d.btn(X+24,y+170,150,34,"EXPLORAR COLEÇÃO",True); d.photo(X+440,y+20,396,260,"FOTO HERO (modelo / ambiente urbano)")
d.note(920,y+60,3,"Hero: título, slogan, botão principal|e foto grande (hero.jpg)")
y=424; d.t(X,y,"CATEGORIAS",14,True)
for i,c in enumerate(["Camisetas","Moletons","Calças","Bermudas","Jaquetas","Acessórios"]): x=X+i*146; d.photo(x,y+12,134,160,"FOTO"); d.t(x+2,y+192,c.upper(),9.5,True); d.t(x+132,y+192,"→",11,True,"#222","end")
d.note(920,y+90,4,"6 cartões de categoria. Clique filtra|a coleção e rola até ela")
y=640; d.t(X,y,"DESTAQUES DA SEMANA",14,True); d.r(X,y+10,W,250); d.photo(X+14,y+24,260,222,"FOTO PRODUTO"); d.t(X+300,y+70,"NOME DO PRODUTO",18,True); d.t(X+300,y+92,"Categoria",11); d.t(X+300,y+114,"R$ 000,00",12,True); d.btn(X+300,y+130,90,30,"COMPRAR",True)
d.r(X+300,y+218,28,26); d.t(X+314,y+236,"‹",14,True,"#222","middle"); d.r(X+334,y+218,60,26); d.t(X+364,y+235,"Pausar",9,False,"#222","middle"); d.r(X+400,y+218,28,26); d.t(X+414,y+236,"›",14,True,"#222","middle"); d.t(X+440,y+236,"Slide 1 de 3",9)
for i in range(3): d.o.append(f'<circle cx="{X+780+i*22}" cy="{y+231}" r="8" fill="{"#A63C32" if i==0 else "#fff"}" stroke="#555" stroke-width="1.5"/>')
d.note(920,y+110,5,"Carrossel: setas, pausar, indicadores|clicáveis e contador de posição")
y=930; d.t(X,y,"COLEÇÃO",14,True); d.r(X,y+10,360,30,"#fff"); d.t(X+10,y+30,"Buscar produto...",10,False,"#777")
for i,c in enumerate(["Todas","Camisetas","Moletons","Calças","Bermudas","Jaquetas","Acessórios"]): d.r(X+i*80,y+50,74,26,"#222" if i==0 else "#fff"); d.t(X+i*80+37,y+67,c,8.5,False,"#fff" if i==0 else "#222","middle")
d.r(X,y+86,130,28); d.t(X+8,y+104,"Preço ▾",9.5); d.r(X+140,y+86,150,28); d.t(X+148,y+104,"Ordenar por ▾",9.5); d.r(X+304,y+90,16,16); d.t(X+326,y+103,"Novidades",9.5); d.r(X+400,y+90,16,16); d.t(X+422,y+103,"Mais vendidos",9.5); d.t(X+540,y+103,"Limpar filtros",9.5,False,"#A63C32")
d.t(X,y+134,"12 produto(s) encontrado(s).",10,False,"#444")
d.note(920,y+60,6,"Filtros: busca, categoria, preço, novidades,|mais vendidos e ordenação. A grade muda de verdade")
gy=y+148
for r_ in range(3):
    for c_ in range(4):
        x=X+c_*218; yy=gy+r_*212; d.photo(x,yy,206,150,"FOTO"); 
        if (r_+c_)%3==0: d.r(x+6,yy+6,44,16,"#A63C32","#A63C32"); d.t(x+28,yy+18,"NOVO",8,True,"#fff","middle")
        d.t(x,yy+166,"NOME DO PRODUTO",10,True); d.t(x,yy+180,"Categoria · R$ 000,00",9,False,"#555"); d.r(x,yy+186,100,18); d.t(x+50,yy+199,"Ver",8.5,False,"#222","middle"); d.r(x+106,yy+186,100,18); d.t(x+156,yy+199,"Adicionar",8.5,False,"#222","middle")
d.note(920,gy+300,7,"Cartão de produto: foto 4:5, etiqueta,|nome, categoria, preço (e promoção),|botões Ver e Adicionar à sacola")
y=gy+3*212+20; d.t(X,y,"COMPRE SEM ATRITO",14,True)
for i,(a,b) in enumerate([("Frete grátis","Acima de R$ 199"),("Pix ou cartão","Pague como preferir"),("Troca em 30 dias","Peça a troca em até 30 dias")]): x=X+i*292; d.o.append(f'<rect x="{x}" y="{y+12}" width="276" height="4" fill="#A63C32"/>'); d.t(x,y+40,a,12,True); d.t(x,y+58,b,10,False,"#555")
d.note(920,y+40,8,"Benefícios (3 informações)")
y+=90; d.photo(X,y,400,200,"FOTO SOBRE (concreto / urbano)"); d.t(X+440,y+30,"SOBRE A IRON STONE",14,True); d.bars(X+440,y+50,380,5,10); d.note(920,y+60,9,"Institucional: foto + texto curto")
y+=240; d.t(X,y,"FALE COM A GENTE",14,True)
for i,l in enumerate(["Nome","E-mail","Assunto","Mensagem"]): yy=y+14+i*46 if i<3 else y+152; d.t(X,yy+10,l.upper(),8.5,True); d.r(X,yy+14,380,26 if i<3 else 50)
d.btn(X,y+226,380,32,"ENVIAR MENSAGEM",True); d.note(920,y+110,10,"Contato: 4 campos, validação com mensagens|de erro e foco no primeiro campo inválido")
y+=280; d.r(X,y,W,120,"#222","#222")
for i,(a,b) in enumerate([("IRON STONE","Streetwear masculino"),("Navegação","Início · Produtos · Sobre"),("Categorias","6 categorias"),("Contato","e-mail · redes (em breve)")]): d.t(X+20+i*210,y+30,a,11,True,"#fff"); d.t(X+20+i*210,y+48,b,9,False,"#ccc")
d.t(X+20,y+104,"© 2026 IRON STONE · Créditos das imagens: assets/CREDITS.md",9,False,"#bbb"); d.note(920,y+60,11,"Rodapé completo")
d.h=y+140; open("wireframe-desktop.svg","w").write(d.svg().replace(f'height="2400" viewBox="0 0 1260 2400"',f'height="{d.h}" viewBox="0 0 1260 {d.h}"'))

# ================= MOBILE =================
m=S(1240,2300); m.t(20,16,"WIREFRAME CELULAR (375 px) — IRON STONE",13,True)
def hdr(s,x,y,open_=False):
    s.r(x,y,375,22,"#222","#222"); s.t(x+187,y+15,"FRETE GRÁTIS ACIMA DE R$ 199",8.5,True,"#fff","middle")
    s.r(x,y+22,375,48,"#F5F4F0"); s.t(x+14,y+52,"☰",16,True); s.t(x+60,y+52,"IRON STONE",13,True); s.r(x+232,y+34,24,24); s.t(x+268,y+52,"🛍",11); s.r(x+290,y+38,70,18); s.t(x+325,y+51,"Entrar · A11y",7.5,False,"#222","middle")
x0=20; y=30; hdr(m,x0,y)
y+=70; m.r(x0,y,375,430,"#2B2B2B","#222"); m.r(x0+16,y+24,240,16,"#555","#555"); m.r(x0+16,y+46,200,16,"#555","#555"); m.r(x0+16,y+76,300,4,"#777","#777"); m.r(x0+16,y+86,220,4,"#777","#777"); m.btn(x0+16,y+110,160,34,"EXPLORAR COLEÇÃO",True); m.photo(x0+16,y+164,343,250,"FOTO HERO")
y+=450; m.t(x0+16,y+10,"CATEGORIAS",13,True)
for i,c in enumerate(["Camisetas","Moletons","Calças","Bermudas","Jaquetas","Acessórios"]): xx=x0+16+(i%2)*176; yy=y+24+(i//2)*190; m.photo(xx,yy,167,150,"FOTO"); m.t(xx,yy+168,c.upper(),9.5,True)
y+=24+3*190+10; m.t(x0+16,y+10,"DESTAQUES DA SEMANA",13,True); m.r(x0+10,y+20,355,330); m.photo(x0+20,y+30,335,200,"FOTO PRODUTO"); m.t(x0+24,y+256,"NOME DO PRODUTO",14,True); m.t(x0+24,y+274,"R$ 000,00",11,True); m.btn(x0+24,y+284,90,28,"COMPRAR",True)
for i,l in enumerate(["‹","Pausar","›"]): m.r(x0+130+i*50,y+286,44,24); m.t(x0+152+i*50,y+302,l,9,False,"#222","middle")
y+=370; m.t(x0+16,y+10,"COLEÇÃO",13,True); m.r(x0+16,y+22,343,30); m.t(x0+26,y+42,"Buscar produto...",10,False,"#777")
for i,c in enumerate(["Todas","Camis.","Mol.","Calças"]): m.r(x0+16+i*62,y+60,56,24,"#222" if i==0 else "#fff"); m.t(x0+44+i*62,y+76,c,8,False,"#fff" if i==0 else "#222","middle")
m.r(x0+16,y+92,160,28); m.t(x0+24,y+110,"Preço ▾",9); m.r(x0+184,y+92,175,28); m.t(x0+192,y+110,"Ordenar ▾",9)
gy=y+136
for r_ in range(3):
    for c_ in range(2):
        xx=x0+16+c_*176; yy=gy+r_*236; m.photo(xx,yy,167,190,"FOTO"); m.t(xx,yy+206,"NOME DO PRODUTO",9,True); m.t(xx,yy+220,"R$ 000,00",9,False,"#555"); m.r(xx,yy+226,167,0.1)
y=gy+3*236+10; m.t(x0+16,y+10,"BENEFÍCIOS (3 cartões empilhados)",11,True)
for i in range(3): m.o.append(f'<rect x="{x0+16}" y="{y+24+i*58}" width="343" height="4" fill="#A63C32"/>'); m.bars(x0+16,y+40+i*58,200,2)
y+=210; m.photo(x0+16,y,343,170,"FOTO SOBRE"); m.bars(x0+16,y+190,343,4,10)
y+=250; m.t(x0+16,y,"FALE COM A GENTE",13,True)
for i in range(4): m.r(x0+16,y+14+i*46,343,32 if i<3 else 60)
m.btn(x0+16,y+212,343,34,"ENVIAR MENSAGEM",True); y+=270; m.r(x0,y,375,180,"#222","#222"); m.t(x0+16,y+30,"IRON STONE · Navegação · Categorias · Contato",9,True,"#fff"); m.t(x0+16,y+160,"© 2026 IRON STONE",9,False,"#bbb")
mh=y+200
# estado: menu aberto
x1=430; y1=30; hdr(m,x1,y1); m.t(x1,y1+92,"ESTADO: MENU ABERTO (botão ☰, aria-expanded)",10,True)
for i,n in enumerate(["Início","Produtos","Camisetas","Moletons","Calças","Acessórios","Novidades","Contato"]): m.r(x1,y1+100+i*40,375,40,"#fff","#999"); m.t(x1+16,y1+125+i*40,n.upper(),10)
# estado: sacola
x2=850; m.r(x2,30,375,600,"#fff","#222",2); m.t(x2+16,60,"SACOLA",14,True); m.btn(x2+290,40,70,28,"Fechar"); m.t(x2,24,"ESTADO: SACOLA (painel lateral)",10,True)
for i in range(2): yy=84+i*100; m.photo(x2+16,yy,60,76,"FOTO"); m.t(x2+90,yy+16,"Nome do produto",10,True); m.t(x2+90,yy+32,"R$ 000,00",9); m.r(x2+90,yy+44,28,24); m.t(x2+104,yy+60,"−",11,False,"#222","middle"); m.t(x2+130,yy+60,"1",10); m.r(x2+142,yy+44,28,24); m.t(x2+156,yy+60,"+",11,False,"#222","middle"); m.t(x2+186,yy+60,"Remover",9,False,"#A63C32")
m.t(x2+16,330,"Subtotal",11,True); m.t(x2+343,330,"R$ 000,00",11,True,"#222","end"); m.t(x2+16,350,"Faltam R$ X para o frete grátis.",9,False,"#555"); m.btn(x2+16,366,343,34,"FINALIZAR (DEMONSTRAÇÃO)",True)
# estado: login
m.r(x2,660,375,260,"#fff","#222",2); m.t(x2,654,"ESTADO: LOGIN (janela modal, demonstração)",10,True); m.t(x2+16,690,"ENTRAR NA IRON STONE",13,True)
for i,l in enumerate(["E-mail","Senha"]): m.t(x2+16,716+i*60,l.upper(),8.5,True); m.r(x2+16,722+i*60,343,28)
m.t(x2+16,838,"Esqueci minha senha",9,False,"#A63C32"); m.btn(x2+16,852,90,30,"Entrar",True); m.btn(x2+112,852,90,30,"Cancelar")
m.h=mh; open("wireframe-celular.svg","w").write(m.svg().replace('height="2300" viewBox="0 0 1240 2300"',f'height="{mh}" viewBox="0 0 1240 {mh}"'))
print("ok",d.h,mh)
