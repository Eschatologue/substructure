const content = global.substructure.content;
const sectors = global.substructure.sectors;

const node = (parent, contentType, requirements, objectives) => {
    const tnode = new TechTree.TechNode(parent, contentType, requirements ? contentType.researchRequirements() : requirements);
    let used = new ObjectSet();
    
    for(let o in objectives){
        if(used.add(o)) tnode.objectives.add(objectives);
    };
};

/* Substructure's tech tree */
node(TechTree.get(Blocks.message), content.blockPositionReader, true, Seq.with(new Objectives.SectorComplete(sectors.scrapyard)));

