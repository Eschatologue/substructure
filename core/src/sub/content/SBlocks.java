package sub.content;

import arc.*;
import arc.graphics.*;
import arc.graphics.g2d.*;
import arc.math.*;
import arc.util.*;
import mindustry.*;
import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.entities.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;
import mindustry.graphics.*;
import mindustry.type.*;
import mindustry.world.*;
import mindustry.world.blocks.*;
import mindustry.world.blocks.defense.turrets.*;
import mindustry.world.blocks.distribution.*;
import mindustry.world.blocks.environment.*;
import mindustry.world.meta.*;
import sub.content.*;
import sub.world.blocks.defense.turrets.*;
import sub.world.blocks.logic.*;

import static mindustry.type.ItemStack.*;

public class SBlocks implements ContentList{
    public static Block
    
    //turrets
    echo,
    
    //utilities
    h, blockConfigurer, unitSpawner;
    
    @Override
    public void load(){
        //region turrets
        
        echo = new LaserTurretf("echo"){{
            requirements(Category.turret, BuildVisibility.shown, with(Items.copper, 900, Items.lead, 750, Items.graphite, 350, Items.surgeAlloy, 300, Items.silicon, 300));
            health = 220 * size * size;
            size = 5;
            reloadTime = 280f;
            range = 240f;
            chargeTime = 180f;
            chargeMaxDelay = 160f;
            chargeEffect = SFx.echoBeamCharge;
            chargeEffects = 9;
            chargeBeginEffect = SFx.echoBeamChargeBegin;
            shootEffect = SFx.echoBeamShoot;
            shootSound = Sounds.laserbig;
            loopSound = Sounds.beam;
            loopSoundVolume = 2f;
            powerUse = 19f;
            shootType = new ContinuousLaserBulletType(85){
                {
                    length = 230f;
                    colors = new Color[]{Color.valueOf("c1c3d4"), Color.valueOf("dcdde3"), Color.valueOf("f4f4f4"), Color.white};
                    strokes = new float[]{1.7f, 1.3f, 1.1f, 0.3f};
                }
                
                @Override
                public void draw(Bullet b){
                    float realLength = Damage.findLaserLength(b, length);
                    float fout = Mathf.clamp(b.time > b.lifetime - fadeTime ? 1f - (b.time - (lifetime - fadeTime)) / fadeTime : 1f);
                    float baseLen = realLength * fout;

                    Lines.lineAngle(b.x, b.y, b.rotation(), baseLen);
                    for(int s = 0; s < colors.length; s++){
                        Draw.color(Tmp.c1.set(colors[s]).mul(1f + Mathf.absin(Time.time, 1f, 0.1f)));
                        for(int i = 0; i < tscales.length; i++){
                            Tmp.v1.trns(b.rotation() + 180f, (lenscales[i] - 1f) * spaceMag);
                            Lines.stroke((width + Mathf.absin(Time.time, oscScl, oscMag)) * fout * strokes[s] * tscales[i]);
                            Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rotation(), baseLen * lenscales[i], false);
                        }
                    }

                    Tmp.v1.trns(b.rotation(), baseLen * 1.1f);

                    Drawf.light(b.team, b.x, b.y, b.x + Tmp.v1.x, b.y + Tmp.v1.y, lightStroke, lightColor, 0.7f);
                    Draw.reset();
                }
            };
            shootDuration = 180f;
        }};
        
        //end region
        //region utilities
        
        h = new Router("h"){{
            requirements(Category.distribution, BuildVisibility.shown, with(Items.copper, 4, Items.silicon, 6));
            buildCostMultiplier = 4f;
        }};
        
        blockConfigurer = new BlockConfigurer("block-configurer"){{
            requirements(Category.logic, BuildVisibility.sandboxOnly, with(Items.copper, 2, Items.lead, 4));
            rotate = true;
            inProgress = true;
        }};
        
        unitSpawner = new UnitSpawner("unit-spawner"){{
            requirements(Category.logic, BuildVisibility.sandboxOnly, with(Items.copper, 2, Items.lead, 4));
            solid = false;
        }};
        
        //end region
    }
}
