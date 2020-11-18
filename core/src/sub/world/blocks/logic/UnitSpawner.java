package sub.world.blocks.logic;

import arc.graphics.*;
import arc.graphics.g2d.*;
import arc.math.*;
import arc.scene.ui.layout.*;
import arc.util.*;
import arc.util.io.*;
import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.game.*;
import mindustry.gen.*;
import mindustry.graphics.*;
import mindustry.type.*;
import mindustry.ui.*;
import mindustry.ui.dialogs.*;
import sub.world.*;

import static mindustry.Vars.*;

public class UnitSpawner extends Structure{
    
    public UnitSpawner(String name){
        super(name);
        
        configurable = true;
        update = true;
    }
    
    public class UnitSpawnerBuild extends Building{
        public int unitf = UnitTypes.dagger.id;
        public int teamf;
        
        public int unitX = (int) x;
        public int unitY = (int) y;
        
        public void placed(){
            super.placed();
            
            teamf = team.id;
            resetPos();
        }
        
        @Override
        public void draw(){
            super.draw();
            
            Draw.alpha(0.75f);
            Draw.mixcol(teamf().color.cpy().mul(1f + Mathf.absin(Time.time() / 2f, 1f, 0.035f)), 1f);
            Draw.rect(unitf().icon(Cicon.full), this.unitX, this.unitY);
            Draw.reset();
        }
        
        public void buildConfiguration(Table table){
            table.button(Icon.fileText, () -> {
                unitDialog();
            }).size(40f);
            table.button(Icon.add, () -> {
                unitf().spawn(teamf(), this.unitX, this.unitY);
            }).size(40f);
        }
        
        public void unitDialog(){
            BaseDialog dialog = new BaseDialog("@dialog.name.unit-config");
            Table cont = dialog.cont;
            
            cont.table(t -> {
                t.top().margin(6f);
                t.add("@dialog.title.select-unit").color(Pal.accent).growX().center();
                t.row();
                t.image().color(Pal.accent).height(3f).pad(4f).fillX();
            }).width(800).center().row();
            
            cont.pane(p -> {
                int ru = 0;
                UnitType[] units = content.units().toArray(UnitType.class);
                
                for(UnitType unit : units){
                    p.button(b -> {
                        b.left();
                        b.image(unit.icon(Cicon.medium)).padRight(2).size(40f);
                        b.add(unit.localizedName);
                    }, () -> {
                        unitf(unit.id);
                    }).margin(12f).fillX();
                    
                    if(++ru % 3 == 0) p.row();
                };
            }).width(800f).height(540f).top().center().row();
            
            cont.table(i -> {
                i.table(t -> {
                    t.button("@dialog.title.select-team", Icon.modeSurvival, () -> {
                        teamDialog();
                    }).width(220f).pad(4f).growY();

                    t.button("@dialog.title.select-position", Icon.grid, () -> {
                        posDialog();
                    }).width(220f).pad(4f).growY();
                });
            }).width(360f).bottom().center();
            
            dialog.addCloseButton();
            dialog.show();
        }
        
        public void teamDialog(){
            BaseDialog dialog = new BaseDialog("$@dialog.title.select-team");
            Table cont = dialog.cont;

            cont.table(t -> {
                t.top().margin(6f);
                t.add("@dialog.info.base-teams").color(Pal.accent).growX();
                t.row();
                t.image().color(Pal.accent).height(3).pad(4).fillX();
            }).width(320f).center().row();
            
            cont.pane(p -> {
                int rt = 0;
                Team[] teams = Team.baseTeams;
                
                for(Team team : teams){                    
                    addTeamButton(p, team);
                    if(++rt % 3 == 0) p.row();
                }
            }).width(320f).center().row();
            
            cont.table(t -> {
                t.top().margin(6);
                t.add("@dialog.info.all-teams").color(Pal.accent).growX();
                t.row();
                t.image().color(Pal.accent).height(3).pad(4).fillX();
            }).width(320f).center().row();
            
            cont.pane(p -> {
                int rt = 0;
                Team[] teams = Team.all;
                
                for(Team team : teams){
                    addTeamButton(p, team);
                    if(++rt % 3 == 0) p.row();
                }
            }).width(320f).height(220f).center().row();
            
            cont.table(t -> {
                t.top().margin(6f);
                t.add("@dialog.short.others").color(Pal.accent).growX();
                t.row();
                t.image().color(Pal.accent).height(3).pad(4).fillX();
            }).width(320f).center().row();
            
            cont.table(t -> {
                t.button("@dialog.info.reset-team", () -> {
                    teamf(team.id);
                }).height(54f).pad(4f).growX().row();
                
                t.button("@dialog.info.set-team-id", () -> {
                    ui.showTextInput("", "@dialog.short.set-id", 8, String.valueOf(teamf().id), true, t2 -> {
                        int team = Integer.valueOf(t2);
                        
                        if(Team.get(team) != null){
                            teamf(team);
                        }else{
                            ui.showErrorMessage("@dialog.short.invalid-id");
                        }
                    });
                }).height(54f).pad(4f).growX();
            }).width(300f);
            
            dialog.addCloseButton();
            dialog.show();
        }
        
        public void posDialog(){
            BaseDialog dialog = new BaseDialog("@dialog.title.select-position");
            Table cont = dialog.cont;
            
            cont.table(t -> {
                t.button("@dialog.info.reset-position", () -> {
                    resetPos();
                }).height(54f).pad(4f).growX();
            }).width(300f).center().row();
            
            cont.table(t -> {
                t.top().margin(6f);
                t.add("@dialog.info.custom-position").color(Pal.accent).growX();
                t.row();
                t.image().color(Pal.accent).height(3).pad(4).fillX();
            }).width(320f).center().row();
            
            cont.table(t -> {
                int worldX = world.width();
                int worldY = world.height();
                
                t.button("@dialog.short.set-x", () -> {
                    ui.showTextInput("", "X:", 4, String.valueOf((this.unitX / tilesize)), true, x -> {
                        int tx = Integer.parseInt(x);
                    
                        if(tx <= worldX){
                            unitX(tx * tilesize);
                        }else{
                            ui.showInfo("@dialog.error.invalid-pos");
                        }
                    });
                }).growX().height(54f).pad(4f).row();
                
                t.button("@dialog.short.set-y", () -> {
                    ui.showTextInput("", "Y:", 4, String.valueOf((this.unitY / tilesize)), true, y -> {
                        int ty = Integer.parseInt(y);
                        
                        if(ty <= worldY){
                            unitY(ty * tilesize);
                        }else{
                            ui.showInfo("@dialog.error.invalid-pos");
                        }
                    });
                }).height(54f).pad(4f).growX();
            }).width(300f).center();
            
            dialog.addCloseButton();
            dialog.show();
        }
        
        public void addTeamButton(Table p, Team team){
            p.button(b -> {
                b.left();
                b.image().color(team.color).size(40f).pad(2f);
            }, () -> {
                teamf(team.id);
            }).pad(2f);
        }
        
        public void resetPos(){
            unitX((int) x);
            unitY((int) y);
        }
        
        public void write(Writes write){
            super.write(write);
            
            write.i(this.unitf);
            write.i(this.teamf);
            
            write.i(this.unitX);
            write.i(this.unitY);
        }
        
        public void read(Reads read){
            super.read(read);
            
            this.unitf = read.i();
            this.teamf = read.i();
            
            this.unitX = read.i();
            this.unitY = read.i();
        }
        
        public UnitType unitf(){
            return content.getByID(ContentType.unit, this.unitf);
        }
        
        public void unitf(int id){
            this.unitf = id;
        }
        
        public Team teamf(){
            return Team.get(this.teamf);
        }
        
        public void teamf(int id){
            this.teamf = id;
        }
        
        public int unitX(){
            return this.unitX;
        }
        
        public void unitX(int pos){
            this.unitX = pos;
        }
        
        public int unitY(){
            return this.unitY;
        }
        
        public void unitY(int pos){
            this.unitY = pos;
        }
    }
}
