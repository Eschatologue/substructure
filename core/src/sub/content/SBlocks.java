package sub.content;

import mindustry.*;
import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.gen.*;
import mindustry.type.*;
import mindustry.world.*;
import mindustry.world.blocks.*;
import mindustry.world.blocks.distribution.*;
import mindustry.world.blocks.environment.*;
import mindustry.world.meta.*;

import static mindustry.type.ItemStack.*;

public class SBlocks implements ContentList{
    public static Block
    
    //nothing.
    h;
    
    @Override
    public void load(){
        h = new Router("h"){{
            requirements(Category.distribution, BuildVisibility.shown, with(Items.copper, 4, Items.silicon, 6));
        }};
    }
}
