const content = global.substructure.content;
const sectors = global.substructure.sectors;

/**
 * Node.
 *
 * @property {TechTree}             parent          - The parent of the current node.
 * @property {UnlockableContent}    contentType     - Content that is in this node.
 * @property {ItemStack}            requirements    - The research requirements required to unlock this node, will use the default if set to null.
 * @property {Seq}                  objectives      - A sequence of Objectives required to unlock this node. Can be null.
 */
const node = (parent, contentType, requirements, objectives) => {
    const tnode = new TechTree.TechNode(parent, contentType, requirements != null ? requirements : contentType.researchRequirements());
    let used = new ObjectSet();
    
    if(objectives != null){
        tnode.objectives.addAll(objectives);
    };
};

/* Substructure's tech tree */
node(TechTree.get(Blocks.message), content.blockPositionReader, null, Seq.with(new Objectives.SectorComplete(sectors.scrapyard)));