package sub.world.blocks.logic;

import arc.*;
import arc.graphics.g2d.*;
import arc.scene.ui.layout.*;
import arc.util.*;
import arc.util.io.*;
import mindustry.gen.*;
import mindustry.graphics.*;
import mindustry.ui.*;
import mindustry.ui.dialogs.*;
import mindustry.world.*;
import sub.world.*;

import static mindustry.Vars.*;

//TODO being able to edit most of the thing (and modify using logic), being able to modify the tile, get tile from anywhere, dialog stuff, and actually finish it.
public class BlockConfigurer extends Structure{
    public TextureRegion arrowRegion;
    
    public BlockConfigurer(String name){
        super(name);
        
        configurable = true;
        update = true;
        sync = true;
    }
    
    public void load(){
        super.load();
        
        arrowRegion = Core.atlas.find(name + "-arrow");
    }
    
    public class BlockConfigurerBuild extends Building{
        public Tile tilef;
        public short tx;
        public short ty;
        
        @Override
        public void draw(){
            Draw.rect(region, x, y);
            Draw.rect(arrowRegion, x, y, rotate ? rotdeg() : 0);
        }
        
        public void placed(){
            super.placed();
            
            tilef(tile.nearby(rotation));
            tx(tilef.x);
            ty(tilef.y);
        }
        
        public void buildConfiguration(Table table){
            table.button(Icon.pencil, () -> {
                if(tilef.bc() != null) configDialog();
            }).size(40f);
        }
        
        public void configDialog(){
            BaseDialog dialog = new BaseDialog("@dialog.name.block-config");
            Table cont = dialog.cont;
            
            cont.table(t -> {
                t.top();
                t.image(tilef.block().icon(Cicon.xlarge)).size(48f).scaling(Scaling.fit);
                t.add(tilef.block().localizedName).padLeft(5f);
            }).row();
            
            cont.table(t -> {
                t.top();
                t.add("[lightgray]X:[] " + String.valueOf(tilef.bc().x) + " [lightgray]Y:[] " + String.valueOf(tilef.bc().y)).padTop(10f).growX();
                t.row();
                t.add("[lightgray]" + Core.bundle.get("stat.health") + "[]: " + tilef.bc().health).growX();
            });
            
            dialog.addCloseButton();
            dialog.show();
        }
        
        public void write(Writes write){
            super.write(write);
            
            write.s(tx);
            write.s(ty);
        }
        
        public void read(Reads read){
            super.read(read);
            
            tx = read.s();
            ty = read.s();
        }
        
        public Tile tilef(){
            return world.tile((int) tx, (int) ty);
        }
        
        public void tilef(Tile tilef){
            this.tilef = tilef;
        }
        
        public short tx(){
            return tx;
        }
        
        public void tx(short tx){
            this.tx = tx;
        }
        
        public short ty(){
            return ty;
        }
        
        public void ty(short ty){
            this.ty = ty;
        }
    }
}