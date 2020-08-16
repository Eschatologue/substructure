module.exports = {
  bulletCircleIn: newEffect(9, e => {
    Draw.color(Pal.bulletYellow, Pal.bulletYellowBack, e.fin());
    Lines.stroke(e.fout() * 1.4);
    Lines.circle(e.x, e.y, e.fout() * 6);
  }),

  bulletCircleOut: newEffect(9, e => {
    Draw.color(Pal.bulletYellow, Pal.bulletYellowBack, e.fin());
    Lines.stroke(e.fout() * 1.4);
    Lines.circle(e.x, e.y, e.fout() * 6);
  })
}
