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
import sub.world.blocks.logic.*;

import static mindustry.type.ItemStack.*;

public class SBlocks implements ContentList{
    public static Block
    
    //utilities
    h, unitSpawner;
    
    @Override
    public void load(){
        //region utilities
        
        h = new Router("h"){{
            requirements(Category.distribution, BuildVisibility.shown, with(Items.copper, 4, Items.silicon, 6));
            buildCostMultiplier = 4f;
        }};
        
        unitSpawner = new UnitSpawner("unit-spawner"){{
            requirements(Category.logic, BuildVisibility.sandboxOnly, with(Items.copper, 2, Items.lead, 4));
            solid = false;
        }};
    }
}
