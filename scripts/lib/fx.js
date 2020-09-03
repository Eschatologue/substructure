const telePurple = [Color.valueOf("a387ea"), Color.valueOf("9c88c3"), Color.valueOf("8a73c6")];

module.exports = { //Unnecessary custom effects put together in one file
    bulletCircleIn: new Effect(9, e => { //Bullet going in teleport effect
        Draw.color(telePurple[0], telePurple[2], e.fin());
        Lines.stroke(e.fout() * 1.4);
        Lines.circle(e.x, e.y, e.fout() * 6);
    }),

    bulletCircleOut: new Effect(9, e => { //Bullet going out teleport effect
        Draw.color(telePurple[0], telePurple[2], e.fin());
        Lines.stroke(e.fout() * 1.4);
        Lines.circle(e.x, e.y, e.fin() * 6);
    }),

    unitCircleIn: new Effect(28, e => { //Unit (and player) going in teleport effect
        Draw.color(telePurple[0], telePurple[2], e.fin());
        Lines.stroke(e.fout() * 3.6);
        Lines.circle(e.x, e.y, e.fout() * 20);
        Lines.circle(e.x, e.y, e.fout() * 12);
    }),

    unitCircleOut: new Effect(28, e => { //Unit (and player) going out teleport effect
        Draw.color(telePurple[0], telePurple[2], e.fin());
        Lines.stroke(e.fout() * 3.6);
        Lines.circle(e.x, e.y, e.fin() * 20);
        Lines.circle(e.x, e.y, e.fin() * 12);
    }),

	chargeLaserHit: new Effect(12, e => { //Charge turret laser hit effect
		Draw.color(Pal.meltdownHit);
		Lines.stroke(e.fout() * 1.5);

		Angles.randLenVectors(e.id, 8, e.finpow() * 17, e.rotation, 360, new Floatc2({get: function(x, y){
			var ang = Mathf.angle(x, y);
			Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 4 + 1);
		}}));
	}),

	chargeLaserShoot: new Effect(21, e => { //Charge turret shoot effect
  	     Draw.color(Pal.meltdownHit);

         for(var i = 0; i < 2; i++){
             var l = Mathf.signs[i];
  	         Drawf.tri(e.x, e.y, 4 * e.fout(), 29, e.rotation + 67 * l);
         }
	}),

    chargeLaserShootSmoke: new Effect(26, e => { //Charge turret laser smoke effect
        Draw.color(Pal.meltdownHit);

        Angles.randLenVectors(e.id, 7, 80, e.rotation, 0, new Floatc2({get: function(x, y){
            Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), e.fout() * 9);
        }}));
    }),

	chargeLaserCharge: new Effect(38, e => { //Charge turret charging effect
		Draw.color(Pal.meltdownHit);

		Angles.randLenVectors(e.id, 2, 1 + 20 * e.fout(), e.rotation, 120, new Floatc2({get: function(x, y){
			Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), e.fslope() * 3 + 1);
     	}}));
	}),

	chargeLaserChargeBegin: new Effect(71, e => { //Charge turret begin charging effect
		Draw.color(Pal.meltdownHit);
		Fill.circle(e.x, e.y, e.fin() * 3);

		Draw.color();
		Fill.circle(e.x, e.y, e.fin() * 2);
	})
}
