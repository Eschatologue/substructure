const telePurple = [Color.valueOf("a387ea"), Color.valueOf("9c88c3"), Color.valueOf("8a73c6")];

module.exports = {
  bulletCircleIn: newEffect(9, e => { //Bullet going in teleport effect
    Draw.color(telePurple[0], telePurple[2], e.fin());
    Lines.stroke(e.fout() * 1.4);
    Lines.circle(e.x, e.y, e.fout() * 6);
  }),

  bulletCircleOut: newEffect(9, e => { //Bullet going out teleport effect
    Draw.color(telePurple[0], telePurple[2], e.fin());
    Lines.stroke(e.fout() * 1.4);
    Lines.circle(e.x, e.y, e.fin() * 6);
  }),

  unitCircleIn: newEffect(38, e => { //Unit (and player) going in teleport effect
    Draw.color(telePurple[0], telePurple[2], e.fin());
    Lines.stroke(e.fout() * 3.6);
    Lines.circle(e.x, e.y, e.fout() * 20);
    Lines.circle(e.x, e.y, e.fout() * 12);
  }),

  unitCircleOut: newEffect(38, e => { //Unit (and player) going out teleport effect
    Draw.color(telePurple[0], telePurple[2], e.fin());
    Lines.stroke(e.fout() * 3.6);
    Lines.circle(e.x, e.y, e.fin() * 20);
    Lines.circle(e.x, e.y, e.fin() * 12);
  })
}
