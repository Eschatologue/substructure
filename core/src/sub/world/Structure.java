package sub.world;

import arc.*;
import mindustry.ctype.*;
import mindustry.world.*;

public class Structure extends Block{
    /** Whether or not this block is still work in progress. */
    public boolean inProgress = false;
    /** Whether or not this block is hidden from the core database. */
    public boolean isHidden = false;
    
    public Structure(String name){
        super(name);
    }
    
    @Override
    public void init(){
        super.init();
        
        if(inProgress){
            description = Core.bundle.get("excuse-2") + Core.bundle.get(getContentType() + "." + this.name + ".description");
        }
    }
    
    public boolean isHidden(){
        return isHidden;
    }
}
