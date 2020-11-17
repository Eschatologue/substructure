package sub;

import arc.*;
import arc.util.*;
import mindustry.*;
import mindustry.ctype.*;
import mindustry.game.EventType.*;
import mindustry.mod.*;

import sub.content.*;

public class Substructure extends Mod{
    private final ContentList[] contents = {
        new SBlocks()
    };
    public boolean isDebug = false;
    
    public Substructure(){
        Events.on(ClientLoadEvent.class, e -> {
            Time.runTask(5f, () -> {
                Log.info(Core.bundle.get("startup"));
            });
        });
    }
    
    @Override
    public void init(){
        Vars.enableConsole = true;
    }
    
    @Override
    public void loadContent(){
        for(ContentList content : contents){
            content.load();
            Log.info("Loaded content: @", content.getClass().getSimpleName());
        }
    }
}
