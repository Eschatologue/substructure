/*
    Stolen from Anuken/Mindustry.
    See https://github.com/Anuken/Mindustry/blob/master/tools/src/mindustry/tools/Generators.java
*/

package sub.tools;

import arc.*;
import arc.files.*;
import arc.func.*;
import arc.graphics.*;
import arc.graphics.g2d.*;
import arc.graphics.g2d.TextureAtlas.*;
import arc.math.*;
import arc.math.geom.*;
import arc.struct.*;
import arc.util.*;
import arc.util.noise.*;
import mindustry.ctype.*;
import mindustry.game.*;
import mindustry.gen.*;
import mindustry.graphics.*;
import mindustry.type.*;
import mindustry.ui.*;
import mindustry.world.meta.*;
import sub.tools.*;

import static mindustry.Vars.*;

public class Generators{
    static final Cicon logicIcon = Cicon.medium;

    public static void generate(){
        //I don't even need any of this at the moment.
        
        ImagePacker.generate("unit-icons", () -> content.units().each(type -> {
            if(type.isHidden()) return; //hidden units don't generate

            ObjectSet<String> outlined = new ObjectSet<>();

            try{
                type.load();
                type.init();

                Color outc = Pal.darkerMetal;
                Func<Image, Image> outline = i -> i.outline(3, outc);
                Func<TextureRegion, String> pName = r -> ((AtlasRegion)r).name.replaceFirst("substructure-", "");
                Cons<TextureRegion> outliner = t -> {
                    if(t != null && t.found()){
                        ImagePacker.replace(t, outline.get(ImagePacker.get(pName.get(t))));
                    }
                };

                for(Weapon weapon : type.weapons){
                    String pname = weapon.name.replaceFirst("substructure-", "");
                    
                    if(outlined.add(pname) && ImagePacker.has(pname)){
                        outline.get(ImagePacker.get(weapon.name)).save(pname + "-outline");
                    }
                }

                outliner.get(type.jointRegion);
                outliner.get(type.footRegion);
                outliner.get(type.legBaseRegion);
                outliner.get(type.baseJointRegion);
                if(type.constructor.get() instanceof Legsc) outliner.get(type.legRegion);

                String pname = pName.get(type.region);

                Image outlineImage = outline.get(ImagePacker.get(pname));
                outlineImage.save(pname + "-outline");
                
                Image region = ImagePacker.get(pname);
                
                Image image = new Image(region.width, region.height);
                image.draw(region);
                image.draw(outlineImage);

                //draw mech parts
                if(type.constructor.get() instanceof Mechc){
                    Image base = ImagePacker.get(pName.get(type.baseRegion));
                    Image leg = ImagePacker.get(pName.get(type.legRegion));
                    
                    image.drawCenter(base);
                    image.drawCenter(leg);
                    image.drawCenter(leg, true, false);
                    
                    image.draw(region);
                    image.draw(outlineImage);
                }

                //draw outlines
                for(Weapon weapon : type.weapons){
                    weapon.load();

                    image.draw(outline.get(ImagePacker.get(weapon.region)),
                    (int)(weapon.x / Draw.scl + image.width / 2f - weapon.region.width / 2f),
                    (int)(-weapon.y / Draw.scl + image.height / 2f - weapon.region.height / 2f),
                    weapon.flipSprite, false);
                }

                //draw base region on top to mask weapons
                image.draw(region);
                image.draw(outlineImage);

                Image baseCell = ImagePacker.get(type.cellRegion);
                Image cell = new Image(type.cellRegion.width, type.cellRegion.height);
                cell.each((x, y) -> cell.draw(x, y, baseCell.getColor(x, y).mul(Color.valueOf("ffa665"))));

                image.draw(cell, image.width / 2 - cell.width / 2, image.height / 2 - cell.height / 2);

                for(Weapon weapon : type.weapons){
                    weapon.load();
                    
                    Image weaponImage = ImagePacker.get(weapon.name.replaceFirst("substructure-", ""));

                    image.draw(weapon.top ? outline.get(weaponImage) : weaponImage,
                    (int)(weapon.x / Draw.scl + image.width / 2f - weapon.region.width / 2f),
                    (int)(-weapon.y / Draw.scl + image.height / 2f - weapon.region.height / 2f),
                    weapon.flipSprite, false);
                }

                image.save(pname + "-full");

                for(Cicon icon : Cicon.scaled){
                    Vec2 size = Scaling.fit.apply(image.width, image.height, icon.size, icon.size);
                    Image scaled = new Image((int)size.x, (int)size.y);

                    scaled.drawScaled(image);
                    scaled.save("ui/" + pname + "-" + icon.name());

                    if(icon == logicIcon){
                        scaled.save(type.name + "-icon-logic");
                    }
                }

            }catch(IllegalArgumentException e){
                Log.err("WARNING: Skipping unit @: @", type.name, e.getMessage());
            }
        }));
    }
}
