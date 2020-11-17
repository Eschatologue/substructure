/*
    Stolen from Anuken/Mindustry.
    See https://github.com/Anuken/Mindustry/blob/master/tools/src/mindustry/tools/ImagePacker.java
*/
  
package sub.tools;

import arc.*;
import arc.files.*;
import arc.graphics.g2d.*;
import arc.graphics.g2d.TextureAtlas.*;
import arc.struct.*;
import arc.util.*;
import arc.util.Log.*;
import arc.util.io.*;
import mindustry.*;
import mindustry.content.*;
import mindustry.core.*;
import mindustry.ctype.*;
import mindustry.type.*;
import mindustry.world.*;
import mindustry.world.blocks.*;

import javax.imageio.*;
import java.awt.image.*;
import java.io.*;

public class ImagePacker{
    static ObjectMap<String, TextureRegion> regionCache = new ObjectMap<>();
    static ObjectMap<String, BufferedImage> imageCache = new ObjectMap<>();

    public static void main(String[] args) throws Exception{
        Vars.headless = true;

        Vars.content = new ContentLoader();
        Vars.content.createBaseContent();
        Log.logger = new DefaultLogHandler();

        Fi.get("./sprites").walk(path -> {
            if(!path.extEquals("png")) return;

            path.copyTo(Fi.get("./sprites-gen"));
        });

        Fi.get("./assets/sprites").walk(path -> {
            if(!path.extEquals("png")) return;

            String fname = path.nameWithoutExtension();

            try{
                BufferedImage image = ImageIO.read(path.file());

                if(image == null) throw new IOException("image " + path.absolutePath() + " is null for terrible reasons.");
                GenRegion region = new GenRegion(fname, path){{
                    width = image.getWidth();
                    height = image.getHeight();
                    u2 = v2 = 1f;
                    u = v = 0f;
                }};

                regionCache.put(fname, region);
                imageCache.put(fname, image);
            }catch(IOException e){
                throw new RuntimeException(e);
            }
        });

        Core.atlas = new TextureAtlas(){
            @Override
            public AtlasRegion find(String name){
                if(!regionCache.containsKey(name)){
                    GenRegion region = new GenRegion(name, null);
                    region.invalid = true;
                    return region;
                }
                return (AtlasRegion)regionCache.get(name);
            }

            @Override
            public AtlasRegion find(String name, TextureRegion def){
                if(!regionCache.containsKey(name)){
                    return (AtlasRegion)def;
                }
                return (AtlasRegion)regionCache.get(name);
            }

            @Override
            public AtlasRegion find(String name, String def){
                if(!regionCache.containsKey(name)){
                    return (AtlasRegion)regionCache.get(def);
                }
                return (AtlasRegion)regionCache.get(name);
            }

            @Override
            public boolean has(String s){
                return regionCache.containsKey(s);
            }
        };
    }

    static void generate(String name, Runnable run){
        Time.mark();
        run.run();
        Log.info("&ly[Generator]&lc Time to generate &lm@&lc: &lg@&lcms", name, Time.elapsed());
    }

    static BufferedImage buf(TextureRegion region){
        return imageCache.get(((AtlasRegion)region).name.replaceFirst("substructure-", ""));
    }

    static Image create(int width, int height){
        return new Image(width, height);
    }

    static boolean has(String name){
        return Core.atlas.has(name);
    }
    
    static boolean has(TextureRegion region){
        return has(((AtlasRegion)region).name.replaceFirst("substructure-", ""));
    }

    static Image get(String name){
        return get(Core.atlas.find(name));
    }

    static Image get(TextureRegion region){
        GenRegion.validate(region);

        return new Image(imageCache.get(((AtlasRegion)region).name.replaceFirst("substructure-", "")));
    }

    static void replace(String name, Image image){
        image.save(name);
        ((GenRegion)Core.atlas.find(name)).path.delete();
    }

    static void replace(TextureRegion region, Image image){
        replace(((GenRegion)region).name, image);
    }

    static void err(String message, Object... args){
        throw new IllegalArgumentException(Strings.format(message, args));
    }

    static class GenRegion extends AtlasRegion{
        boolean invalid;
        Fi path;

        GenRegion(String name, Fi path){
            if(name == null) throw new IllegalArgumentException("name is null");
            this.name = name;
            this.path = path;
        }

        @Override
        public boolean found(){
            return !invalid;
        }

        static void validate(TextureRegion region){
            if(((GenRegion)region).invalid){
                ImagePacker.err("Region does not exist: @", ((GenRegion)region).name);
            }
        }
    }
}
