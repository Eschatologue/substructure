package sub.content;

import arc.*;
import arc.graphics.*;
import arc.graphics.g2d.*;
import arc.math.*;
import arc.math.geom.*;
import mindustry.entities.*;

import static arc.graphics.g2d.Draw.*;
import static arc.graphics.g2d.Lines.*;
import static arc.math.Angles.*;
import static mindustry.Vars.*;

public class SFx{
    public static final Effect
    
    echoBeamCharge = new Effect(60f, e -> {
        alpha(e.fout());
        color(Color.valueOf("f4f4f4"));
        
        randLenVectors(e.id, 8, e.fout() * 60f, 360f, 5f * tilesize, (x, y) -> {
            Fill.circle(e.x + x, e.y + y, e.fout() * 5f);
            Fill.circle(e.x + x * 1.2f, e.y + x * 1.2f, e.fout() * 2f);
        });
    }),
    
    echoBeamChargeBegin = new Effect(190f, e -> {
        color(Color.valueOf("f4f4f4"));
        
        Fill.circle(e.x, e.y, e.fin() * 12f);
    }),
    
    echoBeamShoot = new Effect(23f, e -> {
        color(Color.valueOf("f4f4f4"), Color.white, e.fin());
        
        for(int i = 0; i < 3; i++){
            randLenVectors(e.id, 8, e.finpow() * 40f, e.rotation, 10f, (x2, y2) -> {
                Fill.circle(e.x + x2, e.y + y2, 0.65f + e.fout() * 1.5f);
            });
        }
    });
}